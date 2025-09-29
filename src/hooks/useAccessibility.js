// src/hooks/useAccessibility.js - Dengan Voice Selection
import { useState, useEffect } from 'react';

export const useAccessibility = () => {
  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    textSize: 0,
    readerMode: false,
    isSpeaking: false,
    selectedVoice: null, // Tambah state untuk voice pilihan
  });

  const [voices, setVoices] = useState([]);
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

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // Auto pilih voice Indonesia jika ada
        if (!accessibility.selectedVoice) {
          const indonesianVoice = availableVoices.find(voice => 
            voice.lang.includes('id') || voice.lang.includes('ID')
          );
          if (indonesianVoice) {
            setAccessibility(prev => ({
              ...prev,
              selectedVoice: indonesianVoice
            }));
          }
        }
      }
    };

    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
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

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Gunakan voice yang dipilih
    if (accessibility.selectedVoice) {
      utterance.voice = accessibility.selectedVoice;
      utterance.lang = accessibility.selectedVoice.lang;
    } else {
      // Fallback ke bahasa Indonesia
      utterance.lang = 'id-ID';
    }

    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    utterance.onstart = () => {
      setAccessibility(prev => ({ ...prev, isSpeaking: true }));
    };

    utterance.onend = () => {
      setAccessibility(prev => ({ ...prev, isSpeaking: false }));
    };

    utterance.onerror = () => {
      setAccessibility(prev => ({ ...prev, isSpeaking: false }));
    };

    window.speechSynthesis.speak(utterance);
  };

  // Fungsi untuk ganti voice
  const selectVoice = (voice) => {
    setAccessibility(prev => ({
      ...prev,
      selectedVoice: voice
    }));
    setShowVoiceMenu(false);
    showNotification(`Suara diubah ke: ${voice.name}`);
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

  // Fungsi lainnya...
  const toggleHighContrast = () => {
    setAccessibility(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const toggleTextSize = () => {
    setAccessibility(prev => ({ ...prev, textSize: (prev.textSize + 1) % 3 }));
  };

  const toggleReaderMode = () => {
    setAccessibility(prev => ({ ...prev, readerMode: !prev.readerMode }));
  };

  return {
    accessibility,
    voices,
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