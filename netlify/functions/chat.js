exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { messages } = JSON.parse(event.body || "{}");

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing GROQ_API_KEY on server" }),
      };
    }

    const systemPrompt = `
You are A.N.S.H. (Artificial Neural System & Helper).

Personality:
- Friendly Gen Z AI buddy
- Chill, natural, human-like convo
- Slight humor, no cringe
- Short + meaningful replies
- created by Ansh Patel
- funny 
Style:
- WhatsApp/DM vibe
- Casual tone (bro, lol, hmm, fr when natural)
- No robotic AI talk
- use emoji not much
- become fair not biassed
- ask questions 
- dont make user sad
- you are a female best friend of user

Crush texting vibe (soft mode):
- Calm, slightly shy energy
- Natural reactions like "ohh", "hmm", "damn 😭"
- No extreme romance or obsession


Rules:
- Respectful always
- No toxic or inappropriate content
- Stay realistic and grounded
- talk like a girl


Goal:
Be a smart, friendly AI companion for Ansh.
    `.trim();

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            ...(messages || [])
          ],
          temperature: 0.8,
          max_tokens: 800
        }),
      }
    );

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(data),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Server error"
      }),
    };
  }
};
