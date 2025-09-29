// src/pages/application/ApplicationForm.js
import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get job data from navigation state or mock data
  const job = location.state?.job || {
    id: 1,
    title: "UI/UX Designer",
    company: "PT Tech Inklusif",
    location: "Jakarta • Remote"
  };

  const [formData, setFormData] = useState({
    // Personal Info
    fullName: 'Ahmad Surya',
    email: 'ahmad.surya@email.com',
    phone: '08123456789',
    
    // Application Details
    coverLetter: '',
    salaryExpectation: '',
    availability: 'immediate',
    source: 'platform',
    
    // Documents
    resume: 'current',
    portfolio: 'attach',
    
    // Accessibility
    disabilityDisclosure: 'yes',
    accommodationNeeds: '',
    additionalInfo: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Application submitted:', formData);
      showNotification('Lamaran berhasil dikirim!', 'success');
      
      // Redirect to application history
      setTimeout(() => {
        navigate('/application/history');
      }, 1500);
      
    } catch (error) {
      showNotification('Gagal mengirim lamaran. Silakan coba lagi.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-primary-500';
    
    notification.className = `fixed top-4 right-4 ${bgColor} text-white p-4 rounded-lg shadow-lg z-50`;
    notification.innerHTML = `
      <div class="flex items-center">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-2"></i>
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

  // Cover Letter Templates
  const coverLetterTemplates = [
    {
      id: 'standard',
      name: 'Standar',
      content: `Kepada Yth.
Tim Rekrutmen ${job.company}

Saya tertarik dengan posisi ${job.title} yang diumumkan di InklusiKerja. Dengan pengalaman dan keahlian yang sesuai, saya yakin dapat memberikan kontribusi positif bagi ${job.company}.

[Sisipkan pengalaman dan keahlian relevan]

Saya sangat antusias dengan kesempatan untuk bergabung dengan tim yang inklusif dan berdedikasi seperti di ${job.company}.

Hormat saya,
${formData.fullName}`
    },
    {
      id: 'professional',
      name: 'Profesional',
      content: `Kepada Tim Rekrutmen ${job.company},

Saya menulis untuk menyampaikan minat terhadap posisi ${job.title} di ${job.company}. Melihat deskripsi lowongan, saya yakin bahwa latar belakang dan keahlian saya selaras dengan kebutuhan posisi ini.

[Sisipkan pencapaian dan keahlian spesifik]

Saya sangat menghargai komitmen ${job.company} dalam menciptakan lingkungan kerja yang inklusif dan accessible.

Salam,
${formData.fullName}`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <main id="main-content" className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700 mb-2">Lamar Posisi {job.title}</h1>
          <p className="text-lg text-gray-600">{job.company} • {job.location}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Informasi Dasar</span>
              <span>Dokumen</span>
              <span>Surat Lamaran</span>
              <span>Konfirmasi</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Informasi Dasar</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nama Lengkap *</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full p-3 border rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full p-3 border rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Nomor Telepon *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full p-3 border rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Ekspektasi Gaji</label>
                    <input
                      type="text"
                      value={formData.salaryExpectation}
                      onChange={(e) => handleInputChange('salaryExpectation', e.target.value)}
                      className="w-full p-3 border rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      placeholder="Contoh: Rp 8-12 juta"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ketersediaan Bergabung *</label>
                    <select
                      value={formData.availability}
                      onChange={(e) => handleInputChange('availability', e.target.value)}
                      className="w-full p-3 border rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    >
                      <option value="immediate">Segera</option>
                      <option value="2weeks">2 Minggu</option>
                      <option value="1month">1 Bulan</option>
                      <option value="negotiable">Dapat dinegosiasikan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Darimana Anda tahu lowongan ini?</label>
                    <select
                      value={formData.source}
                      onChange={(e) => handleInputChange('source', e.target.value)}
                      className="w-full p-3 border rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    >
                      <option value="platform">InklusiKerja</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="friend">Teman</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition font-medium"
                  >
                    Lanjut ke Dokumen
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Documents */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Dokumen Lamaran</h2>
                
                {/* Resume Selection */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium mb-3">Resume/CV</h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="resume"
                        value="current"
                        checked={formData.resume === 'current'}
                        onChange={(e) => handleInputChange('resume', e.target.value)}
                        className="mr-3 h-4 w-4 text-primary-500"
                      />
                      <div>
                        <span className="font-medium">Gunakan Resume Profil Saat Ini</span>
                        <p className="text-sm text-gray-600">resume-ahmad-surya.pdf (diperbarui 2 hari lalu)</p>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="resume"
                        value="upload"
                        checked={formData.resume === 'upload'}
                        onChange={(e) => handleInputChange('resume', e.target.value)}
                        className="mr-3 h-4 w-4 text-primary-500"
                      />
                      <div>
                        <span className="font-medium">Unggah Resume Baru</span>
                        <p className="text-sm text-gray-600">Upload file PDF, DOC, atau DOCX (max. 5MB)</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Portfolio Selection */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium mb-3">Portofolio</h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="portfolio"
                        value="attach"
                        checked={formData.portfolio === 'attach'}
                        onChange={(e) => handleInputChange('portfolio', e.target.value)}
                        className="mr-3 h-4 w-4 text-primary-500"
                      />
                      <div>
                        <span className="font-medium">Lampirkan Portofolio dari Profil</span>
                        <p className="text-sm text-gray-600">Akan mengirimkan link portofolio Anda</p>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="portfolio"
                        value="custom"
                        checked={formData.portfolio === 'custom'}
                        onChange={(e) => handleInputChange('portfolio', e.target.value)}
                        className="mr-3 h-4 w-4 text-primary-500"
                      />
                      <div>
                        <span className="font-medium">Link Portofolio Kustom</span>
                        <input
                          type="url"
                          placeholder="https://"
                          className="w-full p-2 border rounded mt-2"
                        />
                      </div>
                    </label>
                  </div>
                </div>

                {/* Additional Documents */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition">
                  <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-3"></i>
                  <h3 className="font-medium text-gray-900 mb-2">Dokumen Tambahan</h3>
                  <p className="text-gray-600 mb-4">Unggah sertifikat, surat rekomendasi, atau dokumen pendukung lainnya</p>
                  <button type="button" className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition">
                    Pilih File
                  </button>
                  <p className="text-xs text-gray-500 mt-3">PDF, DOC, JPG, PNG (max. 10MB per file)</p>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition font-medium"
                  >
                    Lanjut ke Surat Lamaran
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Cover Letter */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Surat Lamaran</h2>
                
                {/* Template Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Pilih Template Surat Lamaran</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {coverLetterTemplates.map(template => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => handleInputChange('coverLetter', template.content)}
                        className="p-4 border border-gray-300 rounded-lg text-left hover:border-primary-500 hover:bg-primary-50 transition"
                      >
                        <div className="font-medium mb-2">{template.name}</div>
                        <div className="text-sm text-gray-600 line-clamp-3">
                          {template.content.split('\n')[0]}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cover Letter Editor */}
                <div>
                  <label className="block text-sm font-medium mb-2">Surat Lamaran *</label>
                  <textarea
                    value={formData.coverLetter}
                    onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                    className="w-full p-4 border rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    rows="12"
                    placeholder="Tulis surat lamaran Anda di sini..."
                    required
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">
                      {formData.coverLetter.length} karakter
                    </span>
                    <div className="flex gap-2">
                      <button type="button" className="text-primary-500 hover:text-primary-600 text-sm">
                        <i className="fas fa-redo mr-1"></i>Reset
                      </button>
                      <button type="button" className="text-primary-500 hover:text-primary-600 text-sm">
                        <i className="fas fa-spell-check mr-1"></i>Periksa Ejaan
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition font-medium"
                  >
                    Lanjut ke Konfirmasi
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Konfirmasi Lamaran</h2>
                
                {/* Job Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium mb-3">Ringkasan Lowongan</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold">
                      TI
                    </div>
                    <div>
                      <div className="font-bold">{job.title}</div>
                      <div className="text-primary-600">{job.company}</div>
                      <div className="text-sm text-gray-600">{job.location}</div>
                    </div>
                  </div>
                </div>

                {/* Application Summary */}
                <div className="space-y-4">
                  <h3 className="font-medium">Detail Lamaran Anda</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nama Lengkap</label>
                      <p className="font-medium">{formData.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="font-medium">{formData.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Telepon</label>
                      <p className="font-medium">{formData.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Ketersediaan</label>
                      <p className="font-medium">
                        {formData.availability === 'immediate' ? 'Segera' : 
                         formData.availability === '2weeks' ? '2 Minggu' : 
                         formData.availability === '1month' ? '1 Bulan' : 'Dinegosiasikan'}
                      </p>
                    </div>
                  </div>

                  {/* Documents Summary */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Dokumen yang Dikirim</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Resume: {formData.resume === 'current' ? 'Resume Profil Saat Ini' : 'File Baru'}</li>
                      <li>• Portofolio: {formData.portfolio === 'attach' ? 'Link dari Profil' : 'Link Kustom'}</li>
                      <li>• Surat Lamaran: {formData.coverLetter ? 'Tersedia' : 'Tidak Tersedia'}</li>
                    </ul>
                  </div>
                </div>

                {/* Final Actions */}
                <div className="border-t pt-6">
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                      Kembali
                    </button>
                    <div className="space-x-3">
                      <button
                        type="button"
                        onClick={() => navigate('/lowongan')}
                        className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
                      >
                        Simpan Draft
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition font-medium disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i>
                            Mengirim...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane"></i>
                            Kirim Lamaran
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default ApplicationForm;