// src/pages/CompaniesPage.js
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

import defaultCm from "../assets/default-company.png";

const CompaniesPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  const [companies, setCompanies] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    country: "",
    limit: 30,
    page: 1,
  });
  const [meta, setMeta] = useState({
    page: 1,
    limit: 30,
    total: 0,
    totalPages: 0,
  });
  const [searchInput, setSearchInput] = useState("");
  const [countryInput, setCountryInput] = useState("");

  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  //fetch companies
  const fetchCompanies = async (page) => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: filters.limit,
        search: filters.search || "",
        country: filters.country || "",
      };

      const res = await axios.get("/api/companies", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      setCompanies(res.data.data || []);
      setMeta({
        page: res.data.meta.page,
        limit: res.data.meta.limit,
        total: res.data.meta.total,
        totalPages: res.data.meta.totalPages,
      });
    } catch (err) {
      console.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  //fetch countries
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
  //effects
  useEffect(() => {
    fetchCompanies(filters.page);
  }, [filters.page, filters.search, filters.country, filters.limit, token]);
  useEffect(() => {
    fetchCountries();
  }, []);

  //filter handlers
  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: searchInput,
      country: countryInput,
      page: 1,
    }));
  };

  // Reset filters
  const resetFilters = (filterType = "all") => {
    setFilters((prev) => {
      const newFilters = { ...prev, page: 1 };

      if (filterType === "search" || filterType === "all") {
        newFilters.search = "";
      }

      if (filterType === "country" || filterType === "all") {
        newFilters.country = "";
      }

      return newFilters;
    });

    if (filterType === "search" || filterType === "all") {
      setSearchInput("");
    }
    if (filterType === "country" || filterType === "all") {
      setCountryInput("");
    }
  };

  // Change limit
  const handleLimitChange = (newLimit) => {
    const newFilters = {
      ...filters,
      limit: Number(newLimit),
      page: 1,
    };

    setFilters(newFilters);
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  /*
    SKELETON LOADER
  */
  const CompanyCardSkeleton = () => {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm animate-pulse">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          {/* Logo */}
          <div className="w-16 h-16 rounded-full bg-gray-200" />

          {/* Name */}
          <div className="flex-1 space-y-2">
            <div className="h-5 w-2/3 bg-gray-200 rounded" />
            <div className="h-4 w-1/3 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-11/12 bg-gray-200 rounded" />
          <div className="h-4 w-4/5 bg-gray-200 rounded" />
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>

            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded" />
              <div className="h-4 w-40 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Website link */}
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 lg:py-10">
        {/* Header Section */}
        {!token && (
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <div className="inline-block mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Temukan Perusahaan{" "}
                <span className="text-primary-600">Inklusif</span>
              </h1>
              <div className="h-1 w-32 sm:w-40 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto"></div>
            </div>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
              Jelajahi perusahaan-perusahaan yang berkomitmen menciptakan
              lingkungan kerja yang ramah dan accessible untuk penyandang
              disabilitas
            </p>
          </div>
        )}

        {/* Search & Filter */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
            {/* Search and Filter Container */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-end gap-4">
              {/* Search Input */}
              <div className="lg:flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari Perusahaan
                </label>
                <div className="relative">
                  <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="search"
                    placeholder="Nama perusahaan, industri..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full pl-12 pr-4 py-3 sm:py-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              {/* Country Input */}
              <div className="lg:flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Negara
                </label>
                <div className="relative">
                  <i className="fas fa-globe absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    value={countryInput}
                    placeholder="Masukkan negara..."
                    onChange={(e) => {
                      const value = e.target.value;
                      setCountryInput(value);

                      if (!value.trim()) {
                        setFilteredCountries([]);
                        setShowDropdown(false);
                        return;
                      }

                      const filtered = countries.filter((name) =>
                        name.toLowerCase().includes(value.toLowerCase())
                      );

                      setFilteredCountries(filtered);
                      setShowDropdown(true);
                    }}
                    onFocus={() => {
                      if (countryInput.trim() && countries.length > 0) {
                        const filtered = countries.filter((name) =>
                          name.toLowerCase().includes(countryInput.toLowerCase())
                        );
                        setFilteredCountries(filtered);
                        setShowDropdown(true);
                      }
                    }}
                    className="w-full pl-12 pr-4 py-3 sm:py-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />

                  {showDropdown && filteredCountries.length > 0 && (
                    <div className="absolute z-20 mt-1 w-full max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
                      {filteredCountries.slice(0, 10).map((name) => (
                        <div
                          key={name}
                          className="px-4 py-3 text-sm hover:bg-primary-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                          onClick={() => {
                            setCountryInput(name);
                            setShowDropdown(false);
                          }}
                        >
                          {name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="sm:col-span-2 lg:flex lg:items-end lg:gap-2">
                <div className="flex gap-3">
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="flex-1 lg:flex-none bg-primary-600 hover:bg-primary-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px]"
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner animate-spin"></i>
                        <span className="hidden sm:inline">Mencari...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-search"></i>
                        <span className="hidden sm:inline">Cari Perusahaan</span>
                        <span className="sm:hidden">Cari</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => resetFilters("all")}
                    className="px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-redo"></i>
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex flex-col gap-6">
          {/* Results Header */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  {meta?.total || 0} Perusahaan Ditemukan
                </h2>
                
                {/* Filter Tags */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.search && (
                    <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full text-sm font-medium">
                      <span>"{filters.search}"</span>
                      <button
                        onClick={() => resetFilters("search")}
                        className="hover:bg-primary-100 rounded-full w-5 h-5 flex items-center justify-center"
                        aria-label="Hapus filter pencarian"
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                    </div>
                  )}
                  {filters.country && (
                    <div className="inline-flex items-center gap-2 bg-secondary-50 text-secondary-700 px-3 py-1.5 rounded-full text-sm font-medium">
                      <span>{filters.country}</span>
                      <button
                        onClick={() => resetFilters("country")}
                        className="hover:bg-secondary-100 rounded-full w-5 h-5 flex items-center justify-center"
                        aria-label="Hapus filter negara"
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Results per page for mobile */}
              <div className="lg:hidden flex items-center gap-2 text-sm text-gray-600">
                <span>Per halaman:</span>
                <select
                  className="border border-gray-300 bg-white rounded-lg px-2 py-1 text-sm"
                  value={filters.limit}
                  onChange={(e) => handleLimitChange(e.target.value)}
                >
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                  <option value={80}>80</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid Companies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <CompanyCardSkeleton key={i} />
              ))}
            
            {!loading && companies.length === 0 && (
              <div className="col-span-3 bg-white rounded-2xl shadow-sm p-8 sm:p-12 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-building text-gray-400 text-2xl"></i>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Tidak ada perusahaan ditemukan
                </h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  Coba ubah kata kunci pencarian atau filter negara untuk menemukan perusahaan yang sesuai.
                </p>
                <button
                  onClick={() => resetFilters("all")}
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  <i className="fas fa-redo"></i>
                  Reset semua filter
                </button>
              </div>
            )}
            
            {!loading && companies.map((company) => (
              <div
                key={company.id}
                onClick={() => navigate(`/cm/${company.User?.id}`)}
                className="group cursor-pointer bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  {/* Logo */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={company.User.profilePicture || defaultCm}
                      alt={company.companyName}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border-2 border-gray-100 group-hover:border-primary-200 transition-colors"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <i className="fas fa-building text-white text-xs"></i>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                      {company.companyName}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {company.industryName || company.Industry?.name || "Industri tidak tersedia"}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {company.companyDescription && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {company.companyDescription}
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="space-y-3 mb-4">
                  {company.jobCounts > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <i className="fas fa-briefcase text-blue-500"></i>
                      </div>
                      <span className="text-gray-700 font-medium">
                        {company.jobCounts} Lowongan aktif
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                      <i className="fas fa-location-dot text-green-500"></i>
                    </div>
                    <span className="text-gray-700">
                      {company.city 
                        ? `${company.city}, ${company.country}`
                        : company.country || "Lokasi tidak tersedia"}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    <i className="fas fa-clock mr-1"></i>
                    Terdaftar di InklusiKerja
                  </div>
                  
                  {company.websiteLink && (
                    <a
                      href={company.websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                    >
                      <i className="fas fa-external-link-alt"></i>
                      <span className="hidden sm:inline">Website</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {companies.length > 0 && (
            <div className="mt-6 sm:mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="hidden sm:inline">Showing</span>
                  <select
                    className="outline-none border border-gray-300 bg-white text-sm rounded-lg px-3 py-2 shadow-sm hidden sm:block"
                    value={filters.limit}
                    onChange={(e) => handleLimitChange(e.target.value)}
                  >
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                    <option value={80}>80</option>
                  </select>
                  <span className="text-gray-700 font-medium">
                    {((meta.page - 1) * meta.limit) + 1} - {Math.min(meta.page * meta.limit, meta.total)} dari {meta.total} perusahaan
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    onClick={() => handlePageChange(meta.page - 1)}
                    disabled={meta.page <= 1 || loading}
                  >
                    <i className="fas fa-chevron-left"></i>
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, meta.totalPages || 1) }, (_, i) => {
                      let pageNum;
                      if (meta.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (meta.page <= 3) {
                        pageNum = i + 1;
                      } else if (meta.page >= meta.totalPages - 2) {
                        pageNum = meta.totalPages - 4 + i;
                      } else {
                        pageNum = meta.page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                            meta.page === pageNum
                              ? 'bg-primary-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    onClick={() => handlePageChange(meta.page + 1)}
                    disabled={meta.page >= (meta.totalPages || 1) || loading}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
              
              {/* Mobile page info */}
              <div className="sm:hidden text-center mt-4 text-sm text-gray-600">
                Halaman {meta.page} dari {meta.totalPages || 1}
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CompaniesPage;