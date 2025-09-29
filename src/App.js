// src/App.js - SIMPLE VERSION untuk development
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AccessibilityControls from './components/layout/AccessibilityControls';
import SkipLink from './components/common/SkipLink';
import './styles/globals.css';

// Import semua pages
import LandingPage from './pages/LandingPage';
import LowonganPage from './pages/LowonganPage';
import ProfilePage from './pages/ProfilePage';
import ResumePage from './pages/ResumePage';
import LoginPage from './pages/auth/LoginPage';
import RegistrationPage from './pages/auth/RegistrationPage';
import VerificationPage from './pages/auth/VerificationPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import JobDetailPage from './pages/JobDetailPage';
import ApplicationForm from './pages/application/ApplicationForm';
import ApplicationHistory from './pages/application/ApplicationHistory';
import EmployerDashboard from './pages/employer/EmployerDashboard';

function App() {
  return (
    <Router>
      <div className="App bg-gradient-to-br from-primary-50 to-secondary-50 text-dark font-sans min-h-screen">
        <SkipLink />
        <AccessibilityControls />
        <Header />
        <Routes>
          {/* SEMUA ROUTES TERBUKA - tidak ada protected route */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/verification" element={<VerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/lowongan" element={<LowonganPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/resume" element={<ResumePage />} />
          
          <Route path="/lowongan/:id" element={<JobDetailPage />} />
          <Route path="/application/:id" element={<ApplicationForm />} />
          <Route path="/application/history" element={<ApplicationHistory />} />
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
 
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;