// src/pages/LowonganLandingPage.js - VERSI PROFESIONAL DENGAN SEARCH SAMA
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LowonganLandingPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    disabilityTypes: ['tuna-netra', 'tuna-rungu', 'semua-jenis'],
    salaryRange: '5-10',
    companySize: ['startup', 'menengah'],
    postedDate: '24jam'
  });

  const companies = [
    {
      id: 1,
      name: "Google Indonesia",
      logo: "G",
      industry: "Teknologi",
      jobs: 42,
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      name: "Gojek",
      logo: "GJ",
      industry: "Teknologi",
      jobs: 38,
      color: "from-green-500 to-green-600"
    },
    {
      id: 3,
      name: "Tokopedia",
      logo: "T",
      industry: "E-commerce",
      jobs: 31,
      color: "from-green-400 to-green-500"
    },
    {
      id: 4,
      name: "Traveloka",
      logo: "TR",
      industry: "Travel",
      jobs: 25,
      color: "from-red-500 to-red-600"
    },
    {
      id: 5,
      name: "Shopee",
      logo: "S",
      industry: "E-commerce",
      jobs: 36,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('q', searchTerm);
    navigate(`/lowongan?${params.toString()}`, { replace: true });
  };

  const handleQuickSearch = (keyword) => {
    navigate(`/lowongan?q=${encodeURIComponent(keyword)}`);
  };

  const toggleFilter = (filterType, value) => {
    setSelectedFilters(prev => {
      if (filterType === 'disabilityTypes' || filterType === 'companySize') {
        const currentValues = prev[filterType];
        if (currentValues.includes(value)) {
          return {
            ...prev,
            [filterType]: currentValues.filter(v => v !== value)
          };
        } else {
          return {
            ...prev,
            [filterType]: [...currentValues, value]
          };
        }
      } else {
        return {
          ...prev,
          [filterType]: value
        };
      }
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Search Section */}
      <div className="relative bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Logo & Brand */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-briefcase text-white text-lg"></i>
              </div>
              <span className="text-2xl font-bold text-gray-900">CareerConnect</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find Your Next
              <span className="text-blue-600"> Career Move</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover opportunities that match your skills and accessibility needs
            </p>
          </div>

          {/* Search Form - SAMA DENGAN LOWONGANPAGE */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
            {/* Quick Search Bar - SAMA DENGAN LOWONGANPAGE */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Posisi, perusahaan, atau kata kunci..." 
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleSearch}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-medium flex items-center gap-2"
                >
                  <i className="fas fa-search"></i> Cari
                </button>
                <button 
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`border-2 px-4 py-3 rounded-lg hover:bg-gray-50 transition ${
                    showAdvancedFilters ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300'
                  }`}
                >
                  <i className="fas fa-sliders-h"></i>
                </button>
              </div>
            </div>

            {/* Advanced Filters - SAMA DENGAN LOWONGANPAGE */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Lokasi</label>
                  <select className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors">
                    <option value="">Semua Lokasi</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="jakarta">Jakarta</option>
                    <option value="bandung">Bandung</option>
                    <option value="surabaya">Surabaya</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Jenis Pekerjaan</label>
                  <select className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors">
                    <option value="">Semua Jenis</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="kontrak">Kontrak</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Keahlian</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: UI Design, Programming" 
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Akomodasi</label>
                  <select className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors">
                    <option value="">Semua Akomodasi</option>
                    <option value="screen-reader">Screen Reader Support</option>
                    <option value="wheelchair">Akses Kursi Roda</option>
                    <option value="interpreter">Interpreter Bahasa Isyarat</option>
                    <option value="flex-time">Jam Fleksibel</option>
                    <option value="remote-option">Opsi Remote</option>
                  </select>
                </div>
              </div>
            )}  

            {/* Quick Filter Chips - SAMA DENGAN LOWONGANPAGE */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { label: "Disabilitas Fisik", icon: "wheelchair", color: "green" },
                { label: "Disabilitas Visual", icon: "eye", color: "blue" },
                { label: "Disabilitas Pendengaran", icon: "deaf", color: "purple" },
                { label: "Baru Diposting", icon: "clock", color: "orange" }
              ].map((filter, index) => (
                <span 
                  key={index}
                  className={`bg-${filter.color}-100 text-${filter.color}-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-${filter.color}-200 transition`}
                >
                  <i className={`fas fa-${filter.icon} mr-1`}></i>
                  {filter.label}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Search Tags */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['React Developer', 'UI/UX Designer', 'Data Scientist', 'Product Manager', 'Backend Engineer'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleQuickSearch(tag)}
                  className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-colors text-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Companies Section */}
      {/* <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Top Companies Hiring
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join leading companies committed to inclusive hiring practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {companies.map((company) => (
              <div 
                key={company.id}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-gray-200 group cursor-pointer"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${company.color} rounded-lg flex items-center justify-center text-white font-bold text-sm mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {company.logo}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{company.name}</h3>
                <p className="text-gray-500 text-xs mb-3">{company.industry}</p>
                <div className="text-blue-600 text-xs font-medium">
                  {company.jobs} openings
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* CTA Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 overflow-hidden">
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
                  Temukan pekerjaan yang tepat untuk Anda di Jobstreet
                </h2>
                <p className="text-blue-100 mb-6">
                  Masuk ke profil Anda untuk mendapatkan pekerjaan yang lebih cocok
                </p>

                {/* Login Options */}
                <div className="max-w-md mx-auto lg:mx-0">
                  {/* Google Login */}
                  <button className="w-full bg-white text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all shadow-md flex items-center justify-center gap-3 mb-4">
                    <div className="w-5 h-5">
                      <svg viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                    Lanjutkan dengan Google
                  </button>

                  {/* Separator */}
                  <div className="text-center my-4">
                    <span className="text-blue-200 text-sm bg-blue-700 px-3 py-1 rounded-full">atau</span>
                  </div>

                  {/* Email Login */}
                  <Link 
                    to="/login"
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md flex items-center justify-center gap-3"
                  >
                    <i className="fas fa-envelope"></i>
                    Masuk
                  </Link>
                </div>

                {/* Registration Link */}
                <div className="text-center lg:text-left mt-6">
                  <span className="text-blue-200">Belum punya akun? </span>
                  <Link 
                    to="/register" 
                    className="text-cyan-300 hover:text-cyan-200 font-semibold underline"
                  >
                    Daftar
                  </Link>
                </div>
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
                description: "Platform designed with accessibility at its core"
              },
              {
                icon: "fas fa-bullseye",
                title: "Smart Matching",
                description: "AI-powered job recommendations based on your profile"
              },
              {
                icon: "fas fa-shield-alt",
                title: "Inclusive Culture",
                description: "Companies verified for inclusive workplace practices"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-xl mx-auto mb-4">
                  <i className={feature.icon}></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
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
                Temukan lowongan berdasarkan bidang dan keahlian yang Anda minati
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { title: "Teknologi", keywords: ["Programmer", "UI/UX Designer", "Data Analyst", "IT Support"] },
                { title: "Desain", keywords: ["Graphic Designer", "UI/UX", "Product Designer", "Visual Designer"] },
                { title: "Pemasaran", keywords: ["Digital Marketing", "Content Writer", "Social Media", "SEO Specialist"] },
                { title: "Bisnis", keywords: ["Project Manager", "Business Analyst", "HR Specialist", "Operations"] }
              ].map((category, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-4 text-center">{category.title}</h3>
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
                  "Remote Work", "Full Time", "Part Time", "Fresh Graduate", 
                  "Experienced", "Managerial", "Entry Level", "Freelance"
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

export default LowonganLandingPage;