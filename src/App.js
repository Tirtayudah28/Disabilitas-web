// src/App.js - VERSI DIPERBAIKI
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { SearchProvider } from "./contexts/SearchContext";
import { ElevenLabsService } from './utils/elevenlabsService';

// Import semua components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import AccessibilityWidget from "./components/layout/AccessibilityWidget";
import AppLoading from "./components/layout/AppLoading";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import "./styles/globals.css";

import { speechController } from "./utils/speechController";

// Import semua pages
import JobLandingPage from "./pages/JobLandingPage";
import JobPage from "./pages/JobPage";
import CompaniesPage from "./pages/CompaniesPage";
import LoginPage from "./pages/auth/LoginPage";
import RegistrationPage from "./pages/auth/RegistrationPage";
import EmployerRegistrationPage from "./pages/auth/EmployerRegistrationPage";
import VerificationPage from "./pages/auth/VerificationPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import JobDetailPage from "./pages/JobDetailPage";
import ApplicationHistory from "./pages/candidate/ApplicationHistory";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import CompanyProfilePage from "./pages/employer/CompanyProfilePage";
import CandidatePage from "./pages/CandidatePage";

// IMPORT HALAMAN PROFILE
import ProfileLandingPage from "./pages/ProfileLandingPage";
import ProfilePage from "./pages/candidate/ProfilePage";
import { AuthProvider } from "./contexts/AuthContext";
import axios from "axios";
import CompleteGooglePage from "./pages/auth/CompleteGooglePage";
import EmployerOverviewPage from "./pages/employer/EmployerOverviewPage";
import EmployerJobPage from "./pages/employer/EmployerJobPage";
import EmployerApplicantPage from "./pages/employer/EmployerApplicantPage";
import PostJobPage from "./pages/employer/PostJobPage";
import ScrollToTop from "./scrollToTop";

// Voice Navigation Provider Component - SIMPLIFIED
const VoiceNavigationInitializer = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const location = useLocation(); 

  /* ===============================
      INISIALISASI VOICE SYSTEM
  =============================== */
  useEffect(() => {
    const initializeVoiceNav = async () => { // 🆕 Tambahkan async
      await testMicrophoneAccess();

      // Welcome message dengan ElevenLabs
      // setTimeout(async () => { // 🆕 Tambahkan async
      //   try {
      //     // 🆕 Gunakan ElevenLabs untuk welcome message
      //     const audioUrl = await ElevenLabsService.generateSpeech(
      //       'Selamat datang di Kerja Inklusif. ' +
      //       'Untuk navigasi suara, katakan "bantuan" untuk mendengar semua perintah yang tersedia. ' +
      //       'Atau coba katakan "baca halaman" untuk memulai.',
      //       {
      //         voiceId: '21m00Tcm4TlvDq8ikWAM',
      //         settings: {
      //           stability: 0.5,
      //           similarity_boost: 0.75,
      //           language: 'id',
      //           rate: 0.9
      //         }
      //       }
      //     );
          
      //     const audio = new Audio(audioUrl);
      //     audio.volume = 0.7;
      //     audio.play();
          
      //   } catch (error) {
      //     console.error('ElevenLabs welcome message failed:', error);
      //     // 🆕 Fallback ke Web Speech API
      //     if ("speechSynthesis" in window && !speechSynthesis.speaking) {
      //       const welcomeMessage = new SpeechSynthesisUtterance(
      //         'Selamat datang di Kerja Inklusif. ' +
      //         'Untuk navigasi suara, katakan "bantuan" untuk mendengar semua perintah yang tersedia. ' +
      //         'Atau coba katakan "baca halaman" untuk memulai.'
      //       );
      //       welcomeMessage.lang = "id-ID";
      //       welcomeMessage.rate = 0.9;
      //       welcomeMessage.volume = 0.7;
      //       speechSynthesis.speak(welcomeMessage);
      //     }
      //   }
      // }, 3000);
      // setTimeout(() => {
      //   // Langsung pakai Web Speech API tanpa coba ElevenLabs dulu
      //   if ("speechSynthesis" in window && !speechSynthesis.speaking) {
      //     const welcomeMessage = new SpeechSynthesisUtterance(
      //       'Selamat datang di Kerja Inklusif. ' +
      //       'Untuk navigasi suara, katakan "bantuan" untuk mendengar semua perintah yang tersedia.'
      //     );
      //     welcomeMessage.lang = "id-ID";
      //     welcomeMessage.rate = 0.9;
      //     welcomeMessage.volume = 0.7;
      //     speechSynthesis.speak(welcomeMessage);
      //   }
      // }, 3000);

      setIsInitialized(true);
    };

    const testMicrophoneAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        console.error("❌ Microphone access denied:", error);
        alert(
          "Akses mikrofon ditolak. Silakan izinkan akses mikrofon untuk menggunakan fitur suara."
        );
      }
    };

    const timer = setTimeout(() => {
      initializeVoiceNav();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  /* ===============================
      STOP BACAAN JIKA PINDAH HALAMAN MANUAL
  =============================== */
  useEffect(() => {
    speechController.markManualNavigation();
    speechController.stopIfManualNavigation();
  }, [location.pathname]);

  return children;
};

// Main App Content
const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showDebug, setShowDebug] = useState(
    process.env.NODE_ENV === "development"
  );

  const location = useLocation();

  useEffect(() => {
     const preloadVoices = async () => {
      try {
        await ElevenLabsService.getVoices();
        console.log('✅ ElevenLabs voices preloaded');
      } catch (error) {
        console.warn('⚠️ Failed to preload voices:', error);
      }
    };
    
    preloadVoices();

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // ⛔️ HENTIKAN SEMUA PEMBACAAN SAAT PINDAH HALAMAN
  useEffect(() => {
    speechController.stop();
    speechController.markManualNavigation();
  }, [location.pathname]);

  // Toggle debug panel dengan keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === "D") {
        setShowDebug((prev) => !prev);
        console.log("Debug panel toggled:", !showDebug);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showDebug]);

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/employer-register" ||
    location.pathname === "/verification" ||
    location.pathname === "/complete-google";

  const renderNavbar = () => {
    if (hideNavbar) return null;

    return <Header />;
  };

  if (isLoading) {
    return <AppLoading />;
  }

  return (
    <div className="App bg-gradient-to-br from-blue-50/50 to-gray-50 text-dark font-sans min-h-screen">
      {/* <SkipLink /> */}
      {renderNavbar()}

      {/* Hanya satu debug panel
      {showDebug && <SimpleDebugPanel />} */}

      <main id="main-content" className="min-h-screen">
        <ScrollToTop />
        <Routes>
          {/* auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route
            path="/employer-register"
            element={<EmployerRegistrationPage />}
          />
          <Route path="/verification" element={<VerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/complete-google" element={<CompleteGooglePage />} />

          {/* public routes */}
          <Route path="/" element={<JobLandingPage />} />
          <Route path="/profile" element={<ProfileLandingPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/candidates" element={<CandidatePage />} />
          <Route path="/jobs" element={<JobPage />} />
          <Route path="/job/:jobId" element={<JobDetailPage />} />

          {/* profile routes */}
          <Route path="/js/:userId" element={<ProfilePage />} />
          <Route path="/cm/:userId" element={<CompanyProfilePage />} />

          {/* job-seeker protected route */}
          <Route element={<ProtectedRoute requiredRole="job-seeker" />}>
            <Route path="/js/applications" element={<ApplicationHistory />} />
          </Route>

          {/* company protected routes */}
          <Route element={<ProtectedRoute requiredRole="company" />}>
            <Route path="/employer" element={<EmployerDashboard />}>
              <Route index element={<EmployerOverviewPage />} />
              <Route path="jobs" element={<EmployerJobPage />} />
              <Route path="jobs/post" element={<PostJobPage />} />
              <Route path="applications" element={<EmployerApplicantPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <AccessibilityWidget />
    </div>
  );
};

// Main App Component
function App() {
  //fatir: DEFAULT AXIOS SETTINGS
  axios.defaults.baseURL = "https://inkr-api.vercel.app";
  axios.defaults.withCredentials = true;
  return (
    <Provider store={store}>
      <AuthProvider>
        <SearchProvider>
          <Router>
            <VoiceNavigationInitializer>
              <AppContent />
            </VoiceNavigationInitializer>
          </Router>
        </SearchProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;