// src/components/common/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ size = 'large', text = 'Memuat...' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12', 
    large: 'w-16 h-16',
    xlarge: 'w-20 h-20'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Spinner */}
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
        {/* Spinning ring */}
        <div className="absolute inset-0 border-4 border-transparent border-t-primary-500 rounded-full animate-spin"></div>
        {/* Inner dot */}
        <div className="absolute inset-2 bg-primary-500 rounded-full animate-pulse"></div>
      </div>
      
      {/* Loading text */}
      {text && (
        <p className="mt-4 text-gray-600 font-medium animate-pulse">
          {text}
        </p>
      )}
      
      {/* Accessibility */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Sedang memuat halaman
      </div>
    </div>
  );
};

export default LoadingSpinner;