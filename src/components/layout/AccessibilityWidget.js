// src/components/layout/AccessibilityWidget.js - VERSI DISEDERHANAKAN
import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../../hooks/useAccessibility';
import { useGeminiVoiceAssistant } from '../../hooks/useGeminiVoiceAssistant';

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
  const [wakeWordStatus, setWakeWordStatus] = useState('listening');
  
  const {
    accessibility,
    voices = [],
    toggleHighContrast,
    toggleTextSize,
    toggleReaderMode,
    stopSpeaking,
    selectVoice
  } = useAccessibility();

  // Gunakan Gemini Voice Assistant hook dengan wake word
  const {
    isListening,
    transcript,
    isProcessing,
    confidence,
    isActive,
    isWakeWordDetected,
    processCommand,
    speakText,
    showHelp
  } = useGeminiVoiceAssistant();

  // Update wake word status
  useEffect(() => {
    if (isWakeWordDetected) {
      setWakeWordStatus('detected');
      const timer = setTimeout(() => {
        setWakeWordStatus('inactive');
      }, 5000);
      return () => clearTimeout(timer);
    } else if (isActive) {
      setWakeWordStatus('inactive');
    } else {
      setWakeWordStatus('listening');
    }
  }, [isWakeWordDetected, isActive]);

  // Show status when listening or processing
  useEffect(() => {
    if (isListening || isProcessing) {
      setShowStatus(true);
    } else {
      const timer = setTimeout(() => setShowStatus(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isListening, isProcessing]);

  // Auto-close voice menu when widget closes
  useEffect(() => {
    if (!isOpen) {
      setShowVoiceMenu(false);
    }
  }, [isOpen]);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    setShowVoiceMenu(false);
  };

  const toggleVoiceMenu = () => {
    setShowVoiceMenu(!showVoiceMenu);
  };

  // Bantuan perintah suara
  const speakHelpCommands = () => {
    showHelp();
    setIsOpen(false);
  };

  // Manual activation dengan wake word simulation
  const activateWithWakeWord = () => {
    processCommand('oke inklusi');
    setIsOpen(false);
  };

  // Quick actions untuk navigasi cepat
  const handleQuickAction = (command) => {
    processCommand(command);
    setIsOpen(false);
  };

  const getTextSizeLabel = () => {
    if (!accessibility) return 'Teks Normal';
    
    switch(accessibility.textSize) {
      case 1: return 'Teks Besar';
      case 2: return 'Teks Sangat Besar';
      default: return 'Teks Normal';
    }
  };

  const getCurrentVoiceName = () => {
    if (!accessibility?.selectedVoice) return 'Default';
    return accessibility.selectedVoice.name?.split(' - ')[0] || 'Default';
  };

  // Get wake word status message
  const getWakeWordStatusMessage = () => {
    switch (wakeWordStatus) {
      case 'listening':
        return 'Katakan "Oke Inklusi" untuk memulai';
      case 'detected':
        return 'Wake word terdeteksi! Asisten aktif';
      case 'inactive':
        return 'Asisten siap menerima perintah';
      default:
        return 'Sistem suara aktif';
    }
  };

  // Get wake word status color
  const getWakeWordStatusColor = () => {
    switch (wakeWordStatus) {
      case 'listening':
        return 'text-purple-500';
      case 'detected':
        return 'text-green-500 animate-pulse';
      case 'inactive':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  // Get wake word status icon
  const getWakeWordStatusIcon = () => {
    switch (wakeWordStatus) {
      case 'listening':
        return 'fas fa-ear-listen animate-pulse';
      case 'detected':
        return 'fas fa-check-circle animate-bounce';
      case 'inactive':
        return 'fas fa-microphone';
      default:
        return 'fas fa-universal-access';
    }
  };

  // Fungsi untuk menangani perubahan ukuran teks dengan aman
  const handleTextSizeDecrease = () => {
    if (toggleTextSize && typeof toggleTextSize === 'function') {
      toggleTextSize(-1);
    }
  };

  const handleTextSizeIncrease = () => {
    if (toggleTextSize && typeof toggleTextSize === 'function') {
      toggleTextSize(1);
    }
  };

  // Fungsi untuk memilih voice dengan aman
  const handleSelectVoice = (voice) => {
    if (selectVoice && typeof selectVoice === 'function') {
      selectVoice(voice);
      setShowVoiceMenu(false);
    }
  };

  return (
    <>
      {/* Wake Word Status Indicator */}
      {wakeWordStatus === 'listening' && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 mt-[5rem]">
          <div className="px-6 py-3 bg-purple-500 text-white rounded-full shadow-lg flex items-center space-x-3 animate-pulse">
            <i className="fas fa-ear-listen"></i>
            <span className="font-medium">Katakan "Oke Inklusi" untuk memulai</span>
          </div>
        </div>
      )}

      {/* Voice Navigation Status Indicator */}
      {showStatus && (isListening || isProcessing) && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`
            px-6 py-3 rounded-full shadow-lg flex items-center space-x-3 
            ${isListening 
              ? 'bg-green-500 text-white animate-pulse' 
              : isProcessing
                ? 'bg-blue-500 text-white'
                : 'bg-gray-500 text-white'
            }
          `}>
            <div className="flex space-x-1">
              {isListening && (
                <>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </>
              )}
              {isProcessing && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            
            <span className="font-medium">
              {isListening && 'Mendengarkan...'}
              {isProcessing && 'Memproses...'}
              {!isListening && !isProcessing && 'Siap menerima perintah'}
            </span>
            
            {transcript && (
              <span className="opacity-90 max-w-xs truncate" title={transcript}>
                "{transcript.length > 30 ? transcript.substring(0, 30) + '...' : transcript}"
              </span>
            )}
            
            {confidence > 0 && (
              <span className="text-xs opacity-75">
                {Math.round(confidence * 100)}%
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Widget Button */}
      <button
        onClick={toggleWidget}
        className={`
          fixed right-6 z-50 
          w-14 h-14 rounded-full 
          bg-gradient-to-r from-blue-500 to-purple-500 
          shadow-lg hover:shadow-xl 
          transition-all duration-300 
          flex items-center justify-center
          border-2 border-white
          ${isOpen ? 'bottom-32' : 'bottom-6'}
          ${isListening ? 'animate-pulse ring-4 ring-green-400' : ''}
          ${wakeWordStatus === 'listening' ? 'ring-4 ring-purple-400 animate-pulse' : ''}
          hover:scale-110
        `}
        aria-label="Kontrol Aksesibilitas"
        aria-expanded={isOpen}
      >
        <i className={`fas fa-universal-access text-white text-xl ${
          isListening ? 'animate-bounce' : ''
        }`}></i>
        
        {/* Status indicators */}
        <div className="absolute -top-1 -right-1 flex space-x-1">
          {(accessibility?.highContrast || accessibility?.textSize > 0 || accessibility?.readerMode) && (
            <span className="w-2 h-2 bg-blue-500 rounded-full border border-white"></span>
          )}
          {isListening && (
            <span className="w-2 h-2 bg-green-500 rounded-full border border-white animate-ping"></span>
          )}
          {wakeWordStatus === 'listening' && !isActive && (
            <span className="w-2 h-2 bg-purple-500 rounded-full border border-white animate-ping"></span>
          )}
        </div>
      </button>

      {/* Widget Panel */}
      {isOpen && (
        <div 
          className="fixed right-6 z-40 w-80 max-w-[90vw]"
          style={{ 
            bottom: '128px'
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 mb-3">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-universal-access"></i>
                  <h3 className="font-semibold">Aksesibilitas</h3>
                </div>
                <button 
                  onClick={toggleWidget}
                  className="text-white hover:text-gray-200 transition"
                  aria-label="Tutup panel aksesibilitas"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              {/* Wake Word & Voice Status */}
              <div className="mt-2 text-sm opacity-90">
                <div className="flex items-center space-x-2">
                  <i className={`${getWakeWordStatusIcon()} ${getWakeWordStatusColor()}`}></i>
                  <span>{getWakeWordStatusMessage()}</span>
                </div>
                {isActive && (
                  <div className="flex items-center space-x-2 mt-1">
                    <i className={`fas fa-microphone ${isListening ? 'animate-pulse text-green-300' : ''}`}></i>
                    <span>
                      {isListening 
                        ? 'Sedang mendengarkan perintah...' 
                        : 'Asisten aktif - katakan perintah'
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              
              {/* Wake Word Activation Button */}
              {!isActive && (
                <button
                  onClick={activateWithWakeWord}
                  className="w-full py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition flex items-center justify-center gap-2"
                >
                  <i className="fas fa-bolt"></i>
                  Aktifkan dengan "Oke Inklusi"
                </button>
              )}

              {/* Voice Assistant Status */}
              {isActive && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-green-800">
                    <i className="fas fa-check-circle"></i>
                    <span className="font-medium">Asisten Suara Aktif</span>
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    Katakan perintah seperti "buka beranda" atau "cari lowongan"
                  </p>
                </div>
              )}

              {/* High Contrast Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-adjust text-blue-600"></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Kontras Tinggi</div>
                    <div className="text-xs text-gray-500">Tingkatkan kontras warna</div>
                  </div>
                </div>
                <button
                  onClick={toggleHighContrast}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    accessibility?.highContrast ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                  aria-pressed={accessibility?.highContrast}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      accessibility?.highContrast ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Text Size Control */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-text-height text-blue-600"></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Ukuran Teks</div>
                    <div className="text-xs text-gray-500">{getTextSizeLabel()}</div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={handleTextSizeDecrease}
                    disabled={!accessibility || accessibility?.textSize === 0}
                    className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    A-
                  </button>
                  <button
                    onClick={handleTextSizeIncrease}
                    disabled={!accessibility || accessibility?.textSize === 2}
                    className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* Reader Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-book-reader text-blue-600"></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Mode Baca</div>
                    <div className="text-xs text-gray-500">Sederhanakan tampilan</div>
                  </div>
                </div>
                <button
                  onClick={toggleReaderMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    accessibility?.readerMode ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                  aria-pressed={accessibility?.readerMode}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      accessibility?.readerMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Voice Selection - Hanya tampilkan jika voices tersedia */}
              {voices && voices.length > 0 && (
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-voice text-blue-600"></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Pilih Suara</div>
                        <div className="text-xs text-gray-500">{getCurrentVoiceName()}</div>
                      </div>
                    </div>
                    <button
                      onClick={toggleVoiceMenu}
                      className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <i className={`fas fa-chevron-${showVoiceMenu ? 'up' : 'down'} text-xs`}></i>
                    </button>
                  </div>

                  {/* Voice Dropdown */}
                  {showVoiceMenu && (
                    <div className="mt-2 bg-gray-50 rounded-lg border border-gray-200 max-h-32 overflow-y-auto">
                      {voices.map((voice, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelectVoice(voice)}
                          className={`w-full text-left px-3 py-2 hover:bg-white flex justify-between items-center ${
                            accessibility?.selectedVoice?.name === voice.name 
                              ? 'bg-blue-50 text-blue-600' 
                              : ''
                          }`}
                        >
                          <div className="text-sm">
                            <div className="font-medium">{voice.name?.split(' - ')[0] || 'Unknown Voice'}</div>
                            <div className="text-xs text-gray-500">
                              {voice.lang} • {voice.localService ? 'System' : 'Network'}
                            </div>
                          </div>
                          {accessibility?.selectedVoice?.name === voice.name && (
                            <i className="fas fa-check text-blue-600 text-xs"></i>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer - Action Buttons */}
            <div className="border-t border-gray-200 p-4 space-y-2">
              {/* Quick Actions Grid - selalu tampil */}
              {/* <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickAction('buka beranda')}
                  className="py-2 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <i className="fas fa-home"></i>
                  Beranda
                </button>
                <button
                  onClick={() => handleQuickAction('cari lowongan')}
                  className="py-2 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <i className="fas fa-search"></i>
                  Cari Kerja
                </button>
              </div> */}

              {/* Help Button */}
              <button
                onClick={speakHelpCommands}
                className="w-full py-2 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <i className="fas fa-question-circle"></i>
                Bantuan Perintah Suara
              </button>

              {/* System Status */}
              <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-2">
                    <i className={`fas fa-circle ${getWakeWordStatusColor()}`}></i>
                    <span>{getWakeWordStatusMessage()}</span>
                  </div>
                  {isActive && (
                    <div className="flex items-center justify-center space-x-2">
                      <i className={`fas fa-microphone ${isListening ? 'text-green-500 animate-pulse' : 'text-gray-400'}`}></i>
                      <span>
                        {isListening ? 'Mendengarkan perintah...' : 'Siap menerima perintah'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Arrow pointing to widget */}
          <div className="flex justify-end">
            <div className="w-4 h-4 bg-white transform rotate-45 -mt-2 mr-5 border-r border-b border-gray-200"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityWidget;