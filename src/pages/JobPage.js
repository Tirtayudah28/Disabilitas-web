// src/pages/LowonganPage.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import JobCard from "../components/JobCard";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const JobPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    disabilityTypes: [],
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

  // Build disability CSV untuk API
  const buildDisabilityCsv = useCallback(
    (disabilityArray) => {
      const arr = disabilityArray || filters.disabilityTypes;
      if (arr.length === 0 || arr.includes("semua-jenis")) return undefined;
      return arr.filter((type) => type !== "semua-jenis").join(",");
    },
    [filters.disabilityTypes]
  );

  // Fetch jobs dengan filter yang diberikan
  const fetchJobs = useCallback(
    async (filterOverrides = {}) => {
      try {
        setLoading(true);

        // Gabungkan filter saat ini dengan overrides
        const currentFilters = { ...filters, ...filterOverrides };

        // Build params untuk API
        const params = {
          page: currentFilters.page,
          limit: currentFilters.limit,
          search: currentFilters.search || "",
          disabilityTypes:
            buildDisabilityCsv(currentFilters.disabilityTypes) || "",
        };

        // Hapus empty values
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

        // Update filter state dengan nilai yang benar-benar digunakan
        setFilters((prev) => ({
          ...prev,
          page: data.meta.page,
          search: currentFilters.search,
          disabilityTypes: currentFilters.disabilityTypes,
          limit: currentFilters.limit,
        }));

        // Sync URL
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

  // Initial load - baca dari URL
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const searchFromUrl = sp.get("q") || "";

    setSearchInput(searchFromUrl);

    // Set initial filters dari URL
    const initialFilters = {
      search: searchFromUrl,
      disabilityTypes: ["semua-jenis"],
      limit: 30,
      page: 1,
    };

    setFilters(initialFilters);

    // Fetch dengan filter awal
    fetchJobs(initialFilters);
  }, []);

  // Handle search dari input
  const handleSearch = () => {
    const newFilters = {
      ...filters,
      search: searchInput.trim(),
      page: 1, // Reset ke halaman 1
    };

    setFilters(newFilters);
    fetchJobs(newFilters);
  };

  // Handle disability filter changes
  const handleDisabilityFilterChange = (value) => {
    let newDisabilityTypes;

    if (value === "semua-jenis") {
      newDisabilityTypes = ["semua-jenis"];
    } else {
      const current = filters.disabilityTypes;
      if (current.includes(value)) {
        // Hapus jika sudah ada
        newDisabilityTypes = current.filter(
          (v) => v !== value && v !== "semua-jenis"
        );
      } else {
        // Tambah jika belum ada
        newDisabilityTypes = [
          ...current.filter((v) => v !== "semua-jenis"),
          value,
        ];
      }

      // Jika kosong, set ke "semua-jenis"
      if (newDisabilityTypes.length === 0) {
        newDisabilityTypes = ["semua-jenis"];
      }
    }

    const newFilters = {
      ...filters,
      disabilityTypes: newDisabilityTypes,
      page: 1, // Reset ke halaman 1
    };

    setFilters(newFilters);
    fetchJobs(newFilters);
  };
  // Reset filters
  const resetFilters = (filterType = "all") => {
    let newFilters = { ...filters, page: 1 };
    let newSearchInput = searchInput;

    if (filterType === "search" || filterType === "all") {
      newFilters.search = "";
      newSearchInput = "";
    }

    if (filterType === "disabilityType" || filterType === "all") {
      newFilters.disabilityTypes = ["semua-jenis"];
    }

    setSearchInput(newSearchInput);
    setFilters(newFilters);
    fetchJobs(newFilters);
  };

  // Pagination
  const goToPage = (newPage) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <main className="container mx-auto lg:px-32 xl:px-36 py-8">
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
                  { value: "sensory", label: "Sensory" },
                  { value: "physical", label: "Physical" },
                  { value: "mental", label: "Mental" },
                  { value: "intellectual", label: "Intellectual" },
                  { value: "multiple", label: "Multiple" },
                  { value: "other", label: "Other" },
                  { value: "semua-jenis", label: "Semua Jenis" },
                ].map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-center p-2 rounded cursor-pointer transition ${
                      filters.disabilityTypes.includes(type.value)
                        ? "bg-blue-100 text-blue-800"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={filters.disabilityTypes.includes(type.value)}
                      onChange={() => handleDisabilityFilterChange(type.value)}
                      className="mr-3 h-4 w-4 text-blue-500"
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={() => resetFilters("all")}
                className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition mt-2"
              >
                Reset Filter
              </button>
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
              {loading && <div className="text-center py-8">Memuat...</div>}
              {!loading && jobs.length === 0 && (
                <div className="text-center py-8 text-gray-600">
                  Tidak ada lowongan untuk kriteria ini.
                </div>
              )}
              {!loading &&
                jobs.map((job) => <JobCard key={job.id} job={job} />)}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
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
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  onClick={() => goToPage(meta.page - 1)}
                  disabled={meta.page <= 1 || loading}
                >
                  Prev
                </button>
                <span className="px-3 py-1">
                  Page {meta.page} of {meta.totalPages || 1}
                </span>
                <button
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  onClick={() => goToPage(meta.page + 1)}
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
