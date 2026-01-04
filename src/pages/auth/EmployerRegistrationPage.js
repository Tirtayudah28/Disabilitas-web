// src/pages/auth/EmployerRegistrationPage.js - VERSI PROFESIONAL DAN CLEAN
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { enqueueSnackbar } from "notistack";

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
    agreeToTerms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [industries, setIndustries] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showIndSuggestions, setShowIndSuggestions] = useState(false);
  const [blockDisApi, setBlockDisApi] = useState(false);

  const { token, userData } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect if already logged-in
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, userData]);

  //fatir: get countries
  //DO NOT CHANGE
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
        setCountries([
          "Indonesia",
          "Malaysia",
          "Singapore",
          "Thailand",
          "Vietnam",
        ]);
      }
    };

    fetchCountries();
  }, []);

  //fetch industries search-based
  const fetchIndustries = async (q) => {
    try {
      if (!q || q.trim() === "") {
        setIndustries([]);
        return;
      }

      const res = await axios.get(
        `/api/data/industries?search=${encodeURIComponent(q)}`
      );
      const data = res.data.data;
      setIndustries(Array.isArray(data) ? data : []);
      setShowIndSuggestions(true);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setIndustries([]);
      setShowIndSuggestions(false);
    }
  };
  useEffect(() => {
    if (blockDisApi) return;
    const delay = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(delay);
  }, [search]);
  useEffect(() => {
    fetchIndustries(debouncedSearch);
  }, [debouncedSearch]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError("");
  };

  //input industry
  const handleIndustryInput = (e) => {
    const v = e.target.value;
    setBlockDisApi(false);
    setFormData((prev) => ({
      ...prev,
      industryId: "",
      industryName: v,
    }));
    setSearch(v);
  };
  //industry suggestion
  const handleSelectSuggestion = (d) => {
    const id = d.id ?? null;
    const name = d.name ?? "";

    setFormData((prev) => ({
      ...prev,
      industryId: id,
      industryName: name,
    }));

    setBlockDisApi(true);
    setSearch(name);
    setShowIndSuggestions(false);
    setIndustries([]);
  };

  const handleNext = () => {
    if (step === 1) {
      if (
        !formData.companyName ||
        !formData.country ||
        (!formData.industryId && !formData.industryName) ||
        !formData.city
      ) {
        setError("Field yang dibutuhkan masih belum lengkap");
        enqueueSnackbar("Field yang dibutuhkan masih belum lengkap", {
          variant: "warning",
        });
        return;
      }
    }

    setStep((prev) => prev + 1);
    setError("");
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
    setError("");
  };

  //fatir: fix handle submit
  //DO NOT CHANGE
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
      setError("Field yang dibutuhkan masih belum lengkap");
      enqueueSnackbar("Field yang dibutuhkan masih belum lengkap", {
        variant: "warning",
      });

      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan Konfirmasi Password tidak serasi");
      enqueueSnackbar("Password dan Konfirmasi Password tidak serasi", {
        variant: "warning",
      });
      setIsLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Perlu untuk menyetujui terms and services");
      enqueueSnackbar("Perlu untuk menyetujui terms and services", {
        variant: "info",
      });
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
      navigate("/verification");
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || "Terjadi kesalahan saat mendaftar",
        { variant: "warning" }
      );
      setError(err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
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
              Bergabung sebagai Employer
            </h1>
            <p className="text-lg text-gray-600">
              Rekrut talenta terbaik dari komunitas disabilitas
            </p>
          </div>
        </div>

        {/* Tab Selection - Simple & Clean */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pencari Kerja Card */}
          <Link
            to="/register"
            className="p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all block"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gray-200">
                <i className="fas fa-user-tie text-xl text-gray-600"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900">
                  Daftar sebagai Pencari Kerja
                </h3>
              </div>
              <i className="fas fa-arrow-right text-gray-400"></i>
            </div>
          </Link>

          {/* Perusahaan Card */}
          <button
            onClick={() => {
              setError("");
            }}
            className="p-6 rounded-xl border-2 transition-all text-left border-blue-500 bg-blue-50 shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500">
                <i className="fas fa-building text-xl text-white"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900">
                  Daftar sebagai Perusahaan
                </h3>
              </div>
              <i className="fas fa-check-circle text-blue-500 text-xl"></i>
            </div>
          </button>
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
            <div className="inline-flex items-center px-5 py-2.5 rounded-full font-medium shadow-sm bg-blue-50 text-blue-700 border border-blue-200">
              <i className="fas fa-building mr-2"></i>
              <span>Daftar sebagai Perusahaan</span>
            </div>
          </div>

          {/* Progress Steps Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                1
              </div>
              <div
                className={`w-12 h-1 ${
                  step >= 1 ? "bg-blue-500" : "bg-gray-300"
                }`}
              ></div>
            </div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= 2
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                2
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Company Information */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Company Info Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 space-y-4 border-2 border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-500 text-white w-10 h-10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-building text-lg"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Informasi Perusahaan
                    </h3>
                  </div>

                  {/* Company Name */}
                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Nama Perusahaan <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-building text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                      </div>
                      <input
                        id="companyName"
                        type="text"
                        required
                        autoComplete="off"
                        value={formData.companyName}
                        onChange={(e) =>
                          handleInputChange("companyName", e.target.value)
                        }
                        className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                        placeholder="PT. Contoh Indonesia"
                      />
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
                        <i className="fas fa-globe text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                      </div>
                      <input
                        id="country"
                        type="text"
                        required
                        autoComplete="off"
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
                        className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                        placeholder="Indonesia"
                      />
                    </div>

                    {showDropdown && filteredCountries.length > 0 && (
                      <ul className="absolute z-10 w-full bg-white border-2 border-blue-300 rounded-xl mt-2 max-h-60 overflow-auto shadow-xl">
                        {filteredCountries.map((name) => (
                          <li
                            key={name}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
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
                        <i className="fas fa-map-marker-alt text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                      </div>
                      <input
                        id="city"
                        type="text"
                        required
                        autoComplete="off"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                        placeholder="Jakarta"
                      />
                    </div>
                  </div>

                  {/* Industry */}
                  <div className="relative">
                    <label
                      htmlFor="industry"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Industri <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-globe text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                      </div>
                      <input
                        type="text"
                        name="industryName"
                        autoComplete="off"
                        value={formData.industryName}
                        onChange={handleIndustryInput}
                        placeholder="Cari atau ketik nama industri..."
                        className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                        onFocus={() => {
                          if (industries.length > 0)
                            setShowIndSuggestions(true);
                        }}
                      />

                      {/* suggestions */}
                      {showIndSuggestions && industries.length > 0 && (
                        <ul className="absolute z-50 bg-white border border-gray-200 rounded mt-1 w-full max-h-44 overflow-y-auto shadow-lg">
                          {industries.map((d) => {
                            const id = d.id ?? "";
                            const name = d.name ?? "";
                            return (
                              <li
                                key={id || name}
                                onClick={() => handleSelectSuggestion(d)}
                                className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center capitalize"
                              >
                                <div>
                                  <div className="font-medium">{name}</div>
                                </div>
                                <div className="text-xs text-gray-600">
                                  Pilih
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Website */}
                  <div>
                    <label
                      htmlFor="websiteLink"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Website Perusahaan (Opsional)
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-link text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                      </div>
                      <input
                        id="websiteLink"
                        type="url"
                        autoComplete="off"
                        value={formData.websiteLink}
                        onChange={(e) =>
                          handleInputChange("websiteLink", e.target.value)
                        }
                        className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                        placeholder="https://perusahaan.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3.5 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 bg-blue-500 text-white py-3.5 rounded-xl hover:bg-blue-600 transition-all font-semibold shadow-lg"
                  >
                    Lanjut ke Data Akun
                    <i className="fas fa-arrow-right ml-2"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Account Information */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Account Info Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 space-y-4 border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-500 text-white w-10 h-10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-user-tie text-lg"></i>
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
                        <i className="fas fa-at text-gray-400 group-focus-within:text-green-500 transition-colors"></i>
                      </div>
                      <input
                        id="username"
                        type="text"
                        required
                        autoComplete="off"
                        value={formData.username}
                        onChange={(e) => {
                          const cleaned = e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]/g, "");
                          handleInputChange("username", cleaned);
                        }}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                        placeholder="username_perusahaan"
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
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-envelope text-gray-400 group-focus-within:text-green-500 transition-colors"></i>
                      </div>
                      <input
                        id="email"
                        type="email"
                        required
                        autoComplete="off"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                        placeholder="hr@perusahaan.com"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="fas fa-lock text-gray-400 group-focus-within:text-green-500 transition-colors"></i>
                        </div>
                        <input
                          id="password"
                          type="password"
                          required
                          autoComplete="off"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                          placeholder="Minimal 8 karakter"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Konfirmasi Password{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="fas fa-lock text-gray-400 group-focus-within:text-green-500 transition-colors"></i>
                        </div>
                        <input
                          id="confirmPassword"
                          type="password"
                          required
                          autoComplete="off"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                          placeholder="Ulangi password"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-start gap-3 p-4 bg-white rounded-xl border-2 border-gray-300">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={(e) =>
                        handleInputChange("agreeToTerms", e.target.checked)
                      }
                      className="h-5 w-5 text-green-500 focus:ring-green-500 border-gray-300 rounded mt-0.5"
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="agreeToTerms"
                      className="text-sm text-gray-700"
                    >
                      Saya menyetujui{" "}
                      <Link
                        to="/terms"
                        className="text-green-600 hover:text-green-700 font-semibold"
                      >
                        Syarat & Ketentuan
                      </Link>{" "}
                      dan{" "}
                      <Link
                        to="/privacy"
                        className="text-green-600 hover:text-green-700 font-semibold"
                      >
                        Kebijakan Privasi
                      </Link>{" "}
                      InklusiKerja <span className="text-red-500">*</span>
                    </label>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isLoading}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3.5 rounded-xl hover:bg-gray-50 transition-all font-semibold disabled:opacity-50"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3.5 rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin text-lg"></i>
                        <span>Mendaftarkan...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-building text-lg"></i>
                        <span>Daftar Perusahaan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Sudah punya akun perusahaan?{" "}
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
          Halaman registrasi employer untuk platform InklusiKerja. Isi form
          pendaftaran perusahaan dalam 2 langkah.
        </div>
      </div>
    </div>
  );
};

export default EmployerRegistrationPage;
