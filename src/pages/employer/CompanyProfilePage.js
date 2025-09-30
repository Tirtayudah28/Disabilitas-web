// src/pages/employer/CompanyProfilePage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CompanyProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock company data - sama seperti di dashboard untuk konsistensi
  const [companyData, setCompanyData] = useState({
    name: "PT Tech Inklusif",
    industry: "Technology",
    size: "51-200 employees",
    plan: "Premium",
    joinedDate: "2023-05-15",
    website: "https://techinklusif.com",
    email: "hr@techinklusif.com",
    phone: "+62 21 1234 5678",
    address: "Jl. Sudirman No. 123, Jakarta Selatan",
    description: "Perusahaan teknologi yang berfokus pada pengembangan solusi inklusif untuk semua kalangan.",
    inclusivityStatement: "Kami berkomitmen menciptakan lingkungan kerja yang inklusif dan mendukung bagi semua karyawan, termasuk penyandang disabilitas. Kami percaya bahwa diversitas adalah kekuatan yang mendorong inovasi.",
    logo: null,
    benefits: ["Health Insurance", "Flexible Hours", "Remote Work", "Training Budget", "Mental Health Support"],
    accommodations: ["Wheelchair Access", "Screen Reader Support", "Sign Language Interpreter", "Ergonomic Equipment"]
  });

  const [socialMedia, setSocialMedia] = useState({
    linkedin: "https://linkedin.com/company/techinklusif",
    twitter: "https://twitter.com/techinklusif",
    facebook: "https://facebook.com/techinklusif",
    instagram: "https://instagram.com/techinklusif"
  });

  const tabs = [
    { id: 'profile', label: 'Profil Perusahaan', icon: 'building' },
    { id: 'branding', label: 'Branding', icon: 'palette' },
    { id: 'social', label: 'Media Sosial', icon: 'share-alt' },
    { id: 'settings', label: 'Pengaturan', icon: 'cog' }
  ];

  const handleSave = () => {
    console.log('Saving company data:', companyData);
    setIsEditing(false);
    // Di real app, ini akan API call
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompanyData({...companyData, logo: e.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <main id="main-content" className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-700 mb-2">Profil Perusahaan</h1>
            <p className="text-gray-600">
              Kelola informasi dan branding perusahaan Anda
            </p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition font-medium flex items-center gap-2"
              >
                <i className="fas fa-edit"></i>
                Edit Profil
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={handleSave}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-medium flex items-center gap-2"
                >
                  <i className="fas fa-save"></i>
                  Simpan Perubahan
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Batal
                </button>
              </div>
            )}
            <Link 
              to="/employer/dashboard"
              className="border border-primary-500 text-primary-500 px-4 py-3 rounded-lg hover:bg-primary-50 transition flex items-center gap-2"
            >
              <i className="fas fa-arrow-left"></i>
              Kembali
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
              {/* Company Logo & Basic Info */}
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  {companyData.logo ? (
                    <img 
                      src={companyData.logo} 
                      alt={companyData.name}
                      className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-lg">
                      {getInitials(companyData.name)}
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute -bottom-2 -right-2 bg-primary-500 text-white p-2 rounded-full cursor-pointer hover:bg-primary-600 transition">
                      <i className="fas fa-camera text-sm"></i>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
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
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Quick Stats */}
              <div className="border-t mt-6 pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium text-primary-600">{companyData.joinedDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Profile Views</span>
                    <span className="font-medium text-green-600">1,560</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-medium text-blue-600">85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Dasar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Perusahaan
                      </label>
                      <input 
                        type="text" 
                        value={companyData.name}
                        onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industri
                      </label>
                      <input 
                        type="text" 
                        value={companyData.industry}
                        onChange={(e) => setCompanyData({...companyData, industry: e.target.value})}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ukuran Perusahaan
                      </label>
                      <select 
                        value={companyData.size}
                        onChange={(e) => setCompanyData({...companyData, size: e.target.value})}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                      >
                        <option value="1-10 employees">1-10 employees</option>
                        <option value="11-50 employees">11-50 employees</option>
                        <option value="51-200 employees">51-200 employees</option>
                        <option value="201-500 employees">201-500 employees</option>
                        <option value="501-1000 employees">501-1000 employees</option>
                        <option value="1000+ employees">1000+ employees</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input 
                        type="url" 
                        value={companyData.website}
                        onChange={(e) => setCompanyData({...companyData, website: e.target.value})}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Kontak</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Perusahaan
                      </label>
                      <input 
                        type="email" 
                        value={companyData.email}
                        onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telepon
                      </label>
                      <input 
                        type="tel" 
                        value={companyData.phone}
                        onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alamat
                      </label>
                      <textarea 
                        value={companyData.address}
                        onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
                        disabled={!isEditing}
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Company Description */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Deskripsi Perusahaan</h3>
                  <textarea 
                    value={companyData.description}
                    onChange={(e) => setCompanyData({...companyData, description: e.target.value})}
                    disabled={!isEditing}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="Deskripsikan perusahaan Anda, misi, visi, dan nilai-nilai..."
                  />
                </div>

                {/* Inclusivity Statement */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    <i className="fas fa-heart text-red-500 mr-2"></i>
                    Pernyataan Inklusivitas
                  </h3>
                  <textarea 
                    value={companyData.inclusivityStatement}
                    onChange={(e) => setCompanyData({...companyData, inclusivityStatement: e.target.value})}
                    disabled={!isEditing}
                    rows="5"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="Bagaimana komitmen perusahaan Anda terhadap inklusivitas dan diversitas?"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Pernyataan ini akan ditampilkan kepada kandidat dan menunjukkan komitmen perusahaan terhadap lingkungan kerja inklusif.
                  </p>
                </div>

                {/* Benefits & Accommodations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Employee Benefits */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Benefit Karyawan</h3>
                    <div className="space-y-2">
                      {companyData.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <i className="fas fa-check text-green-500"></i>
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    {isEditing && (
                      <button className="mt-4 text-primary-500 hover:text-primary-600 text-sm font-medium">
                        + Tambah Benefit
                      </button>
                    )}
                  </div>

                  {/* Accommodations */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      <i className="fas fa-universal-access text-primary-500 mr-2"></i>
                      Fasilitas Aksesibilitas
                    </h3>
                    <div className="space-y-2">
                      {companyData.accommodations.map((accommodation, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <i className="fas fa-check text-blue-500"></i>
                          <span className="text-gray-700">{accommodation}</span>
                        </div>
                      ))}
                    </div>
                    {isEditing && (
                      <button className="mt-4 text-primary-500 hover:text-primary-600 text-sm font-medium">
                        + Tambah Fasilitas
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Branding Tab */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Brand Identity</h3>
                  <p className="text-gray-600 mb-6">Kelola logo, warna, dan identitas visual perusahaan Anda.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Logo Perusahaan
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                        {companyData.logo ? (
                          <div className="space-y-4">
                            <img 
                              src={companyData.logo} 
                              alt="Company Logo" 
                              className="w-32 h-32 rounded-lg object-cover mx-auto"
                            />
                            <button 
                              onClick={() => setCompanyData({...companyData, logo: null})}
                              className="text-red-500 hover:text-red-600 text-sm"
                            >
                              Hapus Logo
                            </button>
                          </div>
                        ) : (
                          <div>
                            <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                            <p className="text-gray-500 mb-2">Upload logo perusahaan</p>
                            <label className="bg-primary-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-primary-600 transition">
                              Pilih File
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Brand Colors
                      </label>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-500 rounded"></div>
                          <span>Primary Color</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-secondary-500 rounded"></div>
                          <span>Secondary Color</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Media Sosial</h3>
                  <p className="text-gray-600 mb-6">Tautkan akun media sosial perusahaan Anda.</p>
                  
                  <div className="space-y-4">
                    {Object.entries(socialMedia).map(([platform, url]) => (
                      <div key={platform} className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <i className={`fab fa-${platform} text-gray-600`}></i>
                        </div>
                        <input 
                          type="url" 
                          value={url}
                          onChange={(e) => setSocialMedia({...socialMedia, [platform]: e.target.value})}
                          placeholder={`https://${platform}.com/yourcompany`}
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Profil</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Visibilitas Profil</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3">
                          <input type="radio" name="visibility" defaultChecked className="text-primary-500" />
                          <span>Publik - Dapat dilihat oleh semua kandidat</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="radio" name="visibility" className="text-primary-500" />
                          <span>Privat - Hanya kandidat yang dilamar yang dapat melihat</span>
                        </label>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-medium text-gray-900 mb-3">Notifikasi</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="text-primary-500 rounded" />
                          <span>Email notifikasi untuk lamaran baru</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="text-primary-500 rounded" />
                          <span>Reminder untuk interview</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="text-primary-500 rounded" />
                          <span>Update mingguan tentang aktivitas</span>
                        </label>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition font-medium">
                        <i className="fas fa-trash mr-2"></i>
                        Hapus Akun Perusahaan
                      </button>
                      <p className="text-sm text-gray-500 mt-2">
                        Tindakan ini tidak dapat dibatalkan. Semua data perusahaan akan dihapus permanen.
                      </p>
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

export default CompanyProfilePage;