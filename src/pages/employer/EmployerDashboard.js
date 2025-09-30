// src/pages/employer/EmployerDashboard.js - FIXED VERSION
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30days');

  // Mock company data
  const companyData = {
    name: "PT Tech Inklusif",
    industry: "Technology",
    size: "51-200 employees",
    plan: "Premium",
    joinedDate: "2023-05-15"
  };

  // Dashboard stats
  const stats = {
    totalJobs: 12,
    activeJobs: 8,
    totalApplications: 247,
    newApplications: 23,
    interviewRate: 15,
    hireRate: 8,
    profileViews: 1560
  };

  // Recent applications
  const recentApplications = [
    {
      id: 1,
      candidate: "Ahmad Surya",
      position: "UI/UX Designer",
      appliedDate: "2024-01-15",
      status: "new",
      statusLabel: "Baru",
      match: 95,
      disability: "Tuna Netra",
      skills: ["Figma", "User Research", "Accessibility"]
    },
    {
      id: 2,
      candidate: "Sari Dewi",
      position: "Frontend Developer", 
      appliedDate: "2024-01-14",
      status: "reviewed",
      statusLabel: "Ditinjau",
      match: 88,
      disability: "Tuna Rungu",
      skills: ["React", "JavaScript", "TypeScript"]
    },
    {
      id: 3,
      candidate: "Budi Santoso",
      position: "Content Writer",
      appliedDate: "2024-01-13",
      status: "interview",
      statusLabel: "Interview",
      match: 82,
      disability: "Tuna Daksa",
      skills: ["Content Writing", "SEO", "Copywriting"]
    }
  ];

  // Active jobs
  const activeJobs = [
    {
      id: 1,
      title: "UI/UX Designer",
      type: "Full Time",
      location: "Jakarta • Remote",
      postedDate: "2024-01-10",
      applications: 45,
      views: 230,
      status: "active"
    },
    {
      id: 2,
      title: "Frontend Developer",
      type: "Full Time", 
      location: "Bandung • Hybrid",
      postedDate: "2024-01-08",
      applications: 32,
      views: 189,
      status: "active"
    },
    {
      id: 3,
      title: "Content Writer",
      type: "Part Time",
      location: "Remote",
      postedDate: "2024-01-05",
      applications: 28,
      views: 156,
      status: "active"
    }
  ];

  // All jobs for jobs tab
  const allJobs = [
    ...activeJobs,
    {
      id: 4,
      title: "Data Analyst",
      type: "Full Time",
      location: "Jakarta • On-site",
      postedDate: "2024-01-03",
      applications: 18,
      views: 95,
      status: "paused"
    },
    {
      id: 5,
      title: "Project Manager",
      type: "Full Time",
      location: "Remote",
      postedDate: "2023-12-28",
      applications: 34,
      views: 210,
      status: "closed"
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'chart-bar' },
    { id: 'jobs', label: 'Lowongan', icon: 'briefcase' },
    { id: 'applications', label: 'Lamaran', icon: 'file-alt' },
    { id: 'candidates', label: 'Kandidat', icon: 'users' },
    { id: 'analytics', label: 'Analytics', icon: 'chart-pie' }
  ];

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      new: 'bg-blue-100 text-blue-800',
      reviewed: 'bg-yellow-100 text-yellow-800',
      interview: 'bg-purple-100 text-purple-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const handleJobAction = (jobId, action) => {
    console.log(`${action} job ${jobId}`);
    // Implement job actions (edit, pause, close, etc.)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <main id="main-content" className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-700 mb-2">Employer Dashboard</h1>
            <p className="text-gray-600">
              Selamat datang, <span className="font-medium">{companyData.name}</span>
            </p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Link 
              to="/employer/job-posting"
              className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition font-medium flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              Posting Lowongan Baru
            </Link>
            <button className="border border-primary-500 text-primary-500 px-4 py-3 rounded-lg hover:bg-primary-50 transition">
              <i className="fas fa-cog"></i>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
              {/* Company Info */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                  {companyData.name.charAt(0)}
                </div>
                <h3 className="font-bold text-gray-900">{companyData.name}</h3>
                <p className="text-sm text-gray-600">{companyData.industry}</p>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2">
                  {companyData.plan}
                </span>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                      activeTab === tab.id 
                        ? 'bg-primary-100 text-primary-600 border-l-4 border-primary-500' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <i className={`fas fa-${tab.icon} text-primary-500 w-5 text-center`}></i>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Quick Stats */}
              <div className="border-t mt-6 pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lowongan Aktif</span>
                    <span className="font-bold text-primary-600">{stats.activeJobs}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lamaran Baru</span>
                    <span className="font-bold text-green-600">{stats.newApplications}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rate Hire</span>
                    <span className="font-bold text-blue-600">{stats.hireRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Lowongan</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-briefcase text-blue-600 text-xl"></i>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-green-600 text-sm font-medium">
                        +2 dari bulan lalu
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Lamaran</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-file-alt text-green-600 text-xl"></i>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-green-600 text-sm font-medium">
                        +23 baru
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Interview Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.interviewRate}%</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-user-check text-purple-600 text-xl"></i>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-green-600 text-sm font-medium">
                        +5% improvement
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Profile Views</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.profileViews}</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-eye text-orange-600 text-xl"></i>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-green-600 text-sm font-medium">
                        +156 minggu ini
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Applications */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Lamaran Terbaru</h3>
                      <Link to="/employer/applications" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                        Lihat Semua
                      </Link>
                    </div>
                    <div className="space-y-4">
                      {recentApplications.map(application => (
                        <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{application.candidate}</h4>
                              <p className="text-sm text-gray-600">{application.position}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(application.status)}`}>
                              {application.statusLabel}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{application.appliedDate}</span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {application.match}% match
                            </span>
                          </div>
                          <div className="mt-2">
                            <span className="text-xs text-gray-500">Disabilitas: {application.disability}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Jobs */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Lowongan Aktif</h3>
                      <Link to="/employer/jobs" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                        Kelola
                      </Link>
                    </div>
                    <div className="space-y-4">
                      {activeJobs.map(job => (
                        <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{job.title}</h4>
                              <p className="text-sm text-gray-600">{job.location}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(job.status)}`}>
                              {job.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Diposting: {job.postedDate}</span>
                            <span className="text-primary-600 font-medium">{job.applications} pelamar</span>
                          </div>
                          <div className="mt-2 flex gap-2">
                            <Link 
                              to={`/employer/jobs/${job.id}`}
                              className="text-primary-500 hover:text-primary-600 text-xs"
                            >
                              <i className="fas fa-eye mr-1"></i>Lihat
                            </Link>
                            <button 
                              onClick={() => handleJobAction(job.id, 'edit')}
                              className="text-green-500 hover:text-green-600 text-xs"
                            >
                              <i className="fas fa-edit mr-1"></i>Edit
                            </button>
                            <button 
                              onClick={() => handleJobAction(job.id, 'pause')}
                              className="text-red-500 hover:text-red-600 text-xs"
                            >
                              <i className="fas fa-pause mr-1"></i>Pause
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link 
                      to="/employer/job-posting"
                      className="bg-primary-50 border border-primary-200 rounded-lg p-4 text-center hover:bg-primary-100 transition"
                    >
                      <i className="fas fa-plus text-primary-600 text-2xl mb-2"></i>
                      <div className="font-medium text-primary-700">Posting Lowongan</div>
                      <p className="text-sm text-primary-600">Buat lowongan baru</p>
                    </Link>
                    <Link 
                      to="/employer/candidates"
                      className="bg-green-50 border border-green-200 rounded-lg p-4 text-center hover:bg-green-100 transition"
                    >
                      <i className="fas fa-search text-green-600 text-2xl mb-2"></i>
                      <div className="font-medium text-green-700">Cari Kandidat</div>
                      <p className="text-sm text-green-600">Temukan talenta</p>
                    </Link>
                    <Link 
                      to="/employer/analytics"
                      className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center hover:bg-purple-100 transition"
                    >
                      <i className="fas fa-chart-bar text-purple-600 text-2xl mb-2"></i>
                      <div className="font-medium text-purple-700">Lihat Analytics</div>
                      <p className="text-sm text-purple-600">Analisis performa</p>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Jobs Tab - FIXED: Show actual job management */}
            {activeTab === 'jobs' && (
              <div className="space-y-6">

                {/* Job Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-primary-600">{stats.activeJobs}</div>
                    <div className="text-sm text-gray-600">Aktif</div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">1</div>
                    <div className="text-sm text-gray-600">Paused</div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">1</div>
                    <div className="text-sm text-gray-600">Closed</div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalJobs}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>

                {/* Jobs List */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Semua Lowongan</h3>
                  <div className="space-y-4">
                    {allJobs.map(job => (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-lg">{job.title}</h4>
                            <p className="text-gray-600">{job.type} • {job.location}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(job.status)}`}>
                            {job.status === 'active' ? 'Aktif' : 
                             job.status === 'paused' ? 'Paused' : 'Closed'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-500">Diposting:</span>
                            <p className="font-medium">{job.postedDate}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Pelamar:</span>
                            <p className="font-medium text-primary-600">{job.applications}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Views:</span>
                            <p className="font-medium">{job.views}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Match Rate:</span>
                            <p className="font-medium text-green-600">85%</p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-3 border-t">
                          <Link 
                            to={`/employer/jobs/${job.id}`}
                            className="flex-1 bg-primary-500 text-white py-2 rounded text-center hover:bg-primary-600 transition text-sm"
                          >
                            <i className="fas fa-chart-bar mr-1"></i>Analytics
                          </Link>
                          <button 
                            onClick={() => handleJobAction(job.id, 'edit')}
                            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition text-sm"
                          >
                            <i className="fas fa-edit mr-1"></i>Edit
                          </button>
                          <button 
                            onClick={() => handleJobAction(job.id, job.status === 'active' ? 'pause' : 'activate')}
                            className={`flex-1 border py-2 rounded transition text-sm ${
                              job.status === 'active' 
                                ? 'border-yellow-300 text-yellow-600 hover:bg-yellow-50' 
                                : 'border-green-300 text-green-600 hover:bg-green-50'
                            }`}
                          >
                            <i className={`fas fa-${job.status === 'active' ? 'pause' : 'play'} mr-1`}></i>
                            {job.status === 'active' ? 'Pause' : 'Aktifkan'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Applications Tab - FIXED: Show actual applications management */}
            {activeTab === 'applications' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Kelola Lamaran</h2>
                  <Link 
                    to="/employer/applications"
                    className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition font-medium flex items-center gap-2"
                  >
                    <i className="fas fa-external-link-alt mr-2"></i>
                    Buka Halaman Lengkap
                  </Link>
                </div>

                {/* Application Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{stats.totalApplications}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.newApplications}</div>
                    <div className="text-sm text-gray-600">Baru</div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">15</div>
                    <div className="text-sm text-gray-600">Ditinjau</div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">8</div>
                    <div className="text-sm text-gray-600">Interview</div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">5</div>
                    <div className="text-sm text-gray-600">Diterima</div>
                  </div>
                </div>

                {/* Applications Preview */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Lamaran Terbaru</h3>
                    <div className="flex gap-2">
                      <select className="border rounded-lg px-3 py-2 text-sm">
                        <option>Semua Posisi</option>
                        <option>UI/UX Designer</option>
                        <option>Frontend Developer</option>
                        <option>Content Writer</option>
                      </select>
                      <select className="border rounded-lg px-3 py-2 text-sm">
                        <option>Semua Status</option>
                        <option>Baru</option>
                        <option>Ditinjau</option>
                        <option>Interview</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {recentApplications.map(application => (
                      <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                              {application.candidate.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{application.candidate}</h4>
                              <p className="text-primary-600">{application.position}</p>
                              <p className="text-sm text-gray-500">{application.disability}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(application.status)}`}>
                            {application.statusLabel}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex gap-4 text-sm">
                            <span className="text-gray-500">{application.appliedDate}</span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                              {application.match}% Match
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Link 
                              to={`/employer/applications/${application.id}`}
                              className="text-primary-500 hover:text-primary-700 text-sm font-medium"
                            >
                              Lihat Detail
                            </Link>
                            <button className="text-green-500 hover:text-green-700 text-sm font-medium">
                              Undang Interview
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <Link 
                      to="/employer/applications"
                      className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition font-medium"
                    >
                      Lihat Semua Lamaran
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Candidates Tab - Placeholder */}
            {activeTab === 'candidates' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Cari Kandidat</h2>
                <div className="text-center py-12 text-gray-500">
                  <i className="fas fa-users text-4xl mb-4"></i>
                  <p>Fitur pencarian kandidat akan segera hadir</p>
                  <p className="text-sm mt-2">Cari talenta terbaik dari database kandidat kami</p>
                </div>
              </div>
            )}

            {/* Analytics Tab - Placeholder */}
            {activeTab === 'analytics' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics & Laporan</h2>
                <div className="text-center py-12 text-gray-500">
                  <i className="fas fa-chart-pie text-4xl mb-4"></i>
                  <p>Dashboard analytics akan segera hadir</p>
                  <p className="text-sm mt-2">Lihat statistik dan insights performa rekrutmen</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployerDashboard;