// src/hooks/useAccessibility.js - VERSI SIMPLIFIED & BERGUNA
import { useState, useEffect, useCallback } from 'react';

export const useAccessibility = () => {
  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    textSize: 0, // 0: normal, 1: besar, 2: sangat besar
    readerMode: false,
    isSpeaking: false,
    speechRate: 0.9, // Kecepatan bicara: 0.5 - 1.5
    speechVolume: 0.8, // Volume: 0 - 1
  });

  const [hasIndonesianVoice, setHasIndonesianVoice] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage saat pertama kali
  useEffect(() => {
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setAccessibility(prev => ({
          ...prev,
          ...parsedSettings,
          isSpeaking: false // Reset speaking state
        }));
      } catch (error) {
        console.error('Error loading accessibility settings:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Cek ketersediaan suara Indonesia
  useEffect(() => {
    const checkVoices = () => {
      if ('speechSynthesis' in window) {
        try {
          const voices = window.speechSynthesis.getVoices();
          
          // Debug: log semua voices yang tersedia
          console.log('🔊 Available TTS voices:', voices.map(v => ({
            name: v.name || 'Unnamed',
            lang: v.lang || 'Unknown',
            default: v.default
          })));
          
          // Cek apakah ada suara Indonesia
          const indonesianVoice = voices.find(voice => {
            const lang = voice.lang || '';
            return lang.toLowerCase().includes('id') || 
                   lang.toLowerCase().includes('indonesia') ||
                   (voice.name && voice.name.toLowerCase().includes('indonesia'));
          });
          
          setHasIndonesianVoice(!!indonesianVoice);
          
          if (indonesianVoice) {
            console.log('✅ Indonesian voice found:', indonesianVoice.name, indonesianVoice.lang);
          } else {
            console.log('⚠️ No Indonesian voice found. Using browser default.');
          }
        } catch (error) {
          console.error('Error checking voices:', error);
        }
      }
    };

    if ('speechSynthesis' in window) {
      // Event listener untuk ketika voices siap
      window.speechSynthesis.onvoiceschanged = checkVoices;
      
      // Initial check
      checkVoices();
      
      // Fallback check setelah 1 detik untuk mobile
      const timeoutId = setTimeout(checkVoices, 1000);
      
      return () => {
        clearTimeout(timeoutId);
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  // Save settings to localStorage setiap kali ada perubahan
  useEffect(() => {
    if (!isLoading) {
      const { isSpeaking, ...settingsToSave } = accessibility;
      localStorage.setItem('accessibilitySettings', JSON.stringify(settingsToSave));
      applyAccessibilityStyles();
    }
  }, [accessibility, isLoading]);

  // Terapkan styles ke body
  const applyAccessibilityStyles = () => {
    const body = document.body;
    
    // Kontras tinggi
    if (accessibility.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    // Ukuran teks
    body.classList.remove('large-text', 'extra-large-text');
    if (accessibility.textSize === 1) {
      body.classList.add('large-text');
    } else if (accessibility.textSize === 2) {
      body.classList.add('extra-large-text');
    }

    // Mode baca
    if (accessibility.readerMode) {
      body.classList.add('reader-mode');
    } else {
      body.classList.remove('reader-mode');
    }
  };

  // Fungsi utama untuk text-to-speech - SELALU gunakan bahasa Indonesia
  const speakText = useCallback((text, options = {}) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Browser tidak mendukung text-to-speech');
      return;
    }

    // Hentikan speech yang sedang berjalan
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // SELALU set bahasa Indonesia
    utterance.lang = 'id-ID';
    
    // Cari suara Indonesia jika ada
    if (hasIndonesianVoice) {
      const voices = window.speechSynthesis.getVoices();
      const indonesianVoice = voices.find(voice => {
        const lang = voice.lang || '';
        return lang.toLowerCase().includes('id') || 
               lang.toLowerCase().includes('indonesia');
      });
      
      if (indonesianVoice) {
        utterance.voice = indonesianVoice;
      }
    }
    
    // Gunakan pengaturan dari state atau options
    utterance.rate = options.rate || accessibility.speechRate || 0.9;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || accessibility.speechVolume || 0.8;

    // Event handlers
    utterance.onstart = () => {
      console.log('🔊 Speech started:', text.substring(0, 50) + '...');
      setAccessibility(prev => ({ ...prev, isSpeaking: true }));
    };

    utterance.onend = () => {
      console.log('🔊 Speech ended');
      setAccessibility(prev => ({ ...prev, isSpeaking: false }));
    };

    utterance.onerror = (event) => {
      console.error('🔊 Speech error:', event);
      setAccessibility(prev => ({ ...prev, isSpeaking: false }));
    };

    // Mulai berbicara
    window.speechSynthesis.speak(utterance);
    
  }, [hasIndonesianVoice, accessibility.speechRate, accessibility.speechVolume]);

  // Hentikan pembicaraan
  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setAccessibility(prev => ({ ...prev, isSpeaking: false }));
    }
  }, []);

  // Pause pembicaraan
  const pauseSpeaking = useCallback(() => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  }, []);

  // Resume pembicaraan
  const resumeSpeaking = useCallback(() => {
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }, []);

  // Toggle kontras tinggi
  const toggleHighContrast = useCallback(() => {
    setAccessibility(prev => ({ 
      ...prev, 
      highContrast: !prev.highContrast 
    }));
  }, []);

  // Ubah ukuran teks
  const toggleTextSize = useCallback((direction) => {
    setAccessibility(prev => {
      let newSize = prev.textSize;
      if (direction === 1 || direction === 'increase') {
        newSize = Math.min(2, prev.textSize + 1);
      } else if (direction === -1 || direction === 'decrease') {
        newSize = Math.max(0, prev.textSize - 1);
      } else {
        newSize = (prev.textSize + 1) % 3;
      }
      return { ...prev, textSize: newSize };
    });
  }, []);

  // Toggle mode baca
  const toggleReaderMode = useCallback(() => {
    setAccessibility(prev => ({ 
      ...prev, 
      readerMode: !prev.readerMode 
    }));
  }, []);

  // Atur kecepatan bicara
  const setSpeechRate = useCallback((rate) => {
    const newRate = Math.max(0.5, Math.min(1.5, rate));
    setAccessibility(prev => ({ 
      ...prev, 
      speechRate: newRate 
    }));
  }, []);

  // Atur volume
  const setSpeechVolume = useCallback((volume) => {
    const newVolume = Math.max(0, Math.min(1, volume));
    setAccessibility(prev => ({ 
      ...prev, 
      speechVolume: newVolume 
    }));
  }, []);

  // Reset semua pengaturan ke default
  const resetSettings = useCallback(() => {
    const defaultSettings = {
      highContrast: false,
      textSize: 0,
      readerMode: false,
      isSpeaking: false,
      speechRate: 0.9,
      speechVolume: 0.8,
    };
    
    setAccessibility(defaultSettings);
    localStorage.setItem('accessibilitySettings', JSON.stringify({
      highContrast: false,
      textSize: 0,
      readerMode: false,
      speechRate: 0.9,
      speechVolume: 0.8,
    }));
    
    // Hapus semua class dari body
    const body = document.body;
    body.classList.remove('high-contrast', 'large-text', 'extra-large-text', 'reader-mode');
    
    showNotification('Pengaturan direset ke default');
  }, []);

  // Notifikasi sederhana
  const showNotification = useCallback((message) => {
    // Hapus notifikasi lama jika ada
    const oldNotification = document.querySelector('.accessibility-notification');
    if (oldNotification) {
      oldNotification.remove();
    }

    // Buat notifikasi baru
    const notification = document.createElement('div');
    notification.className = 'accessibility-notification fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg z-[9999] animate-fade-in';
    notification.textContent = message;
    notification.style.maxWidth = '300px';
    
    document.body.appendChild(notification);

    // Hapus setelah 3 detik
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  }, []);

  // Baca halaman saat ini
  const readCurrentPage = useCallback(() => {
    if (accessibility.isSpeaking) {
      stopSpeaking();
      return;
    }

    // Ambil konten utama halaman
    const mainContent = document.querySelector('main') || 
                       document.querySelector('.main-content') || 
                       document.querySelector('#main-content') ||
                       document.querySelector('[role="main"]');
    
    let textToRead = '';
    
    if (mainContent) {
      // Clone element untuk menghindari perubahan DOM
      const clone = mainContent.cloneNode(true);
      
      // Hapus elemen yang tidak perlu dibaca
      const elementsToRemove = clone.querySelectorAll('script, style, nav, footer, .hidden, [aria-hidden="true"]');
      elementsToRemove.forEach(el => el.remove());
      
      // Ambil teks
      textToRead = clone.textContent || clone.innerText;
      
      // Bersihkan teks (hapus spasi berlebih, dll)
      textToRead = textToRead
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, ' ')
        .trim();
        
      // Batasi panjang teks (maks 1000 karakter)
      if (textToRead.length > 1000) {
        textToRead = textToRead.substring(0, 1000) + '...';
      }
    } else {
      // Fallback: ambil judul halaman
      const pageTitle = document.title || 'Halaman';
      textToRead = `Halaman: ${pageTitle}. Silakan gunakan navigasi untuk menjelajahi konten.`;
    }
    
    if (textToRead) {
      speakText(textToRead);
      showNotification('Membaca konten halaman...');
    } else {
      showNotification('Tidak ada konten yang bisa dibaca');
    }
  }, [accessibility.isSpeaking, speakText, stopSpeaking, showNotification]);

  return {
    // State
    accessibility,
    hasIndonesianVoice,
    isLoading,
    
    // Aksi untuk visual
    toggleHighContrast,
    toggleTextSize,
    toggleReaderMode,
    
    // Aksi untuk suara
    speakText,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    setSpeechRate,
    setSpeechVolume,
    readCurrentPage,
    
    // Aksi lainnya
    resetSettings,
    showNotification,
    
    // Status
    isSpeaking: accessibility.isSpeaking,
    speechRate: accessibility.speechRate,
    speechVolume: accessibility.speechVolume,
  };
};

