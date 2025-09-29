// src/components/sections/QuickSearch.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const QuickSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', { searchTerm, location });
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-light rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-primary-700">
            Temukan Lowongan yang Tepat untuk Anda
          </h2>
          
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Posisi, keahlian, atau perusahaan"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex-1">
              <select 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Lokasi atau Remote</option>
                <option value="remote">Remote</option>
                <option value="jakarta">Jakarta</option>
                <option value="bandung">Bandung</option>
                <option value="surabaya">Surabaya</option>
              </select>
            </div>
            <button 
              type="submit"
              className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition font-medium"
            >
              <i className="fas fa-search mr-2"></i>Cari
            </button>
          </form>
          
          <div className="text-center">
            <Link to="/lowongan" className="text-primary-600 hover:underline font-medium">
              Lihat semua lowongan →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickSearch;