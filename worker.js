export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat") {
      const body = await request.json();

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + env.OPENROUTER_API_KEY
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b:free",
          messages: body.messages
        })
      });

      const data = await response.json();

      return Response.json(data, {
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    return env.ASSETS.fetch(request);
  }
}
