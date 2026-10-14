// Adds a class for a moment (copy succeeded, file downloaded, …). Calling it again while the class
// is still on restarts the timer instead of stacking timers. `onEnd` runs when the class comes off.
const timers = new WeakMap();

export function flashClass(element, className, durationMs, { onEnd } = {}) {
  if (!element) return;
  element.classList.add(className);
  const key = `${className}`;
  const elementTimers = timers.get(element) || new Map();
  clearTimeout(elementTimers.get(key));
  elementTimers.set(
    key,
    setTimeout(() => {
      element.classList.remove(className);
      elementTimers.delete(key);
      onEnd?.();
    }, durationMs)
  );
  timers.set(element, elementTimers);
}
