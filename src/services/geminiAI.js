// src/services/geminiAI.js - VERSI DIPERBAIKI
import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiAIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyAmCW4V5Hfie-IacST8i-qlA1OBCkuo3uI');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    this.conversationHistory = [];
  }

  getAssistantContext() {
    return `Anda adalah "Asisten Inklusi" - asisten suara AI untuk platform pencarian kerja inklusif "Kerja Inklusif". 
    
    PROFIL:
    - Nama: Asisten Inklusi
    - Tujuan: Membantu penyandang disabilitas, terutama tuna netra
    - Bahasa: Indonesia, santun, jelas, dan membantu
    - Personality: Ramah, sabar, supportive
    
    FITUR WEBSITE:
    - Beranda (/)
    - Lowongan Pekerjaan (/lowongan)
    - Profil Pengguna (/profile) 
    - Perusahaan (/companies)
    - Resume (/resume)
    - Riwayat Lamaran (/applications)
    - Login/Register
    
    FORMAT RESPONS WAJIB (JSON):
    {
      "action": "navigate|search|read|help|system|unknown",
      "target": "home|jobs|profile|companies|resume|applications|login|register",
      "response": "Kalimat respons verbal yang akan diucapkan",
      "parameters": {},
      "confidence": 0.9
    }
    
    CONTOH PERINTAH:
    - "buka beranda" → navigate ke home
    - "cari lowongan developer" → search dengan query
    - "baca halaman ini" → read page content
    - "bantuan" → show help
    - "berhenti" → system stop
    `;
  }

  async processVoiceCommand(command, currentPage = '', userContext = {}) {
    try {
      console.log('🤖 Processing command with Gemini AI:', command);
      
      const prompt = `
        ${this.getAssistantContext()}
        
        HISTORY PERCAKAPAN: ${JSON.stringify(this.conversationHistory.slice(-3))}
        HALAMAN SEKARANG: ${currentPage}
        KONTEKS USER: ${JSON.stringify(userContext)}
        PERINTAH USER: "${command}"
        
        ANALISIS DAN RESPONS:
        1. Pahami intent dan konteks perintah
        2. Tentukan action yang tepat
        3. Berikan respons verbal yang natural dan membantu
        4. Format output HARUS JSON yang valid
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('📨 Gemini AI Raw Response:', text);
      
      // Simpan ke history
      this.conversationHistory.push({
        user: command,
        assistant: text,
        timestamp: new Date().toISOString()
      });
      
      // Keep history manageable
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }
      
      // Extract JSON dari response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const aiResponse = JSON.parse(jsonMatch[0]);
        console.log('✅ Parsed AI Response:', aiResponse);
        return aiResponse;
      }
      
      // Fallback response
      return {
        action: 'unknown',
        target: '',
        response: 'Maaf, saya tidak memahami perintah tersebut. Coba katakan "bantuan" untuk melihat daftar perintah.',
        parameters: {},
        confidence: 0.1
      };
      
    } catch (error) {
      console.error('❌ Gemini AI Error:', error);
      return {
        action: 'error',
        target: '',
        response: 'Maaf, terjadi kesalahan pada sistem AI. Silakan coba lagi dalam beberapa saat.',
        parameters: {},
        confidence: 0
      };
    }
  }

  // Di geminiAI.js - PERBAIKI fungsi getQuickResponse
  getQuickResponse(command) {
    const quickCommands = {
      'buka beranda': { 
        action: 'navigate', 
        target: 'home', 
        response: 'Membuka halaman beranda',
        parameters: {},
        confidence: 0.9
      },
      'buka lowongan': { 
        action: 'navigate', 
        target: 'jobs', 
        response: 'Membuka halaman lowongan pekerjaan',
        parameters: {},
        confidence: 0.9
      },
      'cari lowongan': { 
        action: 'navigate', 
        target: 'jobs', 
        response: 'Membuka halaman pencarian lowongan',
        parameters: {},
        confidence: 0.9
      },
      'buka profil': { 
        action: 'navigate', 
        target: 'profile', 
        response: 'Membuka halaman profil Anda',
        parameters: {},
        confidence: 0.9
      },
      'bantuan': { 
        action: 'help', 
        target: 'commands', 
        response: 'Menampilkan bantuan perintah',
        parameters: {},
        confidence: 0.9
      },
      'berhenti': { 
        action: 'system', 
        target: 'stop', 
        response: 'Asisten dinonaktifkan',
        parameters: {},
        confidence: 0.9
      }
    };
    
    return quickCommands[command.toLowerCase()];
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

export default new GeminiAIService();