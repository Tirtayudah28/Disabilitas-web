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
                  <button onClick={handleSave} className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition">
                    <i className="fas fa-save mr-2"></i>Simpan Perubahan
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Jenis Disabilitas */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Jenis Disabilitas *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { value: 'tuna-netra', label: 'Tuna Netra', icon: 'eye' },
                        { value: 'tuna-rungu', label: 'Tuna Rungu', icon: 'deaf' },
                        { value: 'tuna-daksa', label: 'Tuna Daksa', icon: 'wheelchair' },
                        { value: 'autisme', label: 'Autisme', icon: 'brain' },
                        { value: 'tuna-grahita', label: 'Tuna Grahita', icon: 'user-friends' },
                        { value: 'disabilitas-lain', label: 'Disabilitas Lainnya', icon: 'universal-access' }
                      ].map(type => (
                        <label key={type.value} className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                          profileData.disabilitas.includes(type.value) 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={profileData.disabilitas.includes(type.value)}
                            onChange={() => handleCheckboxChange('disabilitas', type.value)}
                            className="mr-3 h-5 w-5 text-primary-500" 
                          />
                          <div className="flex items-center">
                            <i className={`fas fa-${type.icon} text-primary-500 mr-3 text-lg`}></i>
                            <div>
                              <span className="font-medium">{type.label}</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Kebutuhan Aksesibilitas */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Kebutuhan Aksesibilitas *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { value: 'screen-reader', label: 'Screen Reader Support', icon: 'assistive-listening-systems' },
                        { value: 'braille', label: 'Dokumen Braille', icon: 'braille' },
                        { value: 'interpreter', label: 'Interpreter Bahasa Isyarat', icon: 'sign-language' },
                        { value: 'wheelchair', label: 'Akses Kursi Roda', icon: 'wheelchair' },
                        { value: 'fleksibel', label: 'Jam Kerja Fleksibel', icon: 'clock' },
                        { value: 'remote', label: 'Opsi Remote Work', icon: 'laptop-house' },
                        { value: 'assistive-tech', label: 'Teknologi Assistive', icon: 'tools' },
                        { value: 'audio-desc', label: 'Audio Description', icon: 'audio-description' }
                      ].map(need => (
                        <label key={need.value} className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                          profileData.akomodasi.includes(need.value) 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={profileData.akomodasi.includes(need.value)}
                            onChange={() => handleCheckboxChange('akomodasi', need.value)}
                            className="mr-3 h-5 w-5 text-primary-500" 
                          />
                          <div className="flex items-center">
                            <i className={`fas fa-${need.icon} text-primary-500 mr-2`}></i>
                            <span className="text-sm">{need.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Deskripsi Kebutuhan */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Deskripsi Kebutuhan Spesifik</label>
                    <textarea 
                      value={profileData.kebutuhan}
                      onChange={(e) => handleInputChange('kebutuhan', e.target.value)}
                      className="w-full p-3 border rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200" 
                      rows="3"
                      placeholder="Jelaskan kebutuhan aksesibilitas spesifik Anda secara detail..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Informasi ini akan membantu perusahaan menyiapkan akomodasi yang tepat untuk Anda
                    </p>
                  </div>

                  {/* Level Kemandirian */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Level Kemandirian dalam Bekerja</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { value: 'mandiri', label: 'Mandiri', desc: 'Dapat bekerja tanpa bantuan khusus' },
                        { value: 'bantuan-minimal', label: 'Bantuan Minimal', desc: 'Perlu bantuan kecil sesekali' },
                        { value: 'bantuan-signifikan', label: 'Bantuan Signifikan', desc: 'Perlu dukungan reguler' }
                      ].map(level => (
                        <label key={level.value} className="flex items-start p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input type="radio" name="independence" className="mt-1 mr-3 h-4 w-4 text-primary-500" />
                          <div>
                            <span className="font-medium">{level.label}</span>
                            <p className="text-xs text-gray-600">{level.desc}</p>
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
                  <button onClick={handleSave} className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition">
                    <i className="fas fa-save mr-2"></i>Simpan Perubahan
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Add Skills Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Tambahkan Keahlian</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
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
                          onClick={handleAddSkill}
                          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition"
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                      
                      {/* Suggested Skills */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Keahlian yang sering dicari:</p>
                        <div className="flex flex-wrap gap-2">
                          {['Figma', 'React', 'JavaScript', 'UI/UX Design', 'Project Management', 'User Research'].map(skill => (
                            <button
                              key={skill}
                              onClick={() => setNewSkill(skill)}
                              className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-50 transition"
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Current Skills */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Keahlian Anda ({skills.length})</h3>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <span key={index} className="bg-primary-100 text-primary-800 px-3 py-2 rounded-full text-sm flex items-center gap-2 group">
                            {skill}
                            <button 
                              onClick={() => handleRemoveSkill(skill)}
                              className="text-primary-600 hover:text-primary-800 transition opacity-0 group-hover:opacity-100"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Skill Assessment */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Assessment Keahlian</h3>
                    <div className="space-y-4">
                      {[
                        { skill: 'UI/UX Design', level: 90, category: 'Design' },
                        { skill: 'Figma', level: 95, category: 'Tools' },
                        { skill: 'User Research', level: 85, category: 'Research' },
                        { skill: 'Prototyping', level: 88, category: 'Design' },
                        { skill: 'Accessibility', level: 92, category: 'Specialized' }
                      ].map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{item.skill}</span>
                            <span className="text-sm text-gray-500">{item.category}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${item.level}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">Tingkat Kemahiran</span>
                            <span className="text-sm font-medium text-primary-600">{item.level}%</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Skill Categories */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Kategori Keahlian</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { category: 'Design', count: 3, color: 'blue' },
                          { category: 'Development', count: 2, color: 'green' },
                          { category: 'Research', count: 1, color: 'purple' },
                          { category: 'Tools', count: 4, color: 'orange' }
                        ].map((cat, index) => (
                          <div key={index} className={`bg-${cat.color}-50 border border-${cat.color}-200 rounded-lg p-3 text-center`}>
                            <div className={`text-${cat.color}-600 font-bold text-lg`}>{cat.count}</div>
                            <div className={`text-${cat.color}-700 text-sm`}>{cat.category}</div>
                          </div>
                        ))}
                      </div>
                    </div>
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

                {/* Add Experience Form */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium mb-4">Tambah Pengalaman Baru</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Posisi *</label>
                      <input type="text" className="w-full p-3 border rounded-lg focus:border-primary-500" placeholder="Contoh: UI/UX Designer" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Perusahaan *</label>
                      <input type="text" className="w-full p-3 border rounded-lg focus:border-primary-500" placeholder="Nama perusahaan" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Lokasi</label>
                      <input type="text" className="w-full p-3 border rounded-lg focus:border-primary-500" placeholder="Kota, Negara" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Tipe Pekerjaan</label>
                      <select className="w-full p-3 border rounded-lg focus:border-primary-500">
                        <option>Full Time</option>
                        <option>Part Time</option>
                        <option>Kontrak</option>
                        <option>Freelance</option>
                        <option>Internship</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Tanggal Mulai *</label>
                      <input type="month" className="w-full p-3 border rounded-lg focus:border-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Tanggal Selesai</label>
                      <input type="month" className="w-full p-3 border rounded-lg focus:border-primary-500" />
                      <label className="flex items-center mt-2">
                        <input type="checkbox" className="mr-2 h-4 w-4 text-primary-500" />
                        <span className="text-sm">Sampai Sekarang</span>
                      </label>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Deskripsi Pekerjaan</label>
                    <textarea className="w-full p-3 border rounded-lg focus:border-primary-500" rows="3" placeholder="Jelaskan tanggung jawab dan pencapaian Anda..."></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Keahlian yang Digunakan</label>
                    <input type="text" className="w-full p-3 border rounded-lg focus:border-primary-500" placeholder="Contoh: Figma, User Research, Team Management" />
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition">
                      Simpan Pengalaman
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                      Batal
                    </button>
                  </div>
                </div>

                {/* Experience List */}
                <div className="space-y-6">
                  {experiences.map(exp => (
                    <div key={exp.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {exp.company.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{exp.position}</h3>
                            <p className="text-primary-600 font-medium">{exp.company} • {exp.location}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              <i className="fas fa-calendar mr-1"></i>
                              {exp.startDate} - {exp.endDate} • {exp.type || 'Full Time'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button className="p-2 text-gray-400 hover:text-primary-600 transition">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 transition">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4 leading-relaxed">{exp.description}</p>
                      
                      {/* Skills Used */}
                      {exp.skills && exp.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {exp.skills.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Accomplishments */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <h4 className="font-medium text-green-800 mb-2 flex items-center">
                          <i className="fas fa-trophy mr-2"></i>
                          Pencapaian Utama
                        </h4>
                        <ul className="text-green-700 text-sm space-y-1">
                          <li>• Meningkatkan skor aksesibilitas produk dari 60% menjadi 95%</li>
                          <li>• Memimpin tim 5 orang dalam proyek redesign aplikasi mobile</li>
                          <li>• Menerima penghargaan "Best Inclusive Design" 2023</li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Experience Stats */}
                <div className="mt-6 bg-primary-50 rounded-lg p-4">
                  <h4 className="font-medium text-primary-900 mb-3">Ringkasan Pengalaman</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary-600">3</div>
                      <div className="text-sm text-primary-700">Tahun Pengalaman</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">5</div>
                      <div className="text-sm text-primary-700">Proyek Diselesaikan</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">12+</div>
                      <div className="text-sm text-primary-700">Keahlian Dikuasai</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">2</div>
                      <div className="text-sm text-primary-700">Perusahaan</div>
                    </div>
                  </div>
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

                {/* Add Education Form */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium mb-4">Tambah Pendidikan Baru</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Jenjang Pendidikan *</label>
                      <select className="w-full p-3 border rounded-lg focus:border-primary-500">
                        <option>Pilih Jenjang</option>
                        <option>SMA/Sederajat</option>
                        <option>Diploma (D3)</option>
                        <option>Sarjana (S1)</option>
                        <option>Magister (S2)</option>
                        <option>Doktor (S3)</option>
                        <option>Profesi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Gelar *</label>
                      <input type="text" className="w-full p-3 border rounded-lg focus:border-primary-500" placeholder="Contoh: Sarjana Desain Komunikasi Visual" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Institusi *</label>
                      <input type="text" className="w-full p-3 border rounded-lg focus:border-primary-500" placeholder="Nama universitas/sekolah" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Lokasi</label>
                      <input type="text" className="w-full p-3 border rounded-lg focus:border-primary-500" placeholder="Kota, Negara" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Tahun Mulai *</label>
                      <input type="number" className="w-full p-3 border rounded-lg focus:border-primary-500" placeholder="YYYY" min="1900" max="2030" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Tahun Selesai</label>
                      <input type="number" className="w-full p-3 border rounded-lg focus:border-primary-500" placeholder="YYYY" min="1900" max="2030" />
                      <label className="flex items-center mt-2">
                        <input type="checkbox" className="mr-2 h-4 w-4 text-primary-500" />
                        <span className="text-sm">Masih Berlangsung</span>
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">IPK/Nilai</label>
                      <input type="text" className="w-full p-3 border rounded-lg focus:border-primary-500" placeholder="Contoh: 3.75/4.00" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Bidang Studi</label>
                      <input type="text" className="w-full p-3 border rounded-lg focus:border-primary-500" placeholder="Contoh: Desain Komunikasi Visual" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Deskripsi</label>
                    <textarea className="w-full p-3 border rounded-lg focus:border-primary-500" rows="3" placeholder="Jelaskan pencapaian, organisasi, atau kegiatan selama pendidikan..."></textarea>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition">
                      Simpan Pendidikan
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                      Batal
                    </button>
                  </div>
                </div>

                {/* Education List */}
                <div className="space-y-6">
                  {educations.map(edu => (
                    <div key={edu.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                            <i className="fas fa-graduation-cap"></i>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{edu.degree}</h3>
                            <p className="text-primary-600 font-medium">{edu.institution} • {edu.location}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              <i className="fas fa-calendar mr-1"></i>
                              {edu.startDate} - {edu.endDate}
                              {edu.details && <span className="ml-2">• {edu.details}</span>}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button className="p-2 text-gray-400 hover:text-primary-600 transition">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 transition">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4 leading-relaxed">{edu.description}</p>
                      
                      {/* Additional Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="font-medium text-blue-800">Bidang Studi</div>
                          <div className="text-blue-700">Desain Komunikasi Visual</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="font-medium text-green-800">IPK</div>
                          <div className="text-green-700">3.75/4.00 <span className="text-xs">(Cum Laude)</span></div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <div className="font-medium text-purple-800">Aktivitas</div>
                          <div className="text-purple-700">Organisasi Mahasiswa Disabilitas</div>
                        </div>
                      </div>

                      {/* Achievements */}
                      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                          <i className="fas fa-award mr-2"></i>
                          Prestasi & Penghargaan
                        </h4>
                        <ul className="text-yellow-700 text-sm space-y-1">
                          <li>• Lulus dengan predikat Cum Laude</li>
                          <li>• Juara 1 Lomba Desain Inklusif Nasional 2020</li>
                          <li>• Ketua Organisasi Mahasiswa Disabilitas 2018-2019</li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Education Timeline */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Timeline Pendidikan</h4>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary-200"></div>
                    
                    {/* Timeline items */}
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4 relative">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold z-10">
                          1
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">Sarjana Desain Komunikasi Visual</div>
                          <div className="text-sm text-gray-600">Universitas Indonesia • 2016-2020</div>
                          <div className="text-xs text-primary-600 mt-1">IPK: 3.75/4.00 • Cum Laude</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4 relative">
                        <div className="w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center text-white text-sm font-bold z-10">
                          2
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">SMA Negeri 1 Jakarta</div>
                          <div className="text-sm text-gray-600">Jakarta • 2013-2016</div>
                          <div className="text-xs text-primary-600 mt-1">Nilai UN: 89.5 • Jurusan IPA</div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                    <button className="border border-primary-500 text-primary-500 px-4 py-2 rounded-lg hover:bg-primary-50 transition">
                      <i className="fas fa-link mr-2"></i>Tambah Link
                    </button>
                  </div>
                </div>

                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-primary-500 transition">
                  <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Unggah Karya Anda</h3>
                  <p className="text-gray-600 mb-4">Drag & drop file atau klik untuk memilih</p>
                  <button className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition">
                    Pilih File
                  </button>
                  <p className="text-xs text-gray-500 mt-3">
                    Support: PDF, JPG, PNG, MP4 (max. 10MB)
                  </p>
                </div>

                {/* Portfolio Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolioItems.map(item => (
                    <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition group">
                      <div className="relative mb-3">
                        <div className="w-full h-40 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                          <i className="fas fa-file-image text-3xl text-primary-500"></i>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                          <button className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 mr-1">
                            <i className="fas fa-edit text-gray-600"></i>
                          </button>
                          <button className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100">
                            <i className="fas fa-trash text-red-600"></i>
                          </button>
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{item.date}</span>
                        <span className="flex items-center">
                          <i className="fas fa-eye mr-1"></i> 156
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add New Portfolio Item */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition cursor-pointer">
                    <i className="fas fa-plus text-3xl text-gray-400 mb-3"></i>
                    <p className="text-gray-600">Tambah Karya Baru</p>
                  </div>
                </div>

                {/* Portfolio Stats */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Statistik Portofolio</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary-600">{portfolioItems.length}</div>
                      <div className="text-sm text-gray-600">Total Karya</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">1.2k</div>
                      <div className="text-sm text-gray-600">Total Views</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">89%</div>
                      <div className="text-sm text-gray-600">Engagement Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">23</div>
                      <div className="text-sm text-gray-600">Dilihat Employer</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* === PREFERENSI KERJA TAB === */}
            {activeTab === 'preferensi' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Preferensi Kerja</h2>
                  <button onClick={handleSave} className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition">
                    <i className="fas fa-save mr-2"></i>Simpan Perubahan
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Jenis Pekerjaan */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Jenis Pekerjaan yang Diinginkan *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { value: 'full-time', label: 'Full Time', icon: 'briefcase' },
                        { value: 'part-time', label: 'Part Time', icon: 'clock' },
                        { value: 'remote', label: 'Remote', icon: 'laptop-house' },
                        { value: 'hybrid', label: 'Hybrid', icon: 'building' },
                        { value: 'freelance', label: 'Freelance', icon: 'user-tie' },
                        { value: 'kontrak', label: 'Kontrak', icon: 'file-contract' }
                      ].map(jenis => (
                        <label key={jenis.value} className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                          profileData.jenisPekerjaan.includes(jenis.value) 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={profileData.jenisPekerjaan.includes(jenis.value)}
                            onChange={() => handleCheckboxChange('jenisPekerjaan', jenis.value)}
                            className="mr-3 h-5 w-5 text-primary-500" 
                          />
                          <div className="flex items-center">
                            <i className={`fas fa-${jenis.icon} text-primary-500 mr-3`}></i>
                            <span className="font-medium">{jenis.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Range Gaji */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Ekspektasi Gaji (per bulan)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: '0-5', label: 'Rp 0-5 jt' },
                        { value: '5-10', label: 'Rp 5-10 jt' },
                        { value: '10-15', label: 'Rp 10-15 jt' },
                        { value: '15+', label: 'Rp 15+ jt' }
                      ].map(range => (
                        <label key={range.value} className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                          profileData.gaji === range.value 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}>
                          <input 
                            type="radio" 
                            name="salary"
                            checked={profileData.gaji === range.value}
                            onChange={() => handleInputChange('gaji', range.value)}
                            className="mr-3 h-4 w-4 text-primary-500" 
                          />
                          <span>{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Industri */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Industri yang Diminati</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Technology', 'Education', 'Healthcare', 'Finance', 
                        'Creative', 'Government', 'Non-profit', 'Manufacturing', 'Retail'
                      ].map(industry => (
                        <label key={industry} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input type="checkbox" className="mr-3 h-4 w-4 text-primary-500" />
                          <span className="text-sm">{industry}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Lokasi */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Preferensi Lokasi</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 h-4 w-4 text-primary-500" />
                        <span>Lokasi spesifik (tulis di bawah)</span>
                      </label>
                      <input 
                        type="text" 
                        className="w-full p-3 border rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="Contoh: Jakarta, Bandung, Surabaya..."
                      />
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