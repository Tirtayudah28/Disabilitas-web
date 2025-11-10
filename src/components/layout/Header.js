// src/components/layout/Header.js - VERSI REDUX
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice'; // IMPORT REDUX ACTION

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('id'); // 'id' or 'en'
  const location = useLocation();
  const navigate = useNavigate();
  
  // AMBIL STATE DARI REDUX
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector(state => state.auth);

  // Close menus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
    setIsLanguageMenuOpen(false);
  }, [location]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsMobileMenuOpen(false);
      setIsProfileMenuOpen(false);
      setIsLanguageMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsProfileMenuOpen(false);
    setIsLanguageMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsMobileMenuOpen(false);
    setIsLanguageMenuOpen(false);
  };

  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout()); // DISPATCH REDUX ACTION
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    setIsLanguageMenuOpen(false);
    // TODO: Implement language change logic
    console.log('Language changed to:', lang);
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

  // Helper function to determine user role
  const isEmployer = user?.userType === 'employer';
  const isCandidate = user?.userType === 'candidate';

  // Render different navigation based on user role - UPDATED PUBLIC MENU
  const renderDesktopMenu = () => {
    // Not logged in - Public menu (UPDATED)
    if (!isAuthenticated || !user) {
      return (
        <nav className="hidden lg:flex space-x-1" aria-label="Navigasi utama">
          <Link to="/lowongan" className={getMenuClass('/lowongan')} aria-current={isActive('/lowongan') ? 'page' : undefined}>
            <i className="fas fa-search" aria-hidden="true"></i> 
            <span>Cari Lowongan</span>
          </Link>
          <Link to="/profile" className={getMenuClass('/profile')} aria-current={isActive('/profile') ? 'page' : undefined}>
            <i className="fas fa-users" aria-hidden="true"></i> 
            <span>Profile</span>
          </Link>
          <Link to="/companies" className={getMenuClass('/companies')} aria-current={isActive('/companies') ? 'page' : undefined}>
            <i className="fas fa-building" aria-hidden="true"></i> 
            <span>Perusahaan</span>
          </Link>
        </nav>
      );
    }

    // Employer menu (tetap sama)
    if (isEmployer) {
      return (
        <nav className="hidden lg:flex space-x-1" aria-label="Navigasi employer">
          {/* <Link to="/employer/dashboard" className={getMenuClass('/employer/dashboard')} aria-current={isActive('/employer/dashboard') ? 'page' : undefined}>
            <i className="fas fa-tachometer-alt" aria-hidden="true"></i> 
            <span>Dashboard</span>
          </Link> */}
          <Link to="/employer/job-posting" className={getMenuClass('/employer/job-posting')} aria-current={isActive('/employer/job-posting') ? 'page' : undefined}>
            <i className="fas fa-briefcase" aria-hidden="true"></i> 
            <span>Lowongan Saya</span>
          </Link>
          <Link to="/employer/applications" className={getMenuClass('/employer/applications')} aria-current={isActive('/employer/applications') ? 'page' : undefined}>
            <i className="fas fa-file-alt" aria-hidden="true"></i> 
            <span>Lamaran</span>
          </Link>
          <Link to="/employer/candidates" className={getMenuClass('/employer/candidates')} aria-current={isActive('/employer/candidates') ? 'page' : undefined}>
            <i className="fas fa-users" aria-hidden="true"></i> 
            <span>Kandidat</span>
          </Link>
        </nav>
      );
    }

    // Job Seeker (Candidate) menu (tetap sama)
    if (isCandidate) {
      return (
        <nav className="hidden lg:flex space-x-1" aria-label="Navigasi pencari kerja">
          {/* <Link to="/" className={getMenuClass('/')} aria-current={isActive('/') ? 'page' : undefined}>
            <i className="fas fa-home" aria-hidden="true"></i> 
            <span>Beranda</span>
          </Link> */}
          <Link to="/lowongan" className={getMenuClass('/lowongan')} aria-current={isActive('/lowongan') ? 'page' : undefined}>
            <i className="fas fa-search" aria-hidden="true"></i> 
            <span>Cari Lowongan</span>
          </Link>
          <Link to="/profile" className={getMenuClass('/profile')} aria-current={isActive('/profile') ? 'page' : undefined}>
            <i className="fas fa-user" aria-hidden="true"></i> 
            <span>Profile</span>
          </Link>
          <Link to="/resume" className={getMenuClass('/resume')} aria-current={isActive('/resume') ? 'page' : undefined}>
            <i className="fas fa-file-pdf" aria-hidden="true"></i> 
            <span>Resume Saya</span>
          </Link>
        </nav>
      );
    }
  };

  // Render mobile menu based on user role - UPDATED PUBLIC MENU
  const renderMobileMenu = () => {
    if (!isAuthenticated || !user) {
      return (
        <>
          <Link to="/lowongan" className={getMobileMenuClass('/lowongan')} aria-current={isActive('/lowongan') ? 'page' : undefined}>
            <i className="fas fa-search w-5 text-center" aria-hidden="true"></i> Cari Lowongan
          </Link>
          <Link to="/profile" className={getMobileMenuClass('/profile')} aria-current={isActive('/profile') ? 'page' : undefined}>
            <i className="fas fa-users w-5 text-center" aria-hidden="true"></i> Profile
          </Link>
          <Link to="/companies" className={getMobileMenuClass('/companies')} aria-current={isActive('/companies') ? 'page' : undefined}>
            <i className="fas fa-building w-5 text-center" aria-hidden="true"></i> Perusahaan
          </Link>
        </>
      );
    }

    if (isEmployer) {
      return (
        <>
          {/* <Link to="/employer/dashboard" className={getMobileMenuClass('/employer/dashboard')} aria-current={isActive('/employer/dashboard') ? 'page' : undefined}>
            <i className="fas fa-tachometer-alt w-5 text-center" aria-hidden="true"></i> Dashboard
          </Link> */}
          <Link to="/employer/job-posting" className={getMobileMenuClass('/employer/job-posting')} aria-current={isActive('/employer/job-posting') ? 'page' : undefined}>
            <i className="fas fa-briefcase w-5 text-center" aria-hidden="true"></i> Lowongan Saya
          </Link>
          <Link to="/employer/applications" className={getMobileMenuClass('/employer/applications')} aria-current={isActive('/employer/applications') ? 'page' : undefined}>
            <i className="fas fa-file-alt w-5 text-center" aria-hidden="true"></i> Lamaran
          </Link>
          <Link to="/employer/candidates" className={getMobileMenuClass('/employer/candidates')} aria-current={isActive('/employer/candidates') ? 'page' : undefined}>
            <i className="fas fa-users w-5 text-center" aria-hidden="true"></i> Kandidat
          </Link>
        </>
      );
    }

    if (isCandidate) {
      return (
        <>
          {/* <Link to="/" className={getMobileMenuClass('/')} aria-current={isActive('/') ? 'page' : undefined}>
            <i className="fas fa-home w-5 text-center" aria-hidden="true"></i> Beranda
          </Link> */}
          <Link to="/lowongan" className={getMobileMenuClass('/lowongan')} aria-current={isActive('/lowongan') ? 'page' : undefined}>
            <i className="fas fa-search w-5 text-center" aria-hidden="true"></i> Cari Lowongan
          </Link>
          <Link to="/profile" className={getMobileMenuClass('/profile')} aria-current={isActive('/profile') ? 'page' : undefined}>
            <i className="fas fa-user w-5 text-center" aria-hidden="true"></i> Profile
          </Link>
          <Link to="/resume" className={getMobileMenuClass('/resume')} aria-current={isActive('/resume') ? 'page' : undefined}>
            <i className="fas fa-file-pdf w-5 text-center" aria-hidden="true"></i> Resume Saya
          </Link>
        </>
      );
    }
  };

  // Render user actions (login/register or profile dropdown) - UPDATED
  const renderUserActions = () => {
    if (!isAuthenticated || !user) {
      return (
        <div className="flex items-center space-x-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={toggleLanguageMenu}
              onKeyDown={handleKeyDown}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-primary-50 transition focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Pilih bahasa"
              aria-expanded={isLanguageMenuOpen}
            >
              <i className="fas fa-globe text-gray-600"></i>
              <span className="text-sm font-medium">
                {currentLanguage === 'id' ? 'ID' : 'EN'}
              </span>
              <i className={`fas fa-chevron-down text-xs transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {/* Language Dropdown Menu */}
            {isLanguageMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200"
                role="menu"
              >
                <button
                  onClick={() => changeLanguage('id')}
                  className={`w-full text-left px-4 py-2 text-sm transition flex items-center justify-between ${
                    currentLanguage === 'id' 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  role="menuitem"
                >
                  <span>Indonesia</span>
                  {currentLanguage === 'id' && <i className="fas fa-check text-primary-600"></i>}
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`w-full text-left px-4 py-2 text-sm transition flex items-center justify-between ${
                    currentLanguage === 'en' 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  role="menuitem"
                >
                  <span>English</span>
                  {currentLanguage === 'en' && <i className="fas fa-check text-primary-600"></i>}
                </button>
              </div>
            )}
          </div>

          {/* Login/Register Buttons */}
          <div className="hidden md:flex space-x-2">
            <Link 
              to="/login" 
              className="border border-primary-500 text-primary-500 px-4 py-2 rounded-lg hover:bg-primary-50 transition font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Masuk
            </Link>
            <Link 
              to="/employer/login" 
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition font-medium flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <span> Untuk Perusahaan</span>
            </Link>
          </div>
        </div>
      );
    }

    // User is logged in - show profile dropdown (tetap sama)
    return (
      <div className="flex items-center space-x-3">
        {/* Language Selector for logged in users */}
        <div className="relative">
          <button
            onClick={toggleLanguageMenu}
            onKeyDown={handleKeyDown}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-primary-50 transition focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Pilih bahasa"
            aria-expanded={isLanguageMenuOpen}
          >
            <i className="fas fa-globe text-gray-600"></i>
            <span className="text-sm font-medium hidden sm:inline">
              {currentLanguage === 'id' ? 'ID' : 'EN'}
            </span>
          </button>

          {/* Language Dropdown Menu */}
          {isLanguageMenuOpen && (
            <div 
              className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200"
              role="menu"
            >
              <button
                onClick={() => changeLanguage('id')}
                className={`w-full text-left px-4 py-2 text-sm transition flex items-center justify-between ${
                  currentLanguage === 'id' 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                role="menuitem"
              >
                <span>Indonesia</span>
                {currentLanguage === 'id' && <i className="fas fa-check text-primary-600"></i>}
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`w-full text-left px-4 py-2 text-sm transition flex items-center justify-between ${
                  currentLanguage === 'en' 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                role="menuitem"
              >
                <span>English</span>
                {currentLanguage === 'en' && <i className="fas fa-check text-primary-600"></i>}
              </button>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={toggleProfileMenu}
            onKeyDown={handleKeyDown}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Menu profil pengguna"
            aria-expanded={isProfileMenuOpen}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-gray-900">
                {user.fullName || 'User'}
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
                <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
                {user.disabilityType && (
                  <p className="text-xs text-primary-600 mt-1">{user.disabilityType}</p>
                )}
              </div>
              
              {isEmployer ? (
                <>
                  <Link 
                    to="/employer/dashboard" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition flex items-center gap-2"
                    role="menuitem"
                  >
                    <i className="fas fa-tachometer-alt w-4" aria-hidden="true"></i>
                    Dashboard
                  </Link>
                  <Link 
                    to="/employer/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition flex items-center gap-2"
                    role="menuitem"
                  >
                    <i className="fas fa-building w-4" aria-hidden="true"></i>
                    Profile Perusahaan
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
                    Profile Saya
                  </Link>
                  <Link 
                    to="/application/history" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition flex items-center gap-2"
                    role="menuitem"
                  >
                    <i className="fas fa-history w-4" aria-hidden="true"></i>
                    Riwayat Lamar
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
      </div>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header 
      className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-40" 
      role="banner"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to={isAuthenticated && isEmployer ? "/employer/dashboard" : "/"} 
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
            {!isAuthenticated && (
              <div className="border-t border-gray-200 my-2 pt-3 space-y-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() => changeLanguage('id')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm transition flex items-center justify-center gap-2 ${
                      currentLanguage === 'id' 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <i className="fas fa-globe"></i>
                    ID
                  </button>
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm transition flex items-center justify-center gap-2 ${
                      currentLanguage === 'en' 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <i className="fas fa-globe"></i>
                    EN
                  </button>
                </div>
                <Link 
                  to="/login" 
                  className="block py-3 px-4 hover:bg-primary-50 rounded-lg transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-gray-200"
                >
                  <i className="fas fa-sign-in-alt w-5 text-center" aria-hidden="true"></i> 
                  Masuk
                </Link>
                <Link 
                  to="/register?type=employer" 
                  className="block py-3 px-4 bg-primary-500 text-white rounded-lg transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <i className="fas fa-building w-5 text-center" aria-hidden="true"></i> 
                  Perusahaan
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