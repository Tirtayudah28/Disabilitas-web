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
  applied: { colorClass: "bg-blue-100 text-blue-800", badgeColor: "blue" },
  reviewed: {
    colorClass: "bg-yellow-100 text-yellow-800",
    badgeColor: "yellow",
  },
  accepted: { colorClass: "bg-green-100 text-green-800", badgeColor: "green" },
  rejected: { colorClass: "bg-red-100 text-red-800", badgeColor: "red" },
  withdrawn: { colorClass: "bg-gray-100 text-gray-800", badgeColor: "gray" },
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
      "bg-gray-100 text-gray-800"
    );
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
      <div className="bg-white rounded-md shadow-lg p-6 animate-pulse">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex w-full items-start gap-4">
            {/* Company Logo */}
            <div className="w-16 h-16 bg-gray-200 rounded" />

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
    <div className="min-h-screen">
      <main
        id="main-content"
        className="container mx-auto lg:px-32 xl:px-36 px-4 py-8"
      >
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-700">Lamaran Saya</h1>
          <div
            className="flex items-center gap-3 hover:bg-gray-100 rounded-md cursor-pointer p-2"
            onClick={() => navigate(`/js/${userData?.id}`)}
          >
            <img
              src={profileData?.profilePicture || defaultCm}
              alt="Profile Picture"
              className="w-10 h-10 aspect-square rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold">
                {profileData?.profile?.fullName}
              </p>
              <p className="text-xs text-blue-600">@{profileData?.username}</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-md shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Lamaran</p>
                <p className="text-2xl mt-0.5 font-bold text-gray-900">
                  {applicationStats.jsTotalApplicationCount || 0}
                </p>
                <p
                  className={`text-sm mt-2 ${
                    applicationStats.thisMonthApplicationCount > 0
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  {applicationStats.thisMonthApplicationCount > 0
                    ? `+${applicationStats.thisMonthApplicationCount}`
                    : applicationStats.thisMonthApplicationCount ?? 0}{" "}
                  bulan ini
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-file-alt text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Status Reviewed</p>
                <p className="text-2xl mt-0.5 font-bold text-gray-900">
                  {applicationStats.jsReviewedApplicationCount || 0}
                </p>
                <p
                  className="text-sm mt-2 text-blue-500 hover:underline"
                  role="button"
                  onClick={() => changeStatus("reviewed")}
                >
                  Terapkan filter
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-eye text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="text-sm text-gray-600 text-center mb-2">
              Result Percentage
            </div>
            {/* Percentage */}
            <div className="mt-2 flex justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-gray-600">
                  {accepted} diterima
                </span>
                <span className="text-lg font-bold text-green-600">
                  {acceptedPercent}%
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-600">
                  {rejected} ditolak
                </span>
                <span className="text-lg font-bold text-red-600">
                  {rejectedPercent}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex">
              <div
                className="bg-green-500 transition-all duration-500"
                style={{ width: `${acceptedPercent}%` }}
              />
              <div
                className="bg-red-500 transition-all duration-500"
                style={{ width: `${rejectedPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-md shadow p-6 sticky top-32">
              <h3 className="font-bold text-lg mb-4">Filter</h3>

              <div className="space-y-2 mb-4">
                {/* Status Select */}
                <div className="mb-4">
                  <label className="text-sm text-gray-600">
                    Status Lamaran
                  </label>
                  <select
                    disabled={appLoading}
                    value={statusInput}
                    onChange={(e) => changeStatus(e.target.value)}
                    className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-primary-400 focus:outline-none disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-600">Sort</label>
                <select
                  disabled={appLoading}
                  value={sortInput}
                  onChange={(e) => changeSort(e.target.value)}
                  className="w-full mt-2 border rounded px-3 py-2 disabled:opacity-50"
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                </select>
              </div>

              <button
                onClick={() => resetFilters("all")}
                className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition mt-2"
              >
                Reset Filter
              </button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex gap-3 flex-1 bg-gray-50 items-center border border-gray-300 rounded-full px-6 py-3 shadow mb-6">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                className="outline-none flex-1 bg-transparent"
                type="search"
                placeholder="Posisi, perusahaan..."
                disabled={appLoading}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applySearch();
                }}
              />
              <button
                onClick={applySearch}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                {appLoading ? (
                  <>
                    <i className="fas fa-spinner animate-spin"></i> Mencari...
                  </>
                ) : (
                  <>Cari</>
                )}
              </button>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
              {appLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <ApplicationCardSkeleton key={i} />
                ))}

              {!appLoading && applications.length === 0 && (
                <div className="bg-white rounded-md shadow-lg p-6 text-center text-gray-500">
                  Tidak ada apa-apa disini
                </div>
              )}

              {!appLoading &&
                applications.map((application) => (
                  <div
                    key={application.id}
                    className="bg-white rounded-md shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
                  >
                    <div className="flex flex-col w-full lg:flex-row lg:items-start justify-between gap-4">
                      {/* Job Info */}
                      <div className="flex w-full items-start gap-4">
                        <img
                          src={
                            application.Job?.Company?.User?.profilePicture ||
                            defaultCm
                          }
                          alt="Profile Picture"
                          className="w-16 h-16 aspect-square object-cover"
                        />
                        <div className="flex flex-1 flex-col items-start mb-2">
                          <h3
                            className="text-xl font-bold text-blue-600 hover:underline cursor-pointer"
                            onClick={() =>
                              navigate(`/job/${application?.Job?.id}`)
                            }
                          >
                            {application.Job?.title}
                          </h3>
                          <p className="text-sm">
                            {application.Job?.Company?.companyName} •{" "}
                            <span className="capitalize">
                              {`${application.Job?.employmentType} (${application.Job?.locationType})`}
                            </span>
                          </p>
                          <span className="text-sm text-gray-600 mt-1">
                            <i className="fas fa-calendar mr-1"></i>
                            Dilamar:{" "}
                            {application?.appliedAt
                              ? new Intl.DateTimeFormat("id-ID", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }).format(new Date(application.appliedAt))
                              : ""}
                          </span>
                        </div>
                        <p
                          className={`px-3 py-1 rounded-full text-sm uppercase font-medium ${getStatusBadgeClass(
                            application.status
                          )}`}
                        >
                          {STATUS_OPTIONS.find(
                            (s) => s.value === application.status
                          )?.label || application.status}
                        </p>
                      </div>
                    </div>

                    {/* message section */}
                    {(application.message ||
                      application.portofolioLink ||
                      application.companyMessage ||
                      application.companyExternalLink) && (
                      <button
                        onClick={() => toggleMessage(application.id)}
                        className="text-sm text-gray-600 hover:underline mt-2"
                      >
                        {openMessages[application.id]
                          ? "Sembunyikan pesan lamaran"
                          : "Lihat pesan lamaran..."}
                      </button>
                    )}

                    {openMessages[application.id] &&
                      (application.message || application.portofolioLink) && (
                        <div className="rounded-md p-3 mt-3 bg-blue-50 border border-blue-400 ">
                          {application.message && (
                            <div>
                              <p className="text-sm text-blue-600">
                                <i className="fa-solid fa-message mr-1"></i>{" "}
                                Pesan Pelamar
                              </p>
                              <p className="text-sm leading-loose whitespace-pre-line mt-1">
                                {application.message}
                              </p>
                            </div>
                          )}
                          {application.portofolioLink && (
                            <div className="mt-3">
                              <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={application.portofolioLink}
                                className="text-xs text-blue-600"
                              >
                                <i className="fa-solid fa-link mr-1"></i>
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
                          className={`rounded-md p-3 mt-2 border ${
                            application.status === "accepted"
                              ? "border-green-400 bg-green-50"
                              : application.status === "rejected"
                              ? "border-red-400 bg-red-50"
                              : "border-blue-400 bg-blue-50"
                          }`}
                        >
                          {application.companyMessage && (
                            <div>
                              <p className="text-sm text-blue-600">
                                <i className="fa-solid fa-message mr-1"></i>{" "}
                                Pesan Perusahaan
                              </p>
                              <p className="text-sm leading-loose whitespace-pre-line mt-1">
                                {application.companyMessage}
                              </p>
                            </div>
                          )}
                          {application.companyExternalLink && (
                            <div className="mt-3">
                              <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={application.companyExternalLink}
                                className="text-xs text-blue-600"
                              >
                                <i className="fa-solid fa-link mr-1"></i>
                                {application.companyExternalLink}
                              </a>
                            </div>
                          )}
                        </div>
                      )}

                    <div className="flex gap-4 mt-4 items-center">
                      {progressMap[application.status] && (
                        <div className="flex-1 w-full">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress Lamaran</span>
                            <span>{progressMap[application.status]}%</span>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500
                              ${
                                application.status === "accepted"
                                  ? "bg-green-500"
                                  : application.status === "rejected"
                                  ? "bg-red-500"
                                  : application.status === "withdrawn"
                                  ? "bg-gray-400"
                                  : "bg-blue-500"
                              }
                            `}
                              style={{
                                width: `${progressMap[application.status]}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                      {application.status === "applied" && (
                        <button
                          onClick={() => handleWithdraw(application)}
                          className="text-sm px-5 py-2 border-red-400 text-red-700 rounded-md font-medium border cursor-pointer transition hover:bg-gray-100 "
                        >
                          Batalkan lamaran
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-1 items-center text-sm text-gray-600">
                <span>Showing</span>
                <select
                  className="font-inter outline-none border border-gray-300 bg-white text-sm rounded-md px-2 py-1 shadow-sm"
                  value={filters.limit}
                  onChange={(e) => changeLimit(Number(e.target.value))}
                >
                  {ALLOWED_LIMITS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
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

export default ApplicationHistory;
