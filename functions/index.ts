import { pickHomeLang } from "./_lib/home-lang.mjs";

// `/` has no page of its own: send each visitor to the language home their browser asks for
// (ADR 2026-10-18-root-language-redirect). 302, because the target depends on the request.
export const onRequest: PagesFunction = ({ request }) => {
  const url = new URL(request.url);
  const lang = pickHomeLang(request.headers.get("Accept-Language") || "");
  return new Response(null, {
    status: 302,
    headers: {
      Location: `/${lang}/${url.search}`,
      Vary: "Accept-Language",
      "Cache-Control": "private, no-store"
    }
  });
};
