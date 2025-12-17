import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import defaultPfp from "../../assets/default-pfp.png";

const STATUS_COLOR = {
  applied: { colorClass: "bg-blue-100 text-blue-800", badgeColor: "blue" },
  reviewed: {
    colorClass: "bg-yellow-100 text-yellow-800",
    badgeColor: "yellow",
  },
  accepted: { colorClass: "bg-green-100 text-green-800", badgeColor: "green" },
  rejected: { colorClass: "bg-red-100 text-red-800", badgeColor: "red" },
};

const EmployerOverviewPage = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [jobStats, setJobStats] = useState({
    jobCount: 0,
    thisMonthJobCount: 0,
    newestOpenJobs: [],
    mostPopularJob: null,
  });
  const [appStats, setAppStats] = useState({
    applicationCount: 0,
    thisMonthApplicationCount: 0,
    newestApplications: [],
  });

  // helper: format date
  const fmt = (iso) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  const getStatusBadgeClass = (status) => {
    return (
      (STATUS_COLOR[status] && STATUS_COLOR[status].colorClass) ||
      "bg-gray-100 text-gray-800"
    );
  };
  const getJobStatusBadgeClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "open":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // get company overview
  const getCompanyOverview = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/data/company-overview`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && res.data.success) {
        const j = res.data.data.job || {};
        const a = res.data.data.application || {};
        setJobStats({
          jobCount: j.jobCount || 0,
          thisMonthJobCount: j.thisMonthJobCount || 0,
          newestOpenJobs: j.newestOpenJobs || [],
          mostPopularJob: j.mostPopularJob || null,
        });
        setAppStats({
          applicationCount: a.applicationCount || 0,
          thisMonthApplicationCount: a.thisMonthApplicationCount || 0,
          newestApplications: a.newestApplications || [],
        });
      } else {
        console.error("unexpected response", res.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    getCompanyOverview();
  }, [token]);

  // UI skeleton components
  const StatsSkeleton = () => (
    <div className="space-y-2 animate-pulse">
      <div className="bg-white rounded-md shadow-md p-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );

  const ListItemSkeleton = ({ lines = 2 }) => (
    <div className="border animate-pulse border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="space-y-2 w-3/4">
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          {lines > 1 && (
            <div className="h-3 bg-gray-200 rounded w-1/3 mt-2"></div>
          )}
        </div>
        <div className="h-6 bg-gray-200 rounded w-12"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-1/4 mt-2"></div>
    </div>
  );

  // derive lists used in UI
  const recentApplications = appStats.newestApplications || [];
  const activeJobs = jobStats.newestOpenJobs || [];
  const mostPopularJob = jobStats.mostPopularJob || null;

  return (
    <>
      <div className="space-y-4">
        <h1 className="font-bold text-gray-900 text-2xl flex items-center gap-2">
          <i className={`fas fa-chart-bar`} /> Overview
        </h1>
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {loading ? (
            <>
              <StatsSkeleton />
              <StatsSkeleton />
              <StatsSkeleton />
            </>
          ) : (
            <>
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Total Lowongan</p>
                    <p className="text-2xl mt-0.5 font-bold text-gray-900">
                      {jobStats.jobCount ?? 0}
                    </p>
                    <p
                      className={`text-sm mt-2 ${
                        jobStats.thisMonthJobCount > 0
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {jobStats.thisMonthJobCount > 0
                        ? `+${jobStats.thisMonthJobCount}`
                        : jobStats.thisMonthJobCount ?? 0}{" "}
                      bulan ini
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-briefcase text-blue-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-md shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Total Lamaran</p>
                    <p className="text-2xl mt-0.5 font-bold text-gray-900">
                      {appStats.applicationCount ?? 0}
                    </p>
                    <p
                      className={`text-sm mt-2 ${
                        appStats.thisMonthApplicationCount > 0
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {appStats.thisMonthApplicationCount > 0
                        ? `+${appStats.thisMonthApplicationCount}`
                        : appStats.thisMonthApplicationCount ?? 0}{" "}
                      bulan ini
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-file-alt text-green-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-md shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">#1 Lowongan Populer</p>
                    {mostPopularJob ? (
                      <>
                        <p className="text-xl mt-0.5 font-semibold text-blue-600">
                          {mostPopularJob.title}
                        </p>
                        <p className="text-sm mt-2 text-gray-500">
                          {mostPopularJob.applicationCount} pelamar
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">Belum ada data</p>
                    )}
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <i class="fa-solid fa-fire text-red-600 text-xl"></i>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <div className="bg-white rounded-md shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Lamaran Terbaru
              </h3>
              <Link
                to="/employer/applications"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <i class="fa-solid fa-arrow-up-right-from-square mr-1"></i>{" "}
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                <>
                  <ListItemSkeleton />
                  <ListItemSkeleton />
                  <ListItemSkeleton />
                  <ListItemSkeleton />
                </>
              ) : recentApplications.length === 0 ? (
                <div className="text-sm text-gray-500">Belum ada lamaran</div>
              ) : (
                recentApplications.map((application) => (
                  <div
                    key={application.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-3">
                        <img
                          src={application.userProfilePicture || defaultPfp}
                          alt="Profile Picture"
                          className="h-14 w-14 aspect-square object-cover rounded-full"
                        />
                        <div>
                          <h4 className="font-medium text-blue-700">
                            @{application.username}
                          </h4>
                          <p className="text-sm text-gray-600">
                            melamar ke{" "}
                            <span className="text-blue-600">
                              {application.jobTitle || "—"}
                            </span>
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${getStatusBadgeClass(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        <i class="fa-regular fa-calendar mr-2"></i>
                        {fmt(application.appliedAt)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Jobs */}
          <div className="bg-white rounded-md shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Lowongan Aktif
              </h3>
              <Link
                to="/employer/jobs"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <i class="fa-solid fa-arrow-up-right-from-square mr-1"></i>
                Kelola
              </Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                <>
                  <ListItemSkeleton />
                  <ListItemSkeleton />
                  <ListItemSkeleton />
                  <ListItemSkeleton />
                </>
              ) : activeJobs.length === 0 ? (
                <div className="text-sm text-gray-500">
                  Belum ada lowongan aktif
                </div>
              ) : (
                activeJobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {job.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {job.address || "Lokasi tidak tersedia"}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${getJobStatusBadgeClass(
                          job.status
                        )}`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Opened in:{" "}
                        {new Date(job.startDate).toLocaleString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-primary-600 font-medium">
                        {mostPopularJob && mostPopularJob.id === job.id
                          ? `${mostPopularJob.applicationCount} pelamar`
                          : null}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployerOverviewPage;
