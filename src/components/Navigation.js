// src/components/Navigation.js - Contoh update navigasi
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navigation = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  
  return (
    <nav>
      {/* ... navigasi lainnya */}
      
      {/* Link ke profile akan menyesuaikan berdasarkan status login */}
      <Link to="/profile">
        {isAuthenticated ? 'Profil Saya' : 'Buat Profil'}
      </Link>
      
      {/* ... navigasi lainnya */}
    </nav>
  );
};

export default Navigation;