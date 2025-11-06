// src/pages/ProfileLandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const ProfileLandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tarik perhatian rekruter dengan <span className="text-primary-600">Profil Jobstreet</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Buat profil dan bantu perusahaan mengenal Anda lebih mudah.  
            Dapatkan rekomendasi pekerjaan yang sesuai pengalaman dan keahlian Anda.
          </p>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Buat profil</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-circle text-primary-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bagian Profil Lengkap</h3>
              <p className="text-gray-600">
                Tampilkan data diri, pengalaman kerja, pendidikan, dan keahlian secara profesional
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-universal-access text-secondary-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Profil Inklusif</h3>
              <p className="text-gray-600">
                Sertakan informasi disabilitas dan kebutuhan aksesibilitas untuk mendapatkan akomodasi yang tepat
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-briefcase text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Rekomendasi Pekerjaan</h3>
              <p className="text-gray-600">
                Dapatkan rekomendasi lowongan yang sesuai dengan profil dan preferensi Anda
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-line text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tingkatkan Peluang</h3>
              <p className="text-gray-600">
                Profil lengkap meningkatkan 70% peluang dilirik oleh rekruter
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Profil sebagai tiket menuju pekerjaan impian
            </h2>
            <p className="text-primary-100 mb-6 text-lg">
              Mulai bangun profil profesional Anda sekarang dan buka peluang karir yang lebih luas
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
              >
                Daftar Sekarang
              </Link>
              <Link 
                to="/login"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition"
              >
                Masuk ke Akun
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
          <div>
            <div className="text-3xl font-bold text-primary-600">85%</div>
            <div className="text-gray-600">Lebih cepat dapat kerja</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-secondary-600">3x</div>
            <div className="text-gray-600">Lebih banyak dihubungi</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">70%</div>
            <div className="text-gray-600">Rekomendasi kerja tepat</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">50%</div>
            <div className="text-gray-600">Perusahaan inklusif</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileLandingPage;