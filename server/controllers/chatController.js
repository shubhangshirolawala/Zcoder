const axios = require('axios');

// POST /api/v1/chat using Google Gemini API
exports.chatWithAI = async (req, res) => {
  const { history } = req.body;
  if (!history || !Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ error: 'Conversation history is required' });
  }

  
  const contents = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  try {
    const geminiRes = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: process.env.GEMINI_API_KEY
        }
      }
    );
    const aiMessage = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
    res.json({ response: aiMessage });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from Gemini AI' });
  }
};
