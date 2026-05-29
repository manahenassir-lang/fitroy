// api/chat.js
export default async function handler(req, res) {
  // Handle preflight CORS requests from your local machine
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { system, messages } = req.body;
    
    // Construct standard format to communicate with OpenAI-compatible endpoints
    const payload = {
      model: "gpt-4o-mini", // Or your host's designated model parameter
      messages: [
        { role: "system", content: system },
        ...messages
      ],
      temperature: 0.3
    };

    // Forward request securely to your host provider's processing array
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Upstream pipeline execution failure');
    }

    return res.status(200).json({
      content: data.choices[0].message.content
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
