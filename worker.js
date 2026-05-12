export default {

  async fetch(request, env) {

    if (request.method === "OPTIONS") {

      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });

    }

    const body = await request.json();

    let provider = body.provider || "openrouter";

    let apiUrl = "";
    let apiKey = "";

    // ===== PROVIDERS =====

    if(provider === "groq"){

      apiUrl =
      "https://api.groq.com/openai/v1/chat/completions";

      apiKey = env.GROQ_API_KEY;

    }else{

      apiUrl =
      "https://openrouter.ai/api/v1/chat/completions";

      apiKey = env.OPENROUTER_API_KEY;

    }

    // ===== API REQUEST =====

    const response = await fetch(apiUrl, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },

      body: JSON.stringify({

        model: body.model,

        messages: body.messages

      })

    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {

      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }

    });

  }

}
