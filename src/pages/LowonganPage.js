// src/pages/LowonganPage.js - UPDATE UNTUK HANDLE URL PARAMETERS
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import JobCard from '../components/JobCard';

const LowonganPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    disabilityTypes: ['tuna-netra', 'tuna-rungu', 'semua-jenis'],
    salaryRange: '5-10',
    companySize: ['startup', 'menengah'],
    postedDate: '24jam'
  });
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [urlParams, setUrlParams] = useState({});

  // Handle URL parameters ketika komponen mount atau URL berubah
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const params = {};
    
    // Ambil semua parameter dari URL
    for (let [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    
    setUrlParams(params);
    
    // Set search term dari URL parameter 'q'
    if (params.q) {
      setSearchTerm(params.q);
    }
  }, [location.search]);

  // Sample job data
  const [jobs] = useState([
    {
      id: 1,
      title: "UI/UX Designer",
      company: "PT Tech Inklusif",
      location: "Jakarta • Remote",
      type: "Full Time",
      salary: "Rp 8-12 juta",
      posted: "2 jam lalu",
      match: 95,
      skills: ["Figma", "User Research", "Prototyping", "Accessibility"],
      accommodations: ["Screen Reader Support", "Remote Work", "Flexible Hours"],
      disabilitySupport: ["Tuna Netra", "Tuna Rungu"],
      description: "Kami mencari UI/UX Designer yang passionate tentang inklusivitas dan aksesibilitas. Bergabunglah dengan tim kami yang berdedikasi menciptakan produk digital yang accessible untuk semua.",
      applicants: 23,
      logo: "TI",
      logoColor: "from-blue-500 to-green-500"
    },
    {
      id: 2,
      title: "Content Writer",
      company: "Media Inklusif",
      location: "Remote • Part Time",
      type: "Part Time",
      salary: "Rp 5-8 juta",
      posted: "1 hari lalu",
      match: 85,
      skills: ["Content Writing", "SEO", "Copywriting", "Research"],
      accommodations: ["Fully Remote", "Flexible Schedule"],
      disabilitySupport: ["Tuna Netra"],
      description: "Dibutuhkan Content Writer untuk membuat artikel tentang kehidupan disabilitas, inklusivitas, dan teknologi assistive. Perfect untuk yang suka menulis dan peduli dengan isu sosial.",
      applicants: 15,
      logo: "MI",
      logoColor: "from-green-500 to-blue-500"
    },
    {
      id: 3,
      title: "Frontend Developer",
      company: "Fintech Inklusif",
      location: "Bandung • Hybrid",
      type: "Full Time",
      salary: "Rp 10-15 juta",
      posted: "3 hari lalu",
      match: 78,
      skills: ["React", "JavaScript", "HTML/CSS", "Web Accessibility"],
      accommodations: ["Wheelchair Access", "Sign Language Support"],
      disabilitySupport: ["Tuna Daksa", "Tuna Rungu"],
      description: "Developer dengan passion di bidang aksesibilitas web. Bantu kami membangun platform finansial yang accessible untuk semua kalangan, termasuk penyandang disabilitas.",
      applicants: 42,
      logo: "FI",
      logoColor: "from-purple-500 to-pink-500"
    }
  ]);

 const handleSearch = () => {
    // Build URL parameters - selalu bisa search meski form kosong
    const params = new URLSearchParams();
    
    if (searchTerm) params.append('q', searchTerm);
    // Bisa tambahkan parameter lain di sini jika needed
    
    // Update URL tanpa reload page
    navigate(`/lowongan?${params.toString()}`, { replace: true });
    
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  const handleBookmark = (jobId) => {
    setBookmarkedJobs(prev => {
      if (prev.includes(jobId)) {
        return prev.filter(id => id !== jobId);
      } else {
        return [...prev, jobId];
      }
    });
  };

  const handleApply = (job) => {
    navigate(`/lowongan/${job.id}/apply`, { 
      state: { job }
    });
  };

  const showNotification = (message, type = 'info') => {
    // Create notification element
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    
    notification.className = `fixed top-4 right-4 ${bgColor} text-white p-4 rounded-lg shadow-lg z-50`;
    notification.innerHTML = `
      <div class="flex items-center">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-2"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-4 py-8">
        {/* Page Header - Tampilkan keyword dari URL jika ada */}
        {/* <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {urlParams.q ? `Hasil untuk "${urlParams.q}"` : 'Semua Lowongan Tersedia'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {urlParams.q 
              ? `Menampilkan lowongan terkait "${urlParams.q}"`
              : 'Temukan lowongan kerja yang sesuai dengan keahlian dan kebutuhan aksesibilitas Anda'
            }
          </p>
        </div> */}

        {/* Search and Filter Section - SAMA DENGAN LANDING PAGE */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Quick Search Bar */}
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
                disabled={isSearching}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {isSearching ? (
                  <>
                    <i className="fas fa-spinner animate-spin"></i> Mencari...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search"></i> Cari
                  </>
                )}
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

          {/* Advanced Filters */}
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

          {/* Quick Filter Chips */}
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
              <h3 className="font-bold text-lg mb-4">Filter Lanjutan</h3>
              
              {/* Disability Type Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Jenis Disabilitas yang Didukung</h4>
                <div className="space-y-2">
                  {[
                    { value: "tuna-netra", label: "Tuna Netra" },
                    { value: "tuna-rungu", label: "Tuna Rungu" },
                    { value: "tuna-daksa", label: "Tuna Daksa" },
                    { value: "autisme", label: "Autisme" },
                    { value: "semua-jenis", label: "Semua Jenis" }
                  ].map((type) => (
                    <label 
                      key={type.value}
                      className={`flex items-center p-2 rounded cursor-pointer transition ${
                        selectedFilters.disabilityTypes.includes(type.value) 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedFilters.disabilityTypes.includes(type.value)}
                        onChange={() => toggleFilter('disabilityTypes', type.value)}
                        className="mr-3 h-4 w-4 text-blue-500"
                      />
                      <span>{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Range Gaji</h4>
                <div className="space-y-2">
                  {[
                    { value: "0-5", label: "Rp 0 - 5 juta" },
                    { value: "5-10", label: "Rp 5 - 10 juta" },
                    { value: "10-15", label: "Rp 10 - 15 juta" },
                    { value: "15+", label: "Rp 15+ juta" }
                  ].map((range) => (
                    <label 
                      key={range.value}
                      className={`flex items-center p-2 rounded cursor-pointer transition ${
                        selectedFilters.salaryRange === range.value
                          ? 'bg-blue-100 text-blue-800' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="salary"
                        checked={selectedFilters.salaryRange === range.value}
                        onChange={() => toggleFilter('salaryRange', range.value)}
                        className="mr-3 h-4 w-4 text-blue-500"
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Company Size */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Ukuran Perusahaan</h4>
                <div className="space-y-2">
                  {[
                    { value: "startup", label: "Startup (1-50)" },
                    { value: "menengah", label: "Menengah (51-200)" },
                    { value: "besar", label: "Besar (201+)" }
                  ].map((size) => (
                    <label 
                      key={size.value}
                      className={`flex items-center p-2 rounded cursor-pointer transition ${
                        selectedFilters.companySize.includes(size.value)
                          ? 'bg-blue-100 text-blue-800' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedFilters.companySize.includes(size.value)}
                        onChange={() => toggleFilter('companySize', size.value)}
                        className="mr-3 h-4 w-4 text-blue-500"
                      />
                      <span>{size.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                Terapkan Filter
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition mt-2">
                Reset Filter
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h3 className="font-bold text-lg mb-4">Statistik Lowongan</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Lowongan</span>
                  <span className="font-bold">247</span>
                </div>
                <div className="flex justify-between">
                  <span>Remote Work</span>
                  <span className="font-bold">89</span>
                </div>
                <div className="flex justify-between">
                  <span>Full Time</span>
                  <span className="font-bold">156</span>
                </div>
                <div className="flex justify-between">
                  <span>Kesesuaian Profil</span>
                  <span className="font-bold text-green-600">85%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">247 Lowongan Ditemukan</h2>
                <p className="text-gray-600">Berdasarkan profil dan preferensi Anda</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Urutkan:</span>
                <select className="border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors">
                  <option>Kesesuaian Terbaik</option>
                  <option>Terbaru</option>
                  <option>Gaji Tertinggi</option>
                  <option>Perusahaan Terbaik</option>
                </select>
              </div>
            </div>

            {/* Job Listings Grid */}
            <div className="space-y-6">
              {jobs.map((job) => (
                <JobCard 
                  key={job.id}
                  job={job}
                  isBookmarked={bookmarkedJobs.includes(job.id)}
                  onBookmark={handleBookmark}
                  onApply={handleApply}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button className="px-3 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="px-3 py-2 border-2 border-blue-500 bg-blue-500 text-white rounded-lg">1</button>
              <button className="px-3 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">2</button>
              <button className="px-3 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">3</button>
              <span className="px-3 py-2">...</span>
              <button className="px-3 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">10</button>
              <button className="px-3 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LowonganPage;