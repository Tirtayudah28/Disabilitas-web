// src/pages/employer/ApplicationManagementPage.js
import React, { useState } from 'react';

const ApplicationManagementPage = () => {
  const [filter, setFilter] = useState('all');
  const [selectedApplications, setSelectedApplications] = useState([]);

  const applications = [
    {
      id: 1,
      candidate: {
        name: "Ahmad Surya",
        email: "ahmad.surya@email.com",
        disability: "Tuna Netra",
        location: "Jakarta"
      },
      job: "UI/UX Designer",
      appliedDate: "2024-01-15",
      status: "new",
      match: 95,
      skills: ["Figma", "User Research", "Accessibility"],
      resume: "ahmad-surya-resume.pdf"
    },
    // ... more applications
  ];

  const handleStatusChange = (applicationId, newStatus) => {
    // Handle status change logic
    console.log(`Change application ${applicationId} to ${newStatus}`);
  };

  const handleBulkAction = (action) => {
    // Handle bulk actions
    console.log(`Bulk ${action} for:`, selectedApplications);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Lamaran</h1>
          <p className="text-gray-600">Review dan kelola lamaran masuk</p>
        </div>

        {/* Filters and Bulk Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Semua
              </button>
              <button 
                onClick={() => setFilter('new')}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === 'new' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Baru
              </button>
              <button 
                onClick={() => setFilter('reviewed')}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === 'reviewed' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Ditinjau
              </button>
              <button 
                onClick={() => setFilter('interview')}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === 'interview' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Interview
              </button>
            </div>

            <div className="flex gap-2">
              <select className="border rounded-lg px-3 py-2">
                <option>Aksi Massal</option>
                <option>Pindah ke Ditinjau</option>
                <option>Undang Interview</option>
                <option>Tolak</option>
              </select>
              <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition">
                Terapkan
              </button>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kandidat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posisi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Match
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                          {app.candidate.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{app.candidate.name}</div>
                          <div className="text-sm text-gray-500">{app.candidate.disability}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{app.job}</div>
                      <div className="text-sm text-gray-500">{app.appliedDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select 
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-3 py-1 border-0 ${
                          app.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'interview' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="new">Baru</option>
                        <option value="reviewed">Ditinjau</option>
                        <option value="interview">Interview</option>
                        <option value="accepted">Diterima</option>
                        <option value="rejected">Ditolak</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        {app.match}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 mr-3">
                        Lihat
                      </button>
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        Undang Interview
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Tolak
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationManagementPage;