// src/pages/auth/CompleteGooglePage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const CompleteGooglePage = () => {
  const { token, userData, setUserData } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    country: "Indonesia",
    city: "",
    gender: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  // Redirect jika belum login
  useEffect(() => {
    if (!token || !userData) {
      navigate("/login");
    }
  }, [token, userData, navigate]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error saat user mulai mengetik
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validasi form
    if (!formData.username.trim()) {
      setError("Username harus diisi");
      return;
    }

    if (!formData.city.trim()) {
      setError("Kota harus diisi");
      return;
    }

    if (!formData.gender) {
      setError("Gender harus dipilih");
      return;
    }

    setIsLoading(true);

    try {
      // Simulasi delay untuk melihat loading
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Kirim data ke backend untuk melengkapi profil
      const res = await axios.post(
        "/api/auth/complete-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update user data di context
      setUserData({
        ...userData,
        username: formData.username,
        country: formData.country,
        city: formData.city,
        gender: formData.gender,
        profileComplete: true,
      });

      // Show success animation
      setShowSuccess(true);

      // Wait 2 seconds then redirect
      setTimeout(() => {
        setIsLoading(false);
        navigate("/", { replace: true });
        alert("Profil berhasil dilengkapi! Selamat datang di InklusiKerja");
      }, 2000);

    } catch (err) {
      setIsLoading(false);
      setError(
        err.response?.data?.message || 
        "Terjadi kesalahan saat menyimpan data"
      );
    }
  };

  // Daftar kota-kota besar di Indonesia
  const cities = [
    "Jakarta",
    "Surabaya",
    "Bandung",
    "Medan",
    "Semarang",
    "Makassar",
    "Palembang",
    "Tangerang",
    "Depok",
    "Bekasi",
    "Yogyakarta",
    "Bogor",
    "Malang",
    "Batam",
    "Pekanbaru",
    "Bandar Lampung",
    "Padang",
    "Denpasar",
    "Samarinda",
    "Balikpapan",
  ];

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-2xl p-12 text-center shadow-2xl transform transition-transform duration-300 scale-100">
            {!showSuccess ? (
              <div>
                {/* Custom Spinner matching LoadingSpinner component */}
                <div className="w-20 h-20 relative mx-auto mb-6">
                  {/* Outer ring */}
                  <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                  {/* Spinning ring */}
                  <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                  {/* Inner dot */}
                  <div className="absolute inset-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-gray-600 font-medium animate-pulse">
                  Menyimpan Data Anda...
                </p>
                {/* Accessibility */}
                <div className="sr-only" aria-live="polite" aria-atomic="true">
                  Sedang menyimpan data profil
                </div>
              </div>
            ) : (
              <div>
                <div className="success-checkmark w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 mx-auto mb-6 flex items-center justify-center">
                  <i className="success-icon fas fa-check text-white text-4xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Berhasil!</h3>
                <p className="text-gray-600">Profil Anda telah dilengkapi</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center py-8 px-4">
        <div className="max-w-lg w-full space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-green-500 w-16 h-16 rounded-full shadow-md mb-4">
              <i className="fas fa-hands-helping text-white text-xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Lengkapi Profil Anda
            </h1>
            <p className="text-gray-600">
              Kami butuh beberapa informasi tambahan untuk melengkapi akun Anda
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="bg-red-50 border border-red-200 rounded-lg p-4"
              role="alert"
            >
              <div className="flex items-center">
                <i className="fas fa-exclamation-circle text-red-500 mr-3"></i>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-user text-gray-400"></i>
                  </div>
                  <input
                    id="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    placeholder="Masukkan username"
                    disabled={isLoading}
                    aria-describedby="username-desc"
                  />
                </div>
                <p id="username-desc" className="text-xs text-gray-500 mt-1">
                  Username akan ditampilkan di profil publik Anda
                </p>
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Negara <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-globe text-gray-400"></i>
                  </div>
                  <input
                    id="country"
                    type="text"
                    value={formData.country}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Kota <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-map-marker-alt text-gray-400"></i>
                  </div>
                  <select
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors appearance-none"
                    disabled={isLoading}
                  >
                    <option value="">Pilih kota</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400"></i>
                  </div>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Jenis Kelamin <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <span className="ml-3 text-gray-700 flex items-center">
                      <i className="fas fa-mars text-blue-500 mr-2"></i>
                      Laki-laki
                    </span>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <span className="ml-3 text-gray-700 flex items-center">
                      <i className="fas fa-venus text-pink-500 mr-2"></i>
                      Perempuan
                    </span>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="gender"
                      value="prefer-not-to-say"
                      checked={formData.gender === "prefer-not-to-say"}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <span className="ml-3 text-gray-700 flex items-center">
                      <i className="fas fa-user-secret text-gray-500 mr-2"></i>
                      Tidak ingin memberitahu
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-4 rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg text-lg"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check-circle mr-2"></i>
                    Selesai
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <i className="fas fa-shield-alt text-blue-500 mt-1 mr-3"></i>
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Privasi Anda Terlindungi</p>
                <p className="text-xs text-blue-600">
                  Informasi ini hanya digunakan untuk meningkatkan pengalaman Anda
                  di platform kami dan tidak akan dibagikan tanpa izin Anda.
                </p>
              </div>
            </div>
          </div>

          {/* Screen Reader Announcement */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            Halaman untuk melengkapi profil setelah login dengan Google. Mohon
            isi username, kota, dan jenis kelamin untuk melanjutkan.
          </div>
        </div>
      </div>
    </>
  );
};

export default CompleteGooglePage;