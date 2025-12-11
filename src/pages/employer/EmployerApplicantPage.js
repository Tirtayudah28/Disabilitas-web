import React from "react";
import { Link } from "react-router-dom";

const EmployerApplicantPage = () => {
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

  const getStatusBadgeClass = () => {
    return;
  };
  return (
    <div>
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
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalApplications}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.newApplications}
            </div>
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
            {recentApplications.map((application) => (
              <div
                key={application.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                      {application.candidate.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {application.candidate}
                      </h4>
                      <p className="text-primary-600">{application.position}</p>
                      <p className="text-sm text-gray-500">
                        {application.disability}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                      application.status
                    )}`}
                  >
                    {application.statusLabel}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-500">
                      {application.appliedDate}
                    </span>
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
    </div>
  );
};

export default EmployerApplicantPage;
