// src/hooks/useGeminiVoiceAssistant.js - VERSI DENGAN GEMINI AI
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWakeWordDetection } from './useWakeWordDetection';
import geminiAI from '../services/geminiAI';

export const useGeminiVoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const recognitionRef = useRef(null);
  const isMountedRef = useRef(true);

  // Wake word detection
  const {
    isWakeWordDetected,
    resetWakeWordDetection
  } = useWakeWordDetection();

  // Aktifkan ketika wake word terdeteksi
  useEffect(() => {
    if (isWakeWordDetected && !isActive) {
      console.log('🎯 Wake word detected, activating Gemini AI assistant...');
      activateAssistant();
    }
  }, [isWakeWordDetected, isActive]);

  // Text-to-speech
  const speakText = useCallback((text) => {
    if ('speechSynthesis' in window && isMountedRef.current) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => {
        console.log('🔊 Speaking:', text);
      };
      
      utterance.onend = () => {
        console.log('🔇 Speech ended');
        // Auto-listen lagi setelah selesai berbicara
        if (isActive && isMountedRef.current) {
          setTimeout(() => {
            if (isMountedRef.current && isActive && !isListening) {
              startListening();
            }
          }, 500);
        }
      };

      setTimeout(() => {
        if (isMountedRef.current) {
          window.speechSynthesis.speak(utterance);
        }
      }, 300);
    }
  }, [isActive, isListening]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // GANTI useEffect initialization dengan ini:
  useEffect(() => {
    if (!isActive || !isMountedRef.current) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported');
      speakText('Browser tidak mendukung pengenalan suara.');
      return;
    }

    // Cleanup existing
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }

    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'id-ID';
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      if (!isMountedRef.current || !isActive) return;
      
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          setConfidence(event.results[i][0].confidence);
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript) {
        setTranscript(interimTranscript);
      }

      if (finalTranscript) {
        const command = finalTranscript.trim();
        console.log('🎯 Command detected:', command);
        setTranscript(command);
        processCommand(command);
      }
    };

    recognition.onerror = (event) => {
      if (!isMountedRef.current) return;
      console.error('Recognition error:', event.error);
      setIsListening(false);
      
      // Jangan auto-restart untuk error tertentu
      if (event.error === 'not-allowed') {
        speakText('Izin mikrofon tidak diberikan. Silakan izinkan akses mikrofon.');
      }
    };

    recognition.onend = () => {
      if (!isMountedRef.current) return;
      console.log('🔴 Recognition ended');
      setIsListening(false);
      
      // Auto-restart hanya jika masih aktif dan tidak sedang processing
      if (isActive && !isProcessing && isMountedRef.current) {
        setTimeout(() => {
          if (isMountedRef.current && isActive && !isProcessing) {
            startListening();
          }
        }, 1500);
      }
    };

    // Start listening initially
    if (isActive && !isListening && !isProcessing) {
      setTimeout(() => {
        if (isMountedRef.current && isActive) {
          startListening();
        }
      }, 1000);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log('Cleanup error:', error);
        }
        recognitionRef.current = null;
      }
    };
  }, [isActive, isProcessing]); // Hanya depend on isActive dan isProcessing

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isActive || isListening || !isMountedRef.current) {
      return;
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
      setTranscript('');
      console.log('🎤 Listening for commands...');
    } catch (error) {
      console.error('Error starting recognition:', error);
      setIsListening(false);
    }
  }, [isActive, isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
        console.log('🛑 Stopped listening');
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
  }, [isListening]);

  // Process command dengan Gemini AI
  const processCommand = useCallback(async (command) => {
    if (!command || command.length < 2 || !isActive || isProcessing) {
      return;
    }

    console.log('🤖 Processing with Gemini AI:', command);
    setIsProcessing(true);
    setLastCommand(command);
    stopListening(); // Stop listening while processing

    try {
      // Coba quick response dulu untuk performa
      const quickResponse = geminiAI.getQuickResponse(command);
      if (quickResponse) {
        console.log('⚡ Using quick response');
        executeAIResponse(quickResponse);
        return;
      }

      // Process dengan Gemini AI
      const aiResult = await geminiAI.processVoiceCommand(
        command, 
        location.pathname,
        { isActive, timestamp: new Date().toISOString() }
      );

      setAiResponse(aiResult);
      executeAIResponse(aiResult);
      
    } catch (error) {
      console.error('❌ Command processing error:', error);
      speakText('Maaf, terjadi kesalahan saat memproses perintah. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  }, [isActive, isProcessing, location.pathname, stopListening, speakText]);

  // Execute AI response
  const executeAIResponse = useCallback((response) => {
    console.log('🚀 Executing AI Response:', response);
    
    // Speak the response
    if (response.response) {
      speakText(response.response);
    }

    // Execute action
    switch (response.action) {
      case 'navigate':
        executeNavigation(response.target, response.parameters);
        break;
      case 'search':
        executeSearch(response.parameters);
        break;
      case 'help':
        showHelp();
        break;
      case 'system':
        if (response.target === 'stop') {
          resetVoiceAssistant();
        }
        break;
      case 'read':
        readPageContent();
        break;
      default:
        console.log('No specific action for:', response.action);
    }
  }, [speakText]);

  // Navigation handler
  const executeNavigation = useCallback((target, parameters) => {
    const routes = {
      'home': '/',
      'jobs': '/lowongan',
      'profile': '/profile',
      'companies': '/companies',
      'resume': '/resume',
      'applications': '/applications',
      'login': '/login',
      'register': '/register'
    };

    if (routes[target] && routes[target] !== location.pathname) {
      navigate(routes[target]);
    }
  }, [navigate, location.pathname]);

  // Search handler
  const executeSearch = useCallback((parameters) => {
    if (parameters && parameters.query) {
      // Navigate to jobs page with search query
      navigate('/lowongan', { 
        state: { 
          searchQuery: parameters.query,
          location: parameters.location 
        }
      });
    }
  }, [navigate]);

  // Read page content
  const readPageContent = useCallback(() => {
    const pageTitle = document.title;
    const mainContent = document.querySelector('main, [role="main"], .content') || 
                       document.querySelector('h1, h2, .description, p');
    
    let content = `Halaman: ${pageTitle}. `;
    if (mainContent) {
      const text = mainContent.textContent || '';
      content += text.substring(0, 200); // Limit content
    }
    
    speakText(content);
  }, [speakText]);

  // Help system
  const showHelp = useCallback(() => {
    const helpText = `
      Saya Asisten Inklusi! Berikut perintah yang bisa Anda gunakan:
      
      🧭 NAVIGASI:
      - "Buka beranda", "Pergi ke lowongan", "Buka profil"
      - "Buka perusahaan", "Buka resume", "Lihat lamaran"
      
      🔍 PENCARIAN:
      - "Cari lowongan developer", "Cari kerja di Jakarta"
      - "Lowongan administrasi", "Pekerjaan remote"
      
      📖 MEMBACA:
      - "Baca halaman ini", "Bacakan konten"
      
      ℹ️ BANTUAN:
      - "Bantuan", "Apa yang bisa kamu lakukan?"
      - "Berhenti", "Nonaktifkan asisten"
      
      Coba katakan perintah dengan jelas dan natural!
    `;
    speakText(helpText);
  }, [speakText]);

  // Reset assistant
  const resetVoiceAssistant = useCallback(() => {
    console.log('🔄 Resetting Gemini AI assistant');
    stopListening();
    stopSpeaking();
    setIsActive(false);
    setTranscript('');
    setLastCommand('');
    setIsProcessing(false);
    setAiResponse(null);
    
    if (isMountedRef.current) {
      resetWakeWordDetection();
      speakText('Asisten Inklusi nonaktif. Katakan "Oke Inklusi" untuk mengaktifkan kembali.');
    }
  }, [stopListening, stopSpeaking, resetWakeWordDetection, speakText]);

  // Manual activation
  const activateAssistant = useCallback(() => {
    if (!isMountedRef.current) return;
    
    console.log('🔊 Activating Gemini AI assistant');
    setIsActive(true);
    
    setTimeout(() => {
      if (isMountedRef.current) {
        speakText('Halo! Saya Asisten Inklusi. Silakan katakan perintah Anda. Untuk bantuan, katakan "bantuan".');
        startListening();
      }
    }, 1000);
  }, [speakText, startListening]);

  // Public API
  const startListeningPublic = useCallback(() => {
    if (isActive) {
      startListening();
    } else {
      activateAssistant();
    }
  }, [isActive, startListening, activateAssistant]);

  // Cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {}
      }
    };
  }, []);

  return {
    // State
    isListening,
    transcript,
    lastCommand,
    isProcessing,
    confidence,
    isActive,
    isWakeWordDetected,
    aiResponse,
    
    // Actions
    startListening: startListeningPublic,
    stopListening,
    processCommand,
    speakText,
    stopSpeaking,
    showHelp,
    activateAssistant,
    resetVoiceAssistant
  };
};

export default useGeminiVoiceAssistant;