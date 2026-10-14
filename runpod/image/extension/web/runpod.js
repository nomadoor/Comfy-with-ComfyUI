// RunPod helper for the site's Pods:
// - on the first visit to this Pod from a browser, open the profile's `open` workflows as tabs, in
//   the article's order, with the first one active, and show the sidebar's Workflows tab, where all
//   of them wait (later visits keep ComfyUI's own tab and sidebar restore);
// - report reader activity for the idle auto-stop, and cover the screen with a countdown before the
//   Pod terminates itself (the reader has not touched the page for a while, so a small banner is missed).
import { app } from "../../scripts/app.js";

const CONFIG_URL = new URL("./runpod.json", import.meta.url);
const lang = (navigator.language || "en").toLowerCase();
const T = lang.startsWith("ja")
  ? { warn: "操作がないため、この Pod を終了します", keep: "使い続ける", tab: (t) => `⚠ ${t} で終了`, stopping: "終了しています…", stopped: "操作がなかったため、この Pod を終了しました", relaunch: "もう一度使うときは、記事のボタンから起動してください。", tabStopped: "終了しました" }
  : lang.startsWith("zh")
    ? { warn: "由于没有操作，将终止此 Pod", keep: "继续使用", tab: (t) => `⚠ ${t} 后终止`, stopping: "正在终止…", stopped: "由于没有操作，此 Pod 已终止", relaunch: "如需再次使用，请通过文章中的按钮重新启动。", tabStopped: "已终止" }
    : { warn: "No activity: this Pod will be terminated", keep: "Keep using", tab: (t) => `⚠ Ends in ${t}`, stopping: "Terminating…", stopped: "This Pod was terminated after a period of inactivity", relaunch: "To use it again, launch a new one from the article's button.", tabStopped: "Terminated" };

const openProfileWorkflows = async (config) => {
  const flag = `comfy-with-comfyui.runpod.opened.${config.profile}.${config.boot}`;
  try {
    if (localStorage.getItem(flag)) return;
  } catch {}

  const store = app.extensionManager.workflow;
  await store.syncWorkflows?.();
  const workflows = config.workflows.map((path) => store.getWorkflowByPath(path)).filter(Boolean);
  if (!workflows.length) return;

  const blank = store.activeWorkflow;
  store.openWorkflowsInBackground({ left: [], right: workflows.map((w) => w.path) });
  const [first] = workflows;
  await first.load();
  await app.loadGraphData(first.activeState ?? first.initialState, true, true, first);
  // Close the empty tab ComfyUI opened on its own, unless the reader already touched it.
  if (blank?.isTemporary && !blank.isModified && blank.path !== first.path) {
    await store.closeWorkflow(blank);
  }
  // The other workflows are in the Workflows tab; toggleSidebarTab closes it if it is already open.
  const sidebar = app.extensionManager.sidebarTab;
  if (sidebar && sidebar.activeSidebarTabId !== "workflows") sidebar.toggleSidebarTab?.("workflows");
  try {
    localStorage.setItem(flag, "1");
  } catch {}
};

// Full-screen notice in the site's design (ops/style-design.md): dark tokens, Plus Jakarta Sans and
// Zen Kaku Gothic New, filled surfaces without borders, amber only for the warning itself. ComfyUI
// stays visible behind a light scrim so the reader can tell which Pod this is.
const FONTS = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Zen+Kaku+Gothic+New:wght@400;700&display=swap";
const STYLE = `
.cwc-idle{--heading:#dfdfdf;--text:#b0b0b0;--muted:#8a8a8a;--reader:#101010;--amber:#c98a32;
  --card:color-mix(in srgb,var(--text) 6%,var(--reader));--raised:color-mix(in srgb,var(--text) 14%,var(--reader));
  position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;padding:1rem;
  background:rgba(4,4,4,.68);font-family:"Plus Jakarta Sans","Zen Kaku Gothic New","Hiragino Sans",system-ui,sans-serif;
  line-height:1.7;color:var(--text);cursor:pointer}
.cwc-idle[data-mode]{display:flex}
.cwc-idle__card{display:grid;gap:1rem;width:min(30rem,100%);padding:1.5rem;border-radius:.5rem;background:var(--card);cursor:default;outline:none}
.cwc-idle__head{display:flex;gap:.75rem;align-items:center;margin:0;color:var(--heading);font-size:1rem;font-weight:600}
.cwc-idle__icon{flex:none;display:grid;place-items:center;width:2rem;height:2rem;border-radius:.5rem;
  background:color-mix(in srgb,var(--amber) 20%,transparent);color:var(--amber)}
.cwc-idle__time{margin:0;color:var(--heading);font-size:3.5rem;font-weight:700;line-height:1;letter-spacing:.02em;font-variant-numeric:tabular-nums}
.cwc-idle__note{margin:0;font-size:.875rem;color:var(--muted)}
.cwc-idle__note:empty{display:none}
.cwc-idle__keep{justify-self:start;padding:.5rem 1.25rem;border:0;border-radius:.5rem;background:var(--raised);color:var(--heading);
  font:600 .9375rem/1.5 inherit;font-family:inherit;cursor:pointer}
.cwc-idle__keep:hover,.cwc-idle__keep:focus-visible{background:color-mix(in srgb,var(--text) 22%,var(--reader));outline:none}
.cwc-idle[data-mode="stopped"]{cursor:default}
.cwc-idle[data-mode="stopped"] .cwc-idle__time,.cwc-idle[data-mode="stopped"] .cwc-idle__keep{display:none}
`;
// Tabler alert-triangle, closed area filled at 0.3 like the site's icons.
const ICON = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.24 3.957l-8.422 14.06a1.989 1.989 0 0 0 1.7 2.983h16.845a1.989 1.989 0 0 0 1.7 -2.983l-8.423 -14.06a1.989 1.989 0 0 0 -3.4 0z" fill="currentColor" fill-opacity=".3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`;

const overlay = document.createElement("div");
overlay.className = "cwc-idle";
// A modal alert dialog: named by its heading, focus moves in when it opens and back when it closes.
// The background is not made inert: the first click or key on the notice closes it anyway.
overlay.setAttribute("role", "alertdialog");
overlay.setAttribute("aria-modal", "true");
overlay.setAttribute("aria-labelledby", "cwc-idle-heading");
overlay.setAttribute("aria-describedby", "cwc-idle-time cwc-idle-note");
overlay.innerHTML = `<div class="cwc-idle__card" tabindex="-1"><p class="cwc-idle__head"><span class="cwc-idle__icon">${ICON}</span><span id="cwc-idle-heading"></span></p>` +
  `<p class="cwc-idle__time" id="cwc-idle-time"></p><p class="cwc-idle__note" id="cwc-idle-note"></p><button type="button" class="cwc-idle__keep"></button></div>`;
const card = overlay.querySelector(".cwc-idle__card");
const heading = overlay.querySelector("#cwc-idle-heading");
const countdown = overlay.querySelector(".cwc-idle__time");
const note = overlay.querySelector(".cwc-idle__note");
const keepButton = overlay.querySelector(".cwc-idle__keep");
keepButton.textContent = T.keep;
// click covers activation without pointer or key events (assistive technology).
keepButton.addEventListener("click", () => reportActivity(true));

let mode = "hidden"; // "hidden" | "warn" | "stopped"
let deadline = 0; // ms timestamp the server will terminate at, from the last status
let pageTitle = "";
let returnFocus = null; // where focus was before the notice took it

const clock = () => {
  const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  return `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
};

