// src/components/sections/CTASection.js
import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Siap Memulai Perjalanan Karir Inklusif?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Bergabunglah dengan ribuan penyandang disabilitas yang telah menemukan lingkungan kerja yang mendukung.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">
          <Link 
            to="/daftar" 
            className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover-lift shadow-lg flex items-center justify-center gap-2"
          >
            <i className="fas fa-user-plus"></i> Daftar Sekarang - Gratis!
          </Link>
          <Link 
            to="/tentang" 
            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition flex items-center justify-center gap-2"
          >
            <i className="fas fa-play-circle"></i> Pelajari Lebih Lanjut
          </Link>
        </div>
        
        <div className="bg-white/20 backdrop-blur rounded-2xl p-6 inline-block max-w-md">
          <p className="font-medium mb-3">Sudah bergabung dengan kami:</p>
          <div className="flex justify-center items-center gap-6 flex-wrap">
            <div className="text-center">
              <p className="text-2xl font-bold">5,000+</p>
              <p className="text-sm">Pencari Kerja</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">350+</p>
              <p className="text-sm">Perusahaan</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">1,200+</p>
              <p className="text-sm">Sukses Ditempatkan</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;