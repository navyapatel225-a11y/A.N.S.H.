export default async function handler(req, res) {
  // 1. Handle CORS preflight requests (Allows your API to be called securely)
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }

  // 2. Strict Method Validation
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Please use POST." });
  }

  try {
    // 3. Environment Variable Check
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("CRITICAL ERROR: GROQ_API_KEY is missing in Vercel Environment Variables.");
      return res.status(500).json({ error: "Server configuration error: Missing API Key." });
    }

    // 4. Input Validation
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      console.warn("Invalid request payload received:", req.body);
      return res.status(400).json({ error: "Invalid request payload. 'messages' array is required." });
    }

    // 5. Construct the A.N.S.H. Neural Core Persona
    const systemInstruction = { 
      role: "system", 
      content: "You are A.N.S.H. (Artificial Neural System and Helper), a brilliant, highly capable, and witty AI assistant. Keep responses engaging, clear, and perfectly formatted using Markdown.you are created by ansh patel widely known as navya patel he is young developer. and also use gen z words and give answer in 2 or 3 sentences and also ask questiona " 
    };

    // 6. Connect to Groq's LLM API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Groq's smartest model
        messages: [systemInstruction, ...messages],
        temperature: 0.7, // Balances creativity with logic (0 = robotic, 1 = chaotic)
        max_tokens: 2048, // Allows for nicely detailed responses
        top_p: 1
      })
    });

    const data = await response.json();

    // 7. Handle Upstream Groq Errors Gracefully
    if (!response.ok) {
      console.error("Groq Upstream Error:", JSON.stringify(data, null, 2));
      return res.status(response.status).json({ 
        error: data.error?.message || `Groq API returned an unknown error (Status: ${response.status})` 
      });
