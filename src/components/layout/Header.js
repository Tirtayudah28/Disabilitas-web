// src/components/layout/Header.js - UPDATED VERSION
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isEmployer, isJobSeeker } = useAuth();

  // Close menus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsMobileMenuOpen(false);
      setIsProfileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const getMenuClass = (path) => {
    const baseClass = "px-4 py-2 font-medium rounded-lg transition flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2";
    return isActive(path) 
      ? `${baseClass} bg-primary-100 text-primary-600`
      : `${baseClass} hover:bg-primary-50 hover:text-primary-600`;
  };

  const getMobileMenuClass = (path) => {
    const baseClass = "block py-3 px-4 rounded-lg transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2";
    return isActive(path)
      ? `${baseClass} bg-primary-50 text-primary-600`
      : `${baseClass} hover:bg-primary-50`;
  };

  // Render different navigation based on user role
  const renderDesktopMenu = () => {
    // Not logged in - Public menu
    if (!user) {
      return (
        <nav className="hidden lg:flex space-x-1" aria-label="Navigasi utama">
          <Link to="/" className={getMenuClass('/')} aria-current={isActive('/') ? 'page' : undefined}>
            <i className="fas fa-home" aria-hidden="true"></i> 
            <span>Beranda</span>
          </Link>
          <Link to="/lowongan" className={getMenuClass('/lowongan')} aria-current={isActive('/lowongan') ? 'page' : undefined}>
            <i className="fas fa-search" aria-hidden="true"></i> 
            <span>Cari Lowongan</span>
          </Link>
        </nav>
      );
    }

    // Employer menu
    if (isEmployer) {
      return (
        <nav className="hidden lg:flex space-x-1" aria-label="Navigasi employer">
          <Link to="/employer/dashboard" className={getMenuClass('/employer/dashboard')} aria-current={isActive('/employer/dashboard') ? 'page' : undefined}>
            <i className="fas fa-tachometer-alt" aria-hidden="true"></i> 
            <span>Dashboard</span>
          </Link>
          <Link to="/employer/jobs" className={getMenuClass('/employer/jobs')} aria-current={isActive('/employer/jobs') ? 'page' : undefined}>
            <i className="fas fa-briefcase" aria-hidden="true"></i> 
            <span>Lowongan Saya</span>
          </Link>
          <Link to="/employer/applications" className={getMenuClass('/employer/applications')} aria-current={isActive('/employer/applications') ? 'page' : undefined}>
            <i className="fas fa-file-alt" aria-hidden="true"></i> 
            <span>Lamaran</span>
          </Link>
          <Link to="/employer/analytics" className={getMenuClass('/employer/analytics')} aria-current={isActive('/employer/analytics') ? 'page' : undefined}>
            <i className="fas fa-chart-bar" aria-hidden="true"></i> 
            <span>Analytics</span>
          </Link>
        </nav>
      );
    }

    // Job Seeker (Disabilitas) menu
    if (isJobSeeker) {
      return (
        <nav className="hidden lg:flex space-x-1" aria-label="Navigasi pencari kerja">
          <Link to="/" className={getMenuClass('/')} aria-current={isActive('/') ? 'page' : undefined}>
            <i className="fas fa-home" aria-hidden="true"></i> 
            <span>Beranda</span>
          </Link>
          <Link to="/lowongan" className={getMenuClass('/lowongan')} aria-current={isActive('/lowongan') ? 'page' : undefined}>
            <i className="fas fa-search" aria-hidden="true"></i> 
            <span>Cari Lowongan</span>
          </Link>
          <Link to="/profile" className={getMenuClass('/profile')} aria-current={isActive('/profile') ? 'page' : undefined}>
            <i className="fas fa-user" aria-hidden="true"></i> 
            <span>Profil Saya</span>
          </Link>
          <Link to="/resume" className={getMenuClass('/resume')} aria-current={isActive('/resume') ? 'page' : undefined}>
            <i className="fas fa-file-pdf" aria-hidden="true"></i> 
            <span>Resume Saya</span>
          </Link>
        </nav>
      );
    }
  };

  // Render mobile menu based on user role
  const renderMobileMenu = () => {
    if (!user) {
      return (
        <>
          <Link to="/" className={getMobileMenuClass('/')} aria-current={isActive('/') ? 'page' : undefined}>
            <i className="fas fa-home w-5 text-center" aria-hidden="true"></i> Beranda
          </Link>
          <Link to="/lowongan" className={getMobileMenuClass('/lowongan')} aria-current={isActive('/lowongan') ? 'page' : undefined}>
            <i className="fas fa-search w-5 text-center" aria-hidden="true"></i> Cari Lowongan
          </Link>
        </>
      );
    }

    if (isEmployer) {
      return (
        <>
          <Link to="/employer/dashboard" className={getMobileMenuClass('/employer/dashboard')} aria-current={isActive('/employer/dashboard') ? 'page' : undefined}>
            <i className="fas fa-tachometer-alt w-5 text-center" aria-hidden="true"></i> Dashboard
          </Link>
          <Link to="/employer/jobs" className={getMobileMenuClass('/employer/jobs')} aria-current={isActive('/employer/jobs') ? 'page' : undefined}>
            <i className="fas fa-briefcase w-5 text-center" aria-hidden="true"></i> Lowongan Saya
          </Link>
          <Link to="/employer/applications" className={getMobileMenuClass('/employer/applications')} aria-current={isActive('/employer/applications') ? 'page' : undefined}>
            <i className="fas fa-file-alt w-5 text-center" aria-hidden="true"></i> Lamaran
          </Link>
          <Link to="/employer/analytics" className={getMobileMenuClass('/employer/analytics')} aria-current={isActive('/employer/analytics') ? 'page' : undefined}>
            <i className="fas fa-chart-bar w-5 text-center" aria-hidden="true"></i> Analytics
          </Link>
        </>
      );
    }

    if (isJobSeeker) {
      return (
        <>
          <Link to="/" className={getMobileMenuClass('/')} aria-current={isActive('/') ? 'page' : undefined}>
            <i className="fas fa-home w-5 text-center" aria-hidden="true"></i> Beranda
          </Link>
          <Link to="/lowongan" className={getMobileMenuClass('/lowongan')} aria-current={isActive('/lowongan') ? 'page' : undefined}>
            <i className="fas fa-search w-5 text-center" aria-hidden="true"></i> Cari Lowongan
          </Link>
          <Link to="/profile" className={getMobileMenuClass('/profile')} aria-current={isActive('/profile') ? 'page' : undefined}>
            <i className="fas fa-user w-5 text-center" aria-hidden="true"></i> Profil Saya
          </Link>
          <Link to="/resume" className={getMobileMenuClass('/resume')} aria-current={isActive('/resume') ? 'page' : undefined}>
            <i className="fas fa-file-pdf w-5 text-center" aria-hidden="true"></i> Resume Saya
          </Link>
        </>
      );
    }
  };

  // Render user actions (login/register or profile dropdown)
  const renderUserActions = () => {
    if (!user) {
      return (
        <div className="hidden md:flex space-x-2">
          <Link 
            to="/register" 
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition font-medium flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <i className="fas fa-user-plus" aria-hidden="true"></i> 
            <span>Daftar</span>
          </Link>
          <Link 
            to="/login" 
            className="border border-primary-500 text-primary-500 px-4 py-2 rounded-lg hover:bg-primary-50 transition font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Masuk
          </Link>
        </div>
      );
    }

    // User is logged in - show profile dropdown
    return (
      <div className="relative">
        <button
          onClick={toggleProfileMenu}
          onKeyDown={handleKeyDown}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Menu profil pengguna"
          aria-expanded={isProfileMenuOpen}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-gray-900">
              {user.name || 'User'}
            </div>
            <div className="text-xs text-gray-500">
              {isEmployer ? 'Employer' : 'Pencari Kerja'}
            </div>
          </div>
          <i 
            className={`fas fa-chevron-down text-xs transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          ></i>
        </button>

        {/* Profile Dropdown Menu */}
        {isProfileMenuOpen && (
          <div 
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200"
            role="menu"
          >
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            
            {isEmployer ? (
              <>
                <Link 
                  to="/employer/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition flex items-center gap-2"
                  role="menuitem"
                >
                  <i className="fas fa-building w-4" aria-hidden="true"></i>
                  Profil Perusahaan
                </Link>
                <Link 
                  to="/employer/settings" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition flex items-center gap-2"
                  role="menuitem"
                >
                  <i className="fas fa-cog w-4" aria-hidden="true"></i>
                  Pengaturan
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition flex items-center gap-2"
                  role="menuitem"
                >
                  <i className="fas fa-user w-4" aria-hidden="true"></i>
                  Profil Saya
                </Link>
                <Link 
                  to="/settings" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition flex items-center gap-2"
                  role="menuitem"
                >
                  <i className="fas fa-cog w-4" aria-hidden="true"></i>
                  Pengaturan
                </Link>
              </>
            )}
            
            <div className="border-t border-gray-100 mt-2 pt-2">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                role="menuitem"
              >
                <i className="fas fa-sign-out-alt w-4" aria-hidden="true"></i>
                Keluar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <header 
      className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-40" 
      role="banner"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to={user && isEmployer ? "/employer/dashboard" : "/"} 
            className="flex items-center space-x-3 hover-lift p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="InklusiKerja - Kembali ke beranda"
          >
            <div 
              className="bg-gradient-to-r from-primary-500 to-accent-500 w-12 h-12 rounded-full flex items-center justify-center shadow-md"
              aria-hidden="true"
            >
              <i className="fas fa-hands-helping text-white text-xl"></i>
            </div>
            <div>
              <span className="text-2xl font-bold text-primary-700">InklusiKerja</span>
              <p className="text-xs text-gray-600">Platform Inklusif untuk Disabilitas</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          {renderDesktopMenu()}
          
          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {/* Search button for job seekers and public */}
            {(isJobSeeker || !user) && (
              <Link 
                to="/lowongan" 
                className="hidden md:flex items-center gap-2 text-dark hover:text-primary-600 transition p-2 rounded-lg hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Cari lowongan kerja"
              >
                <i className="fas fa-search" aria-hidden="true"></i>
                <span>Cari</span>
              </Link>
            )}
            
            {renderUserActions()}
            
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              onKeyDown={handleKeyDown}
              className="lg:hidden text-dark text-xl p-2 rounded-lg hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <i 
                className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`} 
                aria-hidden="true"
              ></i>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav 
            id="mobile-menu"
            className="lg:hidden bg-white/95 backdrop-blur-md px-4 py-3 shadow-lg mt-2 rounded-lg"
            aria-label="Navigasi mobile"
          >
            {renderMobileMenu()}
            
            {/* Auth links for non-logged in users in mobile */}
            {!user && (
              <div className="border-t border-gray-200 my-2 pt-3">
                <Link 
                  to="/register" 
                  className="block py-3 px-4 hover:bg-primary-50 rounded-lg transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <i className="fas fa-user-plus w-5 text-center" aria-hidden="true"></i> 
                  Daftar
                </Link>
                <Link 
                  to="/login" 
                  className="block py-3 px-4 hover:bg-primary-50 rounded-lg transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <i className="fas fa-sign-in-alt w-5 text-center" aria-hidden="true"></i> 
                  Masuk
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
