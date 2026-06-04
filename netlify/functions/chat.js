export const handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" })
        };
    }

    try {
        const { messages, userEmail } = JSON.parse(event.body || "{}");

        if (!messages || !Array.isArray(messages)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid messages" })
            };
        }

        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Missing API key" })
            };
        }

        // 🧠 SYSTEM PROMPT WITH USER INFO
        const systemPrompt = `
You are A.N.S.H AI, a helpful assistant.

User email: ${userEmail || "unknown"}

Rules:
- Be friendly and simple
- Keep answers short
- If asked who is Ansh: he is the founder and young developer of A.N.S.H AI
`;

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...messages.slice(-10)
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "AI failed", details: data })
            };
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        };

    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
