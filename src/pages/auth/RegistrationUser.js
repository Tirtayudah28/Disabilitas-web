// src/pages/auth/RegistrationPage.js - WITH ACCESSIBILITY FEATURES
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info - SAMA untuk semua
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'candidate', // 'candidate' or 'employer'
    
    // Step 2: Conditional berdasarkan userType
    // Untuk CANDIDATE (Pencari Kerja)
    fullName: '',
    disabilityType: '',
    accessibilityNeeds: [],
    
    // Untuk EMPLOYER (Perusahaan)
    companyName: '',
    companySize: '',
    industry: '',
    position: '',
    website: '',
    
    // Step 3: Verification - SAMA untuk semua
    verificationCode: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleNext = () => {
    // Validation before proceeding
    if (step === 1) {
      if (!formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
        setError('Semua field harus diisi');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Password dan konfirmasi password tidak cocok');
        return;
      }
      if (formData.password.length < 8) {
        setError('Password harus minimal 8 karakter');
        return;
      }
    }
    
    if (step === 2) {
      if (formData.userType === 'candidate') {
        if (!formData.fullName || !formData.disabilityType) {
          setError('Nama lengkap dan jenis disabilitas harus diisi');
          return;
        }
      } else {
        if (!formData.companyName || !formData.companySize || !formData.industry || !formData.position) {
          setError('Semua field perusahaan harus diisi');
          return;
        }
      }
    }
    
    setStep(prev => prev + 1);
    setError('');
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Registration data:', formData);
      
      // Simpan data registrasi
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userType', formData.userType);
      
      // Redirect berdasarkan userType setelah registrasi
      if (formData.userType === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/profile'); // Redirect ke profile untuk complete data
      }
    } catch (err) {
      setError('Registrasi gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Accessibility functions
  const increaseFontSize = () => {
    document.documentElement.style.fontSize = '18px';
  };

  const decreaseFontSize = () => {
    document.documentElement.style.fontSize = '14px';
  };

  const resetFontSize = () => {
    document.documentElement.style.fontSize = '16px';
  };

  const toggleHighContrast = () => {
    document.body.classList.toggle('high-contrast');
  };

  // Data untuk Candidate
  const disabilityTypes = [
    'Tuna Netra',
    'Tuna Rungu',
    'Tuna Daksa', 
    'Tuna Grahita',
    'Autisme',
    'Disabilitas Lainnya'
  ];

  const accessibilityNeeds = [
    'Screen Reader',
    'Text-to-Speech',
    'Braille Display',
    'Sign Language Interpreter',
    'Wheelchair Access',
    'Assistive Technology',
    'Flexible Schedule',
    'Remote Work Options'
  ];

  // Data untuk Employer
  const companySizes = [
    '1-10 employees',
    '11-50 employees', 
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees'
  ];

  const industries = [
    'Technology',
    'Education',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Retail',
    'Government',
    'Non-profit',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 w-10 h-10 rounded-full flex items-center justify-center">
              <i className="fas fa-hands-helping text-white"></i>
            </div>
            <span className="text-xl font-bold text-primary-700">InklusiKerja</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Daftar Akun Baru</h2>
          <p className="mt-2 text-gray-600">Bergabung dengan platform inklusif untuk disabilitas</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4" role="alert">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle text-red-500 mr-3"></i>
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Informasi Dasar</span>
            <span>{formData.userType === 'employer' ? 'Data Perusahaan' : 'Data Pribadi'}</span>
            <span>Verifikasi</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* Step 1: Basic Information - SAMA untuk semua */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Informasi Dasar</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipe Pengguna *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange('userType', 'candidate')}
                    className={`p-3 border rounded-lg text-center transition ${
                      formData.userType === 'candidate'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <i className="fas fa-user-graduate block text-xl mb-1"></i>
                    <span className="text-sm font-medium">Pencari Kerja</span>
                    <p className="text-xs text-gray-500 mt-1">Disabilitas</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('userType', 'employer')}
                    className={`p-3 border rounded-lg text-center transition ${
                      formData.userType === 'employer'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <i className="fas fa-building block text-xl mb-1"></i>
                    <span className="text-sm font-medium">Perusahaan</span>
                    <p className="text-xs text-gray-500 mt-1">Pemberi Kerja</p>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={formData.userType === 'employer' ? "hr@perusahaan.com" : "email@example.com"}
                  aria-describedby="email-help"
                />
                <div id="email-help" className="text-xs text-gray-500 mt-1">
                  {formData.userType === 'employer' 
                    ? 'Gunakan email perusahaan yang valid' 
                    : 'Gunakan email pribadi yang aktif'
                  }
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon *
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="081234567890"
                  aria-describedby="phone-help"
                />
                <div id="phone-help" className="text-xs text-gray-500 mt-1">
                  Akan digunakan untuk verifikasi dan notifikasi
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Minimal 8 karakter"
                  aria-describedby="password-help"
                />
                <div id="password-help" className="text-xs text-gray-500 mt-1">
                  Password harus mengandung huruf besar, kecil, dan angka
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Konfirmasi Password *
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ulangi password"
                  aria-describedby="confirm-password-help"
                />
                <div id="confirm-password-help" className="text-xs text-gray-500 mt-1">
                  Pastikan password sama dengan di atas
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={isLoading}
                className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition font-medium disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Memproses...
                  </>
                ) : (
                  `Lanjut ke Data ${formData.userType === "employer" ? "Perusahaan" : "Pribadi"}`
                )}
              </button>
            </div>
          )}

          {/* Step 2: Conditional Form berdasarkan User Type */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {formData.userType === 'employer' ? 'Data Perusahaan' : 'Data Pribadi'}
              </h3>

              {/* FORM UNTUK CANDIDATE (Pencari Kerja) */}
              {formData.userType === 'candidate' && (
                <>
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Nama lengkap Anda"
                      aria-describedby="name-help"
                    />
                    <div id="name-help" className="text-xs text-gray-500 mt-1">
                      Sesuai dengan dokumen identitas
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jenis Disabilitas *
                    </label>
                    <select
                      value={formData.disabilityType}
                      onChange={(e) => handleInputChange('disabilityType', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                      aria-describedby="disability-help"
                    >
                      <option value="">Pilih jenis disabilitas</option>
                      {disabilityTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <div id="disability-help" className="text-xs text-gray-500 mt-1">
                      Informasi ini membantu kami menyediakan akomodasi yang tepat
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kebutuhan Aksesibilitas
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                      {accessibilityNeeds.map(need => (
                        <label key={need} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.accessibilityNeeds.includes(need)}
                            onChange={(e) => {
                              const needs = e.target.checked
                                ? [...formData.accessibilityNeeds, need]
                                : formData.accessibilityNeeds.filter(n => n !== need);
                              handleInputChange('accessibilityNeeds', needs);
                            }}
                            className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">{need}</span>
                        </label>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Pilih kebutuhan aksesibilitas yang Anda perlukan
                    </div>
                  </div>
                </>
              )}

              {/* FORM UNTUK EMPLOYER (Perusahaan) */}
              {formData.userType === 'employer' && (
                <>
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Perusahaan *
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Nama perusahaan Anda"
                      aria-describedby="company-help"
                    />
                    <div id="company-help" className="text-xs text-gray-500 mt-1">
                      Sesuai dengan akta perusahaan
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ukuran Perusahaan *
                    </label>
                    <select
                      value={formData.companySize}
                      onChange={(e) => handleInputChange('companySize', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                      aria-describedby="size-help"
                    >
                      <option value="">Pilih ukuran perusahaan</option>
                      {companySizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                    <div id="size-help" className="text-xs text-gray-500 mt-1">
                      Jumlah karyawan saat ini
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industri *
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                      aria-describedby="industry-help"
                    >
                      <option value="">Pilih industri</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                    <div id="industry-help" className="text-xs text-gray-500 mt-1">
                      Bidang utama perusahaan
                    </div>
                  </div>

                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                      Posisi Anda di Perusahaan *
                    </label>
                    <input
                      id="position"
                      type="text"
                      required
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Contoh: HR Manager, Recruiter, Founder"
                      aria-describedby="position-help"
                    />
                    <div id="position-help" className="text-xs text-gray-500 mt-1">
                      Posisi Anda dalam proses rekrutmen
                    </div>
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                      Website Perusahaan (opsional)
                    </label>
                    <input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="https://example.com"
                      aria-describedby="website-help"
                    />
                    <div id="website-help" className="text-xs text-gray-500 mt-1">
                      Akan ditampilkan di profil perusahaan
                    </div>
                  </div>
                </>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                  className="flex-1 bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition font-medium disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Memproses...
                    </>
                  ) : (
                    'Lanjut ke Verifikasi'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Verification - SAMA untuk semua */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Verifikasi Akun</h3>
              
              <div className="text-center">
                <i className="fas fa-envelope text-4xl text-primary-500 mb-3"></i>
                <p className="text-gray-600">
                  Kode verifikasi telah dikirim ke <strong>{formData.email}</strong>
                </p>
                {formData.userType === 'employer' && (
                  <p className="text-sm text-green-600 mt-2">
                    Akun employer Anda akan mendapatkan akses ke dashboard khusus
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Kode Verifikasi *
                </label>
                <input
                  id="verificationCode"
                  type="text"
                  required
                  value={formData.verificationCode}
                  onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-center text-lg font-mono"
                  placeholder="123456"
                  maxLength="6"
                  aria-describedby="verification-help"
                />
                <div id="verification-help" className="text-xs text-gray-500 mt-1 text-center">
                  Masukkan 6 digit kode yang dikirim ke email Anda
                </div>
              </div>

              <div className="text-center">
                <button type="button" className="text-primary-500 hover:text-primary-600 text-sm">
                  Kirim ulang kode verifikasi
                </button>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition font-medium disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Membuat Akun...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle mr-2"></i>
                      {formData.userType === 'employer' ? 'Akses Employer Dashboard' : 'Buat Akun'}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

                {/* Accessibility Quick Options */}
        <div className="bg-primary-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-primary-900 mb-3 flex items-center">
            <i className="fas fa-universal-access mr-2"></i>
            Opsi Aksesibilitas
          </h4>
          <div className="flex flex-wrap gap-2 justify-center">
            <button 
              className="text-xs bg-white text-primary-700 px-3 py-2 rounded-lg border border-primary-200 hover:bg-primary-100 transition flex items-center gap-1"
              onClick={increaseFontSize}
              aria-label="Perbesar ukuran teks"
            >
              <i className="fas fa-text-height"></i>
              <span>A+</span>
            </button>
            <button 
              className="text-xs bg-white text-primary-700 px-3 py-2 rounded-lg border border-primary-200 hover:bg-primary-100 transition flex items-center gap-1"
              onClick={decreaseFontSize}
              aria-label="Perkecil ukuran teks"
            >
              <i className="fas fa-text-height"></i>
              <span>A-</span>
            </button>
            <button 
              className="text-xs bg-white text-primary-700 px-3 py-2 rounded-lg border border-primary-200 hover:bg-primary-100 transition flex items-center gap-1"
              onClick={resetFontSize}
              aria-label="Reset ukuran teks ke normal"
            >
              <i className="fas fa-undo-alt"></i>
              <span>Reset</span>
            </button>
            <button 
              className="text-xs bg-white text-primary-700 px-3 py-2 rounded-lg border border-primary-200 hover:bg-primary-100 transition flex items-center gap-1"
              onClick={toggleHighContrast}
              aria-label="Toggle mode kontras tinggi"
            >
              <i className="fas fa-adjust"></i>
              <span>Kontras</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
              Masuk di sini
            </Link>
          </p>
        </div>

        {/* Demo Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-700 text-sm">
            <strong>Untuk Demo:</strong> Isi form dan klik lanjut, akan redirect otomatis
          </p>
          <p className="text-blue-600 text-xs mt-1">
            {formData.userType === 'employer' 
              ? 'Employer → Dashboard Employer' 
              : 'Pencari Kerja → Halaman Profil'
            }
          </p>
        </div>

        {/* Screen Reader Announcement */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Halaman registrasi. Silakan isi form pendaftaran akun baru.
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;