const express = require('express');
const router = express.Router();
const axios = require('axios');

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const BASE_URL = 'https://api.elevenlabs.io/v1';

if (!ELEVENLABS_API_KEY) {
  console.error('❌ ERROR: ELEVENLABS_API_KEY is not set in .env file!');
}

// Cache untuk mengurangi API calls
const audioCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

// Middleware untuk log
router.use((req, res, next) => {
  console.log(`🔊 TTS Request: ${req.method} ${req.path}`);
  next();
});

// Cleanup cache periodic
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of audioCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      audioCache.delete(key);
    }
  }
}, 60000); // Setiap 1 menit

// Endpoint untuk generate audio
router.post('/generate', async (req, res) => {
  try {
    const { text, voiceId = '21m00Tcm4TlvDq8ikWAM', settings = {} } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!ELEVENLABS_API_KEY) {
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'ElevenLabs API key not configured'
      });
    }

    // Batasi panjang text (max 5000 karakter untuk hemat quota)
    const trimmedText = text.trim().substring(0, 5000);
    
    // Cek cache dulu
    const cacheKey = `${voiceId}:${trimmedText}`;
    const cached = audioCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
      console.log('📦 Serving from cache');
      res.set('Content-Type', cached.mimeType);
      res.set('X-Cache', 'HIT');
      return res.send(Buffer.from(cached.audio, 'base64'));
    }

    // Konfigurasi default untuk bahasa Indonesia
    const defaultSettings = {
      model_id: 'eleven_multilingual_v2',
      stability: settings.stability || 0.5,
      similarity_boost: settings.similarity_boost || 0.75,
      style: settings.style || 0.0,
      use_speaker_boost: settings.use_speaker_boost || true,
      language_code: 'id', // Bahasa Indonesia
      optimize_streaming_latency: settings.optimize_streaming_latency || 0
    };

    console.log(`🔊 Generating speech: ${trimmedText.substring(0, 50)}...`);

    // Panggil ElevenLabs API
    const response = await axios.post(
      `${BASE_URL}/text-to-speech/${voiceId}`,
      {
        text: trimmedText,
        ...defaultSettings,
        ...settings
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        responseType: 'arraybuffer',
        timeout: 30000 // 30 detik timeout
      }
    );

    const audioBuffer = response.data;
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    // Simpan ke cache (maks 50 item)
    if (audioCache.size > 50) {
      const firstKey = audioCache.keys().next().value;
      audioCache.delete(firstKey);
    }
    
    audioCache.set(cacheKey, {
      audio: base64Audio,
      mimeType: response.headers['content-type'] || 'audio/mpeg',
      voiceId,
      textLength: trimmedText.length,
      timestamp: Date.now()
    });

    // Kirim response
    res.set('Content-Type', response.headers['content-type']);
    res.set('X-Cache', 'MISS');
    res.send(audioBuffer);

  } catch (error) {
    console.error('❌ ElevenLabs API Error:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      res.status(error.response.status).json({
        error: 'ElevenLabs API Error',
        message: error.response.data?.detail || error.message,
        status: error.response.status
      });
    } else if (error.request) {
      res.status(503).json({
        error: 'Service Unavailable',
        message: 'Cannot connect to ElevenLabs API'
      });
    } else {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }
});

// Endpoint untuk mendapatkan daftar voices
router.get('/voices', async (req, res) => {
  try {
    if (!ELEVENLABS_API_KEY) {
      return res.json({
        allVoices: [],
        recommendedVoices: [],
        error: 'API key not configured'
      });
    }

    const response = await axios.get(`${BASE_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      timeout: 10000
    });

    // Filter voices yang cocok untuk bahasa Indonesia
    const allVoices = response.data.voices || [];
    const recommendedVoices = allVoices.filter(voice => {
      return voice.labels?.language === 'indonesian' || 
             voice.name.toLowerCase().includes('indonesia') ||
             voice.name.toLowerCase().includes('bella') ||
             voice.name.toLowerCase().includes('rachel') ||
             voice.name.toLowerCase().includes('antoni') ||
             voice.name.toLowerCase().includes('elli');
    }).slice(0, 10); // Batasi 10 voices

    // Jika tidak ada yang cocok, ambil beberapa default
    const finalVoices = recommendedVoices.length > 0 
      ? recommendedVoices 
      : allVoices.slice(0, 5);

    res.json({
      allVoices: allVoices.map(v => ({ 
        voice_id: v.voice_id, 
        name: v.name 
      })),
      recommendedVoices: finalVoices.map(v => ({
        voice_id: v.voice_id,
        name: v.name,
        description: v.description || 'ElevenLabs Voice',
        labels: v.labels || {}
      }))
    });
  } catch (error) {
    console.error('Error fetching voices:', error.message);
    
    // Fallback voices jika API error
    res.json({
      allVoices: [],
      recommendedVoices: [
        {
          voice_id: '21m00Tcm4TlvDq8ikWAM',
          name: 'Rachel',
          description: 'Default voice (English)',
          labels: { language: 'english', gender: 'female' }
        },
        {
          voice_id: 'EXAVITQu4vr4xnSDxMaL',
          name: 'Bella',
          description: 'Clear and natural voice',
          labels: { language: 'english', gender: 'female' }
        }
      ],
      error: 'Using fallback voices'
    });
  }
});

// Endpoint untuk status quota
router.get('/quota', async (req, res) => {
  try {
    if (!ELEVENLABS_API_KEY) {
      return res.json({
        character_count: 0,
        character_limit: 0,
        available: false
      });
    }

    const response = await axios.get(`${BASE_URL}/user/subscription`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching quota:', error);
    res.status(500).json({ error: 'Failed to fetch quota' });
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    status: 'OK',
    message: 'TTS backend is working',
    timestamp: new Date().toISOString(),
    cacheSize: audioCache.size
  });
});

module.exports = router;