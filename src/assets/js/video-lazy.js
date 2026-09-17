// Load article videos only when the reader gets close to them.
//
// Videos are rendered with `preload="none"` and without `autoplay` (see renderVideoFigure in
// .eleventy.js), so a page costs nothing in video traffic until this module activates a clip. Without
// it, every video on a page downloads at once and competes with the images the reader is actually
// looking at; on a slow connection that delayed images by several seconds.
//
// A Loop video is activated when it comes within NEAR_MARGIN of the viewport: preloading is switched
// on and playback starts. Leaving that range pauses it again (already downloaded data is kept). Player
// videos are never activated here — they load when the reader presses play — and rows handled by
// video-sync.js keep their play/pause under that module's control; this module only loads them and
// announces MEDIA_ACTIVATE so the row can (re)build its group.

export const MEDIA_ACTIVATE = "media-activate";
// One viewport ahead and behind, so a clip is usually ready by the time it is scrolled into view.
const NEAR_MARGIN = "100% 0px";
// Images get a head start on the videos: two viewports against the videos' one.
const IMAGE_MARGIN = "200% 0px";
const NEAR_ATTR = "mediaNear";
// Never hold a video back longer than this because an image is slow or stuck.
const IMAGE_WAIT_MS = 3000;

const cleanups = new WeakMap();

function isPlayer(video) {
  const figure = video.closest("figure[data-media-toggle]");
  return (figure?.dataset.mediaMode || figure?.getAttribute("data-media-initial")) === "player";
}

/** True when video-sync.js runs this row, in which case it decides when the videos play. */
function syncOwns(video) {
  return video.closest(".article-media-row")?.dataset.videoSync === "active";
}

/**
 * Images the reader is about to reach, still loading. A clip is worth several megabytes and would
 * otherwise take the bandwidth these need, which on a slow connection left images blank for seconds
 * after they scrolled into view. The range is wider than the viewport because a video starts loading
 * before it is on screen, and by then the images around it are the ones that matter.
 */
function imagesLoadingNear(video) {
  const root = video.ownerDocument;
  const viewport = root.defaultView?.innerHeight || 0;
  return [...root.querySelectorAll("img")].filter((image) => {
    if (image.complete) return false;
    const rect = image.getBoundingClientRect();
    return rect.bottom > -viewport && rect.top < viewport * 2;
  });
}

function imagesSettled(video) {
  const images = imagesLoadingNear(video);
  if (!images.length) return Promise.resolve();
  return Promise.race([
    Promise.all(images.map((image) => new Promise((resolve) => {
      image.addEventListener("load", resolve, { once: true });
      image.addEventListener("error", resolve, { once: true });
    }))),
    new Promise((resolve) => setTimeout(resolve, IMAGE_WAIT_MS))
  ]);
}

/** Start (or resume) a Loop video that the reader is close to. */
export async function activate(video) {
  video.dataset[NEAR_ATTR] = "true";
  if (video.dataset.poster && !video.getAttribute("poster")) video.setAttribute("poster", video.dataset.poster);
  // A Player video stays unloaded until the reader presses play; its poster frame is enough.
  if (isPlayer(video)) return;
  await imagesSettled(video);
  // The reader may have scrolled past while the images loaded.
  if (!isNear(video) || !video.isConnected) return;
  if (video.preload !== "auto") video.preload = "auto";
  video.dispatchEvent(new CustomEvent(MEDIA_ACTIVATE, { bubbles: true }));
  if (!syncOwns(video)) video.play().catch(() => {});
}

function deactivate(video) {
  delete video.dataset[NEAR_ATTR];
  if (!isPlayer(video) && !syncOwns(video)) video.pause();
}

/** True while the reader is close enough for this video to play. */
export function isNear(video) {
  return video.dataset[NEAR_ATTR] === "true";
}

const initVideoLazy = (root = document) => {
  cleanups.get(root)?.();

  const videos = [...root.querySelectorAll("video[data-media-lazy]")];
  if (!videos.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activate(entry.target);
        else deactivate(entry.target);
      }
    },
    { rootMargin: NEAR_MARGIN }
  );
  videos.forEach((video) => observer.observe(video));

  // Start article images a screen before the videos around them, so the few dozen kilobytes an image
  // needs are not queued behind a multi-megabyte clip.
  const images = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.loading = "eager";
        images.unobserve(entry.target);
      }
    },
    { rootMargin: IMAGE_MARGIN }
  );
  root.querySelectorAll('img[loading="lazy"]').forEach((image) => images.observe(image));

  const cleanup = () => {
    observer.disconnect();
    images.disconnect();
    cleanups.delete(root);
  };
  cleanups.set(root, cleanup);
  return cleanup;
};

export default initVideoLazy;
