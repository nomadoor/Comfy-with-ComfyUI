---
layout: page.njk
lang: en
slug: contact
navId: contact
title: "Contact"
created: 2026-02-17
updated: 2026-03-02
summary: "Site corrections, article requests, and operator contact"
permalink: "/{{ lang }}/{{ slug }}/"
tags:
  - contact
hero:
  image: "https://i.gyazo.com/ba9d047c28a5a0157ea93a1ef6779838.png"
---

## Site Requests

Use this page to send typo/bug reports, article requests, or general feedback.
Choose one of the cards below based on your request.

This content is sent anonymously to [GitHub Issues](https://github.com/nomadoor/Comfy-with-ComfyUI/issues). If you are familiar with GitHub, direct posting is also welcome.

<div data-contact-page>
<div class="contact-page__site-card contact-page__site-card--stacked">
<div class="contact-page__segment" data-contact-segment role="group" aria-label="Contact type">
<button type="button" class="contact-page__segment-btn is-active" data-contact-type-btn="fix" aria-pressed="true"><span class="contact-page__segment-label">Fix / Typo Report</span></button>
<button type="button" class="contact-page__segment-btn" data-contact-type-btn="request" aria-pressed="false"><span class="contact-page__segment-label">Article Request</span></button>
<button type="button" class="contact-page__segment-btn" data-contact-type-btn="feedback" aria-pressed="false"><span class="contact-page__segment-label">Feedback / Other</span></button>
</div>
<form class="contact-page__form" data-contact-form="fix" data-contact-message-min-length="20" novalidate>
<p class="contact-page__form-description">
If you found incorrect or outdated content, please send the page URL and details below.
</p>
<label class="contact-page__field">
<span class="contact-page__field-label">Page URL</span>
<span class="contact-page__field-meta is-required">Required</span>
<input type="text" name="page_url" required placeholder="Example: /en/begin-with/how-to-use-this-site/" data-contact-fix-url />
</label>
<label class="contact-page__field">
<span class="contact-page__field-label">Details</span>
<span class="contact-page__field-meta is-required">Required</span>
<textarea name="message" rows="5" required placeholder="Describe what is wrong and what happens."></textarea>
</label>
<label class="contact-page__field">
<span class="contact-page__field-label">Screenshot / Log</span>
<span class="contact-page__field-meta is-optional">Optional</span>
<textarea name="extra" rows="3" placeholder="Logs, error text, repro steps, etc."></textarea>
</label>
<div class="contact-page__actions">
<p class="contact-page__status" data-contact-status aria-live="polite"></p>
<button type="button" class="contact-page__submit" data-contact-submit data-contact-submit-type="form-correction"><span class="contact-page__submit-label">Go to confirmation</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
</div>
<div class="contact-page__confirm" data-contact-confirm hidden>
<p class="contact-page__confirm-title">Please confirm before sending.</p>
<pre class="contact-page__confirm-message" data-contact-confirm-message></pre>
<div class="contact-page__actions contact-page__actions--confirm">
<p class="contact-page__status" data-contact-status aria-live="polite"></p>
<div class="contact-page__confirm-controls">
<div class="contact-page__turnstile" data-contact-turnstile data-sitekey="{{ env.assistantTurnstileSitekey or site.turnstileSiteKey or '' }}"></div>
<div class="contact-page__confirm-buttons">
<button type="button" class="contact-page__submit" data-contact-confirm-back><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg><span class="contact-page__submit-label">Back to edit</span></button>
<button type="button" class="contact-page__submit" data-contact-confirm-send><span class="contact-page__submit-label">Send this content</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
</div>
</div>
</div>
</div>
</form>
<form class="contact-page__form" data-contact-form="request" hidden novalidate>
<p class="contact-page__form-description">
If there is a ComfyUI feature or AI topic you want explained, feel free to request it.<br>
This site aims to stay simple, so I cannot promise everything will be added, but I will try to cover it in some format.
</p>
<label class="contact-page__field">
<span class="contact-page__field-label">Topic</span>
<span class="contact-page__field-meta is-required">Required</span>
<input type="text" name="topic" required placeholder="Example: Detailed Flux.1 Tools settings" />
</label>
<label class="contact-page__field">
<span class="contact-page__field-label">What you expect</span>
<span class="contact-page__field-meta is-optional">Optional</span>
<textarea name="expectation" rows="4" placeholder="Briefly describe what part you want to learn"></textarea>
</label>
<div class="contact-page__actions">
<p class="contact-page__status" data-contact-status aria-live="polite"></p>
<button type="button" class="contact-page__submit" data-contact-submit data-contact-submit-type="form-request"><span class="contact-page__submit-label">Review</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
</div>
<div class="contact-page__confirm" data-contact-confirm hidden>
<p class="contact-page__confirm-title">Please confirm before sending.</p>
<pre class="contact-page__confirm-message" data-contact-confirm-message></pre>
<div class="contact-page__actions contact-page__actions--confirm">
<p class="contact-page__status" data-contact-status aria-live="polite"></p>
<div class="contact-page__confirm-controls">
<div class="contact-page__turnstile" data-contact-turnstile data-sitekey="{{ env.assistantTurnstileSitekey or site.turnstileSiteKey or '' }}"></div>
<div class="contact-page__confirm-buttons">
<button type="button" class="contact-page__submit" data-contact-confirm-back><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg><span class="contact-page__submit-label">Back to edit</span></button>
<button type="button" class="contact-page__submit" data-contact-confirm-send><span class="contact-page__submit-label">Send this content</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
</div>
</div>
</div>
</div>
</form>
<form class="contact-page__form" data-contact-form="feedback" data-contact-message-min-length="20" hidden novalidate>
<p class="contact-page__form-description">
Any feedback helps, whether praise, criticism, or anything else. Thank you as always.
</p>
<label class="contact-page__field">
<span class="contact-page__field-label">Message</span>
<span class="contact-page__field-meta is-required">Required</span>
<textarea name="message" rows="5" required placeholder="Feedback, ideas, or other notes"></textarea>
</label>
<div class="contact-page__consent" role="group" aria-label="Citation permission">
<span class="contact-page__consent-label">Allow this content to be cited/quoted on the site</span>
<div class="contact-page__consent-segment">
<label class="contact-page__consent-option">
<input type="radio" name="publish_permission" value="allow" />
<span>Allow</span>
</label>
<label class="contact-page__consent-option">
<input type="radio" name="publish_permission" value="deny" checked />
<span>Do not allow</span>
</label>
</div>
</div>
<div class="contact-page__actions">
<p class="contact-page__status" data-contact-status aria-live="polite"></p>
<button type="button" class="contact-page__submit" data-contact-submit data-contact-submit-type="form-feedback"><span class="contact-page__submit-label">Review</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
</div>
<div class="contact-page__confirm" data-contact-confirm hidden>
<p class="contact-page__confirm-title">Please confirm before sending.</p>
<pre class="contact-page__confirm-message" data-contact-confirm-message></pre>
<div class="contact-page__actions contact-page__actions--confirm">
<p class="contact-page__status" data-contact-status aria-live="polite"></p>
<div class="contact-page__confirm-controls">
<div class="contact-page__turnstile" data-contact-turnstile data-sitekey="{{ env.assistantTurnstileSitekey or site.turnstileSiteKey or '' }}"></div>
<div class="contact-page__confirm-buttons">
<button type="button" class="contact-page__submit" data-contact-confirm-back><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg><span class="contact-page__submit-label">Back to edit</span></button>
<button type="button" class="contact-page__submit" data-contact-confirm-send><span class="contact-page__submit-label">Send this content</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
</div>
</div>
</div>
</div>
</form>
</div>
</div>

## About the Operator

![](https://gyazo.com/b2e27b1ad9320212da03b23da92de02d){gyazo=image}

**nomadoor**

I am one of the people deeply fascinated by image-generation AI since the early Midjourney era.

Rather than only thinking "how to make images with AI," I usually focus on "what new things AI makes possible."

I am not exactly a designer, engineer, or creator in the strict sense, but I have continued researching open-source image/video models since Stable Diffusion 1.5. I may be able to help with your case.

- Twitter : [@noma_door](https://x.com/noma_door)
- Reddit : [u/nomadoor](https://www.reddit.com/user/nomadoor/)
- GitHub : [nomadoor](https://github.com/nomadoor)


<div class="contact-page__site-card">
<form class="contact-page__form" data-operator-form novalidate>
<p class="contact-page__form-heading"><span class="contact-page__segment-label">Contact</span></p>
<p class="contact-page__form-description">ComfyUI workflow setup/tuning, troubleshooting, and technical guidance (for example: what you should actually use). Work inquiries and small questions are both welcome.
</p>
<label class="contact-page__field">
    <span class="contact-page__field-label">Reply-to Email</span>
    <span class="contact-page__field-meta is-required">Required</span>
    <input type="email" name="reply_to" required placeholder="you@example.com" />
  </label>
  <label class="contact-page__field">
    <span class="contact-page__field-label">Name</span>
    <span class="contact-page__field-meta is-optional">Optional</span>
    <input type="text" name="name" placeholder="Example: nomadoor" />
  </label>
  <label class="contact-page__field">
    <span class="contact-page__field-label">Category</span>
    <span class="contact-page__field-meta is-required">Required</span>
    <div class="contact-page__category-select" data-contact-category>
      <input type="hidden" name="category" value="" required data-contact-category-input />
      <button
        type="button"
        class="contact-page__category-trigger"
        data-contact-category-toggle
        aria-haspopup="listbox"
        aria-expanded="false"
      >
        <span data-contact-category-label>Please select</span>
        <span class="contact-page__category-caret" aria-hidden="true">
          <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </span>
      </button>
      <div class="contact-page__category-menu" data-contact-category-menu role="listbox" hidden>
        <button type="button" class="contact-page__category-option" data-contact-category-option data-value="comfyui-consulting">ComfyUI Consulting (Troubleshooting / Workflow)</button>
        <button type="button" class="contact-page__category-option" data-contact-category-option data-value="genai-dev">GenAI / Custom Nodes (Tech / Development)</button>
        <button type="button" class="contact-page__category-option" data-contact-category-option data-value="business">Work Inquiry (Request / Estimate)</button>
        <button type="button" class="contact-page__category-option" data-contact-category-option data-value="other">Other</button>
      </div>
    </div>
  </label>
  <label class="contact-page__field">
    <span class="contact-page__field-label">Message</span>
    <span class="contact-page__field-meta is-required">Required</span>
    <textarea name="body" rows="6" required placeholder="Details of your inquiry / request"></textarea>
  </label>
  <div class="contact-page__actions contact-page__actions--operator">
    <p class="contact-page__status" data-operator-status aria-live="polite"></p>
    <button type="button" class="contact-page__submit" data-operator-preview><span class="contact-page__submit-label">Review</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
  </div>
  <div class="contact-page__confirm" data-operator-confirm hidden>
    <p class="contact-page__confirm-title">Please confirm before sending.</p>
    <pre class="contact-page__confirm-message" data-operator-confirm-message></pre>
    <div class="contact-page__actions contact-page__actions--confirm contact-page__actions--operator">
      <p class="contact-page__status" data-operator-status aria-live="polite"></p>
      <div class="contact-page__operator-controls">
        <div class="contact-page__turnstile" data-operator-turnstile data-sitekey="{{ env.assistantTurnstileSitekey or site.turnstileSiteKey or '' }}"></div>
        <div class="contact-page__operator-confirm-buttons">
          <button type="button" class="contact-page__submit" data-operator-confirm-back><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg><span class="contact-page__submit-label">Back to edit</span></button>
          <button type="submit" class="contact-page__submit" data-operator-send><span class="contact-page__submit-label">Send this content</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
        </div>
      </div>
    </div>
  </div>
  <p class="contact-page__fallback-link">If sending fails: <a href="mailto:nomadoor@gmail.com">nomadoor@gmail.com</a></p>
</form>
</div>

## Support

You do not need to pay to read this site or ask for help.

That said, support is always appreciated.

- [☕ Support me on Ko-fi](https://ko-fi.com/nomadoor)
- [♥️ Become a GitHub Sponsor](https://github.com/sponsors/nomadoor/)
