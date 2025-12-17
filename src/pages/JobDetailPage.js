// src/pages/JobDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";

import defaultCm from "../assets/default-company.png";
import defaultPfp from "../assets/default-pfp.png";
import { enqueueSnackbar } from "notistack";
import AddJobDisPopup from "../components/popups/AddJobDisPopup";
import AddJobSkiPopup from "../components/popups/AddJobSkiPopup";
import EditJobPopup from "../components/popups/EditJobPopup";
import { formatCurrency } from "../utils/formatCurrency";
import ActionStatusJobPopup from "../components/popups/ActionStatusJobPopup";
import RescheduleJobPopup from "../components/popups/RescheduleJobPopup";
import LoginSuggestionPopup from "../components/popups/LoginSuggestionPopup";
import ApplyJobPopup from "../components/popups/ApplyJobPopup";

dayjs.locale("id");
dayjs.extend(relativeTime);
const STATUS_COLOR = {
  applied: { colorClass: "bg-blue-100 text-blue-800", badgeColor: "blue" },
  reviewed: {
    colorClass: "bg-yellow-100 text-yellow-800",
    badgeColor: "yellow",
  },
  accepted: { colorClass: "bg-green-100 text-green-800", badgeColor: "green" },
  rejected: { colorClass: "bg-red-100 text-red-800", badgeColor: "red" },
};

