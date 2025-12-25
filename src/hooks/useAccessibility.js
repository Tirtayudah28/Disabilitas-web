// src/hooks/useAccessibility.js - VERSI ELEVENLABS
import { useState, useEffect, useCallback } from 'react';
import { ElevenLabsService } from '../utils/elevenlabsService';

export const useAccessibility = () => {
  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    textSize: 0, // 0: normal, 1: besar, 2: sangat besar
    readerMode: false,
    isSpeaking: false,
    speechRate: 0.9, // Kecepatan bicara: 0.5 - 1.5
    speechVolume: 0.8, // Volume: 0 - 1
    selectedVoice: '21m00Tcm4TlvDq8ikWAM', 
  });

  // State untuk loading
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk voices dari ElevenLabs
  const [availableVoices, setAvailableVoices] = useState([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(false);

  // Load settings dari localStorage saat pertama kali
  useEffect(() => {
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setAccessibility(prev => ({
          ...prev,
          ...parsedSettings,
          isSpeaking: false,
          selectedVoice: parsedSettings.selectedVoice || '21m00Tcm4TlvDq8ikWAM'
        }));
      } catch (error) {
        console.error('Error loading accessibility settings:', error);
      }
    }
    setIsLoading(false);
    
    // Load voices dari ElevenLabs
    loadElevenLabsVoices();
  }, []);

  // Fungsi untuk load voices dari ElevenLabs
  const loadElevenLabsVoices = useCallback(async () => {
    setIsLoadingVoices(true);
    try {
      const voicesData = await ElevenLabsService.getVoices();
      setAvailableVoices(voicesData.recommendedVoices || []);
    } catch (error) {
      console.error('Error loading ElevenLabs voices:', error);
      // Fallback voices
      setAvailableVoices([
        {
          voice_id: '21m00Tcm4TlvDq8ikWAM',
          name: 'Rachel',
          description: 'Suara default (English)'
        },
        {
          voice_id: 'EXAVITQu4vr4xnSDxMaL',
          name: 'Bella',
          description: 'Suara natural (English)'
        }
      ]);
    } finally {
      setIsLoadingVoices(false);
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

  // Update speakText function:
const speakText = useCallback(async (text, options = {}) => {
  setAccessibility(prev => ({ ...prev, isSpeaking: true }));

  try {
    const audioUrl = await ElevenLabsService.generateSpeech(text, {
      voiceId: accessibility.selectedVoice || '21m00Tcm4TlvDq8ikWAM',
      stability: options.stability || 0.5,
      similarityBoost: options.similarityBoost || 0.75
    });
    
    // Cek jika fallback ke Web Speech
    if (audioUrl === 'web-speech-fallback') {
      fallbackToWebSpeech(text);
      return;
    }
    
    const audio = new Audio(audioUrl);
    
    audio.onplay = () => {
      console.log('🔊 ElevenLabs speech started');
    };
    
    audio.onended = () => {
      console.log('🔊 Speech ended');
      setAccessibility(prev => ({ ...prev, isSpeaking: false }));
    };
    
    audio.onerror = (error) => {
      console.error('🔊 Audio error:', error);
      setAccessibility(prev => ({ ...prev, isSpeaking: false }));
      fallbackToWebSpeech(text);
    };
    
    audio.play();
    
  } catch (error) {
    console.error('ElevenLabs failed, using fallback:', error);
    fallbackToWebSpeech(text);
  }
}, [accessibility.selectedVoice]);

  // Fungsi fallback ke Web Speech API
  const fallbackToWebSpeech = useCallback((text) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Browser tidak mendukung text-to-speech');
      setAccessibility(prev => ({ ...prev, isSpeaking: false }));
      return;
    }

    // Hentikan speech yang sedang berjalan
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = accessibility.speechRate || 0.9;
    utterance.volume = accessibility.speechVolume || 0.8;

    utterance.onstart = () => {
      console.log('🔊 Web Speech fallback started');
    };

    utterance.onend = () => {
      setAccessibility(prev => ({ ...prev, isSpeaking: false }));
    };

    utterance.onerror = () => {
      setAccessibility(prev => ({ ...prev, isSpeaking: false }));
    };

    window.speechSynthesis.speak(utterance);
  }, [accessibility.speechRate, accessibility.speechVolume]);

  // Hentikan pembicaraan
  const stopSpeaking = useCallback(() => {
    // Hentikan audio dari ElevenLabs (akan dihandle oleh speechController)
    // Web Speech API fallback
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setAccessibility(prev => ({ ...prev, isSpeaking: false }));
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

  // Fungsi untuk memilih voice ElevenLabs
  const selectVoice = useCallback((voiceId) => {
    setAccessibility(prev => ({ 
      ...prev, 
      selectedVoice: voiceId 
    }));
    
    // Cari nama voice untuk notifikasi
    const selectedVoice = availableVoices.find(v => v.voice_id === voiceId);
    if (selectedVoice) {
      showNotification(`Suara diubah ke ${selectedVoice.name}`);
    }
  }, [availableVoices]);

  // Reset semua pengaturan ke default
  const resetSettings = useCallback(() => {
    const defaultSettings = {
      highContrast: false,
      textSize: 0,
      readerMode: false,
      isSpeaking: false,
      speechRate: 0.9,
      speechVolume: 0.8,
      selectedVoice: '21m00Tcm4TlvDq8ikWAM',
    };
    
    setAccessibility(defaultSettings);
    localStorage.setItem('accessibilitySettings', JSON.stringify({
      highContrast: false,
      textSize: 0,
      readerMode: false,
      speechRate: 0.9,
      speechVolume: 0.8,
      selectedVoice: '21m00Tcm4TlvDq8ikWAM',
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
    voices: availableVoices,
    isLoadingVoices,
    isLoading,
    
    // Aksi untuk visual
    toggleHighContrast,
    toggleTextSize,
    toggleReaderMode,
    
    // Aksi untuk voice selection
    selectVoice,
    
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
    selectedVoice: accessibility.selectedVoice,
  };
};

// Fungsi bantuan untuk perintah suara (export terpisah)
export const speakHelpCommands = async () => {
  const helpText = `
    Daftar perintah navigasi suara: 
    Katakan "beranda" untuk menuju halaman utama,
    Katakan "cari lowongan" untuk mencari pekerjaan,
    Katakan "profil" untuk mengakses profil Anda,
    Katakan "perusahaan" untuk melihat perusahaan,
    Katakan "lamaran" untuk melihat riwayat lamar,
    Katakan "kembali" untuk kembali ke halaman sebelumnya,
    Katakan "refresh" untuk memuat ulang halaman,
    Katakan "baca halaman" untuk mendengar konten,
    Katakan "bantuan" untuk mendengar panduan ini lagi
  `;
  
  try {
    const audioUrl = await ElevenLabsService.generateSpeech(helpText, {
      voiceId: '21m00Tcm4TlvDq8ikWAM'
    });
    const audio = new Audio(audioUrl);
    audio.play();
  } catch (error) {
    // Fallback ke Web Speech API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(helpText);
      utterance.lang = 'id-ID';
      utterance.rate = 0.8;
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }
};