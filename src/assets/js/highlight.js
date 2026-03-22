const payload = (() => {
  try {
    const raw = sessionStorage.getItem("cw-highlight");
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Failed to parse highlight payload", error);
    return null;
  }
})();

if (payload && payload.url && payload.term) {
  let payloadPath = payload.url;
  try {
    payloadPath = new URL(payload.url, window.location.origin).pathname;
  } catch (error) {
    console.warn("Invalid highlight URL", error);
  }
  const samePage = payloadPath === window.location.pathname;
  if (samePage) {
    const target = document.querySelector(".article-body");
    if (target) {
      const escaped = payload.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (escaped) {
        const regex = new RegExp(`(${escaped})`, "gi");
        const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, null, false);
        const nodes = [];
        while (walker.nextNode()) {
          if (regex.test(walker.currentNode.nodeValue)) {
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
      }
    }
  }
  sessionStorage.removeItem("cw-highlight");
}
