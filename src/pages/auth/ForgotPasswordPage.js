// src/pages/auth/ForgotPasswordPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const navigate = useNavigate();

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Verification code sent to:', formData.email);
      setStep(2);
      setCountdown(60);
      setCanResend(false);
    } catch (error) {
      console.error('Failed to send code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Code verified:', formData.verificationCode);
      setStep(3);
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Password reset successful');
      navigate('/login', { 
        state: { message: 'Password berhasil direset. Silakan login dengan password baru.' }
      });
    } catch (error) {
      console.error('Password reset failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    setCountdown(60);
    setCanResend(false);
    console.log('Resending code to:', formData.email);
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
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-gray-600">
            {step === 1 && 'Masukkan email untuk mendapatkan kode verifikasi'}
            {step === 2 && 'Masukkan kode verifikasi yang dikirim ke email Anda'}
            {step === 3 && 'Buat password baru untuk akun Anda'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className={step >= 1 ? 'text-primary-600 font-medium' : ''}>Email</span>
            <span className={step >= 2 ? 'text-primary-600 font-medium' : ''}>Verifikasi</span>
            <span className={step >= 3 ? 'text-primary-600 font-medium' : ''}>Password Baru</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <form onSubmit={handleSendCode} className="space-y-4">
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
                  placeholder="email@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition font-medium disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Mengirim Kode...
                  </>
                ) : (
                  'Kirim Kode Verifikasi'
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium text-sm">
                ← Kembali ke halaman login
              </Link>
            </div>
          </div>
        )}

        {/* Step 2: Code Verification */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-center mb-4">
              <p className="text-gray-600">
                Kode verifikasi telah dikirim ke
              </p>
              <p className="font-medium text-primary-600">{formData.email}</p>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Masukkan 6-digit kode verifikasi
                </label>
                <input
                  type="text"
                  required
                  value={formData.verificationCode}
                  onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-center text-lg font-mono"
                  placeholder="123456"
                  maxLength="6"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || formData.verificationCode.length !== 6}
                className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition font-medium disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Memverifikasi...
                  </>
                ) : (
                  'Verifikasi Kode'
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Tidak menerima kode?{' '}
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-primary-500 hover:text-primary-600 font-medium"
                  >
                    Kirim ulang
                  </button>
                ) : (
                  <span className="text-gray-500">
                    Kirim ulang dalam {countdown}s
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Password Baru *
                </label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Minimal 8 karakter"
                  minLength="8"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Gunakan kombinasi huruf, angka, dan simbol untuk keamanan lebih baik
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Konfirmasi Password Baru *
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ketik ulang password baru"
                />
                {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    Password tidak cocok
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || formData.newPassword !== formData.confirmPassword || formData.newPassword.length < 8}
                className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition font-medium disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Reset Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Accessibility Notice */}
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-blue-700 text-sm">
            <i className="fas fa-info-circle mr-1"></i>
            Butuh bantuan aksesibilitas?{' '}
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              Hubungi support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;