// src/pages/application/ApplicationHistory.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ApplicationHistory = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Mock applications data
  const [applications] = useState([
    {
      id: 1,
      jobId: 1,
      jobTitle: "UI/UX Designer",
      company: "PT Tech Inklusif",
      companyLogo: "TI",
      logoColor: "from-primary-500 to-secondary-500",
      location: "Jakarta • Remote",
      appliedDate: "2024-01-15",
      status: "submitted",
      statusLabel: "Terkirim",
      statusColor: "blue",
      lastUpdate: "2 jam lalu",
      matchScore: 95,
      notes: "Lamaran berhasil dikirim dan sedang dalam proses review"
    },
    {
      id: 2,
      jobId: 2,
      jobTitle: "Content Writer",
      company: "Media Inklusif", 
      companyLogo: "MI",
      logoColor: "from-green-500 to-blue-500",
      location: "Remote",
      appliedDate: "2024-01-12",
      status: "under_review",
      statusLabel: "Dalam Review",
      statusColor: "yellow",
      lastUpdate: "1 hari lalu",
      matchScore: 85,
      notes: "CV Anda sedang ditinjau oleh tim rekrutmen"
    },
    {
      id: 3,
      jobId: 3,
      jobTitle: "Frontend Developer",
      company: "Fintech Inklusif",
      companyLogo: "FI",
      logoColor: "from-purple-500 to-pink-500",
      location: "Bandung • Hybrid",
      appliedDate: "2024-01-10",
      status: "interview",
      statusLabel: "Interview",
      statusColor: "purple",
      lastUpdate: "3 hari lalu",
      matchScore: 78,
      notes: "Jadwalkan sesi interview untuk minggu depan"
    },
    {
      id: 4,
      jobId: 4,
      jobTitle: "Product Manager",
      company: "Startup Inklusif",
      companyLogo: "SI",
      logoColor: "from-orange-500 to-red-500",
      location: "Jakarta",
      appliedDate: "2024-01-05",
      status: "rejected",
      statusLabel: "Ditolak",
      statusColor: "red",
      lastUpdate: "1 minggu lalu",
      matchScore: 65,
      notes: "Posisi telah diisi oleh kandidat lain"
    },
    {
      id: 5,
      jobId: 5,
      jobTitle: "UX Researcher",
      company: "Research Lab",
      companyLogo: "RL",
      logoColor: "from-blue-500 to-green-500",
      location: "Remote",
      appliedDate: "2024-01-03",
      status: "accepted",
      statusLabel: "Diterima",
      statusColor: "green",
      lastUpdate: "2 minggu lalu",
      matchScore: 92,
      notes: "Selamat! Anda diterima untuk posisi ini"
    }
  ]);

  const statusFilters = [
    { value: 'all', label: 'Semua', count: applications.length },
    { value: 'submitted', label: 'Terkirim', count: applications.filter(app => app.status === 'submitted').length },
    { value: 'under_review', label: 'Dalam Review', count: applications.filter(app => app.status === 'under_review').length },
    { value: 'interview', label: 'Interview', count: applications.filter(app => app.status === 'interview').length },
    { value: 'accepted', label: 'Diterima', count: applications.filter(app => app.status === 'accepted').length },
    { value: 'rejected', label: 'Ditolak', count: applications.filter(app => app.status === 'rejected').length }
  ];

  const filteredApplications = applications.filter(app => 
    filter === 'all' || app.status === filter
  );

  const getStatusBadgeClass = (statusColor) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800'
    };
    return colorMap[statusColor] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <main id="main-content" className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-700 mb-4">Riwayat Lamaran</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Lacak status semua lamaran kerja yang telah Anda kirim
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">{applications.length}</div>
              <div className="text-sm text-gray-600">Total Lamaran</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {applications.filter(app => ['submitted', 'under_review', 'interview'].includes(app.status)).length}
              </div>
              <div className="text-sm text-gray-600">Dalam Proses</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {applications.filter(app => app.status === 'accepted').length}
              </div>
              <div className="text-sm text-gray-600">Diterima</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">89%</div>
              <div className="text-sm text-gray-600">Response Rate</div>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {statusFilters.map(status => (
                  <button
                    key={status.value}
                    onClick={() => setFilter(status.value)}
                    className={`px-4 py-2 rounded-lg transition font-medium ${
                      filter === status.value
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.label} ({status.count})
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Urutkan:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-lg px-3 py-2"
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="match">Kesesuaian Tertinggi</option>
                  <option value="company">Nama Perusahaan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {filteredApplications.map(application => (
              <div key={application.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Job Info */}
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`w-16 h-16 bg-gradient-to-br ${application.logoColor} rounded-xl flex items-center justify-center text-white font-bold text-xl`}>
                      {application.companyLogo}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {application.jobTitle}
                          </h3>
                          <p className="text-primary-600 font-medium">
                            {application.company} • {application.location}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(application.statusColor)}`}>
                          {application.statusLabel}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>
                          <i className="fas fa-calendar mr-1"></i>
                          Dilamar: {new Date(application.appliedDate).toLocaleDateString('id-ID')}
                        </span>
                        <span>
                          <i className="fas fa-clock mr-1"></i>
                          {application.lastUpdate}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          <i className="fas fa-bolt mr-1"></i>
                          {application.matchScore}% Match
                        </span>
                      </div>

                      <p className="text-gray-700 text-sm">{application.notes}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <Link 
                      to={`/lowongan/${application.jobId}`}
                      className="flex items-center gap-2 text-primary-500 hover:text-primary-600 transition px-3 py-2"
                    >
                      <i className="fas fa-eye"></i>
                      <span className="text-sm">Lihat Lowongan</span>
                    </Link>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition px-3 py-2">
                      <i className="fas fa-download"></i>
                      <span className="text-sm">Unduh Lamaran</span>
                    </button>
                    <button className="flex items-center gap-2 text-red-500 hover:text-red-600 transition px-3 py-2">
                      <i className="fas fa-trash"></i>
                      <span className="text-sm">Hapus</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar for certain statuses */}
                {['submitted', 'under_review', 'interview'].includes(application.status) && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress Lamaran</span>
                      <span>
                        {application.status === 'submitted' && '25%'}
                        {application.status === 'under_review' && '50%'}  
                        {application.status === 'interview' && '75%'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: application.status === 'submitted' ? '25%' : 
                                 application.status === 'under_review' ? '50%' : '75%'
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredApplications.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <i className="fas fa-file-invoice text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Lamaran</h3>
              <p className="text-gray-600 mb-6">Mulai kirim lamaran pertama Anda dan lacak progressnya di sini</p>
              <Link 
                to="/lowongan"
                className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition font-medium"
              >
                <i className="fas fa-search mr-2"></i>
                Cari Lowongan
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ApplicationHistory;