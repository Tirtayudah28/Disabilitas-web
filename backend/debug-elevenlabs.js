// debug-elevenlabs.js
const axios = require('axios');

async function testElevenLabsDirect() {
  const API_KEY = 'sk_9d949433973b4e65d353044fe53ef436ca869609a8c617a9'; // Ganti dengan API key Anda
  const voiceId = '21m00Tcm4TlvDq8ikWAM';
  const text = 'Halo, ini test suara dari ElevenLabs';

  try {
    console.log('🔍 Testing ElevenLabs API directly...');
    
    // Test 1: Check API Key
    console.log('\n📋 Test 1: Checking API key...');
    const voicesResponse = await axios.get('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': API_KEY }
    });
    console.log('✅ API Key valid! Available voices:', voicesResponse.data.voices.length);
    
    // Test 2: Generate Speech
    console.log('\n🔊 Test 2: Generating speech...');
    const ttsResponse = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY
        },
        responseType: 'arraybuffer'
      }
    );
    
    console.log('✅ Speech generated! Size:', ttsResponse.data.length, 'bytes');
    console.log('✅ Content-Type:', ttsResponse.headers['content-type']);
    
    // Test 3: Check backend
    console.log('\n🌐 Test 3: Testing local backend...');
    const backendResponse = await axios.post('http://localhost:3001/api/tts/generate', {
      text: 'Test from debug script',
      voiceId: voiceId
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ Backend working! Response size:', backendResponse.data.length, 'bytes');
    
  } catch (error) {
    console.error('\n❌ ERROR DETAILS:');
    console.error('Message:', error.message);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    
    if (error.response?.status === 401) {
      console.error('\n⚠️ API KEY INVALID OR EXPIRED!');
      console.error('Get a new API key from: https://elevenlabs.io/app/api-keys');
    }
  }
}

// Jalankan test
testElevenLabsDirect();