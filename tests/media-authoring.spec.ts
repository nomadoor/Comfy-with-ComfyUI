import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import sharp from "sharp";
import { test, expect } from "./support/test";

// Authoring flow: local preview of originals on the dev server, media:sync decisions, and video
// preparation. Uploads are replaced by an in-memory recorder; nothing reaches R2.

const lib = (name: string) => import(pathToFileURL(path.resolve("scripts", "lib", name)).href);
const NAME = "basic-workflows/example/example_workflow.png";

async function makeOriginals() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "media-originals-"));
  fs.mkdirSync(path.join(root, "basic-workflows", "example"), { recursive: true });
  const file = path.join(root, ...NAME.split("/"));
  const png = await sharp({ create: { width: 300, height: 120, channels: 3, background: "#335577" } }).png().toBuffer();
  fs.writeFileSync(file, png);
  return { root: fs.realpathSync(root), file };
}

test.describe("local preview", () => {
  test("unregistered or changed originals preview locally; unchanged registered media does not", async () => {
    const { localPreview, sourceHash } = await lib("media-local-preview.mjs");
    const { root, file } = await makeOriginals();

    expect(localPreview(root, NAME, undefined)).toMatchObject({
      url: `/__media-originals/${NAME}`, width: 300, height: 120, reason: "unregistered"
    });
    expect(localPreview(root, NAME, { key: "images/0000000000000000.webp", source: sourceHash(file) })).toBeNull();
    expect(localPreview(root, NAME, { key: "images/0000000000000000.webp", source: "ffffffffffffffff" })).toMatchObject({ reason: "changed" });
    // Legacy entries without `source` are treated as up to date.
    expect(localPreview(root, NAME, { key: "images/0000000000000000.webp" })).toBeNull();
    expect(localPreview(root, "basic-workflows/example/missing.png", undefined)).toBeNull();
    expect(localPreview("", NAME, undefined)).toBeNull();
  });

  test("symbolic links cannot escape the originals root; hashing reads in chunks", async () => {
    const { originalPath, sourceHash } = await lib("media-local-preview.mjs");
    const { root, file } = await makeOriginals();
    const outside = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "media-outside-")), "secret.png");
    fs.writeFileSync(outside, "TOP SECRET");
    fs.symlinkSync(outside, path.join(root, "basic-workflows", "example", "leak.png"));
    expect(originalPath(root, "basic-workflows/example/leak.png")).toBe("");
    // A link that stays inside the root is still allowed.
    fs.symlinkSync(file, path.join(root, "basic-workflows", "example", "alias.png"));
    expect(originalPath(root, "basic-workflows/example/alias.png")).toBe(file);

    const large = path.join(root, "basic-workflows", "example", "large.mp4");
    fs.writeFileSync(large, crypto.randomBytes(3 * 1024 * 1024 + 123));
    expect(sourceHash(large)).toBe(crypto.createHash("sha256").update(fs.readFileSync(large)).digest("hex").slice(0, 16));
  });

  test("middleware serves originals with ranges and rejects invalid paths", async () => {
    const { createOriginalsMiddleware } = await lib("media-local-preview.mjs");
    const { root, file } = await makeOriginals();
    const middleware = createOriginalsMiddleware(() => root);
    const server = http.createServer((req, res) => middleware(req, res, () => { res.statusCode = 418; res.end(); }));
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
    try {
      const full = await fetch(`${base}/__media-originals/${NAME}`);
      expect(full.status).toBe(200);
      expect(full.headers.get("content-type")).toBe("image/png");
      expect(Buffer.from(await full.arrayBuffer()).equals(fs.readFileSync(file))).toBe(true);

      const partial = await fetch(`${base}/__media-originals/${NAME}`, { headers: { Range: "bytes=0-9" } });
      expect(partial.status).toBe(206);
      expect(partial.headers.get("content-range")).toBe(`bytes 0-9/${fs.statSync(file).size}`);

      // Send raw paths (fetch would normalize `..` before the request reaches the middleware).
      const rawStatus = (rawPath: string) =>
        new Promise<number>((resolve, reject) => {
          const req = http.request(`${base}/`, { path: rawPath }, (res) => {
            res.resume();
            resolve(res.statusCode || 0);
          });
          req.on("error", reject);
          req.end();
        });
      for (const bad of ["../../etc/passwd", "basic-workflows/example/../../../x.png", "basic-workflows/example/..%2F..%2Fx.png", "basic-workflows/example/Example.png"]) {
        expect(await rawStatus(`/__media-originals/${bad}`), bad).toBe(404);
      }
      expect((await fetch(`${base}/other`)).status).toBe(418);
    } finally {
      server.close();
    }
  });
});

