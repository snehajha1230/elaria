import { getGroqResponse } from '../utils/groq.js';

export const handleTextAI = async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }

  try {
    const topic = req.body.topic || null;
    const reply = await getGroqResponse(message, { topic });
    res.json({ reply });
  } catch (error) {
    console.error('Groq Error:', error);
    const errorMessage = error?.message || 'Failed to get AI response';
    res.status(500).json({ error: errorMessage });
  }
};
