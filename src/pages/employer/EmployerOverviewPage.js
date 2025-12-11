import React from 'react'
import { Link } from 'react-router-dom';

const EmployerOverviewPage = () => {
  // Dashboard stats
  const stats = {
    totalJobs: 12,
    activeJobs: 8,
    totalApplications: 247,
    newApplications: 23,
    interviewRate: 15,
    hireRate: 8,
    profileViews: 1560,
    totalCandidates: 89,
  };
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
      skills: ["Figma", "User Research", "Accessibility"],
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
      skills: ["React", "JavaScript", "TypeScript"],
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
      skills: ["Content Writing", "SEO", "Copywriting"],
    },
  ];

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
       matchRate: 85,
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
       matchRate: 78,
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
       matchRate: 82,
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
       matchRate: 75,
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
       matchRate: 88,
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
       matchRate: 92,
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
       matchRate: 80,
     },
   ];

  const handleJobAction = () => {
    return
  }
  const getStatusBadgeClass = () => {
    return
  }
  return (
    <div>
      <div className="space-y-2">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Lowongan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalJobs}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalApplications}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {stats.interviewRate}%
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {stats.profileViews}
                </p>
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
              <h3 className="text-lg font-bold text-gray-900">
                Lamaran Terbaru
              </h3>
              <Link
                to="/employer/applications"
                className="text-primary-500 hover:text-primary-600 text-sm font-medium"
              >
                Lihat Semua
              </Link>
            </div>
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div
                  key={application.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {application.candidate}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {application.position}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                        application.status
                      )}`}
                    >
                      {application.statusLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {application.appliedDate}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {application.match}% match
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">
                      Disabilitas: {application.disability}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Jobs */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Lowongan Aktif
              </h3>
              <Link
                to="/employer/jobs"
                className="text-primary-500 hover:text-primary-600 text-sm font-medium"
              >
                Kelola
              </Link>
            </div>
            <div className="space-y-4">
              {allJobs
                .filter((job) => job.status === "active")
                .slice(0, 3)
                .map((job) => (
                  <div
                    key={job.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {job.title}
                        </h4>
                        <p className="text-sm text-gray-600">{job.location}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          job.status
                        )}`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Diposting: {job.postedDate}
                      </span>
                      <span className="text-primary-600 font-medium">
                        {job.applications} pelamar
                      </span>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Link
                        to={`/employer/jobs/${job.id}`}
                        className="text-primary-500 hover:text-primary-600 text-xs"
                      >
                        <i className="fas fa-eye mr-1"></i>Lihat
                      </Link>
                      <button
                        onClick={() => handleJobAction(job.id, "edit")}
                        className="text-green-500 hover:text-green-600 text-xs"
                      >
                        <i className="fas fa-edit mr-1"></i>Edit
                      </button>
                      <button
                        onClick={() => handleJobAction(job.id, "pause")}
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
      </div>
    </div>
  );
}

export default EmployerOverviewPage