export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== "/api/chat") {
      return env.ASSETS.fetch(request);
    }

    if (request.method !== "POST") {
      return Response.json({ error: { message: "POST only" } }, { status: 405 });
    }

    try {
      const body = await request.json();

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + env.GROQ_API_KEY
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: body.messages
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
