// Removes code from Markdown so text-level scans (link checks) do not read examples as content.
// Fenced blocks (``` or ~~~, also indented inside list items) become empty lines, keeping line
// numbers; inline code spans are blanked.

// A fence may follow a list marker on the same line ("- ```"), as it does in several articles.
const FENCE = /^[ \t]*(?:(?:[-*+]|\d+[.)])[ \t]+)?(`{3,}|~{3,})/;

export function stripCode(text) {
  const lines = String(text).split(/\r?\n/);
  let fence = null;
  const kept = lines.map((line) => {
    const open = line.match(FENCE);
    if (fence) {
      if (open && open[1][0] === fence[0] && open[1].length >= fence.length && !line.slice(line.indexOf(open[1]) + open[1].length).trim()) {
        fence = null;
      }
      return "";
    }
    if (open) {
      fence = open[1];
      return "";
    }
    return line.replace(/(`+)(?:(?!\1)[\s\S])+?\1/g, "");
  });
  return kept.join("\n");
}
