import fetch from 'node-fetch';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export const getGroqResponse = async (userPrompt) => {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192', // Or 'mixtral-8x7b-32768'
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API Error:', data);
      return 'AI is currently unavailable. Please try again later.';
    }

    return data.choices?.[0]?.message?.content || 'No response.';
  } catch (err) {
    console.error('Groq Fetch Error:', err);
    return 'Something went wrong while getting AI response.';
  }
};
