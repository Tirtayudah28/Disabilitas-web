/**
 * Panduan suara untuk navigasi auth saja
 */
export const speakAuthNavigationGuide = () => {
  if (!('speechSynthesis' in window)) return;
  
  const guideText = `
    Perintah navigasi untuk halaman autentikasi:
    
    Untuk berpindah halaman:
    - Katakan "login" untuk ke halaman login
    - Katakan "daftar" untuk ke halaman pendaftaran
    - Katakan "lupa password" untuk reset password
    - Katakan "keluar" untuk logout
    
    Catatan keamanan:
    Untuk melindungi akun Anda, email dan password harus diisi secara manual.
    Voice assistant hanya membantu navigasi, bukan pengisian data sensitif.
    
    Katakan "bantuan" untuk mendengar panduan ini lagi.
  `;
  
  const utterance = new SpeechSynthesisUtterance(guideText);
  utterance.lang = 'id-ID';
  utterance.rate = 0.9;
  
  window.speechSynthesis.speak(utterance);
};

/**
 * Auto-guide saat masuk halaman auth
 */
export const speakPageSpecificGuide = (pageType) => {
  let guideText = '';
  
  switch (pageType) {
    case 'login':
      guideText = `
        Anda berada di halaman login.
        Silakan isi email dan password secara manual.
        Untuk keamanan, password tidak dapat diisi dengan suara.
        Katakan "daftar" untuk ke halaman pendaftaran,
        atau "lupa password" untuk reset password.
      `;
      break;
      
    case 'register':
      guideText = `
        Anda berada di halaman pendaftaran.
        Silakan isi semua data secara manual.
        Untuk keamanan, data sensitif tidak dapat diisi dengan suara.
        Katakan "login" untuk kembali ke halaman login.
      `;
      break;
      
    case 'forgot-password':
      guideText = `
        Anda berada di halaman reset password.
        Masukkan email Anda secara manual.
        Katakan "login" untuk kembali ke halaman login.
      `;
      break;
  }
  
  if (guideText) {
    const utterance = new SpeechSynthesisUtterance(guideText);
    utterance.lang = 'id-ID';
    utterance.rate = 0.9;
    utterance.volume = 0.8;
    
    window.speechSynthesis.speak(utterance);
  }
};