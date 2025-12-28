// src/components/layout/Header.js
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import defaultPfp from "../../assets/default-pfp.png";
import defaultCm from "../../assets/default-company.png";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("id");
  const location = useLocation();
  const navigate = useNavigate();

  const { token, userData, logout } = useAuth();

  const [profileData, setProfileData] = useState({});

  //fatir: get user by id
  const getUserById = async () => {
    try {
      const res = await axios.get(`/api/user/${userData?.id}`);
      setProfileData(res.data.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    if (!userData) return;
    getUserById();
  }, [userData]);

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

  // handle logout
  const handleLogout = async () => {
    const confirmation = window.confirm("Yakin ingin logout?");

    if (confirmation) {
      try {
        const res = await axios.delete("/api/auth/logout");
        logout();
        enqueueSnackbar(res.data.message || "Logout berhasil", {
          variant: "info",
        });
        navigate("/");
      } catch (err) {
        enqueueSnackbar(err.response?.data?.message);
      }
    }
  };

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    setIsLanguageMenuOpen(false);
    console.log("Language changed to:", lang);
  };

  const isLowonganActive = () => {
    return location.pathname === "/jobs";
  };

  // PERBAIKAN 4: Logic untuk menentukan apakah menu profile aktif
  const isProfileActive = () => {
    return location.pathname === "/profile";
  };

  // PERBAIKAN RESPONSIF: Update class untuk semua breakpoint
  const getMenuClass = (isActive) => {
    const baseClass =
      "px-3 py-2 font-medium rounded-lg transition flex items-center gap-1 focus:outline-none text-sm sm:text-base";
    return isActive
      ? `${baseClass} bg-primary-100 text-primary-600`
      : `${baseClass} hover:bg-primary-50 hover:text-primary-600`;
  };

  const getMobileMenuClass = (isActive) => {
    const baseClass =
      "block py-3 px-4 rounded-lg transition flex items-center gap-2 focus:outline-none w-full text-base";
    return isActive
      ? `${baseClass} bg-primary-50 text-primary-600`
      : `${baseClass} hover:bg-primary-50`;
  };

  // Helper function to determine user role
  const isEmployer = userData?.role === "company";
  const isCandidate = userData?.role === "job-seeker";

  //DESKTOP - PERBAIKAN: Gunakan md: bukan lg:
  const renderDesktopMenu = () => {
    // Not logged in - Public menu
    if (!userData) {
      const isLowonganMenuActive = isLowonganActive();

      return (
        <nav 
          className="hidden md:flex space-x-1 lg:space-x-2" 
          aria-label="Navigasi utama"
        >
          {/* Menu Cari Lowongan */}
          <Link
            to={"/profile"}
            className={getMenuClass(isProfileActive())}
            aria-current={isProfileActive() ? "page" : undefined}
          >
            <i className="fa-solid fa-person-circle-check" aria-hidden="true"></i>
            <span className="hidden sm:inline">Profil Pengguna</span>
            <span className="sm:hidden">Profil</span>
          </Link>

          <Link
            to={"/jobs"}
            className={getMenuClass(isLowonganMenuActive)}
            aria-current={isLowonganMenuActive ? "page" : undefined}
          >
            <i className="fas fa-briefcase" aria-hidden="true"></i>
            <span className="hidden sm:inline">Pekerjaan</span>
            <span className="sm:hidden">Kerja</span>
          </Link>

          <Link
            to="/companies"
            className={getMenuClass(location.pathname === "/companies")}
            aria-current={
              location.pathname === "/companies" ? "page" : undefined
            }
          >
            <i className="fas fa-building" aria-hidden="true"></i>
            <span className="hidden sm:inline">Perusahaan</span>
            <span className="sm:hidden">Company</span>
          </Link>
          <Link
            to="/candidates"
            className={getMenuClass(location.pathname === "/candidates")}
            aria-current={
              location.pathname === "/candidates" ? "page" : undefined
            }
          >
            <i className="fas fa-users w-5 text-center" aria-hidden="true"></i>
            <span className="hidden sm:inline">Kandidat</span>
            <span className="sm:hidden">Kandidat</span>
          </Link>
        </nav>
      );
    }
    // Logged-In User Menu
    if (isCandidate || isEmployer) {
      const isLowonganMenuActive = isLowonganActive();

      return (
        <nav
          className="hidden md:flex space-x-1 lg:space-x-2"
          aria-label="Navigasi kandidat"
        >
          <Link
            to={"/jobs"}
            className={getMenuClass(isLowonganMenuActive)}
            aria-current={isLowonganMenuActive ? "page" : undefined}
          >
            <i className="fas fa-briefcase" aria-hidden="true"></i>
            <span className="hidden sm:inline">Pekerjaan</span>
            <span className="sm:hidden">Kerja</span>
          </Link>
          <Link
            to="/companies"
            className={getMenuClass(location.pathname === "/companies")}
            aria-current={
              location.pathname === "/companies" ? "page" : undefined
            }
          >
            <i className="fas fa-building" aria-hidden="true"></i>
            <span className="hidden sm:inline">Perusahaan</span>
            <span className="sm:hidden">Company</span>
          </Link>

          <Link
            to="/candidates"
            className={getMenuClass(location.pathname === "/candidates")}
            aria-current={
              location.pathname === "/candidates" ? "page" : undefined
            }
          >
            <i className="fas fa-users" aria-hidden="true"></i>
            <span className="hidden sm:inline">Kandidat</span>
            <span className="sm:hidden">Kandidat</span>
          </Link>
        </nav>
      );
    }
  };

  // MOBILE - TAMBAHKAN MENU PROFILE UNTUK YANG SUDAH LOGIN
  const renderMobileMenu = () => {
    if (!userData) {
      const isLowonganMenuActive = isLowonganActive();

      return (
        <>
          <Link
            to={"/jobs"}
            className={getMobileMenuClass(isLowonganMenuActive)}
            aria-current={isLowonganMenuActive ? "page" : undefined}
          >
            <i
              className="fas fa-briefcase w-5 text-center"
              aria-hidden="true"
            ></i>
            Pekerjaan
          </Link>
          <Link
            to={"/profile"}
            className={getMobileMenuClass(isProfileActive())}
            aria-current={isProfileActive() ? "page" : undefined}
          >
            <i className="fas fa-users w-5 text-center" aria-hidden="true"></i>
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
            ></i>
            Perusahaan
          </Link>
          <Link
            to="/candidates"
            className={getMobileMenuClass(location.pathname === "/candidates")}
            aria-current={
              location.pathname === "/candidates" ? "page" : undefined
            }
          >
            <i className="fas fa-users w-5 text-center" aria-hidden="true"></i>
            Kandidat
          </Link>
        </>
      );
    }

    if (isCandidate || isEmployer) {
      const isLowonganMenuActive = isLowonganActive();

      return (
        <>
          <Link
            to={"/jobs"}
            className={getMobileMenuClass(isLowonganMenuActive)}
            aria-current={isLowonganMenuActive ? "page" : undefined}
          >
            <i
              className="fas fa-briefcase w-5 text-center"
              aria-hidden="true"
            ></i>
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
          <Link
            to="/candidates"
            className={getMobileMenuClass(location.pathname === "/candidates")}
            aria-current={
              location.pathname === "/candidates" ? "page" : undefined
            }
          >
            <i className="fas fa-users w-5 text-center" aria-hidden="true"></i>
            Kandidat
          </Link>
          
        </>
      );
    }
  };

  // Language Selector for Mobile Menu - BUAT SAMA PERSIS
  const renderMobileLanguageSelector = () => {
    return (
      <div className="flex space-x-2 px-4 py-3">
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
    );
  };

  // DROPDOWN PROFILE - PERBAIKAN RESPONSIF
  const renderUserActions = () => {
    if (!userData) {
      return (
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={toggleLanguageMenu}
              onKeyDown={handleKeyDown}
              className="flex items-center space-x-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-primary-50 transition focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Pilih bahasa"
              aria-expanded={isLanguageMenuOpen}
            >
              <i className="fas fa-globe text-gray-600 text-sm sm:text-base"></i>
              <span className="text-sm font-medium hidden xs:inline">
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

          {/* Login/Register Buttons */}
          <div className="hidden sm:flex space-x-2">
            <Link
              to="/login"
              className="border border-primary-500 text-primary-500 px-3 py-2 rounded-lg hover:bg-primary-50 transition font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm sm:text-base whitespace-nowrap"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-primary-500 text-white px-3 py-2 rounded-lg hover:bg-primary-600 transition font-medium flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm sm:text-base whitespace-nowrap"
            >
              <span>Register</span>
            </Link>
          </div>
          
          {/* Mobile Login Button */}
          <Link
            to="/login"
            className="sm:hidden flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition"
            aria-label="Login"
          >
            <i className="fas fa-sign-in-alt"></i>
          </Link>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Language Selector for logged in users */}
        <div className="relative">
          <button
            onClick={toggleLanguageMenu}
            onKeyDown={handleKeyDown}
            className="flex items-center space-x-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-primary-50 transition focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Pilih bahasa"
            aria-expanded={isLanguageMenuOpen}
          >
            <i className="fas fa-globe text-gray-600 text-sm sm:text-base"></i>
            <span className="text-sm font-medium hidden xs:inline">
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
            className="flex items-center space-x-2 p-1 sm:p-2 rounded-lg hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
            aria-label="Menu profil pengguna"
            aria-expanded={isProfileMenuOpen}
          >
            <img
              src={
                profileData?.profilePicture ||
                (isEmployer ? defaultCm : defaultPfp)
              }
              alt="profile picture"
              className="rounded-full aspect-square object-cover w-8 h-8 sm:w-10 sm:h-10"
            />
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                {userData?.name}
              </div>
              <div className="text-xs text-gray-500">
                {isEmployer ? "Perusahaan" : "Kandidat"}
              </div>
            </div>
            <i
              className={`fas fa-chevron-down text-xs transition-transform ${
                isProfileMenuOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            ></i>
          </button>

          {/* Profile Dropdown Menu - PERBAIKAN RESPONSIF: Lebar dan posisi dropdown */}
          {isProfileMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200"
              role="menu"
            >
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userData?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
              </div>

              {isEmployer ? (
                <>
                  <Link
                    to={`/cm/${userData?.id}`}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition flex items-center gap-2"
                    role="menuitem"
                  >
                    <i className="fas fa-building w-4" aria-hidden="true"></i>
                    Profile Perusahaan
                  </Link>
                  <Link
                    to="/employer"
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition flex items-center gap-2"
                    role="menuitem"
                  >
                    <i
                      className="fas fa-tachometer-alt w-4"
                      aria-hidden="true"
                    ></i>
                    Dashboard
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
                    to={`/js/applications`}
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
      className="bg-white/90 backdrop-blur-md shadow sticky top-0 z-40"
      role="banner"
    >
      {/* PERBAIKAN UTAMA: Update container padding untuk semua breakpoint */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            {/* Logo - PERBAIKAN RESPONSIF */}
            <Link
              to={token ? "/jobs" : "/"}
              className="flex items-center space-x-2 sm:space-x-3 hover:bg-gray-100 transition p-1 sm:p-2 rounded-lg min-w-0"
              aria-label="InklusiKerja - Kembali ke beranda"
            >
              <div
                className="bg-gradient-to-r from-primary-500 to-accent-500 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-md flex-shrink-0"
                aria-hidden="true"
              >
                <i className="fas fa-hands-helping text-white text-sm sm:text-lg md:text-xl"></i>
              </div>
              <div className="min-w-0">
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary-700 block truncate">
                  InklusiKerja
                </span>
                <p className="text-[10px] xs:text-xs text-gray-600 hidden xs:block truncate">
                  Platform Inklusif untuk Disabilitas
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            {renderDesktopMenu()}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
            {renderUserActions()}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              onKeyDown={handleKeyDown}
              className="md:hidden text-dark text-xl p-2 rounded-lg hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ml-1"
              aria-label={
                isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
              }
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <i
                className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"} text-base sm:text-lg`}
                aria-hidden="true"
              ></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav
            id="mobile-menu"
            className="md:hidden bg-white/95 backdrop-blur-md px-3 sm:px-4 py-3 shadow-lg mt-2 rounded-lg animate-fadeIn"
            aria-label="Navigasi mobile"
          >
            <div className="space-y-1">
              {renderMobileMenu()}
            </div>

            {/* Language Selector for mobile - TAMBAHKAN: sama seperti sebelum login */}
            <div className="border-t border-gray-200 my-3 pt-3">
              {renderMobileLanguageSelector()}
            </div>

            {/* Auth links untuk non-logged in users di mobile */}
            {!userData && (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="py-3 px-4 hover:bg-primary-50 rounded-lg transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 border border-gray-200"
                  onClick={() => setIsMobileMenuOpen(false)}
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
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-user-plus w-5 text-center" aria-hidden="true"></i>
                  Register
                </Link>
              </div>
            )}
            
            {/* TAMBAHKAN: Logout button untuk user yang sudah login */}
            {/* {userData && (
              <div className="border-t border-gray-200 pt-3 mt-3">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2"
                >
                  <i className="fas fa-sign-out-alt w-5 text-center"></i>
                  Keluar
                </button>
              </div>
            )} */}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;