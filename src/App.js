// src/App.js - Tambahkan route LowonganPage
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AccessibilityControls from './components/layout/AccessibilityControls';
import SkipLink from './components/common/SkipLink';
import LandingPage from './pages/LandingPage';
import LowonganPage from './pages/LowonganPage'; // Import halaman lowongan
import ProfilePage from './pages/ProfilePage';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <div className="App bg-gradient-to-br from-primary-50 to-secondary-50 text-dark font-sans min-h-screen">
        <SkipLink />
        <AccessibilityControls />
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/lowongan" element={<LowonganPage />} /> {/* Tambahkan route ini */}
          <Route path="/profile" element={<ProfilePage />} /> 
          {/* Tambahkan route lainnya di sini */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;