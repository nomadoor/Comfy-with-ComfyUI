---
layout: page.njk
lang: en
slug: contact
navId: contact
title: "Contact"
summary: "Site corrections, article requests, and operator contact"
permalink: "/{{ lang }}/{{ slug }}/"
tags:
  - contact
hero:
  image: "https://i.gyazo.com/ba9d047c28a5a0157ea93a1ef6779838.png"
---

## サイトに関すること

このサイトの誤字・不具合報告、記事リクエスト、感想・その他の連絡を送れます。  
内容にあわせて、下のカードを選んでください。

この内容は匿名で  [GitHub issue](https://github.com/nomadoor/Comfy-with-ComfyUI/issues) に送られます。GitHubに慣れている方は直接投稿していただいても構いません。

<div data-contact-page>
<div class="contact-page__site-card contact-page__site-card--stacked">
<div class="contact-page__segment" data-contact-segment role="group" aria-label="問い合わせ種別">
<button type="button" class="contact-page__segment-btn is-active" data-contact-type-btn="fix" aria-pressed="true"><span class="contact-page__segment-label">修正・誤字報告</span></button>
<button type="button" class="contact-page__segment-btn" data-contact-type-btn="request" aria-pressed="false"><span class="contact-page__segment-label">記事リクエスト</span></button>
<button type="button" class="contact-page__segment-btn" data-contact-type-btn="feedback" aria-pressed="false"><span class="contact-page__segment-label">感想・その他</span></button>
</div>
<form class="contact-page__form" data-contact-form="fix" data-contact-message-min-length="20" novalidate>
<p class="contact-page__form-description">
内容の不備・誤字などがあった場合は、対象ページのURLとともに、以下のフォームよりお知らせください。
</p>
<label class="contact-page__field">
<span class="contact-page__field-label">対象ページURL</span>
<span class="contact-page__field-meta is-required">必須</span>
<input type="text" name="page_url" required placeholder="例: /en/begin-with/how-to-use-this-site/" data-contact-fix-url />
</label>
<label class="contact-page__field">
<span class="contact-page__field-label">内容</span>
<span class="contact-page__field-meta is-required">必須</span>
<textarea name="message" rows="5" required placeholder="どこが間違っているか、何が起きるかを記載してください。"></textarea>
</label>
<label class="contact-page__field">
<span class="contact-page__field-label">スクショ / ログ</span>
<span class="contact-page__field-meta is-optional">任意</span>
<textarea name="extra" rows="3" placeholder="ログ、エラー文、再現手順など"></textarea>
</label>
<div class="contact-page__actions">
<p class="contact-page__status" data-contact-status aria-live="polite"></p>
<button type="button" class="contact-page__submit" data-contact-submit data-contact-submit-type="form-correction"><span class="contact-page__submit-label">確認画面へ進む</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
</div>
<div class="contact-page__confirm" data-contact-confirm hidden>
<p class="contact-page__confirm-title">送信内容を確認してください。</p>
<pre class="contact-page__confirm-message" data-contact-confirm-message></pre>
<div class="contact-page__actions contact-page__actions--confirm">
<p class="contact-page__status" data-contact-status aria-live="polite"></p>
<div class="contact-page__confirm-controls">
<div class="contact-page__turnstile" data-contact-turnstile data-sitekey="{{ site.turnstileSiteKey or 'TURNSTILE_SITEKEY' }}"></div>
<div class="contact-page__confirm-buttons">
<button type="button" class="contact-page__submit" data-contact-confirm-back><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg><span class="contact-page__submit-label">編集に戻る</span></button>
<button type="button" class="contact-page__submit" data-contact-confirm-send><span class="contact-page__submit-label">この内容で送信</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
</div>
</div>
</div>
</div>
</form>
<form class="contact-page__form" data-contact-form="request" hidden novalidate>
<p class="contact-page__form-description">
なにか解説して欲しいComfyUIの機能、AIの技術などがあれば気軽にリクエストしてください。</br>
このサイトはシンプルを心がけているので追加できるかはわかりませんが、なにかしらの媒体で対応したいと思います。
</p>
<label class="contact-page__field">
<span class="contact-page__field-label">テーマ</span>
<span class="contact-page__field-meta is-required">必須</span>
<input type="text" name="topic" required placeholder="例: Flux.1 Tools の設定詳細" />
</label>
<label class="contact-page__field">
<span class="contact-page__field-label">期待する内容</span>
<span class="contact-page__field-meta is-optional">任意</span>
<textarea name="expectation" rows="4" placeholder="どの部分を知りたいかを短く"></textarea>
</label>
<div class="contact-page__actions">
<p class="contact-page__status" data-contact-status aria-live="polite"></p>
<button type="button" class="contact-page__submit" data-contact-submit data-contact-submit-type="form-request"><span class="contact-page__submit-label">確認する</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
</div>
<div class="contact-page__confirm" data-contact-confirm hidden>
<p class="contact-page__confirm-title">送信内容を確認してください。</p>
<pre class="contact-page__confirm-message" data-contact-confirm-message></pre>
<div class="contact-page__actions contact-page__actions--confirm">
<p class="contact-page__status" data-contact-status aria-live="polite"></p>
<div class="contact-page__confirm-controls">
<div class="contact-page__turnstile" data-contact-turnstile data-sitekey="{{ site.turnstileSiteKey or 'TURNSTILE_SITEKEY' }}"></div>
<div class="contact-page__confirm-buttons">
<button type="button" class="contact-page__submit" data-contact-confirm-back><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg><span class="contact-page__submit-label">編集に戻る</span></button>
<button type="button" class="contact-page__submit" data-contact-confirm-send><span class="contact-page__submit-label">この内容で送信</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
</div>
</div>
</div>
</div>
</form>
<form class="contact-page__form" data-contact-form="feedback" data-contact-message-min-length="20" hidden novalidate>
<p class="contact-page__form-description">
応援の言葉、お叱りの言葉、どんなものでもモチベーションになります。いつもありがとうございます！
</p>
<label class="contact-page__field">
<span class="contact-page__field-label">内容</span>
<span class="contact-page__field-meta is-required">必須</span>
<textarea name="message" rows="5" required placeholder="感想、気づいたこと、その他の連絡"></textarea>
</label>
<div class="contact-page__consent" role="group" aria-label="掲載・引用可否">
<span class="contact-page__consent-label">この内容をサイトに掲載/引用</span>
<div class="contact-page__consent-segment">
<label class="contact-page__consent-option">
<input type="radio" name="publish_permission" value="allow" />
<span>して良い</span>
</label>
<label class="contact-page__consent-option">
<input type="radio" name="publish_permission" value="deny" checked />
<span>しないでほしい</span>
</label>
</div>
</div>
<div class="contact-page__actions">
<p class="contact-page__status" data-contact-status aria-live="polite"></p>
<button type="button" class="contact-page__submit" data-contact-submit data-contact-submit-type="form-feedback"><span class="contact-page__submit-label">確認する</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
</div>
<div class="contact-page__confirm" data-contact-confirm hidden>
<p class="contact-page__confirm-title">送信内容を確認してください。</p>
<pre class="contact-page__confirm-message" data-contact-confirm-message></pre>
<div class="contact-page__actions contact-page__actions--confirm">
<p class="contact-page__status" data-contact-status aria-live="polite"></p>
<div class="contact-page__confirm-controls">
<div class="contact-page__turnstile" data-contact-turnstile data-sitekey="{{ site.turnstileSiteKey or 'TURNSTILE_SITEKEY' }}"></div>
<div class="contact-page__confirm-buttons">
<button type="button" class="contact-page__submit" data-contact-confirm-back><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg><span class="contact-page__submit-label">編集に戻る</span></button>
<button type="button" class="contact-page__submit" data-contact-confirm-send><span class="contact-page__submit-label">この内容で送信</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
</div>
</div>
</div>
</div>
</form>
</div>
</div>

## このサイトを作った人

![](https://gyazo.com/b2e27b1ad9320212da03b23da92de02d){gyazo=image}

**nomadoor (ノマドア)**

Midjourneyの登場で幕を開けた画像生成AIの魅力に取りつかれた人間の一人です。

“AIでイラストを作る”というより、“AIで新しく何ができるか”ということを考えることが多いでしょうか。

デザイナーともエンジニアともクリエイターとも言えない中途半端な存在ですが、Stable Diffusion 1.5が登場したときからオープンソースの画像／動画生成モデルを調べ続けているので、なにかお力になれるかもしれません。

- Twitter : [@noma_door](https://x.com/noma_door)
- Reddit : [u/nomadoor](https://www.reddit.com/user/nomadoor/)
- GitHub : [nomadoor](https://github.com/nomadoor)


<div class="contact-page__site-card">
<form class="contact-page__form" data-operator-form novalidate>
<p class="contact-page__form-heading"><span class="contact-page__segment-label">お問い合わせ</span></p>
<p class="contact-page__form-description">ComfyUIのworkflow構築・調整、トラブルシューティング、技術の整理（結局どれを使えばいいのか、みたいな話）など。仕事の相談でも、ちょっとした質問でも歓迎です。お気軽にご連絡ください。
</p>
<label class="contact-page__field">
    <span class="contact-page__field-label">返信用メールアドレス</span>
    <span class="contact-page__field-meta is-required">必須</span>
    <input type="email" name="reply_to" required placeholder="you@example.com" />
  </label>
  <label class="contact-page__field">
    <span class="contact-page__field-label">お名前</span>
    <span class="contact-page__field-meta is-optional">任意</span>
    <input type="text" name="name" placeholder="例: nomadoor" />
  </label>
  <label class="contact-page__field">
    <span class="contact-page__field-label">ご要件</span>
    <span class="contact-page__field-meta is-required">必須</span>
    <div class="contact-page__category-select" data-contact-category>
      <input type="hidden" name="category" value="" required data-contact-category-input />
      <button
        type="button"
        class="contact-page__category-trigger"
        data-contact-category-toggle
        aria-haspopup="listbox"
        aria-expanded="false"
      >
        <span data-contact-category-label>選択してください</span>
        <span class="contact-page__category-caret" aria-hidden="true">
          <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </span>
      </button>
      <div class="contact-page__category-menu" data-contact-category-menu role="listbox" hidden>
        <button type="button" class="contact-page__category-option" data-contact-category-option data-value="comfyui-consulting">ComfyUIの相談（トラブル／ワークフロー）</button>
        <button type="button" class="contact-page__category-option" data-contact-category-option data-value="genai-dev">生成AI / カスタムノード（技術・開発）</button>
        <button type="button" class="contact-page__category-option" data-contact-category-option data-value="business">仕事の相談（依頼／見積）</button>
        <button type="button" class="contact-page__category-option" data-contact-category-option data-value="other">その他</button>
      </div>
    </div>
  </label>
  <label class="contact-page__field">
    <span class="contact-page__field-label">ご相談内容</span>
    <span class="contact-page__field-meta is-required">必須</span>
    <textarea name="body" rows="6" required placeholder="相談内容 / 依頼内容"></textarea>
  </label>
  <div class="contact-page__actions contact-page__actions--operator">
    <p class="contact-page__status" data-operator-status aria-live="polite"></p>
    <button type="button" class="contact-page__submit" data-operator-preview><span class="contact-page__submit-label">確認する</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
  </div>
  <div class="contact-page__confirm" data-operator-confirm hidden>
    <p class="contact-page__confirm-title">送信内容を確認してください。</p>
    <pre class="contact-page__confirm-message" data-operator-confirm-message></pre>
    <div class="contact-page__actions contact-page__actions--confirm contact-page__actions--operator">
      <p class="contact-page__status" data-operator-status aria-live="polite"></p>
      <div class="contact-page__operator-controls">
        <div class="contact-page__turnstile" data-operator-turnstile data-sitekey="{{ site.turnstileSiteKey or 'TURNSTILE_SITEKEY' }}"></div>
        <div class="contact-page__operator-confirm-buttons">
          <button type="button" class="contact-page__submit" data-operator-confirm-back><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg><span class="contact-page__submit-label">編集に戻る</span></button>
          <button type="submit" class="contact-page__submit" data-operator-send><span class="contact-page__submit-label">この内容で送信</span><svg class="icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
        </div>
      </div>
    </div>
  </div>
  <p class="contact-page__fallback-link">送れない場合はこちら: <a href="mailto:nomadoor@gmail.com">nomadoor@gmail.com</a></p>
</form>
</div>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

## サポートのお願い

このサイトを見るのにも、私に助けを求めるのにもお金は必要ありません。

とはいえ、もしサポートいただけると、とてもとてもとても嬉しいです🙏。

- [☕ Ko-fiで支援する / Support me on Ko-fi](https://ko-fi.com/nomadoor)
- [♥️ GitHubスポンサーになる](https://github.com/sponsors/nomadoor/)