const show = (next) => {
  const opening = mode === "hidden" && next !== "hidden";
  if (opening) {
    pageTitle = document.title;
    returnFocus = document.activeElement;
  }
  if (mode !== "hidden" && next === "hidden") {
    if (pageTitle) document.title = pageTitle;
    if (returnFocus?.isConnected) returnFocus.focus?.({ preventScroll: true });
    returnFocus = null;
  }
  const changed = mode !== next;
  mode = next;
  if (next === "hidden") overlay.removeAttribute("data-mode");
  else overlay.dataset.mode = next;
  if (next === "stopped") {
    heading.textContent = T.stopped;
    note.textContent = T.relaunch;
    document.title = T.tabStopped;
  }
  if (changed && next === "warn") keepButton.focus({ preventScroll: true });
  if (changed && next === "stopped") card.focus({ preventScroll: true });
  tick();
};

const tick = () => {
  if (mode !== "warn") return;
  const time = clock();
  heading.textContent = T.warn;
  countdown.textContent = time;
  // At 0:00 the server is calling RunPod; the reader can still keep the Pod until it answers.
  note.textContent = time === "0:00" ? T.stopping : "";
  // ComfyUI rewrites the title on its own (workflow name, progress), so set it every second.
  document.title = T.tab(time);
};

const render = (status) => {
  // Off, or not on RunPod (no Pod ID/key): there is nothing to warn about or terminate.
  if (!status?.enabled || !status.can_stop) return;
  deadline = Date.now() + status.stop_in * 1000;
  if (status.stopping) show("stopped");
  else if (status.stop_in <= status.warn_before) show("warn");
  else show("hidden");
};

let lastReport = 0;
const reportActivity = async (force = false) => {
  if (mode === "stopped") return;
  // One press of "Keep using" sends pointerdown and click (or keydown and click): report it once.
  if (Date.now() - lastReport < 1_000) return;
  // Normal use reports at most once a minute; while the notice is up every touch counts at once.
  if (!force && mode !== "warn" && Date.now() - lastReport < 60_000) return;
  lastReport = Date.now();
  try {
    render(await (await fetch("/runpod/activity", { method: "POST" })).json());
  } catch {}
};

const watchIdle = () => {
  const style = document.createElement("style");
  style.textContent = STYLE;
  const fonts = Object.assign(document.createElement("link"), { rel: "stylesheet", href: FONTS });
  document.head.append(fonts, style);
  document.body.append(overlay);
  for (const type of ["pointerdown", "wheel"]) {
    window.addEventListener(type, () => reportActivity(), { capture: true, passive: true });
  }
  // Switching windows or tabs (Alt+Tab, Ctrl+Tab, Cmd+Tab) sends only the modifier's keydown to the
  // page. That is the reader leaving, not working, so a lone modifier does not count; shortcuts such as
  // Ctrl+S still do.
  window.addEventListener("keydown", (event) => {
    if (["Control", "Alt", "Meta", "Shift", "OS", "AltGraph"].includes(event.key)) return;
    reportActivity();
  }, { capture: true, passive: true });
  const poll = async () => {
    try {
      render(await (await fetch("/runpod/idle", { cache: "no-store" })).json());
    } catch {}
  };
  poll();
  setInterval(poll, 20_000);
  setInterval(tick, 1_000);
};

app.registerExtension({
  name: "comfy-with-comfyui.runpod",
  async setup() {
    watchIdle();
    // Wait until ComfyUI has restored or created its first tab, then take over once.
    for (let i = 0; i < 100 && !app.extensionManager?.workflow?.activeWorkflow; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    try {
      await openProfileWorkflows(await (await fetch(CONFIG_URL, { cache: "no-store" })).json());
    } catch (error) {
      console.warn("[comfy-with-comfyui] could not open the profile workflows", error);
    }
  },
});
