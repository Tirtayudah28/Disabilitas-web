// src/hooks/useAccessibility.js - DIPERBAIKI untuk Mobile
import { useState, useEffect } from 'react';

export const useAccessibility = () => {
  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    textSize: 0,
    readerMode: false,
    isSpeaking: false,
    selectedVoice: null,
  });

  const [voices, setVoices] = useState([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setAccessibility(prev => ({
          ...prev,
          ...parsedSettings,
          isSpeaking: false
        }));
      } catch (error) {
        console.error('Error loading accessibility settings:', error);
      }
    }
  }, []);

  // 🔥 PERBAIKAN UTAMA: Load available voices dengan filter untuk mobile
  useEffect(() => {
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        try {
          const availableVoices = window.speechSynthesis.getVoices();
          
          // Debug: log semua voice yang tersedia
          console.log('🎯 Available voices:', availableVoices.map(v => ({
            name: v.name,
            lang: v.lang,
            default: v.default,
            localService: v.localService
          })));
          
          // Filter dan prioritaskan suara
          const filteredVoices = filterAndPrioritizeVoices(availableVoices);
          setVoices(filteredVoices);
          setIsLoadingVoices(false);
          
          // Auto pilih voice Indonesia jika ada dan belum dipilih
          if (!accessibility.selectedVoice && filteredVoices.length > 0) {
            const indonesianVoice = filteredVoices.find(voice => 
              voice.lang.toLowerCase().includes('id') || 
              voice.lang.toLowerCase().includes('indonesia')
            );
            
            if (indonesianVoice) {
              console.log('🎯 Auto-selecting Indonesian voice:', indonesianVoice.name);
              setAccessibility(prev => ({
                ...prev,
                selectedVoice: indonesianVoice
              }));
            } else {
              // Pilih voice default jika tidak ada Indonesia
              const defaultVoice = filteredVoices[0];
              console.log('🎯 No Indonesian voice found, selecting default:', defaultVoice.name);
              setAccessibility(prev => ({
                ...prev,
                selectedVoice: defaultVoice
              }));
            }
          }
          
          // Fallback timeout untuk mobile
          if (filteredVoices.length === 0) {
            setTimeout(() => {
              const fallbackVoices = window.speechSynthesis.getVoices();
              if (fallbackVoices.length > 0 && fallbackVoices.length !== availableVoices.length) {
                const reFiltered = filterAndPrioritizeVoices(fallbackVoices);
                setVoices(reFiltered);
                setIsLoadingVoices(false);
              }
            }, 2000);
          }
        } catch (error) {
          console.error('Error loading voices:', error);
          setIsLoadingVoices(false);
        }
      } else {
        setIsLoadingVoices(false);
      }
    };

    const filterAndPrioritizeVoices = (voices) => {
      if (!voices || voices.length === 0) return [];
      
      const voicePriorities = [
        // Prioritas 1: Bahasa Indonesia
        { pattern: /id-ID|id_ID|id\b/i, priority: 1 },
        // Prioritas 2: Bahasa Melayu (mirip Indonesia)
        { pattern: /ms-MY|ms_MY|ms\b/i, priority: 2 },
        // Prioritas 3: Bahasa Inggris dengan aksen yang cocok
        { pattern: /en-GB|en_GB|en-AU|en_AU/i, priority: 3 },
        // Prioritas 4: Bahasa Inggris lainnya
        { pattern: /en-US|en_US|en\b/i, priority: 4 },
        // Prioritas 5: Bahasa lainnya
        { pattern: /.*/, priority: 5 }
      ];
      
      return voices
        .map(voice => {
          const lang = voice.lang || '';
          let priority = 99;
          
          for (const { pattern, priority: p } of voicePriorities) {
            if (pattern.test(lang)) {
              priority = p;
              break;
            }
          }
          
          return {
            ...voice,
            priority,
            displayName: getVoiceDisplayName(voice)
          };
        })
        .sort((a, b) => a.priority - b.priority);
    };
    
    const getVoiceDisplayName = (voice) => {
      const name = voice.name || 'Unknown Voice';
      const lang = voice.lang || '';
      
      if (lang.toLowerCase().includes('id')) {
        return `${name} (Bahasa Indonesia)`;
      } else if (lang.toLowerCase().includes('ms')) {
        return `${name} (Bahasa Melayu)`;
      } else if (lang) {
        return `${name} (${lang})`;
      }
      
      return name;
    };

    if ('speechSynthesis' in window) {
      // Set event listener untuk ketika voices berubah
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      // Initial load
      loadVoices();
      
      // Timeout fallback untuk mobile (kadang voices butuh waktu lebih lama)
      const timeoutId = setTimeout(() => {
        if (voices.length === 0) {
          const fallbackVoices = window.speechSynthesis.getVoices();
          if (fallbackVoices.length > 0) {
            const filtered = filterAndPrioritizeVoices(fallbackVoices);
            setVoices(filtered);
            setIsLoadingVoices(false);
          }
        }
      }, 4000);

      return () => {
        clearTimeout(timeoutId);
        if ('speechSynthesis' in window) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      };
    } else {
      setIsLoadingVoices(false);
    }
  }, [accessibility.selectedVoice]);

  // Save settings to localStorage
  useEffect(() => {
    const { isSpeaking, ...settingsToSave } = accessibility;
    localStorage.setItem('accessibilitySettings', JSON.stringify(settingsToSave));
    applyAccessibilityStyles();
  }, [accessibility]);

  const applyAccessibilityStyles = () => {
    const body = document.body;
    
    if (accessibility.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    body.classList.remove('large-text', 'extra-large-text');
    if (accessibility.textSize === 1) {
      body.classList.add('large-text');
    } else if (accessibility.textSize === 2) {
      body.classList.add('extra-large-text');
    }

    if (accessibility.readerMode) {
      body.classList.add('reader-mode');
    } else {
      body.classList.remove('reader-mode');
    }
  };

  // Fungsi untuk speak dengan voice terpilih
  const speakText = (text, options = {}) => {
    if (!('speechSynthesis' in window)) {
      alert('Browser tidak mendukung text-to-speech');
      return;
    }

    // Cancel any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Gunakan voice yang dipilih
    if (accessibility.selectedVoice) {
      utterance.voice = accessibility.selectedVoice;
      utterance.lang = accessibility.selectedVoice.lang;
      console.log('🔊 Using selected voice:', accessibility.selectedVoice.name);
    } else {
      // Fallback: cari voice Indonesia
      const availableVoices = window.speechSynthesis.getVoices();
      const indonesianVoice = availableVoices.find(v => 
        v.lang.toLowerCase().includes('id')
      );
      if (indonesianVoice) {
        utterance.voice = indonesianVoice;
        utterance.lang = indonesianVoice.lang;
        console.log('🔊 Using auto-found Indonesian voice:', indonesianVoice.name);
      } else {
        // Fallback ke bahasa Indonesia default
        utterance.lang = 'id-ID';
        console.log('🔊 Using default Indonesian language');
      }
    }

    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 0.8;

    utterance.onstart = () => {
      setAccessibility(prev => ({ ...prev, isSpeaking: true }));
    };

    utterance.onend = () => {
      setAccessibility(prev => ({ ...prev, isSpeaking: false }));
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setAccessibility(prev => ({ ...prev, isSpeaking: false }));
    };

    window.speechSynthesis.speak(utterance);
  };

  // Fungsi untuk ganti voice
  const selectVoice = (voice) => {
    if (!voice) return;
    
    setAccessibility(prev => ({
      ...prev,
      selectedVoice: voice
    }));
    setShowVoiceMenu(false);
    showNotification(`Suara diubah ke: ${voice.name}`);
    console.log('✅ Voice selected:', voice.name, voice.lang);
  };

  // Toggle voice menu
  const toggleVoiceMenu = () => {
    setShowVoiceMenu(!showVoiceMenu);
  };

  // Fungsi baca halaman
  const readPageContent = () => {
    if (accessibility.isSpeaking) {
      stopSpeaking();
      return;
    }

    const mainHeading = document.querySelector('h1');
    if (mainHeading) {
      speakText(mainHeading.textContent);
      showNotification('Membaca halaman...');
    } else {
      showNotification('Tidak ada konten untuk dibaca');
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setAccessibility(prev => ({ ...prev, isSpeaking: false }));
  };

  const showNotification = (message) => {
    const existingNotification = document.querySelector('.speech-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-primary-600 text-white p-3 rounded-lg shadow-lg z-50 speech-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  };

  // Fungsi untuk toggle text size dengan parameter
  const toggleTextSize = (direction) => {
    setAccessibility(prev => {
      let newSize = prev.textSize;
      if (direction === 1) {
        newSize = Math.min(2, prev.textSize + 1);
      } else if (direction === -1) {
        newSize = Math.max(0, prev.textSize - 1);
      } else {
        newSize = (prev.textSize + 1) % 3;
      }
      return { ...prev, textSize: newSize };
    });
  };

  const toggleHighContrast = () => {
    setAccessibility(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const toggleReaderMode = () => {
    setAccessibility(prev => ({ ...prev, readerMode: !prev.readerMode }));
  };

  return {
    accessibility,
    voices,
    isLoadingVoices, // 🔥 TAMBAHKAN INI
    showVoiceMenu,
    toggleHighContrast,
    toggleTextSize,
    toggleReaderMode,
    speakText,
    stopSpeaking,
    readPageContent,
    selectVoice,
    toggleVoiceMenu,
    isSpeaking: accessibility.isSpeaking,
  };
};

// Di src/hooks/useAccessibility.js - Tambahkan fungsi bantuan
export const speakHelpCommands = () => {
  if ('speechSynthesis' in window) {
    const helpText = `
      Daftar perintah navigasi suara: 
      Katakan BERANDA untuk menuju halaman utama,
      Katakan CARI LOWONGAN untuk mencari pekerjaan,
      Katakan PROFIL untuk mengakses profil Anda,
      Katakan RESUME untuk mengelola resume,
      Katakan PERUSAHAAN untuk melihat perusahaan,
      Katakan LAMARAN untuk melihat riwayat lamar,
      Katakan KEMBALI untuk kembali ke halaman sebelumnya,
      Katakan REFRESH untuk memuat ulang halaman,
      Katakan BANTUAN untuk mendengar panduan ini lagi
    `;
    
    const utterance = new SpeechSynthesisUtterance(helpText);
    utterance.lang = 'id-ID';
    utterance.rate = 0.8;
    
    const voices = window.speechSynthesis.getVoices();
    const indonesianVoice = voices.find(voice => voice.lang.includes('id'));
    if (indonesianVoice) utterance.voice = indonesianVoice;
    
    window.speechSynthesis.speak(utterance);
  }
};