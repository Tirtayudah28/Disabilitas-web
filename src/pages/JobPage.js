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
      <div className="bg-white border border-gray-200 rounded p-5 shadow animate-pulse">
        {/* Title + Company */}
        <div className="mb-3 flex gap-3">
          {/* Image */}
          <div className="h-16 w-16 rounded bg-gray-200" />

          <div className="flex-1 space-y-2">
            <div className="h-5 w-2/3 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
            <div className="h-4 w-1/3 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Basic Info */}
        <div className="flex flex-wrap gap-3 text-sm mb-3">
          <div className="h-7 w-32 bg-gray-200 rounded-full" />
          <div className="h-7 w-40 bg-gray-200 rounded-full" />
        </div>

        {/* Description */}
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-7 w-20 bg-gray-200 rounded-full" />
          <div className="h-7 w-24 bg-gray-200 rounded-full" />
          <div className="h-7 w-16 bg-gray-200 rounded-full" />
        </div>

        {/* Disabilities */}
        <div className="flex flex-wrap gap-2">
          <div className="h-7 w-28 bg-gray-200 rounded-full" />
          <div className="h-7 w-32 bg-gray-200 rounded-full" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto lg:px-32 xl:px-36 py-8">
        {/* Header Section */}
        {token ? null : (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Semua Bisa <span className="text-blue-600">Kerja</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Mencari pekerjaan seharusnya mudah untuk semua. Kami
                menghubungkan talenta disabilitas dengan perusahaan-perusahaan inklusif
              </p>
            </div>
          </div>
        )}
        {/* Search */}
        <div className="bg-white rounded-md shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-3 gap-5 border-2 border-gray-300 rounded-lg">
              <i className="fas fa-search text-gray-400"></i>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Posisi, perusahaan, atau jenis pekerjaan..."
                className="w-full focus:outline-none transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-blue-500 text-white px-10 py-3 rounded-lg hover:bg-blue-600 transition font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner animate-spin"></i> Mencari...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search"></i> Cari
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Filter Disability */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow p-6 sticky top-32">
              <h3 className="font-bold text-lg mb-4">Filter Disabilitas</h3>

              <div className="space-y-2 mb-6">
                {[
                  { value: "sensory", label: "Indrawi" },
                  { value: "physical", label: "Fisik" },
                  { value: "mental", label: "Mental" },
                  { value: "intellectual", label: "Kecerdasan" },
                  { value: "multiple", label: "Ganda" },
                  { value: "other", label: "Lain-lain" },
                  { value: "semua-jenis", label: "Semua Jenis" },
                ].map((type) => {
                  const checked = (
                    pendingDisabilityTypes || DEFAULT_FILTERS.disabilityTypes
                  ).includes(type.value);
                  return (
                    <label
                      key={type.value}
                      className={`flex items-center p-2 rounded cursor-pointer transition ${
                        checked
                          ? "bg-blue-100 text-blue-800"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePendingDisabilityType(type.value)}
                        className="mr-3 h-4 w-4 text-blue-500"
                      />
                      <span>{type.label}</span>
                    </label>
                  );
                })}
              </div>

              {/* Tombol Terapkan + Reset */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={applyDisabilityFilters}
                  disabled={arraysEqualUnordered(
                    filters.disabilityTypes || DEFAULT_FILTERS.disabilityTypes,
                    pendingDisabilityTypes || DEFAULT_FILTERS.disabilityTypes
                  )}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                    arraysEqualUnordered(
                      filters.disabilityTypes ||
                        DEFAULT_FILTERS.disabilityTypes,
                      pendingDisabilityTypes || DEFAULT_FILTERS.disabilityTypes
                    )
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Terapkan Filter
                </button>

                <button
                  onClick={() => resetFilters("disabilityType")}
                  className="py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {meta?.total || 0} Lowongan Ditemukan
                </h2>
                <div className="flex gap-4 mt-1 text-sm text-gray-600">
                  {filters.search && (
                    <span className="rounded-full px-5 py-1 bg-white text-blue-800 border border-blue-200 font-medium">
                      "{filters.search}"{" "}
                      <button
                        onClick={() => resetFilters("search")}
                        className="ml-2"
                      >
                        <i className="fas fa-x text-xs"></i>
                      </button>
                    </span>
                  )}
                  {filters.disabilityTypes.length > 0 &&
                    !filters.disabilityTypes.includes("semua-jenis") && (
                      <span className="rounded-full px-5 py-1 bg-white text-blue-800 border border-blue-200 font-medium">
                        {filters.disabilityTypes
                          .filter((t) => t !== "semua-jenis")
                          .join(", ")}{" "}
                        <button
                          onClick={() => resetFilters("disabilityType")}
                          className="ml-2"
                        >
                          <i className="fas fa-x text-xs"></i>
                        </button>
                      </span>
                    )}
                </div>
              </div>
            </div>

            {/* Job List*/}
            <div className="space-y-4">
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              {!loading && jobs.length === 0 && (
                <div className="text-center py-8 text-gray-600">
                  Tidak ada apa-apa disini
                </div>
              )}
              {!loading &&
                jobs.map((job) => <JobCard key={job.id} job={job} />)}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 rounded-lg border border-gray-200 p-4 bg-blue-50">
              <div className="flex gap-1 items-center text-sm text-gray-600">
                <span>Showing</span>
                <select
                  className="font-inter outline-none border border-gray-300 bg-white text-sm rounded-md px-2 py-1 shadow-sm"
                  value={filters.limit}
                  onChange={(e) => handleLimitChange(e.target.value)}
                >
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                  <option value={80}>80</option>
                </select>
                <span>data from {meta.total}</span>
              </div>
              <div className="flex gap-2 items-center">
                <button
                  className="px-3 py-1 border bg-gray-50 cursor-pointer rounded disabled:opacity-50"
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page <= 1 || loading}
                >
                  Prev
                </button>
                <span className="px-3 py-1 text-xs">
                  Page {meta.page} of {meta.totalPages || 1}
                </span>
                <button
                  className="px-3 py-1 border bg-gray-50 cursor-pointer rounded disabled:opacity-50"
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page >= (meta.totalPages || 1) || loading}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobPage;
