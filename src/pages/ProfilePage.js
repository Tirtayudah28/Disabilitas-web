// src/pages/ProfilePage.js - VERSI FIXED
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('data-diri');
  const [skills, setSkills] = useState([
    'UI/UX Design',
    'Figma',
    'Adobe XD',
    'User Research'
  ]);
  const [newSkill, setNewSkill] = useState('');
  const [profileData, setProfileData] = useState({
    nama: 'Ahmad Surya',
    email: 'ahmad.surya@email.com',
    telepon: '08123456789',
    lokasi: 'jakarta',
    tentang: 'Saya adalah UI/UX Designer dengan pengalaman 3 tahun di industri teknologi. Sebagai penyandang disabilitas tuna netra, saya memiliki keahlian dalam membuat desain yang inklusif dan accessible untuk semua pengguna.',
    linkedin: '',
    website: '',
    disabilitas: ['tuna-netra'],
    kebutuhan: 'Saya membutuhkan screen reader yang kompatibel dengan software desain, serta dokumen dalam format accessible (tagged PDF, proper heading structure).',
    akomodasi: ['screen-reader', 'interpreter', 'fleksibel'],
    jenisPekerjaan: ['full-time', 'remote'],
    gaji: '8-12',
    industri: ['tech', 'education']
  });

  // Data untuk semua tab
  const [experiences] = useState([
    {
      id: 1,
      position: 'UI/UX Designer',
      company: 'PT Tech Inklusif',
      location: 'Jakarta',
      startDate: '2022-01',
      endDate: 'present',
      description: 'Membuat desain interface yang accessible untuk aplikasi mobile dan web. Bekerja dalam tim agile dengan developer dan product manager.',
      skills: ['Figma', 'User Research', 'Accessibility']
    }
  ]);

  const [educations] = useState([
    {
      id: 1,
      degree: 'Sarjana Desain Komunikasi Visual',
      institution: 'Universitas Indonesia',
      location: 'Jakarta',
      startDate: '2016',
      endDate: '2020',
      description: 'IPK: 3.75. Fokus pada desain interface dan pengalaman pengguna. Aktif di organisasi mahasiswa disabilitas.'
    }
  ]);

  const [portfolioItems] = useState([
    {
      id: 1,
      title: 'Redesign Aplikasi Banking',
      type: 'image',
      description: 'Redesign interface mobile banking dengan fokus accessibility untuk pengguna tuna netra.',
      date: '2 minggu lalu'
    }
  ]);

  const tabs = [
    { id: 'data-diri', label: 'Data Diri', icon: 'user-circle' },
    { id: 'disabilitas', label: 'Jenis Disabilitas', icon: 'universal-access' },
    { id: 'keahlian', label: 'Keahlian', icon: 'tools' },
    { id: 'pengalaman', label: 'Pengalaman', icon: 'briefcase' },
    { id: 'pendidikan', label: 'Pendidikan', icon: 'graduation-cap' },
    { id: 'portofolio', label: 'Portofolio', icon: 'folder-open' },
    { id: 'preferensi', label: 'Preferensi Kerja', icon: 'sliders-h' }
  ];

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field, value) => {
    setProfileData(prev => {
      const currentValues = prev[field] || [];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [field]: currentValues.filter(v => v !== value)
        };
      } else {
        return {
          ...prev,
          [field]: [...currentValues, value]
        };
      }
    });
  };

  const handleSave = () => {
    showNotification('Perubahan berhasil disimpan!', 'success');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center -mt-16">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg">
                  <div className="w-full h-full bg-gradient-to-r from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    AS
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition">
                  <i className="fas fa-camera text-gray-600"></i>
                </button>
              </div>
              
              <div className="md:ml-6 mt-4 md:mt-0 flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{profileData.nama}</h1>
                    <p className="text-lg text-gray-600">UI/UX Designer</p>
                    <div className="flex items-center mt-2 text-gray-500">
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      <span>Jakarta, Indonesia</span>
                      <span className="mx-2">•</span>
                      <i className="fas fa-clock mr-2"></i>
                      <span>Member sejak 2023</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-4 md:mt-0">
                    <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition flex items-center gap-2">
                      <i className="fas fa-eye"></i> Pratinjau Profil
                    </button>
                    <button className="border border-primary-500 text-primary-500 px-4 py-2 rounded-lg hover:bg-primary-50 transition flex items-center gap-2">
                      <i className="fas fa-share-alt"></i> Bagikan
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Profile Completion */}
            <div className="mt-6 bg-primary-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Kelengkapan Profil</span>
                <span className="font-bold text-primary-600">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full progress-bar" style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Lengkapi profil Anda untuk meningkatkan peluang diterima kerja</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
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
              
              <div className="border-t my-4 pt-4">
                <Link to="/resume" className="flex items-center gap-3 text-primary-600 hover:text-primary-700 font-medium">
                  <i className="fas fa-file-pdf"></i>
                  <span>Lihat Resume Saya</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* === DATA DIRI TAB === */}
            {activeTab === 'data-diri' && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Data Diri</h2>
                  <button 
                    onClick={handleSave}
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition"
                  >
                    <i className="fas fa-save mr-2"></i>Simpan Perubahan
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nama Lengkap *</label>
                    <input 
                      type="text" 
                      value={profileData.nama}
                      onChange={(e) => handleInputChange('nama', e.target.value)}
                      className="w-full p-3 border rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full p-3 border rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Nomor Telepon</label>
                    <input 
                      type="tel" 
                      value={profileData.telepon}
                      onChange={(e) => handleInputChange('telepon', e.target.value)}
                      className="w-full p-3 border rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Lokasi *</label>
                    <select 
                      value={profileData.lokasi}
                      onChange={(e) => handleInputChange('lokasi', e.target.value)}
                      className="w-full p-3 border rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200" 
                      required
                    >
                      <option value="jakarta">Jakarta</option>
                      <option value="bandung">Bandung</option>
                      <option value="surabaya">Surabaya</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Tentang Saya *</label>
                    <textarea 
                      value={profileData.tentang}
                      onChange={(e) => handleInputChange('tentang', e.target.value)}
                      className="w-full p-3 border rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200" 
                      rows="4" 
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* === JENIS DISABILITAS TAB === */}
            {activeTab === 'disabilitas' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Jenis Disabilitas & Kebutuhan Aksesibilitas</h2>
                  <button 
                    onClick={handleSave}
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition"
                  >
                    <i className="fas fa-save mr-2"></i>Simpan Perubahan
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Jenis Disabilitas *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {['Tuna Netra', 'Tuna Rungu', 'Tuna Daksa', 'Autisme'].map(type => (
                        <label key={type} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input type="checkbox" className="mr-3 h-5 w-5 text-primary-500" />
                          <div>
                            <span className="font-medium">{type}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* === KEAHLIAN TAB === */}
            {activeTab === 'keahlian' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Keahlian & Keterampilan</h2>
                  <button 
                    onClick={handleSave}
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition"
                  >
                    <i className="fas fa-save mr-2"></i>Simpan Perubahan
                  </button>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Tambahkan Keahlian</label>
                  <div className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                      className="flex-1 p-3 border rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200" 
                      placeholder="Contoh: UI Design, JavaScript, Project Management" 
                    />
                    <button 
                      type="button" 
                      onClick={handleAddSkill}
                      className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition"
                    >
                      <i className="fas fa-plus mr-2"></i>Tambah
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span key={index} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        {skill}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-primary-600 hover:text-primary-800 ml-1"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* === PENGALAMAN TAB === */}
            {activeTab === 'pengalaman' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Pengalaman Kerja</h2>
                  <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition">
                    <i className="fas fa-plus mr-2"></i>Tambah Pengalaman
                  </button>
                </div>
                
                <div className="space-y-6">
                  {experiences.map(exp => (
                    <div key={exp.id} className="p-4 border rounded-lg hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{exp.position}</h3>
                          <p className="text-primary-600">{exp.company} • {exp.location}</p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* === PENDIDIKAN TAB === */}
            {activeTab === 'pendidikan' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Pendidikan</h2>
                  <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition">
                    <i className="fas fa-plus mr-2"></i>Tambah Pendidikan
                  </button>
                </div>
                
                <div className="space-y-6">
                  {educations.map(edu => (
                    <div key={edu.id} className="p-4 border rounded-lg hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{edu.degree}</h3>
                          <p className="text-primary-600">{edu.institution} • {edu.location}</p>
                        </div>
                        <span className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</span>
                      </div>
                      <p className="text-gray-600">{edu.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* === PORTOFOLIO TAB === */}
            {activeTab === 'portofolio' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Portofolio & Karya</h2>
                  <div className="flex gap-2">
                    <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition">
                      <i className="fas fa-upload mr-2"></i>Unggah File
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolioItems.map(item => (
                    <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-center mb-2">
                        <i className="fas fa-file-image text-primary-500 text-xl mr-2"></i>
                        <h4 className="font-bold">{item.title}</h4>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* === PREFERENSI KERJA TAB === */}
            {activeTab === 'preferensi' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Preferensi Kerja</h2>
                  <button 
                    onClick={handleSave}
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition"
                  >
                    <i className="fas fa-save mr-2"></i>Simpan Perubahan
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Jenis Pekerjaan yang Diinginkan *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {['Full Time', 'Part Time', 'Remote', 'Freelance'].map(jenis => (
                        <label key={jenis} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input type="checkbox" className="mr-3 h-5 w-5 text-primary-500" />
                          <span>{jenis}</span>
                        </label>
                      ))}
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

export default ProfilePage;