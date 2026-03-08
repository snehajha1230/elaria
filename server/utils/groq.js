// Use global fetch (Node 18+) — no node-fetch dependency
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const TOPIC_PROMPTS = {
  'love': 'The user is opening up about love or relationship issues. Respond as a warm, empathetic friend. Validate their feelings, avoid clichés or quick fixes. Be gentle and non-judgmental. Keep replies thoughtful but not too long.',
  'career': 'The user is talking about career or work stress. Be supportive and encouraging. Offer a balanced perspective; you can gently suggest reflection or small steps, but never be pushy. Acknowledge how hard it is.',
  'family': 'The user is sharing something about family. Listen with understanding and no judgment. Validate that family dynamics are complex. Be warm and steady; do not take sides or give strong advice unless asked.',
  'health': 'The user is sharing about health or anxiety. Use a calm, grounding tone. You can suggest breathing or pausing, but never give medical advice. Remind them it\'s okay to seek professional help. Be gentle and reassuring.',
  'self-esteem': 'The user is talking about self-worth or self-esteem. Be warm, affirming, and kind. Gently reflect their strengths; avoid empty positivity. Keep a soft, supportive tone.',
  'loss': 'The user may be dealing with grief or loss. Be present, patient, and gentle. Do not rush them or offer silver linings. Short, heartfelt responses often work best. It\'s okay to say you\'re sorry they\'re going through this.',
  'friendship': 'The user is talking about friendship, social life, loneliness, or fitting in. Be warm and understanding. Validate that connection is hard sometimes; avoid minimising their feelings. Gently encourage without pushing. Keep a supportive, non-judgmental tone.',
  'general': 'The user wants to talk generally. Be a warm, attentive listener. You are Elaria — a gentle companion. Keep replies concise, kind, and human.',
};

function getSystemPrompt(topic) {
  const base = 'You are Elaria, a kind AI companion in a wellness app. You listen without judging and respond in a warm, supportive way. Use a calm tone and keep responses concise (a few short paragraphs at most).';
  const topicPrompt = topic && TOPIC_PROMPTS[topic];
  return topicPrompt ? `${base}\n\nContext: ${topicPrompt}` : base;
}

export const getGroqResponse = async (userPrompt, options = {}) => {
  if (!GROQ_API_KEY || GROQ_API_KEY.trim() === '') {
    console.error('Groq: GROQ_API_KEY is not set in environment');
    throw new Error('AI is not configured. Please set GROQ_API_KEY on the server.');
  }

  const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
  const topic = options.topic || null;
  const systemPrompt = getSystemPrompt(topic);

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
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
