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

// Import semua components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import AccessibilityWidget from "./components/layout/AccessibilityWidget";
import AppLoading from "./components/layout/AppLoading";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import "./styles/globals.css";

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
import CandidateSearchPage from "./pages/employer/CandidateSearchPage";

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

  useEffect(() => {
    const initializeVoiceNav = () => {
      console.log("🚀 Initializing voice navigation with wake word...");

      // Test microphone access first
      testMicrophoneAccess();

      // Welcome message
      setTimeout(() => {
        if ("speechSynthesis" in window) {
          const welcomeMessage = new SpeechSynthesisUtterance(
            'Selamat datang di Kerja Inklusif. Sistem wake word telah aktif. Katakan "Oke Inklusi" untuk memulai percakapan dengan asisten.'
          );
          welcomeMessage.lang = "id-ID";
          welcomeMessage.rate = 0.9;
          welcomeMessage.volume = 0.7;

          if (!speechSynthesis.speaking) {
            speechSynthesis.speak(welcomeMessage);
          }
        }
      }, 3000);

      setIsInitialized(true);
    };

    // Test microphone function
    const testMicrophoneAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        console.log("🎤 Microphone access granted");
        stream.getTracks().forEach((track) => track.stop()); // Clean up
      } catch (error) {
        console.error("❌ Microphone access denied:", error);
        alert(
          "Akses mikrofon ditolak. Silakan izinkan akses mikrofon untuk menggunakan fitur suara."
        );
      }
    };

    const timer = setTimeout(initializeVoiceNav, 2000);
    return () => clearTimeout(timer);
  }, []);

  return children;
};

// Simple Debug Component - DIPISAHKAN
const SimpleDebugPanel = () => {
  const [debugInfo, setDebugInfo] = useState({
    isListening: false,
    transcript: "",
    isProcessing: false,
    lastCommand: "",
  });

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "id-ID";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTestVoice = () => {
    speakText("Sistem suara bekerja dengan baik. Debug panel aktif.");
  };

  // Listen for voice events from AccessibilityWidget
  useEffect(() => {
    const handleVoiceEvent = (event) => {
      if (event.detail && event.detail.type === "voiceUpdate") {
        setDebugInfo((prev) => ({
          ...prev,
          ...event.detail.data,
        }));
      }
    };

    window.addEventListener("voiceDebugUpdate", handleVoiceEvent);
    return () =>
      window.removeEventListener("voiceDebugUpdate", handleVoiceEvent);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        left: "10px",
        background: "rgba(0,0,0,0.9)",
        color: "white",
        padding: "15px",
        borderRadius: "8px",
        zIndex: 10000,
        fontSize: "12px",
        maxWidth: "350px",
        border: "2px solid #00ff88",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          marginBottom: "10px",
          fontWeight: "bold",
          color: "#00ff88",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span>🎤 Simple Debug Panel</span>
        <span
          style={{
            background: debugInfo.isListening ? "#00ff88" : "#ff4444",
            color: "black",
            padding: "2px 6px",
            borderRadius: "10px",
            fontSize: "10px",
            fontWeight: "bold",
          }}
        >
          {debugInfo.isListening ? "LIVE" : "IDLE"}
        </span>
      </div>

      <div style={{ display: "grid", gap: "4px", marginBottom: "10px" }}>
        <div>
          Status:{" "}
          <strong>
            {debugInfo.isListening ? "🔴 Mendengarkan..." : "🟢 Siap"}
          </strong>
        </div>
        <div>
          Processing:{" "}
          <strong>
            {debugInfo.isProcessing ? "⏳ Memproses..." : "✅ Selesai"}
          </strong>
        </div>
        <div>
          Transcript: <strong>"{debugInfo.transcript || "-"}"</strong>
        </div>
        <div>
          Last Command: <strong>"{debugInfo.lastCommand || "-"}"</strong>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button
          onClick={handleTestVoice}
          style={{
            padding: "6px 12px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: "bold",
          }}
        >
          Test Suara
        </button>

        <button
          onClick={() => speakText("Ini adalah test navigasi suara")}
          style={{
            padding: "6px 12px",
            background: "#ff8800",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: "bold",
          }}
        >
          Test Navigasi
        </button>

        <button
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("voiceCommand", {
                detail: { command: "bantuan" },
              })
            );
          }}
          style={{
            padding: "6px 12px",
            background: "#00ff88",
            color: "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: "bold",
          }}
        >
          Test Bantuan
        </button>
      </div>
    </div>
  );
};

// Main App Content
const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showDebug, setShowDebug] = useState(
    process.env.NODE_ENV === "development"
  );

  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
    <div className="App bg-gradient-to-br from-primary-50 to-secondary-50 text-dark font-sans min-h-screen">
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
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/profile" element={<ProfileLandingPage />} />
          <Route path="/jobs" element={<JobPage />} />
          <Route path="/job/:jobId" element={<JobDetailPage />} />

          {/* profile routes */}
          <Route path="/js/:userId" element={<ProfilePage />} />
          <Route path="/cm/:userId" element={<CompanyProfilePage />} />

          {/* job-seeker protected route */}
          <Route element={<ProtectedRoute requiredRole="job-seeker" />}>
            <Route
              path="/js/applications"
              element={<ApplicationHistory />}
            />
          </Route>

          {/* company protected routes */}
          <Route element={<ProtectedRoute requiredRole="company" />}>

            <Route path="/employer" element={<EmployerDashboard />}>
              <Route index element={<EmployerOverviewPage />} />
              <Route path="jobs" element={<EmployerJobPage />} />
              <Route path="jobs/post" element={<PostJobPage />} />
              <Route path="applications" element={<EmployerApplicantPage />} />
            </Route>

            <Route
              path="/employer/candidates"
              element={<CandidateSearchPage />}
            />
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
  axios.defaults.baseURL = "http://localhost:8080/";
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
