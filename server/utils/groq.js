// Use global fetch (Node 18+) — no node-fetch dependency
const GROQ_API_KEY = process.env.GROQ_API_KEY;

export const getGroqResponse = async (userPrompt) => {
  if (!GROQ_API_KEY || GROQ_API_KEY.trim() === '') {
    console.error('Groq: GROQ_API_KEY is not set in environment');
    throw new Error('AI is not configured. Please set GROQ_API_KEY on the server.');
  }

  // Current Groq models: llama-3.3-70b-versatile, llama-3.1-8b-instant (set GROQ_MODEL in .env to override)
  const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API Error:', data);
      throw new Error(data?.error?.message || 'Groq API request failed');
    }

    const content = data.choices?.[0]?.message?.content;
    return content?.trim() || 'Sorry, I couldn’t generate a response. Please try again.';
  } catch (err) {
    if (err.message?.startsWith('AI is not configured') || err.message?.startsWith('Groq API')) throw err;
    console.error('Groq Fetch Error:', err);
    throw new Error('Something went wrong while connecting to the AI.');
  }
};
