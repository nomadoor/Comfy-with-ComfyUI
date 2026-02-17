---
layout: page.njk
lang: zh
slug: contact
navId: contact
title: "联系我们"
summary: "站点修正、文章请求与运营者联系"
permalink: "/{{ lang }}/{{ slug }}/"
tags:
  - contact
hero:
  image: "https://i.gyazo.com/ba9d047c28a5a0157ea93a1ef6779838.png"
---

## 关于本站的反馈

你可以在这里提交错字/错误反馈、文章请求，或其他意见。  
请根据内容选择下方对应卡片。

这些内容会匿名发送到 [GitHub issue](https://github.com/nomadoor/Comfy-with-ComfyUI/issues)。如果你熟悉 GitHub，也欢迎直接在仓库提交。

<div data-contact-page>
<div class="contact-page__site-card contact-page__site-card--stacked">
<div class="contact-page__segment" data-contact-segment role="group" aria-label="联系类型">
<button type="button" class="contact-page__segment-btn is-active" data-contact-type-btn="fix" aria-pressed="true"><span class="contact-page__segment-label">修正 / 错字反馈</span></button>
<button type="button" class="contact-page__segment-btn" data-contact-type-btn="request" aria-pressed="false"><span class="contact-page__segment-label">文章请求</span></button>
<button type="button" class="contact-page__segment-btn" data-contact-type-btn="feedback" aria-pressed="false"><span class="contact-page__segment-label">感想 / 其他</span></button>
</div>
<form class="contact-page__form" data-contact-form="fix" data-contact-message-min-length="20" novalidate>
<p class="contact-page__form-description">
如果你发现内容错误或错字，请连同目标页面 URL 一起通过下列表单提交。
</p>
<label class="contact-page__field">
<span class="contact-page__field-label">目标页面 URL</span>
<span class="contact-page__field-meta is-required">必填</span>
<input type="text" name="page_url" required placeholder="例如: /zh/begin-with/how-to-use-this-site/" data-contact-fix-url />
</label>
<label class="contact-page__field">
<span class="contact-page__field-label">内容</span>
<span class="contact-page__field-meta is-required">必填</span>
<textarea name="message" rows="5" required placeholder="请说明哪里有问题，以及出现了什么情况。"></textarea>
</label>
<label class="contact-page__field">
<span class="contact-page__field-label">截图 / 日志</span>
<span class="contact-page__field-meta is-optional">选填</span>
<textarea name="extra" rows="3" placeholder="日志、报错信息、复现步骤等"></textarea>
</label>
<div class="contact-page__actions">
<p class="contact-page__status" data-contact-status aria-live="polite"></p>
<button type="button" class="contact-page__submit" data-contact-submit data-contact-submit-type="form-correction"><span class="contact-page__submit-label">进入确认页</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
</div>
<div class="contact-page__confirm" data-contact-confirm hidden>
<p class="contact-page__confirm-title">请在发送前确认内容。</p>
<pre class="contact-page__confirm-message" data-contact-confirm-message></pre>
<div class="contact-page__actions contact-page__actions--confirm">
<p class="contact-page__status" data-contact-status aria-live="polite"></p>
<div class="contact-page__confirm-controls">
<div class="contact-page__turnstile" data-contact-turnstile data-sitekey="{{ env.assistantTurnstileSitekey or site.turnstileSiteKey or '' }}"></div>
<div class="contact-page__confirm-buttons">
<button type="button" class="contact-page__submit" data-contact-confirm-back><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg><span class="contact-page__submit-label">返回编辑</span></button>
<button type="button" class="contact-page__submit" data-contact-confirm-send><span class="contact-page__submit-label">按此内容发送</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
</div>
</div>
</div>
</div>
</form>
<form class="contact-page__form" data-contact-form="request" hidden novalidate>
<p class="contact-page__form-description">
如果你希望我补充讲解某个 ComfyUI 功能或 AI 技术，欢迎随时提交请求。<br>
本站保持精简，未必都能立刻追加，但我会尽量通过某种形式回应。
</p>
<label class="contact-page__field">
<span class="contact-page__field-label">主题</span>
<span class="contact-page__field-meta is-required">必填</span>
<input type="text" name="topic" required placeholder="例如: Flux.1 Tools 参数详解" />
</label>
<label class="contact-page__field">
<span class="contact-page__field-label">期望内容</span>
<span class="contact-page__field-meta is-optional">选填</span>
<textarea name="expectation" rows="4" placeholder="简要写下你想了解的部分"></textarea>
</label>
<div class="contact-page__actions">
<p class="contact-page__status" data-contact-status aria-live="polite"></p>
<button type="button" class="contact-page__submit" data-contact-submit data-contact-submit-type="form-request"><span class="contact-page__submit-label">确认</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
</div>
<div class="contact-page__confirm" data-contact-confirm hidden>
<p class="contact-page__confirm-title">请在发送前确认内容。</p>
<pre class="contact-page__confirm-message" data-contact-confirm-message></pre>
<div class="contact-page__actions contact-page__actions--confirm">
<p class="contact-page__status" data-contact-status aria-live="polite"></p>
<div class="contact-page__confirm-controls">
<div class="contact-page__turnstile" data-contact-turnstile data-sitekey="{{ env.assistantTurnstileSitekey or site.turnstileSiteKey or '' }}"></div>
<div class="contact-page__confirm-buttons">
<button type="button" class="contact-page__submit" data-contact-confirm-back><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg><span class="contact-page__submit-label">返回编辑</span></button>
<button type="button" class="contact-page__submit" data-contact-confirm-send><span class="contact-page__submit-label">按此内容发送</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
</div>
</div>
</div>
</div>
</form>
<form class="contact-page__form" data-contact-form="feedback" data-contact-message-min-length="20" hidden novalidate>
<p class="contact-page__form-description">
无论是鼓励、批评还是其他意见，都很有价值。感谢你的支持。
</p>
<label class="contact-page__field">
<span class="contact-page__field-label">内容</span>
<span class="contact-page__field-meta is-required">必填</span>
<textarea name="message" rows="5" required placeholder="感想、发现、其他想说的内容"></textarea>
</label>
<div class="contact-page__consent" role="group" aria-label="刊登/引用许可">
<span class="contact-page__consent-label">是否允许在本站刊登/引用这条内容</span>
<div class="contact-page__consent-segment">
<label class="contact-page__consent-option">
<input type="radio" name="publish_permission" value="allow" />
<span>允许</span>
</label>
<label class="contact-page__consent-option">
<input type="radio" name="publish_permission" value="deny" checked />
<span>不允许</span>
</label>
</div>
</div>
<div class="contact-page__actions">
<p class="contact-page__status" data-contact-status aria-live="polite"></p>
<button type="button" class="contact-page__submit" data-contact-submit data-contact-submit-type="form-feedback"><span class="contact-page__submit-label">确认</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
</div>
<div class="contact-page__confirm" data-contact-confirm hidden>
<p class="contact-page__confirm-title">请在发送前确认内容。</p>
<pre class="contact-page__confirm-message" data-contact-confirm-message></pre>
<div class="contact-page__actions contact-page__actions--confirm">
<p class="contact-page__status" data-contact-status aria-live="polite"></p>
<div class="contact-page__confirm-controls">
<div class="contact-page__turnstile" data-contact-turnstile data-sitekey="{{ env.assistantTurnstileSitekey or site.turnstileSiteKey or '' }}"></div>
<div class="contact-page__confirm-buttons">
<button type="button" class="contact-page__submit" data-contact-confirm-back><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg><span class="contact-page__submit-label">返回编辑</span></button>
<button type="button" class="contact-page__submit" data-contact-confirm-send><span class="contact-page__submit-label">按此内容发送</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
</div>
</div>
</div>
</div>
</form>
</div>
</div>

## 站点运营者

![](https://gyazo.com/b2e27b1ad9320212da03b23da92de02d){gyazo=image}

**nomadoor**

我是被图像生成 AI 深深吸引的一员，从 Midjourney 早期开始一路关注到现在。

相比“用 AI 画图”，我更常思考“AI 还能带来哪些新可能”。

严格来说我既不完全是设计师，也不完全是工程师或创作者，但自 Stable Diffusion 1.5 起我一直在研究开源图像/视频模型，也许能在你的问题上提供帮助。

- Twitter : [@noma_door](https://x.com/noma_door)
- Reddit : [u/nomadoor](https://www.reddit.com/user/nomadoor/)
- GitHub : [nomadoor](https://github.com/nomadoor)


<div class="contact-page__site-card">
<form class="contact-page__form" data-operator-form novalidate>
<p class="contact-page__form-heading"><span class="contact-page__segment-label">联系我们</span></p>
<p class="contact-page__form-description">关于 ComfyUI workflow 的搭建/调优、问题排查、技术整理（比如“到底该用哪个”）等，都可以咨询。无论是工作合作还是一般问题，都欢迎联系。
</p>
<label class="contact-page__field">
    <span class="contact-page__field-label">回复邮箱地址</span>
    <span class="contact-page__field-meta is-required">必填</span>
    <input type="email" name="reply_to" required placeholder="you@example.com" />
  </label>
  <label class="contact-page__field">
    <span class="contact-page__field-label">姓名</span>
    <span class="contact-page__field-meta is-optional">选填</span>
    <input type="text" name="name" placeholder="例如: nomadoor" />
  </label>
  <label class="contact-page__field">
    <span class="contact-page__field-label">需求分类</span>
    <span class="contact-page__field-meta is-required">必填</span>
    <div class="contact-page__category-select" data-contact-category>
      <input type="hidden" name="category" value="" required data-contact-category-input />
      <button
        type="button"
        class="contact-page__category-trigger"
        data-contact-category-toggle
        aria-haspopup="listbox"
        aria-expanded="false"
      >
        <span data-contact-category-label>请选择</span>
        <span class="contact-page__category-caret" aria-hidden="true">
          <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </span>
      </button>
      <div class="contact-page__category-menu" data-contact-category-menu role="listbox" hidden>
        <button type="button" class="contact-page__category-option" data-contact-category-option data-value="comfyui-consulting">ComfyUI 咨询（故障排查 / 工作流）</button>
        <button type="button" class="contact-page__category-option" data-contact-category-option data-value="genai-dev">生成式 AI / 自定义节点（技术 / 开发）</button>
        <button type="button" class="contact-page__category-option" data-contact-category-option data-value="business">商务咨询（委托 / 报价）</button>
        <button type="button" class="contact-page__category-option" data-contact-category-option data-value="other">其他</button>
      </div>
    </div>
  </label>
  <label class="contact-page__field">
    <span class="contact-page__field-label">咨询内容</span>
    <span class="contact-page__field-meta is-required">必填</span>
    <textarea name="body" rows="6" required placeholder="请填写咨询/委托内容"></textarea>
  </label>
  <div class="contact-page__actions contact-page__actions--operator">
    <p class="contact-page__status" data-operator-status aria-live="polite"></p>
    <button type="button" class="contact-page__submit" data-operator-preview><span class="contact-page__submit-label">确认</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
  </div>
  <div class="contact-page__confirm" data-operator-confirm hidden>
    <p class="contact-page__confirm-title">请在发送前确认内容。</p>
    <pre class="contact-page__confirm-message" data-operator-confirm-message></pre>
    <div class="contact-page__actions contact-page__actions--confirm contact-page__actions--operator">
      <p class="contact-page__status" data-operator-status aria-live="polite"></p>
      <div class="contact-page__operator-controls">
        <div class="contact-page__turnstile" data-operator-turnstile data-sitekey="{{ env.assistantTurnstileSitekey or site.turnstileSiteKey or '' }}"></div>
        <div class="contact-page__operator-confirm-buttons">
          <button type="button" class="contact-page__submit" data-operator-confirm-back><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg><span class="contact-page__submit-label">返回编辑</span></button>
          <button type="submit" class="contact-page__submit" data-operator-send><span class="contact-page__submit-label">按此内容发送</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
        </div>
      </div>
    </div>
  </div>
  <p class="contact-page__fallback-link">若发送失败请联系: <a href="mailto:nomadoor@gmail.com">nomadoor@gmail.com</a></p>
</form>
</div>

## 支持本站

浏览本站或向我咨询都不需要付费。

如果愿意支持，我会非常感激。

- [☕ 在 Ko-fi 支持我 / Support me on Ko-fi](https://ko-fi.com/nomadoor)
- [♥️ 成为 GitHub Sponsor](https://github.com/sponsors/nomadoor/)
