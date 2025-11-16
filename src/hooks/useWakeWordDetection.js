// src/hooks/useWakeWordDetection.js - VERSI STABIL DIPERBAIKI
import { useState, useEffect, useCallback, useRef } from 'react';

export const useWakeWordDetection = () => {
  const [isWakeWordDetected, setIsWakeWordDetected] = useState(false);
  const [isListeningForWakeWord, setIsListeningForWakeWord] = useState(true);
  const [recognitionState, setRecognitionState] = useState('idle'); // idle, starting, listening, error, stopped
  const recognitionRef = useRef(null);
  const isMountedRef = useRef(true);
  const restartAttemptsRef = useRef(0);
  const maxRestartAttempts = 5;

  // Simple text-to-speech function
  const speakText = useCallback((text) => {
    if ('speechSynthesis' in window && isMountedRef.current) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.9;
      utterance.volume = 0.8;
      
      // Delay sedikit untuk ensure clean playback
      setTimeout(() => {
        if (isMountedRef.current) {
          window.speechSynthesis.speak(utterance);
        }
      }, 200);
    }
  }, []);

  // Check for wake word
  const checkForWakeWord = useCallback((transcript) => {
    const wakeWords = [
      'oke inklusi', 
      'ok inklusi', 
      'okey inklusi', 
      'hai inklusi', 
      'hello inklusi',
      'mulai inklusi',
      'aktivasi inklusi',
      'buka inklusi'
    ];
    
    const detected = wakeWords.some(wakeWord => 
      transcript.includes(wakeWord)
    );

    if (detected && !isWakeWordDetected && isMountedRef.current) {
      console.log('🚨 Wake word detected:', transcript);
      setIsWakeWordDetected(true);
      setIsListeningForWakeWord(false);
      setRecognitionState('stopped');
      
      // Stop recognition immediately
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log('Error stopping recognition after wake word:', error);
        }
      }
      
      // Give audio feedback
      speakWakeWordResponse();
    }
  }, [isWakeWordDetected]);

  // Wake word response
  const speakWakeWordResponse = useCallback(() => {
    if ('speechSynthesis' in window && isMountedRef.current) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(
        'Halo! Asisten Inklusi siap membantu. Katakan perintah Anda. Untuk bantuan, katakan "bantuan"'
      );
      utterance.lang = 'id-ID';
      utterance.rate = 0.9;
      utterance.volume = 0.8;
      
      // Delay sedikit untuk ensure clean start
      setTimeout(() => {
        if (isMountedRef.current) {
          window.speechSynthesis.speak(utterance);
        }
      }, 500);
    }
  }, []);

  // Safe start function dengan proper state checking
  const safeStartRecognition = useCallback(() => {
    if (!recognitionRef.current || !isMountedRef.current) return;
    
    // Check current state untuk avoid multiple starts
    if (recognitionState === 'listening' || recognitionState === 'starting') {
      console.log('⚠️ Recognition already in progress, skipping start');
      return;
    }

    try {
      setRecognitionState('starting');
      recognitionRef.current.start();
      console.log('🔍 Starting wake word detection...');
    } catch (error) {
      console.error('Error starting wake word detection:', error);
      setRecognitionState('error');
      
      // Handle specific error cases
      if (error.name === 'InvalidStateError') {
        console.log('🔄 InvalidStateError, waiting before retry...');
        setTimeout(() => {
          if (isMountedRef.current && isListeningForWakeWord && !isWakeWordDetected) {
            safeStartRecognition();
          }
        }, 2000);
      } else if (error.name === 'NotAllowedError') {
        console.error('Microphone permission denied');
        speakText('Izin mikrofon tidak diberikan. Silakan izinkan akses mikrofon di browser.');
        setIsListeningForWakeWord(false);
      }
    }
  }, [recognitionState, isListeningForWakeWord, isWakeWordDetected, speakText]);

  // Initialize speech recognition
  useEffect(() => {
    isMountedRef.current = true;

    console.log('🎯 Initializing wake word detection...');
    
    const initializeRecognition = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.warn('Speech Recognition not supported in this browser');
        speakText('Browser tidak mendukung pengenalan suara.');
        return;
      }

      console.log('✅ Speech Recognition supported');

      // Cleanup existing recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Ignore cleanup errors
        }
      }

      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'id-ID';
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        if (!isMountedRef.current) return;

        console.log('🎤 Speech recognition result received');
        
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          console.log('📝 Transcript chunk:', transcript, 'isFinal:', event.results[i].isFinal);
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

         // Check for wake word in both interim and final results
        const combinedTranscript = (interimTranscript + ' ' + finalTranscript).toLowerCase().trim();
        
        // Only check if we have meaningful content
        if (combinedTranscript.trim().length > 3) {
          checkForWakeWord(combinedTranscript);
        }
      };

      recognition.onerror = (event) => {
        if (!isMountedRef.current) return;
        
        console.error('Wake word recognition error:', event.error);
        setRecognitionState('error');
        
        // Handle specific errors
        if (event.error === 'not-allowed' || event.error === 'NotAllowedError') {
          console.error('Microphone access denied');
          speakText('Izin akses mikrofon tidak diberikan. Silakan aktifkan akses mikrofon di pengaturan browser.');
          setIsListeningForWakeWord(false);
          return;
        }
        
        if (event.error === 'audio-capture' || event.error === 'NoAudioInput') {
          console.error('No microphone found');
          speakText('Tidak ditemukan mikrofon. Pastikan mikrofon terpasang dan diizinkan.');
          setIsListeningForWakeWord(false);
          return;
        }

        if (event.error === 'network') {
          console.error('Network error in speech recognition');
          // Continue, might recover
          return;
        }

        console.log('🔄 Restarting after error...');
        // For other errors, try to restart
        setTimeout(() => {
          if (isMountedRef.current && isListeningForWakeWord && !isWakeWordDetected) {
            safeStartRecognition();
          }
        }, 2000);

        // For other errors, try to restart dengan backoff
        restartAttemptsRef.current++;
        if (restartAttemptsRef.current <= maxRestartAttempts) {
          const backoffDelay = Math.min(2000 * restartAttemptsRef.current, 10000);
          console.log(`Retrying in ${backoffDelay}ms (attempt ${restartAttemptsRef.current})`);
          
          setTimeout(() => {
            if (isMountedRef.current && isListeningForWakeWord && !isWakeWordDetected) {
              safeStartRecognition();
            }
          }, backoffDelay);
        } else {
          console.error('Max restart attempts reached, stopping wake word detection');
          speakText('Terlalu banyak percobaan gagal. Wake word detection dihentikan.');
          setIsListeningForWakeWord(false);
        }
      };

      recognition.onstart = () => {
        if (!isMountedRef.current) return;
        console.log('🎧 Wake word detection started');
        setRecognitionState('listening');
        restartAttemptsRef.current = 0; // Reset restart attempts on successful start
      };

      recognition.onend = () => {
        if (!isMountedRef.current) return;
        console.log('🔴 Wake word detection ended');
        setRecognitionState('idle');
        
        // Only restart if we're supposed to be listening and not detected wake word
        if (isListeningForWakeWord && !isWakeWordDetected && isMountedRef.current) {
          console.log('🔄 Restarting wake word detection...');
          // Use a longer delay to prevent rapid restarts
          setTimeout(() => {
            if (isMountedRef.current && isListeningForWakeWord && !isWakeWordDetected) {
              safeStartRecognition();
            }
          }, 1000);
        }
      };
    };

    initializeRecognition();

    return () => {
      isMountedRef.current = false;
      setIsListeningForWakeWord(false);
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    };
  }, [checkForWakeWord, safeStartRecognition, speakText]);

  // Start listening on mount and when conditions change
  useEffect(() => {
    if (isListeningForWakeWord && !isWakeWordDetected && recognitionState === 'idle') {
      // Initial start dengan delay untuk ensure proper initialization
      const initialStartTimer = setTimeout(() => {
        if (isMountedRef.current) {
          safeStartRecognition();
        }
      }, 1500);
      
      return () => clearTimeout(initialStartTimer);
    }
  }, [isListeningForWakeWord, isWakeWordDetected, recognitionState, safeStartRecognition]);

  // Reset wake word detection
  const resetWakeWordDetection = useCallback(() => {
    if (!isMountedRef.current) return;
    
    console.log('🔄 Resetting wake word detection');
    setIsWakeWordDetected(false);
    setIsListeningForWakeWord(true);
    setRecognitionState('idle');
    restartAttemptsRef.current = 0;
    
    // Clean up any existing recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    
    // Restart listening after a delay
    const restartTimer = setTimeout(() => {
      if (isMountedRef.current && isListeningForWakeWord && !isWakeWordDetected) {
        safeStartRecognition();
      }
    }, 2000);

    return () => clearTimeout(restartTimer);
  }, [safeStartRecognition]);

  // Stop wake word detection
  const stopWakeWordDetection = useCallback(() => {
    if (!isMountedRef.current) return;
    
    console.log('🛑 Stopping wake word detection');
    setIsListeningForWakeWord(false);
    
    if (recognitionRef.current && (recognitionState === 'listening' || recognitionState === 'starting')) {
      try {
        recognitionRef.current.stop();
        setRecognitionState('stopped');
      } catch (error) {
        console.error('Error stopping wake word detection:', error);
      }
    }
  }, [recognitionState]);

  // Auto-restart jika listening diaktifkan kembali
  useEffect(() => {
    if (isListeningForWakeWord && !isWakeWordDetected && recognitionState === 'idle') {
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          safeStartRecognition();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isListeningForWakeWord, isWakeWordDetected, recognitionState, safeStartRecognition]);

  // Debug info
  useEffect(() => {
    console.log('🔧 Wake Word Detection State:', {
      isListeningForWakeWord,
      isWakeWordDetected,
      recognitionState,
      restartAttempts: restartAttemptsRef.current
    });
  }, [isListeningForWakeWord, isWakeWordDetected, recognitionState]);

  return {
    isWakeWordDetected,
    isListeningForWakeWord,
    recognitionState,
    resetWakeWordDetection,
    startListeningForWakeWord: safeStartRecognition,
    stopListeningForWakeWord: stopWakeWordDetection
  };
};