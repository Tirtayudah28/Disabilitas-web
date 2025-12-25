// speechController.js - VERSI DIPERBAIKI
import { ElevenLabsService } from './elevenlabsService';

// 🔥 SEMUA VARIABLE DIPINDAHKAN KE DALAM OBJECT
export const speechController = (() => {
  // Variabel private dalam closure
  let currentAudio = null;
  let isReading = false;
  let triggeredByVoice = false;
  let paused = false;
  let currentText = "";
  let speechQueue = [];
  let isProcessingQueue = false;
  let manualPauseFlag = false;
  let charIndex = 0;
  let utterance = null;

  return {
    // speechController.js - PERBAIKAN
    async speak(text, options = {}) {
      this.stop();
      
      currentText = text;
      isReading = true;
      paused = false;
      
      try {
        // Coba ElevenLabs
        const audioUrl = await ElevenLabsService.generateSpeech(text, {
          voiceId: options.voiceId || '21m00Tcm4TlvDq8ikWAM',
          stability: options.stability || 0.5,
          similarityBoost: options.similarityBoost || 0.75
        });
        
        // ✅ AudioUrl harus berupa blob URL yang valid
        if (!audioUrl || typeof audioUrl !== 'string' || !audioUrl.startsWith('blob:')) {
          throw new Error('Invalid audio URL');
        }
        
        currentAudio = new Audio(audioUrl);
        
        currentAudio.onplay = () => {
          console.log("🔊 ElevenLabs audio started");
          isReading = true;
          paused = false;
          manualPauseFlag = false;
        };
        
        currentAudio.onended = () => {
          console.log("✅ Audio ended");
          URL.revokeObjectURL(audioUrl); // ✅ Clean up blob URL
          this.handleAudioEnd();
        };
        
        currentAudio.onerror = (error) => {
          console.error("❌ Audio error:", error);
          URL.revokeObjectURL(audioUrl); // ✅ Clean up blob URL
          this.handleAudioEnd();
          this.fallbackToWebSpeech(text);
        };
        
        currentAudio.play().catch(error => {
          console.error("❌ Play failed:", error);
          this.fallbackToWebSpeech(text);
        });
        
      } catch (error) {
        console.error("ElevenLabs failed, using Web Speech:", error);
        this.fallbackToWebSpeech(text);
      }
    },

    fallbackToWebSpeech(text) {
      if (!('speechSynthesis' in window)) {
        console.error("No TTS available");
        return;
      }
      
      // Hentikan yang sedang berjalan
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      
      utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "id-ID";
      utterance.rate = 1.0;
      utterance.volume = 1.0;
      
      utterance.onstart = () => {
        console.log("🎤 Web Speech fallback started");
        isReading = true;
        paused = false;
        manualPauseFlag = false;
      };
      
      utterance.onend = () => {
        this.handleAudioEnd();
      };
      
      utterance.onerror = () => {
        this.handleAudioEnd();
      };
      
      window.speechSynthesis.speak(utterance);
    },

    handleAudioEnd() {
      isReading = false;
      triggeredByVoice = false;
      paused = false;
      manualPauseFlag = false;
      if (currentAudio) {
        currentAudio = null;
      }
      utterance = null;
      this.processQueue();
    },

    // ✅ METHOD YANG HILANG: readPage()
    readPage() {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      
      const mainContent = document.getElementById('main-content');
      if (!mainContent) {
        console.warn("❌ main-content not found");
        return;
      }
      
      // Hapus elemen yang tidak perlu dibaca
      const clone = mainContent.cloneNode(true);
      const elementsToRemove = clone.querySelectorAll(
        'nav, header, footer, button, [aria-hidden="true"], .accessibility-widget, .debug-panel'
      );
      elementsToRemove.forEach(el => el.remove());
      
      const text = clone.innerText
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 2000);
        
      if (!text) {
        console.warn("❌ No text found to read");
        return;
      }

      console.log(`📖 Reading page, ${text.length} characters`);

      triggeredByVoice = true;
      isReading = true;
      paused = false;
      manualPauseFlag = false;
      currentText = text;
      charIndex = 0;

      this.speak(text);
    },

    readImportantContent() {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      
      const mainContent = document.getElementById('main-content');
      if (!mainContent) {
        console.warn("❌ main-content not found");
        return;
      }
      
      // Clone untuk manipulasi
      const clone = mainContent.cloneNode(true);
      
      // HAPUS ELEMEN YANG TIDAK PERLU DIBACA
      const elementsToRemove = clone.querySelectorAll(`
        nav, header, footer, 
        button, a[href], 
        [aria-hidden="true"], 
        .accessibility-widget, .debug-panel,
        script, style, .hidden, [role="presentation"],
        form, input, textarea, select,
        .advertisement, .ads, .banner,
        .social-media, .share-buttons,
        .navigation, .navbar, .menu,
        .breadcrumb, .pagination,
        .sidebar, .widget,
        iframe, video, audio,
        [role="navigation"], [role="banner"], [role="complementary"],
        .btn, .button, .cta-button
      `);
      
      elementsToRemove.forEach(el => el.remove());
      
      // AMBIL HANYA ELEMEN PENTING
      const importantElements = clone.querySelectorAll(`
        h1, h2, h3, h4, h5, h6,
        [role="main"], [role="article"],
        article, section, main,
        .content, .main-content, .article-content,
        .job-description, .job-detail,
        .company-info, .profile-detail,
        p, li, td, th,
        [itemprop="description"], [itemprop="articleBody"]
      `);
      
      if (importantElements.length === 0) {
        console.warn("⚠️ No important elements found, falling back to full read");
        this.readPage();
        return;
      }
      
      // BUILD SMART TEXT
      let structuredText = "";
      
      importantElements.forEach((el, index) => {
        const tagName = el.tagName.toLowerCase();
        const text = el.innerText.replace(/\s+/g, ' ').trim();
        
        if (text && text.length > 5) {
          if (tagName.startsWith('h')) {
            structuredText += `\n\n${text}. `;
          } else {
            structuredText += `\n${text}. `;
          }
        }
      });
      
      let finalText = structuredText.trim().slice(0, 2000);
      
      if (!finalText || finalText.length < 20) {
        console.warn("❌ Not enough important content");
        this.readPage();
        return;
      }
      
      console.log(`📖 Reading ${finalText.length} chars of important content`);
      
      triggeredByVoice = true;
      paused = false;
      manualPauseFlag = false;
      
      this.speak(finalText);
    },

    readSummary() {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      
      const mainContent = document.getElementById('main-content');
      if (!mainContent) return;
      
      const clone = mainContent.cloneNode(true);
      
      // Hapus elemen yang tidak perlu
      const elementsToRemove = clone.querySelectorAll(`
        nav, header, footer, button, a, 
        [aria-hidden="true"], script, style,
        form, input, .btn, .button
      `);
      elementsToRemove.forEach(el => el.remove());
      
      // Hanya ambil headings utama
      const summaryElements = clone.querySelectorAll(`
        h1, h2, h3,
        .summary, .excerpt, .highlight
      `);
      
      let summaryText = "";
      
      summaryElements.forEach((el, index) => {
        const text = el.innerText.replace(/\s+/g, ' ').trim();
        if (text && text.length > 3) {
          summaryText += `${index + 1}. ${text}. `;
        }
      });
      
      summaryText = summaryText.slice(0, 800);
      
      if (summaryText.length > 20) {
        console.log(`📋 Reading ${summaryText.length} chars summary`);
        triggeredByVoice = true;
        this.speak("Ringkasan halaman: " + summaryText);
      } else {
        console.warn("❌ Summary too short, reading important content instead");
        this.readImportantContent();
      }
    },

    pause() {
      console.log("🔘 Pause called", {
        isReading,
        paused,
        manualPauseFlag,
        hasAudio: !!currentAudio,
        webSpeechPaused: window.speechSynthesis.paused
      });
      
      if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        paused = true;
        manualPauseFlag = true;
      } else if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        paused = true;
        manualPauseFlag = true;
      } else {
        console.warn("⚠️ Cannot pause - not speaking or already paused");
      }
    },

    resume() {
      console.log("🔘 Resume called", {
        isReading,
        paused,
        manualPauseFlag,
        hasAudio: !!currentAudio,
        webSpeechPaused: window.speechSynthesis.paused
      });
      
      if (currentAudio && paused) {
        currentAudio.play();
        paused = false;
        manualPauseFlag = false;
      } else if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        paused = false;
        manualPauseFlag = false;
      } else {
        console.warn("⚠️ Cannot resume - not paused");
      }
    },

    stop() {
      console.log("🛑 Stop called");
      
      // Stop ElevenLabs audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
      }
      
      // Stop Web Speech API
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      
      // Reset semua state
      isReading = false;
      triggeredByVoice = false;
      paused = false;
      manualPauseFlag = false;
      currentText = "";
      charIndex = 0;
      speechQueue = [];
      isProcessingQueue = false;
      utterance = null;
    },

    stopIfManualNavigation() {
      if (isReading && !triggeredByVoice) {
        this.stop();
      }
    },

    markManualNavigation() {
      triggeredByVoice = false;
    },

    isReading() {
      return isReading || (window.speechSynthesis && window.speechSynthesis.speaking);
    },
    
    isPaused() {
      return manualPauseFlag || paused || (window.speechSynthesis && window.speechSynthesis.paused);
    },
    
    addToQueue(text) {
      speechQueue.push(text);
      if (!isProcessingQueue) {
        this.processQueue();
      }
    },
    
    processQueue() {
      if (speechQueue.length > 0 && !isReading) {
        isProcessingQueue = true;
        const nextText = speechQueue.shift();
        this.speak(nextText);
      } else {
        isProcessingQueue = false;
      }
    },
    
    getStatus() {
      return {
        isReading,
        paused,
        manualPauseFlag,
        synthesisSpeaking: window.speechSynthesis.speaking,
        synthesisPaused: window.speechSynthesis.paused,
        hasAudio: !!currentAudio,
        hasUtterance: !!utterance,
        queueLength: speechQueue.length
      };
    },

    // Method untuk mengulang bacaan terakhir
    repeat() {
      if (currentText) {
        this.stop();
        setTimeout(() => {
          this.speak(currentText);
        }, 300);
      } else {
        this.readPage(); // Fallback ke baca halaman
      }
    }
  };
})(); // 🔥 IIFE untuk encapsulation