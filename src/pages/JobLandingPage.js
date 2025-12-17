// src/pages/LowonganLandingPage.js - VERSI DIPERBAIKI
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
      <div className="relative bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Logo & Brand */}
          <div className="flex flex-col items-center mb-12">
            {/* Logo */}
            <Link
              to={token ? "/jobs" : "/"}
              className="flex items-center space-x-3 p-2 mb-4"
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Mulai Langkah Baru dalam {" "}
              <span className="text-blue-600">Karirmu</span>
            </h1>
            <p className="text-lg text-center text-gray-600 max-w-2xl mx-auto">
              Jelajahi peluang kerja yang mendukung keahlian dan kebutuhan
              aksesibilitasmu
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-md shadow p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-3 gap-5 border-2 border-gray-300 rounded-lg">
                <i className="fas fa-search text-gray-400"></i>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Posisi, perusahaan, atau jenis pekerjaan..."
                  className="w-full focus:outline-none transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSearch}
                  className="bg-blue-500 text-white px-10 py-3 rounded-lg hover:bg-blue-600 transition font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  <i className="fas fa-search"></i> Cari
                </button>
              </div>
            </div>
          </div>

          {/* Quick Search Tags */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Pencarian Terbanyak:</p>
            <div className="flex flex-wrap justify-center gap-3">
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
                  className="text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-colors text-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-800 rounded-2xl p-12 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Gambar Orang - Side Illustration */}
            <div className="lg:w-2/5 flex justify-center lg:justify-start mb-8 lg:mb-0">
              <div className="relative w-64 h-64">
                {/* Illustration Container */}
                <div className="absolute inset-0 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <div className="bg-white/10 rounded-full p-8 backdrop-blur-sm">
                    <i className="fas fa-user-tie text-white text-6xl"></i>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-400/30 rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-green-400/30 rounded-full"></div>
              </div>
            </div>

            {/* Content - Login Options */}
            <div className="lg:w-3/5 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-white mb-3">
                Temukan pekerjaan yang tepat untuk Anda di InklusiKerja
              </h2>
              <p className="text-blue-100 mb-6">
                Masuk ke profil Anda untuk mendapatkan pekerjaan yang lebih
                cocok
              </p>

              {/* Login Options */}
              <div className="max-w-md mx-auto lg:mx-0">
                <Link
                  to="/login"
                  className="w-full border border-cyan-500 hover:bg-cyan-600 text-cyan-100 px-6 py-3 rounded-lg font-medium transition-all shadow-md flex items-center justify-center gap-3"
                >
                  <i className="fas fa-envelope"></i>
                  Masuk
                </Link>

                {/* Separator */}
                <div className="my-4">
                  <span className="text-blue-100 text-sm py-1 rounded-full">
                    Belum punya akun?
                  </span>
                </div>

                {/* Register */}
                <Link
                  to="/register"
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md flex items-center justify-center gap-3"
                >
                  <i className="fas fa-envelope"></i>
                  Daftar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "fas fa-universal-access",
                title: "Accessibility First",
                description: "Platform designed with accessibility at its core",
              },
              {
                icon: "fas fa-bullseye",
                title: "Smart Matching",
                description:
                  "AI-powered job recommendations based on your profile",
              },
              {
                icon: "fas fa-shield-alt",
                title: "Inclusive Culture",
                description:
                  "Companies verified for inclusive workplace practices",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-xl mx-auto mb-4">
                  <i className={feature.icon}></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Search Links Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Cari Berdasarkan Kategori
              </h2>
              <p className="text-gray-600">
                Temukan lowongan berdasarkan bidang dan keahlian yang Anda
                minati
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  title: "Teknologi",
                  keywords: [
                    "Programmer",
                    "UI/UX Designer",
                    "Data Analyst",
                    "IT Support",
                  ],
                },
                {
                  title: "Desain",
                  keywords: [
                    "Graphic Designer",
                    "UI/UX",
                    "Product Designer",
                    "Visual Designer",
                  ],
                },
                {
                  title: "Pemasaran",
                  keywords: [
                    "Digital Marketing",
                    "Content Writer",
                    "Social Media",
                    "SEO Specialist",
                  ],
                },
                {
                  title: "Bisnis",
                  keywords: [
                    "Project Manager",
                    "Business Analyst",
                    "HR Specialist",
                    "Operations",
                  ],
                },
              ].map((category, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 mb-4 text-center">
                    {category.title}
                  </h3>
                  <div className="space-y-2">
                    {category.keywords.map((keyword, keyIndex) => (
                      <button
                        key={keyIndex}
                        onClick={() => handleQuickSearch(keyword)}
                        className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors text-sm py-1"
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Quick Links */}
            <div className="text-center mt-12">
              <div className="inline-flex flex-wrap gap-4 justify-center">
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
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
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
