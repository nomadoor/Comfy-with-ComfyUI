// Contact page entry point, and the "report" links on articles that open it with the page URL.
import { wireContactForms } from "./contact-forms.js";
import { wireOperatorForm } from "./contact-operator.js";

const CONTACT_SELECTOR = "[data-contact-page]";
const REPORT_LINK_SELECTOR = "[data-contact-report-link]";

function updateReportLinks(root = document) {
  const links = root.querySelectorAll(REPORT_LINK_SELECTOR);
  if (!links.length) return;
  const currentUrl = `${window.location.origin}${window.location.pathname}${window.location.search}`;

  links.forEach((link) => {
    try {
      const url = new URL(link.getAttribute("href"), window.location.origin);
      url.searchParams.set("url", currentUrl);
      link.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
    } catch (error) {
      // ignore malformed href
    }
  });
}

export default function initContact(root = document.getElementById("page") || document) {
  updateReportLinks(root);

  const contactRoot = root.querySelector(CONTACT_SELECTOR);
  if (!contactRoot) return;
  if (contactRoot.dataset.initialized === "true") return;
  contactRoot.dataset.initialized = "true";

  wireContactForms(contactRoot);
  wireOperatorForm(root, contactRoot);
}
