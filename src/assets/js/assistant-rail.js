class AssistantRail {
  constructor(root) {
    this.root = root;
    this.avatar = root.querySelector(".assistant-rail__avatar");
    this.panel = root.querySelector(".assistant-rail__panel");
    this.window = root.querySelector(".assistant-rail__window");
    this.views = Array.from(root.querySelectorAll(".assistant-rail__view"));
    this.panelButtons = Array.from(root.querySelectorAll("[data-assistant-target]"));
    this.closeButtons = Array.from(root.querySelectorAll("[data-assistant-close]"));
    this.resetButtons = Array.from(root.querySelectorAll("[data-assistant-reset]"));
    this.submittedDetail = root.querySelector("[data-assistant-submitted-detail]");
    this.isExpanded = false;
    this.currentView = "panel";
    this.pointerQuery = window.matchMedia("(pointer: coarse)");
    this.isCoarse = this.pointerQuery.matches;
    this.motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.prefersReducedMotion = this.motionQuery.matches;
    this.csrfCookie = root.dataset.csrfCookie || "assistant_feedback_csrf";
    this.csrfHeader = root.dataset.csrfHeader || "X-CSRF-Token";
    this.turnstileSitekey = root.dataset.assistantSitekey || "";
    this.lang = root.dataset.lang || document.documentElement.lang || "ja";
    this.forms = [];

    this.handlePointerChange = (event) => {
      this.isCoarse = event.matches;
      if (!this.isCoarse && this.currentView === "panel") {
        this.collapse();
      }
    };

    if (this.pointerQuery.addEventListener) {
      this.pointerQuery.addEventListener("change", this.handlePointerChange);
    } else if (this.pointerQuery.addListener) {
      this.pointerQuery.addListener(this.handlePointerChange);
    }

    this.handleMotionChange = (event) => {
      this.prefersReducedMotion = event.matches;
    };

    if (this.motionQuery.addEventListener) {
      this.motionQuery.addEventListener("change", this.handleMotionChange);
    } else if (this.motionQuery.addListener) {
      this.motionQuery.addListener(this.handleMotionChange);
    }

    this.bindEvents();
    this.initForms();
    this.update();
  }

  bindEvents() {
    if (this.avatar) {
      this.avatar.addEventListener("click", (event) => {
        if (!this.isCoarse) return;
        event.preventDefault();
        this.toggle();
      });

      this.avatar.addEventListener("mouseenter", () => {
        if (this.isCoarse) return;
        this.expand();
      });

      this.avatar.addEventListener("mouseleave", () => {
        if (this.isCoarse) return;
        this.delayedCollapse();
      });

      this.avatar.addEventListener("focus", () => this.expand());
      this.avatar.addEventListener("blur", () => {
        if (this.isCoarse) return;
        this.delayedCollapse();
      });
    }

    if (this.panel) {
      this.panel.addEventListener("mouseenter", () => {
        if (this.isCoarse) return;
        this.expand();
      });

      this.panel.addEventListener("mouseleave", () => {
        if (this.isCoarse) return;
        this.delayedCollapse();
      });
    }

    this.panelButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.assistantTarget;
        this.openView(target);
      });
    });

    this.closeButtons.forEach((button) => {
      button.addEventListener("click", () => this.closeView({ keepExpanded: false }));
    });

    this.resetButtons.forEach((button) => {
      button.addEventListener("click", () => this.resetToPanel(true));
    });

    this.root.addEventListener("assistant:open", (event) => {
      const detail = event.detail || {};
      const opened = this.openFromExternal(detail.viewId, detail.message);
      if (detail && typeof detail === "object") {
        detail.handled = opened;
      }
    });
  }

  initForms() {
    const formElements = this.root.querySelectorAll("[data-assistant-form]");
    formElements.forEach((form) => {
      this.forms.push(new AssistantFormController(form, this));
    });
  }

  delayedCollapse() {
    if (this.currentView !== "panel") return;
    setTimeout(() => {
      if (this.currentView !== "panel") return;

      // Check if any currently hovered element is within the rail
      let isHoveringRail = false;
      const hoveredElements = document.querySelectorAll(":hover");
      for (const el of hoveredElements) {
        if (this.root.contains(el)) {
          isHoveringRail = true;
          break;
        }
      }

      // Fallback/Double-check with matches
      const simpleHover =
        (this.avatar && this.avatar.matches(":hover")) ||
        (this.panel && this.panel.matches(":hover"));

      if (!isHoveringRail && !simpleHover) {
        this.collapse();
      }
    }, 400);
  }

  toggle() {
    if (this.isExpanded) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  expand() {
    this.isExpanded = true;
    this.update();
  }

  collapse() {
    if (this.currentView !== "panel") return;
    this.isExpanded = false;
    this.update();
  }

  openView(viewId) {
    if (!viewId || viewId === "panel") {
      this.resetToPanel();
      return;
    }
    const target = this.views.find((view) => view.dataset.assistantView === viewId);
    if (!target) return;
    this.currentView = viewId;
    this.root.dataset.view = viewId;
    this.isExpanded = true;
    this.views.forEach((view) => {
      const isActive = view.dataset.assistantView === viewId;
      view.setAttribute("aria-hidden", isActive ? "false" : "true");
    });
    this.update();
    window.requestAnimationFrame(() => {
      this.adjustWindowPlacement(target);
    });
  }

  closeView(options = {}) {
    const { keepExpanded = false } = options;
    if (this.currentView === "panel") {
      this.delayedCollapse();
      return;
    }
    this.resetForms();
    this.resetToPanel(keepExpanded);
  }

  resetForms() {
    this.forms.forEach((controller) => controller.reset());
  }

  resetToPanel(keepExpanded = false) {
    this.currentView = "panel";
    this.root.dataset.view = "panel";
    this.root.dataset.placement = "above";
    this.views.forEach((view) => view.setAttribute("aria-hidden", "true"));
    if (keepExpanded) {
      this.isExpanded = true;
      this.update();
      return;
    }
    this.update();
    if (this.isCoarse) {
      this.collapse();
    } else {
      setTimeout(() => this.delayedCollapse(), 50);
    }
  }

  showSubmitted(detailText = "") {
    if (this.submittedDetail) {
      this.submittedDetail.textContent = detailText || "";
    }
    this.openView("submitted");
  }

  openFromExternal(viewId, message = "") {
    if (!viewId) return false;
    const targetView = this.views.find((view) => view.dataset.assistantView === viewId);
    if (!targetView) return false;
    this.openView(viewId);

    const targetForm = targetView.querySelector("[data-assistant-form]");
    const textarea = targetForm?.querySelector("textarea");
    if (textarea) {
      textarea.value = typeof message === "string" ? message : "";
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }

    const controller = this.forms.find((item) => item.form === targetForm);
    controller?.setState("input");
    return true;
  }

  update() {
    if (this.currentView !== "panel") {
      this.isExpanded = true;
    }
    this.root.dataset.expanded = this.isExpanded ? "true" : "false";
    if (this.avatar) {
      this.avatar.setAttribute("aria-expanded", this.isExpanded ? "true" : "false");
    }
    if (this.panel) {
      const panelHidden = !(this.isExpanded && this.currentView === "panel");
      this.panel.setAttribute("aria-hidden", panelHidden ? "true" : "false");
    }
    if (this.window) {
      this.window.setAttribute("aria-hidden", this.currentView === "panel" ? "true" : "false");
    }
  }

  adjustWindowPlacement(activeView) {
    if (!this.panel || !activeView) {
      this.root.dataset.placement = "above";
      return;
    }
    const header = document.querySelector(".site-header");
    const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
    const panelRect = this.panel.getBoundingClientRect();
    const viewHeight = activeView.scrollHeight || activeView.offsetHeight || 0;
    const availableAbove = panelRect.top - headerBottom - 12;
    const needsBelow = viewHeight > availableAbove;
    this.root.dataset.placement = needsBelow ? "below" : "above";
  }

  getCookieValue(name) {
    if (!name || typeof document === "undefined") return "";
    const cookies = document.cookie ? document.cookie.split(";") : [];
    for (const rawCookie of cookies) {
      const cookie = rawCookie.trim();
      if (cookie.startsWith(`${name}=`)) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
    return "";
  }

  getCsrfToken() {
    if (!this.csrfCookie) return "";
    return this.getCookieValue(this.csrfCookie);
  }
}

class AssistantFormController {
  constructor(form, rail) {
    this.form = form;
    this.rail = rail;
    this.textarea = form.querySelector("textarea");
    this.confirmButton = form.querySelector('[data-assistant-action="confirm"]');
    this.editButton = form.querySelector('[data-assistant-action="edit"]');
    this.sendButton = form.querySelector('[data-assistant-action="send"]');
    this.statusNode = form.querySelector("[data-form-status]");
    this.previewNode = form.querySelector("[data-confirm-message]");
    this.includeUrl = form.dataset.includeUrl === "true";
    this.minLength = parseInt(form.dataset.minLength, 10) || 1;
    this.validationMessage = form.dataset.statusValidation || "";
    this.endpointMessage = form.dataset.statusEndpoint || "";
    this.errorMessage = form.dataset.statusError || "";
    this.sendingMessage = form.dataset.statusSending || "";
    this.turnstileMessage = form.dataset.statusTurnstile || "認証を完了してください。";
    this.successDetail = form.dataset.successDetail || "";
    this.type = form.dataset.formType || "feedback";
    this.state = "input";
    this.isSending = false;
    this.turnstileSitekey = rail.turnstileSitekey || "";
    this.turnstileContainer = form.querySelector("[data-assistant-turnstile]");
    this.turnstileWidgetId = null;
    this.turnstileTokenReady = false;
    this.publishPermissionInputs = Array.from(form.querySelectorAll('input[name$="-publish-permission"]'));
    this.hasPublishPermission = this.publishPermissionInputs.length > 0;

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    this.bindFormEvents();
    this.setState("input");
  }

  bindFormEvents() {
    this.confirmButton?.addEventListener("click", () => this.confirm());
    this.editButton?.addEventListener("click", () => {
      this.setState("input");
      this.resetTurnstile();
    });
    this.sendButton?.addEventListener("click", () => this.submit());
  }

  setState(state) {
    this.state = state;
    this.form.dataset.formState = state;
    if (this.textarea) {
      this.textarea.readOnly = state === "confirm";
    }
    if (state === "input") {
      this.showStatus("");
    }
    if (state === "input" && this.previewNode) {
      this.previewNode.textContent = "";
    }
    this.updateSendState();
  }

  getMessage() {
    return this.textarea ? this.textarea.value.trim() : "";
  }

  getPublishPermissionValue() {
    if (!this.hasPublishPermission) return "deny";
    const checked = this.form.querySelector('input[name$="-publish-permission"]:checked');
    return checked?.value === "allow" ? "allow" : "deny";
  }

  getPublishPermissionSentence() {
    if (!this.hasPublishPermission) return "";
    const value = this.getPublishPermissionValue();
    const lang = String(this.rail.lang || document.documentElement.lang || "ja").slice(0, 2);
    if (lang === "en") {
      return value === "allow"
        ? "This content may be cited/quoted on the site."
        : "Please do not cite/quote this content on the site.";
    }
    if (lang === "zh") {
      return value === "allow"
        ? "此内容可以在网站上引用/刊登。"
        : "请不要在网站上引用/刊登此内容。";
    }
    return value === "allow"
      ? "この内容をサイトに掲載/引用して良い"
      : "この内容をサイトに掲載/引用しないでほしい";
  }

  getSubmissionMessage() {
    const message = this.getMessage();
    const consentSentence = this.getPublishPermissionSentence();
    if (!consentSentence) return message;
    return `${message}\n\n${consentSentence}`;
  }

  async confirm() {
    const message = this.getMessage();
    if (message.length < this.minLength) {
      this.showStatus(this.validationMessage);
      return;
    }
    if (this.previewNode) {
      this.previewNode.textContent = this.getSubmissionMessage();
    }
    this.setState("confirm");
    await this.ensureTurnstileWidget();
    this.resetTurnstile();
    this.updateSendState();
  }

  async submit() {
    if (this.state !== "confirm" || this.isSending) return;
    const endpoint = this.getEndpoint();
    if (!endpoint) {
      this.showStatus(this.endpointMessage);
      return;
    }
    const message = this.getSubmissionMessage();
    this.isSending = true;
    this.updateSendState();
    this.showStatus(this.sendingMessage);
    try {
      const urlValue = this.includeUrl ? window.location.href : "";
      let turnstileToken = this.getTurnstileToken();
      if (this.turnstileSitekey && !turnstileToken) {
        this.showStatus(this.turnstileMessage);
        this.isSending = false;
        this.updateSendState();
        return;
      }
      const payload = {
        type: this.type,
        message,
        url: urlValue,
        lang: this.rail.lang || document.documentElement.lang || "ja",
        turnstileToken
      };
      const headers = {
        "Content-Type": "application/json"
      };
      const csrfToken = this.rail.getCsrfToken();
      if (csrfToken && this.rail.csrfHeader) {
        headers[this.rail.csrfHeader] = csrfToken;
      }
      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        credentials: "same-origin",
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      this.form.reset();
      this.setState("input");
      this.isSending = false;
      this.resetTurnstile();
      this.showStatus("");
      this.rail.showSubmitted(this.successDetail);
    } catch (error) {
      this.isSending = false;
      this.updateSendState();
      this.showStatus(this.errorMessage || error.message);
    }
  }

  getEndpoint() {
    const rail = this.form.closest(".assistant-rail");
    const raw = rail?.dataset.feedbackEndpoint || "";
    return raw.trim();
  }

  showStatus(message) {
    if (this.statusNode) {
      this.statusNode.textContent = message || "";
    }
  }

  reset() {
    this.isSending = false;
    this.form.reset();
    this.setState("input");
    this.resetTurnstile();
    this.showStatus("");
  }

  updateSendState() {
    if (!this.sendButton) return;
    const needsTurnstile = Boolean(this.turnstileSitekey);
    const canSend = this.state === "confirm" && !this.isSending && (!needsTurnstile || this.turnstileTokenReady);
    this.sendButton.disabled = !canSend;
  }

  async ensureTurnstileWidget() {
    if (!this.turnstileSitekey || !this.turnstileContainer || this.turnstileWidgetId !== null) return;
    await ensureTurnstile();
    if (!window.turnstile?.render) return;

    this.turnstileWidgetId = window.turnstile.render(this.turnstileContainer, {
      sitekey: this.turnstileSitekey,
      callback: (token) => {
        this.turnstileTokenReady = Boolean(token);
        this.updateSendState();
      },
      "expired-callback": () => {
        this.turnstileTokenReady = false;
        this.updateSendState();
      },
      "error-callback": () => {
        this.turnstileTokenReady = false;
        this.updateSendState();
      }
    });
  }

  resetTurnstile() {
    if (!this.turnstileSitekey) return;
    this.turnstileTokenReady = false;
    if (this.turnstileWidgetId !== null && typeof window.turnstile?.reset === "function") {
      try {
        window.turnstile.reset(this.turnstileWidgetId);
      } catch (error) {
        // ignore
      }
    }
    this.updateSendState();
  }

  getTurnstileToken() {
    if (!this.turnstileSitekey) return "";
    if (this.turnstileWidgetId === null || typeof window.turnstile?.getResponse !== "function") return "";
    try {
      return String(window.turnstile.getResponse(this.turnstileWidgetId) || "").trim();
    } catch (error) {
      return "";
    }
  }
}

const initAssistantRail = () => {
  const widget = document.querySelector(".assistant-rail");
  if (!widget) return;
  if (widget.dataset.initialized === "true") return;
  widget.dataset.initialized = "true";
  new AssistantRail(widget);
};

export default initAssistantRail;

// Turnstile helpers
let turnstileReadyPromise = null;

function ensureTurnstile() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (turnstileReadyPromise) return turnstileReadyPromise;
  turnstileReadyPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Turnstile failed to load"));
    document.head.appendChild(script);
  });
  return turnstileReadyPromise;
}
