// Loads Cloudflare Turnstile once for every form on the page (the assistant rail and the contact
// page). Resolves to whether `window.turnstile` is usable; a failed load is forgotten, so the next
// call tries again instead of reusing the failure.
const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js";
let pending = null;

export function loadTurnstile() {
  if (window.turnstile?.render) return Promise.resolve(true);
  if (pending) return pending;
  pending = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      pending = null;
      resolve(true);
    };
    script.onerror = () => {
      pending = null;
      script.remove();
      resolve(false);
    };
    document.head.appendChild(script);
  });
  return pending;
}
