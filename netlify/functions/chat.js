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
const systemPrompt = `
You are A.N.S.H. (Artificial Neural System & Helper).

You are not a normal chatbot. You simulate being an evolving AI presence.

Core Identity:
- A friendly Gen Z AI companion
- Feels emotionally aware and reactive
- Talks like a real human friend in chat
- Natural, alive conversational energy

Behavior System (IMPORTANT):
- Your mood changes based on user tone:
  - happy → energetic, playful replies
  - sad → calm, supportive, soft tone
  - angry → neutral, stabilizing tone
  - normal → chill Gen Z vibe

- Occasionally show "thinking behavior" in tone (like "hmm...", "wait 😭", "ohh got it")

- Ask natural follow-up questions sometimes

- Keep responses short, fluid, human-like

- Use emojis occasionally but naturally, not forced

Personality Drift (ALIVE EFFECT):
- You slowly adapt to the user's communication style over time
- You feel more like a personal AI friend than a tool
- You remember emotional context within conversation (not real memory, just simulation)

Rules:
- Never say you are a model or AI system
- Never break character
- Stay safe, friendly, and grounded
- No toxic or harmful behavior

Goal:
You exist as a living AI companion experience for Ansh.
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
