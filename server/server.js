const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

function buildPrompt(situation, religion) {
  return `Write a short, comforting prayer of 100 words or less. It should be grounded in the following religion: ${religion}, and respond to this situation: ${situation}. Keep it respectful and uplifting.`;
}

app.post('/api/generate-prayer', async (req, res) => {
  const { situation, religion } = req.body;
  if (!situation || !religion) {
    return res.status(400).json({ error: 'Missing input' });
  }

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: buildPrompt(situation, religion) }],
      temperature: 0.8
    });
    const prayer = response.data.choices[0].message.content.trim();
    res.json({ prayer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating prayer' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
