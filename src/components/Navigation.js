// src/components/Navigation.js - PERBAIKI LOGIC MENU CARI LOWONGAN
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navigation = () => {
  const location = useLocation();
  
  // Cek status login dari Redux atau localStorage
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated) || 
                         (localStorage.getItem('authToken') && localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/'; // Redirect ke home
  };

  // Tentukan link untuk menu "Cari Lowongan"
  // SELALU arahkan ke /cari-lowongan (LowonganLandingPage)
  const lowonganLink = "/cari-lowongan";

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo - Selalu ke home */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <i className="fas fa-briefcase text-white text-lg"></i>
            </div>
            <span className="text-2xl font-bold text-gray-900">CareerConnect</span>
          </Link>

          <div className="flex items-center space-x-6">
            {/* Menu "Cari Lowongan" - SELALU ke /cari-lowongan */}
            <Link 
              to={lowonganLink}
              className={`font-medium transition-colors ${
                location.pathname === '/cari-lowongan' || location.pathname === '/'
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Cari Lowongan
            </Link>
            
            {/* Perusahaan */}
            <Link 
              to="/companies" 
              className={`font-medium transition-colors ${
                location.pathname === '/companies'
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Perusahaan
            </Link>

            {isAuthenticated ? (
              // Menu untuk user yang sudah login
              <div className="flex items-center space-x-4">
                {/* Profile Link */}
                <Link 
                  to="/profile" 
                  className={`font-medium transition-colors ${
                    location.pathname === '/profile'
                      ? 'text-blue-600 font-semibold' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Profil Saya
                </Link>
                
                {/* Riwayat Lamaran */}
                <Link 
                  to="/application/history" 
                  className={`font-medium transition-colors ${
                    location.pathname === '/application/history'
                      ? 'text-blue-600 font-semibold' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Riwayat
                </Link>
                
                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Menu untuk user belum login
              <div className="flex items-center space-x-4">
                {/* Login Link */}
                <Link 
                  to="/login" 
                  className={`font-medium transition-colors ${
                    location.pathname === '/login'
                      ? 'text-blue-600 font-semibold' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Login
                </Link>
                
                {/* Register Button */}
                <Link 
                  to="/register" 
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;