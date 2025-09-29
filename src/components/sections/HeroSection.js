// src/components/sections/HeroSection.js
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden hero-pattern">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Setiap Bakat Berharga, Setiap Orang Berhak Berkarya
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-700 leading-relaxed">
            Platform inklusif pertama di Indonesia yang menghubungkan{' '}
            <span className="font-semibold text-primary-600">penyandang disabilitas</span>{' '}
            dengan perusahaan yang peduli terhadap keberagaman dan kesetaraan.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
            <Link 
              to="/daftar" 
              className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover-lift shadow-lg flex items-center justify-center gap-2"
            >
              <i className="fas fa-user-tie"></i> Daftar sebagai Pencari Kerja
            </Link>
            <Link 
              to="/daftar-perusahaan" 
              className="bg-white text-primary-600 border-2 border-primary-200 px-8 py-4 rounded-xl font-bold text-lg hover-lift shadow-md flex items-center justify-center gap-2"
            >
              <i className="fas fa-building"></i> Daftar sebagai Perusahaan
            </Link>
          </div>
          
          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg inline-block">
            <p className="text-gray-700 font-medium mb-2">Didukung oleh:</p>
            <div className="flex flex-wrap justify-center gap-6 items-center">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <i className="fas fa-heart text-red-500 text-2xl"></i>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <i className="fas fa-hand-holding-heart text-pink-500 text-2xl"></i>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <i className="fas fa-users text-blue-500 text-2xl"></i>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <i className="fas fa-balance-scale text-green-500 text-2xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-5 w-20 h-20 bg-primary-200/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-secondary-200/30 rounded-full blur-xl"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-accent-200/30 rounded-full blur-lg"></div>
    </section>
  );
};

export default HeroSection;