// Highlights the search term on the page a search result opened. search.js stores
// { url, term } in sessionStorage before navigating; the payload is consumed by the
// next page render, whether a full load or a router swap, and applied when the URL matches.
const STORAGE_KEY = "cw-highlight";

const takePayload = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Failed to read highlight payload", error);
    return null;
  }
};

const clearPayload = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked: nothing to clear.
  }
};

const highlightTerm = (target, term) => {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!escaped) return;
  // `test` on a global regex carries lastIndex between calls, so matching nodes are
  // found with a non-global copy and only the replacement uses the global one.
  const matcher = new RegExp(escaped, "i");
  const regex = new RegExp(`(${escaped})`, "gi");
  const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, null, false);
  const nodes = [];
  while (walker.nextNode()) {
    if (matcher.test(walker.currentNode.nodeValue)) {
      nodes.push(walker.currentNode);
    }
  }
  nodes.forEach((node) => {
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    node.nodeValue.replace(regex, (match, _, offset) => {
      fragment.appendChild(document.createTextNode(node.nodeValue.slice(lastIndex, offset)));
      const mark = document.createElement("mark");
      mark.className = "highlight";
      mark.textContent = match;
      fragment.appendChild(mark);
      lastIndex = offset + match.length;
      return match;
    });
    fragment.appendChild(document.createTextNode(node.nodeValue.slice(lastIndex)));
    node.parentNode.replaceChild(fragment, node);
  });
};

export default function initHighlight(root = document) {
  const payload = takePayload();
  if (!payload) return;
  // One shot: a payload for another page is dropped, as before.
  clearPayload();
  if (!payload.url || !payload.term) return;

  let payloadPath = payload.url;
  try {
    payloadPath = new URL(payload.url, window.location.origin).pathname;
  } catch (error) {
    console.warn("Invalid highlight URL", error);
  }
  if (payloadPath !== window.location.pathname) return;

  const target = root.querySelector?.(".article-body") || document.querySelector(".article-body");
  if (target) highlightTerm(target, payload.term);
}
