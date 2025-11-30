//fatir: UPDATE LOGIN/REGISTER

// src/pages/auth/RegistrationPage.js - VERSI PROFESIONAL DAN CLEAN
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/authSlice";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    gender: "",
    country: "",
    city: "",
  });

  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("candidate"); // candidate or employer

  const { token, userData } = useAuth();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //fatir: auto-redirect if already logged-in
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, userData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError("");
  };

  const handleGoogleRegister = () => {
    setIsLoading(true);
    setError("");

    // Simulasi registrasi dengan Google
    const googleUserData = {
      email: "user.disabilitas@gmail.com",
      password: "google-auth",
      userType: activeTab,
      name: "User Disabilitas",
      disabilityType: formData.disabilityType || "Disabilitas Lainnya",
    };

    dispatch(login(googleUserData)).then((result) => {
      setIsLoading(false);
      if (login.fulfilled.match(result)) {
        navigate("/complete-google"); // Redirect ke complete profile
      }
    });
  };

  //fatir: modifikasi email register
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    localStorage.removeItem("useremail");
    setIsLoading(true);
    setError("");

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.fullName ||
      !formData.country ||
      !formData.city ||
      !formData.gender
    ) {
      setError("Field yang dibutuhkan masih belum lengkap");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/auth/js-register", {
        ...formData,
        userType: activeTab,
      });

      console.log(res.data);
      localStorage.setItem("useremail", formData.email);
      window.open(res.data.emailTemp, "_blank"); //development, sementara
      navigate("/verification");
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  //fatir: get country lists
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name"
        );
        const list = res.data.map((c) => c.name.common).sort();
        setCountries(list);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  // Accessibility functions
  const increaseFontSize = () => {
    document.documentElement.style.fontSize = "18px";
  };

  const decreaseFontSize = () => {
    document.documentElement.style.fontSize = "14px";
  };

  const resetFontSize = () => {
    document.documentElement.style.fontSize = "16px";
  };

  const toggleHighContrast = () => {
    document.body.classList.toggle("high-contrast");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header - Clean & Professional */}
        <div className="text-center space-y-4">
          <Link to="/" className="inline-flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 w-14 h-14 rounded-full flex items-center justify-center shadow-lg">
              <i className="fas fa-hands-helping text-white text-xl"></i>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              InklusiKerja
            </span>
          </Link>
          
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Bergabung dengan Kami
            </h1>
            <p className="text-lg text-gray-600">
              Platform pencarian kerja inklusif untuk semua
            </p>
          </div>
        </div>

        {/* Tab Selection - Simple & Clean */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pencari Kerja Card */}
          <button
            onClick={() => {
              setActiveTab("candidate");
              setShowEmailForm(false);
              setError("");
            }}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              activeTab === "candidate"
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${
                activeTab === "candidate" ? "bg-blue-500" : "bg-gray-200"
              }`}>
                <i className={`fas fa-user-tie text-xl ${
                  activeTab === "candidate" ? "text-white" : "text-gray-600"
                }`}></i>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900">
                  Daftar sebagai Pencari Kerja
                </h3>
              </div>
              {activeTab === "candidate" && (
                <i className="fas fa-check-circle text-blue-500 text-xl"></i>
              )}
            </div>
          </button>

          {/* Perusahaan Card */}
          <Link
            to="/employer-register"
            className="p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all block"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gray-200">
                <i className="fas fa-building text-xl text-gray-600"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900">
                  Daftar sebagai Perusahaan
                </h3>
              </div>
              <i className="fas fa-arrow-right text-gray-400"></i>
            </div>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm animate-shake"
            role="alert"
          >
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle text-red-500 text-xl mr-3"></i>
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Registration Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Badge Indicator */}
          <div className="flex justify-center">
            <div
              className={`inline-flex items-center px-5 py-2.5 rounded-full font-medium shadow-sm ${
                activeTab === "candidate"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              <i
                className={`${
                  activeTab === "candidate"
                    ? "fas fa-wheelchair"
                    : "fas fa-briefcase"
                } mr-2`}
              ></i>
              <span>
                {activeTab === "candidate"
                  ? "Daftar sebagai Pencari Kerja"
                  : "Daftar sebagai Perusahaan"}
              </span>
            </div>
          </div>

          {/* Google Register Button */}
          <div>
            <button
              onClick={handleGoogleRegister}
              disabled={isLoading}
              className="w-full bg-white border-2 border-gray-300 text-gray-800 py-4 px-6 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md"
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Lanjutkan dengan Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-sm font-medium text-gray-500">
                Atau daftar dengan email
              </span>
            </div>
          </div>

          {/* Email Register Section */}
          {!showEmailForm ? (
            <div className="text-center">
              <button
                onClick={() => setShowEmailForm(true)}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg ${
                  activeTab === "candidate"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                } text-white`}
              >
                <i className="fas fa-envelope text-lg"></i>
                <span>Daftar dengan Email</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailRegister} className="space-y-6">
              {/* Progress Steps Indicator */}
              <div className="flex items-center justify-center gap-2 mb-8">
                <div className="flex items-center">
                  <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div className="w-12 h-1 bg-blue-500"></div>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                </div>
              </div>

              {/* Section 1: Account Info with Card Style */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 space-y-4 border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-500 text-white w-10 h-10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-user-lock text-lg"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Informasi Akun
                  </h3>
                </div>
                
                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-at text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                    </div>
                    <input
                      id="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => {
                        const cleaned = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]/g, "");
                        handleInputChange("username", cleaned);
                      }}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all shadow-sm"
                      placeholder="username_anda"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1.5 flex items-center gap-1">
                    <i className="fas fa-info-circle"></i>
                    Hanya huruf kecil dan angka, tanpa spasi
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Alamat Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-envelope text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all shadow-sm"
                      placeholder="email@example.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-lock text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                    </div>
                    <input
                      id="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all shadow-sm"
                      placeholder="Minimal 8 karakter"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Personal Info with Card Style */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 space-y-4 border-2 border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-500 text-white w-10 h-10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-id-card text-lg"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Informasi Pribadi
                  </h3>
                </div>

                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-user text-gray-400 group-focus-within:text-green-500 transition-colors"></i>
                    </div>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 transition-all shadow-sm"
                      placeholder="John Doe"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Gender - Enhanced Card Style */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <label className="relative">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        onChange={(e) =>
                          handleInputChange("gender", e.target.value)
                        }
                        disabled={isLoading}
                        className="peer sr-only"
                      />
                      <div className="flex flex-col items-center justify-center p-4 bg-white border-2 border-gray-300 rounded-xl cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:border-blue-300 transition-all shadow-sm">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2 peer-checked:bg-blue-500">
                          <i className="fas fa-mars text-blue-500 text-xl peer-checked:text-white"></i>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">
                          Laki-laki
                        </p>
                      </div>
                    </label>

                    <label className="relative">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        onChange={(e) =>
                          handleInputChange("gender", e.target.value)
                        }
                        disabled={isLoading}
                        className="peer sr-only"
                      />
                      <div className="flex flex-col items-center justify-center p-4 bg-white border-2 border-gray-300 rounded-xl cursor-pointer peer-checked:border-pink-500 peer-checked:bg-pink-50 hover:border-pink-300 transition-all shadow-sm">
                        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-2 peer-checked:bg-pink-500">
                          <i className="fas fa-venus text-pink-500 text-xl peer-checked:text-white"></i>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">
                          Perempuan
                        </p>
                      </div>
                    </label>

                    <label className="relative">
                      <input
                        type="radio"
                        name="gender"
                        value="blank"
                        onChange={(e) =>
                          handleInputChange("gender", e.target.value)
                        }
                        disabled={isLoading}
                        className="peer sr-only"
                      />
                      <div className="flex flex-col items-center justify-center p-4 bg-white border-2 border-gray-300 rounded-xl cursor-pointer peer-checked:border-gray-500 peer-checked:bg-gray-50 hover:border-gray-400 transition-all shadow-sm">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 peer-checked:bg-gray-500">
                          <i className="fas fa-user-secret text-gray-500 text-xl peer-checked:text-white"></i>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">
                          Privat
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Country */}
                <div className="relative">
                  <label
                    htmlFor="country"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Negara <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-globe text-gray-400 group-focus-within:text-green-500 transition-colors"></i>
                    </div>
                    <input
                      id="country"
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleInputChange("country", value);

                        if (value.trim() === "") {
                          setFilteredCountries([]);
                          setShowDropdown(false);
                          return;
                        }

                        const filter = countries.filter((name) =>
                          name.toLowerCase().includes(value.toLowerCase())
                        );

                        setFilteredCountries(filter);
                        setShowDropdown(true);
                      }}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 transition-all shadow-sm"
                      placeholder="Indonesia"
                      disabled={isLoading}
                    />
                  </div>

                  {showDropdown && filteredCountries.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border-2 border-green-300 rounded-xl mt-2 max-h-60 overflow-auto shadow-xl">
                      {filteredCountries.map((name) => (
                        <li
                          key={name}
                          className="px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                          onClick={() => {
                            handleInputChange("country", name);
                            setShowDropdown(false);
                          }}
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Kota <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-map-marker-alt text-gray-400 group-focus-within:text-green-500 transition-colors"></i>
                    </div>
                    <input
                      id="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 transition-all shadow-sm"
                      placeholder="Jakarta"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeTab === "candidate"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                } text-white`}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin text-lg"></i>
                    <span>Mendaftar...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus text-lg"></i>
                    <span>Daftar Sekarang</span>
                  </>
                )}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className="w-full text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition-all font-medium"
                disabled={isLoading}
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Kembali ke pilihan daftar
              </button>
            </form>
          )}
        </div>

        {/* Demo Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-blue-700 text-sm font-medium">
              <i className="fas fa-info-circle mr-1"></i>
              Untuk Demo Registrasi
            </p>
            <div className="text-blue-600 text-xs mt-2 space-y-1">
              <p>
                <strong>Google:</strong> Klik tombol Google untuk daftar cepat
              </p>
              <p>
                <strong>Email:</strong> Isi form lalu klik "Kirim kode verifikasi"
              </p>
              <p>
                <strong>Redirect:</strong> Akan langsung ke halaman profil
              </p>
            </div>
          </div>

          {/* Accessibility Quick Options */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-3 flex items-center justify-center">
              <i className="fas fa-universal-access mr-2"></i>
              Opsi Aksesibilitas
            </h4>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                className="text-sm bg-white text-blue-700 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-100 transition flex items-center gap-2"
                onClick={increaseFontSize}
                aria-label="Perbesar ukuran teks"
              >
                <i className="fas fa-text-height"></i>
                <span>A+</span>
              </button>
              <button
                className="text-sm bg-white text-blue-700 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-100 transition flex items-center gap-2"
                onClick={decreaseFontSize}
                aria-label="Perkecil ukuran teks"
              >
                <i className="fas fa-text-height"></i>
                <span>A-</span>
              </button>
              <button
                className="text-sm bg-white text-blue-700 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-100 transition flex items-center gap-2"
                onClick={resetFontSize}
                aria-label="Reset ukuran teks ke normal"
              >
                <i className="fas fa-undo-alt"></i>
                <span>Reset</span>
              </button>
              <button
                className="text-sm bg-white text-blue-700 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-100 transition flex items-center gap-2"
                onClick={toggleHighContrast}
                aria-label="Toggle mode kontras tinggi"
              >
                <i className="fas fa-adjust"></i>
                <span>Kontras</span>
              </button>
            </div>
          </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>

        {/* Screen Reader Announcement */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Halaman registrasi untuk platform InklusiKerja. Pilih jenis akun lalu
          daftar dengan Google atau email.
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;