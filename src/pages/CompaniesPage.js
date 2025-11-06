// src/pages/CompaniesPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CompaniesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data perusahaan
  const mockCompanies = [
    {
      id: 1,
      name: 'PT Tech Inklusif Indonesia',
      logo: '💻',
      industry: 'Technology',
      location: 'Jakarta',
      size: '500-1000',
      description: 'Perusahaan teknologi yang fokus pada pengembangan software inklusif untuk disabilitas.',
      jobOpenings: 12,
      disabilityFriendly: true,
      website: 'https://techinklusif.com',
      founded: 2018,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Bank Aksesibilitas Nasional',
      logo: '🏦',
      industry: 'Finance',
      location: 'Jakarta',
      size: '1000-5000',
      description: 'Bank yang berkomitmen memberikan layanan finansial yang accessible untuk semua kalangan.',
      jobOpenings: 8,
      disabilityFriendly: true,
      website: 'https://bankakses.com',
      founded: 2010,
      rating: 4.6
    },
    {
      id: 3,
      name: 'Rumah Sakit Sehat Mandiri',
      logo: '🏥',
      industry: 'Healthcare',
      location: 'Bandung',
      size: '500-1000',
      description: 'Rumah sakit dengan fasilitas lengkap dan ramah disabilitas.',
      jobOpenings: 15,
      disabilityFriendly: true,
      website: 'https://rs-sehat.com',
      founded: 2005,
      rating: 4.7
    },
    {
      id: 4,
      name: 'Edukasi Inklusif Nusantara',
      logo: '🎓',
      industry: 'Education',
      location: 'Surabaya',
      size: '100-500',
      description: 'Lembaga pendidikan yang menyediakan program belajar untuk semua kemampuan.',
      jobOpenings: 6,
      disabilityFriendly: true,
      website: 'https://edukasiinklusif.com',
      founded: 2015,
      rating: 4.9
    },
    {
      id: 5,
      name: 'Retail Mandiri Bersama',
      logo: '🛍️',
      industry: 'Retail',
      location: 'Jakarta',
      size: '1000-5000',
      description: 'Perusahaan retail dengan toko yang didesain accessible untuk pengunjung disabilitas.',
      jobOpenings: 20,
      disabilityFriendly: true,
      website: 'https://rmb-retail.com',
      founded: 2000,
      rating: 4.5
    },
    {
      id: 6,
      name: 'Manufacturing Inklusif Jaya',
      logo: '🏭',
      industry: 'Manufacturing',
      location: 'Semarang',
      size: '500-1000',
      description: 'Pabrik dengan lingkungan kerja yang disesuaikan untuk pekerja disabilitas.',
      jobOpenings: 10,
      disabilityFriendly: true,
      website: 'https://manufacturingjaya.com',
      founded: 2012,
      rating: 4.4
    },
    {
      id: 7,
      name: 'Startup Digital Nusantara',
      logo: '🚀',
      industry: 'Technology',
      location: 'Yogyakarta',
      size: '50-100',
      description: 'Startup yang mengembangkan aplikasi mobile accessible untuk tuna netra.',
      jobOpenings: 5,
      disabilityFriendly: true,
      website: 'https://startupdigital.com',
      founded: 2020,
      rating: 4.8
    },
    {
      id: 8,
      name: 'Telekomunikasi Indonesia',
      logo: '📱',
      industry: 'Telecommunication',
      location: 'Jakarta',
      size: '5000+',
      description: 'Perusahaan telekomunikasi dengan layanan khusus untuk penyandang disabilitas.',
      jobOpenings: 25,
      disabilityFriendly: true,
      website: 'https://telkom-indonesia.com',
      founded: 1995,
      rating: 4.6
    }
  ];

  // Industries untuk filter
  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Education', 
    'Retail', 'Manufacturing', 'Telecommunication', 'Other'
  ];

  // Locations untuk filter
  const locations = [
    'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 
    'Semarang', 'Bali', 'Medan', 'Makassar'
  ];

  // Company sizes untuk filter
  const companySizes = [
    '1-50', '50-100', '100-500', '500-1000', '1000-5000', '5000+'
  ];

  useEffect(() => {
    // Simulasi loading data
    const timer = setTimeout(() => {
      setCompanies(mockCompanies);
      setFilteredCompanies(mockCompanies);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter companies
  useEffect(() => {
    let results = companies;

    if (searchTerm) {
      results = results.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (industryFilter) {
      results = results.filter(company => company.industry === industryFilter);
    }

    if (locationFilter) {
      results = results.filter(company => company.location === locationFilter);
    }

    if (sizeFilter) {
      results = results.filter(company => company.size === sizeFilter);
    }

    setFilteredCompanies(results);
  }, [searchTerm, industryFilter, locationFilter, sizeFilter, companies]);

  const clearFilters = () => {
    setSearchTerm('');
    setIndustryFilter('');
    setLocationFilter('');
    setSizeFilter('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Temukan Perusahaan <span className="text-primary-600">Inklusif</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Jelajahi perusahaan-perusahaan yang berkomitmen menciptakan lingkungan kerja 
              yang ramah dan accessible untuk penyandang disabilitas
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Cari nama perusahaan, industri, atau deskripsi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Options */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Industry Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-industry mr-2"></i>Industri
                </label>
                <select
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Semua Industri</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-map-marker-alt mr-2"></i>Lokasi
                </label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Semua Lokasi</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Size Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-users mr-2"></i>Ukuran Perusahaan
                </label>
                <select
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Semua Ukuran</option>
                  {companySizes.map(size => (
                    <option key={size} value={size}>{size} karyawan</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition font-medium flex items-center justify-center gap-2"
                >
                  <i className="fas fa-times"></i>
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || industryFilter || locationFilter || sizeFilter) && (
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    Search: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="text-primary-600 hover:text-primary-800">
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </span>
                )}
                {industryFilter && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    Industry: {industryFilter}
                    <button onClick={() => setIndustryFilter('')} className="text-blue-600 hover:text-blue-800">
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </span>
                )}
                {locationFilter && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    Location: {locationFilter}
                    <button onClick={() => setLocationFilter('')} className="text-green-600 hover:text-green-800">
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </span>
                )}
                {sizeFilter && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    Size: {sizeFilter}
                    <button onClick={() => setSizeFilter('')} className="text-purple-600 hover:text-purple-800">
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Menampilkan <span className="font-semibold">{filteredCompanies.length}</span> perusahaan
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <i className="fas fa-info-circle text-primary-500"></i>
                Semua perusahaan telah terverifikasi ramah disabilitas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          // Loading Skeleton
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          // No Results
          <div className="text-center py-12">
            <i className="fas fa-building text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada perusahaan yang ditemukan</h3>
            <p className="text-gray-600 mb-6">Coba ubah filter pencarian Anda</p>
            <button
              onClick={clearFilters}
              className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition font-medium"
            >
              Tampilkan Semua Perusahaan
            </button>
          </div>
        ) : (
          // Companies Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map(company => (
              <div key={company.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 group">
                {/* Company Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center text-2xl">
                    {company.logo}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition">
                      {company.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                        {company.industry}
                      </span>
                      {company.disabilityFriendly && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <i className="fas fa-universal-access text-xs"></i>
                          Ramah Disabilitas
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Company Info */}
                <div className="space-y-3 mb-4">
                  <p className="text-gray-600 text-sm leading-relaxed">{company.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <i className="fas fa-map-marker-alt text-primary-500"></i>
                      <span>{company.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <i className="fas fa-users text-primary-500"></i>
                      <span>{company.size} karyawan</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <i className="fas fa-calendar text-primary-500"></i>
                      <span>Didirikan {company.founded}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <i className="fas fa-star text-yellow-500"></i>
                      <span>{company.rating}/5</span>
                    </div>
                  </div>
                </div>

                {/* Job Openings & Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {company.jobOpenings} lowongan terbuka
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/lowongan?company=${company.name}`}
                      className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition text-sm font-medium flex items-center gap-2"
                    >
                      <i className="fas fa-eye"></i>
                      Lihat Lowongan
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button (jika ada banyak data) */}
        {filteredCompanies.length > 0 && (
          <div className="text-center mt-8">
            <button className="border border-primary-500 text-primary-500 px-6 py-3 rounded-lg hover:bg-primary-50 transition font-medium">
              <i className="fas fa-arrow-down mr-2"></i>
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesPage;