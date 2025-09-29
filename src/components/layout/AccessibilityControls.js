// src/components/layout/AccessibilityControls.js - Dengan Voice Selector
import React from 'react';
import { useAccessibility } from '../../hooks/useAccessibility';

const AccessibilityControls = () => {
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

  const handleScreenReader = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      readPageContent();
    }
  };

  const getTextSizeLabel = () => {
    switch(accessibility.textSize) {
      case 1: return 'Teks Besar';
      case 2: return 'Teks Sangat Besar';
      default: return 'Teks Besar';
    }
  };

  const getCurrentVoiceName = () => {
    return accessibility.selectedVoice 
      ? accessibility.selectedVoice.name 
      : 'Default';
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-sm py-3 px-4 flex flex-wrap justify-between items-center sticky top-0 z-50">
      <div className="flex items-center space-x-2">
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 w-8 h-8 rounded-full flex items-center justify-center">
          <i className="fas fa-universal-access text-white text-sm"></i>
        </div>
        <span className="font-semibold text-primary-700">Aksesibilitas</span>
      </div>
      
      <div className="flex flex-wrap gap-2 items-center">
        {/* Tombol Kontras Tinggi */}
        <button 
          onClick={toggleHighContrast}
          className={`px-3 py-2 border border-gray-200 rounded-lg text-sm transition flex items-center gap-1 ${
            accessibility.highContrast 
              ? 'bg-primary-500 text-white border-primary-500' 
              : 'bg-white hover:bg-gray-50'
          }`}
          aria-pressed={accessibility.highContrast}
        >
          <i className="fas fa-adjust"></i> 
          <span>Kontras Tinggi</span>
        </button>
        
        {/* Tombol Teks Besar */}
        <button 
          onClick={toggleTextSize}
          className={`px-3 py-2 border border-gray-200 rounded-lg text-sm transition flex items-center gap-1 ${
            accessibility.textSize > 0 
              ? 'bg-primary-500 text-white border-primary-500' 
              : 'bg-white hover:bg-gray-50'
          }`}
          aria-pressed={accessibility.textSize > 0}
        >
          <i className="fas fa-text-height"></i> 
          <span>{getTextSizeLabel()}</span>
        </button>
        
        {/* Tombol Mode Baca */}
        <button 
          onClick={toggleReaderMode}
          className={`px-3 py-2 border border-gray-200 rounded-lg text-sm transition flex items-center gap-1 ${
            accessibility.readerMode 
              ? 'bg-primary-500 text-white border-primary-500' 
              : 'bg-white hover:bg-gray-50'
          }`}
          aria-pressed={accessibility.readerMode}
        >
          <i className="fas fa-book-reader"></i> 
          <span>Mode Baca</span>
        </button>

        {/* Tombol Pilih Suara */}
        <div className="relative">
          <button 
            onClick={toggleVoiceMenu}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition flex items-center gap-1"
          >
            <i className="fas fa-voice"></i> 
            <span>Suara: {getCurrentVoiceName()}</span>
            <i className={`fas fa-chevron-${showVoiceMenu ? 'up' : 'down'} text-xs`}></i>
          </button>

          {/* Dropdown Voice Menu */}
          {showVoiceMenu && (
            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto min-w-48">
              {voices.map((voice, index) => (
                <button
                  key={index}
                  onClick={() => selectVoice(voice)}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 flex justify-between items-center ${
                    accessibility.selectedVoice?.name === voice.name 
                      ? 'bg-primary-50 text-primary-600' 
                      : ''
                  }`}
                >
                  <div>
                    <div className="font-medium">{voice.name}</div>
                    <div className="text-xs text-gray-500">
                      {voice.lang} • {voice.localService ? 'System' : 'Network'}
                    </div>
                  </div>
                  {accessibility.selectedVoice?.name === voice.name && (
                    <i className="fas fa-check text-primary-600"></i>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Tombol Baca Halaman */}
        <button 
          onClick={handleScreenReader}
          className={`px-3 py-2 rounded-lg text-sm transition flex items-center gap-1 ${
            isSpeaking 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-primary-500 text-white hover:bg-primary-600'
          }`}
        >
          <i className={`fas ${isSpeaking ? 'fa-stop' : 'fa-assistive-listening-systems'}`}></i> 
          <span>{isSpeaking ? 'Berhenti' : 'Baca Halaman'}</span>
        </button>
      </div>
    </div>
  );
};

export default AccessibilityControls;