import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import worker from "./index.js";

// GitHub and Turnstile are replaced by a fake fetch that records the issue the worker would open.
let issues;
let turnstileOk;
const realFetch = globalThis.fetch;

beforeEach(() => {
  issues = [];
  turnstileOk = true;
  globalThis.fetch = async (url, init = {}) => {
    if (String(url).includes("turnstile")) {
      return new Response(JSON.stringify({ success: turnstileOk }), { status: 200 });
    }
    issues.push(JSON.parse(init.body));
    return new Response(JSON.stringify({ html_url: "https://example.invalid/issue/1" }), { status: 201 });
  };
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

const ENV = {
  GITHUB_TOKEN: "token",
  GITHUB_OWNER: "owner",
  GITHUB_REPO: "repo",
  ALLOW_ORIGIN: "https://comfyui.nomadoor.net",
  TURNSTILE_SECRET: "secret"
};

let ipCounter = 0;
const post = (body, { origin = "https://comfyui.nomadoor.net", env = ENV } = {}) =>
  worker.fetch(
    new Request("https://worker.test/", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: origin, "cf-connecting-ip": `10.0.0.${++ipCounter}` },
      body: JSON.stringify({
        type: "report",
        message: "手順3のコマンドが古いバージョンのままになっています。",
        url: "https://comfyui.nomadoor.net/ja/begin-with/setup/",
        turnstileToken: "token",
        ...body
      })
    }),
    env
  );

test("an unknown language becomes lang:ja instead of a new label", async () => {
  const response = await post({ lang: "<script>" });
  assert.equal(response.status, 200);
  assert.ok(issues[0].labels.includes("lang:ja"));
  assert.ok(!issues[0].labels.some((label) => label.includes("script")));
});

test("a known language keeps its label", async () => {
  await post({ lang: "ZH" });
  assert.ok(issues[0].labels.includes("lang:zh"));
});

test("a post from another origin is refused when an allowlist is set", async () => {
  const response = await post({}, { origin: "https://evil.example" });
  assert.equal(response.status, 403);
  assert.equal(issues.length, 0);
});

test("any origin may post when ALLOW_ORIGIN is unset", async () => {
  const { ALLOW_ORIGIN, ...env } = ENV;
  const response = await post({}, { origin: "https://elsewhere.example", env });
  assert.equal(response.status, 200);
});

test("a missing Turnstile secret refuses instead of accepting unverified posts", async () => {
  const { TURNSTILE_SECRET, ...env } = ENV;
  const response = await post({}, { env });
  assert.equal(response.status, 500);
  assert.equal(issues.length, 0);
});

test("TURNSTILE_DISABLED skips verification on purpose", async () => {
  const { TURNSTILE_SECRET, ...env } = ENV;
  const response = await post({}, { env: { ...env, TURNSTILE_DISABLED: "true" } });
  assert.equal(response.status, 200);
});

test("a failed Turnstile check is refused", async () => {
  turnstileOk = false;
  const response = await post({});
  assert.equal(response.status, 403);
  assert.equal(issues.length, 0);
});
