/**
 * Parser perintah suara yang fleksibel
 * Support: sinonim, pattern matching, fuzzy matching
 */

// Database sinonim bahasa Indonesia
const synonymDictionary = {
  'baca': ['bacakan', 'dengarkan', 'narator', 'suarakan'],
  'semua': ['seluruh', 'semuanya', 'semua konten'],
  'penting': ['intinya', 'pokoknya', 'utama', 'ringkas', 'singkat'],
  'ringkasan': ['summary', 'singkat saja', 'intisari', 'kesimpulan'],
  'beranda': ['home', 'utama', 'halaman utama', 'landing page'],
  'kerja': ['pekerjaan', 'lowongan', 'job', 'jobs', 'karir'],
  'perusahaan': ['company', 'companies', 'firma', 'kantor', 'bisnis'],
  'kandidat': ['candidate', 'pelamar', 'applicant', 'pencari kerja'],
  'berhenti': ['stop', 'hentikan', 'pause', 'jeda', 'tahan'],
  'lanjut': ['resume', 'lanjutkan', 'teruskan', 'sambung'],
  'mulai': ['start', 'play', 'mainkan'],
  'ulangi': ['repeat', 'ulang', 'kembali', 'lagi'],
  'isi': ['tulis', 'input', 'masukkan', 'ketik'],
  'kirim': ['submit', 'unggah', 'send', 'post'],
  'hapus': ['clear', 'bersihkan', 'delete', 'kosongkan'],
  'login': ['masuk', 'signin', 'log in', 'masuk akun'],
  'daftar': ['register', 'signup', 'registrasi', 'buat akun'],
  // 'email': ['surel', 'e-mail', 'alamat email'],
  // 'password': ['kata sandi', 'sandi', 'pin'],
  // 'nama': ['name', 'fullname', 'nama lengkap'],
  // 'submit': ['kirim', 'unggah', 'simpan', 'proses'],
  // 'reset': ['hapus', 'bersihkan', 'clear', 'kosongkan']
};

// Pattern templates untuk matching
const commandPatterns = [
  { 
    pattern: /(baca|bacakan|dengarkan|narator)\s+(halaman|page|semua|seluruh)/i, 
    action: 'readAll'
  },
  { 
    pattern: /(baca|bacakan|dengarkan)\s+(penting|intinya|pokoknya|ringkas)/i, 
    action: 'readImportant'
  },
  { 
    pattern: /(ringkasan|summary|singkat|intisari|kesimpulan)/i, 
    action: 'readSummary'
  },
  { 
    pattern: /(berhenti|stop|hentikan|jeda|pause)/i, 
    action: 'pause'
  },
  { 
    pattern: /(lanjut|lanjutkan|resume|teruskan|sambung)/i, 
    action: 'resume'
  },
  { 
    pattern: /(ulangi|repeat|ulang|kembali|lagi)/i, 
    action: 'repeat'
  },
  { 
    pattern: /(pergi|buka|navigasi|ke|ke halaman)\s+(beranda|home|utama)/i, 
    action: 'navigateHome'
  },
  { 
    pattern: /(pergi|buka|navigasi|ke|ke halaman)\s+(profil|profile|pengguna)/i, 
    action: 'navigateProfile'
  },
  { 
    pattern: /(pergi|buka|navigasi|ke|ke halaman)\s+(profil|profile|pengguna)\s+(saya|sendiri)/i, 
    action: 'navigateProfileSaya'
  },
  { 
    pattern: /(pergi|buka|navigasi|ke|ke halaman)\s+(kerja|pekerjaan|job|jobs)/i, 
    action: 'navigateJobs'
  },
  { 
    pattern: /(pergi|buka|navigasi|ke|ke halaman)\s+(perusahaan|company|companies)/i, 
    action: 'navigateCompanies'
  },
  { 
    pattern: /(pergi|buka|navigasi|ke|ke halaman)\s+(kandidat|candidate|pelamar)/i, 
    action: 'navigateCandidates'
  },
  { 
    pattern: /(pergi|buka|navigasi|ke|ke halaman)\s+(riwayat lamaran|history lamaran|histori lamaran)/i, 
    action: 'navigateRiwayatLamaran'
  },
  { 
    pattern: /(cari|temukan|carikan)\s+(.*)/i, 
    action: 'search'
  },
   // PERINTAH BANTUAN
  { 
    pattern: /(bantuan|help|tolong|menu|apa yang bisa dilakukan)/i, 
    action: 'help'
  },
  { 
    pattern: /(perintah|command|apa saja perintahnya)/i, 
    action: 'helpCommands'
  },
  { 
    pattern: /(navigasi|panduan|cara pakai)/i, 
    action: 'helpNavigation'
  },

  // AUTH & LOGIN COMMANDS - TAMBAHAN BARU
  { 
    pattern: /(login|masuk|sign.?in|log.?in)/i, 
    action: 'navigateLogin'
  },
  { 
    pattern: /(daftar|register|sign.?up|buat.?akun|registrasi)/i, 
    action: 'navigateRegister'
  },
  { 
    pattern: /(lupa.?password|reset.?password)/i, 
    action: 'navigateForgotPassword'
  },
  { 
    pattern: /(keluar|logout|sign.?out)/i, 
    action: 'logout'
  },
  
];

