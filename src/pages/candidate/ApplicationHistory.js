// src/pages/application/ApplicationHistory.js
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import defaultCm from "../../assets/default-company.png";
import defaultJs from "../../assets/default-pfp.png";
import { enqueueSnackbar } from "notistack";

const STATUS_OPTIONS = [
  { value: "", label: "Semua" },
  { value: "applied", label: "Applied" },
  { value: "reviewed", label: "Reviewed" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
];

const STATUS_COLOR = {
  applied: { colorClass: "bg-blue-100 text-blue-800 border border-blue-200", badgeColor: "blue" },
  reviewed: { colorClass: "bg-amber-100 text-amber-800 border border-amber-200", badgeColor: "amber" },
  accepted: { colorClass: "bg-emerald-100 text-emerald-800 border border-emerald-200", badgeColor: "emerald" },
  rejected: { colorClass: "bg-rose-100 text-rose-800 border border-rose-200", badgeColor: "rose" },
  withdrawn: { colorClass: "bg-gray-100 text-gray-800 border border-gray-200", badgeColor: "gray" },
};

const STATUS_ICONS = {
  applied: "fa-regular fa-paper-plane",
  reviewed: "fa-solid fa-eye",
  accepted: "fa-solid fa-check-circle",
  rejected: "fa-solid fa-times-circle",
  withdrawn: "fa-solid fa-undo",
};

const DEFAULT_LIMIT = 30;
const ALLOWED_LIMITS = [30, 50, 80];
const progressMap = {
  applied: 25,
  reviewed: 50,
  accepted: 100,
  rejected: 100,
  withdrawn: 100,
};

const ApplicationHistory = () => {
  const { token, userData } = useAuth();
  const navigate = useNavigate();

  const [appLoading, setAppLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({});

  const [searchInput, setSearchInput] = useState("");
  const [limitInput, setLimitInput] = useState(DEFAULT_LIMIT);
  const [sortInput, setSortInput] = useState("newest");
  const [statusInput, setStatusInput] = useState("all");

  const [applications, setApplications] = useState([]);
  const [applicationStats, setApplicationStats] = useState({});
  const [meta, setMeta] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    q: "",
    status: "",
    limit: DEFAULT_LIMIT,
    page: 1,
    sort: "newest",
  });

  const [openMessages, setOpenMessages] = useState({});

  //get js applications
  const fetchApplications = async (page = 1) => {
    try {
      setAppLoading(true);

      const params = {
        page,
        limit: filters.limit,
        sort: filters.sort,
        status: filters.status || "",
        search: filters.q || "",
      };

      const res = await axios.get("/api/user/js/applications", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      setApplications(res.data.data || []);
      setMeta({
        page: res.data.meta.page,
        limit: res.data.meta.limit,
        total: res.data.meta.total,
        totalPages: res.data.meta.totalPages,
      });
    } catch (err) {
      console.error(
        err?.response?.data?.message || err.message || "Server error"
      );
    } finally {
      setAppLoading(false);
    }
  };
  // get js app stats
  const getJsAppStats = async () => {
    try {
      const res = await axios.get(`/api/data/js-application-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && res.data.success) {
        setApplicationStats(res.data.data);
      } else {
        console.error("unexpected response", res.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };
  //get user profile
  const getUserById = async () => {
    try {
      const res = await axios.get(`/api/user/${userData.id}`);
      if (res.data.data.role === "company") {
        navigate(`/employer`);
      }
      setProfileData(res.data.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    fetchApplications(filters.page);
  }, [filters]);

  useEffect(() => {
    if (!userData || !token) return;
    const fetchAll = async () => {
      setLoading(true);
      try {
        await Promise.all([getUserById(), getJsAppStats()]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [userData, token]);

  // handlers
  const applySearch = () => {
    if ((!searchInput && !filters.q) || searchInput === filters.q) return;
    setFilters((p) => ({ ...p, q: searchInput.trim(), page: 1 }));
  };

  const resetFilters = (status = "all") => {
    setSearchInput("");
    setLimitInput(DEFAULT_LIMIT);
    setSortInput("newest");
    setStatusInput(status);
    setFilters({
      q: "",
      status: status === "all" ? "" : status,
      limit: DEFAULT_LIMIT,
      page: 1,
      sort: "newest",
    });
  };

  const changeLimit = (newLimit) => {
    setLimitInput(newLimit);
    setFilters((p) => ({ ...p, limit: newLimit, page: 1 }));
  };
  const changeSort = (newSort) => {
    setSortInput(newSort);
    setFilters((p) => ({ ...p, sort: newSort, page: 1 }));
  };
  const changeStatus = (newStatus) => {
    setStatusInput(newStatus);
    setFilters((p) => ({
      ...p,
      status: newStatus === "all" ? "" : newStatus,
      page: 1,
    }));
  };

  const goToPage = (page) => {
    setFilters((p) => ({ ...p, page }));
  };

  // helpers for UI
  const getStatusBadgeClass = (status) => {
    return (
      (STATUS_COLOR[status] && STATUS_COLOR[status].colorClass) ||
      "bg-gray-100 text-gray-800 border border-gray-200"
    );
  };
  
  const getStatusIcon = (status) => {
    return STATUS_ICONS[status] || "fa-solid fa-question-circle";
  };
  
  const toggleMessage = (id) => {
    setOpenMessages((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  //handle withdraw application
  const handleWithdraw = async (application) => {
    if (window.confirm("Apakah Anda yakin ingin membatalkan lamaran ini?")) {
      setLoading(true);
      try {
        const res = await axios.patch(
          `/api/user/js/application/${application?.id}/withdraw`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        enqueueSnackbar(res.data.message || "Lamaran berhasil dibatalkan", {
          variant: "success",
        });

        fetchApplications(meta.page || 1);
      } catch (error) {
        enqueueSnackbar(
          error?.response?.data?.message || "Gagal membatalkan lamaran",
          { variant: "warning" }
        );
      } finally {
        setLoading(false);
      }
    }
  };

  //result percentage
  const accepted = applicationStats.jsAcceptedApplicationCount || 0;
  const rejected = applicationStats.jsRejectedApplicationCount || 0;
  const totalDecision = accepted + rejected;
  const acceptedPercent =
    totalDecision > 0 ? Math.round((accepted / totalDecision) * 100) : 0;
  const rejectedPercent = totalDecision > 0 ? 100 - acceptedPercent : 0;

  /*
    SKELETON LOADER
  */
  const ApplicationCardSkeleton = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex w-full items-start gap-4">
            {/* Company Logo */}
            <div className="w-16 h-16 bg-gray-200 rounded-lg" />

            {/* Job Info */}
            <div className="flex-1 space-y-2">
              <div className="h-6 w-2/3 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
            </div>

            {/* Status Badge */}
            <div className="h-6 w-24 bg-gray-200 rounded-full" />
          </div>
        </div>

        {/* Toggle message */}
        <div className="mt-3 h-4 w-40 bg-gray-200 rounded" />

        {/* Progress & Action */}
        <div className="flex gap-4 mt-6 items-center">
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-10 bg-gray-200 rounded" />
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full" />
          </div>

          {/* Action Button */}
          <div className="h-9 w-32 bg-gray-200 rounded-md" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main
        id="main-content"
        className="container mx-auto lg:px-6 xl:px-8 px-4 py-6 md:py-8"
      >
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Riwayat Lamaran</h1>
            <p className="text-gray-600 mt-1">Kelola dan pantau status lamaran kerja Anda</p>
          </div>
          <div
            className="flex items-center gap-3 hover:bg-gray-50 rounded-lg cursor-pointer p-2 transition-all duration-200 border border-transparent hover:border-gray-200"
            onClick={() => navigate(`/js/${userData?.id}`)}
          >
            <div className="relative">
              <img
                src={profileData?.profilePicture || defaultCm}
                alt="Profile Picture"
                className="w-10 h-10 aspect-square rounded-full object-cover ring-2 ring-blue-100"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {profileData?.profile?.fullName || "Pengguna"}
              </p>
              <p className="text-xs text-blue-600">@{profileData?.username || "user"}</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Lamaran</p>
                <p className="text-2xl md:text-3xl mt-2 font-bold text-gray-900">
                  {applicationStats.jsTotalApplicationCount || 0}
                </p>
                <p className={`text-sm mt-3 ${applicationStats.thisMonthApplicationCount > 0 ? "text-blue-600 font-medium" : "text-gray-600"}`}>
                  <i className="fas fa-arrow-up mr-1"></i>
                  {applicationStats.thisMonthApplicationCount > 0
                    ? `+${applicationStats.thisMonthApplicationCount}`
                    : applicationStats.thisMonthApplicationCount ?? 0}{" "}
                  bulan ini
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-file-alt text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Dalam Review</p>
                <p className="text-2xl md:text-3xl mt-2 font-bold text-gray-900">
                  {applicationStats.jsReviewedApplicationCount || 0}
                </p>
                <button
                  className="text-sm mt-3 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
                  onClick={() => changeStatus("reviewed")}
                >
                  <i className="fas fa-filter text-xs"></i>
                  Terapkan filter
                </button>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-eye text-amber-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Rasio Diterima</p>
            </div>
            
            {/* Percentage */}
            <div className="mt-2 flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-xs text-gray-600">Diterima</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl md:text-2xl font-bold text-emerald-600">
                    {acceptedPercent}%
                  </span>
                  <span className="text-sm text-gray-500">({accepted})</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-600">Ditolak</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl md:text-2xl font-bold text-rose-600">
                    {rejectedPercent}%
                  </span>
                  <span className="text-sm text-gray-500">({rejected})</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden flex mt-4">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-700"
                style={{ width: `${acceptedPercent}%` }}
              />
              <div
                className="bg-gradient-to-r from-rose-500 to-rose-600 transition-all duration-700"
                style={{ width: `${rejectedPercent}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Berdasarkan {totalDecision} lamaran dengan keputusan
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <i className="fas fa-sliders-h text-blue-600"></i>
                <h3 className="font-bold text-lg text-gray-900">Filter & Sort</h3>
              </div>

              {/* Search Input inside sidebar for mobile */}
              <div className="lg:hidden mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
                  </div>
                  <input
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    type="search"
                    placeholder="Posisi, perusahaan..."
                    disabled={appLoading}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") applySearch();
                    }}
                  />
                </div>
              </div>

              <div className="space-y-5">
                {/* Status Select */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    <i className="fas fa-flag mr-2 text-gray-500"></i>
                    Status Lamaran
                  </label>
                  <div className="relative">
                    <select
                      disabled={appLoading}
                      value={statusInput}
                      onChange={(e) => changeStatus(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <i className="fas fa-chevron-down"></i>
                    </div>
                  </div>
                </div>

                {/* Sort Select */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    <i className="fas fa-sort mr-2 text-gray-500"></i>
                    Urutkan
                  </label>
                  <div className="relative">
                    <select
                      disabled={appLoading}
                      value={sortInput}
                      onChange={(e) => changeSort(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none disabled:opacity-50"
                    >
                      <option value="newest">Terbaru</option>
                      <option value="oldest">Terlama</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <i className="fas fa-chevron-down"></i>
                    </div>
                  </div>
                </div>

                {/* Results per page */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    <i className="fas fa-list-ol mr-2 text-gray-500"></i>
                    Tampilkan per halaman
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ALLOWED_LIMITS.map((limit) => (
                      <button
                        key={limit}
                        onClick={() => changeLimit(limit)}
                        className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                          filters.limit === limit
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {limit}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => resetFilters("all")}
                  className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <i className="fas fa-redo"></i>
                  Reset Filter
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search bar - hidden on mobile (moved to sidebar) */}
            <div className="hidden lg:flex mb-6">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
                </div>
                <input
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-l-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  type="search"
                  placeholder="Cari berdasarkan posisi, perusahaan..."
                  disabled={appLoading}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") applySearch();
                  }}
                />
              </div>
              <button
                onClick={applySearch}
                className="px-6 py-3 rounded-r-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
              >
                {appLoading ? (
                  <>
                    <i className="fas fa-spinner animate-spin"></i>
                    Mencari...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search"></i>
                    Cari
                  </>
                )}
              </button>
            </div>

            {/* Applications Count */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-gray-700">
                Menampilkan <span className="font-bold">{applications.length}</span> dari{" "}
                <span className="font-bold">{meta.total}</span> lamaran
              </div>
              <div className="text-sm text-gray-500">
                Halaman {meta.page} dari {meta.totalPages || 1}
              </div>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
              {appLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <ApplicationCardSkeleton key={i} />
                ))}

              {!appLoading && applications.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <i className="fas fa-inbox text-3xl text-gray-400"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada lamaran</h3>
                  <p className="text-gray-600 mb-6">Anda belum mengirimkan lamaran apapun.</p>
                  <button
                    onClick={() => navigate("/job/search")}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                  >
                    <i className="fas fa-search"></i>
                    Cari Lowongan
                  </button>
                </div>
              )}

              {!appLoading &&
                applications.map((application) => (
                  <div
                    key={application.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200"
                  >
                    <div className="flex flex-col w-full lg:flex-row lg:items-start justify-between gap-4">
                      {/* Job Info */}
                      <div className="flex w-full items-start gap-4">
                        <div className="relative">
                          <img
                            src={
                              application.Job?.Company?.User?.profilePicture ||
                              defaultCm
                            }
                            alt="Company Logo"
                            className="w-16 h-16 aspect-square object-cover rounded-xl border border-gray-200"
                          />
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full border border-gray-200 flex items-center justify-center">
                            <i className={`${getStatusIcon(application.status)} text-sm ${application.status === 'accepted' ? 'text-emerald-600' : application.status === 'rejected' ? 'text-rose-600' : 'text-blue-600'}`}></i>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-2">
                            <div>
                              <h3
                                className="text-lg font-bold text-gray-900 hover:text-blue-700 cursor-pointer transition-colors"
                                onClick={() =>
                                  navigate(`/job/${application?.Job?.id}`)
                                }
                              >
                                {application.Job?.title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {application.Job?.Company?.companyName}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full">
                                  <i className="fas fa-briefcase mr-1"></i>
                                  {application.Job?.employmentType}
                                </span>
                                <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full">
                                  <i className="fas fa-location-dot mr-1"></i>
                                  {application.Job?.locationType}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-start lg:items-end gap-2">
                              <span
                                className={`px-3 py-1.5 rounded-full text-xs uppercase font-semibold ${getStatusBadgeClass(
                                  application.status
                                )}`}
                              >
                                <i className={`${getStatusIcon(application.status)} mr-1.5`}></i>
                                {STATUS_OPTIONS.find(
                                  (s) => s.value === application.status
                                )?.label || application.status}
                              </span>
                              <span className="text-xs text-gray-500">
                                <i className="fas fa-calendar mr-1"></i>
                                {application?.appliedAt
                                  ? new Intl.DateTimeFormat("id-ID", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    }).format(new Date(application.appliedAt))
                                  : ""}
                              </span>
                            </div>
                          </div>

                          {/* message section */}
                          {(application.message ||
                            application.portofolioLink ||
                            application.companyMessage ||
                            application.companyExternalLink) && (
                            <button
                              onClick={() => toggleMessage(application.id)}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 inline-flex items-center gap-1 transition-colors"
                            >
                              {openMessages[application.id] ? (
                                <>
                                  <i className="fas fa-chevron-up"></i>
                                  Sembunyikan detail
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-chevron-down"></i>
                                  Lihat detail lamaran
                                </>
                              )}
                            </button>
                          )}

                          {openMessages[application.id] &&
                            (application.message || application.portofolioLink) && (
                              <div className="rounded-lg p-4 mt-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <i className="fas fa-user text-blue-600"></i>
                                  <p className="text-sm font-medium text-blue-800">
                                    Pesan dan Lampiran Anda
                                  </p>
                                </div>
                                {application.message && (
                                  <div className="mb-3">
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                      {application.message}
                                    </p>
                                  </div>
                                )}
                                {application.portofolioLink && (
                                  <div className="flex items-center gap-2">
                                    <i className="fas fa-link text-blue-600"></i>
                                    <a
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      href={application.portofolioLink}
                                      className="text-sm text-blue-700 hover:text-blue-900 font-medium truncate"
                                    >
                                      {application.portofolioLink}
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}

                          {openMessages[application.id] &&
                            (application.companyMessage ||
                              application.companyExternalLink) && (
                              <div
                                className={`rounded-lg p-4 mt-3 border ${
                                  application.status === "accepted"
                                    ? "bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200"
                                    : application.status === "rejected"
                                    ? "bg-gradient-to-r from-rose-50 to-rose-100 border-rose-200"
                                    : "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <i className="fas fa-building text-gray-600"></i>
                                  <p className="text-sm font-medium text-gray-800">
                                    Respon Perusahaan
                                  </p>
                                </div>
                                {application.companyMessage && (
                                  <div className="mb-3">
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                      {application.companyMessage}
                                    </p>
                                  </div>
                                )}
                                {application.companyExternalLink && (
                                  <div className="flex items-center gap-2">
                                    <i className="fas fa-external-link-alt text-blue-600"></i>
                                    <a
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      href={application.companyExternalLink}
                                      className="text-sm text-blue-700 hover:text-blue-900 font-medium truncate"
                                    >
                                      {application.companyExternalLink}
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-5 items-center">
                      <div className="flex-1 w-full">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span className="font-medium">Progress Lamaran</span>
                          <span className="font-bold">{progressMap[application.status]}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-700 ${
                              application.status === "accepted"
                                ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                                : application.status === "rejected"
                                ? "bg-gradient-to-r from-rose-500 to-rose-600"
                                : application.status === "withdrawn"
                                ? "bg-gradient-to-r from-gray-400 to-gray-500"
                                : application.status === "reviewed"
                                ? "bg-gradient-to-r from-amber-500 to-amber-600"
                                : "bg-gradient-to-r from-blue-500 to-blue-600"
                            }`}
                            style={{
                              width: `${progressMap[application.status]}%`,
                            }}
                          />
                        </div>
                      </div>
                      {application.status === "applied" && (
                        <button
                          onClick={() => handleWithdraw(application)}
                          className="px-5 py-2.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg font-medium cursor-pointer transition-colors flex items-center gap-2"
                          disabled={loading}
                        >
                          {loading ? (
                            <i className="fas fa-spinner animate-spin"></i>
                          ) : (
                            <i className="fas fa-times-circle"></i>
                          )}
                          Batalkan Lamaran
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <div className="mb-4 sm:mb-0 text-sm text-gray-600">
                  Menampilkan {(meta.page - 1) * meta.limit + 1} -{" "}
                  {Math.min(meta.page * meta.limit, meta.total)} dari {meta.total} lamaran
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    onClick={() => goToPage(meta.page - 1)}
                    disabled={meta.page <= 1 || appLoading}
                  >
                    <i className="fas fa-chevron-left"></i>
                    Sebelumnya
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
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
                          onClick={() => goToPage(pageNum)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            meta.page === pageNum
                              ? "bg-blue-600 text-white font-medium"
                              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                          } transition-colors`}
                          disabled={appLoading}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    onClick={() => goToPage(meta.page + 1)}
                    disabled={meta.page >= meta.totalPages || appLoading}
                  >
                    Selanjutnya
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplicationHistory;