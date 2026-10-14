// UI strings that only the browser scripts show (search history, lightbox controls, contact form
// messages). Strings the templates render come from src/_data/site.json instead. Each table has a
// ja, en and zh entry; localized() picks the page's language and falls back to Japanese, the
// site's source language.
const LANGS = ["ja", "en", "zh"];

export function pageLang(preferred) {
  const raw = String(preferred || document.documentElement.lang || "ja").toLowerCase().trim().split("-")[0];
  return LANGS.includes(raw) ? raw : "ja";
}

export const localized = (table, preferred) => table[pageLang(preferred)] || table.ja;

// Header search: the recent-searches list.
export const SEARCH_STRINGS = {
  ja: { recent: "最近の検索", clear: "履歴をクリア", fromHistory: "履歴" },
  en: { recent: "Recent searches", clear: "Clear history", fromHistory: "History" },
  zh: { recent: "最近搜索", clear: "清除历史", fromHistory: "历史" }
};

// Lightbox controls and their accessible names.
export const LIGHTBOX_STRINGS = {
  ja: {
    dialog: "画像プレビュー",
    close: "閉じる",
    previous: "前の画像",
    next: "次の画像",
    zoomOut: "縮小",
    zoomIn: "拡大",
    reset: "倍率と位置をリセット",
    help: "クリックで拡大・＋／−／ホイール／ピンチで拡大縮小・ドラッグで移動",
  },
  en: {
    dialog: "Image preview",
    close: "Close",
    previous: "Previous image",
    next: "Next image",
    zoomOut: "Zoom out",
    zoomIn: "Zoom in",
    reset: "Reset zoom and position",
    help: "Click to zoom · Use + / −, scroll, or pinch to zoom · Drag to move",
  },
  zh: {
    dialog: "图片预览",
    close: "关闭",
    previous: "上一张图片",
    next: "下一张图片",
    zoomOut: "缩小",
    zoomIn: "放大",
    reset: "重置缩放和位置",
    help: "点击放大・使用＋／−、滚轮或双指缩放・拖动移动",
  },
};

// Labels the contact forms put in front of each line of the message they send.
export const CONTACT_FORM_STRINGS = {
  ja: {
    categoryPlaceholder: "選択してください",
    pageUrl: "対象ページ:",
    content: "内容:",
    screenshotLog: "スクショ/ログ:",
    topic: "テーマ:",
    expectation: "期待する内容:",
    publishAllowSentence: "この内容をサイトに掲載/引用して良い",
    publishDenySentence: "この内容をサイトに掲載/引用しないでほしい",
    replyTo: "返信用メールアドレス:",
    name: "お名前:",
    category: "ご要件:",
    body: "ご相談内容:",
    environment: "環境:"
  },
  en: {
    categoryPlaceholder: "Please select",
    pageUrl: "Page URL:",
    content: "Details:",
    screenshotLog: "Screenshot/Log:",
    topic: "Topic:",
    expectation: "What you expect:",
    publishAllowSentence: "Allow this content to be cited/quoted on the site",
    publishDenySentence: "Do not allow this content to be cited/quoted on the site",
    replyTo: "Reply-to Email:",
    name: "Name:",
    category: "Category:",
    body: "Message:",
    environment: "Environment:"
  },
  zh: {
    categoryPlaceholder: "请选择",
    pageUrl: "目标页面 URL:",
    content: "内容:",
    screenshotLog: "截图/日志:",
    topic: "主题:",
    expectation: "期望内容:",
    publishAllowSentence: "允许在本站刊登/引用这条内容",
    publishDenySentence: "不允许在本站刊登/引用这条内容",
    replyTo: "回复邮箱地址:",
    name: "姓名:",
    category: "需求分类:",
    body: "咨询内容:",
    environment: "环境:"
  }
};

// Contact page status lines. A data-status-* attribute on the page overrides these.
export const CONTACT_STATUS_STRINGS = {
  ja: {
    sent: "投稿しました。ありがとうございます。",
    error: "送信に失敗しました。時間をおいて再試行してください。",
    turnstile: "認証を完了してください。",
    turnstileUnavailable: "認証ウィジェットを読み込めませんでした。通信設定やブロッカーを確認してください。",
    minLength: "20文字以上で入力してください。",
    operatorSending: "送信中です...",
    operatorSent: "送信しました。ありがとうございます。",
    operatorTurnstile: "認証に失敗しました。再度お試しください。",
    operatorTurnstileUnavailable: "認証ウィジェットを読み込めませんでした。通信設定やブロッカーを確認してください。",
    operatorInvalid: "入力内容を確認してください。",
    operatorConfig: "サーバ設定エラーです。管理者に連絡してください。",
    operatorError: "送信に失敗しました。時間をおいて再試行してください。"
  },
  en: {
    sent: "Sent. Thank you.",
    error: "Failed to send. Please try again shortly.",
    turnstile: "Please complete the verification.",
    turnstileUnavailable: "Could not load the verification widget. Please check network settings or blockers.",
    minLength: "Please enter at least 20 characters.",
    operatorSending: "Sending...",
    operatorSent: "Sent. Thank you.",
    operatorTurnstile: "Verification failed. Please try again.",
    operatorTurnstileUnavailable: "Could not load the verification widget. Please check network settings or blockers.",
    operatorInvalid: "Please check your input.",
    operatorConfig: "Server configuration error. Please contact the administrator.",
    operatorError: "Failed to send. Please try again shortly."
  },
  zh: {
    sent: "已提交，感谢你的反馈。",
    error: "发送失败，请稍后重试。",
    turnstile: "请完成验证。",
    turnstileUnavailable: "无法加载验证组件，请检查网络设置或拦截插件。",
    minLength: "请输入至少 20 个字符。",
    operatorSending: "发送中...",
    operatorSent: "已发送，感谢你的联系。",
    operatorTurnstile: "验证失败，请重试。",
    operatorTurnstileUnavailable: "无法加载验证组件，请检查网络设置或拦截插件。",
    operatorInvalid: "请检查输入内容。",
    operatorConfig: "服务器配置错误，请联系管理员。",
    operatorError: "发送失败，请稍后重试。"
  }
};

// The confirmation preview shows a line starting with one of these as "label + value". Kept as a
// flat list across languages (not derived from CONTACT_FORM_STRINGS): the shorter Japanese prefix
// for the publish sentence is intentional and changes how that line is split.
export const CONTACT_CONFIRM_LABEL_PREFIXES = [
  "対象ページ:",
  "Page URL:",
  "目标页面 URL:",
  "内容:",
  "Details:",
  "内容:",
  "スクショ/ログ:",
  "Screenshot/Log:",
  "截图/日志:",
  "テーマ:",
  "Topic:",
  "主题:",
  "期待する内容:",
  "What you expect:",
  "期望内容:",
  "この内容をサイトに掲載/引用",
  "Allow this content to be cited/quoted on the site",
  "Do not allow this content to be cited/quoted on the site",
  "是否允许在本站刊登/引用这条内容",
  "允许在本站刊登/引用这条内容",
  "不允许在本站刊登/引用这条内容",
  "返信用メールアドレス:",
  "Reply-to Email:",
  "回复邮箱地址:",
  "お名前:",
  "Name:",
  "姓名:",
  "ご要件:",
  "Category:",
  "需求分类:",
  "ご相談内容:",
  "Message:",
  "咨询内容:",
  "環境:",
  "Environment:",
  "环境:"
];

// Lines that only repeat the chosen form type and are left out of the confirmation preview.
export const CONTACT_CONFIRM_HIDDEN_LINES = new Set([
  "記事リクエスト",
  "修正・誤字報告",
  "感想・その他"
]);

// Assistant rail: the publish-permission sentence added to a message.
export const ASSISTANT_PUBLISH_STRINGS = {
  ja: {
    allow: "この内容をサイトに掲載/引用して良い",
    deny: "この内容をサイトに掲載/引用しないでほしい"
  },
  en: {
    allow: "This content may be cited/quoted on the site.",
    deny: "Please do not cite/quote this content on the site."
  },
  zh: {
    allow: "此内容可以在网站上引用/刊登。",
    deny: "请不要在网站上引用/刊登此内容。"
  }
};
