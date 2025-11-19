/**
 * Cloudflare Worker for handling feedback/issue reports
 * 
 * Environment Variables:
 * - GITHUB_TOKEN: GitHub Personal Access Token with repo scope
 * - GITHUB_OWNER: Repository owner
 * - GITHUB_REPO: Repository name
 */

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return handleOptions(request);
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const data = await request.json();
      const { type, message, url, userAgent } = data;

      if (!message) {
        return new Response("Message is required", { status: 400 });
      }

      const title = `[Feedback] ${type}: ${message.substring(0, 50)}...`;
      const body = `
### Feedback Type
${type}

### Message
${message}

### Context
- URL: ${url}
- User Agent: ${userAgent}
      `;

      const response = await fetch(
        `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/issues`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
            "User-Agent": "Comfy-Docs-Feedback-Worker",
            "Content-Type": "application/json",
            "Accept": "application/vnd.github.v3+json"
          },
          body: JSON.stringify({ title, body, labels: ["feedback", type] })
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error("GitHub API Error:", error);
        return new Response("Failed to create issue", { status: 500 });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (error) {
      console.error("Worker Error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
};

function handleOptions(request) {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
