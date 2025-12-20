let utterance = null;
let isReading = false;
let triggeredByVoice = false;
let paused = false;
let currentText = "";
let charIndex = 0;
let manualPauseFlag = false;
let speechQueue = [];
let isProcessingQueue = false;

export const speechController = {
  speak(text, options = {}) {
    // Clear previous
    speechSynthesis.cancel();
    
    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.rate = options.rate || 1.0;
    utterance.volume = options.volume || 1.0;
    
    // 🔥 EVENT HANDLERS
    utterance.onstart = () => {
      console.log("🎤 Speech started");
      isReading = true;
      paused = false;
      manualPauseFlag = false;
    };
    
    utterance.onend = () => {
      console.log("✅ Speech ended");
      isReading = false;
      triggeredByVoice = false;
      paused = false;
      manualPauseFlag = false;
      // Process next in queue
      this.processQueue();
    };
    
    utterance.onpause = () => {
      paused = true;
      manualPauseFlag = true;
    };
    
    utterance.onresume = () => {
      paused = false;
      manualPauseFlag = false;
    };
    
    utterance.onerror = (event) => {
      if (event.error !== 'interrupted') {
        isReading = false;
        paused = false;
        manualPauseFlag = false;
      }
      this.processQueue();
    };
    
    speechSynthesis.speak(utterance);
    isReading = true;
  },

  // ✅ METHOD YANG HILANG: readPage()
  readPage() {
    speechSynthesis.cancel();
    
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
  },
  
  readImportantContent() {
    speechSynthesis.cancel();
    
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
    speechSynthesis.cancel();
    
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
      speaking: speechSynthesis.speaking,
      paused: speechSynthesis.paused,
      manualPauseFlag,
      hasUtterance: !!utterance
    });
    
    if (speechSynthesis.speaking && !manualPauseFlag) {
      try {
        speechSynthesis.pause();
        
        setTimeout(() => {
          paused = true;
          manualPauseFlag = true;
        }, 100);
        
      } catch (error) {
        console.error("❌ Error pausing:", error);
      }
    } else {
      console.warn("⚠️ Cannot pause - not speaking or already paused");
    }
  },

  resume() {
    console.log("🔘 Resume called", {
      speaking: speechSynthesis.speaking,
      paused: speechSynthesis.paused,
      manualPauseFlag,
      hasUtterance: !!utterance
    });
    
    if (manualPauseFlag) {
      try {
        speechSynthesis.resume();
        
        setTimeout(() => {
          paused = false;
          manualPauseFlag = false;
        }, 100);
        
      } catch (error) {
        console.error("❌ Error resuming:", error);
      }
    } else {
      console.warn("⚠️ Cannot resume - not paused");
    }
  },

  stop() {
    console.log("🛑 Stop called");
    speechSynthesis.cancel();
    isReading = false;
    triggeredByVoice = false;
    paused = false;
    manualPauseFlag = false;
    currentText = "";
    charIndex = 0;
    speechQueue = [];
    isProcessingQueue = false;
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
    return isReading || speechSynthesis.speaking;
  },
  
  isPaused() {
    return manualPauseFlag || speechSynthesis.paused;
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
      synthesisSpeaking: speechSynthesis.speaking,
      synthesisPaused: speechSynthesis.paused,
      hasUtterance: !!utterance,
      queueLength: speechQueue.length
    };
  }
};