// src/pages/auth/RegistrationPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'candidate',
    
    // Step 2: Personal Info
    fullName: '',
    disabilityType: '',
    accessibilityNeeds: [],
    
    // Step 3: Verification
    verificationCode: ''
  });
  
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle registration logic
    console.log('Registration data:', formData);
    navigate('/verification');
  };

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

        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Informasi Dasar</span>
            <span>Data Pribadi</span>
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
          {/* Step 1: Basic Information */}
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
                  placeholder="email@example.com"
                />
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Minimal 8 karakter"
                />
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
                />
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition font-medium"
              >
                Lanjut
              </button>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Data Pribadi</h3>

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
                />
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
                >
                  <option value="">Pilih jenis disabilitas</option>
                  {disabilityTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kebutuhan Aksesibilitas
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {accessibilityNeeds.map(need => (
                    <label key={need} className="flex items-center p-2 hover:bg-gray-50 rounded">
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
                  className="flex-1 bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition font-medium"
                >
                  Lanjut
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Verification */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Verifikasi Akun</h3>
              
              <div className="text-center">
                <i className="fas fa-envelope text-4xl text-primary-500 mb-3"></i>
                <p className="text-gray-600">
                  Kode verifikasi telah dikirim ke <strong>{formData.email}</strong>
                </p>
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
                />
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
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition font-medium"
                >
                  Buat Akun
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;