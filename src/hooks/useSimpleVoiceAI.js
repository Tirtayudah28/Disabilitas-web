// src/hooks/useSimpleVoiceNav.js
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const useSimpleVoiceNav = () => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const processCommand = (command) => {
    console.log('🎯 Processing command:', command);
    setLastCommand(command);
    
    const cleanCommand = command.toLowerCase().trim();

    // Simple command mapping
    if (cleanCommand.includes('beranda') || cleanCommand.includes('home')) {
      speak('Menuju ke beranda');
      navigate('/');
    }
    else if (cleanCommand.includes('lowongan') || cleanCommand.includes('pekerjaan') || cleanCommand.includes('jobs')) {
      speak('Menuju ke halaman lowongan');
      navigate('/lowongan');
    }
    else if (cleanCommand.includes('profil') || cleanCommand.includes('profile')) {
      speak('Menuju ke halaman profil');
      navigate('/user/profile');
    }
    else if (cleanCommand.includes('perusahaan') || cleanCommand.includes('companies')) {
      speak('Menuju ke halaman perusahaan');
      navigate('/companies');
    }
    else if (cleanCommand.includes('resume')) {
      speak('Menuju ke halaman resume');
      navigate('/resume');
    }
    else if (cleanCommand.includes('login') || cleanCommand.includes('masuk')) {
      speak('Menuju ke halaman login');
      navigate('/login');
    }
    else if (cleanCommand.includes('daftar') || cleanCommand.includes('register')) {
      speak('Menuju ke halaman pendaftaran');
      navigate('/register');
    }
    else if (cleanCommand.includes('bantuan') || cleanCommand.includes('help')) {
      showHelp();
    }
    else {
      speak('Perintah tidak dikenali. Coba katakan: beranda, lowongan, profil, atau bantuan');
    }
  };

  const showHelp = () => {
    const helpText = `
      Untuk navigasi, katakan: 
      - Beranda atau Home untuk ke halaman utama
      - Lowongan atau Pekerjaan untuk ke halaman lowongan
      - Profil untuk ke halaman profil
      - Perusahaan untuk ke halaman perusahaan
      - Resume untuk ke halaman resume
      - Login untuk ke halaman masuk
      - Daftar untuk ke halaman pendaftaran
    `;
    speak(helpText);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Browser tidak mendukung voice recognition. Gunakan Chrome atau Edge.');
      return;
    }

    // Stop existing recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'id-ID';

    recognition.onstart = () => {
      console.log('🎤 Listening for commands...');
      setIsListening(true);
      speak('Silakan katakan perintah navigasi');
    };

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript;
      console.log('Heard:', command);
      processCommand(command);
    };

    recognition.onerror = (event) => {
      console.error('Error:', event.error);
      if (event.error === 'not-allowed') {
        speak('Izin mikrofon tidak diberikan');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('Recognition ended');
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Auto-start listening on component mount
  useEffect(() => {
    // Give a welcome message
    setTimeout(() => {
      speak('Halo! Untuk navigasi suara, klik tombol microphone dan katakan tujuan Anda');
    }, 2000);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    isListening,
    lastCommand,
    startListening,
    stopListening,
    speak,
    showHelp
  };
};