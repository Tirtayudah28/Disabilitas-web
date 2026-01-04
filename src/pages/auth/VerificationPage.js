// src/pages/auth/VerificationPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VerificationPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  //initial effect
  useEffect(() => {
    const storedEmail = localStorage.getItem("useremail");

    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      navigate(-1, { replace: true });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      verifyToken(token);
    }
  }, [navigate]);

  //verify token if exists
  const verifyToken = async (token) => {
    setVerifying(true);
    try {
      const response = await axios.post(
        `/api/auth/verify-registration?token=${token}`
      );

      if (response.status === 200) {
        setVerificationStatus("success");
        localStorage.removeItem("useremail");
      }
    } catch (error) {
      setVerificationStatus("error");
      setErrorMessage(
        error.response?.data?.message || "Verifikasi gagal. Silakan coba lagi."
      );
    } finally {
      setVerifying(false);
    }
  };

  // Render content based on verification status
  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <svg
              className="animate-spin h-10 w-10 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Memverifikasi...
          </h1>
          <p className="text-gray-600">Harap tunggu sebentar</p>
        </div>
      </div>
    );
  }

  if (verificationStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
        <div className="max-w-md w-full">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Verifikasi Berhasil!
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Akun Anda akan direview oleh admin InklusiKerja. Kami akan
              mengirimkan email konfirmasi setelah akun Anda aktif.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Kembali ke Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStatus === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
        <div className="max-w-md w-full">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Verifikasi Gagal
            </h1>
            <p className="text-gray-700 mb-6">{errorMessage}</p>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Kembali ke Pendaftaran
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default view - show email verification message
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="max-w-md w-full">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <svg
              className="w-10 h-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pendaftaran Berhasil!
          </h1>

          <p className="text-lg text-gray-600 mb-4">
            Kami telah mengirimkan link verifikasi ke email
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-lg font-semibold text-blue-700 break-all">
              {email}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">
              Langkah selanjutnya:
            </h3>
            <ol className="text-gray-700 text-sm list-decimal list-inside space-y-2">
              <li>
                Buka email Anda di <strong>{email}</strong>
              </li>
              <li>Cari email dari InklusiKerja</li>
              <li>Klik link verifikasi di dalam email tersebut</li>
              <li>Akun Anda akan diverifikasi secara otomatis</li>
            </ol>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p className="flex items-start">
              <svg
                className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.768 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span>Tidak melihat email? Cek folder spam atau junk</span>
            </p>

            <p className="text-gray-500 text-xs mt-4">
              Setelah verifikasi, akun Anda akan direview oleh admin
              InklusiKerja
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
