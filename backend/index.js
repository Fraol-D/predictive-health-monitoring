require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001; // Backend will run on port 3001 by default

// Middlewares
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON request bodies

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Predictive Health Monitoring Backend is running!');
});

// API endpoint for chat
app.post('/api/chat', (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  console.log('Received user message:', message);

  // Mock AI response for now
  const aiResponse = `Backend received: "${message}". AI is thinking...`;
  
  // Simulate a delay for AI processing
  setTimeout(() => {
    res.json({ 
      reply: aiResponse,
      timestamp: new Date() 
    });
  }, 1000);
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
}); 