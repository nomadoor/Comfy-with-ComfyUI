// Logical media names and R2 object keys.
//
// Markdown and data files reference R2 media as `/media/<logical name>`. The logical name is the
// path of the original file relative to COMFY_MEDIA_ORIGINALS (for example
// `flux-2-klein/001.png`). src/_data/media.json maps each logical name to an R2 object key
// (`images/<hash>.<ext>` or `videos/<hash>.mp4`); the public URL is `https://<media.host>/<key>`.

export const MEDIA_REF_PREFIX = "/media/";
export const FIXTURE_NAME_PREFIX = "fixtures/";

export const TYPE_BY_EXTENSION = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  mp4: "video/mp4"
};

const SEGMENT = /^[a-z0-9][a-z0-9._-]*$/;
const WINDOWS_RESERVED = /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/;
const KEY = /^(images|videos)\/[0-9a-f]{16}\.([a-z0-9]+)$/;

export function extensionOf(name = "") {
  return (String(name).match(/\.([^./]+)$/)?.[1] || "").toLowerCase();
}

/**
 * @param {string} name
 * @returns {string} An error message, or "" when the name is valid.
 */
export function validateLogicalName(name) {
  if (typeof name !== "string" || !name) return "logical name is empty";
  if (name !== name.toLowerCase()) return "logical name must be lowercase";
  if (name.startsWith("/") || name.endsWith("/")) return "logical name must not start or end with /";
  for (const segment of name.split("/")) {
    if (!segment) return "logical name must not contain empty segments (//)";
    if (!SEGMENT.test(segment)) return `invalid segment "${segment}" (use a-z, 0-9, ".", "_", "-"; must start with a-z or 0-9)`;
    if (segment.endsWith(".")) return `segment "${segment}" must not end with "."`;
    if (WINDOWS_RESERVED.test(segment)) return `segment "${segment}" is a reserved Windows name`;
  }
  if (!TYPE_BY_EXTENSION[extensionOf(name)]) {
    return `unsupported extension (use ${Object.keys(TYPE_BY_EXTENSION).join(", ")})`;
  }
  return "";
}

/** `/media/foo/bar.png` → `foo/bar.png`; anything else → null. */
export function logicalNameFromRef(ref) {
  return typeof ref === "string" && ref.startsWith(MEDIA_REF_PREFIX) ? ref.slice(MEDIA_REF_PREFIX.length) : null;
}

export function mediaRef(name) {
  return `${MEDIA_REF_PREFIX}${name}`;
}

export function keyFor(hash, extension, type) {
  const folder = String(type).startsWith("video/") ? "videos" : "images";
  return `${folder}/${hash}.${extension}`;
}

/**
 * @returns {string} An error message, or "" when the key matches the type.
 */
export function validateKey(key, type) {
  const match = typeof key === "string" ? key.match(KEY) : null;
  if (!match) return "key must be images/<16 hex>.<ext> or videos/<16 hex>.mp4";
  const [, folder, extension] = match;
  if (TYPE_BY_EXTENSION[extension] !== type) return `key extension .${extension} does not match type ${type}`;
  if ((folder === "videos") !== String(type).startsWith("video/")) return `${folder}/ does not match type ${type}`;
  return "";
}

export function publicUrl(host, key) {
  return `https://${host}/${key}`;
}
