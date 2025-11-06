// src/components/ProfileWrapper.js - VERSI FIXED
import React from 'react';
import { useSelector } from 'react-redux';
import ProfileLandingPage from '../pages/ProfileLandingPage';
import ProfilePage from '../pages/ProfilePage';

const ProfileWrapper = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  
  // Jika belum login, tampilkan landing page
  if (!isAuthenticated) {
    return <ProfileLandingPage />;
  }
  
  // Jika sudah login, tampilkan profile page lengkap
  return <ProfilePage />;
};

export default ProfileWrapper;