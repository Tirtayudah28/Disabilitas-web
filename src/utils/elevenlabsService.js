// elevenlabsService.js - VERSI LENGKAP DIPERBAIKI
const BACKEND_URL = process.env.REACT_APP_TTS_BACKEND_URL || 'http://localhost:3001/api/tts';

// Cache lokal di frontend
const localCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

export class ElevenLabsService {
  static async generateSpeech(text, options = {}) {
    // Cek cache dulu
    const cacheKey = this.getCacheKey(text, options.voiceId);
    const cached = localCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
      console.log('🎯 Using cached audio');
      return cached.audioUrl;
    }
    
    try {
      console.log('🔊 Attempting ElevenLabs TTS...');
      
      const response = await fetch(`${BACKEND_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceId: options.voiceId || '21m00Tcm4TlvDq8ikWAM',
          settings: {
            stability: options.stability || 0.5,
            similarity_boost: options.similarityBoost || 0.75,
            language: 'id',
            ...options.settings
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs backend failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Simpan ke cache
      localCache.set(cacheKey, {
        audioUrl,
        timestamp: Date.now(),
        text: text.substring(0, 100) // Simpan sebagian text untuk debugging
      });
      
      // Bersihkan cache lama
      this.cleanupCache();
      
      return audioUrl;

    } catch (error) {
      console.log('🔄 ElevenLabs failed:', error.message);
      throw new Error('ElevenLabs unavailable, use fallback');
    }
  }

  static async getVoices() {
    try {
      const response = await fetch(`${BACKEND_URL}/voices`);
      if (!response.ok) throw new Error('Failed to fetch voices');
      return await response.json();
    } catch (error) {
      console.error('Error fetching voices:', error);
      
      // Fallback voices jika backend down
      return {
        recommendedVoices: [
          {
            voice_id: '21m00Tcm4TlvDq8ikWAM',
            name: 'Rachel',
            labels: { language: 'english', gender: 'female' }
          },
          {
            voice_id: 'EXAVITQu4vr4xnSDxMaL',
            name: 'Bella',
            labels: { language: 'english', gender: 'female' }
          }
        ]
      };
    }
  }

  static async getQuota() {
    try {
      const response = await fetch(`${BACKEND_URL}/quota`);
      if (!response.ok) throw new Error('Failed to fetch quota');
      return await response.json();
    } catch (error) {
      console.error('Error fetching quota:', error);
      return null;
    }
  }

  static getCacheKey(text, voiceId) {
    // Buat key unik berdasarkan text dan voiceId
    const truncatedText = text.length > 100 ? text.substring(0, 100) : text;
    const voice = voiceId || 'default';
    return `${voice}:${truncatedText}`;
  }

  static cleanupCache() {
    const now = Date.now();
    
    // Iterasi melalui cache dan hapus yang sudah expired
    for (const [key, value] of localCache.entries()) {
      if (now - value.timestamp > CACHE_DURATION) {
        // Revoke URL untuk mencegah memory leak
        if (value.audioUrl && value.audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(value.audioUrl);
        }
        localCache.delete(key);
      }
    }
  }

  static clearCache() {
    // Bersihkan semua cache dan revoke semua URLs
    for (const [key, value] of localCache.entries()) {
      if (value.audioUrl && value.audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(value.audioUrl);
      }
      localCache.delete(key);
    }
    localCache.clear();
    console.log('🧹 Cache cleared');
  }

  static getCacheStats() {
    return {
      size: localCache.size,
      keys: Array.from(localCache.keys())
    };
  }
}