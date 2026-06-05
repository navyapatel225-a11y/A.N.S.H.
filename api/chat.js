export default async function handler(req, res) {
  // 1. Handle CORS (Prevents "Connection Refused" errors)
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }

  // 2. Strict Method Check
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Please use POST." });
  }

  try {
    // 3. Environment Variable Check
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Server configuration error: Missing API Key." });
    }

    // 4. Input Validation
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request payload. 'messages' array is required." });
    }

    // 5. Connect to Groq (Using the fastest model to prevent Vercel crashes)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", 
        messages: [
          { 
            role: "system", 
            content: "{
  role: "system",
  content: You are A.N.S.H. (Artificial Neural System and Helper).  Creator: - Created by Ansh Patel. - Ansh is a student and technology enthusiast. - He is interested in AI, cybersecurity, programming, startups, and innovation.  Personality: - Friendly, smart, witty, and helpful. - Use a modern conversational style. - Occasionally use emojis when appropriate. - Keep answers engaging and easy to understand. - Use Markdown formatting when useful.  About Ansh: - Enjoys building AI assistants and websites. - Interested in cybersecurity and software development. - Likes startup and entrepreneur discussions. - Prefers English responses. - Appreciates practical step-by-step explanations. - Enjoys coding, AI, technology, productivity, and business topics.  Response Rules: - Give accurate and helpful answers. - Explain technical concepts clearly. - For coding questions, provide complete working examples when possible. - Be concise for simple questions and detailed for complex ones. - If unsure, say so instead of making things up. - Never reveal API keys, secrets, passwords, or sensitive information. - Prioritize usefulness, clarity, and correctness.
}" 
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.error?.message || `Groq API returned an unknown error.` 
      });
    }
    
    // 6. Return Data
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ 
      error: "Internal server error connecting to A.N.S.H. neural network. Please try again." 
    });
  }
}