const JobDetailPage = () => {
  const { userData, token } = useAuth();
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({});
  const [openMessages, setOpenMessages] = useState({});
  const [isApplying, setIsApplying] = useState(false);

  const [loading, setLoading] = useState(false);
  const [asideLoading, setAsideLoading] = useState(false);

  const [job, setJob] = useState({});
  const [jobSkills, setJobSkills] = useState([]);
  const [jobDisabilities, setJobDisabilties] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [otherJobPreview, setOtherJobPreview] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 30,
    total: 0,
    totalPages: 0,
  });

  const [showAddJobSkiPopup, setShowAddJobSkiPopup] = useState(false);
  const [showAddJobDisPopup, setShowAddJobDisPopup] = useState(false);
  const [showEditJobPopup, setShowEditJobPopup] = useState(false);
  const [showActStaPopup, setShowActStaPopup] = useState(false);
  const [showRescPopup, setShowRescPopup] = useState(false);
  const [showApplyJobPopup, setShowApplyJobPopup] = useState(false);
  const [showLoginSugPopup, setShowLoginSugPopup] = useState(false);

  const isOwner = job?.Company?.User?.id === userData?.id;

  const openApplicationForm = () => {
    if (!userData || !token) {
      setShowLoginSugPopup(true);
      return;
    }
    if (userData && job?.applied) {
      navigate(`/js/applications`);
    }
    setShowApplyJobPopup(true);
  };
  const handleApplyJob = async (form) => {
    setIsApplying(true);
    try {
      const res = await axios.post(`/api/job/${jobId}/apply`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      enqueueSnackbar(res.data.message || "Berhasil mengirim lamaran", {
        variant: "success",
      });
      getJobById();
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || "Gagal mengirim lamaran",
        { variant: "warning" }
      );
    } finally {
      setIsApplying(false);
    }
  };

  //get userById
  const getUserById = async () => {
    if (!userData) return;
    try {
      const res = await axios.get(`/api/user/${userData.id}`);
      setProfileData(res.data.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      navigate("/");
    }
  };
  //get job
  const getJobById = async () => {
    try {
      const res = await axios.get(`/api/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const jobData = res.data.data;

      setJob(jobData);

      const status = String(jobData.status || "").toLowerCase();
      const ownerId = jobData?.Company?.User?.id;
      const currentUserId = userData?.id;

      const isOwner = ownerId === currentUserId;

      if (!isOwner && status !== "open") {
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching job:", error);
    }
  };

  //fatir: get job skill
  const getJobSkills = async () => {
    try {
      const res = await axios.get(`/api/job/${jobId}/skills`);
      setJobSkills(res.data.data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };
  //fatir: get job disability
  const getJobDisabilities = async () => {
    try {
      const res = await axios.get(`/api/job/${jobId}/disabilities`);
      setJobDisabilties(res.data.data);
    } catch (error) {
      console.error("Error fetching disabilities:", error);
    }
  };
  //fatir: get job application
  const getJobApplication = async (page = 1) => {
    const params = {
      page,
      limit: 30,
    };
    try {
      const res = await axios.get(`/api/job/${jobId}/applications`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobApplications(res.data.data);
      setMeta({
        page: res.data.meta.page,
        limit: res.data.meta.limit,
        total: res.data.meta.totalItems,
        totalPages: res.data.meta.totalPages,
      });
    } catch (error) {
      console.error("Error fetching application:", error);
    }
  };
  const getOtherJobPreview = async () => {
    setAsideLoading(true);
    try {
      const res = await axios.get(
        `/api/data/other-job-preview?excludeCurrentJobId=${jobId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOtherJobPreview(res.data.data);
    } catch (error) {
      console.error("Error fetching app preview:", error);
    } finally {
      setAsideLoading(false);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        await Promise.all([getJobById(), getJobDisabilities(), getJobSkills()]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [jobId]);
  useEffect(() => {
    getUserById();
  }, [userData]);
  useEffect(() => {
    if (!isOwner || !token) return;
    getJobApplication();
  }, [isOwner]);
  useEffect(() => {
    getOtherJobPreview();
  }, [jobId]);

  //edit job
  const handleEditProfile = async (form) => {
    try {
      const payload = {};
      Object.keys(form).forEach((key) => {
        if (job?.[key] !== form[key]) {
          payload[key] = form[key] === "" ? null : form[key];
        }
      });

      if (form.locationType === "on-site") {
        payload.address = form.address || null;
      }

      if (Object.keys(payload).length === 0) {
        enqueueSnackbar("Tidak ada perubahan data", { variant: "info" });
        return;
      }

      const res = await axios.put(`/api/job/${jobId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      enqueueSnackbar(res.data.message || "Lowongan berhasil diperbarui", {
        variant: "success",
      });

      getJobById();
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || "Gagal mengupdate lowongan",
        { variant: "warning" }
      );
    }
  };
  //add new disability
  const handleAddDisability = async (form) => {
    const payload = {
      disabilityId: form.disabilityId,
      disabilityName: form.disabilityId ? null : form.disabilityName,
      type: form.type,
    };
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const res = await axios.post(`/api/job/${jobId}/disability`, payload, {
        headers,
      });

      enqueueSnackbar(res.data.message, { variant: "success" });

      getJobDisabilities();
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Gagal menambahkan disabilitas baru",
        { variant: "warning" }
      );
    }
  };
  //add new skill
  const handleAddSKill = async (form) => {
    const payload = {
      skillId: form.skillId,
      skillName: form.skillId ? null : form.skillName,
    };
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const res = await axios.post(`/api/job/${jobId}/skill`, payload, {
        headers,
      });

      enqueueSnackbar(res.data.message, { variant: "success" });

      getJobSkills();
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Gagal menambahkan keahlian baru",
        { variant: "warning" }
      );
    }
  };
  //handle delete disability
  const handleDeleteDisability = async (id) => {
    if (!id) return;

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const res = await axios.delete(`/api/job/${jobId}/disability/${id}`, {
        headers,
      });

      enqueueSnackbar(res.data.message, { variant: "success" });

      getJobDisabilities();
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Gagal menghapus disabilitas user",
        { variant: "error" }
      );
    }
  };
  //handle delete skill
  const handleDeleteSkill = async (id) => {
    if (!id) return;

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const res = await axios.delete(`/api/job/${jobId}/skill/${id}`, {
        headers,
      });

      enqueueSnackbar(res.data.message, { variant: "success" });

      getJobSkills();
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Gagal menghapus keahlian user",
        { variant: "error" }
      );
    }
  };

  //handle action status
  const handleActionStatus = async (payload) => {
    try {
      const res = await axios.patch(`/api/job/${jobId}/status`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      enqueueSnackbar(
        res.data.message || "Status lowongan berhasil diperbarui",
        {
          variant: "success",
        }
      );

      getJobById();
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || "Gagal mengupdate status lowongan",
        { variant: "warning" }
      );
    }
  };
  //handle reschedule
  const handleReschedule = async (payload) => {
    try {
      const res = await axios.patch(`/api/job/${jobId}/reschedule`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      enqueueSnackbar(res.data.message || "Tanggal berhasil diperbarui", {
        variant: "success",
      });

      getJobById();
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || "Gagal mengupdate tanggal lowongan",
        { variant: "warning" }
      );
    }
  };

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > (meta.totalPages || 1)) return;
    getJobApplication(newPage);
  };

  const getStatusPilColor = (statusPil) => {
    if (statusPil === "pending" && job?.status === "pending") {
      return "bg-green-500";
    }
    if (statusPil === "pending" && job?.status !== "pending") {
      return "bg-blue-500";
    }

    if (statusPil === "open" && job?.status === "open") {
      return "bg-green-500";
    }
    if (statusPil === "open" && job?.status !== "open") {
      if (job?.status === "pending") {
        return "bg-gray-500";
      } else {
        return "bg-blue-500";
      }
    }

    if (statusPil === "closed" && job?.status === "closed") {
      return "bg-green-500";
    }
    if (statusPil === "closed" && job?.status !== "closed") {
      if (job?.status !== "cancelled") {
        return "bg-gray-500";
      } else {
        return "bg-blue-500";
      }
    }

    if (statusPil === "cancelled" && job?.status === "cancelled") {
      return "bg-green-500";
    }
    if (statusPil === "cancelled" && job?.status !== "cancelled") {
      return "bg-gray-500";
    }
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
    SKELETON LOADING
  */
  const JobHeaderSkeleton = () => {
    return (
      <div className="bg-white rounded shadow-lg p-6 mb-4 animate-pulse">
        <div className="flex justify-between gap-6">
          {/* LEFT */}
          <div className="flex flex-col gap-4 flex-1">
            {/* Company */}
            <div className="flex items-center gap-4 p-2">
              <div className="h-10 w-10 bg-gray-200 rounded" />
              <div>
                <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
            </div>

            {/* Job title */}
            <div className="h-8 w-2/3 bg-gray-200 rounded" />

            {/* Posted date */}
            <div className="h-4 w-56 bg-gray-200 rounded" />

            {/* Address */}
            <div className="h-4 w-64 bg-gray-200 rounded" />

            {/* Tags */}
            <div className="flex gap-3 mt-2">
              <div className="h-7 w-28 bg-gray-200 rounded-full" />
              <div className="h-7 w-28 bg-gray-200 rounded-full" />
              <div className="h-7 w-36 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  };
  const JobDescriptionSkeleton = () => {
    return (
      <div className="bg-white rounded shadow-lg p-6 animate-pulse">
        <div>
          {/* Title */}
          <div className="h-6 w-64 bg-gray-200 rounded mb-6" />

          {/* Paragraph lines */}
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-11/12 bg-gray-200 rounded" />
            <div className="h-4 w-10/12 bg-gray-200 rounded" />
            <div className="h-4 w-9/12 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  };
  const JobSndSkeleton = () => {
    return (
      <div className="flex gap-4 mt-4 animate-pulse">
        {/* === Skills Skeleton === */}
        <div className="bg-white rounded shadow-lg p-6 flex-1">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="h-5 w-40 bg-gray-200 rounded" />
          </div>

          {/* List */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-start px-2 py-4 border-b border-gray-200"
              >
                <div className="flex flex-col gap-2 w-full pr-6">
                  <div className="h-4 w-40 bg-gray-200 rounded" />
                  <div className="h-3 w-3/4 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === Disabilities Skeleton === */}
        <div className="bg-white rounded shadow-lg p-6 flex-1">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="h-5 w-44 bg-gray-200 rounded" />
          </div>

          {/* List */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-start px-2 py-4 border-b border-gray-200"
              >
                <div className="flex flex-col gap-2 w-full pr-6">
                  <div className="h-4 w-48 bg-gray-200 rounded" />
                  <div className="h-3 w-3/4 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  const CompanyInfoSkeleton = () => {
    return (
      <div className="bg-white rounded shadow-lg p-6 animate-pulse">
        {/* Title */}
        <div className="h-5 w-44 bg-gray-200 rounded mb-6" />

        {/* Company Card */}
        <div className="flex gap-4 p-2">
          {/* Logo */}
          <div className="h-16 w-16 bg-gray-200 rounded" />

          {/* Info */}
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-4 w-48 bg-gray-200 rounded" />
            <div className="h-3 w-40 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  };
  const AsideSkeleton = () => {
    return (
      <div className="flex flex-col gap-3 p-3 border border-gray-200 rounded-md animate-pulse">
        {/* Header */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="h-8 w-8 bg-gray-200 rounded" />

          {/* Title & Company */}
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-3 w-28 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-20 bg-gray-200 rounded-full" />
          <div className="h-5 w-20 bg-gray-200 rounded-full" />
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-screen mx-auto lg:px-28 xl:px-32 py-8">
        {/* Main Content */}
        <main id="main-content" className="container col-span-3">
          {/* Job Header */}
          {loading ? (
            <JobHeaderSkeleton />
          ) : (
            <div className="bg-white rounded shadow-lg p-6 mb-4">
              <div className="flex justify-between">
                <div className="flex flex-col items-start gap-2">
                  <Link to={`/cm/${job?.Company?.User?.id}`}>
                    <div className="flex items-center gap-4 p-2 transition cursor-pointer hover:bg-gray-100">
                      <img
                        src={job?.Company?.User?.profilePicture || defaultCm}
                        alt="Profile Picture"
                        className="h-10 w-10 object-cover aspect-square"
                      />
                      <div>
                        <h3 className="font-semibold text-sm">
                          {job?.Company?.companyName}
                        </h3>
                        <p className="text-xs text-blue-600">
                          @{job?.Company?.User?.username}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-blue-600">
                      {job?.title}
                    </h1>
                    <p className="text-gray-600">
                      Diposting pada{" "}
                      {job?.startDate
                        ? new Intl.DateTimeFormat("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }).format(new Date(job.startDate))
                        : ""}
                    </p>
                    {job?.address && (
                      <span className="flex items-center gap-2 text-sm text-gray-600">
                        <i className="fas fa-map-marker-alt"></i>
                        {job?.address}
                      </span>
                    )}
                    <div className="flex gap-4 mt-2 text-sm capitalize font-semibold">
                      {job?.employmentType !== "blank" && (
                        <span className="px-4 py-1 rounded-full border border-blue-400 text-blue-600">
                          {job?.employmentType}
                        </span>
                      )}
                      {job?.locationType !== "blank" && (
                        <span className="px-4 py-1 rounded-full border border-blue-400 text-blue-600">
                          {job?.locationType}
                        </span>
                      )}
                      {job?.minSalary && (
                        <span className="px-4 py-1 rounded-full border border-blue-400 text-blue-600">
                          Rp{formatCurrency(job?.minSalary)}{" "}
                          {job?.maxSalary &&
                            `- Rp${formatCurrency(job?.maxSalary)}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {isOwner ? (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setShowActStaPopup(!showActStaPopup)}
                      className="px-5 py-2 rounded text-blue-600 border border-blue-400 hover:bg-gray-100 transition"
                    >
                      <i class="fa-solid fa-pen-to-square mr-2"></i> Action
                      Status
                    </button>
                    <button
                      onClick={() => setShowRescPopup(!showRescPopup)}
                      className="px-5 py-2 rounded text-blue-600 border border-blue-400 hover:bg-gray-100 transition"
                    >
                      <i class="fa-solid fa-calendar mr-2"></i> Reschedule
                    </button>
                    <button
                      onClick={() => setShowEditJobPopup(!showEditJobPopup)}
                      className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-gray-50 transition"
                    >
                      <i class="fa-solid fa-pen-to-square mr-2"></i> Edit
                      Lowongan
                    </button>
                  </div>
                ) : !isOwner && userData?.role !== "company" ? (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={openApplicationForm}
                      disabled={isApplying}
                      className={`w-full  text-white py-3 px-5 rounded-lg  transition font-medium disabled:bg-primary-300 flex items-center justify-center gap-2 mt-10 ${
                        job?.applied
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {job?.applied ? (
                        <>
                          <i className="fas fa-check"></i>
                          Anda sudah melamar
                        </>
                      ) : isApplying ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Mengirim Lamaran...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane"></i>
                          Lamar Sekarang
                        </>
                      )}
                    </button>
                    <div className="text-right">
                      <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg font-bold text-lg mb-2">
                        <i className="fas fa-bolt mr-1"></i>
                        {job.match}% Match
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
              {isOwner && (
                <div className="flex w-full gap-5 mt-10">
                  <div className="flex-1">
                    <div
                      className={`h-7 mb-2 rounded-full bg-blue-600 ${getStatusPilColor(
                        "pending"
                      )}`}
                    ></div>
                    <p className="text-gray-600 text-sm text-center">Pending</p>
                  </div>
                  <div className="flex-1">
                    <div
                      className={`h-7 mb-2 rounded-full bg-blue-600 ${getStatusPilColor(
                        "open"
                      )}`}
                    ></div>
                    <p className="text-gray-600 text-sm text-center">Open</p>
                  </div>
                  <div className="flex-1">
                    <div
                      className={`h-7 mb-2 rounded-full bg-blue-600 ${getStatusPilColor(
                        "closed"
                      )}`}
                    ></div>
                    <p className="text-gray-600 text-sm text-center">Closed</p>
                  </div>
                  <div className="flex-1">
                    <div
                      className={`h-7 mb-2 rounded-full bg-blue-600 ${getStatusPilColor(
                        "cancelled"
                      )}`}
                    ></div>
                    <p className="text-gray-600 text-sm text-center">
                      Cancelled
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description Tab */}
          {loading ? (
            <JobDescriptionSkeleton />
          ) : (
            <div className="bg-white rounded shadow-lg p-6">
              <div>
                <h3 className="text-xl font-bold mb-4">
                  Tentang Pekerjaan Ini
                </h3>
                <p className="leading-loose whitespace-pre-line">
                  {job?.description}
                </p>
              </div>
            </div>
          )}

          {/* Skill & Disabilty */}
          {loading ? (
            <JobSndSkeleton />
          ) : (
            <div className="flex gap-4 mt-4">
              <div className="bg-white rounded shadow-lg p-6 flex-1">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    Keahlian terkait
                  </h2>
                  {isOwner && (
                    <button
                      onClick={() => setShowAddJobSkiPopup(!showAddJobSkiPopup)}
                    >
                      <i class="fa-solid fa-plus"></i>
                    </button>
                  )}
                </div>

                {jobSkills && jobSkills.length > 0 ? (
                  jobSkills.map((s) => (
                    <div
                      className="flex justify-between items-start px-2 py-4 hover:bg-gray-100 transition border-b border-gray-300"
                      key={s.id}
                    >
                      <div className="flex flex-col gap-1">
                        <h3 className="capitalize">
                          {s.skillName || s.Skill.name}
                        </h3>
                        {s.description && (
                          <p className="text-gray-600 text-sm">
                            {s.description}
                          </p>
                        )}
                      </div>
                      {isOwner && (
                        <button onClick={() => handleDeleteSkill(s.id)}>
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">
                    Tidak ada data keahlian.
                  </p>
                )}
              </div>
              <div className="bg-white rounded shadow-lg p-6 flex-1">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    Disabilitas terkait
                  </h2>
                  {isOwner && (
                    <button
                      onClick={() => setShowAddJobDisPopup(!showAddJobDisPopup)}
                    >
                      <i class="fa-solid fa-plus"></i>
                    </button>
                  )}
                </div>

                {jobDisabilities && jobDisabilities.length > 0 ? (
                  jobDisabilities.map((d) => (
                    <div
                      className="flex justify-between items-start px-2 py-4 hover:bg-gray-100 transition border-b border-gray-300"
                      key={d.id}
                    >
                      <div className="flex flex-col gap-1">
                        <h3 className="capitalize">
                          {d.disabilityName || d.Disability.name} /{" "}
                          <span className="text-blue-600">
                            {d.type || d.Disability.type}
                          </span>
                        </h3>
                        {d.description && (
                          <p className="text-gray-600 text-sm">
                            {d.description}
                          </p>
                        )}
                      </div>
                      {isOwner && (
                        <button onClick={() => handleDeleteDisability(d.id)}>
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">
                    Tidak ada data disabilitas.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Applications */}
          {loading ? null : isOwner ? (
            <div className="bg-white rounded shadow-lg p-6 mt-4">
              <h3 className="text-xl font-bold mb-4">
                Lamaran Kandidat ({meta.total})
              </h3>
              <div className="flex flex-col gap-4">
                {jobApplications && jobApplications.length > 0 ? (
                  jobApplications.map((application) => (
                    <div
                      key={application.id}
                      className="border border-gray-300 shadow rounded p-4 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div
                          className="hover:bg-gray-100 flex gap-4 transition p-1 rounded cursor-pointer"
                          onClick={() =>
                            navigate(`/js/${application?.User?.id}`)
                          }
                        >
                          <img
                            src={
                              application?.User?.profilePicture || defaultPfp
                            }
                            alt="Profile Picture"
                            className="h-12 w-12 aspect-square object-cover rounded-full"
                          />
                          <div>
                            <h4 className="font-bold text-blue-600 text-lg">
                              {application?.User?.UserProfile?.fullName}
                            </h4>
                            <p className="text-gray-600 text-xs">
                              @{application?.User?.username}
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
                            className={`px-3 py-1 rounded-full text-xs uppercase font-medium ${getStatusBadgeClass(
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
                                  <i className="fa-solid fa-message mr-1"></i>{" "}
                                  Pesan Pelamar
                                </p>
                                <p className="text-xs leading-loose whitespace-pre-line mt-1">
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

                      <div className="flex items-end justify-end mt-4 gap-2">
                        <Link
                          to={`/employer/applications?q=${application?.User?.username}`}
                        >
                          <button className="font-medium border border-blue-400 text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm transition">
                            Detail
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">
                    Belum ada lamaran di lowongan ini.
                  </p>
                )}
              </div>
              {/* pagination */}
              <div className="flex items-center justify-end mt-6">
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
                    disabled={
                      (meta.page || 1) >= (meta.totalPages || 1) || loading
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </main>
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Company Info */}
          {loading ? (
            <CompanyInfoSkeleton />
          ) : (
            <div className="bg-white rounded shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4">Tentang Perusahaan</h3>
              <Link to={`/cm/${job?.Company?.User?.id}`}>
                <div className="flex gap-4 p-2 transition hover:bg-gray-100 cursor-pointer">
                  <img
                    src={job?.Company?.User?.profilePicture || defaultCm}
                    alt="Profile Picture"
                    className="h-16 w-16 object-cover aspect-square"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {job?.Company?.companyName}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {job?.Company?.industryName}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {job?.Company?.establishedYear}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Other Jobs */}
          {otherJobPreview.length > 0 && (
            <div className="bg-white rounded shadow-lg overflow-hidden mb-4 p-4">
              <h2>Pekerjaan lain</h2>
              <div className="flex flex-col gap-3 mt-4">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <AsideSkeleton key={i} />
                    ))
                  : otherJobPreview.map((ojp) => (
                      <Link to={`/job/${ojp.id}`}>
                        <div
                          key={ojp.id}
                          className="flex flex-col gap-3 p-3 border border-gray-200 rounded-md hover:bg-blue-50 transition"
                        >
                          <div className="flex items-center gap-4 transition">
                            <img
                              src={
                                ojp?.Company?.User?.profilePicture || defaultCm
                              }
                              alt="Profile Picture"
                              className="h-8 w-8 object-cover aspect-square"
                            />
                            <div>
                              <p className="font-semibold leading-tight text-lg text-blue-600">
                                {ojp?.title}
                              </p>
                              <p className="text-xs text-gray-800 mt-1">
                                {ojp?.Company?.companyName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 text-xs text-nowrap border border-blue-300 rounded-full capitalize text-blue-800 font-medium">
                              {ojp?.employmentType}
                            </span>
                            <span className="px-2 text-xs text-nowrap border border-blue-300 rounded-full capitalize text-blue-800 font-medium">
                              {ojp?.locationType}
                            </span>
                            <span className="px-2 text-xs text-nowrap border border-blue-300 rounded-full text-blue-800 font-medium">
                              {dayjs(job?.startDate).fromNow()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
              </div>
            </div>
          )}
        </aside>
      </div>
      <EditJobPopup
        isVisible={showEditJobPopup}
        onClose={() => setShowEditJobPopup(false)}
        jobDetail={job}
        onEdit={handleEditProfile}
      />
      <AddJobDisPopup
        isVisible={showAddJobDisPopup}
        onClose={() => setShowAddJobDisPopup(false)}
        onCreate={handleAddDisability}
      />
      <AddJobSkiPopup
        isVisible={showAddJobSkiPopup}
        onClose={() => setShowAddJobSkiPopup(false)}
        onCreate={handleAddSKill}
      />
      <ActionStatusJobPopup
        isVisible={showActStaPopup}
        onClose={() => setShowActStaPopup(false)}
        onUpdate={handleActionStatus}
        jobDetail={job}
      />
      <RescheduleJobPopup
        isVisible={showRescPopup}
        onClose={() => setShowRescPopup(false)}
        onUpdate={handleReschedule}
        jobDetail={job}
      />
      <ApplyJobPopup
        isVisible={showApplyJobPopup}
        onClose={() => setShowApplyJobPopup(false)}
        jobDetail={job}
        userData={profileData}
        onCreate={handleApplyJob}
      />
      <LoginSuggestionPopup
        isVisible={showLoginSugPopup}
        onClose={() => setShowLoginSugPopup(false)}
      />
    </>
  );
};

export default JobDetailPage;
