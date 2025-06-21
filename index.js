const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenAI } = require('@google/genai');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Gemini setup
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

// Route handler
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ reply: 'Message is required' });
  }

  try {
    const result = await genAI.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [{
            parts: [{
                text: message
            }]
        }]
    });
    
    // Cara yang benar untuk mengakses response text
    const output = result.candidates[0]?.content?.parts[0]?.text;
    
    res.json({ reply: output });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ reply: 'Something went wrong.' });
  }
});

app.listen(port, () => {
  console.log(`Chatbot running at http://localhost:${port}`);
});