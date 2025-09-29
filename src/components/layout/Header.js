// src/components/layout/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-12 z-40">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 hover-lift p-2 rounded-lg">
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 w-12 h-12 rounded-full flex items-center justify-center shadow-md">
            <i className="fas fa-hands-helping text-white text-xl"></i>
          </div>
          <div>
            <span className="text-2xl font-bold text-primary-700">InklusiKerja</span>
            <p className="text-xs text-gray-600">Platform Inklusif untuk Disabilitas</p>
          </div>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-1">
          <Link to="/" className="px-4 py-2 font-medium rounded-lg bg-primary-100 text-primary-600 transition flex items-center gap-1">
            <i className="fas fa-home"></i> <span>Beranda</span>
          </Link>
          <Link to="/lowongan" className="px-4 py-2 font-medium rounded-lg hover:bg-primary-50 hover:text-primary-600 transition flex items-center gap-1">
            <i className="fas fa-search"></i> <span>Cari Lowongan</span>
          </Link>
          <Link to="/profile" className="px-4 py-2 font-medium rounded-lg hover:bg-primary-50 hover:text-primary-600 transition flex items-center gap-1">
            <i className="fas fa-user"></i> <span>Profil Saya</span>
          </Link>
          <Link to="/resume" className="px-4 py-2 font-medium rounded-lg hover:bg-primary-50 hover:text-primary-600 transition flex items-center gap-1">
            <i className="fas fa-file-pdf"></i> <span>Resume Saya</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link to="/lowongan" className="hidden md:flex items-center gap-2 text-dark hover:text-primary-600 transition p-2 rounded-lg hover:bg-primary-50">
            <i className="fas fa-search"></i>
            <span>Cari</span>
          </Link>
          <div className="hidden md:flex space-x-2">
            <Link to="/daftar" className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition font-medium flex items-center gap-2">
              <i className="fas fa-user-plus"></i> <span>Daftar</span>
            </Link>
            <Link to="/masuk" className="border border-primary-500 text-primary-500 px-4 py-2 rounded-lg hover:bg-primary-50 transition font-medium">
              Masuk
            </Link>
          </div>
          <button 
            onClick={toggleMobileMenu}
            className="lg:hidden text-dark text-xl p-2 rounded-lg hover:bg-primary-50"
            aria-label="Toggle mobile menu"
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md px-4 py-3 shadow-lg">
          <Link to="/" className="block py-3 px-4 bg-primary-50 text-primary-600 rounded-lg transition flex items-center gap-2">
            <i className="fas fa-home w-5 text-center"></i> Beranda
          </Link>
          <Link to="/lowongan" className="block py-3 px-4 hover:bg-primary-50 rounded-lg transition flex items-center gap-2">
            <i className="fas fa-search w-5 text-center"></i> Cari Lowongan
          </Link>
          <Link to="/profile" className="block py-3 px-4 hover:bg-primary-50 rounded-lg transition flex items-center gap-2">
            <i className="fas fa-user w-5 text-center"></i> Profil Saya
          </Link>
          <Link to="/resume" className="block py-3 px-4 hover:bg-primary-50 rounded-lg transition flex items-center gap-2">
            <i className="fas fa-file-pdf w-5 text-center"></i> Resume Saya
          </Link>
          <div className="border-t my-2 pt-2">
            <Link to="/daftar" className="block py-3 px-4 hover:bg-primary-50 rounded-lg transition flex items-center gap-2">
              <i className="fas fa-user-plus w-5 text-center"></i> Daftar
            </Link>
            <Link to="/masuk" className="block py-3 px-4 hover:bg-primary-50 rounded-lg transition flex items-center gap-2">
              <i className="fas fa-sign-in-alt w-5 text-center"></i> Masuk
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;