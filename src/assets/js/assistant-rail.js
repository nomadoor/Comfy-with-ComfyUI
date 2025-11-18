class AssistantRail {
  constructor(root) {
    this.root = root;
    this.avatar = root.querySelector(".assistant-rail__avatar");
    this.panel = root.querySelector(".assistant-rail__panel");
    this.isExpanded = false;
    this.pointerQuery = window.matchMedia("(pointer: coarse)");
    this.isCoarse = this.pointerQuery.matches;

    this.handlePointerChange = (event) => {
      this.isCoarse = event.matches;
      if (!this.isCoarse) {
        this.collapse();
      }
    };

    if (this.pointerQuery.addEventListener) {
      this.pointerQuery.addEventListener("change", this.handlePointerChange);
    } else if (this.pointerQuery.addListener) {
      this.pointerQuery.addListener(this.handlePointerChange);
    }

    this.bindEvents();
    this.update();
  }

  bindEvents() {
    if (!this.avatar || !this.panel) return;

    // タッチ操作時のクリックトグル
    this.avatar.addEventListener("click", (event) => {
      if (!this.isCoarse) return;
      event.preventDefault();
      this.toggle();
    });

    // ホバーで展開
    this.avatar.addEventListener("mouseenter", () => {
      if (this.isCoarse) return;
      this.expand();
    });

    // パネルにマウスが入ったら展開状態を維持
    this.panel.addEventListener("mouseenter", () => {
      if (this.isCoarse) return;
      this.expand();
    });

    // パネルからマウスが出たら collapse 判定（遅延付き）
    this.panel.addEventListener("mouseleave", () => {
      if (this.isCoarse) return;
      this.delayedCollapse();
    });

    // avatar からマウスが出たときも collapse 判定（遅延付き）
    this.avatar.addEventListener("mouseleave", () => {
      if (this.isCoarse) return;
      this.delayedCollapse();
    });

    // フォーカス制御（キーボード操作用）
    this.avatar.addEventListener("focus", () => this.expand());
    this.avatar.addEventListener("blur", () => {
      if (this.isCoarse) return;
      this.delayedCollapse();
    });
  }

  delayedCollapse() {
    setTimeout(() => {
      const stillHovered =
        this.avatar.matches(":hover") || this.panel.matches(":hover");
      if (!stillHovered) {
        this.collapse();
      }
    }, 200); // 200msくらいが自然
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
    this.isExpanded = false;
    this.update();
  }

  update() {
    this.root.dataset.expanded = this.isExpanded ? "true" : "false";
    if (this.avatar) {
      this.avatar.setAttribute("aria-expanded", this.isExpanded ? "true" : "false");
    }
    if (this.panel) {
      this.panel.setAttribute("aria-hidden", this.isExpanded ? "false" : "true");
    }
  }
}

const initAssistantRail = () => {
  const widget = document.querySelector(".assistant-rail");
  if (!widget) return;
  new AssistantRail(widget);
};

initAssistantRail();
