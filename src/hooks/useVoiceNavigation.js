import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSpeechRecognition } from '../voice/speechRecognition';
import { speechController } from '../utils/speechController';
import { parseVoiceCommand, getCommandSuggestions } from '../utils/voiceCommandParser';

export const useVoiceNavigation = () => {
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const isRunningRef = useRef(false);
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastCommand, setLastCommand] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  

  const handleCommand = (rawText) => {
    setTranscript(rawText);
    
    const command = parseVoiceCommand(rawText);
    setLastCommand(command);
    
    switch (command.action) {
      case 'readAll':
      case 'readPage':
        speechController.stop();
        setTimeout(() => {
          speechController.readPage();
          speakFeedback("seluruh halaman sudah di baca");
        }, 300);
        break;
        
      case 'readImportant':
        speechController.stop();
        setTimeout(() => {
          speechController.readImportantContent();
          speakFeedback("konten penting sudah selesai di baca");
        }, 300);
        break;
        
      case 'readSummary':
        speechController.stop();
        setTimeout(() => {
          speechController.readSummary();
          speakFeedback("Membacakan ringkasan");
        }, 300);
        break;
        
      case 'pause':
        if (speechController.isReading()) {
          speechController.pause();
          speakFeedback("Bacaan dijeda");
        }
        break;
        
      case 'resume':
        if (speechController.isReading() && speechController.isPaused()) {
          speechController.resume();
          speakFeedback("Melanjutkan bacaan");
        }
        break;
        
      case 'repeat':
        speechController.stop();
        setTimeout(() => {
          speechController.repeat();
          speakFeedback("Mengulang bacaan");
        }, 300);
        break;
        
      case 'navigateHome':
        speechController.stop();
        navigate("/");
        speakFeedback("Kamu sudah di halaman beranda");
        break;

      case 'navigateProfile':
        speechController.stop();
        navigate("/profile");
        speakFeedback("Kamu sudah di halaman Profile");
        break;
        
      case 'navigateJobs':
        speechController.stop();
        navigate("/jobs");
        speakFeedback("Kamu sudah di halaman pekerjaan");
        break;
        
      case 'navigateCompanies':
        speechController.stop();
        navigate("/companies");
        speakFeedback("Kamu sudah di halaman perusahaan");
        break;
        
      case 'navigateCandidates':
        speechController.stop();
        navigate("/candidates");
        speakFeedback("Kamu sudah di halaman kandidat");
        break;

      case 'help':
      case 'helpCommands':
      case 'helpNavigation':
        showHelpGuide();
        break;
        
      case 'search':
        const searchTerm = rawText.replace(/^(cari|temukan|carikan)\s+/i, '');
        handleSearch(searchTerm);
        break;
        
      // AUTH NAVIGATION ONLY - SIMPLIFIED
      case 'navigateLogin':
        speechController.stop();
        navigate("/login");
        speakFeedback("Kamu sudah di halaman login. Silakan isi email dan password secara manual");
        break;
        
      case 'navigateRegister':
        speechController.stop();
        navigate("/register");
        speakFeedback("Kamu sudah di halaman pendaftaran. Silakan isi formulir secara manual");
        break;
        
      case 'navigateForgotPassword':
        speechController.stop();
        navigate("/forgot-password");
        speakFeedback("Mengarahkan ke halaman reset password");
        break;
        
      case 'logout':
        handleLogout();
        break;

      case 'unknown':
      default:
        const newSuggestions = getCommandSuggestions(rawText);
        setSuggestions(newSuggestions);
        
        let feedback = "Perintah tidak dikenali";
        if (newSuggestions.length > 0) {
          feedback += `. Mungkin maksud Anda: ${newSuggestions[0]}?`;
        }
        speakFeedback(feedback);
        break;
    }
  };
  
  const speakFeedback = (text) => {
    const feedback = new SpeechSynthesisUtterance(text);
    feedback.lang = "id-ID";
    feedback.rate = 1.0;
    feedback.volume = 0.8;
    window.speechSynthesis.speak(feedback);
  };

    /**
   * Handle logout action
   */
  const handleLogout = () => {
    speechController.stop();
    
    // Clear user data
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    
    // Navigate to home
    navigate("/");
    
    // Voice feedback
    speakFeedback("Anda telah logout. Mengarahkan ke beranda");
  };
  
  const handleSearch = (term) => {
    navigate(`/jobs?search=${encodeURIComponent(term)}`);
    speakFeedback(`Mencari ${term}`);
    
    setTimeout(() => {
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="cari"]');
      if (searchInput) {
        searchInput.focus();
        searchInput.value = term;
      }
    }, 1000);
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Browser tidak mendukung voice command");
      return;
    }

    if (isRunningRef.current) return;

    if (!recognitionRef.current) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "id-ID";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        isRunningRef.current = true;
        setIsListening(true);
        setSuggestions([]);
      };

      recognition.onend = () => {
        isRunningRef.current = false;
        setIsListening(false);
      };

      recognition.onerror = () => {
        isRunningRef.current = false;
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        handleCommand(text);
      };

      recognitionRef.current = recognition;
    }

    try {
      recognitionRef.current.start();
    } catch (err) {}
  };

  // ============================================
  // HELPER FUNCTIONS - TAMBAH FUNGSI BARU
  // ============================================

  /**
   * Membacakan semua perintah yang tersedia
   */
  const showHelpGuide = () => {
    // Hentikan pembacaan apapun yang sedang berjalan
    speechController.stop();
    
    // Beri jeda sebelum mulai panduan
    setTimeout(() => {
      // Daftar semua perintah yang tersedia
      const helpCommands = [
        "PERINTAH BACA KONTEN:",
        "1. 'baca halaman' - untuk membaca seluruh konten",
        "2. 'baca penting' - untuk membaca inti konten saja",
        "3. 'ringkasan' - untuk ringkasan singkat",
        "",
        "⏯PERINTAH KONTROL:",
        "4. 'berhenti' atau 'jeda' - untuk menghentikan sementara",
        "5. 'lanjut' - untuk melanjutkan pembacaan",
        "6. 'ulangi' - untuk mengulang bacaan terakhir",
        "",
        "PERINTAH NAVIGASI:",
        "7. 'beranda' - ke halaman utama",
        "8. 'profile' - ke halaman profile",
        "9. 'kerja' - ke halaman pekerjaan",
        "10. 'perusahaan' - ke halaman perusahaan",
        "11. 'kandidat' - ke halaman pelamar kerja",
        "",
        "PERINTAH LAINNYA:",
        "12. 'bantuan' - untuk mendengar panduan ini lagi",
        "13. 'cari [kata kunci]' - untuk mencari pekerjaan"
      ];
      
      // Baca panduan secara bertahap
      readHelpStepByStep(helpCommands);
    }, 300);
  };

  /**
   * Membaca panduan perintah secara bertahap dengan jeda
   * @param {string[]} commands - Array perintah untuk dibaca
   */
  const readHelpStepByStep = (commands) => {
    let index = 0;
    
    const readNextCommand = () => {
      if (index < commands.length) {
        const command = commands[index];
        
        if (command === "") {
          // Jika baris kosong, beri jeda lebih lama
          setTimeout(() => {
            index++;
            readNextCommand();
          }, 800);
        } else {
          // Baca perintah dengan feedback khusus
          const feedback = new SpeechSynthesisUtterance(command);
          feedback.lang = "id-ID";
          feedback.rate = 1.1; // Sedikit lebih lambat untuk panduan
          feedback.volume = 1.0;
          
          feedback.onend = () => {
            // Jeda antar perintah
            setTimeout(() => {
              index++;
              readNextCommand();
            }, 500);
          };
          
          window.speechSynthesis.speak(feedback);
        }
      } else {
        // Akhiri dengan penutup
        setTimeout(() => {
          const closing = new SpeechSynthesisUtterance(
            "Itulah semua perintah yang tersedia. Silakan coba perintah yang Anda inginkan."
          );
          closing.lang = "id-ID";
          closing.rate = 0.7;
          window.speechSynthesis.speak(closing);
        }, 1000);
      }
    };
    
    // Mulai dengan pengantar
    const intro = new SpeechSynthesisUtterance(
      "Berikut adalah panduan perintah suara yang tersedia:"
    );
    intro.lang = "id-ID";
    intro.rate = 0.7;
    
    intro.onend = () => {
      setTimeout(() => {
        readNextCommand();
      }, 800);
    };
    
    window.speechSynthesis.speak(intro);
  };

  /**
   * Versi singkat panduan untuk first-time users
   */
  const showQuickHelp = () => {
    const quickHelp = new SpeechSynthesisUtterance(
      "Untuk navigasi, katakan: beranda, profile, kerja, perusahaan, atau kandidat. " +
      "Untuk membaca halaman, katakan: baca halaman, baca penting, atau ringkasan. " +
      "Katakan 'bantuan' untuk panduan lengkap."
    );
    quickHelp.lang = "id-ID";
    quickHelp.rate = 1.0;
    window.speechSynthesis.speak(quickHelp);
  };

  return {
    startListening,
    isListening,
    transcript,
    lastCommand,
    suggestions,
    getCommandSuggestions: (text) => getCommandSuggestions(text),
    showHelpGuide, // 👈 Ekspos fungsi bantuan
    showQuickHelp  // 👈 Ekspos quick help
  };
};