// RunPod helper for the site's Pods:
// - on the first visit to this Pod from a browser, open every workflow of the profile as tabs, in
//   the article's order, with the first one active (later visits keep ComfyUI's own tab restore);
// - report reader activity for the idle auto-stop, and warn before the Pod terminates itself.
import { app } from "../../scripts/app.js";

const CONFIG_URL = new URL("./runpod.json", import.meta.url);
const lang = (navigator.language || "en").toLowerCase();
const T = lang.startsWith("ja")
  ? { warn: (m) => `操作がないため、あと約 ${m} 分でこの Pod を終了します。生成した画像は先に保存してください。`, keep: "使い続ける", stopped: "操作がなかったため、この Pod を終了しました。もう一度使うときは、記事のボタンから起動してください。" }
  : lang.startsWith("zh")
    ? { warn: (m) => `由于没有操作，约 ${m} 分钟后将终止此 Pod。请先保存需要的图像。`, keep: "继续使用", stopped: "由于没有操作，此 Pod 已终止。如需再次使用，请通过文章中的按钮重新启动。" }
    : { warn: (m) => `No activity: this Pod will be terminated in about ${m} min. Save any images you want to keep.`, keep: "Keep using", stopped: "This Pod was terminated after a period of inactivity. Launch a new one from the article's button." };

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
  try {
    localStorage.setItem(flag, "1");
  } catch {}
};

const banner = document.createElement("div");
banner.style.cssText =
  "position:fixed;left:50%;top:100px;transform:translateX(-50%);z-index:10000;display:none;gap:12px;align-items:center;" +
  "width:max-content;max-width:calc(100vw - 32px);padding:10px 16px;border-radius:10px;background:#c98a32;color:#1b1a19;" +
  "font:14px/1.5 system-ui,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.35)";
const bannerText = document.createElement("span");
const keepButton = document.createElement("button");
keepButton.style.cssText = "flex:none;padding:4px 12px;border:0;border-radius:6px;background:#1b1a19;color:#f6f5f3;cursor:pointer;font:inherit";
keepButton.textContent = T.keep;
banner.append(bannerText, keepButton);

let lastReport = 0;
const reportActivity = async (force = false) => {
  if (!force && Date.now() - lastReport < 60_000) return;
  lastReport = Date.now();
  try {
    render(await (await fetch("/runpod/activity", { method: "POST" })).json());
  } catch {}
};
keepButton.addEventListener("click", () => reportActivity(true));

const render = (status) => {
  if (!status?.enabled) return;
  if (status.stopping) {
    bannerText.textContent = T.stopped;
    keepButton.style.display = "none";
    banner.style.display = "flex";
  } else if (status.stop_in <= status.warn_before) {
    bannerText.textContent = T.warn(Math.max(1, Math.ceil(status.stop_in / 60)));
    keepButton.style.display = "";
    banner.style.display = "flex";
  } else {
    banner.style.display = "none";
  }
};

const watchIdle = () => {
  document.body.append(banner);
  for (const type of ["pointerdown", "keydown", "wheel"]) {
    window.addEventListener(type, () => reportActivity(), { capture: true, passive: true });
  }
  const poll = async () => {
    try {
      render(await (await fetch("/runpod/idle", { cache: "no-store" })).json());
    } catch {}
  };
  poll();
  setInterval(poll, 20_000);
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
