// src/pages/auth/EmployerLoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/authSlice';

const EmployerLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isLoading, error } = useSelector(state => state.auth);
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    const result = await dispatch(login({
      email: formData.email,
      password: formData.password,
      userType: 'employer'
    }));

    if (login.fulfilled.match(result)) {
      navigate('/employer/dashboard', { replace: true });
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password', { state: { userType: 'employer' } });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-full flex items-center justify-center shadow-md">
              <i className="fas fa-hands-helping text-white text-xl"></i>
            </div>
            <span className="text-2xl font-bold text-blue-700">InklusiKerja</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Masuk Employer</h1>
          <p className="text-gray-600">
            Akses dashboard perusahaan Anda
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
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* Employer Badge */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center bg-purple-50 text-purple-700 px-4 py-2 rounded-full">
              <i className="fas fa-building mr-2"></i>
              <span className="font-medium">Akun Perusahaan / Employer</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Login dengan email perusahaan yang terdaftar
            </p>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Perusahaan *
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-lg"
                placeholder="hr@perusahaan.com"
                disabled={isLoading}
                aria-describedby="email-help"
              />
              <div id="email-help" className="text-xs text-gray-500 mt-1">
                Masukkan email perusahaan yang terdaftar
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
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-lg"
                placeholder="Masukkan password Anda"
                disabled={isLoading}
                aria-describedby="password-help"
              />
              <div id="password-help" className="text-xs text-gray-500 mt-1">
                Password harus minimal 8 karakter
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-700">Ingat saya</span>
              </label>
              
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
                disabled={isLoading}
              >
                Lupa password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-4 rounded-xl hover:bg-blue-600 transition-all duration-200 font-medium disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center shadow-md text-lg"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Memproses...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Masuk ke Dashboard Employer
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-700 text-sm font-medium">
            <i className="fas fa-info-circle mr-1"></i>
            Untuk Demo Login Employer
          </p>
          <div className="text-blue-600 text-xs mt-2 space-y-1">
            <p><strong>Email:</strong> Isi email perusahaan (format: ...@...com)</p>
            <p><strong>Password:</strong> Isi password apa saja (min. 8 karakter)</p>
            <p><strong>Redirect:</strong> Akan langsung ke Dashboard Employer</p>
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

        {/* Links */}
        <div className="text-center space-y-3">
          <p className="text-gray-600">
            Belum punya akun employer?{' '}
            <Link 
              to="/employer/register" 
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Daftar sebagai Employer
            </Link>
          </p>
          <p className="text-gray-600">
            Pencari kerja disabilitas?{' '}
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
          Halaman login employer. Masuk dengan email dan password perusahaan.
        </div>
      </div>
    </div>
  );
};

export default EmployerLoginPage;