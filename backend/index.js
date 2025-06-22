require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3001; // Backend will run on port 3001 by default

// Initialize Google Generative AI
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in the .env file');
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro"});

// Middlewares
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON request bodies

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Predictive Health Monitoring Backend is running!');
});

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  console.log('Received user message:', message);

  try {
    const result = await model.generateContent(message);
    const response = await result.response;
    const aiResponse = await response.text();
    
    res.json({ 
      reply: aiResponse,
      timestamp: new Date() 
    });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to get response from AI.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
}); 