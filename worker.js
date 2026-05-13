export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== "/api/chat") {
      return env.ASSETS.fetch(request);
    }

    if (request.method !== "POST") {
      return Response.json({ error: "POST only" }, { status: 405 });
    }

    try {
      const body = await request.json();

      const provider = body.provider || "openrouter";
      const messages = body.messages || [];

      let apiUrl = "";
      let apiKey = "";
      let model = body.model || "";

      if (provider === "groq") {
        apiUrl = "https://api.groq.com/openai/v1/chat/completions";
        apiKey = env.GROQ_API_KEY;
        model = model || "llama-3.3-70b-versatile";
      } else {
        apiUrl = "https://openrouter.ai/api/v1/chat/completions";
        apiKey = env.OPENROUTER_API_KEY;
        model = model || "openai/gpt-oss-20b:free";
      }

      if (!apiKey) {
        return Response.json({
          error: {
            message: provider.toUpperCase() + " API key missing in Cloudflare secrets"
          }
        });
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + apiKey,
          "HTTP-Referer": "https://mahrzone-worker.techsitepower.workers.dev",
          "X-Title": "Mahrzone AI OS"
        },
        body: JSON.stringify({
          model,
          messages
        })
      });

      const data = await response.json();

      return Response.json(data);
    } catch (err) {
      return Response.json({
        error: {
          message: err.message
        }
      });
    }
  }
};
