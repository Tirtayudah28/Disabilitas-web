// src/components/layout/Header.js - VERSI DIPERBAIKI
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import defaultPfp from "../../assets/default-pfp.png";
import axios from "axios";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("id");
  const location = useLocation();
  const navigate = useNavigate();

  const { userData, logout } = useAuth();

  // Close menus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
    setIsLanguageMenuOpen(false);
  }, [location]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
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

  //fatir: modif handleLogout
  const handleLogout = async () => {
    //ganti dengan konfirmasi yang lebih baik
    // const confirmation = confirm("Yakin ingin logout?")

    try {
      const res = await axios.delete("/api/auth/logout");

      logout();
      //ganti dengan pemberitahuan yg lebih baik
      alert(res.data.message || "Logout berhasil");
      navigate("/");
    } catch (err) {
      //ganti dengan pemberitahuan yg lebih baik
      alert(err.response?.data?.message);
    } finally {
      // blank
    }
  };

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    setIsLanguageMenuOpen(false);
    console.log("Language changed to:", lang);
  };


  const isLowonganActive = () => {
    return (
      location.pathname === "/jobs" ||
      location.pathname === "/"
    );
  };

  // PERBAIKAN 4: Logic untuk menentukan apakah menu profile aktif
  const isProfileActive = () => {
    return (
      location.pathname === "/profile"
    );
  };

  const getMenuClass = (isActive) => {
    const baseClass =
      "px-4 py-2 font-medium rounded-lg transition flex items-center gap-1 focus:outline-none";
    return isActive
      ? `${baseClass} bg-primary-100 text-primary-600`
      : `${baseClass} hover:bg-primary-50 hover:text-primary-600`;
  };

  const getMobileMenuClass = (isActive) => {
    const baseClass =
      "block py-3 px-4 rounded-lg transition flex items-center gap-2 focus:outline-none";
    return isActive
      ? `${baseClass} bg-primary-50 text-primary-600`
      : `${baseClass} hover:bg-primary-50`;
  };

  // Helper function to determine user role
  const isEmployer = userData?.role === "company";
  const isCandidate = userData?.role === "job-seeker";

  // PERBAIKAN 5: Render desktop menu dengan logic profile yang benar
  const renderDesktopMenu = () => {
    // Not logged in - Public menu
    if (!userData) {
      const isLowonganMenuActive = isLowonganActive();

      return (
        <nav className="hidden lg:flex space-x-1" aria-label="Navigasi utama">
          {/* Menu Cari Lowongan */}
          <Link
            to={"/"}
            className={getMenuClass(isLowonganMenuActive)}
            aria-current={isLowonganMenuActive ? "page" : undefined}
          >
            <i className="fas fa-search" aria-hidden="true"></i>
            <span>Pekerjaan</span>
          </Link>

          {/* Menu Profile - PERBAIKAN: gunakan getProfileLink() */}
          <Link
            to={"/profile"}
            className={getMenuClass(isProfileActive())}
            aria-current={isProfileActive() ? "page" : undefined}
          >
            <i className="fas fa-users" aria-hidden="true"></i>
            <span>Profile</span>
          </Link>

          <Link
            to="/companies"
            className={getMenuClass(location.pathname === "/companies")}
            aria-current={
              location.pathname === "/companies" ? "page" : undefined
            }
          >
            <i className="fas fa-building" aria-hidden="true"></i>
            <span>Perusahaan</span>
          </Link>
        </nav>
      );
    }

    // Employer menu
    if (isEmployer) {
      return (
        <nav
          className="hidden lg:flex space-x-1"
          aria-label="Navigasi employer"
        >
          <Link
            to="/employer/job-posting"
            className={getMenuClass(
              location.pathname === "/employer/job-posting"
            )}
            aria-current={
              location.pathname === "/employer/job-posting" ? "page" : undefined
            }
          >
            <i className="fas fa-briefcase" aria-hidden="true"></i>
            <span>Lowongan Saya</span>
          </Link>
          <Link
            to="/employer/applications"
            className={getMenuClass(
              location.pathname === "/employer/applications"
            )}
            aria-current={
              location.pathname === "/employer/applications"
                ? "page"
                : undefined
            }
          >
            <i className="fas fa-file-alt" aria-hidden="true"></i>
            <span>Lamaran</span>
          </Link>
          <Link
            to="/employer/candidates"
            className={getMenuClass(
              location.pathname === "/employer/candidates"
            )}
            aria-current={
              location.pathname === "/employer/candidates" ? "page" : undefined
            }
          >
            <i className="fas fa-users" aria-hidden="true"></i>
            <span>Kandidat</span>
          </Link>
        </nav>
      );
    }

    // Candidate Menu
    if (isCandidate) {
      const isLowonganMenuActive = isLowonganActive();

      return (
        <nav
          className="hidden lg:flex space-x-1"
          aria-label="Navigasi pencari kerja"
        >
          <Link
            to={"/jobs"}
            className={getMenuClass(isLowonganMenuActive)}                                          
            aria-current={isLowonganMenuActive ? "page" : undefined}
          >
            <i className="fas fa-search" aria-hidden="true"></i>
            <span>Pekerjaan</span>
          </Link>
          <Link
            to="/companies"
            className={getMenuClass(location.pathname === "/companies")}
            aria-current={
              location.pathname === "/companies" ? "page" : undefined
            }
          >
            <i className="fas fa-building" aria-hidden="true"></i>
            <span>Perusahaan</span>
          </Link>
        </nav>
      );
    }
  };

  // PERBAIKAN 6: Render mobile menu dengan logic profile yang benar
  const renderMobileMenu = () => {
    if (!userData) {
      const isLowonganMenuActive = isLowonganActive();

      return (
        <>
          <Link
            to={'/'}
            className={getMobileMenuClass(isLowonganMenuActive)}
            aria-current={isLowonganMenuActive ? "page" : undefined}
          >
            <i className="fas fa-search w-5 text-center" aria-hidden="true"></i>{" "}
            Pekerjaan
          </Link>
          {/* PERBAIKAN: gunakan getProfileLink() untuk mobile */}
          <Link
            to={'/profile'}
            className={getMobileMenuClass(isProfileActive())}
            aria-current={isProfileActive() ? "page" : undefined}
          >
            <i className="fas fa-users w-5 text-center" aria-hidden="true"></i>{" "}
            Profile
          </Link>
          <Link
            to="/companies"
            className={getMobileMenuClass(location.pathname === "/companies")}
            aria-current={
              location.pathname === "/companies" ? "page" : undefined
            }
          >
            <i
              className="fas fa-building w-5 text-center"
              aria-hidden="true"
            ></i>{" "}
            Perusahaan
          </Link>
        </>
      );
    }

    if (isEmployer) {
      return (
        <>
          <Link
            to="/employer/job-posting"
            className={getMobileMenuClass(
              location.pathname === "/employer/job-posting"
            )}
            aria-current={
              location.pathname === "/employer/job-posting" ? "page" : undefined
            }
          >
            <i
              className="fas fa-briefcase w-5 text-center"
              aria-hidden="true"
            ></i>{" "}
            Lowongan Saya
          </Link>
          <Link
            to="/employer/applications"
            className={getMobileMenuClass(
              location.pathname === "/employer/applications"
            )}
            aria-current={
              location.pathname === "/employer/applications"
                ? "page"
                : undefined
            }
          >
            <i
              className="fas fa-file-alt w-5 text-center"
              aria-hidden="true"
            ></i>{" "}
            Lamaran
          </Link>
          <Link
            to="/employer/candidates"
            className={getMobileMenuClass(
              location.pathname === "/employer/candidates"
            )}
            aria-current={
              location.pathname === "/employer/candidates" ? "page" : undefined
            }
          >
            <i className="fas fa-users w-5 text-center" aria-hidden="true"></i>{" "}
            Kandidat
          </Link>
        </>
      );
    }

    if (isCandidate) {
      const isLowonganMenuActive = isLowonganActive();

      return (
        <>
          <Link
            to={'/jobs'}
            className={getMobileMenuClass(isLowonganMenuActive)}
            aria-current={isLowonganMenuActive ? "page" : undefined}
          >
            <i className="fas fa-search w-5 text-center" aria-hidden="true"></i>{" "}
            Pekerjaan
          </Link>
          <Link
            to="/companies"
            className={getMenuClass(location.pathname === "/companies")}
            aria-current={
              location.pathname === "/companies" ? "page" : undefined
            }
          >
            <i className="fas fa-building" aria-hidden="true"></i>
            <span>Perusahaan</span>
          </Link>
        </>
      );
    }
  };

  // PERBAIKAN 7: Update profile dropdown untuk candidate
  const renderUserActions = () => {
    if (!userData) {
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
                {currentLanguage === "id" ? "ID" : "EN"}
              </span>
              <i
                className={`fas fa-chevron-down text-xs transition-transform ${
                  isLanguageMenuOpen ? "rotate-180" : ""
                }`}
              ></i>
            </button>

            {/* Language Dropdown Menu */}
            {isLanguageMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200"
                role="menu"
              >
                <button
                  onClick={() => changeLanguage("id")}
                  className={`w-full text-left px-4 py-2 text-sm transition flex items-center justify-between ${
                    currentLanguage === "id"
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  role="menuitem"
                >
                  <span>Indonesia</span>
                  {currentLanguage === "id" && (
                    <i className="fas fa-check text-primary-600"></i>
                  )}
                </button>
                <button
                  onClick={() => changeLanguage("en")}
                  className={`w-full text-left px-4 py-2 text-sm transition flex items-center justify-between ${
                    currentLanguage === "en"
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  role="menuitem"
                >
                  <span>English</span>
                  {currentLanguage === "en" && (
                    <i className="fas fa-check text-primary-600"></i>
                  )}
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
              Login
            </Link>
            <Link
              to="/register"
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition font-medium flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <span>Register</span>
            </Link>
          </div>
        </div>
      );
    }

    // User is logged in - show profile dropdown
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
              {currentLanguage === "id" ? "ID" : "EN"}
            </span>
          </button>

          {/* Language Dropdown Menu */}
          {isLanguageMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200"
              role="menu"
            >
              <button
                onClick={() => changeLanguage("id")}
                className={`w-full text-left px-4 py-2 text-sm transition flex items-center justify-between ${
                  currentLanguage === "id"
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                role="menuitem"
              >
                <span>Indonesia</span>
                {currentLanguage === "id" && (
                  <i className="fas fa-check text-primary-600"></i>
                )}
              </button>
              <button
                onClick={() => changeLanguage("en")}
                className={`w-full text-left px-4 py-2 text-sm transition flex items-center justify-between ${
                  currentLanguage === "en"
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                role="menuitem"
              >
                <span>English</span>
                {currentLanguage === "en" && (
                  <i className="fas fa-check text-primary-600"></i>
                )}
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
            <img
              src={defaultPfp}
              alt="profile picture"
              className="rounded-full aspect-square w-10"
            />
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-gray-900">
                {userData?.name}
              </div>
              <div className="text-xs text-gray-500">
                {isEmployer ? "Employer" : "Pencari Kerja"}
              </div>
            </div>
            <i
              className={`fas fa-chevron-down text-xs transition-transform ${
                isProfileMenuOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            ></i>
          </button>

          {/* Profile Dropdown Menu - PERBAIKAN: update link profile untuk candidate */}
          {isProfileMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200"
              role="menu"
            >
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {userData?.name}
                </p>
                <p className="text-xs text-gray-500">{userData?.email}</p>
              </div>

              {isEmployer ? (
                <>
                  <Link
                    to="/employer/dashboard"
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition flex items-center gap-2"
                    role="menuitem"
                  >
                    <i
                      className="fas fa-tachometer-alt w-4"
                      aria-hidden="true"
                    ></i>
                    Dashboard
                  </Link>
                  <Link
                    to={`/cm/${userData?.id}`}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition flex items-center gap-2"
                    role="menuitem"
                  >
                    <i className="fas fa-building w-4" aria-hidden="true"></i>
                    Profile Perusahaan
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={`/js/${userData?.id}`}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition flex items-center gap-2"
                    role="menuitem"
                  >
                    <i className="fas fa-user w-4" aria-hidden="true"></i>
                    Profile Saya
                  </Link>
                  <Link
                    to={`/js/${userData?.id}/applications`}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition flex items-center gap-2"
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
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
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

  return (
    <header
      className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-40"
      role="banner"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 hover-lift p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="InklusiKerja - Kembali ke beranda"
          >
            <div
              className="bg-gradient-to-r from-primary-500 to-accent-500 w-12 h-12 rounded-full flex items-center justify-center shadow-md"
              aria-hidden="true"
            >
              <i className="fas fa-hands-helping text-white text-xl"></i>
            </div>
            <div>
              <span className="text-2xl font-bold text-primary-700">
                InklusiKerja
              </span>
              <p className="text-xs text-gray-600">
                Platform Inklusif untuk Disabilitas
              </p>
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
              className="lg:hidden text-dark text-xl p-2 rounded-lg hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label={
                isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
              }
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <i
                className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"}`}
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
            {!userData && (
              <div className="border-t border-gray-200 my-2 pt-3 space-y-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() => changeLanguage("id")}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm transition flex items-center justify-center gap-2 ${
                      currentLanguage === "id"
                        ? "bg-primary-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <i className="fas fa-globe"></i>
                    ID
                  </button>
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm transition flex items-center justify-center gap-2 ${
                      currentLanguage === "en"
                        ? "bg-primary-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <i className="fas fa-globe"></i>
                    EN
                  </button>
                </div>
                <Link
                  to="/login"
                  className="py-3 px-4 hover:bg-primary-50 rounded-lg transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 border border-gray-200"
                >
                  <i
                    className="fas fa-sign-in-alt w-5 text-center"
                    aria-hidden="true"
                  ></i>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="py-3 px-4 bg-primary-500 text-white rounded-lg transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Register
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
