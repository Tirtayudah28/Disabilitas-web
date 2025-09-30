// src/pages/employer/CandidateSearchPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CandidateSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    disability: '',
    location: '',
    skills: [],
    experience: '',
    availability: ''
  });

  // Mock candidates data
  const candidates = [
    {
      id: 1,
      name: "Ahmad Surya",
      title: "UI/UX Designer",
      disability: "Tuna Netra",
      location: "Jakarta",
      experience: "3 tahun",
      skills: ["Figma", "User Research", "Accessibility", "Prototyping"],
      match: 95,
      availability: "Immediate",
      lastActive: "2 hours ago",
      profileViews: 156,
      salaryExpectation: "Rp 8-12 jt",
      description: "UI/UX Designer dengan passion di inclusive design. Pengalaman 3 tahun di startup teknologi.",
      accommodations: ["Screen Reader", "Audio Description"],
      portfolio: "https://ahmadsurya.design",
      saved: false
    },
    {
      id: 2,
      name: "Sari Dewi",
      title: "Frontend Developer",
      disability: "Tuna Rungu", 
      location: "Bandung",
      experience: "4 tahun",
      skills: ["React", "JavaScript", "TypeScript", "Web Accessibility"],
      match: 88,
      availability: "2 weeks",
      lastActive: "1 day ago",
      profileViews: 203,
      salaryExpectation: "Rp 10-15 jt",
      description: "Frontend Developer specialist in accessible web applications. Open to remote work.",
      accommodations: ["Sign Language", "Written Communication"],
      portfolio: "https://saridewi.dev",
      saved: true
    },
    {
      id: 3,
      name: "Budi Santoso",
      title: "Content Writer",
      disability: "Tuna Daksa",
      location: "Surabaya",
      experience: "2 tahun",
      skills: ["Content Writing", "SEO", "Copywriting", "Research"],
      match: 82,
      availability: "1 month",
      lastActive: "3 days ago",
      profileViews: 89,
      salaryExpectation: "Rp 5-8 jt",
      description: "Content writer dengan spesialisasi konten accessible dan inclusive.",
      accommodations: ["Wheelchair Access", "Ergonomic Setup"],
      portfolio: "https://budisantoso.writer.com",
      saved: false
    },
    {
      id: 4,
      name: "Maya Indah",
      title: "Data Analyst",
      disability: "Autisme",
      location: "Jakarta",
      experience: "3 tahun",
      skills: ["Python", "SQL", "Data Visualization", "Statistics"],
      match: 91,
      availability: "Immediate",
      lastActive: "5 hours ago",
      profileViews: 134,
      salaryExpectation: "Rp 9-13 jt",
      description: "Data Analyst dengan keahlian pattern recognition dan analytical thinking.",
      accommodations: ["Structured Environment", "Clear Instructions"],
      portfolio: "https://mayaindah-analytics.netlify.app",
      saved: false
    }
  ];

  const [savedCandidates, setSavedCandidates] = useState(
    candidates.filter(candidate => candidate.saved).map(c => c.id)
  );

  const toggleSaveCandidate = (candidateId) => {
    setSavedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDisability = !filters.disability || candidate.disability === filters.disability;
    const matchesLocation = !filters.location || candidate.location === filters.location;
    const matchesExperience = !filters.experience || candidate.experience === filters.experience;
    const matchesAvailability = !filters.availability || candidate.availability === filters.availability;

    return matchesSearch && matchesDisability && matchesLocation && matchesExperience && matchesAvailability;
  });

  const uniqueDisabilities = [...new Set(candidates.map(c => c.disability))];
  const uniqueLocations = [...new Set(candidates.map(c => c.location))];
  const uniqueExperiences = [...new Set(candidates.map(c => c.experience))];
  const uniqueAvailabilities = [...new Set(candidates.map(c => c.availability))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <main id="main-content" className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-700 mb-2">Cari Kandidat</h1>
            <p className="text-gray-600">
              Temukan talenta terbaik dari database kandidat kami
            </p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Link 
              to="/employer/dashboard"
              className="border border-primary-500 text-primary-500 px-4 py-3 rounded-lg hover:bg-primary-50 transition flex items-center gap-2"
            >
              <i className="fas fa-arrow-left"></i>
              Kembali
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
              <h3 className="font-bold text-gray-900 mb-4">Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari Kandidat
                </label>
                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Nama, posisi, atau skill..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Disability Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Disabilitas
                </label>
                <select 
                  value={filters.disability}
                  onChange={(e) => setFilters({...filters, disability: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Semua</option>
                  {uniqueDisabilities.map(disability => (
                    <option key={disability} value={disability}>{disability}</option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi
                </label>
                <select 
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Semua</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Experience Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pengalaman
                </label>
                <select 
                  value={filters.experience}
                  onChange={(e) => setFilters({...filters, experience: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Semua</option>
                  {uniqueExperiences.map(exp => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
              </div>

              {/* Availability Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ketersediaan
                </label>
                <select 
                  value={filters.availability}
                  onChange={(e) => setFilters({...filters, availability: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Semua</option>
                  {uniqueAvailabilities.map(avail => (
                    <option key={avail} value={avail}>{avail}</option>
                  ))}
                </select>
              </div>

              {/* Reset Filters */}
              <button 
                onClick={() => setFilters({
                  disability: '',
                  location: '', 
                  skills: [],
                  experience: '',
                  availability: ''
                })}
                className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Candidates List */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {filteredCandidates.length} Kandidat Ditemukan
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Berdasarkan filter yang dipilih
                  </p>
                </div>
                <div className="flex gap-2">
                  <select className="border rounded-lg px-3 py-2 text-sm">
                    <option>Sort by: Relevance</option>
                    <option>Sort by: Match Score</option>
                    <option>Sort by: Experience</option>
                    <option>Sort by: Last Active</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Candidates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCandidates.map(candidate => (
                <div key={candidate.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                  {/* Candidate Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{candidate.name}</h3>
                        <p className="text-primary-600 font-medium">{candidate.title}</p>
                        <p className="text-sm text-gray-500">{candidate.disability}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                        {candidate.match}% Match
                      </span>
                      <button 
                        onClick={() => toggleSaveCandidate(candidate.id)}
                        className={`p-2 rounded-lg transition ${
                          savedCandidates.includes(candidate.id) 
                            ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <i className={`fas fa-${savedCandidates.includes(candidate.id) ? 'star' : 'star'}`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Candidate Info */}
                  <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-map-marker-alt text-gray-400"></i>
                        <span>{candidate.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fas fa-briefcase text-gray-400"></i>
                        <span>{candidate.experience}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fas fa-clock text-gray-400"></i>
                        <span>{candidate.availability}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fas fa-eye text-gray-400"></i>
                        <span>{candidate.profileViews} views</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm line-clamp-2">{candidate.description}</p>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.slice(0, 4).map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 4 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          +{candidate.skills.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Accommodations */}
                    <div className="flex flex-wrap gap-2">
                      {candidate.accommodations.map((acc, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          <i className="fas fa-check mr-1"></i>
                          {acc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <button className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition font-medium text-sm">
                      <i className="fas fa-envelope mr-2"></i>
                      Kirim Undangan
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition font-medium text-sm">
                      <i className="fas fa-eye mr-2"></i>
                      Lihat Profil
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredCandidates.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada kandidat ditemukan</h3>
                <p className="text-gray-500 mb-6">Coba ubah filter pencarian atau kata kunci.</p>
                <button 
                  onClick={() => setFilters({
                    disability: '',
                    location: '', 
                    skills: [],
                    experience: '',
                    availability: ''
                  })}
                  className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition font-medium"
                >
                  Reset Semua Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CandidateSearchPage;