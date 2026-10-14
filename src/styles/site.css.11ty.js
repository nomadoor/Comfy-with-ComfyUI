// Builds /assets/css/site.css from the files in this folder, concatenated in file-name order
// (the number prefix is the cascade order). One stylesheet keeps the single versioned
// `site.css?v=` request that base.njk makes; @import would add unversioned requests.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));

export default class SiteCss {
  data() {
    return {
      permalink: "/assets/css/site.css",
      eleventyExcludeFromCollections: true
    };
  }

  render() {
    return fs
      .readdirSync(DIR)
      .filter((name) => name.endsWith(".css"))
      .sort()
      .map((name) => {
        const text = fs.readFileSync(path.join(DIR, name), "utf8");
        // Parts are joined as they are; one without a final newline would run into the next.
        if (!text.endsWith("\n")) throw new Error(`[styles] ${name} must end with a newline`);
        return text;
      })
      .join("");
  }
}
