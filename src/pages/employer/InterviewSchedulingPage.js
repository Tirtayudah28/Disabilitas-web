// src/pages/employer/InterviewSchedulingPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const InterviewSchedulingPage = () => {
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [filter, setFilter] = useState('upcoming');
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock interviews data
  const interviews = [
    {
      id: 1,
      candidate: {
        id: 1,
        name: "Ahmad Surya",
        position: "UI/UX Designer",
        disability: "Tuna Netra",
        email: "ahmad.surya@email.com",
        phone: "08123456789",
        avatar: "AS"
      },
      job: {
        id: 1,
        title: "UI/UX Designer",
        department: "Product & Design"
      },
      date: "2024-01-20",
      time: "14:00",
      endTime: "15:00",
      duration: "60 menit",
      type: "online", // online, onsite, phone
      status: "scheduled", // scheduled, confirmed, completed, cancelled, rescheduled
      interviewer: "Sarah Manager",
      meetingLink: "https://meet.google.com/abc-def-ghi",
      location: "Google Meet",
      notes: "Focus on accessibility experience and portfolio review. Please ensure all materials are screen reader compatible.",
      accommodations: ["Screen Reader Support", "Audio Description", "Extended Time"],
      reminderSent: true,
      createdAt: "2024-01-15",
      candidateConfirmed: false
    },
    {
      id: 2,
      candidate: {
        id: 2,
        name: "Sari Dewi", 
        position: "Frontend Developer",
        disability: "Tuna Rungu",
        email: "sari.dewi@email.com",
        phone: "08129876543",
        avatar: "SD"
      },
      job: {
        id: 2,
        title: "Frontend Developer",
        department: "Engineering"
      },
      date: "2024-01-22",
      time: "10:00",
      endTime: "11:30",
      duration: "90 menit",
      type: "onsite",
      status: "confirmed",
      interviewer: "Tech Lead Team",
      location: "Office Meeting Room A - Lantai 3",
      notes: "Technical interview + coding test. Please provide sign language interpreter and written materials.",
      accommodations: ["Sign Language Interpreter", "Written Materials", "Visual Alerts"],
      reminderSent: true,
      createdAt: "2024-01-16",
      candidateConfirmed: true
    },
    {
      id: 3,
      candidate: {
        id: 3,
        name: "Budi Santoso",
        position: "Content Writer",
        disability: "Tuna Daksa", 
        email: "budi.santoso@email.com",
        phone: "08111222333",
        avatar: "BS"
      },
      job: {
        id: 3,
        title: "Content Writer",
        department: "Marketing"
      },
      date: "2024-01-25",
      time: "13:30",
      endTime: "14:15",
      duration: "45 menit",
      type: "online",
      status: "scheduled",
      interviewer: "Content Manager",
      meetingLink: "https://meet.google.com/xyz-uvw-rst",
      location: "Google Meet",
      notes: "Discuss writing samples and content strategy. Candidate may need breaks during session.",
      accommodations: ["Extended Time", "Breaks as Needed", "Ergonomic Setup"],
      reminderSent: false,
      createdAt: "2024-01-18",
      candidateConfirmed: false
    },
    {
      id: 4,
      candidate: {
        id: 4,
        name: "Maya Indah",
        position: "Data Analyst",
        disability: "Autisme",
        email: "maya.indah@email.com",
        phone: "08144555666",
        avatar: "MI"
      },
      job: {
        id: 4,
        title: "Data Analyst", 
        department: "Data Science"
      },
      date: "2024-01-19",
      time: "09:00",
      endTime: "10:00",
      duration: "60 menit",
      type: "phone",
      status: "completed",
      interviewer: "Data Team Lead",
      location: "Phone Call",
      notes: "Discuss analytical projects and problem-solving approach. Provide clear structure for questions.",
      accommodations: ["Structured Questions", "Clear Instructions", "Quiet Environment"],
      reminderSent: true,
      createdAt: "2024-01-12",
      candidateConfirmed: true,
      feedback: "Excellent analytical skills. Strong pattern recognition. Good cultural fit."
    },
    {
      id: 5,
      candidate: {
        id: 5,
        name: "Rina Wijaya",
        position: "Customer Service",
        disability: "Tuna Netra",
        email: "rina.wijaya@email.com",
        phone: "081667778888",
        avatar: "RW"
      },
      job: {
        id: 5,
        title: "Customer Service",
        department: "Operations"
      },
      date: "2024-01-26",
      time: "11:00", 
      endTime: "12:00",
      duration: "60 menit",
      type: "online",
      status: "rescheduled",
      interviewer: "Customer Service Manager",
      meetingLink: "https://meet.google.com/mno-pqr-stu",
      location: "Google Meet",
      notes: "Rescheduled from original date. Focus on communication skills and scenario handling.",
      accommodations: ["Screen Reader Support", "Audio-based Materials"],
      reminderSent: false,
      createdAt: "2024-01-14",
      candidateConfirmed: true,
      rescheduleReason: "Candidate requested different time slot"
    }
  ];

  // Filter interviews based on status
  const filteredInterviews = interviews.filter(interview => {
    if (filter === 'upcoming') {
      return ['scheduled', 'confirmed', 'rescheduled'].includes(interview.status);
    } else if (filter === 'completed') {
      return interview.status === 'completed';
    } else if (filter === 'cancelled') {
      return interview.status === 'cancelled';
    }
    return true;
  });

  // Interview statistics
  const interviewStats = {
    total: interviews.length,
    upcoming: interviews.filter(i => ['scheduled', 'confirmed', 'rescheduled'].includes(i.status)).length,
    completed: interviews.filter(i => i.status === 'completed').length,
    cancelled: interviews.filter(i => i.status === 'cancelled').length
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      scheduled: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      rescheduled: 'bg-yellow-100 text-yellow-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      scheduled: 'Terjadwal',
      confirmed: 'Dikonfirmasi',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
      rescheduled: 'Dijadwal Ulang'
    };
    return statusMap[status] || status;
  };

  const getTypeBadgeClass = (type) => {
    const typeMap = {
      online: 'bg-purple-100 text-purple-800',
      onsite: 'bg-green-100 text-green-800',
      phone: 'bg-orange-100 text-orange-800'
    };
    return typeMap[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type) => {
    const typeMap = {
      online: 'Online',
      onsite: 'On-site',
      phone: 'Telepon'
    };
    return typeMap[type] || type;
  };

  const handleViewDetails = (interview) => {
    setSelectedInterview(interview);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInterview(null);
  };

  const handleSendReminder = (interviewId) => {
    console.log(`Send reminder for interview ${interviewId}`);
    // Implement reminder logic
  };

  const handleReschedule = (interviewId) => {
    console.log(`Reschedule interview ${interviewId}`);
    // Implement reschedule logic
  };

  const handleCancel = (interviewId) => {
    console.log(`Cancel interview ${interviewId}`);
    // Implement cancel logic
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <main id="main-content" className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-700 mb-2">Jadwal Interview</h1>
            <p className="text-gray-600">
              Kelola dan jadwalkan sesi interview dengan kandidat
            </p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <button className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition font-medium flex items-center gap-2">
              <i className="fas fa-plus"></i>
              Buat Jadwal Baru
            </button>
            <Link 
              to="/employer/dashboard"
              className="border border-primary-500 text-primary-500 px-4 py-3 rounded-lg hover:bg-primary-50 transition flex items-center gap-2"
            >
              <i className="fas fa-arrow-left"></i>
              Kembali
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{interviewStats.total}</div>
            <div className="text-sm text-gray-600">Total Interview</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{interviewStats.upcoming}</div>
            <div className="text-sm text-gray-600">Mendatang</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">{interviewStats.completed}</div>
            <div className="text-sm text-gray-600">Selesai</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-red-600">{interviewStats.cancelled}</div>
            <div className="text-sm text-gray-600">Dibatalkan</div>
          </div>
        </div>

        {/* View Toggle and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg transition ${
                  view === 'list' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className="fas fa-list mr-2"></i>
                List View
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-4 py-2 rounded-lg transition ${
                  view === 'calendar' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className="fas fa-calendar mr-2"></i>
                Calendar View
              </button>
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
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === 'upcoming' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Mendatang
              </button>
              <button 
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === 'completed' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Selesai
              </button>
            </div>

            {/* Date Filter */}
            <div>
              <input
                type="date"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Interviews List */}
        {view === 'list' && (
          <div className="space-y-4">
            {filteredInterviews.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <i className="fas fa-calendar-times text-4xl text-gray-400 mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada jadwal interview</h3>
                <p className="text-gray-500 mb-6">Tidak ada jadwal interview yang sesuai dengan filter yang dipilih.</p>
                <button className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition font-medium">
                  <i className="fas fa-plus mr-2"></i>
                  Buat Jadwal Pertama
                </button>
              </div>
            ) : (
              filteredInterviews.map(interview => (
                <div key={interview.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Interview Info */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                            {interview.candidate.avatar}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{interview.candidate.name}</h3>
                            <p className="text-primary-600">{interview.candidate.position}</p>
                            <p className="text-sm text-gray-500">{interview.candidate.disability}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end gap-2">
                          <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(interview.status)}`}>
                              {getStatusLabel(interview.status)}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeClass(interview.type)}`}>
                              {getTypeLabel(interview.type)}
                            </span>
                          </div>
                          {interview.candidateConfirmed && (
                            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                              <i className="fas fa-check-circle"></i>
                              Dikonfirmasi Kandidat
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Interview Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <label className="text-sm text-gray-500">Posisi</label>
                          <p className="font-medium">{interview.job.title}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">Tanggal & Waktu</label>
                          <p className="font-medium">
                            {formatDate(interview.date)}<br />
                            {interview.time} - {interview.endTime} ({interview.duration})
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">Interviewer</label>
                          <p className="font-medium">{interview.interviewer}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">Lokasi/Tautan</label>
                          {interview.type === 'online' ? (
                            <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium">
                              Join Meeting
                            </a>
                          ) : (
                            <p className="font-medium">{interview.location}</p>
                          )}
                        </div>
                      </div>

                      {/* Accommodations */}
                      {interview.accommodations.length > 0 && (
                        <div className="mb-4">
                          <label className="text-sm text-gray-500 mb-2 block">Kebutuhan Aksesibilitas</label>
                          <div className="flex flex-wrap gap-2">
                            {interview.accommodations.map((acc, index) => (
                              <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                <i className="fas fa-check mr-1"></i>
                                {acc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {interview.notes && (
                        <div>
                          <label className="text-sm text-gray-500 mb-2 block">Catatan</label>
                          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                            {interview.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:w-48">
                      <button 
                        onClick={() => handleViewDetails(interview)}
                        className="bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition font-medium text-sm"
                      >
                        <i className="fas fa-eye mr-2"></i>
                        Lihat Detail
                      </button>
                      
                      {interview.status === 'scheduled' && !interview.reminderSent && (
                        <button 
                          onClick={() => handleSendReminder(interview.id)}
                          className="border border-blue-300 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition font-medium text-sm"
                        >
                          <i className="fas fa-bell mr-2"></i>
                          Kirim Pengingat
                        </button>
                      )}
                      
                      {['scheduled', 'confirmed'].includes(interview.status) && (
                        <button 
                          onClick={() => handleReschedule(interview.id)}
                          className="border border-yellow-300 text-yellow-600 py-2 px-4 rounded-lg hover:bg-yellow-50 transition font-medium text-sm"
                        >
                          <i className="fas fa-calendar-alt mr-2"></i>
                          Jadwal Ulang
                        </button>
                      )}
                      
                      {['scheduled', 'confirmed'].includes(interview.status) && (
                        <button 
                          onClick={() => handleCancel(interview.id)}
                          className="border border-red-300 text-red-600 py-2 px-4 rounded-lg hover:bg-red-50 transition font-medium text-sm"
                        >
                          <i className="fas fa-times mr-2"></i>
                          Batalkan
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Calendar View */}
        {view === 'calendar' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-center py-12">
              <i className="fas fa-calendar text-4xl text-primary-500 mb-4"></i>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Calendar View</h3>
              <p className="text-gray-600 mb-6">Fitur calendar view akan segera hadir.</p>
              <button 
                onClick={() => setView('list')}
                className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition font-medium"
              >
                Kembali ke List View
              </button>
            </div>
          </div>
        )}

        {/* Interview Detail Modal */}
        {isModalOpen && selectedInterview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Detail Interview</h3>
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
                      {selectedInterview.candidate.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900">{selectedInterview.candidate.name}</h4>
                      <p className="text-primary-600 font-medium">{selectedInterview.candidate.position}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                        <div><span className="text-gray-600">Email:</span> {selectedInterview.candidate.email}</div>
                        <div><span className="text-gray-600">Telepon:</span> {selectedInterview.candidate.phone}</div>
                        <div><span className="text-gray-600">Disabilitas:</span> {selectedInterview.candidate.disability}</div>
                        <div><span className="text-gray-600">Status:</span> 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedInterview.status)}`}>
                            {getStatusLabel(selectedInterview.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interview Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Posisi Dilamar</label>
                        <p className="font-medium text-lg">{selectedInterview.job.title}</p>
                        <p className="text-gray-600">{selectedInterview.job.department}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Interviewer</label>
                        <p className="font-medium">{selectedInterview.interviewer}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Tipe Interview</label>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeBadgeClass(selectedInterview.type)}`}>
                          {getTypeLabel(selectedInterview.type)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Tanggal</label>
                        <p className="font-medium">{formatDate(selectedInterview.date)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Waktu</label>
                        <p className="font-medium">{selectedInterview.time} - {selectedInterview.endTime} ({selectedInterview.duration})</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Lokasi</label>
                        {selectedInterview.type === 'online' ? (
                          <a href={selectedInterview.meetingLink} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium block">
                            {selectedInterview.location}
                          </a>
                        ) : (
                          <p className="font-medium">{selectedInterview.location}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Accommodations */}
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Kebutuhan Aksesibilitas</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedInterview.accommodations.map((acc, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          <i className="fas fa-check mr-1"></i>
                          {acc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Catatan Interview</label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">{selectedInterview.notes}</p>
                    </div>
                  </div>

                  {/* Feedback (for completed interviews) */}
                  {selectedInterview.status === 'completed' && selectedInterview.feedback && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Feedback Interview</label>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">{selectedInterview.feedback}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-6 border-t">
                    {selectedInterview.type === 'online' && (
                      <a 
                        href={selectedInterview.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition font-medium text-center"
                      >
                        <i className="fas fa-video mr-2"></i>
                        Join Meeting
                      </a>
                    )}
                    <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium">
                      <i className="fas fa-edit mr-2"></i>
                      Edit Jadwal
                    </button>
                    <button className="flex-1 border border-red-300 text-red-600 py-3 rounded-lg hover:bg-red-50 transition font-medium">
                      <i className="fas fa-times mr-2"></i>
                      Batalkan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default InterviewSchedulingPage;