// src/pages/auth/LoginPage.js - VERSI REDUX
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/authSlice'; // IMPORT REDUX ACTION

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    userType: 'candidate'
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // AMBIL STATE DARI REDUX
  const { isLoading, error } = useSelector(state => state.auth);
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // DISPATCH REDUX ACTION
    const result = await dispatch(login({
      email: formData.email,
      password: formData.password,
      userType: formData.userType
    }));

    // CEK JIKA LOGIN BERHASIL
    if (login.fulfilled.match(result)) {
      // Redirect berdasarkan user type yang dipilih
      if (formData.userType === 'employer') {
        navigate('/employer/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
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
          <h2 className="text-3xl font-bold text-gray-900">Masuk ke Akun Anda</h2>
          <p className="mt-2 text-gray-600">
            Selamat datang kembali di platform inklusif
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

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* User Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Masuk Sebagai *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleInputChange('userType', 'candidate')}
                className={`p-4 border rounded-lg text-center transition ${
                  formData.userType === 'candidate'
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
                disabled={isLoading}
              >
                <i className="fas fa-user-graduate block text-2xl mb-2"></i>
                <span className="block text-sm font-medium">Pencari Kerja</span>
                <span className="block text-xs text-gray-500 mt-1">Disabilitas</span>
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('userType', 'employer')}
                className={`p-4 border rounded-lg text-center transition ${
                  formData.userType === 'employer'
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
                disabled={isLoading}
              >
                <i className="fas fa-building block text-2xl mb-2"></i>
                <span className="block text-sm font-medium">Perusahaan</span>
                <span className="block text-xs text-gray-500 mt-1">Employer</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {formData.userType === 'employer' ? 'Email Perusahaan *' : 'Alamat Email *'}
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder={formData.userType === 'employer' ? "hr@perusahaan.com" : "email@example.com"}
                disabled={isLoading}
                aria-describedby="email-help"
              />
              <div id="email-help" className="text-xs text-gray-500 mt-1">
                {formData.userType === 'employer' 
                  ? 'Masukkan email perusahaan yang terdaftar' 
                  : 'Masukkan alamat email yang Anda daftarkan'
                }
              </div>
            </div>

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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Masukkan password Anda"
                disabled={isLoading}
                aria-describedby="password-help"
              />
              <div id="password-help" className="text-xs text-gray-500 mt-1">
                Password harus minimal 8 karakter
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-700">Ingat saya</span>
              </label>
              
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                disabled={isLoading}
              >
                Lupa password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition font-medium disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Memproses...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Masuk sebagai {formData.userType === 'employer' ? 'Employer' : 'Pencari Kerja'}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-700 text-sm">
            <strong>Untuk Demo:</strong> Pilih role dan isi email & password apa saja
          </p>
          <p className="text-blue-600 text-xs mt-1">
            {formData.userType === 'employer' 
              ? 'Akan login sebagai Employer dan redirect ke Dashboard' 
              : 'Akan login sebagai Pencari Kerja dan redirect ke Beranda'
            }
          </p>
        </div>

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

        {/* Registration Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Belum punya akun?{' '}
            <Link 
              to="/register" 
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              Daftar sebagai {formData.userType === 'employer' ? 'Employer' : 'Pencari Kerja'}
            </Link>
          </p>
        </div>

        {/* Screen Reader Announcement */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Halaman login. Pilih tipe pengguna dan masukkan email serta password.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;