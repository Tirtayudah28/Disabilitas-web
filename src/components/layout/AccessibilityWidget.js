// src/components/layout/AccessibilityWidget.js
import React, { useState } from 'react';
import { useAccessibility } from '../../hooks/useAccessibility';

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    accessibility,
    voices,
    showVoiceMenu,
    toggleHighContrast,
    toggleTextSize,
    toggleReaderMode,
    readPageContent,
    stopSpeaking,
    selectVoice,
    toggleVoiceMenu,
    isSpeaking
  } = useAccessibility();

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (showVoiceMenu) toggleVoiceMenu(); // Close voice menu if open
  };

  const handleScreenReader = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      readPageContent();
      setIsOpen(false); // Close widget after starting
    }
  };

  const getTextSizeLabel = () => {
    switch(accessibility.textSize) {
      case 1: return 'Teks Besar';
      case 2: return 'Teks Sangat Besar';
      default: return 'Teks Normal';
    }
  };

  const getCurrentVoiceName = () => {
    return accessibility.selectedVoice 
      ? accessibility.selectedVoice.name.split(' - ')[0] // Shorten name
      : 'Default';
  };

  return (
    <>
      {/* Main Widget Button */}
      <button
        onClick={toggleWidget}
        className={`
          fixed right-6 z-50 
          w-14 h-14 rounded-full 
          bg-gradient-to-r from-primary-500 to-accent-500 
          shadow-lg hover:shadow-xl 
          transition-all duration-300 
          flex items-center justify-center
          ${isOpen ? 'bottom-32' : 'bottom-6'} /* Naik ke atas saat terbuka */
        `}
        aria-label="Kontrol Aksesibilitas"
        aria-expanded={isOpen}
      >
        <i className={`fas fa-universal-access text-white text-xl ${isSpeaking ? 'animate-pulse' : ''}`}></i>
        
        {/* Indicator dot for active features */}
        {(accessibility.highContrast || accessibility.textSize > 0 || accessibility.readerMode) && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {/* Widget Panel */}
      {isOpen && (
        <div className="fixed right-6 bottom-32 z-40 w-80 max-w-[90vw]">
          {/* Panel Content */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 mb-3">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-t-2xl p-4">
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
            </div>

            {/* Controls */}
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              
              {/* High Contrast Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-adjust text-primary-600"></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Kontras Tinggi</div>
                    <div className="text-xs text-gray-500">Tingkatkan kontras warna</div>
                  </div>
                </div>
                <button
                  onClick={toggleHighContrast}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    accessibility.highContrast ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                  aria-pressed={accessibility.highContrast}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      accessibility.highContrast ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Text Size Control */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-text-height text-primary-600"></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Ukuran Teks</div>
                    <div className="text-xs text-gray-500">{getTextSizeLabel()}</div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => toggleTextSize(-1)}
                    disabled={accessibility.textSize === 0}
                    className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => toggleTextSize(1)}
                    disabled={accessibility.textSize === 2}
                    className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* Reader Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-book-reader text-primary-600"></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Mode Baca</div>
                    <div className="text-xs text-gray-500">Fokus pada konten</div>
                  </div>
                </div>
                <button
                  onClick={toggleReaderMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    accessibility.readerMode ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                  aria-pressed={accessibility.readerMode}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      accessibility.readerMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Voice Selection */}
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-voice text-primary-600"></i>
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
                        onClick={() => selectVoice(voice)}
                        className={`w-full text-left px-3 py-2 hover:bg-white flex justify-between items-center ${
                          accessibility.selectedVoice?.name === voice.name 
                            ? 'bg-primary-50 text-primary-600' 
                            : ''
                        }`}
                      >
                        <div className="text-sm">
                          <div className="font-medium">{voice.name.split(' - ')[0]}</div>
                          <div className="text-xs text-gray-500">
                            {voice.lang} • {voice.localService ? 'System' : 'Network'}
                          </div>
                        </div>
                        {accessibility.selectedVoice?.name === voice.name && (
                          <i className="fas fa-check text-primary-600 text-xs"></i>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer - Screen Reader Button */}
            <div className="border-t border-gray-200 p-4">
              <button
                onClick={handleScreenReader}
                className={`w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                  isSpeaking 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
              >
                <i className={`fas ${isSpeaking ? 'fa-stop' : 'fa-assistive-listening-systems'}`}></i>
                {isSpeaking ? 'Berhenti Membaca' : 'Baca Halaman Ini'}
              </button>
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