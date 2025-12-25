require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ttsRoutes = require('./routes/tts');

const app = express();
const PORT = process.env.PORT || 3001;

// Debug Info
console.log('🔧 Debug Info:');
console.log('- Port:', PORT);
console.log('- ElevenLabs API Key exists:', !!process.env.ELEVENLABS_API_KEY);
console.log('- API Key length:', process.env.ELEVENLABS_API_KEY?.length || 0);
console.log('- NODE_ENV:', process.env.NODE_ENV);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/tts', ttsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'ElevenLabs TTS Proxy',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!process.env.ELEVENLABS_API_KEY
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`🔊 TTS endpoint: http://localhost:${PORT}/api/tts`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Test route: http://localhost:${PORT}/test`);
  
  if (!process.env.ELEVENLABS_API_KEY) {
    console.error('❌ WARNING: ELEVENLABS_API_KEY is not set in .env file!');
    console.log('💡 Create a .env file with: ELEVENLABS_API_KEY=your_key_here');
  }
});