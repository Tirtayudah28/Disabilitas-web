// src/components/layout/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-dark to-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-primary-500 to-accent-500 w-10 h-10 rounded-full flex items-center justify-center">
                <i className="fas fa-hands-helping text-white"></i>
              </div>
              <span className="text-xl font-bold">InklusiKerja</span>
            </div>
            <p className="text-gray-300 mb-4">
              Platform pencocokan kerja inklusif pertama di Indonesia yang menghubungkan penyandang disabilitas dengan perusahaan yang peduli.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition flex items-center gap-2">
                  <i className="fas fa-chevron-right text-xs"></i> Beranda
                </Link>
              </li>
              <li>
                <Link to="/lowongan" className="text-gray-300 hover:text-white transition flex items-center gap-2">
                  <i className="fas fa-chevron-right text-xs"></i> Cari Lowongan
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-white transition flex items-center gap-2">
                  <i className="fas fa-chevron-right text-xs"></i> Profil Saya
                </Link>
              </li>
              <li>
                <Link to="/resume" className="text-gray-300 hover:text-white transition flex items-center gap-2">
                  <i className="fas fa-chevron-right text-xs"></i> Resume Saya
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">Dukungan</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/bantuan" className="text-gray-300 hover:text-white transition flex items-center gap-2">
                  <i className="fas fa-chevron-right text-xs"></i> Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition flex items-center gap-2">
                  <i className="fas fa-chevron-right text-xs"></i> Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition flex items-center gap-2">
                  <i className="fas fa-chevron-right text-xs"></i> Kontak & Dukungan
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Kontak Kami</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-2 text-gray-300"></i>
                <span className="text-gray-300">info@inklusikerja.id</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone mt-1 mr-2 text-gray-300"></i>
                <span className="text-gray-300">(021) 1234-5678</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; 2023 InklusiKerja. Semua hak dilindungi. Dibuat dengan{' '}
            <i className="fas fa-heart text-red-500"></i> untuk inklusivitas.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;