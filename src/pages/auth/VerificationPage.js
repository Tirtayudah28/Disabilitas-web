//fatir: UPDATE LOGIN/REGISTER

// src/pages/auth/VerificationPage.js
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const VerificationPage = () => {
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const email = localStorage.getItem("useremail");
  const {token} = useAuth()

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  //fatir: auto-redirect apabila belum register
  useEffect(() => {
    if (!email || token) {
      navigate("/", { replace: true });
    }
  }, [token]);

  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      if (value && index < 5) {
        document.getElementById(`verification-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      document.getElementById(`verification-${index - 1}`).focus();
    }
  };

  //fatir: modifikasi handleVerify
  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const otpCode = verificationCode.join("");
    try {
      const res = await axios.post("/api/auth/verify-otp", {
        email,
        otp: otpCode,
      });

      console.log(res.data);
      localStorage.removeItem("useremail");
      navigate("/login");
      //ganti dengan pemberitahuan yg lebih baik
      alert(
        res.data.message ||
          "Verifikasi berhasil, hanya perlu login untuk melanjutkan"
      );
    } catch (err) {
      //ganti dengan pemberitahuan yg lebih baik
      alert(err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  //fatir: modifikasi resend code
  const handleResendCode = () => {
    setCountdown(60);
    setCanResend(false);
    console.log("Resending verification code to:", email);
  };

  const isCodeComplete = verificationCode.every((digit) => digit !== "");

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <i className="fas fa-envelope text-primary-500 text-2xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Verifikasi Email</h2>
          <p className="mt-2 text-gray-600">
            Kami telah mengirim kode verifikasi ke
          </p>
          <p className="text-lg font-medium text-primary-600">{email}</p>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Masukkan 6-digit kode verifikasi
              </label>

              <div className="flex justify-center space-x-2">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`verification-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!isCodeComplete || isLoading}
              className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition font-medium disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Memverifikasi...
                </>
              ) : (
                "Verifikasi Akun"
              )}
            </button>
          </form>

          {/* Resend Code */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Tidak menerima kode?{" "}
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-primary-500 hover:text-primary-600 font-medium"
                >
                  Kirim ulang
                </button>
              ) : (
                <span className="text-gray-500">
                  Kirim ulang dalam {countdown}s
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
            <i className="fas fa-question-circle mr-2"></i>
            Butuh Bantuan?
          </h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Periksa folder spam email Anda</li>
            <li>• Pastikan email yang dimasukkan benar</li>
            <li>• Hubungi support jika masalah berlanjut</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
