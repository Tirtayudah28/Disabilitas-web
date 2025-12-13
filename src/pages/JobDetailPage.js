// src/pages/JobDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import defaultCm from "../assets/default-company.png";
import { enqueueSnackbar } from "notistack";
import AddJobDisPopup from "../components/popups/AddJobDisPopup";
import AddJobSkiPopup from "../components/popups/AddJobSkiPopup";
import EditJobPopup from "../components/popups/EditJobPopup";
import { formatCurrency } from "../utils/formatCurrency";
import ActionStatusJobPopup from "../components/popups/ActionStatusJobPopup";
import RescheduleJobPopup from "../components/popups/RescheduleJobPopup";
import LoginSuggestionPopup from "../components/popups/LoginSuggestionPopup";
import ApplyJobPopup from "../components/popups/ApplyJobPopup";

const JobDetailPage = () => {
  const [loading, setLoading] = useState(false);
  const { userData, token } = useAuth();
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({});
  const [isApplying, setIsApplying] = useState(false);

  const [job, setJob] = useState({});
  const [jobSkills, setJobSkills] = useState([]);
  const [jobDisabilities, setJobDisabilties] = useState([]);

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
    if(userData && job?.applied){
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
      getJobById()
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

  //edit job
  const handleEditProfile = async (form) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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
    setLoading(true);
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
    } finally {
      setLoading(false);
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

    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  //handle delete disability
  const handleDeleteDisability = async (id) => {
    if (!id) return;

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };
  //handle delete skill
  const handleDeleteSkill = async (id) => {
    if (!id) return;

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  //handle action status
  const handleActionStatus = async (payload) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  //handle reschedule
  const handleReschedule = async (payload) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
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
  // Similar jobs data
  const similarJobs = [
    {
      id: 2,
      title: "Product Designer",
      company: "Startup Inklusif",
      location: "Remote • Full Time",
      salary: "Rp 9-13 juta",
      match: 88,
      logo: "SI",
      logoColor: "from-blue-500 to-green-500",
    },
    {
      id: 3,
      title: "UX Researcher",
      company: "Research Lab",
      location: "Bandung • Hybrid",
      salary: "Rp 7-10 juta",
      match: 82,
      logo: "RL",
      logoColor: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        <main
          id="main-content"
          className="container mx-auto lg:px-32 xl:px-36 py-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Job Header */}
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
                      <p className="text-gray-600 text-sm text-center">
                        Pending
                      </p>
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
                      <p className="text-gray-600 text-sm text-center">
                        Closed
                      </p>
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

              {/* Description Tab */}
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

              {/* Skill & Disabilty */}
              <div className="flex gap-4 mt-4">
                <div className="bg-white rounded shadow-lg p-6 flex-1">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900">
                      Keahlian terkait
                    </h2>
                    {isOwner && (
                      <button
                        onClick={() =>
                          setShowAddJobSkiPopup(!showAddJobSkiPopup)
                        }
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
                        onClick={() =>
                          setShowAddJobDisPopup(!showAddJobDisPopup)
                        }
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
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Company Info */}
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

              {/* Similar Jobs */}
              <div className="bg-white rounded shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4">Lowongan Serupa</h3>
                <div className="space-y-4">
                  {similarJobs.map((similarJob) => (
                    <div
                      key={similarJob.id}
                      className="border border-gray-200 rounded-lg p-3 hover:border-primary-500 transition"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div
                          className={`w-10 h-10 bg-gradient-to-br ${similarJob.logoColor} rounded flex items-center justify-center text-white font-bold text-sm`}
                        >
                          {similarJob.logo}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {similarJob.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {similarJob.company}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-primary-600 font-medium">
                          {similarJob.salary}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {similarJob.match}% match
                        </span>
                      </div>
                      <button className="w-full mt-2 text-primary-500 hover:text-primary-600 text-sm font-medium">
                        Lihat Detail →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
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
