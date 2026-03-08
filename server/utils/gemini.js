import fetch from 'node-fetch';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const getGeminiResponse = async (userPrompt) => {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

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
