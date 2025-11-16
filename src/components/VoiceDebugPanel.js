// src/components/VoiceDebugPanel.js
import React from 'react';
import { useGeminiVoiceAssistant } from '../hooks/useGeminiVoiceAssistant';

const VoiceDebugPanel = () => {
  const {
    isListening,
    transcript,
    lastCommand,
    isProcessing,
    confidence,
    isActive,
    isWakeWordDetected,
    aiResponse,
    startListening,
    stopListening,
    processCommand,
    resetVoiceAssistant
  } = useGeminiVoiceAssistant();

  const testCommands = [
    'buka beranda',
    'cari lowongan',
    'buka profil', 
    'bantuan',
    'baca halaman ini'
  ];

  return (
    <div className="fixed bottom-4 left-4 bg-gray-900 text-white p-4 rounded-lg z-50 max-w-md border-2 border-green-500">
      <h3 className="font-bold mb-3 text-green-400 flex items-center gap-2">
        <span>🎤</span>
        Gemini AI Voice Debug
      </h3>
      
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span>Status:</span>
          <span className={isActive ? 'text-green-400' : 'text-red-400'}>
            {isActive ? '🟢 Aktif' : '🔴 Nonaktif'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Listening:</span>
          <span className={isListening ? 'text-green-400 animate-pulse' : 'text-red-400'}>
            {isListening ? '🎤 Ya' : '🔴 Tidak'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Processing:</span>
          <span className={isProcessing ? 'text-yellow-400' : 'text-gray-400'}>
            {isProcessing ? '⏳ AI Processing' : '✅ Siap'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Wake Word:</span>
          <span className={isWakeWordDetected ? 'text-yellow-400 animate-pulse' : 'text-gray-400'}>
            {isWakeWordDetected ? '🚨 Terdeteksi' : 'Tidak'}
          </span>
        </div>
        
        <div>
          <div className="text-gray-400">Transcript:</div>
          <div className="bg-gray-800 p-2 rounded mt-1 font-mono text-xs">
            {transcript || '-'}
          </div>
        </div>
        
        <div>
          <div className="text-gray-400">Last Command:</div>
          <div className="bg-gray-800 p-2 rounded mt-1 font-mono text-xs">
            {lastCommand || '-'}
          </div>
        </div>
        
        <div className="flex justify-between">
          <span>Confidence:</span>
          <span>{Math.round(confidence * 100)}%</span>
        </div>
        
        {aiResponse && (
          <div className="mt-2 p-2 bg-blue-900 rounded">
            <div className="text-blue-300 text-xs">AI Response:</div>
            <div className="text-xs mt-1">
              <div>Action: <strong>{aiResponse.action}</strong></div>
              <div>Target: <strong>{aiResponse.target}</strong></div>
              <div>Confidence: <strong>{aiResponse.confidence}</strong></div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={isActive ? resetVoiceAssistant : () => processCommand('oke inklusi')}
          className={`px-3 py-1 rounded text-sm ${
            isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isActive ? 'Nonaktifkan' : 'Aktifkan'}
        </button>
        
        <button
          onClick={isListening ? stopListening : startListening}
          className={`px-3 py-1 rounded text-sm ${
            isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isListening ? 'Stop Listen' : 'Start Listen'}
        </button>
      </div>

      <div className="border-t border-gray-700 pt-3">
        <h4 className="text-gray-400 text-sm mb-2">Test Commands:</h4>
        <div className="grid grid-cols-2 gap-2">
          {testCommands.map((cmd, index) => (
            <button
              key={index}
              onClick={() => processCommand(cmd)}
              className="px-2 py-1 bg-gray-700 rounded text-xs hover:bg-gray-600 transition"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceDebugPanel;