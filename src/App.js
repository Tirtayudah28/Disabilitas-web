// src/App.js - VERSI SUDAH DIPERBAIKI
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store'; // IMPORT REDUX STORE

// Import semua components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AccessibilityWidget from './components/layout/AccessibilityWidget';
import SkipLink from './components/common/SkipLink';
import AppLoading from './components/layout/AppLoading';
import './styles/globals.css';

// Import semua pages
import LowonganLandingPage from './pages/LowonganLandingPage';
import LowonganPage from './pages/LowonganPage';
import ResumePage from './pages/ResumePage';
import CompaniesPage from './pages/CompaniesPage'; // ← PERBAIKAN: Import yang benar
import LoginPage from './pages/auth/LoginPage';
import EmployerLoginPage from './pages/auth/EmployerLoginPage';
import RegistrationPage from './pages/auth/RegistrationPage';
import EmployerRegistrationPage from './pages/auth/EmployerRegistrationPage';
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
import ProfileWrapper from './components/ProfileWrapper';

function App() {
  const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
    // Simulasi loading resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 detik loading

    return () => clearTimeout(timer);
  }, []);

  // Tampilkan loading screen
  if (isLoading) {
    return <AppLoading />;
  }

  return (
    <Provider store={store}>
      <Router>
        <div className="App bg-gradient-to-br from-primary-50 to-secondary-50 text-dark font-sans min-h-screen">
          <SkipLink />
          <Header />
          
          {/* Main Content Area */}
          <main id="main-content" className="min-h-screen">
            <Routes>
              {/* SEMUA ROUTES TERBUKA - tidak ada protected route */}
              <Route path="/" element={<LowonganLandingPage />} />
              <Route path="/lowongan-landing" element={<LowonganLandingPage />} />
              <Route path="/lowongan" element={<LowonganPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/employer/login" element={<EmployerLoginPage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/employer/register" element={<EmployerRegistrationPage />} />
              <Route path="/verification" element={<VerificationPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/lowongan" element={<LowonganPage />} />
              
              {/* PERBAIKAN: Gunakan ProfileWrapper untuk /profile */}
              <Route path="/profile" element={<ProfileWrapper />} />
              
              {/* Routes lainnya */}
              <Route path="/resume" element={<ResumePage />} />
              <Route path="/companies" element={<CompaniesPage />} /> {/* ← SUDAH BISA */}
              
              {/* Route untuk detail lowongan dan apply */}
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
          </main>
          
          <Footer />
          <AccessibilityWidget />
        </div>
      </Router>
    </Provider>
  );
}

export default App;