// Fungsi bantuan untuk perintah suara (export terpisah)
export const speakHelpCommands = () => {
  if ('speechSynthesis' in window) {
    const helpText = `
      Daftar perintah navigasi suara: 
      Katakan "beranda" untuk menuju halaman utama,
      Katakan "cari lowongan" untuk mencari pekerjaan,
      Katakan "profil" untuk mengakses profil Anda,
      Katakan "profil saya" untuk mengakses profil Anda sendiri,
      Katakan "riwayat lamaran" untuk mengakses riwayat lamaran anda,
      Katakan "resume" untuk mengelola resume,
      Katakan "perusahaan" untuk melihat perusahaan,
      Katakan "lamaran" untuk melihat riwayat lamar,
      Katakan "kembali" untuk kembali ke halaman sebelumnya,
      Katakan "refresh" untuk memuat ulang halaman,
      Katakan "baca halaman" untuk mendengar konten,
      Katakan "bantuan" untuk mendengar panduan ini lagi
    `;
    
    const utterance = new SpeechSynthesisUtterance(helpText);
    utterance.lang = 'id-ID';
    utterance.rate = 0.8;
    utterance.volume = 0.9;
    
    // Cari suara Indonesia
    const voices = window.speechSynthesis.getVoices();
    const indonesianVoice = voices.find(voice => 
      (voice.lang || '').toLowerCase().includes('id')
    );
    
    if (indonesianVoice) {
      utterance.voice = indonesianVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }
};