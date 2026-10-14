// Where per-page modules look for their elements: the swapped page root when one is given,
// otherwise the whole document.
export function getScope(root) {
  return root && typeof root.querySelectorAll === "function" ? root : document;
}
