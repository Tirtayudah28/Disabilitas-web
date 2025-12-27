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
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 animate-pulse">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* LEFT */}
          <div className="flex flex-col gap-4 flex-1">
            {/* Company */}
            <div className="flex items-center gap-4 p-2">
              <div className="h-12 w-12 bg-gray-200 rounded-full" />
              <div>
                <div className="h-5 w-48 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-32 bg-gray-200 rounded" />
              </div>
            </div>

            {/* Job title */}
            <div className="h-8 w-3/4 bg-gray-200 rounded" />

            {/* Posted date */}
            <div className="h-4 w-56 bg-gray-200 rounded" />

            {/* Address */}
            <div className="h-4 w-64 bg-gray-200 rounded" />

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mt-2">
              <div className="h-7 w-28 bg-gray-200 rounded-full" />
              <div className="h-7 w-28 bg-gray-200 rounded-full" />
              <div className="h-7 w-36 bg-gray-200 rounded-full" />
            </div>
          </div>
          
          {/* Right Side Skeleton */}
          <div className="w-full md:w-64 space-y-3">
            <div className="h-10 w-full bg-gray-200 rounded-lg" />
            <div className="h-10 w-full bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  };
  const JobDescriptionSkeleton = () => {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
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
      <div className="flex flex-col md:flex-row gap-4 mt-6 animate-pulse">
        {/* === Skills Skeleton === */}
        <div className="bg-white rounded-xl shadow-md p-6 flex-1">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 w-40 bg-gray-200 rounded" />
          </div>

          {/* List */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-start px-2 py-4 border-b border-gray-200"
              >
                <div className="flex flex-col gap-2 w-full pr-6">
                  <div className="h-5 w-40 bg-gray-200 rounded" />
                  <div className="h-3 w-3/4 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === Disabilities Skeleton === */}
        <div className="bg-white rounded-xl shadow-md p-6 flex-1">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 w-44 bg-gray-200 rounded" />
          </div>

          {/* List */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-start px-2 py-4 border-b border-gray-200"
              >
                <div className="flex flex-col gap-2 w-full pr-6">
                  <div className="h-5 w-48 bg-gray-200 rounded" />
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
      <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
        {/* Title */}
        <div className="h-6 w-44 bg-gray-200 rounded mb-6" />

        {/* Company Card */}
        <div className="flex gap-4 p-2">
          {/* Logo */}
          <div className="h-16 w-16 bg-gray-200 rounded-xl" />

          {/* Info */}
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-5 w-48 bg-gray-200 rounded" />
            <div className="h-3 w-40 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  };
  const AsideSkeleton = () => {
    return (
      <div className="flex flex-col gap-3 p-4 border border-gray-200 rounded-xl animate-pulse">
        {/* Header */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="h-10 w-10 bg-gray-200 rounded-lg" />

          {/* Title & Company */}
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-3 w-28 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-5 w-20 bg-gray-200 rounded-full" />
          <div className="h-5 w-20 bg-gray-200 rounded-full" />
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-screen mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        {/* Main Content */}
        <main id="main-content" className="lg:col-span-3 space-y-6">
          {/* Job Header */}
          {loading ? (
            <JobHeaderSkeleton />
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex flex-col items-start gap-4 flex-1">
                  <Link to={`/cm/${job?.Company?.User?.id}`} className="w-full">
                    <div className="flex items-center gap-4 p-3 transition cursor-pointer hover:bg-gray-50 rounded-lg">
                      <img
                        src={job?.Company?.User?.profilePicture || defaultCm}
                        alt="Profile Picture"
                        className="h-12 w-12 object-cover aspect-square rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold text-base text-gray-900">
                          {job?.Company?.companyName}
                        </h3>
                        <p className="text-sm text-blue-600 font-medium">
                          @{job?.Company?.User?.username}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {job?.title}
                    </h1>
                    <p className="text-gray-600 text-sm">
                      <i className="fas fa-clock mr-2"></i>
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
                        <i className="fas fa-map-marker-alt text-blue-600"></i>
                        {job?.address}
                      </span>
                    )}
                    <div className="flex flex-wrap gap-3 mt-3">
                      {job?.employmentType !== "blank" && (
                        <span className="px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 font-medium text-sm">
                          <i className="fas fa-briefcase mr-2"></i>
                          {job?.employmentType}
                        </span>
                      )}
                      {job?.locationType !== "blank" && (
                        <span className="px-4 py-2 rounded-lg border border-green-200 bg-green-50 text-green-700 font-medium text-sm">
                          <i className="fas fa-location-dot mr-2"></i>
                          {job?.locationType}
                        </span>
                      )}
                      {job?.minSalary && (
                        <span className="px-4 py-2 rounded-lg border border-purple-200 bg-purple-50 text-purple-700 font-medium text-sm">
                          <i className="fas fa-money-bill-wave mr-2"></i>
                          Rp{formatCurrency(job?.minSalary)}{" "}
                          {job?.maxSalary &&
                            `- Rp${formatCurrency(job?.maxSalary)}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {isOwner ? (
                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    <button
                      onClick={() => setShowActStaPopup(!showActStaPopup)}
                      className="px-5 py-3 rounded-lg text-blue-700 border-2 border-blue-300 hover:bg-blue-50 transition-all duration-200 font-medium flex items-center justify-center"
                    >
                      <i className="fa-solid fa-pen-to-square mr-2"></i>
                      Action Status
                    </button>
                    <button
                      onClick={() => setShowRescPopup(!showRescPopup)}
                      className="px-5 py-3 rounded-lg text-green-700 border-2 border-green-300 hover:bg-green-50 transition-all duration-200 font-medium flex items-center justify-center"
                    >
                      <i className="fa-solid fa-calendar mr-2"></i>
                      Reschedule
                    </button>
                    <button
                      onClick={() => setShowEditJobPopup(!showEditJobPopup)}
                      className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 font-medium flex items-center justify-center"
                    >
                      <i className="fa-solid fa-pen-to-square mr-2"></i>
                      Edit Lowongan
                    </button>
                  </div>
                ) : !isOwner && userData?.role !== "company" ? (
                  <div className="flex flex-col gap-4 w-full md:w-72">
                    <button
                      onClick={openApplicationForm}
                      disabled={isApplying}
                      className={`w-full text-white py-3 px-5 rounded-lg transition-all duration-200 font-medium disabled:bg-primary-300 flex items-center justify-center gap-2 ${
                        job?.applied
                          ? "bg-green-600 hover:bg-green-700 shadow-md"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {job?.applied ? (
                        <>
                          <i className="fas fa-check-circle"></i>
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
                     {/* {job?.match && (
                      <div className="text-center">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-lg font-bold text-lg shadow-md">
                          <i className="fas fa-bolt mr-2"></i>
                          {job.match}% Match
                        </div>
                        <p className="text-gray-600 text-sm mt-2">
                          Profil Anda cocok dengan lowongan ini
                        </p>
                      </div>
                    )} */}
                  </div>
                ) : null}
              </div>
              
              {/* Status Timeline - Only for Owner */}
              {isOwner && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-4">Status Lowongan</h4>
                  <div className="flex flex-col sm:flex-row w-full gap-4">
                    {["pending", "open", "closed", "cancelled"].map((status) => (
                      <div key={status} className="flex-1 text-center">
                        <div className="relative">
                          <div
                            className={`h-8 mb-2 rounded-lg ${getStatusPilColor(
                              status
                            )} transition-all duration-300`}
                          ></div>
                          {job?.status === status && (
                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full shadow-sm border border-gray-200">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm font-medium capitalize">
                          {status}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description Tab */}
          {loading ? (
            <JobDescriptionSkeleton />
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-1 bg-blue-600 rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Tentang Pekerjaan Ini
                  </h3>
                </div>
                <div className="prose max-w-none">
                  <p className="leading-relaxed text-gray-700 whitespace-pre-line">
                    {job?.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Skill & Disability */}
          {loading ? (
            <JobSndSkeleton />
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Skills Section */}
              <div className="bg-white rounded-xl shadow-md p-6 flex-1">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Keahlian terkait
                    </h2>
                  </div>
                  {isOwner && (
                    <button
                      onClick={() => setShowAddJobSkiPopup(!showAddJobSkiPopup)}
                      className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200 flex items-center justify-center"
                      title="Tambah Keahlian"
                    >
                      <i className="fa-solid fa-plus text-sm"></i>
                    </button>
                  )}
                </div>

                {jobSkills && jobSkills.length > 0 ? (
                  <div className="space-y-3">
                    {jobSkills.map((s) => (
                      <div
                        className="flex justify-between items-center p-4 hover:bg-gray-50 transition-all duration-200 rounded-lg border border-gray-100"
                        key={s.id}
                      >
                        <div className="flex flex-col gap-1">
                          <h3 className="font-medium text-gray-900 capitalize">
                            {s.skillName || s.Skill.name}
                          </h3>
                          {s.description && (
                            <p className="text-gray-600 text-sm">
                              {s.description}
                            </p>
                          )}
                        </div>
                        {isOwner && (
                          <button 
                            onClick={() => handleDeleteSkill(s.id)}
                            className="h-8 w-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 flex items-center justify-center"
                            title="Hapus Keahlian"
                          >
                            <i className="fa-solid fa-trash text-xs"></i>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <i className="fas fa-tools text-4xl text-gray-300 mb-3"></i>
                    <p className="text-gray-600">Tidak ada data keahlian.</p>
                  </div>
                )}
              </div>

              {/* Disabilities Section */}
              <div className="bg-white rounded-xl shadow-md p-6 flex-1">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1 bg-green-500 rounded-full"></div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Disabilitas terkait
                    </h2>
                  </div>
                  {isOwner && (
                    <button
                      onClick={() => setShowAddJobDisPopup(!showAddJobDisPopup)}
                      className="h-10 w-10 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-all duration-200 flex items-center justify-center"
                      title="Tambah Disabilitas"
                    >
                      <i className="fa-solid fa-plus text-sm"></i>
                    </button>
                  )}
                </div>

                {jobDisabilities && jobDisabilities.length > 0 ? (
                  <div className="space-y-3">
                    {jobDisabilities.map((d) => (
                      <div
                        className="flex justify-between items-center p-4 hover:bg-gray-50 transition-all duration-200 rounded-lg border border-gray-100"
                        key={d.id}
                      >
                        <div className="flex flex-col gap-1">
                          <h3 className="font-medium text-gray-900 capitalize">
                            {d.disabilityName || d.Disability.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              {d.type || d.Disability.type}
                            </span>
                            {d.description && (
                              <p className="text-gray-600 text-sm mt-1">
                                {d.description}
                              </p>
                            )}
                          </div>
                        </div>
                        {isOwner && (
                          <button 
                            onClick={() => handleDeleteDisability(d.id)}
                            className="h-8 w-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 flex items-center justify-center"
                            title="Hapus Disabilitas"
                          >
                            <i className="fa-solid fa-trash text-xs"></i>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <i className="fas fa-universal-access text-4xl text-gray-300 mb-3"></i>
                    <p className="text-gray-600">Tidak ada data disabilitas.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Applications - Only for Owner */}
          {loading ? null : isOwner ? (
            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-1 bg-purple-600 rounded-full"></div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Lamaran Kandidat
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Total: {meta.total} pelamar
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {jobApplications && jobApplications.length > 0 ? (
                  jobApplications.map((application) => (
                    <div
                      key={application.id}
                      className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 bg-white"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                        <div
                          className="flex gap-4 transition p-3 rounded-lg cursor-pointer hover:bg-gray-50 flex-1"
                          onClick={() =>
                            navigate(`/js/${application?.User?.id}`)
                          }
                        >
                          <img
                            src={
                              application?.User?.profilePicture || defaultPfp
                            }
                            alt="Profile Picture"
                            className="h-14 w-14 aspect-square object-cover rounded-xl border-2 border-gray-100"
                          />
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">
                              {application?.User?.UserProfile?.fullName}
                            </h4>
                            <p className="text-gray-600 text-sm">
                              @{application?.User?.username}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              <i className="fas fa-clock mr-1"></i>
                              Dilamar pada{" "}
                              {application?.appliedAt
                                ? new Intl.DateTimeFormat("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }).format(new Date(application.appliedAt))
                                : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-2">
                          <span
                            className={`px-4 py-2 rounded-full text-sm uppercase font-medium ${getStatusBadgeClass(
                              application.status
                            )}`}
                          >
                            {application.status}
                          </span>
                        </div>
                      </div>

                      {/* Message Section */}
                      {(application.message ||
                        application.portofolioLink ||
                        application.companyMessage ||
                        application.companyExternalLink) && (
                        <button
                          onClick={() => toggleMessage(application.id)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 mb-3"
                        >
                          <i className={`fas fa-chevron-${openMessages[application.id] ? 'up' : 'down'}`}></i>
                          {openMessages[application.id]
                            ? "Sembunyikan detail"
                            : "Lihat detail lamaran"}
                        </button>
                      )}

                      {openMessages[application.id] && (
                        <div className="space-y-3">
                          {/* Applicant's Message */}
                          {(application.message || application.portofolioLink) && (
                            <div className="rounded-xl p-4 bg-blue-50 border border-blue-100">
                              {application.message && (
                                <div className="mb-3">
                                  <p className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-2">
                                    <i className="fa-solid fa-comment"></i>
                                    Pesan Pelamar
                                  </p>
                                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-white p-3 rounded-lg">
                                    {application.message}
                                  </p>
                                </div>
                              )}
                              {application.portofolioLink && (
                                <div>
                                  <p className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-2">
                                    <i className="fa-solid fa-link"></i>
                                    Portfolio
                                  </p>
                                  <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={application.portofolioLink}
                                    className="text-sm text-blue-600 hover:text-blue-800 break-all bg-white p-3 rounded-lg block"
                                  >
                                    {application.portofolioLink}
                                  </a>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Company's Message */}
                          {(application.companyMessage || application.companyExternalLink) && (
                            <div
                              className={`rounded-xl p-4 ${
                                application.status === "accepted"
                                  ? "bg-green-50 border border-green-100"
                                  : application.status === "rejected"
                                  ? "bg-red-50 border border-red-100"
                                  : "bg-blue-50 border border-blue-100"
                              }`}
                            >
                              {application.companyMessage && (
                                <div className="mb-3">
                                  <p className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                                    <i className="fa-solid fa-building"></i>
                                    Pesan Perusahaan
                                  </p>
                                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-white p-3 rounded-lg">
                                    {application.companyMessage}
                                  </p>
                                </div>
                              )}
                              {application.companyExternalLink && (
                                <div>
                                  <p className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                                    <i className="fa-solid fa-external-link"></i>
                                    Link Eksternal
                                  </p>
                                  <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={application.companyExternalLink}
                                    className="text-sm text-blue-600 hover:text-blue-800 break-all bg-white p-3 rounded-lg block"
                                  >
                                    {application.companyExternalLink}
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex justify-end mt-4">
                        <Link
                          to={`/employer/applications?q=${application?.User?.username}`}
                        >
                          <button className="font-medium border-2 border-blue-400 text-blue-700 hover:bg-blue-50 px-5 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2">
                            <i className="fas fa-external-link-alt"></i>
                            Detail Lengkap
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <i className="fas fa-file-alt text-4xl text-gray-300 mb-3"></i>
                    <p className="text-gray-600 font-medium">Belum ada lamaran di lowongan ini.</p>
                    <p className="text-gray-500 text-sm mt-1">Lamaran akan muncul di sini</p>
                  </div>
                )}
              </div>
              
              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    Halaman {meta.page} dari {meta.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                      onClick={() => goToPage((meta.page || 1) - 1)}
                      disabled={(meta.page || 1) <= 1 || loading}
                    >
                      <i className="fas fa-chevron-left"></i>
                      Sebelumnya
                    </button>
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                      onClick={() => goToPage((meta.page || 1) + 1)}
                      disabled={
                        (meta.page || 1) >= (meta.totalPages || 1) || loading
                      }
                    >
                      Selanjutnya
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Company Info */}
          {loading ? (
            <CompanyInfoSkeleton />
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Tentang Perusahaan</h3>
              <Link to={`/cm/${job?.Company?.User?.id}`}>
                <div className="flex gap-4 p-3 transition hover:bg-gray-50 cursor-pointer rounded-xl border border-gray-100">
                  <img
                    src={job?.Company?.User?.profilePicture || defaultCm}
                    alt="Profile Picture"
                    className="h-16 w-16 object-cover aspect-square rounded-xl border border-gray-200"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {job?.Company?.companyName}
                    </h4>
                    <p className="text-gray-700 text-sm mt-1">
                      <i className="fas fa-industry mr-2"></i>
                      {job?.Company?.industryName}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      <i className="fas fa-calendar-alt mr-2"></i>
                      Berdiri sejak {job?.Company?.establishedYear}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Other Jobs */}
          {otherJobPreview.length > 0 && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-lg text-gray-900">Pekerjaan Lainnya</h3>
                <p className="text-gray-600 text-sm mt-1">Lowongan serupa dari perusahaan ini</p>
              </div>
              <div className="p-4">
                <div className="flex flex-col gap-4">
                  {asideLoading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <AsideSkeleton key={i} />
                      ))
                    : otherJobPreview.map((ojp) => (
                        <Link to={`/job/${ojp.id}`} key={ojp.id}>
                          <div className="flex flex-col gap-3 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white">
                            <div className="flex items-center gap-4">
                              <img
                                src={
                                  ojp?.Company?.User?.profilePicture || defaultCm
                                }
                                alt="Profile Picture"
                                className="h-10 w-10 object-cover aspect-square rounded-lg"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">
                                  {ojp?.title}
                                </p>
                                <p className="text-xs text-gray-600 truncate">
                                  {ojp?.Company?.companyName}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 text-xs border border-blue-200 bg-blue-50 text-blue-700 rounded-full capitalize">
                                {ojp?.employmentType}
                              </span>
                              <span className="px-3 py-1 text-xs border border-green-200 bg-green-50 text-green-700 rounded-full capitalize">
                                {ojp?.locationType}
                              </span>
                              <span className="px-3 py-1 text-xs border border-gray-200 bg-gray-50 text-gray-700 rounded-full">
                                {dayjs(ojp?.startDate).fromNow()}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Popups */}
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