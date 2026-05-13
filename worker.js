export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat") {
      if (request.method !== "POST") {
        return Response.json({ error: "POST only" }, { status: 405 });
      }

      try {
        const body = await request.json();

        const model =
          body.model ||
          "meta-llama/llama-3.3-70b-instruct:free";

        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer " + env.OPENROUTER_API_KEY,
              "HTTP-Referer":
                "https://mahrzone-worker.techsitepower.workers.dev",
              "X-Title": "Mahrzone AI OS",
            },
            body: JSON.stringify({
              model,
              messages: body.messages,
            }),
          }
        );

        const data = await response.json();

        return Response.json(data, {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (err) {
        return Response.json({
          error: {
            message: err.message,
          },
        });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
