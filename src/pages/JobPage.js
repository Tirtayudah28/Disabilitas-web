// src/pages/LowonganPage.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import JobCard from "../components/JobCard";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const DEFAULT_FILTERS = {
  search: "",
  disabilityTypes: ["semua-jenis"],
  limit: 30,
  page: 1,
};

const JobPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [meta, setMeta] = useState({
    page: 1,
    limit: 30,
    total: 0,
    totalPages: 0,
  });

  const [searchInput, setSearchInput] = useState("");
  const [pendingDisabilityTypes, setPendingDisabilityTypes] = useState(
    DEFAULT_FILTERS.disabilityTypes
  );

  //disability CSV
  const buildDisabilityCsv = useCallback(
    (disabilityArray) => {
      const arr = disabilityArray || filters.disabilityTypes;
      if (arr.length === 0 || arr.includes("semua-jenis")) return undefined;
      return arr.filter((type) => type !== "semua-jenis").join(",");
    },
    [filters.disabilityTypes]
  );
  //fetch jobs
  const fetchJobs = useCallback(
    async (filterOverrides = {}) => {
      try {
        setLoading(true);

        const currentFilters = { ...filters, ...filterOverrides };

        const params = {
          page: currentFilters.page,
          limit: currentFilters.limit,
          search: currentFilters.search || "",
          disabilityTypes:
            buildDisabilityCsv(currentFilters.disabilityTypes) || "",
        };

        Object.keys(params).forEach((key) => {
          if (params[key] === "") delete params[key];
        });

        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await axios.get("/api/jobs", { params, headers });
        const data = res.data;

        setJobs(data.data || []);
        setMeta({
          page: data.meta.page,
          limit: data.meta.limit,
          total: data.meta.total,
          totalPages: data.meta.totalPages,
        });

        setFilters((prev) => ({
          ...prev,
          page: data.meta.page,
          search: currentFilters.search,
          disabilityTypes: currentFilters.disabilityTypes,
          limit: currentFilters.limit,
        }));

        setPendingDisabilityTypes(
          currentFilters.disabilityTypes &&
            currentFilters.disabilityTypes.length > 0
            ? currentFilters.disabilityTypes
            : DEFAULT_FILTERS.disabilityTypes
        );

        const qs = new URLSearchParams();
        if (currentFilters.search) qs.set("q", currentFilters.search);
        navigate(`/jobs?${qs.toString()}`, { replace: true });
      } catch (err) {
        console.error(
          err?.response?.data?.message || err.message || "Server error"
        );
      } finally {
        setLoading(false);
      }
    },
    [filters, token, navigate, buildDisabilityCsv]
  );
  // initial effect
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const searchFromUrl = sp.get("q") || "";

    setSearchInput(searchFromUrl);

    const initialFilters = {
      search: searchFromUrl,
      disabilityTypes: ["semua-jenis"],
      limit: 30,
      page: 1,
    };

    setFilters(initialFilters);
    setPendingDisabilityTypes(initialFilters.disabilityTypes);

    fetchJobs(initialFilters);
  }, []);
  useEffect(() => {
    if (filters?.disabilityTypes) {
      setPendingDisabilityTypes(filters.disabilityTypes);
    }
  }, [filters.disabilityTypes]);

  //search input handler
  const handleSearch = () => {
    if ((!searchInput && !filters.search) || searchInput === filters.search)
      return;
    const newFilters = {
      ...filters,
      search: searchInput.trim(),
      page: 1,
    };

    setFilters(newFilters);
    fetchJobs(newFilters);
  };

  /*
    DISABILITY FILTER HANDLERS
  */
  const togglePendingDisabilityType = (value) => {
    let newPending;

    if (value === "semua-jenis") {
      newPending = ["semua-jenis"];
    } else {
      const current = pendingDisabilityTypes || [];
      if (current.includes(value)) {
        // Hapus jika sudah ada (dan pastikan "semua-jenis" tidak ikut)
        newPending = current.filter((v) => v !== value && v !== "semua-jenis");
      } else {
        // Tambah jika belum ada
        newPending = [...current.filter((v) => v !== "semua-jenis"), value];
      }

      // Jika kosong, set ke "semua-jenis"
      if (newPending.length === 0) {
        newPending = ["semua-jenis"];
      }
    }

    setPendingDisabilityTypes(newPending);
  };
  // compare array helper (unordered)
  const arraysEqualUnordered = (a = [], b = []) => {
    if (a.length !== b.length) return false;
    const setA = new Set(a);
    return b.every((v) => setA.has(v));
  };
  // apply pending filters ke filters utama + fetch
  const applyDisabilityFilters = () => {
    const current = filters.disabilityTypes || DEFAULT_FILTERS.disabilityTypes;
    const pending = pendingDisabilityTypes || DEFAULT_FILTERS.disabilityTypes;

    const same = arraysEqualUnordered(current, pending);
    if (same) return; 

    const newFilters = {
      ...filters,
      disabilityTypes: pending,
      page: 1,
    };

    setFilters(newFilters);
    fetchJobs(newFilters);
  };

  /*
    FILTER RESET
  */
  //check default filter
  const isDefaultFilter = (filterType = "all") => {
    if (filterType === "search") {
      return filters.search === "" && searchInput === "";
    }

    if (filterType === "disabilityType") {
      return (
        filters.disabilityTypes.length === 1 &&
        filters.disabilityTypes[0] === "semua-jenis"
      );
    }

    // all
    return (
      filters.search === "" &&
      searchInput === "" &&
      filters.disabilityTypes.length === 1 &&
      filters.disabilityTypes[0] === "semua-jenis" &&
      filters.page === 1
    );
  };
  // reset filters
  const resetFilters = (filterType = "all") => {
    if (isDefaultFilter(filterType)) {
      setPendingDisabilityTypes(DEFAULT_FILTERS.disabilityTypes);
      return;
    }

    let newFilters = { ...filters, page: 1 };
    let newSearchInput = searchInput;

    if (filterType === "search" || filterType === "all") {
      newFilters.search = "";
      newSearchInput = "";
    }

    if (filterType === "disabilityType" || filterType === "all") {
      newFilters.disabilityTypes = ["semua-jenis"];
      setPendingDisabilityTypes(["semua-jenis"]);
    }

    setSearchInput(newSearchInput);
    setFilters(newFilters);
    fetchJobs(newFilters);
  };

  /*
    PAGINATION
  */
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > (meta.totalPages || 1)) return;

    const newFilters = {
      ...filters,
      page: newPage,
    };

    setFilters(newFilters);
    fetchJobs(newFilters);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // Change limit
  const handleLimitChange = (newLimit) => {
    const newFilters = {
      ...filters,
      limit: Number(newLimit),
      page: 1,
    };

    setFilters(newFilters);
    fetchJobs(newFilters);
  };

  /*
    SKELETON LOADER
  */
  const JobCardSkeleton = () => {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm animate-pulse">
        {/* Title + Company */}
        <div className="mb-3 flex gap-3">
          {/* Image */}
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-gray-200" />

          <div className="flex-1 space-y-2 min-w-0">
            <div className="h-5 sm:h-6 w-2/3 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="h-6 w-24 sm:w-28 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-32 sm:w-36 bg-gray-200 rounded-full"></div>
        </div>

        {/* Description */}
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
          <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-14 bg-gray-200 rounded-full"></div>
        </div>

        {/* Disabilities */}
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-28 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 sm:py-6 md:py-8">
        {/* Header Section */}
        {!token && (
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <div className="inline-block mb-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Semua Bisa <span className="text-primary-600">Kerja</span>
              </h1>
              <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto"></div>
            </div>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Mencari pekerjaan seharusnya mudah untuk semua. Kami menghubungkan talenta disabilitas dengan perusahaan-perusahaan inklusif
            </p>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center px-4 py-3 sm:py-4 gap-4 border-2 border-gray-300 rounded-xl hover:border-primary-400 focus-within:border-primary-500 transition-colors">
              <i className="fas fa-search text-gray-400 text-lg"></i>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Posisi, perusahaan, atau jenis pekerjaan..."
                className="w-full focus:outline-none text-base sm:text-lg placeholder:text-gray-500 bg-transparent"
                aria-label="Cari pekerjaan"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300 font-medium flex items-center gap-2 disabled:opacity-50 min-w-[120px] justify-center shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner animate-spin"></i>
                    <span className="hidden sm:inline">Mencari...</span>
                    <span className="sm:hidden">Cari...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-search"></i>
                    <span className="hidden sm:inline">Cari Lowongan</span>
                    <span className="sm:hidden">Cari</span>
                  </>
                )}
              </button>
              
              {/* Mobile Filter Toggle Button */}
              <button
                className="lg:hidden flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                aria-label="Toggle filter menu"
                onClick={() => {
                  const filterPanel = document.getElementById('filter-panel');
                  filterPanel?.classList.toggle('hidden');
                  filterPanel?.classList.toggle('block');
                }}
              >
                <i className="fas fa-filter"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Filter Disability - Responsive Sidebar */}
          <div id="filter-panel" className="lg:block hidden lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 sticky top-6 lg:top-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-900">Filter Disabilitas</h3>
                <button 
                  onClick={() => resetFilters("disabilityType")}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-2 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {[
                  { value: "sensory", label: "Indrawi", icon: "fas fa-eye" },
                  { value: "physical", label: "Fisik", icon: "fas fa-wheelchair" },
                  { value: "mental", label: "Mental", icon: "fas fa-brain" },
                  { value: "intellectual", label: "Kecerdasan", icon: "fas fa-lightbulb" },
                  { value: "multiple", label: "Ganda", icon: "fas fa-layer-group" },
                  { value: "other", label: "Lain-lain", icon: "fas fa-ellipsis-h" },
                  { value: "semua-jenis", label: "Semua Jenis", icon: "fas fa-globe" },
                ].map((type) => {
                  const checked = (
                    pendingDisabilityTypes || DEFAULT_FILTERS.disabilityTypes
                  ).includes(type.value);
                  return (
                    <button
                      key={type.value}
                      onClick={() => togglePendingDisabilityType(type.value)}
                      className={`w-full flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                        checked
                          ? "bg-primary-50 text-primary-700 border border-primary-200"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <div className={`flex items-center justify-center w-6 h-6 rounded mr-3 ${
                        checked ? 'bg-primary-100' : 'bg-gray-100'
                      }`}>
                        <i className={`${type.icon} text-sm ${checked ? 'text-primary-600' : 'text-gray-500'}`}></i>
                      </div>
                      <span className="font-medium flex-1 text-left">{type.label}</span>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                        checked 
                          ? 'bg-primary-500 border-primary-500' 
                          : 'border-gray-300'
                      }`}>
                        {checked && <i className="fas fa-check text-white text-xs"></i>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Tombol Terapkan */}
              <button
                onClick={applyDisabilityFilters}
                disabled={arraysEqualUnordered(
                  filters.disabilityTypes || DEFAULT_FILTERS.disabilityTypes,
                  pendingDisabilityTypes || DEFAULT_FILTERS.disabilityTypes
                )}
                className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                  arraysEqualUnordered(
                    filters.disabilityTypes ||
                      DEFAULT_FILTERS.disabilityTypes,
                    pendingDisabilityTypes || DEFAULT_FILTERS.disabilityTypes
                  )
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg"
                }`}
              >
                Terapkan Filter
              </button>
            </div>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {meta?.total || 0} Lowongan Ditemukan
                  </h2>
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
                    {filters.disabilityTypes.length > 0 &&
                      !filters.disabilityTypes.includes("semua-jenis") && (
                        <div className="inline-flex items-center gap-2 bg-secondary-50 text-secondary-700 px-3 py-1.5 rounded-full text-sm font-medium">
                          <span>
                            {filters.disabilityTypes
                              .filter((t) => t !== "semua-jenis")
                              .map(t => {
                                const labels = {
                                  sensory: "Indrawi",
                                  physical: "Fisik", 
                                  mental: "Mental",
                                  intellectual: "Kecerdasan",
                                  multiple: "Ganda",
                                  other: "Lain-lain"
                                };
                                return labels[t] || t;
                              })
                              .join(", ")}
                          </span>
                          <button
                            onClick={() => resetFilters("disabilityType")}
                            className="hover:bg-secondary-100 rounded-full w-5 h-5 flex items-center justify-center"
                            aria-label="Hapus filter disabilitas"
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

            {/* Job List */}
            <div className="space-y-3 sm:space-y-4">
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              {!loading && jobs.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-search text-gray-400 text-2xl"></i>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    Tidak ada lowongan ditemukan
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Coba ubah kata kunci pencarian atau filter disabilitas
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
              {!loading &&
                jobs.map((job) => <JobCard key={job.id} job={job} />)}
            </div>

            {/* Pagination */}
            {jobs.length > 0 && (
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
                      {((meta.page - 1) * meta.limit) + 1} - {Math.min(meta.page * meta.limit, meta.total)} dari {meta.total} lowongan
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
          </div>
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default JobPage;