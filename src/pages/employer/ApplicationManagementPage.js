// src/pages/employer/ApplicationManagementPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ApplicationManagementPage = () => {
  const [filter, setFilter] = useState('all');
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock applications data
  const applications = [
    {
      id: 1,
      candidate: {
        name: "Ahmad Surya",
        email: "ahmad.surya@email.com",
        disability: "Tuna Netra",
        location: "Jakarta",
        phone: "08123456789",
        joinedDate: "2023-08-15"
      },
      job: "UI/UX Designer",
      appliedDate: "2024-01-15",
      status: "new",
      match: 95,
      skills: ["Figma", "User Research", "Accessibility", "Prototyping", "Wireframing"],
      resume: "ahmad-surya-resume.pdf",
      coverLetter: "Saya sangat tertarik dengan posisi UI/UX Designer di perusahaan Anda. Dengan pengalaman 3 tahun di bidang desain yang accessible, saya yakin dapat memberikan kontribusi positif untuk tim Anda...",
      accommodations: ["Screen Reader Support", "Flexible Hours", "Document Accessibility"],
      portfolio: "https://ahmadsurya.design",
      education: "Sarjana Desain Komunikasi Visual - Universitas Indonesia"
    },
    {
      id: 2,
      candidate: {
        name: "Sari Dewi",
        email: "sari.dewi@email.com",
        disability: "Tuna Rungu",
        location: "Bandung", 
        phone: "08129876543",
        joinedDate: "2023-09-20"
      },
      job: "Frontend Developer",
      appliedDate: "2024-01-14",
      status: "reviewed",
      match: 88,
      skills: ["React", "JavaScript", "TypeScript", "HTML/CSS", "Web Accessibility"],
      resume: "sari-dewi-resume.pdf",
      coverLetter: "Sebagai developer dengan pengalaman 3 tahun, saya memiliki passion dalam membangun aplikasi web yang accessible. Saya telah bekerja pada berbagai proyek yang memprioritaskan aksesibilitas...",
      accommodations: ["Sign Language Interpreter", "Written Communication", "Visual Alerts"],
      portfolio: "https://saridewi.dev",
      education: "Diploma Teknik Informatika - Politeknik Negeri Bandung"
    },
    {
      id: 3,
      candidate: {
        name: "Budi Santoso",
        email: "budi.santoso@email.com",
        disability: "Tuna Daksa",
        location: "Surabaya",
        phone: "08111222333", 
        joinedDate: "2023-07-10"
      },
      job: "Content Writer",
      appliedDate: "2024-01-13",
      status: "interview",
      match: 82,
      skills: ["Content Writing", "SEO", "Copywriting", "Research", "Social Media"],
      resume: "budi-santoso-resume.pdf",
      coverLetter: "Saya memiliki passion dalam menulis konten yang engaging dan accessible. Dengan latar belakang jurnalistik dan pengalaman menulis untuk berbagai platform...",
      accommodations: ["Wheelchair Access", "Ergonomic Setup", "Flexible Schedule"],
      portfolio: "https://budisantoso.writer.com",
      education: "Sarjana Ilmu Komunikasi - Universitas Airlangga"
    },
    {
      id: 4,
      candidate: {
        name: "Maya Indah",
        email: "maya.indah@email.com",
        disability: "Autisme",
        location: "Jakarta",
        phone: "08144555666",
        joinedDate: "2023-10-05"
      },
      job: "Data Analyst", 
      appliedDate: "2024-01-12",
      status: "accepted",
      match: 91,
      skills: ["Python", "SQL", "Data Visualization", "Statistics", "Machine Learning"],
      resume: "maya-indah-resume.pdf",
      coverLetter: "Analisis data adalah passion saya. Saya memiliki keahlian dalam mengolah data kompleks dan menyajikan insights yang actionable. Pattern recognition adalah salah satu kekuatan saya...",
      accommodations: ["Structured Environment", "Clear Instructions", "Quiet Workspace"],
      portfolio: "https://mayaindah-analytics.netlify.app",
      education: "Sarjana Statistika - Institut Teknologi Bandung"
    },
    {
      id: 5,
      candidate: {
        name: "Rina Wijaya", 
        email: "rina.wijaya@email.com",
        disability: "Tuna Netra",
        location: "Yogyakarta",
        phone: "081667778888",
        joinedDate: "2023-11-15"
      },
      job: "Customer Service",
      appliedDate: "2024-01-11", 
      status: "rejected",
      match: 76,
      skills: ["Communication", "Problem Solving", "Empathy", "Active Listening", "CRM"],
      resume: "rina-wijaya-resume.pdf",
      coverLetter: "Saya sangat antusias dengan posisi Customer Service. Dengan kemampuan komunikasi yang baik dan empati yang tinggi, saya yakin dapat memberikan pelayanan terbaik kepada pelanggan...",
      accommodations: ["Screen Reader", "Audio-based Training", "Voice Control Software"],
      portfolio: null,
      education: "Diploma Manajemen - Universitas Gadjah Mada"
    }
  ];

  // Filter applications based on status and search term
  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = app.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.job.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Application statistics
  const applicationStats = {
    total: applications.length,
    new: applications.filter(app => app.status === 'new').length,
    reviewed: applications.filter(app => app.status === 'reviewed').length,
    interview: applications.filter(app => app.status === 'interview').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      new: 'bg-blue-100 text-blue-800',
      reviewed: 'bg-yellow-100 text-yellow-800',
      interview: 'bg-purple-100 text-purple-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      new: 'Baru',
      reviewed: 'Ditinjau', 
      interview: 'Interview',
      accepted: 'Diterima',
      rejected: 'Ditolak'
    };
    return statusMap[status] || status;
  };

  const handleStatusChange = (applicationId, newStatus) => {
    // In real app, this would be API call
    console.log(`Changed application ${applicationId} to ${newStatus}`);
    // Update local state or make API call
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const handleBulkAction = (action) => {
    if (selectedApplications.length === 0) {
      alert('Pilih lamaran terlebih dahulu');
      return;
    }
    console.log(`Bulk ${action} for:`, selectedApplications);
    // Implement bulk action logic
  };

  const toggleApplicationSelection = (applicationId) => {
    setSelectedApplications(prev => 
      prev.includes(applicationId) 
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const selectAllApplications = () => {
    setSelectedApplications(filteredApplications.map(app => app.id));
  };

  const clearSelection = () => {
    setSelectedApplications([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Lamaran</h1>
              <p className="text-gray-600">Review dan kelola semua lamaran yang masuk</p>
            </div>
            <Link 
              to="/employer/dashboard"
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
            >
              <i className="fas fa-arrow-left"></i>
              Kembali ke Dashboard
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-gray-900">{applicationStats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{applicationStats.new}</div>
              <div className="text-sm text-gray-600">Baru</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-yellow-600">{applicationStats.reviewed}</div>
              <div className="text-sm text-gray-600">Ditinjau</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{applicationStats.interview}</div>
              <div className="text-sm text-gray-600">Interview</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-green-600">{applicationStats.accepted}</div>
              <div className="text-sm text-gray-600">Diterima</div>
            </div>
          </div>
        </div>

        {/* Filters and Bulk Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Cari kandidat atau posisi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full lg:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Bulk Actions */}
            <div className="flex gap-2 w-full lg:w-auto">
              <select 
                onChange={(e) => handleBulkAction(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm flex-1 lg:flex-none"
              >
                <option value="">Aksi Massal</option>
                <option value="move-to-reviewed">Pindah ke Ditinjau</option>
                <option value="invite-interview">Undang Interview</option>
                <option value="reject">Tolak Lamaran</option>
              </select>
              <button 
                onClick={selectAllApplications}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition text-sm"
              >
                Pilih Semua
              </button>
              <button 
                onClick={clearSelection}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
              >
                Hapus Pilihan
              </button>
            </div>
          </div>

          {/* Status Filters */}
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
              Baru ({applicationStats.new})
            </button>
            <button 
              onClick={() => setFilter('reviewed')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'reviewed' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Ditinjau ({applicationStats.reviewed})
            </button>
            <button 
              onClick={() => setFilter('interview')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'interview' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Interview ({applicationStats.interview})
            </button>
            <button 
              onClick={() => setFilter('accepted')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'accepted' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Diterima ({applicationStats.accepted})
            </button>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-file-alt text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-500">Tidak ada lamaran yang sesuai dengan filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                      <input 
                        type="checkbox" 
                        checked={selectedApplications.length === filteredApplications.length}
                        onChange={selectAllApplications}
                        className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </th>
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
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          checked={selectedApplications.includes(app.id)}
                          onChange={() => toggleApplicationSelection(app.id)}
                          className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                            {app.candidate.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{app.candidate.name}</div>
                            <div className="text-sm text-gray-500">{app.candidate.disability}</div>
                            <div className="text-xs text-gray-400">{app.candidate.location}</div>
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
                            getStatusBadgeClass(app.status)
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
                        <button 
                          onClick={() => handleViewDetails(app)}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                        >
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
          )}
        </div>

        {/* Selected Applications Counter */}
        {selectedApplications.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-primary-500 text-white px-4 py-2 rounded-lg shadow-lg">
            {selectedApplications.length} lamaran terpilih
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {isModalOpen && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Detail Lamaran</h3>
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Candidate Info */}
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {selectedApplication.candidate.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-900">{selectedApplication.candidate.name}</h4>
                    <p className="text-primary-600 font-medium">{selectedApplication.candidate.disability}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                      <div><span className="text-gray-600">Email:</span> {selectedApplication.candidate.email}</div>
                      <div><span className="text-gray-600">Telepon:</span> {selectedApplication.candidate.phone}</div>
                      <div><span className="text-gray-600">Lokasi:</span> {selectedApplication.candidate.location}</div>
                      <div><span className="text-gray-600">Bergabung:</span> {selectedApplication.candidate.joinedDate}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedApplication.match}% Match
                    </span>
                  </div>
                </div>

                {/* Application Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Posisi Dilamar</label>
                      <p className="font-medium text-lg">{selectedApplication.job}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Tanggal Lamar</label>
                      <p className="font-medium">{selectedApplication.appliedDate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <select 
                        value={selectedApplication.status}
                        onChange={(e) => handleStatusChange(selectedApplication.id, e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="new">Baru</option>
                        <option value="reviewed">Ditinjau</option>
                        <option value="interview">Interview</option>
                        <option value="accepted">Diterima</option>
                        <option value="rejected">Ditolak</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Pendidikan</label>
                      <p className="font-medium">{selectedApplication.education}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Portfolio</label>
                      {selectedApplication.portfolio ? (
                        <a href={selectedApplication.portfolio} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium">
                          Lihat Portfolio
                        </a>
                      ) : (
                        <p className="text-gray-500">Tidak tersedia</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Resume</label>
                      <button className="text-primary-600 hover:text-primary-700 font-medium">
                        <i className="fas fa-download mr-1"></i>
                        Download CV
                      </button>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Keahlian</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Accommodations */}
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Kebutuhan Aksesibilitas</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.accommodations.map((acc, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        <i className="fas fa-check mr-1"></i>
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Surat Lamaran</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">{selectedApplication.coverLetter}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t">
                  <button className="flex-1 bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition font-medium">
                    <i className="fas fa-calendar-check mr-2"></i>
                    Jadwalkan Interview
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium">
                    <i className="fas fa-download mr-2"></i>
                    Download Dokumen
                  </button>
                  <button className="flex-1 border border-red-300 text-red-600 py-3 rounded-lg hover:bg-red-50 transition font-medium">
                    <i className="fas fa-times mr-2"></i>
                    Tolak Lamaran
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationManagementPage;