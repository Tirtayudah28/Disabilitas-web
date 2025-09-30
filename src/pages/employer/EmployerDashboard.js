// src/pages/employer/EmployerDashboard.js - COMPLETE VERSION
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30days');
  const [currentJobsPage, setCurrentJobsPage] = useState(1);
  const [currentCandidatesPage, setCurrentCandidatesPage] = useState(1);
  const jobsPerPage = 3;
  const candidatesPerPage = 4;

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
    profileViews: 1560,
    totalCandidates: 89
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

  // All jobs data - lebih banyak data untuk demo pagination
  const allJobs = [
    {
      id: 1,
      title: "UI/UX Designer",
      type: "Full Time",
      location: "Jakarta • Remote",
      department: "Product & Design",
      postedDate: "2024-01-10",
      applications: 45,
      views: 230,
      status: "active",
      matchRate: 85
    },
    {
      id: 2,
      title: "Frontend Developer",
      type: "Full Time", 
      location: "Bandung • Hybrid",
      department: "Engineering",
      postedDate: "2024-01-08",
      applications: 32,
      views: 189,
      status: "active",
      matchRate: 78
    },
    {
      id: 3,
      title: "Content Writer",
      type: "Part Time",
      location: "Remote",
      department: "Marketing",
      postedDate: "2024-01-05",
      applications: 28,
      views: 156,
      status: "active",
      matchRate: 82
    },
    {
      id: 4,
      title: "Data Analyst",
      type: "Full Time",
      location: "Jakarta • On-site",
      department: "Data Science",
      postedDate: "2024-01-03",
      applications: 18,
      views: 95,
      status: "paused",
      matchRate: 75
    },
    {
      id: 5,
      title: "Project Manager",
      type: "Full Time",
      location: "Remote",
      department: "Project Management",
      postedDate: "2023-12-28",
      applications: 34,
      views: 210,
      status: "closed",
      matchRate: 88
    },
    {
      id: 6,
      title: "Accessibility Specialist",
      type: "Contract",
      location: "Remote",
      department: "Product & Design",
      postedDate: "2024-01-12",
      applications: 15,
      views: 89,
      status: "active",
      matchRate: 92
    },
    {
      id: 7,
      title: "Backend Developer",
      type: "Full Time",
      location: "Jakarta • Hybrid",
      department: "Engineering",
      postedDate: "2024-01-09",
      applications: 22,
      views: 145,
      status: "active",
      matchRate: 80
    }
  ];

  // Candidates data untuk tab Kandidat
  const allCandidates = [
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
      saved: false
    },
    {
      id: 5,
      name: "Rina Wijaya",
      title: "Customer Service",
      disability: "Tuna Netra",
      location: "Yogyakarta",
      experience: "2 tahun",
      skills: ["Communication", "Problem Solving", "Empathy", "CRM"],
      match: 76,
      availability: "3 weeks",
      lastActive: "1 week ago",
      profileViews: 67,
      salaryExpectation: "Rp 4-6 jt",
      saved: false
    },
    {
      id: 6,
      name: "Dewi Anggraini",
      title: "HR Specialist",
      disability: "Tuna Rungu",
      location: "Jakarta",
      experience: "5 tahun",
      skills: ["Recruitment", "Training", "Compensation", "Employee Relations"],
      match: 87,
      availability: "Immediate",
      lastActive: "2 days ago",
      profileViews: 98,
      salaryExpectation: "Rp 11-16 jt",
      saved: true
    }
  ];

  // Analytics data
  const analyticsData = {
    applicationsOverTime: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [45, 52, 49, 60, 70, 75, 80, 85, 78, 82, 90, 95]
    },
    applicationSources: {
      labels: ['Website', 'LinkedIn', 'Job Portal', 'Referral', 'Other'],
      data: [45, 25, 15, 10, 5]
    },
    disabilityDistribution: {
      labels: ['Tuna Netra', 'Tuna Rungu', 'Tuna Daksa', 'Autisme', 'Lainnya'],
      data: [35, 25, 20, 15, 5]
    },
    hiringFunnel: {
      applied: 247,
      screened: 180,
      interviewed: 85,
      offered: 25,
      hired: 20
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'chart-bar' },
    { id: 'jobs', label: 'Lowongan', icon: 'briefcase' },
    { id: 'applications', label: 'Lamaran', icon: 'file-alt' },
    { id: 'candidates', label: 'Kandidat', icon: 'users' },
    { id: 'analytics', label: 'Analytics', icon: 'chart-pie' },
    { id: 'profile', label: 'Profil Perusahaan', icon: 'building' }
  ];

  // Pagination calculations
  const indexOfLastJob = currentJobsPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = allJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalJobsPages = Math.ceil(allJobs.length / jobsPerPage);

  const indexOfLastCandidate = currentCandidatesPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = allCandidates.slice(indexOfFirstCandidate, indexOfLastCandidate);
  const totalCandidatesPages = Math.ceil(allCandidates.length / candidatesPerPage);

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
  };

  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
      <div className="flex justify-center mt-6">
        <div className="flex gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Previous
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => onPageChange(index + 1)}
              className={`px-3 py-2 border rounded-lg text-sm ${
                currentPage === index + 1
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {index + 1}
            </button>
          ))}
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Next
          </button>
        </div>
      </div>
    );
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
            <Link 
              to="/employer/profile"
              className="border border-primary-500 text-primary-500 px-4 py-3 rounded-lg hover:bg-primary-50 transition flex items-center gap-2"
            >
              <i className="fas fa-building"></i>
              Profil
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
              {/* Company Info */}
              <div className="text-center mb-6">
                <Link to="/employer/profile" className="inline-block hover:opacity-80 transition">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                    {companyData.name.charAt(0)}
                  </div>
                </Link>
                <h3 className="font-bold text-gray-900">{companyData.name}</h3>
                <p className="text-sm text-gray-600">{companyData.industry}</p>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2">
                  {companyData.plan}
                </span>
                <Link 
                  to="/employer/profile"
                  className="inline-block mt-3 text-primary-500 hover:text-primary-600 text-sm font-medium"
                >
                  <i className="fas fa-edit mr-1"></i>
                  Edit Profil
                </Link>
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
                      {currentJobs.filter(job => job.status === 'active').slice(0, 3).map(job => (
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
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    <Link 
                      to="/employer/profile"
                      className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center hover:bg-orange-100 transition"
                    >
                      <i className="fas fa-building text-orange-600 text-2xl mb-2"></i>
                      <div className="font-medium text-orange-700">Edit Profil</div>
                      <p className="text-sm text-orange-600">Kelola perusahaan</p>
                    </Link>
                     <Link 
                      to="/employer/interviews"
                      className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center hover:bg-blue-100 transition"
                    >
                      <i className="fas fa-calendar-check text-blue-600 text-2xl mb-2"></i>
                      <div className="font-medium text-blue-700">Jadwal Interview</div>
                      <p className="text-sm text-blue-600">Kelola jadwal</p>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Jobs Tab - DENGAN PAGINATION */}
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
                    {currentJobs.map(job => (
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
                            <p className="font-medium text-green-600">{job.matchRate}%</p>
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

                  {/* Pagination untuk Jobs */}
                  <Pagination 
                    currentPage={currentJobsPage}
                    totalPages={totalJobsPages}
                    onPageChange={setCurrentJobsPage}
                  />
                </div>
              </div>
            )}

            {/* Applications Tab */}
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
                            <Link 
                              to={"/employer/interviews"}
                              className="text-green-500 hover:text-green-700 text-sm font-medium"
                            >
                              Undang Interview
                            </Link>
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

            {/* Candidates Tab - YANG SUDAH DIPERBAIKI */}
            {activeTab === 'candidates' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Cari Kandidat</h2>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Cari kandidat..."
                      className="border rounded-lg px-3 py-2 text-sm w-64"
                    />
                    <select className="border rounded-lg px-3 py-2 text-sm">
                      <option>Semua Disabilitas</option>
                      <option>Tuna Netra</option>
                      <option>Tuna Rungu</option>
                      <option>Tuna Daksa</option>
                      <option>Autisme</option>
                    </select>
                  </div>
                </div>

                {/* Candidates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentCandidates.map(candidate => (
                    <div key={candidate.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
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
                          <button className={`p-2 rounded-lg transition ${
                            candidate.saved 
                              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}>
                            <i className="fas fa-star"></i>
                          </button>
                        </div>
                      </div>

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

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills.slice(0, 4).map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

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

                {/* Pagination untuk Candidates */}
                <Pagination 
                  currentPage={currentCandidatesPage}
                  totalPages={totalCandidatesPages}
                  onPageChange={setCurrentCandidatesPage}
                />
              </div>
            )}

            {/* Analytics Tab - YANG SUDAH DIPERBAIKI */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Analytics & Laporan</h2>
                
                {/* Analytics Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-primary-600">{stats.totalApplications}</div>
                    <div className="text-sm text-gray-600">Total Lamaran</div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.hireRate}%</div>
                    <div className="text-sm text-gray-600">Hire Rate</div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.interviewRate}%</div>
                    <div className="text-sm text-gray-600">Interview Rate</div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalCandidates}</div>
                    <div className="text-sm text-gray-600">Total Kandidat</div>
                  </div>
                </div>

                {/* Hiring Funnel */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Hiring Funnel</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Applied</span>
                      <div className="flex items-center gap-3">
                        <div className="w-48 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '100%'}}></div>
                        </div>
                        <span className="text-sm font-bold">{analyticsData.hiringFunnel.applied}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Screened</span>
                      <div className="flex items-center gap-3">
                        <div className="w-48 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '73%'}}></div>
                        </div>
                        <span className="text-sm font-bold">{analyticsData.hiringFunnel.screened}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Interviewed</span>
                      <div className="flex items-center gap-3">
                        <div className="w-48 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{width: '34%'}}></div>
                        </div>
                        <span className="text-sm font-bold">{analyticsData.hiringFunnel.interviewed}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Offered</span>
                      <div className="flex items-center gap-3">
                        <div className="w-48 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{width: '10%'}}></div>
                        </div>
                        <span className="text-sm font-bold">{analyticsData.hiringFunnel.offered}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Hired</span>
                      <div className="flex items-center gap-3">
                        <div className="w-48 bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{width: '8%'}}></div>
                        </div>
                        <span className="text-sm font-bold">{analyticsData.hiringFunnel.hired}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Disability Distribution */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Distribusi Jenis Disabilitas</h3>
                  <div className="space-y-3">
                    {analyticsData.disabilityDistribution.labels.map((disability, index) => (
                      <div key={disability} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{disability}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500" 
                              style={{width: `${analyticsData.disabilityDistribution.data[index]}%`}}
                            ></div>
                          </div>
                          <span className="text-sm font-bold w-8">{analyticsData.disabilityDistribution.data[index]}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Reports */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Laporan Cepat</h3>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                        <div className="font-medium text-gray-900">Laporan Bulanan</div>
                        <div className="text-sm text-gray-600">Jan 2024 - Performance Report</div>
                      </button>
                      <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                        <div className="font-medium text-gray-900">Diversity Report</div>
                        <div className="text-sm text-gray-600">Inclusion & Diversity Metrics</div>
                      </button>
                      <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                        <div className="font-medium text-gray-900">Time-to-Hire Analysis</div>
                        <div className="text-sm text-gray-600">Hiring Process Efficiency</div>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Ekspor Data</h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                        <i className="fas fa-file-excel text-green-500"></i>
                        <div>
                          <div className="font-medium text-gray-900">Export to Excel</div>
                          <div className="text-sm text-gray-600">All candidate data</div>
                        </div>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                        <i className="fas fa-file-pdf text-red-500"></i>
                        <div>
                          <div className="font-medium text-gray-900">Export to PDF</div>
                          <div className="text-sm text-gray-600">Monthly report</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="text-center py-12">
                  <i className="fas fa-building text-4xl text-primary-500 mb-4"></i>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Profil Perusahaan</h2>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Kelola informasi perusahaan, branding, dan pengaturan profil untuk menarik kandidat terbaik.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      to="/employer/profile"
                      className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition font-medium flex items-center gap-2"
                    >
                      <i className="fas fa-edit"></i>
                      Edit Profil Perusahaan
                    </Link>
                    <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition font-medium flex items-center gap-2">
                      <i className="fas fa-eye"></i>
                      Preview Profil
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
                    <div className="bg-primary-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary-600">85%</div>
                      <div className="text-sm text-primary-700">Profile Completion</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">1,560</div>
                      <div className="text-sm text-green-700">Profile Views</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">92%</div>
                      <div className="text-sm text-purple-700">Candidate Trust</div>
                    </div>
                  </div>
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