// src/pages/ProfileLandingPage.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileLandingPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/profile');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-secondary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge untuk website baru */}
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-fade-in">
              <i className="fas fa-star"></i>
              Platform Inklusif Terbaru di Indonesia
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="block">Mulai Karir Anda dengan</span>
              <span className="block">
                <span className="text-primary-600">Profil Digital</span>
                <span className="ml-2">yang Menonjol</span>
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Kami membangun platform pertama yang benar-benar memahami kebutuhan penyandang disabilitas.
              Buat profil profesional Anda dan mulai jelajahi peluang karir yang{" "}
              <span className="font-semibold text-primary-600">sesuai dengan kemampuan 
              dan kebutuhan aksesibilitas</span> Anda.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
              <Link
                to="/register"
                className="group relative px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 min-w-[200px] justify-center overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <i className="fas fa-user-plus"></i>
                  Buat Profil Gratis
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-secondary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                to="/login"
                className="group px-8 py-4 border-2 border-primary-600 text-primary-600 font-bold rounded-xl hover:bg-primary-50 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 min-w-[200px] justify-center"
              >
                <span className="flex items-center gap-3">
                  <i className="fas fa-sign-in-alt"></i>
                  Masuk ke Akun
                </span>
              </Link>
            </div>
            
            {/* Value Points */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-600">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-bolt text-blue-500"></i>
                </div>
                <span className="font-medium">Cepat & Mudah</span>
                <span className="text-xs">Hanya 5 menit</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-lock text-green-500"></i>
                </div>
                <span className="font-medium">100% Gratis</span>
                <span className="text-xs">Selamanya</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-universal-access text-purple-500"></i>
                </div>
                <span className="font-medium">Inklusif</span>
                <span className="text-xs">Dibangun untuk semua</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Platform yang{" "}
                <span className="text-primary-600">Benar-benar Berbeda</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Kami tidak hanya sekedar job portal, tetapi ekosistem yang mendukung
                sepenuhnya kebutuhan karir penyandang disabilitas
              </p>
            </div>
            
            {/* Value Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 - A11y First */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-blue-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center mb-6">
                    <i className="fas fa-universal-access text-primary-600 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Accessibility First
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Setiap fitur dirancang dengan mempertimbangkan berbagai kebutuhan aksesibilitas
                    sejak awal pengembangan
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      Navigasi keyboard friendly
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      Screen reader compatible
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      High contrast modes
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Card 2 - Smart Matching */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary-400 to-green-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-50 rounded-2xl flex items-center justify-center mb-6">
                    <i className="fas fa-robot text-secondary-600 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Smart Matching System
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Sistem kami memahami tidak hanya skill Anda, tetapi juga kebutuhan
                    aksesibilitas dan preferensi kerja
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      Matching berdasarkan kebutuhan khusus
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      Filter perusahaan inklusif
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      Rekomendasi personal
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Card 3 - Community */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-teal-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl flex items-center justify-center mb-6">
                    <i className="fas fa-users text-green-600 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Komunitas yang Mendukung
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Bergabung dengan komunitas profesional disabilitas yang saling
                    mendukung dan berbagi pengalaman
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      Forum diskusi karir
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      Mentoring sesama anggota
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      Sharing pengalaman
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Apa yang Bisa Anda Lakukan di{" "}
                <span className="text-primary-600">InklusiKerja?</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Platform lengkap untuk mengelola karir Anda dari awal hingga sukses
              </p>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: 'fas fa-id-card',
                  title: 'Buat Profil Menarik',
                  description: 'Tampilkan skill, pengalaman, dan pencapaian Anda dengan layout modern',
                  steps: ['Upload foto profesional', 'Isi data diri lengkap', 'Highlight pencapaian']
                },
                {
                  icon: 'fas fa-search',
                  title: 'Cari Pekerjaan Ideal',
                  description: 'Temukan lowongan dari perusahaan yang benar-benar inklusif',
                  steps: ['Filter berdasarkan kebutuhan', 'Cari perusahaan ramah', 'Simpan favorit']
                },
                {
                  icon: 'fas fa-bell',
                  title: 'Dapatkan Notifikasi',
                  description: 'Dapatkan pemberitahuan saat ada lowongan yang sesuai profil Anda',
                  steps: ['Notifikasi real-time', 'Email alert', 'Mobile push notification']
                },
                {
                  icon: 'fas fa-file-alt',
                  title: 'Lamar dengan Mudah',
                  description: 'Lamar pekerjaan dengan satu klik menggunakan profil yang sudah lengkap',
                  steps: ['Profil otomatis terisi', 'Lampirkan dokumen', 'Tracking status']
                },
                {
                  icon: 'fas fa-chart-line',
                  title: 'Track Progress',
                  description: 'Pantau perkembangan aplikasi Anda dan analisis peluang',
                  steps: ['Dashboard aplikasi', 'Statistik pelamar', 'Tips improvement']
                },
                {
                  icon: 'fas fa-comments',
                  title: 'Komunikasi Langsung',
                  description: 'Terhubung langsung dengan rekruter melalui platform',
                  steps: ['Chat terintegrasi', 'Jadwal interview', 'Feedback langsung']
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <i className={`${feature.icon} text-primary-600 text-xl`}></i>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">{feature.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{feature.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {feature.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-blue-600">{stepIndex + 1}</span>
                        </div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <span className="text-primary-600 text-sm font-semibold group-hover:ml-2 transition-all duration-300 inline-flex items-center gap-1">
                      Pelajari cara kerjanya
                      <i className="fas fa-chevron-right text-xs"></i>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Early Adopter Benefits 
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-semibold mb-6">
                <i className="fas fa-gem"></i>
                Keuntungan Pengguna Awal
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold text-white mb-4">
                Bergabung Sekarang, Dapatkan Keuntungan Spesial
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Sebagai pengguna pertama, Anda akan mendapatkan akses eksklusif ke fitur-fitur premium
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-crown text-yellow-500 text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Priority Support</h3>
                <p className="text-white/80 mb-4">
                  Dukungan langsung dari tim kami untuk membantu Anda sukses
                </p>
                <div className="text-white font-semibold text-sm">
                  <i className="fas fa-clock mr-2"></i>
                  Respons dalam 1 jam
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-star text-primary-600 text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Early Bird Features</h3>
                <p className="text-white/80 mb-4">
                  Akses pertama ke fitur-fitur baru sebelum tersedia untuk umum
                </p>
                <div className="text-white font-semibold text-sm">
                  <i className="fas fa-rocket mr-2"></i>
                  Beta tester privileges
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-gift text-green-500 text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Influence Development</h3>
                <p className="text-white/80 mb-4">
                  Suara Anda akan membantu kami membangun platform yang lebih baik
                </p>
                <div className="text-white font-semibold text-sm">
                  <i className="fas fa-comment-dots mr-2"></i>
                  Vote untuk fitur baru
                </div>
              </div>
            </div> */}
            
            {/* Community Preview */}
            {/* <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-users text-primary-600 text-3xl"></i>
                </div>
                <div className="text-center md:text-left">
                  <h4 className="text-white font-bold text-xl mb-2">
                    Bergabung dengan Komunitas Pertama Kami
                  </h4>
                  <p className="text-white/80">
                    Jadilah bagian dari komunitas awal yang akan membentuk masa depan
                    platform ini. Feedback Anda sangat berharga bagi kami.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary-100 rounded-full translate-y-16 -translate-x-16 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white text-primary-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <i className="fas fa-calendar-alt"></i>
                  Bergabung sekarang - Spesial untuk pengguna awal
                </div>
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Siap Membangun Masa Depan Bersama Kami?
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Ini bukan hanya tentang membuat profil. Ini tentang memulai perjalanan
                  menuju karir yang lebih inklusif dan berdaya.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/register"
                    className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold rounded-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 justify-center text-lg"
                  >
                    <span className="flex items-center gap-3">
                      <i className="fas fa-user-plus"></i>
                      Bergabung Sekarang - Gratis
                    </span>
                    <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform duration-300"></i>
                  </Link>
                  
                  <Link
                    to="/login"
                    className="px-8 py-4 border-2 border-primary-600 text-primary-600 font-bold rounded-xl hover:bg-primary-50 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 justify-center text-lg"
                  >
                    <span className="flex items-center gap-3">
                      <i className="fas fa-play-circle"></i>
                      Lihat Demo Platform
                    </span>
                  </Link>
                </div>
                
                <div className="mt-8 text-sm text-gray-500">
                  <div className="flex flex-wrap justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      <span>Tidak perlu kartu kredit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      <span>Batal kapan saja</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      <span>Dapat bantuan langsung</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default ProfileLandingPage;