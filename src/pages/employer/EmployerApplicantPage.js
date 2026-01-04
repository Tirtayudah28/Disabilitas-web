import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import defaultPfp from "../../assets/default-pfp.png";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import ActionStatusAppPopup from "../../components/popups/ActionStatusAppPopup";

const STATUS_COLOR = {
  applied: { colorClass: "bg-blue-100 text-blue-800", badgeColor: "blue" },
  reviewed: {
    colorClass: "bg-yellow-100 text-yellow-800",
    badgeColor: "yellow",
  },
  accepted: { colorClass: "bg-green-100 text-green-800", badgeColor: "green" },
  rejected: { colorClass: "bg-red-100 text-red-800", badgeColor: "red" },
};

const EmployerApplicantPage = () => {
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const searchDebounceRef = useRef(null);
  const initialFetchRef = useRef(false);

  const [applications, setApplications] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 30,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    sort: "newest",
    limit: 30,
  });
  const [searchInput, setSearchInput] = useState("");

  const [showActStaPopup, setShowActStaPopup] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [openMessages, setOpenMessages] = useState({});

  //get company's job
  const fetchApplication = async (page = 1) => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: filters.limit,
        search: filters.search || undefined,
        status: filters.status || undefined,
        disabilityTypes: filters.disabilityType || undefined,
        sort: filters.sort || undefined,
      };

      const res = await axios.get("/api/user/cm/applications", {
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
      setLoading(false);
    }
  };

  //q param read
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) {
      setSearchInput(q);
      setFilters((prev) => ({ ...prev, search: q }));
    }
  }, [location.search]);
  useEffect(() => {
    if (!initialFetchRef.current) {
      initialFetchRef.current = true;
      const params = new URLSearchParams(location.search);
      const q = params.get("q");
      if (q) {
        return;
      }
    }
    fetchApplication(1);
  }, [filters.status, filters.sort, filters.limit, filters.search, token]);

  //debounce
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));

      if (location.search) {
        navigate(location.pathname, { replace: true });
      }
    }, 450);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchInput]);

  //handle action status click
  const handleActStaClick = (application) => {
    if (application.status === "applied") {
      handleActionStatus({ status: "reviewed" }, application);
      return;
    }
    if (application.status === "reviewed") {
      setShowActStaPopup(true);
      setSelectedApplication(application);
    }
  };
  //handle action status
  const handleActionStatus = async (payload, application) => {
    setLoading(true);
    try {
      const res = await axios.patch(
        `/api/job/${application?.Job.id}/application/${application?.id}/status`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      enqueueSnackbar(
        res.data.message || "Status lamaran berhasil diperbarui",
        {
          variant: "success",
        }
      );

      fetchApplication(meta.page || 1);
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || "Gagal mengupdate status lamaran",
        { variant: "warning" }
      );
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > (meta.totalPages || 1)) return;
    fetchApplication(newPage);
  };

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

  /*
    SKELETON LOADER
  */
  const ApplicationCardLoader = () => {
    return (
      <div className="border border-gray-300 shadow rounded p-4 animate-pulse">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 flex gap-4">
            {/* Avatar */}
            <div className="h-14 w-14 rounded-full bg-gray-200" />

            {/* User info */}
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-5 w-48 bg-gray-200 rounded" />
              <div className="h-3 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-64 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Date + Status */}
          <div className="flex flex-col items-end gap-2">
            <div className="h-4 w-36 bg-gray-200 rounded" />
            <div className="h-6 w-24 bg-gray-200 rounded-full" />
          </div>
        </div>

        {/* Toggle message placeholder */}
        <div className="h-4 w-40 bg-gray-200 rounded mt-2" />

        {/* Footer buttons */}
        <div className="flex justify-end mt-4 gap-2">
          <div className="h-9 w-28 bg-gray-200 rounded-lg" />
          <div className="h-9 w-44 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4">
        <h1 className="font-bold text-gray-900 text-2xl flex items-center gap-2">
          <i className={`fas fa-file-alt`} /> Lamaran
        </h1>

        <div className="bg-white rounded-2xl shadow-lg py-6 px-4">
          {/* application header */}
          <div className="flex items-center justify-between">
            <div className="flex gap-5">
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">{meta.total}</p>
                <span className="text-xs font-quicksand">Total Entries</span>
              </div>
              <div className="flex flex-col items-center">
                <i class="fa-solid fa-memory text-xl"></i>
                <span className="text-xs font-quicksand">
                  Page {meta.page} of {meta.totalPages}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <i class="fa-solid fa-hand-pointer text-xl"></i>
                <span className="text-xs text-wrap max-w-28 text-center font-quicksand">
                  Pilih untuk melihat detail
                </span>
              </div>
            </div>
          </div>

          {/* filters */}
          <div className="flex w-full gap-20 mt-5">
            <div className="flex gap-2 flex-1  bg-gray-50 items-center border border-gray-300 rounded px-4 py-2 shadow">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                className="outline-none flex-1 bg-transparent"
                type="search"
                placeholder="Pekerjaan, nama pelamar..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              {/* Filter Status */}
              <select
                className="border border-gray-300 bg-gray-50 rounded px-3 py-2 shadow text-sm"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">All Status</option>
                <option value="applied">Applied</option>
                <option value="reviewed">Reviewed</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>

              {/* Sorting */}
              <select
                className="border border-gray-300 bg-gray-50 rounded px-3 py-2 shadow text-sm"
                value={filters.sort}
                onChange={(e) =>
                  setFilters({ ...filters, sort: e.target.value })
                }
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="az">A → Z</option>
                <option value="za">Z → A</option>
              </select>
            </div>
          </div>

          {/* application grid */}
          <div className="grid grid-cols-1 gap-4 mt-5">
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <ApplicationCardLoader key={i} />
              ))}

            {!loading && applications.length === 0 && (
              <div className="text-center py-8 text-gray-600">
                Tidak ada apa-apa disini
              </div>
            )}

            {applications.map((application) => (
              <div
                key={application.id}
                className="border border-gray-300 shadow rounded p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 flex gap-4">
                    <img
                      src={application?.User?.profilePicture || defaultPfp}
                      alt="Profile Picture"
                      className="h-14 w-14 aspect-square object-cover rounded-full"
                    />
                    <div>
                      <h4 className="font-bold text-blue-600 text-xl">
                        {application?.User?.UserProfile?.fullName}
                      </h4>
                      <p className="text-gray-600 text-xs">
                        @{application?.User?.username}
                      </p>
                      <p className="text-gray-600 text-sm">
                        melamar ke{" "}
                        <Link
                          to={`/job/${application?.Job?.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {application?.Job?.title}{" "}
                        </Link>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-sm text-gray-600 mt-1">
                      Dilamar pada{" "}
                      {application?.appliedAt
                        ? new Intl.DateTimeFormat("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }).format(new Date(application.appliedAt))
                        : ""}
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm uppercase font-medium ${getStatusBadgeClass(
                        application.status
                      )}`}
                    >
                      {application.status}
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
                            <i className="fa-solid fa-message mr-1"></i> Pesan
                            Pelamar
                          </p>
                          <p className="text-sm leading-loose whitespace-pre-line mt-1">
                            {application.message}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-3">
                        <div
                          href={application.email}
                          className="text-xs text-blue-600 mt-1"
                        >
                          <i className="fa-solid fa-envelope mr-1"></i>
                          {application.email}
                        </div>
                        {application.portofolioLink && (
                          <div>
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
                            <i className="fa-solid fa-message mr-1"></i> Pesan
                            Perusahaan
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

                <div className="flex items-end justify-end mt-4 gap-2">
                  <Link to={`/js/${application?.User?.id}`}>
                    <button className="font-medium border border-blue-400 text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm transition">
                      Lihat Profil
                    </button>
                  </Link>
                  {(application?.status === "applied" ||
                    application?.status === "reviewed") && (
                    <button
                      onClick={() => handleActStaClick(application)}
                      className="font-medium text-gray-50 border border-blue-400 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition"
                    >
                      {application?.status === "applied" ? (
                        <>
                          <i class="fa-solid fa-check mr-2"></i> Tandai sebagai
                          Review
                        </>
                      ) : application?.status === "reviewed" ? (
                        <>
                          <i class="fa-solid fa-pen-to-square mr-2"></i> Action
                          Status Review
                        </>
                      ) : null}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-1 items-center text-sm text-gray-600">
              <span>Showing</span>
              <select
                className="font-inter outline-none border border-gray-300 bg-white text-sm rounded-md px-2 py-1 shadow-sm"
                value={filters.limit}
                onChange={(e) =>
                  setFilters({ ...filters, limit: Number(e.target.value) })
                }
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
                onClick={() => goToPage((meta.page || 1) - 1)}
                disabled={(meta.page || 1) <= 1 || loading}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => goToPage((meta.page || 1) + 1)}
                disabled={(meta.page || 1) >= (meta.totalPages || 1) || loading}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <ActionStatusAppPopup
        isVisible={showActStaPopup}
        onClose={() => setShowActStaPopup(false)}
        onUpdate={handleActionStatus}
        applicationDetail={selectedApplication}
      />
    </>
  );
};

export default EmployerApplicantPage;
