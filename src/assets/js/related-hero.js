// Load preview images for related workflow cards and fade them in.
export default function initRelatedHero(root = document) {
  const heroes = root.querySelectorAll(".workflow-related__hero[data-hero]");
  heroes.forEach((el) => {
    if (el.dataset.heroInit === "true") return;
    el.dataset.heroInit = "true";
    const src = el.dataset.hero;
    if (!src) return;
    const img = new Image();
    const done = () => el.classList.add("is-loaded");
    img.onload = () => {
      el.style.setProperty("--hero-image", `url('${src}')`);
      done();
    };
    img.onerror = done;
    img.src = src;
  });
}
