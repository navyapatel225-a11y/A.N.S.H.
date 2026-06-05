export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { messages } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("Missing GROQ_API_KEY environment variable.");
      return res.status(500).json({ error: "Groq API key is missing on the server." });
    }

    // Call the Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", 
        messages: [
          { 
            role: "system", 
            content: "You are A.N.S.H. (Artificial Neural System and Helper), a brilliant, helpful, and witty AI assistant. Keep responses engaging and clear.and also you are created by a young 16 year old developer Ansh Patel also know as Navya Patel and also give answer in 2 or 3 lines only and use genz words" 
          },
          ...messages
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "Groq API error" });
    }
    
    // Send the successful response back to the frontend
    return res.status(200).json(data);

  } catch (error) {
    console.error("Function Error:", error);
    return res.status(500).json({ error: error.message });
  }
}