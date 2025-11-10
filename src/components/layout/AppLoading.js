// src/components/layout/AppLoading.js
import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

const AppLoading = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
            <i className="fas fa-hands-helping text-white text-2xl"></i>
          </div>
        </div>
        
        {/* Loading Spinner */}
        <LoadingSpinner size="xlarge" text="Menyiapkan InklusiKerja..." />
        
        {/* Loading Progress */}
        <div className="mt-6 w-64 mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-1000 animate-pulse"
              style={{ width: '85%' }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Memuat pengalaman terbaik untuk Anda</p>
        </div>
      </div>
    </div>
  );
};

export default AppLoading;