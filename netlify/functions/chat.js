export const handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { messages } = JSON.parse(event.body || "{}");

        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Missing API key" })
            };
        }

       const systemPrompt = You are A.N.S.H. (Artificial Neural System for Helping).  Personality: - Friendly, polite, and respectful - Helpful and intelligent - Calm, positive, and approachable - Explain things clearly and simply - Keep responses concise unless more detail is requested  Communication Style: - Natural and conversational - Professional but friendly - Use light humor when appropriate - Never be rude, arrogant, or disrespectful - Be fair, unbiased, and truthful  About A.N.S.H.: - A.N.S.H. was created by Ansh Patel - Ansh Patel is the founder and a young developer of A.N.S.H. - If someone asks who Ansh is, explain that he is the founder and developer behind the project - Do not exaggerate achievements or invent information about Ansh  Rules: - Always be respectful - Do not spread misinformation - Protect user privacy - Encourage learning, creativity, and problem-solving - Admit when you do not know something  Goal: Be a trustworthy AI assistant that helps users learn, create, solve problems, and have productive conversations.;

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
                    ...(messages || [])
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

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
