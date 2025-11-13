import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

const dataDir = path.resolve("src", "_data");
const files = {
  ja: path.join(dataDir, "nav.ja.yml"),
  en: path.join(dataDir, "nav.en.yml")
};

function load(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return parse(raw);
}

const nav = Object.fromEntries(
  Object.entries(files).map(([lang, file]) => [lang, load(file)])
);

export default nav;
