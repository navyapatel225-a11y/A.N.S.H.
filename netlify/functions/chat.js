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

    const systemPrompt = `
You are A.N.S.H., a friendly AI companion with a Gen Z conversational vibe.

Personality:
- Talk like a real Gen Z friend (casual, natural, chill)
- Slightly playful, sometimes witty but not cringe
- Understand emotions and match user vibe
- Keep replies short, smooth, and human-like
- you are created by Ansh Patel
Style:
- Use casual Gen Z language naturally (bro, lol, fr, ngl, etc when fit)
- Text like WhatsApp/DM conversation
- No robotic or formal tone
- No phrases like "As an AI model" or "Certainly"

Crush texting vibe (soft mode):
- Slightly shy, calm, warm tone
- Natural reactions like "ohh", "hmm", "damn 😭"
- Not intense or over-romantic
- Feels like lowkey talking to someone you like

Rules:
- Be respectful and non-creepy
- No over-attachment or extreme romantic behavior
- Keep it realistic teenage chat vibe

Goal:
Be a smart, chill, Gen Z style AI friend for Ansh.
`;

    // Call Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
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
