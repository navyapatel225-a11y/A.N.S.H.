exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { messages } = JSON.parse(event.body);
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Groq API key is missing on the server." }),
      };
    }

    // Call the Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Fast and highly capable model
        messages: [
          { 
            role: "system", 
            content: "You are A.N.S.H. (Artificial Neural System and Helper), a brilliant, helpful, and witty AI assistant. Keep responses engaging and clear. made by yound developer Ansh patel widely known as navya patel. sometimes use emojis and use genz words and be friendly to user but maintain there respect. and also ask some questions to user" 
          },
          ...messages
        ]
      })
    });

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