// Helper: Normalisasi teks
const normalizeText = (text) => {
  return text.toLowerCase()
    .replace(/[.,!?;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// Helper: Replace sinonim
const replaceSynonyms = (text) => {
  let normalized = text;
  
  Object.keys(synonymDictionary).forEach(key => {
    synonymDictionary[key].forEach(synonym => {
      const regex = new RegExp(`\\b${synonym}\\b`, 'gi');
      if (regex.test(normalized)) {
        normalized = normalized.replace(regex, key);
      }
    });
  });
  
  return normalized;
};

// Helper: Hitung kemiripan string
const stringSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  return (longer.length - editDistance(longer, shorter)) / parseFloat(longer.length);
};

const editDistance = (s1, s2) => {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
};

// Main parser function - CLEAN VERSION
export const parseVoiceCommand = (rawText) => {
  const normalizedText = normalizeText(rawText);
  const textWithSynonyms = replaceSynonyms(normalizedText);
  
  // 1. Coba pattern matching terlebih dahulu
  for (const pattern of commandPatterns) {
    if (pattern.pattern.test(textWithSynonyms)) {
      return {
        action: pattern.action,
        originalText: rawText,
        normalizedText: textWithSynonyms,
        confidence: 0.95,
        matchedPattern: pattern.pattern.toString()
      };
    }
  }
  
  // 2. Coba synonym matching untuk command sederhana
  const simpleCommands = {
    'baca halaman': 'readAll',
    'baca penting': 'readImportant',
    'ringkasan': 'readSummary',
    'berhenti': 'pause',
    'lanjut': 'resume',
    'ulangi': 'repeat',
    'beranda': 'navigateHome',
    'profile': 'navigateProfile',
    'profile saya': 'navigateProfileSaya',
    'riwayat lamaran': 'navigateRiwayatLamaran',
    'kerja': 'navigateJobs',
    'perusahaan': 'navigateCompanies',
    'kandidat': 'navigateCandidates',
  };
  
  for (const [command, action] of Object.entries(simpleCommands)) {
    if (textWithSynonyms.includes(command) || 
        stringSimilarity(textWithSynonyms, command) > 0.7) {
      return {
        action: action,
        originalText: rawText,
        normalizedText: textWithSynonyms,
        confidence: stringSimilarity(textWithSynonyms, command),
        matchedBy: 'simpleCommand'
      };
    }
  }
  
  // 3. Fallback: Keyword matching
  const keywords = {
    'baca': 'readAll',
    'bacakan': 'readAll',
    'dengarkan': 'readAll',
    'penting': 'readImportant',
    'ringkasan': 'readSummary',
    'berhenti': 'pause',
    'jeda': 'pause',
    'lanjut': 'resume',
    'profile': 'navigateProfile',
    'kerja': 'navigateJobs',
    'perusahaan': 'navigateCompanies',
    'kandidat': 'navigateCandidates',
    'profile saya': 'navigateProfileSaya',
    'riwayat lamaran': 'navigateRiwayatLamaran',
    'beranda': 'navigateHome'
  };
  
  let bestMatch = { action: 'unknown', confidence: 0 };
  
  for (const [keyword, action] of Object.entries(keywords)) {
    if (textWithSynonyms.includes(keyword)) {
      const confidence = 0.8 + (textWithSynonyms.length > 10 ? 0.1 : 0);
      if (confidence > bestMatch.confidence) {
        bestMatch = { action, confidence };
      }
    }
  }
  
  if (bestMatch.action !== 'unknown') {
    return {
      action: bestMatch.action,
      originalText: rawText,
      normalizedText: textWithSynonyms,
      confidence: bestMatch.confidence,
      matchedBy: 'keyword'
    };
  }
  
  // 4. Tidak dikenali
  return {
    action: 'unknown',
    originalText: rawText,
    normalizedText: textWithSynonyms,
    confidence: 0,
    matchedBy: 'none'
  };
};

// Helper untuk mendapatkan saran perintah
export const getCommandSuggestions = (partialText = '') => {
  const normalized = normalizeText(partialText);
  
  if (!normalized) {
    return [
      'baca halaman',
      'baca penting',
      'ringkasan',
      'berhenti',
      'lanjut',
      'ulangi',
      'buka beranda',
      'buka profile',
      'buka kerja',
      'buka perusahaan',
      'buka kandidat',
      'buka profile saya',
      'buka riwayat lamaran'
    ];
  }
  
  const suggestions = [];
  const allCommands = [
    'baca halaman', 'baca penting', 'ringkasan',
    'berhenti', 'lanjut', 'ulangi',
    'buka beranda', 'buka profile', 'buka profile saya', 
    'buka kerja', 'buka perusahaan', 'buka kandidat', 
    'buka riwayat lamaran',
  ];
  
  allCommands.forEach(cmd => {
    if (cmd.includes(normalized) || normalized.includes(cmd) ||
        stringSimilarity(normalized, cmd) > 0.4) {
      suggestions.push(cmd);
    }
  });
  
  return suggestions.slice(0, 5);
};