test.describe("media:sync", () => {
  test("adds, skips, updates source only, and replaces based on the original", async () => {
    const { syncMedia } = await lib("media-sync.mjs");
    const { root, file } = await makeOriginals();
    const references = [{ file: "src/content/ja/example.md", ref: `/media/${NAME}`, mode: "image" }];
    const manifest: Record<string, any> = {};
    const uploads: string[] = [];
    const run = (options = {}) =>
      syncMedia({ manifest, references, root, upload: (key: string) => void uploads.push(key), save: () => {}, ...options });

    const dry = await run({ dryRun: true });
    expect(dry.results[0]).toMatchObject({ name: NAME, status: "added" });
    expect(uploads).toEqual([]);
    expect(manifest[NAME]).toBeUndefined();

    const added = await run();
    expect(added.errors).toEqual([]);
    expect(manifest[NAME]).toMatchObject({ type: "image/webp", width: 300, height: 120 });
    expect(manifest[NAME].key).toMatch(/^images\/[0-9a-f]{16}\.webp$/);
    expect(manifest[NAME].source).toMatch(/^[0-9a-f]{16}$/);
    expect(uploads).toEqual([manifest[NAME].key]);

    expect((await run()).results[0].status).toBe("unchanged");
    expect(uploads).toHaveLength(1);

    // Metadata-only change of the original (same pixels): same public object, no upload.
    const withText = Buffer.concat([fs.readFileSync(file).subarray(0, 33), Buffer.from([0, 0, 0, 4]), Buffer.from("tEXtabcd"), Buffer.from([0x3f, 0xd1, 0x9b, 0x77]), fs.readFileSync(file).subarray(33)]);
    fs.writeFileSync(file, withText);
    const sourceOnly = await run();
    expect(sourceOnly.errors).toEqual([]);
    expect(sourceOnly.results[0].status).toBe("source-updated");
    expect(uploads).toHaveLength(1);

    // New pixels: new key uploaded, old key reported.
    const previousKey = manifest[NAME].key;
    fs.writeFileSync(file, await sharp({ create: { width: 300, height: 120, channels: 3, background: "#aa2200" } }).png().toBuffer());
    const replaced = await run();
    expect(replaced.results[0]).toMatchObject({ status: "replaced", replacedKey: previousKey });
    expect(manifest[NAME].key).not.toBe(previousKey);
    expect(uploads).toHaveLength(2);
  });

  test("reports unregistered references without an original, and keeps registered ones", async () => {
    const { syncMedia } = await lib("media-sync.mjs");
    const { root } = await makeOriginals();
    const manifest: Record<string, any> = {
      "basic-workflows/example/registered.png": { key: "images/0123456789abcdef.webp", width: 1, height: 1, type: "image/webp", bytes: 1 }
    };
    const references = [
      { file: "a.md", ref: "/media/basic-workflows/example/registered.png" },
      { file: "b.md", ref: "/media/basic-workflows/example/not_placed.png" },
      { file: "c.md", ref: "/media/basic-workflows/example/Bad-Name.png" }
    ];
    const { results, errors } = await syncMedia({ manifest, references, root, upload: () => {}, save: () => {} });
    expect(results.find((item: any) => item.name.endsWith("registered.png")).status).toBe("kept");
    expect(errors.join("\n")).toContain("not_placed.png の原本がありません");
    expect(errors.join("\n")).toContain("Bad-Name.png");
  });
});

test.describe("staged references", () => {
  test("reads the git index, ignoring unstaged edits and untracked files", async () => {
    const repo = fs.mkdtempSync(path.join(os.tmpdir(), "media-staged-"));
    const git = (...args: string[]) => {
      const result = spawnSync("git", args, { cwd: repo, encoding: "utf8" });
      expect(result.status, result.stderr).toBe(0);
    };
    git("init", "-q");
    fs.mkdirSync(path.join(repo, "src", "content", "ja"), { recursive: true });
    const article = path.join(repo, "src", "content", "ja", "page.md");
    fs.writeFileSync(article, "![](/media/basic-workflows/example/staged.png){media=image}\n");
    git("add", "src/content/ja/page.md");
    // Unstaged edit removes the reference; an untracked draft adds another.
    fs.writeFileSync(article, "no media here\n");
    fs.writeFileSync(path.join(repo, "src", "content", "ja", "draft.md"), "![](/media/basic-workflows/example/untracked.png){media=image}\n");

    const script = `import(${JSON.stringify(pathToFileURL(path.resolve("scripts", "lib", "media-refs.mjs")).href)}).then((m) => console.log(JSON.stringify(m.stagedReferences())))`;
    const result = spawnSync("node", ["--input-type=module", "-e", script], { cwd: repo, encoding: "utf8" });
    expect(result.status, result.stderr).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual([
      { file: "src/content/ja/page.md", ref: "/media/basic-workflows/example/staged.png", mode: "image" }
    ]);
  });
});

