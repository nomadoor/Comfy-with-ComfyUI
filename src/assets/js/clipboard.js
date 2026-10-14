// Copies text to the clipboard: the async Clipboard API first, then a hidden textarea with
// execCommand for browsers or contexts where the API is missing or refuses. Resolves to whether
// the text was copied.
export function copyWithTextarea(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  // Fixed and off-screen: selecting it must not scroll the page.
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}

export async function copyText(text) {
  const value = String(text || "");
  if (!value) return false;
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fall back to the textarea copy below.
    }
  }
  return copyWithTextarea(value);
}
