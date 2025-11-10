// src/pages/auth/RegistrationPage.js - VERSI SEDERHANA DENGAN GOOGLE DAN EMAIL
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/authSlice';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    disabilityType: '',
    userType: 'candidate' // Hanya untuk user disabilitas
  });

  const [showEmailForm, setShowEmailForm] = useState(false);
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

  const handleGoogleRegister = () => {
    setIsLoading(true);
    setError('');

    // Simulasi registrasi dengan Google
    const googleUserData = {
      email: 'user.disabilitas@gmail.com',
      password: 'google-auth',
      userType: 'candidate',
      name: 'User Disabilitas',
      disabilityType: formData.disabilityType || 'Disabilitas Lainnya'
    };

    dispatch(login(googleUserData)).then((result) => {
      setIsLoading(false);
      if (login.fulfilled.match(result)) {
        navigate('/profile'); // Redirect ke profile untuk complete data
      }
    });
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.email || !formData.fullName || !formData.disabilityType) {
      setError('Semua field harus diisi');
      setIsLoading(false);
      return;
    }

    try {
      // Simulasi mengirim kode verifikasi via email
      console.log('Mengirim kode verifikasi ke:', formData.email);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const emailUserData = {
        email: formData.email,
        password: 'email-verification',
        userType: 'candidate',
        name: formData.fullName,
        disabilityType: formData.disabilityType
      };

      const result = await dispatch(login(emailUserData));

      if (login.fulfilled.match(result)) {
        navigate('/profile');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 w-12 h-12 rounded-full flex items-center justify-center shadow-md">
              <i className="fas fa-hands-helping text-white text-xl"></i>
            </div>
            <span className="text-2xl font-bold text-blue-700">InklusiKerja</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Akun Baru</h1>
          <p className="text-gray-600">
            Bergabung dengan platform pencarian kerja inklusif
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

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* User Type Badge - Hanya untuk user disabilitas */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
              <i className="fas fa-wheelchair mr-2"></i>
              <span className="font-medium">Akun Pencari Kerja Disabilitas</span>
            </div>
          </div>

          {/* Google Register Button */}
          <div>
            <button
              onClick={handleGoogleRegister}
              disabled={isLoading}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 shadow-sm text-lg"
            >
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <span>Daftar dengan Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">atau</span>
            </div>
          </div>

          {/* Email Register Section */}
          {!showEmailForm ? (
            <div className="text-center">
              <button
                onClick={() => setShowEmailForm(true)}
                className="w-full bg-blue-500 text-white py-4 rounded-xl hover:bg-blue-600 transition-all duration-200 font-medium flex items-center justify-center gap-3 shadow-md text-lg"
              >
                <i className="fas fa-envelope"></i>
                <span>Daftar dengan Email</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailRegister} className="space-y-4">
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
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-lg"
                  placeholder="Masukkan nama lengkap Anda"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Email *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-lg"
                  placeholder="email@example.com"
                  disabled={isLoading}
                />
              </div>
{/* 
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Disabilitas *
                </label>
                <select
                  value={formData.disabilityType}
                  onChange={(e) => handleInputChange('disabilityType', e.target.value)}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-lg"
                  required
                  disabled={isLoading}
                >
                  <option value="">Pilih jenis disabilitas</option>
                  {disabilityTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="text-xs text-gray-500 mt-1">
                  Informasi ini membantu kami menyediakan akomodasi yang tepat
                </div>
              </div> */}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-4 rounded-xl hover:bg-blue-600 transition-all duration-200 font-medium disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center shadow-md text-lg"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Mendaftarkan...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Kirim kode verifikasi melalui email
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className="w-full text-gray-600 py-2 rounded-lg hover:text-gray-800 transition-colors font-medium"
                disabled={isLoading}
              >
                ← Kembali ke pilihan daftar
              </button>
            </form>
          )}
        </div>

        {/* Demo Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-700 text-sm font-medium">
            <i className="fas fa-info-circle mr-1"></i>
            Untuk Demo Registrasi
          </p>
          <div className="text-blue-600 text-xs mt-2 space-y-1">
            <p><strong>Google:</strong> Klik tombol Google untuk daftar cepat</p>
            <p><strong>Email:</strong> Isi form lalu klik "Kirim kode verifikasi"</p>
            <p><strong>Redirect:</strong> Akan langsung ke halaman profil</p>
          </div>
        </div>

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
            Sudah punya akun?{' '}
            <Link 
              to="/login" 
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Masuk di sini
            </Link>
          </p>
        </div>

        {/* Screen Reader Announcement */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Halaman registrasi untuk platform InklusiKerja. Daftar dengan Google atau email untuk pencari kerja disabilitas.
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;  