test.describe("video preparation", () => {
  test("mp4 keeps streams, drops metadata, and yields a WebP poster", async () => {
    const { hasFfmpeg, prepareVideo, probe } = await lib("media-video.mjs");
    test.skip(!hasFfmpeg(), "ffmpeg is not installed");

    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "media-video-test-"));
    const input = path.join(dir, "input.mp4");
    const made = spawnSync("ffmpeg", [
      "-v", "error", "-y", "-i", path.resolve("tests", "fixtures", "media", "r2_video.mp4"), "-c", "copy",
      "-metadata", 'comment={"workflow":{"nodes":[]}}', "-metadata", "title=secret prompt", input
    ]);
    expect(made.status).toBe(0);
    expect(JSON.stringify(probe(input).format.tags)).toContain("workflow");

    const first = await prepareVideo(input);
    const second = await prepareVideo(input);
    expect(first.type).toBe("video/mp4");
    expect([first.width, first.height]).toEqual([32, 32]);
    expect(first.data.equals(second.data)).toBe(true);
    expect(first.data.toString("latin1")).not.toContain("workflow");
    expect(first.poster.type).toBe("image/webp");
    expect([first.poster.width, first.poster.height]).toEqual([32, 32]);

    // Per-stream metadata with user data is not carried over either.
    const streamTagged = path.join(dir, "stream-tagged.mp4");
    expect(spawnSync("ffmpeg", [
      "-v", "error", "-y", "-i", path.resolve("tests", "fixtures", "media", "r2_video.mp4"), "-c", "copy",
      "-metadata:s:v:0", "handler_name=C:/Users/me/secret handler", "-metadata:s:v:0", "language=jpn", streamTagged
    ]).status).toBe(0);
    const cleaned = await prepareVideo(streamTagged);
    const cleanedFile = path.join(dir, "stream-cleaned.mp4");
    fs.writeFileSync(cleanedFile, cleaned.data);
    const streamTags = probe(cleanedFile).streams[0].tags || {};
    expect(streamTags.handler_name).toBe("VideoHandler");
    expect(cleaned.data.includes(Buffer.from("secret handler"))).toBe(false);

    const output = path.join(dir, "output.mp4");
    fs.writeFileSync(output, first.data);
    const tags = probe(output).format.tags || {};
    expect(Object.keys(tags).every((tag) => ["major_brand", "minor_version", "compatible_brands"].includes(tag))).toBe(true);
  });
});

test.describe("media:sync videos", () => {
  test("keeps a logical-name poster without uploading the generated frame", async () => {
    const { hasFfmpeg } = await lib("media-video.mjs");
    test.skip(!hasFfmpeg(), "ffmpeg is not installed");
    const { syncMedia } = await lib("media-sync.mjs");
    const { root } = await makeOriginals();
    const name = "basic-workflows/example/example_clip.mp4";
    fs.copyFileSync(path.resolve("tests", "fixtures", "media", "r2_video.mp4"), path.join(root, ...name.split("/")));
    const references = [{ file: "a.md", ref: `/media/${name}` }];

    const generated: Record<string, any> = {};
    const generatedUploads: string[] = [];
    await syncMedia({ manifest: generated, references, root, upload: (key: string) => void generatedUploads.push(key), save: () => {} });
    expect(generated[name].poster).toMatchObject({ key: expect.stringMatching(/^images\/[0-9a-f]{16}\.webp$/) });
    expect(generatedUploads).toEqual([generated[name].key, generated[name].poster.key]);

    const chosen: Record<string, any> = {
      [name]: { key: "videos/0000000000000000.mp4", width: 32, height: 32, type: "video/mp4", bytes: 1, poster: NAME }
    };
    const chosenUploads: string[] = [];
    await syncMedia({ manifest: chosen, references, root, upload: (key: string) => void chosenUploads.push(key), save: () => {} });
    expect(chosen[name].poster).toBe(NAME);
    expect(chosenUploads).toEqual([chosen[name].key]);
  });
});
