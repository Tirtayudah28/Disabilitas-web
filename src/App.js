// src/App.js - PERBAIKAN DENGAN IMPORT YANG LENGKAP
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Import semua components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AccessibilityWidget from './components/layout/AccessibilityWidget'; // ← TAMBAHKAN INI
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
import JobPostingPage from './pages/employer/JobPostingPage';
import ApplicationManagementPage from './pages/employer/ApplicationManagementPage';
import CompanyProfilePage from './pages/employer/CompanyProfilePage';
import CandidateSearchPage from './pages/employer/CandidateSearchPage';
import InterviewSchedulingPage from './pages/employer/InterviewSchedulingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App bg-gradient-to-br from-primary-50 to-secondary-50 text-dark font-sans min-h-screen">
          <SkipLink />
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
            
            {/* PERBAIKAN: Pisahkan route untuk detail lowongan dan apply */}
            <Route path="/lowongan/:id" element={<JobDetailPage />} />
            <Route path="/lowongan/:id/apply" element={<ApplicationForm />} />
            <Route path="/application/history" element={<ApplicationHistory />} />

            {/* Employer Dashboard */}
            <Route path="/employer/dashboard" element={<EmployerDashboard />} />
            <Route path="/employer/job-posting" element={<JobPostingPage />} />
            <Route path="/employer/applications" element={<ApplicationManagementPage />} />
            <Route path="/employer/profile" element={<CompanyProfilePage />} />
            <Route path="/employer/candidates" element={<CandidateSearchPage />} />
            <Route path="/employer/interviews" element={<InterviewSchedulingPage />} />
  
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
          <AccessibilityWidget />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;