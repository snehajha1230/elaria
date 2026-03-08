// Use global fetch (Node 18+) — no node-fetch dependency
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const getGeminiResponse = async (userPrompt) => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
    console.error('Gemini: GEMINI_API_KEY is not set in environment');
    throw new Error('AI is not configured. Please set GEMINI_API_KEY on the server.');
  }
  // gemini-pro is deprecated; use gemini-1.5-flash or gemini-1.5-pro (set GEMINI_MODEL in .env to override)
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: userPrompt }],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error:', data);
      return 'Sorry, something went wrong with the AI response.';
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply || 'Sorry, I couldn’t understand that. Please try again.';
  } catch (error) {
    console.error('Gemini Fetch Error:', error);
    return 'Something went wrong while connecting to the AI.';
  }
};
