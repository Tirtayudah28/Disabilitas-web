// src/components/auth/ProtectedRoute.js - PERBAIKI UNTUK ALLOW GUEST ACCESS KE LOWONGAN
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowGuest = false }) => {
  // Cek authentication dari localStorage
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  
  // Jika route mengizinkan guest (seperti /lowongan), biarkan akses
  if (allowGuest) {
    return children;
  }
  
  // Jika route protected dan user belum login, redirect ke login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;