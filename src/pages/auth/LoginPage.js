// src/pages/auth/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect setelah login berhasil
  const from = location.state?.from?.pathname || '/dashboard';

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication - in real app, this would be API call
      if (formData.email && formData.password) {
        console.log('Login successful:', formData);
        navigate(from, { replace: true });
      } else {
        setError('Email dan password harus diisi');
      }
    } catch (err) {
      setError('Login gagal. Periksa email dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleSocialLogin = (provider) => {
    console.log(`Social login with: ${provider}`);
    // Implement social login logic
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
            {from !== '/dashboard' 
              ? 'Silakan masuk untuk melanjutkan' 
              : 'Selamat datang kembali di platform inklusif'
            }
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle text-red-500 mr-3"></i>
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Social Login Options */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              disabled={isLoading}
            >
              <i className="fab fa-google text-red-500 mr-2"></i>
              <span className="text-sm font-medium">Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('linkedin')}
              className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              disabled={isLoading}
            >
              <i className="fab fa-linkedin text-blue-600 mr-2"></i>
              <span className="text-sm font-medium">LinkedIn</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">atau masuk dengan email</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="email@example.com"
                disabled={isLoading}
              />
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Masukkan password Anda"
                disabled={isLoading}
              />
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
                'Masuk'
              )}
            </button>
          </form>
        </div>

        {/* Accessibility Quick Options */}
        <div className="bg-primary-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-primary-900 mb-2 flex items-center">
            <i className="fas fa-universal-access mr-2"></i>
            Opsi Aksesibilitas Cepat
          </h4>
          <div className="flex flex-wrap gap-2">
            <button 
              className="text-xs bg-white text-primary-700 px-2 py-1 rounded border border-primary-200 hover:bg-primary-100 transition"
              onClick={() => {/* Implement text size increase */}}
            >
              <i className="fas fa-text-height mr-1"></i>Teks Besar
            </button>
            <button 
              className="text-xs bg-white text-primary-700 px-2 py-1 rounded border border-primary-200 hover:bg-primary-100 transition"
              onClick={() => {/* Implement high contrast */}}
            >
              <i className="fas fa-adjust mr-1"></i>Kontras Tinggi
            </button>
            <button 
              className="text-xs bg-white text-primary-700 px-2 py-1 rounded border border-primary-200 hover:bg-primary-100 transition"
              onClick={() => {/* Implement screen reader */}}
            >
              <i className="fas fa-assistive-listening-systems mr-1"></i>Baca Halaman
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-600">
            Belum punya akun?{' '}
            <Link 
              to="/register" 
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              Daftar di sini
            </Link>
          </p>
        </div>

        {/* Demo Accounts Hint */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-700 text-sm">
            <strong>Demo:</strong> Gunakan email dan password apa saja untuk mencoba
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;