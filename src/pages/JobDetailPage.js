// src/pages/JobDetailPage.js
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isApplying, setIsApplying] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Mock data - in real app, this would come from API
  const job = {
    id: 1,
    title: "UI/UX Designer",
    company: "PT Tech Inklusif",
    location: "Jakarta • Remote",
    type: "Full Time",
    salary: "Rp 8-12 juta",
    posted: "2 jam lalu",
    match: 95,
    skills: ["Figma", "User Research", "Prototyping", "Accessibility", "Wireframing", "UI Design"],
    accommodations: ["Screen Reader Support", "Remote Work", "Flexible Hours", "Assistive Technology"],
    disabilitySupport: ["Tuna Netra", "Tuna Rungu", "Tuna Daksa"],
    description: "Kami mencari UI/UX Designer yang passionate tentang inklusivitas dan aksesibilitas. Bergabunglah dengan tim kami yang berdedikasi menciptakan produk digital yang accessible untuk semua.",
    fullDescription: `
      <p>Sebagai UI/UX Designer di PT Tech Inklusif, Anda akan bertanggung jawab untuk:</p>
      <ul>
        <li>Mendesain interface yang accessible untuk aplikasi mobile dan web</li>
        <li>Melakukan user research dengan peserta dari berbagai latar belakang disabilitas</li>
        <li>Berkolaborasi dengan developer untuk implementasi desain yang optimal</li>
        <li>Membuat prototype dan melakukan usability testing</li>
        <li>Memastikan semua desain memenuhi standar WCAG 2.1 AA</li>
      </ul>
      
      <p><strong>Kenapa bergabung dengan kami?</strong></p>
      <p>Kami adalah perusahaan teknologi yang berfokus pada inklusivitas. 40% tim kami adalah penyandang disabilitas, dan kami memiliki budaya kerja yang sangat supportive.</p>
    `,
    requirements: [
      "Pengalaman 2+ tahun sebagai UI/UX Designer",
      "Memahami prinsip desain inklusif dan aksesibilitas",
      "Mahir menggunakan Figma, Adobe XD, atau tools desain lainnya",
      "Pengalaman dengan user research dan usability testing",
      "Portofolio yang menunjukkan karya desain accessible"
    ],
    benefits: [
      "Asuransi kesehatan comprehensive",
      "Flexible working hours",
      "Remote work options", 
      "Training dan development budget",
      "Environment yang benar-benar inklusif",
      "Alat kerja yang disesuaikan dengan kebutuhan"
    ],
    companyInfo: {
      name: "PT Tech Inklusif",
      description: "Perusahaan teknologi yang berfokus pada pembuatan produk digital yang accessible untuk semua kalangan, termasuk penyandang disabilitas.",
      size: "51-200 employees",
      industry: "Technology",
      website: "https://techinklusif.com",
      founded: "2018",
      culture: "Inklusif, Supportive, Innovative"
    },
    applicants: 23,
    views: 156,
    logo: "TI",
    logoColor: "from-primary-500 to-secondary-500"
  };

  const handleApply = () => {
  // Navigasi ke halaman application form
  navigate(`/application/${job.id}`, { state: { job } });
};

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    showNotification(
      isBookmarked ? "Lowongan dihapus dari favorit" : "Lowongan disimpan ke favorit",
      'success'
    );
  };

  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-primary-500';
    
    notification.className = `fixed top-4 right-4 ${bgColor} text-white p-4 rounded-lg shadow-lg z-50`;
    notification.innerHTML = `
      <div class="flex items-center">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} mr-2"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  };

  // Similar jobs data
  const similarJobs = [
    {
      id: 2,
      title: "Product Designer",
      company: "Startup Inklusif",
      location: "Remote • Full Time",
      salary: "Rp 9-13 juta",
      match: 88,
      logo: "SI",
      logoColor: "from-blue-500 to-green-500"
    },
    {
      id: 3,
      title: "UX Researcher",
      company: "Research Lab",
      location: "Bandung • Hybrid",
      salary: "Rp 7-10 juta", 
      match: 82,
      logo: "RL",
      logoColor: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-primary-600">Beranda</Link>
          <i className="fas fa-chevron-right text-xs"></i>
          <Link to="/lowongan" className="hover:text-primary-600">Lowongan</Link>
          <i className="fas fa-chevron-right text-xs"></i>
          <span className="text-primary-600">{job.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Job Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-20 h-20 bg-gradient-to-br ${job.logoColor} rounded-xl flex items-center justify-center text-white font-bold text-2xl`}>
                    {job.logo}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                    <p className="text-xl text-primary-600 font-medium mb-3">{job.company}</p>
                    <div className="flex flex-wrap gap-4 text-gray-600">
                      <span className="flex items-center gap-2">
                        <i className="fas fa-map-marker-alt"></i>
                        {job.location}
                      </span>
                      <span className="flex items-center gap-2">
                        <i className="fas fa-clock"></i>
                        {job.type}
                      </span>
                      <span className="flex items-center gap-2">
                        <i className="fas fa-money-bill-wave"></i>
                        {job.salary}
                      </span>
                      <span className="flex items-center gap-2">
                        <i className="fas fa-calendar"></i>
                        {job.posted}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Match Badge */}
                <div className="text-right">
                  <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg font-bold text-lg mb-2">
                    <i className="fas fa-bolt mr-1"></i>
                    {job.match}% Match
                  </div>
                  <p className="text-sm text-gray-600">Sangat sesuai dengan profil Anda</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={handleApply}
                  disabled={isApplying}
                  className="flex-1 bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition font-medium disabled:bg-primary-300 flex items-center justify-center gap-2"
                >
                  {isApplying ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Mengirim Lamaran...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Lamar Sekarang
                    </>
                  )}
                </button>
                <button 
                  onClick={handleBookmark}
                  className={`px-6 py-3 border rounded-lg transition flex items-center gap-2 ${
                    isBookmarked 
                      ? 'border-primary-500 bg-primary-50 text-primary-600' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <i className={`${isBookmarked ? 'fas' : 'far'} fa-bookmark`}></i>
                  {isBookmarked ? 'Disimpan' : 'Simpan'}
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <i className="fas fa-share-alt"></i>
                </button>
              </div>
            </div>

            {/* Job Details Tabs */}
            <div className="bg-white rounded-2xl shadow-lg">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {['Deskripsi', 'Persyaratan', 'Benefit', 'Perusahaan'].map((tab) => (
                    <button
                      key={tab}
                      className="flex-1 py-4 px-6 text-center border-b-2 border-transparent hover:text-primary-600 hover:border-primary-300 transition"
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Description Tab */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Deskripsi Pekerjaan</h3>
                  <div 
                    className="prose max-w-none text-gray-700 mb-6"
                    dangerouslySetInnerHTML={{ __html: job.fullDescription }}
                  />
                  
                  {/* Skills Required */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">Keahlian yang Dibutuhkan</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Accommodations */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <i className="fas fa-universal-access"></i>
                      Dukungan Aksesibilitas
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {job.accommodations.map((accommodation, index) => (
                        <div key={index} className="flex items-center gap-2 text-green-700">
                          <i className="fas fa-check-circle text-green-500"></i>
                          {accommodation}
                        </div>
                      ))}
                    </div>
                    <p className="text-green-600 mt-3 text-sm">
                      <strong>Didukung untuk:</strong> {job.disabilitySupport.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Requirements Tab would go here */}
                {/* Benefits Tab would go here */}
                {/* Company Tab would go here */}
              </div>
            </div>

            {/* Application Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h3 className="text-lg font-bold mb-4">Statistik Lowongan</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary-600">{job.applicants}</div>
                  <div className="text-sm text-gray-600">Pelamar</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{job.views}</div>
                  <div className="text-sm text-gray-600">Dilihat</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">5</div>
                  <div className="text-sm text-gray-600">Diwawancara</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-sm text-gray-600">Hari Lagi</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Company Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4">Tentang Perusahaan</h3>
              <div className="text-center mb-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${job.logoColor} rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto mb-3`}>
                  {job.logo}
                </div>
                <h4 className="font-bold text-gray-900">{job.companyInfo.name}</h4>
                <p className="text-sm text-gray-600">{job.companyInfo.size}</p>
              </div>
              <p className="text-gray-700 text-sm mb-4">{job.companyInfo.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Industri:</span>
                  <span className="font-medium">{job.companyInfo.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Berdiri:</span>
                  <span className="font-medium">{job.companyInfo.founded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Budaya:</span>
                  <span className="font-medium">{job.companyInfo.culture}</span>
                </div>
              </div>
              <button className="w-full mt-4 border border-primary-500 text-primary-500 py-2 rounded-lg hover:bg-primary-50 transition">
                Kunjungi Website
              </button>
            </div>

            {/* Similar Jobs */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4">Lowongan Serupa</h3>
              <div className="space-y-4">
                {similarJobs.map(similarJob => (
                  <div key={similarJob.id} className="border border-gray-200 rounded-lg p-3 hover:border-primary-500 transition">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-10 h-10 bg-gradient-to-br ${similarJob.logoColor} rounded flex items-center justify-center text-white font-bold text-sm`}>
                        {similarJob.logo}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{similarJob.title}</h4>
                        <p className="text-sm text-gray-600">{similarJob.company}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-primary-600 font-medium">{similarJob.salary}</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {similarJob.match}% match
                      </span>
                    </div>
                    <button className="w-full mt-2 text-primary-500 hover:text-primary-600 text-sm font-medium">
                      Lihat Detail →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Apply */}
            <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-2 text-primary-800">Lamar Cepat</h3>
              <p className="text-primary-700 text-sm mb-4">
                Gunakan profil Anda untuk melamar dengan satu klik
              </p>
              <button 
                onClick={handleApply}
                disabled={isApplying}
                className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition font-medium disabled:bg-primary-300 flex items-center justify-center gap-2"
              >
                {isApplying ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Memproses...
                  </>
                ) : (
                  <>
                    <i className="fas fa-bolt"></i>
                    Lamar Sekarang
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetailPage;