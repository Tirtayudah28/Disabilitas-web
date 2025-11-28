//fatir: UPDATE LOGIN/REGISTER

// src/pages/auth/EmployerRegistrationPage.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const EmployerRegistrationPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    country: "",
    city: "",
    industryId: "",
    industryName: "",
    websiteLink: "",

    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [industries, setIndustries] = useState([]); // simpan array objek {id,name,description}
  const [filteredIndustries, setFilteredIndustries] = useState([]);
  const [showIndustriesDd, setShowIndustriesDd] = useState(false);
  const [industryQuery, setIndustryQuery] = useState(""); // teks yang diketik user

  const { token, userData } = useAuth();

  const navigate = useNavigate();

  //fatir: auto-redirect if already logged-in
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, userData]);

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

  //fatir: get industries lists
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await axios.get("/api/data/industries");
        const list = res.data?.data ?? res.data;
        setIndustries(list);
      } catch (error) {
        console.error("Error fetching industries:", error);
      }
    };

    fetchIndustries();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError("");
  };

  const handleNext = () => {
    if (step === 1) {
      if (
        !formData.companyName ||
        !formData.country ||
        (!formData.industryId && !formData.industryName) ||
        !formData.city
      ) {
        setError("Required fields are still incomplete");
        return;
      }
    }

    console.log(formData);

    setStep((prev) => prev + 1);
    setError("");
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
    setError("");
  };

  //fatir: modif handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem("useremail");
    setIsLoading(true);
    setError("");

    if (
      !formData.companyName ||
      !formData.country ||
      !formData.city ||
      (!formData.industryId && !formData.industryName) ||
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Required fields are still incomplete");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password and Confirm Password unmatched");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        companyName: formData.companyName,
        country: formData.country,
        city: formData.city,
        industryId: formData.industryId,
        industryName: formData.industryId ? null : formData.industryName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        websiteLink: formData.websiteLink,
      };
      const res = await axios.post("/api/auth/cm-register", payload);

      localStorage.setItem("useremail", formData.email);
      window.open(res.data.emailTemp, "_blank"); //development, sementara
      navigate("/verification");
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-full flex items-center justify-center shadow-md">
              <i className="fas fa-hands-helping text-white text-xl"></i>
            </div>
            <span className="text-2xl font-bold text-blue-700">
              InklusiKerja
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Daftar sebagai Employer
          </h1>
          <p className="text-gray-600">
            Bergabung dengan platform inklusif untuk merekrut talenta
            disabilitas
          </p>
          <div className="flex gap-10 mt-10 justify-center">
            <Link to="/register">Daftar sebagai pencari kerja</Link>
            <Link to="/employer-register">Daftar sebagai perusahaan</Link>
          </div>
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

        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className={step >= 1 ? "font-semibold text-blue-600" : ""}>
              Data Perusahaan
            </span>
            <span className={step >= 2 ? "font-semibold text-blue-600" : ""}>
              Data Akun
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 space-y-6"
        >
          {/* Step 1: Company Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="inline-flex items-center bg-purple-50 text-purple-700 px-4 py-2 rounded-full">
                  <i className="fas fa-building mr-2"></i>
                  <span className="font-medium">Informasi Perusahaan</span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nama Perusahaan
                </label>
                <input
                  id="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) =>
                    handleInputChange("companyName", e.target.value)
                  }
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="PT. Contoh Indonesia"
                />
              </div>

              {/*fatir: input autocomplete country*/}
              <div className="relative">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Negara
                </label>

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
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  placeholder="Negara anda"
                  disabled={isLoading}
                />

                {showDropdown && filteredCountries.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-xl mt-1 max-h-60 overflow-auto shadow">
                    {filteredCountries.map((name) => (
                      <li
                        key={name}
                        className="p-3 hover:bg-gray-100 cursor-pointer"
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

              {/* fatir: input text city */}
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Kota
                </label>
                <input
                  id="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-xl 
               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
               disabled:bg-gray-100 disabled:cursor-not-allowed 
               transition-colors"
                  placeholder="Kota anda"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                {/* fatir: input autocomplete industry */}
                <div className="relative">
                  <label
                    htmlFor="industry"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Industri
                  </label>

                  <input
                    id="industry"
                    type="text"
                    required
                    value={industryQuery}
                    onChange={(e) => {
                      const value = e.target.value;
                      setIndustryQuery(value);

                      setFormData((prev) => ({
                        ...prev,
                        industryId: "",
                        industryName: value,
                      }));

                      if (value.trim() === "") {
                        setFilteredIndustries([]);
                        setShowIndustriesDd(false);
                        return;
                      }

                      const filter = industries.filter((ind) =>
                        ind.name.toLowerCase().includes(value.toLowerCase())
                      );

                      setFilteredIndustries(filter);
                      setShowIndustriesDd(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        setShowIndustriesDd(false);
                        if (!formData.industryId) {
                          setFormData((prev) => ({
                            ...prev,
                            industryName: industryQuery.trim(),
                          }));
                        }
                      }, 150);
                    }}
                    onFocus={() => {
                      if (filteredIndustries.length > 0)
                        setShowIndustriesDd(true);
                    }}
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    placeholder="Tipe industri"
                    disabled={isLoading}
                    autoComplete="off"
                  />

                  {showIndustriesDd && filteredIndustries.length > 0 && (
                    <ul className="absolute z-20 w-full bg-white border border-gray-300 rounded-xl mt-1 max-h-60 overflow-auto shadow">
                      {filteredIndustries.map((ind) => (
                        <li
                          key={ind.id}
                          className="p-3 hover:bg-gray-100 cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setFormData((prev) => ({
                              ...prev,
                              industryId: ind.id,
                              industryName: ind.name,
                            }));
                            setIndustryQuery(ind.name);
                            setShowIndustriesDd(false);
                          }}
                        >
                          <div className="font-medium">{ind.name}</div>
                          {ind.description && (
                            <div className="text-xs text-gray-400">
                              {ind.description}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="websiteLink"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Website Perusahaan (Opsional)
                  </label>
                  <input
                    id="websiteLink"
                    type="url"
                    value={formData.websiteLink}
                    onChange={(e) =>
                      handleInputChange("websiteLink", e.target.value)
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="https://perusahaan.com"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                Lanjut ke Data Akun
              </button>
            </div>
          )}

          {/* Step 2: Account Information */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="inline-flex items-center bg-purple-50 text-purple-700 px-4 py-2 rounded-full">
                  <i className="fas fa-user-tie mr-2"></i>
                  <span className="font-medium">Data Akun</span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Username
                </label>
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
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Buat username akun"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email akun
                </label>
                <input
                  id="email"
                  type="text"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="hr@perusahaan.com"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password *
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Minimal 8 karakter"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Konfirmasi Password *
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Ulangi password"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={(e) =>
                    handleInputChange("agreeToTerms", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                  Saya menyetujui{" "}
                  <Link
                    to="/terms"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Syarat & Ketentuan
                  </Link>{" "}
                  dan{" "}
                  <Link
                    to="/privacy"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Kebijakan Privasi
                  </Link>{" "}
                  InklusiKerja *
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleBack}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Loading...
                    </>
                  ) : (
                    <>
                      <i class="fa-solid fa-square-check mr-2"></i>
                      Daftar
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

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
            Sudah punya akun employer?{" "}
            <Link
              to="/login"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Masuk di sini
            </Link>
          </p>
        </div>

        {/* Screen Reader Announcement */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Halaman registrasi employer. Silakan isi form pendaftaran perusahaan.
        </div>
      </div>
    </div>
  );
};

export default EmployerRegistrationPage;
