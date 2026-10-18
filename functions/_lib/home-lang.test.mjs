import test from "node:test";
import assert from "node:assert/strict";
import { pickHomeLang } from "./home-lang.mjs";

test("no header or an unsupported language goes to the English home", () => {
  assert.equal(pickHomeLang(""), "en");
  assert.equal(pickHomeLang(undefined), "en");
  assert.equal(pickHomeLang("fr-FR,fr;q=0.9,de;q=0.8"), "en");
  assert.equal(pickHomeLang("*"), "en");
});

test("the first supported language in the list wins", () => {
  assert.equal(pickHomeLang("en-US,en;q=0.9,ja;q=0.8"), "en");
  assert.equal(pickHomeLang("ja,en-US;q=0.9"), "ja");
  assert.equal(pickHomeLang("zh-CN,zh;q=0.9,en;q=0.8"), "zh");
  assert.equal(pickHomeLang("zh-TW"), "zh");
});

test("weights decide the order, not their position", () => {
  assert.equal(pickHomeLang("ja;q=0.5,en;q=0.9"), "en");
  assert.equal(pickHomeLang("ko-KR,ko;q=0.9,en-US;q=0.8,ja;q=0.7"), "en");
});

test("a language refused with q=0 is skipped", () => {
  assert.equal(pickHomeLang("en;q=0,zh"), "zh");
});
