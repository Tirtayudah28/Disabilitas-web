// src/pages/LowonganLandingPage.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSearch } from "../contexts/SearchContext";
import { useAuth } from "../contexts/AuthContext";

const JobLandingPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { markAsSearched } = useSearch();

  const [searchTerm, setSearchTerm] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    disabilityTypes: ["tuna-netra", "tuna-rungu", "semua-jenis"],
    salaryRange: "5-10",
    companySize: ["startup", "menengah"],
    postedDate: "24jam",
  });

  //fatir: auto-redirect if already logged-in
  useEffect(() => {
    if (token) {
      navigate("/jobs");
    }
  }, [token, navigate]);

  const handleSearch = () => {
    // USER BELUM LOGIN TAPI BISA LANGSUNG KE LOWONGAN PAGE DENGAN SEARCH
    markAsSearched(searchTerm);
    const params = new URLSearchParams();
    if (searchTerm) params.append("q", searchTerm);
    navigate(`/jobs?${params.toString()}`);
  };

  const handleQuickSearch = (keyword) => {
    // USER BELUM LOGIN TAPI BISA LANGSUNG KE LOWONGAN PAGE DENGAN SEARCH
    markAsSearched(keyword);
    navigate(`/jobs?q=${encodeURIComponent(keyword)}`);
  };
  
  return (
    <div className="min-h-screen">
      {/* Hero Search Section */}
      <div className="relative py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Logo & Brand */}
          <div className="flex flex-col items-center mb-8 md:mb-12">
            {/* Logo */}
            <Link
              to={token ? "/jobs" : "/"}
              className="flex items-center space-x-2 sm:space-x-3 p-2 mb-4 transition-all hover:scale-105"
              aria-label="InklusiKerja - Kembali ke beranda"
            >
              <div
                className="bg-gradient-to-r from-primary-500 to-accent-500 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-md"
                aria-hidden="true"
              >
                <i className="fas fa-hands-helping text-white text-lg sm:text-xl"></i>
              </div>
              <div className="text-left">
                {/* PERBAIKAN KONTRAST: Tambah font-weight dan color yang lebih kontras */}
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  InklusiKerja
                </span>
                <p className="text-xs text-gray-700 mt-1">
                  Platform Inklusif untuk Disabilitas
                </p>
              </div>
            </Link>
            
            {/* PERBAIKAN UTAMA: Tambah background atau color yang lebih kontras */}
            <div className="text-center px-4 py-2 rounded-lg bg-white/50 backdrop-blur-sm">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 md:mb-4">
                Mulai Langkah Baru dalam{" "}
                <span className="text-blue-700 py-1 rounded-lg">
                  Karirmu
                </span>
              </h1>
              {/* PERBAIKAN: Tambah background untuk kontras */}
              <div className="inline-block px-4 py-2 bg-white/80 rounded-lg backdrop-blur-sm">
                <p className="text-base sm:text-lg md:text-xl text-gray-800 font-medium max-w-2xl mx-auto">
                  Jelajahi peluang kerja yang mendukung keahlian dan kebutuhan
                  aksesibilitasmu
                </p>
              </div>
            </div>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 md:mb-8 mx-auto max-w-4xl">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 flex items-center px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-lg sm:rounded-xl hover:border-blue-500 transition-colors">
                <i className="fas fa-search text-gray-400 text-lg sm:text-xl"></i>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Posisi, perusahaan, atau jenis pekerjaan..."
                  className="w-full focus:outline-none text-base sm:text-lg placeholder:text-gray-500 bg-transparent"
                  aria-label="Cari pekerjaan"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all duration-300 font-medium flex items-center gap-2 text-base sm:text-lg shadow-lg hover:shadow-xl disabled:opacity-50 min-w-[120px] justify-center"
                >
                  <i className="fas fa-search"></i> 
                  <span className="hidden sm:inline">Cari</span>
                  <span className="sm:hidden">Cari</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Search Tags */}
          <div className="text-center px-4">
            <p className="text-gray-700 font-medium mb-3 md:mb-4 text-sm sm:text-base md:text-lg">
              Pencarian Terbanyak:
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {[
                "Graphic Designer",
                "UI/UX Designer",
                "Data Scientist",
                "Customer Service",
                "Backend Engineer",
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleQuickSearch(tag)}
                  className="text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-2 sm:px-4 sm:py-2 rounded-full transition-all duration-200 text-xs sm:text-sm border border-blue-100 hover:border-blue-200 shadow-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 max-w-7xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-800 rounded-xl md:rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
          
          <div className="flex flex-col lg:flex-row items-center relative z-10">
            {/* Gambar Orang - Side Illustration */}
            <div className="lg:w-2/5 flex justify-center lg:justify-start mb-8 lg:mb-0">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
                {/* Illustration Container */}
                <div className="absolute inset-0 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="bg-white/20 rounded-full p-6 sm:p-8 backdrop-blur-md">
                    <i className="fas fa-user-tie text-white text-4xl sm:text-5xl md:text-6xl"></i>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-cyan-400/30 rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-green-400/30 rounded-full"></div>
              </div>
            </div>

            {/* Content - Login Options */}
            <div className="lg:w-3/5 text-center lg:text-left px-2 sm:px-4">
              {/* PERBAIKAN KONTRAST: Tambah background untuk teks */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
                  Temukan pekerjaan yang tepat untuk Anda di InklusiKerja
                </h2>
                <p className="text-blue-100 font-medium text-base sm:text-lg md:text-xl">
                  Masuk ke profil Anda untuk mendapatkan pekerjaan yang lebih cocok
                </p>
              </div>

              {/* Login Options */}
              <div className="max-w-md mx-auto lg:mx-0 space-y-4">
                <Link
                  to="/login"
                  className="w-full border-2 border-cyan-400 hover:bg-cyan-500/30 bg-white/10 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg md:rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-base sm:text-lg"
                >
                  <i className="fas fa-sign-in-alt"></i>
                  Masuk ke Akun
                </Link>

                {/* Separator */}
                <div className="my-4 sm:my-6">
                  <span className="text-white/90 font-medium text-sm sm:text-base bg-white/10 py-2 px-4 rounded-full">
                    Belum punya akun?
                  </span>
                </div>

                {/* Register */}
                <Link
                  to="/register"
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg md:rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-base sm:text-lg"
                >
                  <i className="fas fa-user-plus"></i>
                  Daftar Akun Baru
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-12 md:py-16 lg:py-20 bg-white-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-10 md:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Fitur Unggulan Kami
            </h2>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
              Platform yang dirancang khusus untuk kebutuhan aksesibilitas
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: "fas fa-universal-access",
                title: "Accessibility First",
                description: "Platform designed with accessibility at its core",
              },
              {
                icon: "fas fa-bullseye",
                title: "Smart Matching",
                description: "AI-powered job recommendations based on your profile",
              },
              {
                icon: "fas fa-shield-alt",
                title: "Inclusive Culture",
                description: "Companies verified for inclusive workplace practices",
              },
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-gray-100"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-xl sm:text-2xl mx-auto mb-4 sm:mb-6">
                  <i className={feature.icon}></i>
                </div>
                <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-900 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-sm sm:text-base md:text-lg text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Search Links Section */}
      <div className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 md:mb-12 lg:mb-16">
              {/* PERBAIKAN KONTRAST: Tambah background untuk heading */}
              <div className="inline-block px-6 py-3 mb-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Cari Berdasarkan Kategori
                </h2>
              </div>
              <div className="inline-block px-4 py-2">
                <p className="text-gray-700 font-medium text-base sm:text-lg md:text-xl">
                  Temukan lowongan berdasarkan bidang dan keahlian yang Anda minati
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {[
                {
                  title: "Teknologi",
                  keywords: ["Programmer", "UI/UX Designer", "Data Analyst", "IT Support"],
                },
                {
                  title: "Desain",
                  keywords: ["Graphic Designer", "UI/UX", "Product Designer", "Visual Designer"],
                },
                {
                  title: "Pemasaran",
                  keywords: ["Digital Marketing", "Content Writer", "Social Media", "SEO Specialist"],
                },
                {
                  title: "Bisnis",
                  keywords: ["Project Manager", "Business Analyst", "HR Specialist", "Operations"],
                },
              ].map((category, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-gray-100"
                >
                  <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-900 mb-4 sm:mb-6 text-center">
                    {category.title}
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {category.keywords.map((keyword, keyIndex) => (
                      <button
                        key={keyIndex}
                        onClick={() => handleQuickSearch(keyword)}
                        className="block w-full text-left text-gray-700 hover:text-blue-700 transition-colors duration-200 text-sm sm:text-base md:text-lg py-2 px-3 rounded-lg hover:bg-blue-50 font-medium"
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Quick Links */}
            <div className="text-center mt-10 md:mt-12 lg:mt-16">
              <div className="inline-block px-4 py-2 mb-6">
                <p className="text-gray-700 font-medium text-base sm:text-lg md:text-xl">
                  Filter berdasarkan jenis pekerjaan:
                </p>
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                {[
                  "Remote Work",
                  "Full Time",
                  "Part Time",
                  "Fresh Graduate",
                  "Experienced",
                  "Managerial",
                  "Entry Level",
                  "Freelance",
                ].map((link, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(link)}
                    className="text-blue-700 hover:text-blue-800 font-semibold text-sm sm:text-base bg-blue-50 hover:bg-blue-100 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl transition-all duration-200 shadow-sm hover:shadow-md border border-blue-100 hover:border-blue-200"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobLandingPage;