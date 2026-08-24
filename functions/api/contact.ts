interface Env {
  TURNSTILE_SECRET: string;
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL: string;
  CONTACT_FROM_EMAIL: string;
}

interface TurnstileVerifyResponse {
  success: boolean;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({
      ok: false,
      error: "method_not_allowed",
      message: "Only POST requests are accepted.",
      resolution: "Submit the contact form as multipart/form-data with POST."
    }), {
      status: 405,
      headers: {
        "Allow": "POST",
        "Content-Type": "application/json; charset=utf-8"
      }
    });
  }

  try {
    const missingEnv = [
      !env.TURNSTILE_SECRET ? "TURNSTILE_SECRET" : "",
      !env.RESEND_API_KEY ? "RESEND_API_KEY" : "",
      !env.CONTACT_TO_EMAIL ? "CONTACT_TO_EMAIL" : "",
      !env.CONTACT_FROM_EMAIL ? "CONTACT_FROM_EMAIL" : ""
    ].filter(Boolean);

    if (missingEnv.length > 0) {
      console.error("[contact] missing required env vars", missingEnv);
      return json({ ok: false, error: "config" }, 500);
    }

    const form = await request.formData();
    const turnstileToken = String(form.get("cf-turnstile-response") || "").trim();

    if (!turnstileToken) {
      return json({ ok: false, error: "turnstile" }, 400);
    }

    const verifyPayload = new URLSearchParams();
    verifyPayload.set("secret", env.TURNSTILE_SECRET);
    verifyPayload.set("response", turnstileToken);

    const ip = request.headers.get("CF-Connecting-IP");
    if (ip) {
      verifyPayload.set("remoteip", ip);
    }

    const verifyResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: verifyPayload
    });

    let verifyJson: TurnstileVerifyResponse | null = null;
    try {
      verifyJson = (await verifyResponse.json()) as TurnstileVerifyResponse;
    } catch (error) {
      verifyJson = null;
    }

    if (!verifyResponse.ok || !verifyJson?.success) {
      return json({ ok: false, error: "turnstile" }, 400);
    }

    const replyTo = String(form.get("reply_to") || "").trim();
    const name = String(form.get("name") || "").trim();
    const category = String(form.get("category") || "").trim();
    const body = String(form.get("body") || "").trim();
    const environment = String(form.get("environment") || "").trim();

    if (!replyTo || !category || !body) {
      return json({ ok: false, error: "invalid" }, 400);
    }

    const subject = "[Comfy with ComfyUI] 個人相談・仕事依頼";
    const categoryLabels: Record<string, string> = {
      "comfyui-consulting": "ComfyUIの相談（トラブル／ワークフロー）",
      "genai-dev": "生成AI / カスタムノード（技術・開発）",
      "business": "仕事の相談（依頼／見積）",
      "other": "その他"
    };
    const categoryLabel = categoryLabels[category] || category;
    const lines = [
      "[Contact] 個人相談・仕事依頼",
      `返信用メールアドレス: ${replyTo}`,
      name ? `お名前: ${name}` : "",
      `ご要件: ${categoryLabel}`,
      "",
      "ご相談内容:",
      body
    ].filter(Boolean);

    if (environment) {
      lines.push("", "環境:", environment);
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: replyTo,
        subject,
        text: lines.join("\n")
      })
    });

    if (!resendResponse.ok) {
      let resendDetail = "";
      try {
        const body = await resendResponse.json() as { message?: string; error?: string };
        resendDetail = String(body?.message || body?.error || "").trim();
      } catch (error) {
        try {
          resendDetail = String(await resendResponse.text()).trim();
        } catch (innerError) {
          resendDetail = "";
        }
      }
      return json({
        ok: false,
        error: "send",
        status: resendResponse.status,
        detail: resendDetail || "Resend API request failed."
      }, 502);
    }

    return json({ ok: true });
  } catch (error) {
    return json({ ok: false, error: "server" }, 500);
  }
};
