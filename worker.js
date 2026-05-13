export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    if (url.pathname !== "/api/chat") {
      return env.ASSETS.fetch(request);
    }

    try {

      const body = await request.json();

      const provider =
      body.provider || "groq";

      const model =
      body.model;

      let apiUrl = "";
      let apiKey = "";

      if(provider === "groq"){

        apiUrl =
        "https://api.groq.com/openai/v1/chat/completions";

        apiKey =
        env.GROQ_API_KEY;

      }

      else if(provider === "openrouter"){

        apiUrl =
        "https://openrouter.ai/api/v1/chat/completions";

        apiKey =
        env.OPENROUTER_API_KEY;

      }

      const response =
      await fetch(apiUrl, {

        method:"POST",

        headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer " + apiKey,
          "HTTP-Referer":"https://ai.mahrzone.xyz",
          "X-Title":"Mahrzone AI OS"
        },

        body:JSON.stringify({
          model:model,
          messages:body.messages
        })

      });

      const data =
      await response.json();

      return Response.json(data);

    } catch(err){

      return Response.json({
        error:{
          message:err.message
        }
      });

    }

  }
};
