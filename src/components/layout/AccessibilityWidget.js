import React, { useState, useEffect } from "react";
import { useAccessibility } from "../../hooks/useAccessibility";
import { useVoiceNavigation } from "../../hooks/useVoiceNavigation";
import { speechController } from "../../utils/speechController";

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  const {
    accessibility,
    voices = [],
    isLoadingVoices,
    toggleHighContrast,
    toggleTextSize,
    toggleReaderMode,
    selectVoice,
  } = useAccessibility();

  const { 
    startListening, 
    isListening, 
    transcript, 
    lastCommand, 
    suggestions 
  } = useVoiceNavigation();

  const toggleWidget = () => setIsOpen(!isOpen);
  
  const toggleHelpModal = () => {
    setShowHelpModal(!showHelpModal);
  };

  useEffect(() => {
    if (speechController.isReading()) {
      const interval = setInterval(() => {
        setForceUpdate(prev => prev + 1);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [speechController.isReading()]);

  const handlePauseResume = () => {
    if (speechController.isReading()) {
      if (speechController.isPaused()) {
        speechController.resume();
      } else {
        speechController.pause();
      }
      setForceUpdate(prev => prev + 1);
    }
  };

  const getPauseResumeInfo = () => {
    const isPaused = window.speechSynthesis.paused;
    return {
      icon: isPaused ? "fa-play" : "fa-pause",
      label: isPaused ? "Lanjut" : "Pause",
      isPaused
    };
  };

  const pauseResumeInfo = getPauseResumeInfo();

  const handleVoiceCommand = (commandText) => {
    const feedback = new SpeechSynthesisUtterance(`Menggunakan perintah: ${commandText}`);
    feedback.lang = "id-ID";
    window.speechSynthesis.speak(feedback);
    
    if (commandText.includes('baca halaman') || commandText.includes('baca semua')) {
      speechController.readPage();
    } else if (commandText.includes('baca penting') || commandText.includes('intinya')) {
      if (speechController.readImportantContent) {
        speechController.readImportantContent();
      } else {
        speechController.readPage();
      }
    } else if (commandText.includes('ringkasan')) {
      if (speechController.readSummary) {
        speechController.readSummary();
      } else {
        speechController.readPage();
      }
    } else if (commandText.includes('berhenti') || commandText.includes('jeda')) {
      if (speechController.isReading()) {
        speechController.pause();
      }
    } else if (commandText.includes('lanjut')) {
      if (speechController.isReading() && speechController.isPaused()) {
        speechController.resume();
      }
    }
  };

  const getTextSizeLabel = () => {
    if (accessibility?.textSize === 1) return "Teks Besar";
    if (accessibility?.textSize === 2) return "Teks Sangat Besar";
    return "Teks Normal";
  };

  const getCurrentVoiceName = () => {
    if (!accessibility?.selectedVoice) return "Default";
    return accessibility.selectedVoice.name?.split(" - ")[0] || accessibility.selectedVoice.name;
  };

  // Format nama suara untuk ditampilkan
  const getVoiceDisplayName = (voice) => {
    if (!voice) return "";
    
    const name = voice.name || 'Unknown Voice';
    const lang = voice.lang || 'Unknown Language';
    
    if (lang.toLowerCase().includes('id')) {
      return `${name} (Bahasa Indonesia)`;
    }
    
    return `${name} (${lang})`;
  };

  // Deteksi apakah mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <>
      {/* Tombol Mengambang dengan Smooth Animation */}
      <button
        onClick={toggleWidget}
        className={`
          fixed right-6 z-50
          w-14 h-14 rounded-full
          bg-gradient-to-r from-blue-500 to-purple-500
          shadow-lg transition-all duration-300 ease-out
          flex items-center justify-center
          border-2 border-white
          ${isOpen ? "bottom-20 rotate-45" : "bottom-6 hover:scale-110"}
          ${isListening ? "animate-pulse ring-4 ring-green-400" : ""}
        `}
        aria-label="Buka panel aksesibilitas"
      >
        <i className="fas fa-universal-access text-white text-xl transition-transform duration-300"></i>
      </button>

      {/* Panel Aksesibilitas dengan Smooth Animation */}
      <div className={`
        fixed right-6 z-40 w-80 max-w-[90vw]
        transition-all duration-300 ease-out
        ${isOpen 
          ? "bottom-28 opacity-100 translate-y-0" 
          : "bottom-20 opacity-0 translate-y-10 pointer-events-none"
        }
      `}>
        <div className={`
          bg-white rounded-2xl shadow-2xl border border-gray-200
          transition-all duration-300
          ${isOpen ? "scale-100" : "scale-95"}
        `}>
          {/* Header Panel */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fas fa-universal-access"></i>
                <h3 className="font-semibold">Aksesibilitas</h3>
              </div>
              <button 
                onClick={toggleWidget}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-all duration-200"
                aria-label="Tutup panel"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <p className="text-sm opacity-90 mt-1">
              Kontrol aksesibilitas & perintah suara
            </p>
          </div>

          {/* Konten Panel */}
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">

            {/* 🎙️ BAGIAN PERINTAH SUARA */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <button
                onClick={startListening}
                className={`
                  w-full py-3 rounded-lg font-medium
                  flex items-center justify-center gap-2
                  transition-all duration-200 mb-2
                  ${isListening
                    ? "bg-green-500 text-white animate-pulse scale-105"
                    : "bg-blue-500 text-white hover:bg-blue-600 hover:scale-105"
                  }
                `}
                aria-label={isListening ? "Sedang mendengarkan" : "Aktifkan perintah suara"}
              >
                <i className="fas fa-microphone"></i>
                {isListening ? "Mendengarkan..." : "Aktifkan Perintah Suara"}
              </button>

              {/* Transcript dari User */}
              {transcript && (
                <div className="text-xs text-gray-700 mt-2">
                  <div className="font-semibold">Anda berkata:</div>
                  <div className="bg-white p-2 rounded border mt-1">"{transcript}"</div>
                </div>
              )}

              {/* Status Command Terakhir */}
              {lastCommand && (
                <div className={`text-xs mt-2 p-2 rounded ${
                  lastCommand.action === 'unknown' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  <div className="font-semibold">
                    {lastCommand.action === 'unknown' ? '⚠️ Tidak dikenali' : '✅ Dikenali'}
                  </div>
                  <div className="text-xs opacity-75">
                    Aksi: {lastCommand.action} | 
                    Confidence: {lastCommand.confidence ? (lastCommand.confidence * 100).toFixed(0) : '0'}%
                  </div>
                </div>
              )}

              {/* Saran Perintah */}
              {suggestions && suggestions.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs font-semibold text-gray-700">Mungkin maksud Anda:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {suggestions.slice(0, 3).map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleVoiceCommand(suggestion)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded transition-all duration-150 hover:scale-105"
                        aria-label={`Coba perintah: ${suggestion}`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 🔊 BAGIAN KONTROL BACAAN */}
            <div className="border-t border-gray-200 pt-3">
              <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <i className="fas fa-volume-up"></i>
                Kontrol Bacaan
                {window.speechSynthesis.speaking && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    window.speechSynthesis.paused 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {window.speechSynthesis.paused ? '⏸️ Dijeda' : '🔊 Membaca'}
                  </span>
                )}
              </div>

              {/* Baris 1: Pilihan Mode Baca */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={() => {
                    speechController.readPage();
                    setForceUpdate(prev => prev + 1);
                  }}
                  className="py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={speechController.isReading() && !pauseResumeInfo.isPaused}
                  aria-label="Baca semua konten halaman"
                >
                  <i className="fas fa-book"></i>
                  Baca Semua
                </button>
                
                <button
                  onClick={() => {
                    if (speechController.readImportantContent) {
                      speechController.readImportantContent();
                    } else {
                      speechController.readPage();
                    }
                    setForceUpdate(prev => prev + 1);
                  }}
                  className="py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={speechController.isReading() && !pauseResumeInfo.isPaused}
                  aria-label="Baca hanya konten penting"
                >
                  <i className="fas fa-star"></i>
                  Baca Penting
                </button>
              </div>

              {/* Baris 2: Kontrol Playback */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handlePauseResume}
                  className="py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!speechController.isReading()}
                  aria-label={pauseResumeInfo.label + " pembacaan"}
                >
                  <i className={`fas ${pauseResumeInfo.icon}`}></i>
                  {pauseResumeInfo.label}
                </button>

                <button
                  onClick={() => {
                    speechController.stop();
                    setForceUpdate(prev => prev + 1);
                  }}
                  className="py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!speechController.isReading()}
                  aria-label="Hentikan pembacaan"
                >
                  <i className="fas fa-stop"></i>
                  Stop
                </button>
              </div>
            </div>

            {/* 🎨 BAGIAN AKSESIBILITAS VISUAL */}
            
            {/* Toggle Kontras Tinggi */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Kontras Tinggi</div>
                <div className="text-xs text-gray-500">
                  Tingkatkan visibilitas teks
                </div>
              </div>
              <button
                onClick={toggleHighContrast}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                  accessibility?.highContrast ? "bg-blue-500" : "bg-gray-200"
                }`}
                aria-label={`${accessibility?.highContrast ? 'Nonaktifkan' : 'Aktifkan'} kontras tinggi`}
                aria-checked={accessibility?.highContrast || false}
                role="switch"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ${
                    accessibility?.highContrast
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Ukuran Teks */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Ukuran Teks</div>
                <div className="text-xs text-gray-500">
                  {getTextSizeLabel()}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => toggleTextSize(-1)}
                  disabled={accessibility?.textSize === 0}
                  className="w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 hover:scale-110"
                  aria-label="Perkecil teks"
                >
                  A-
                </button>
                <button
                  onClick={() => toggleTextSize(1)}
                  disabled={accessibility?.textSize === 2}
                  className="w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 hover:scale-110"
                  aria-label="Perbesar teks"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Mode Baca */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Mode Baca</div>
                <div className="text-xs text-gray-500">Fokus pada konten</div>
              </div>
              <button
                onClick={toggleReaderMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                  accessibility?.readerMode ? "bg-blue-500" : "bg-gray-200"
                }`}
                aria-label={`${accessibility?.readerMode ? 'Nonaktifkan' : 'Aktifkan'} mode baca`}
                aria-checked={accessibility?.readerMode || false}
                role="switch"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ${
                    accessibility?.readerMode
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* TOMBOL BANTUAN DI BAWAH */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={toggleHelpModal}
                className="w-full py-3 rounded-lg bg-white text-gray-800 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 border border-gray-300 hover:border-gray-400 hover:scale-105"
                aria-label="Buka panduan penggunaan fitur"
              >
                <i className="fas fa-question-circle text-gray-600"></i>
                Panduan Penggunaan
              </button>
            </div>
          </div>
        </div>

        {/* Arrow Indikator */}
        <div className="flex justify-end">
          <div className="w-4 h-4 bg-white rotate-45 -mt-2 mr-5 border-r border-b border-gray-200"></div>
        </div>
      </div>

      {/* MODAL BANTUAN */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header Modal */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <i className="fas fa-question-circle text-2xl"></i>
                  <h2 className="text-2xl font-bold">Panduan Penggunaan Fitur Aksesibilitas</h2>
                </div>
                <button 
                  onClick={toggleHelpModal}
                  className="text-white hover:text-gray-200 text-xl"
                  aria-label="Tutup panduan"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <p className="mt-2 opacity-90">
                Pelajari cara menggunakan semua fitur aksesibilitas yang tersedia
              </p>
            </div>

            {/* Konten Modal */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                {/* Bagian 1: Perintah Suara */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <i className="fas fa-microphone text-blue-500"></i>
                    Perintah Suara
                  </h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="mb-3">
                      <strong>Cara menggunakan:</strong> Klik tombol "Aktifkan Perintah Suara", lalu ucapkan perintah yang diinginkan.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded border">
                        <h4 className="font-medium text-gray-700 mb-2">📖 Baca Konten</h4>
                        <ul className="text-sm space-y-1">
                          <li>"<strong>baca halaman</strong>" - Baca semua konten</li>
                          <li>"<strong>baca penting</strong>" - Baca inti konten</li>
                          <li>"<strong>ringkasan</strong>" - Ringkasan singkat</li>
                        </ul>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <h4 className="font-medium text-gray-700 mb-2">⏯️ Kontrol Bacaan</h4>
                        <ul className="text-sm space-y-1">
                          <li>"<strong>berhenti</strong>" atau "<strong>jeda</strong>" - Hentikan sementara</li>
                          <li>"<strong>lanjut</strong>" - Lanjutkan pembacaan</li>
                          <li>"<strong>ulangi</strong>" - Ulang bacaan terakhir</li>
                        </ul>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <h4 className="font-medium text-gray-700 mb-2">🧭 Navigasi</h4>
                        <ul className="text-sm space-y-1">
                          <li>"<strong>beranda</strong>" - Ke halaman utama</li>
                          <li>"<strong>kerja</strong>" - Ke halaman pekerjaan</li>
                          <li>"<strong>perusahaan</strong>" - Ke halaman perusahaan</li>
                          <li>"<strong>kandidat</strong>" - Ke halaman pelamar</li>
                          <li>"<strong>buka profile</strong>" - Ke halaman landingPage profile</li>
                          <li>"<strong>profile saya</strong>" - Ke halaman profile sendiri</li>
                        </ul>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <h4 className="font-medium text-gray-700 mb-2">🆘 Bantuan</h4>
                        <ul className="text-sm space-y-1">
                          <li>"<strong>bantuan</strong>" - Panduan lengkap (suara)</li>
                          <li>"<strong>help</strong>" - Panduan (bahasa Inggris)</li>
                          <li>"<strong>tolong</strong>" - Minta bantuan</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Bagian 2: Kontrol Manual */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <i className="fas fa-hand-pointer text-purple-500"></i>
                    Kontrol Manual
                  </h3>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Baca Halaman</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                              <i className="fas fa-book text-white text-sm"></i>
                            </div>
                            <span className="text-sm">Baca Semua - Baca seluruh konten</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                              <i className="fas fa-star text-white text-sm"></i>
                            </div>
                            <span className="text-sm">Baca Penting - Hanya konten utama</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Kontrol Pembacaan</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
                              <i className="fas fa-pause text-white text-sm"></i>
                            </div>
                            <span className="text-sm">Pause/Lanjut - Kontrol playback</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                              <i className="fas fa-stop text-white text-sm"></i>
                            </div>
                            <span className="text-sm">Stop - Hentikan pembacaan</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Bagian 3: Aksesibilitas Visual */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <i className="fas fa-eye text-green-500"></i>
                    Aksesibilitas Visual
                  </h3>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Kontras Tinggi</h4>
                        <p className="text-sm text-gray-600">
                          Meningkatkan visibilitas teks dengan kontras warna yang lebih tinggi. 
                          Cocok untuk pengguna dengan gangguan penglihatan.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Ukuran Teks</h4>
                        <p className="text-sm text-gray-600">
                          Sesuaikan ukuran teks dengan tombol A+ (perbesar) dan A- (perkecil). 
                          Tersedia 3 level ukuran.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Mode Baca</h4>
                        <p className="text-sm text-gray-600">
                          Fokus pada konten utama dengan menyembunyikan elemen yang tidak perlu. 
                          Ideal untuk membaca panjang.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Tips */}
                <section className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <i className="fas fa-lightbulb text-yellow-500"></i>
                    Tips & Trik
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <i className="fas fa-check text-green-500 mt-1"></i>
                      Gunakan <strong>"baca penting"</strong> untuk membaca inti konten dengan lebih cepat
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fas fa-check text-green-500 mt-1"></i>
                      Katakan <strong>"bantuan"</strong> untuk mendengar panduan melalui suara
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fas fa-check text-green-500 mt-1"></i>
                      Fitur voice navigation otomatis berhenti saat Anda navigasi manual
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fas fa-check text-green-500 mt-1"></i>
                      Pilih suara favorit Anda dari dropdown "Pilih Suara"
                    </li>
                  </ul>
                </section>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <i className="fas fa-info-circle mr-1"></i>
                  Untuk bantuan suara, katakan "bantuan" setelah mengaktifkan perintah suara
                </div>
                <button
                  onClick={toggleHelpModal}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                >
                  Tutup Panduan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityWidget;