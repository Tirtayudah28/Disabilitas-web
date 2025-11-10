// src/pages/auth/EmployerRegistrationPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/authSlice';

const EmployerRegistrationPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Company Basic Info
    companyName: '',
    companyEmail: '',
    industry: '',
    companySize: '',
    website: '',
    
    // Step 2: Account & Contact Info
    fullName: '',
    position: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    
    // Step 3: Verification
    verificationCode: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const handleNext = () => {
    // Validation before proceeding
    if (step === 1) {
      if (!formData.companyName || !formData.companyEmail || !formData.industry || !formData.companySize) {
        setError('Semua field bertanda * harus diisi');
        return;
      }
      if (!formData.companyEmail.includes('@')) {
        setError('Format email perusahaan tidak valid');
        return;
      }
    }
    
    if (step === 2) {
      if (!formData.fullName || !formData.position || !formData.phone || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Semua field bertanda * harus diisi');
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
      if (!formData.agreeToTerms) {
        setError('Anda harus menyetujui syarat dan ketentuan');
        return;
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
      // Simulate API call for verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Employer registration data:', formData);
      
      // Create employer account
      const employerData = {
        email: formData.email,
        password: formData.password,
        userType: 'employer',
        name: formData.fullName,
        company: formData.companyName,
        position: formData.position,
        phone: formData.phone
      };

      const result = await dispatch(login(employerData));

      if (login.fulfilled.match(result)) {
        navigate('/employer/dashboard');
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

  // Data untuk Employer
  const industries = [
    'Teknologi & IT',
    'Keuangan & Perbankan',
    'Kesehatan',
    'Pendidikan',
    'Manufaktur',
    'Retail & E-commerce',
    'Hospitality & Pariwisata',
    'Konstruksi',
    'Energi & Sumber Daya',
    'Transportasi & Logistik',
    'Media & Komunikasi',
    'Lainnya'
  ];

  const companySizes = [
    '1-10 karyawan',
    '11-50 karyawan',
    '51-200 karyawan',
    '201-500 karyawan',
    '501-1000 karyawan',
    '1000+ karyawan'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-full flex items-center justify-center shadow-md">
              <i className="fas fa-hands-helping text-white text-xl"></i>
            </div>
            <span className="text-2xl font-bold text-blue-700">InklusiKerja</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar sebagai Employer</h1>
          <p className="text-gray-600">
            Bergabung dengan platform inklusif untuk merekrut talenta disabilitas
          </p>
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
            <span className={step >= 1 ? "font-semibold text-blue-600" : ""}>Data Perusahaan</span>
            <span className={step >= 2 ? "font-semibold text-blue-600" : ""}>Data Akun</span>
            <span className={step >= 3 ? "font-semibold text-blue-600" : ""}>Verifikasi</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* Step 1: Company Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="inline-flex items-center bg-purple-50 text-purple-700 px-4 py-2 rounded-full">
                  <i className="fas fa-building mr-2"></i>
                  <span className="font-medium">Informasi Perusahaan</span>
                </div>
              </div>

              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Perusahaan *
                </label>
                <input
                  id="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="PT. Contoh Indonesia"
                />
              </div>

              <div>
                <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Perusahaan *
                </label>
                <input
                  id="companyEmail"
                  type="email"
                  required
                  value={formData.companyEmail}
                  onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="hr@perusahaan.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industri *
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  >
                    <option value="">Pilih Industri</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ukuran Perusahaan *
                  </label>
                  <select
                    value={formData.companySize}
                    onChange={(e) => handleInputChange('companySize', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  >
                    <option value="">Pilih Ukuran</option>
                    {companySizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Website Perusahaan (Opsional)
                </label>
                <input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="https://perusahaan.com"
                />
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                Lanjut ke Data Akun
              </button>
            </div>
          )}

          {/* Step 2: Account Information */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="inline-flex items-center bg-purple-50 text-purple-700 px-4 py-2 rounded-full">
                  <i className="fas fa-user-tie mr-2"></i>
                  <span className="font-medium">Data Kontak & Akun</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Nama lengkap Anda"
                  />
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                    Posisi di Perusahaan *
                  </label>
                  <input
                    id="position"
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="HR Manager, Recruiter, dll."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="081234567890"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Pribadi untuk Login *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="email.anda@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Minimal 8 karakter"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Konfirmasi Password *
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Ulangi password"
                  />
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                  Saya menyetujui{' '}
                  <Link to="/terms" className="text-blue-500 hover:text-blue-600">
                    Syarat & Ketentuan
                  </Link>{' '}
                  dan{' '}
                  <Link to="/privacy" className="text-blue-500 hover:text-blue-600">
                    Kebijakan Privasi
                  </Link>{' '}
                  InklusiKerja *
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  Lanjut ke Verifikasi
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Verification */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center bg-purple-50 text-purple-700 px-4 py-2 rounded-full mb-4">
                  <i className="fas fa-envelope mr-2"></i>
                  <span className="font-medium">Verifikasi Email</span>
                </div>
                <i className="fas fa-envelope text-4xl text-blue-500 mb-3"></i>
                <p className="text-gray-600">
                  Kode verifikasi telah dikirim ke <strong>{formData.email}</strong>
                </p>
                <p className="text-sm text-green-600 mt-2">
                  Akun employer Anda akan mendapatkan akses ke dashboard khusus
                </p>
              </div>

              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Kode Verifikasi (6 digit) *
                </label>
                <input
                  id="verificationCode"
                  type="text"
                  required
                  value={formData.verificationCode}
                  onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono"
                  placeholder="123456"
                  maxLength="6"
                />
                <div className="text-xs text-gray-500 mt-1 text-center">
                  Masukkan 6 digit kode yang dikirim ke email Anda
                </div>
              </div>

              <div className="text-center">
                <button type="button" className="text-blue-500 hover:text-blue-600 text-sm">
                  Kirim ulang kode verifikasi
                </button>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-medium disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Membuat Akun...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle mr-2"></i>
                      Buat Akun Employer
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Accessibility Quick Options */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-3 flex items-center justify-center">
            <i className="fas fa-universal-access mr-2"></i>
            Opsi Aksesibilitas
          </h4>
          <div className="flex flex-wrap gap-2 justify-center">
            <button 
              className="text-sm bg-white text-blue-700 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-100 transition flex items-center gap-2"
              onClick={increaseFontSize}
              aria-label="Perbesar ukuran teks"
            >
              <i className="fas fa-text-height"></i>
              <span>A+</span>
            </button>
            <button 
              className="text-sm bg-white text-blue-700 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-100 transition flex items-center gap-2"
              onClick={decreaseFontSize}
              aria-label="Perkecil ukuran teks"
            >
              <i className="fas fa-text-height"></i>
              <span>A-</span>
            </button>
            <button 
              className="text-sm bg-white text-blue-700 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-100 transition flex items-center gap-2"
              onClick={resetFontSize}
              aria-label="Reset ukuran teks ke normal"
            >
              <i className="fas fa-undo-alt"></i>
              <span>Reset</span>
            </button>
            <button 
              className="text-sm bg-white text-blue-700 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-100 transition flex items-center gap-2"
              onClick={toggleHighContrast}
              aria-label="Toggle mode kontras tinggi"
            >
              <i className="fas fa-adjust"></i>
              <span>Kontras</span>
            </button>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Sudah punya akun employer?{' '}
            <Link 
              to="/employer/login" 
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Masuk di sini
            </Link>
          </p>
        </div>

        {/* Screen Reader Announcement */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Halaman registrasi employer. Silakan isi form pendaftaran perusahaan.
        </div>
      </div>
    </div>
  );
};

export default EmployerRegistrationPage;