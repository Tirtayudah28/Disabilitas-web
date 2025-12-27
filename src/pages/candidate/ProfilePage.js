// src/pages/ProfilePage.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

import defaultPfp from "../../assets/default-pfp.png";
import defaultCm from "../../assets/default-company.png";
import { useAuth } from "../../contexts/AuthContext";
import EditProfilePopup from "../../components/popups/EditProfilePopup";
import AddUserDisPopup from "../../components/popups/AddUserDisPopup";
import AddUserEduPopup from "../../components/popups/AddUserEduPopup";
import AddUserExpPopup from "../../components/popups/AddUserExpPopup";
import AddUserSkiPopup from "../../components/popups/AddUserSkiPopup";

const STATUS_COLOR = {
  applied: { colorClass: "bg-blue-100 text-blue-800", badgeColor: "blue" },
  reviewed: {
    colorClass: "bg-yellow-100 text-yellow-800",
    badgeColor: "yellow",
  },
  accepted: { colorClass: "bg-green-100 text-green-800", badgeColor: "green" },
  rejected: { colorClass: "bg-red-100 text-red-800", badgeColor: "red" },
};

const ProfilePage = () => {
  const { token, userData } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [asideLoading, setAsideLoading] = useState(false);
  const [operationsLoading, setOperationsLoading] = useState(false);

  const [profileData, setProfileData] = useState({});
  const [educations, setEducations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [disabilities, setDisabilities] = useState([]);
  const [previewApp, setPreviewApp] = useState([]);
  const [company, setCompany] = useState({});
  const [otherJsPreview, setOtherJsPreview] = useState([]);
  const [countries, setCountries] = useState([]);
  const [activeTab, setActiveTab] = useState("data-diri");

  const [showEditProfPopup, setShowEditProfPopup] = useState(false);
  const [showAddDisPopup, setShowAddDisPopup] = useState(false);
  const [showAddEduPopup, setShowAddEduPopup] = useState(false);
  const [showAddExpPopup, setShowAddExpPopup] = useState(false);
  const [showAddSkiPopup, setShowAddSkiPopup] = useState(false);

  const tabs = [
    { id: "data-diri", label: "Tentang", icon: "user-circle" },
    { id: "disabilitas", label: "Jenis Disabilitas", icon: "universal-access" },
    { id: "keahlian", label: "Keahlian", icon: "tools" },
    { id: "pengalaman", label: "Pengalaman", icon: "briefcase" },
    { id: "pendidikan", label: "Pendidikan", icon: "graduation-cap" },
  ];

  useEffect(() => {
    if (loading) {
      document.body.style.cursor = "wait";
    } else {
      document.body.style.cursor = "default";
    }

    return () => {
      document.body.style.cursor = "default";
    };
  }, [loading]);

  //profile completion calculations
  const computeProfileCompletion = () => {
    const hasDisability =
      Array.isArray(disabilities) && disabilities.length > 0;
    const hasSkill = Array.isArray(skills) && skills.length > 0;
    const hasExperience = Array.isArray(experiences) && experiences.length > 0;
    const hasEducation = Array.isArray(educations) && educations.length > 0;

    const detailsCount = [
      hasDisability,
      hasSkill,
      hasExperience,
      hasEducation,
    ].filter(Boolean).length;

    const hasBio = Boolean(
      profileData?.profile?.bio && String(profileData.bio).trim() !== ""
    );
    const hasPic = Boolean(
      profileData?.profilePicture &&
        String(profileData.profilePicture).trim() !== ""
    );

    // default
    let percent = 0;

    if (hasBio && hasPic) {
      if (detailsCount === 4) percent = 100;
      else if (detailsCount === 3) percent = 75;
      else if (detailsCount === 2) percent = 50;
      else if (detailsCount === 1)
        percent = 50; // sesuai request (kurang 3 => 50%)
      else percent = 25;
    } else {
      // ada missing bio/pic
      if (detailsCount === 0 && !hasBio && !hasPic) percent = 10;
      else percent = 25;
    }

    return {
      percent,
      hasBio,
      hasPic,
      detailsCount,
      breakdown: {
        hasDisability,
        hasSkill,
        hasExperience,
        hasEducation,
      },
    };
  };
  const profileCompletion = computeProfileCompletion();

  //fatir: get countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name"
        );
        const list = res.data.map((c) => c.name.common).sort();
        setCountries(list);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setCountries([
          "Indonesia",
          "Malaysia",
          "Singapore",
          "Thailand",
          "Vietnam",
        ]);
      }
    };

    fetchCountries();
  }, []);

  //fatir: get user by id
  const getUserById = async () => {
    try {
      const res = await axios.get(`/api/user/${userId}`);
      if (res.data.data.role === "company") {
        navigate(`/cm/${userId}`);
      }
      setProfileData(res.data.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      navigate("/");
    }
  };
  //fatir: get user educations
  const getUserEducations = async () => {
    try {
      const res = await axios.get(`/api/user/js/${userId}/educations`);
      setEducations(res.data.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      navigate("/");
    }
  };
  //fatir: get user experience
  const getUserExperiences = async () => {
    try {
      const res = await axios.get(`/api/user/js/${userId}/experiences`);
      setExperiences(res.data.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      navigate("/");
    }
  };
  //fatir: get user skill
  const getUserSkills = async () => {
    try {
      const res = await axios.get(`/api/user/js/${userId}/skills`);
      setSkills(res.data.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      navigate("/");
    }
  };
  //fatir: get user disability
  const getUserDisability = async () => {
    try {
      const res = await axios.get(`/api/user/js/${userId}/disabilities`);
      setDisabilities(res.data.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      navigate("/");
    }
  };
  const getJsPreviewApp = async () => {
    try {
      const res = await axios.get(
        `/api/user/cm/${userId}/js-preview-applications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPreviewApp(res.data.data.applications);
      setCompany(res.data.data.company);
    } catch (error) {
      console.error("Error fetching app preview:", error);
    }
  };
  const getOtherJsPreview = async () => {
    try {
      const res = await axios.get(
        `/api/data/other-user-preview?excludeCurrentUserId=${userId}&role=job-seeker`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOtherJsPreview(res.data.data);
    } catch (error) {
      console.error("Error fetching app preview:", error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        await Promise.all([
          getUserById(),
          getUserDisability(),
          getUserSkills(),
          getUserExperiences(),
          getUserEducations(),
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [userId]);
  //aside effect
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setAsideLoading(true);
        await getOtherJsPreview();

        if (token && userData?.role === "company") {
          await getJsPreviewApp();
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setAsideLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [token, userId, userData?.role]);

  /*
    fatir: EDITING/UPDATING OPERATIONS
  */
  //handle edit profile
  const handleEditProfile = async (form) => {
    setLoading(true);
    try {
      const payload = {};
      Object.keys(form).forEach((key) => {
        if (profileData?.profile?.[key] !== form[key]) {
          payload[key] = form[key] === "" ? null : form[key];
        }
      });
      if (Object.keys(payload).length === 0) {
        enqueueSnackbar("Tidak ada perubahan data", { variant: "info" });
        return;
      }

      const res = await axios.put("/api/user/js/profile", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      enqueueSnackbar(res.data.message || "Profil berhasil diperbarui", {
        variant: "success",
      });

      getUserById();
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || "Gagal mengupdate profil",
        { variant: "warning" }
      );
    } finally {
      setLoading(false);
    }
  };
  //handle edit profile picture
  const handleEditPfp = async (e, mode = "upload") => {
    setLoading(true);
    try {
      let payload;
      let headers = {
        Authorization: `Bearer ${token}`,
      };

      if (mode === "upload") {
        const file = e.target?.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profilePicture", file);

        payload = formData;
        headers["Content-Type"] = "multipart/form-data";
      }

      if (mode === "delete") {
        payload = {};
      }

      const res = await axios.patch(
        "/api/user/update-profile-picture",
        payload,
        { headers }
      );

      enqueueSnackbar(res.data.message, { variant: "success" });

      getUserById();
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          (mode === "delete"
            ? "Gagal menghapus foto profil."
            : "Gagal memperbarui foto profil."),
        { variant: "warning" }
      );
    } finally {
      setLoading(false);
    }
  };

  /*
    fatir: ADDING OPERATIONS
  */
  //add new disability
  const handleAddDisability = async (form) => {
    const payload = {
      disabilityId: form.disabilityId,
      disabilityName: form.disabilityId ? null : form.disabilityName,
      type: form.type,
      description: form.description,
    };
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    setOperationsLoading(true);
    try {
      const res = await axios.post("/api/user/js/disability", payload, {
        headers,
      });

      enqueueSnackbar(res.data.message, { variant: "success" });

      getUserDisability();
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Gagal menambahkan disabilitas baru",
        { variant: "warning" }
      );
    } finally {
      setOperationsLoading(false);
    }
  };
  //add new skill
  const handleAddSKill = async (form) => {
    const payload = {
      skillId: form.skillId,
      skillName: form.skillId ? null : form.skillName,
      description: form.description,
    };
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    setOperationsLoading(true);
    try {
      const res = await axios.post("/api/user/js/skill", payload, {
        headers,
      });

      enqueueSnackbar(res.data.message, { variant: "success" });

      getUserSkills();
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Gagal menambahkan keahlian baru",
        { variant: "warning" }
      );
    } finally {
      setOperationsLoading(false);
    }
  };
  //add new education
  const handleAddEducation = async (form) => {
    const payload = {
      institutionId: form.institutionId,
      institutionName: form.institutionId ? null : form.institutionName,
      fieldOfStudy: form.fieldOfStudy,
      degree: form.degree,
      score: form.score,
      startDate: form.startDate,
      endDate: form.endDate,
      description: form.description,
    };
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    setOperationsLoading(true);
    try {
      const res = await axios.post("/api/user/js/education", payload, {
        headers,
      });

      enqueueSnackbar(res.data.message, { variant: "success" });
      getUserEducations();
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Gagal menambahkan pendidikan baru",
        { variant: "warning" }
      );
    } finally {
      setOperationsLoading(false);
    }
  };
  //add new disability
  const handleAddExperience = async (form) => {
    const payload = {
      companyId: form.companyId,
      companyName: form.companyId ? null : form.companyName,
      experienceType: form.experienceType,
      position: form.position,
      startDate: form.startDate,
      endDate: form.endDate,
      description: form.description,
    };
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    setOperationsLoading(true);
    try {
      const res = await axios.post("/api/user/js/experience", payload, {
        headers,
      });

      enqueueSnackbar(res.data.message, { variant: "success" });
      getUserExperiences();
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Gagal menambahkan pengalaman baru",
        { variant: "warning" }
      );
    } finally {
      setOperationsLoading(false);
    }
  };

  /*
    fatir: DELETING OPERATIONS
  */
  //handle delete disability
  const handleDeleteDisability = async (id) => {
    if (!id) return;

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    setOperationsLoading(true);
    try {
      const res = await axios.delete(`/api/user/js/disability/${id}`, {
        headers,
      });

      enqueueSnackbar(res.data.message, { variant: "success" });

      getUserDisability();
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Gagal menghapus disabilitas user",
        { variant: "error" }
      );
    } finally {
      setOperationsLoading(false);
    }
  };
  //handle delete skill
  const handleDeleteSkill = async (id) => {
    if (!id) return;

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    setOperationsLoading(true);
    try {
      const res = await axios.delete(`/api/user/js/skill/${id}`, {
        headers,
      });

      enqueueSnackbar(res.data.message, { variant: "success" });

      getUserSkills();
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Gagal menghapus keahlian user",
        { variant: "error" }
      );
    } finally {
      setOperationsLoading(false);
    }
  };
  //handle delete education
  const handleDeleteEducation = async (id) => {
    if (!id) return;

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    setOperationsLoading(true);
    try {
      const res = await axios.delete(`/api/user/js/education/${id}`, {
        headers,
      });

      enqueueSnackbar(res.data.message, { variant: "success" });

      getUserEducations();
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Gagal menghapus pendidikan user",
        { variant: "error" }
      );
    } finally {
      setOperationsLoading(false);
    }
  };
  //handle delete experience
  const handleDeleteExperience = async (id) => {
    if (!id) return;

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    setOperationsLoading(true);
    try {
      const res = await axios.delete(`/api/user/js/experience/${id}`, {
        headers,
      });

      enqueueSnackbar(res.data.message, { variant: "success" });

      getUserExperiences();
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Gagal menghapus pengalaman user",
        { variant: "error" }
      );
    } finally {
      setOperationsLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    return (
      (STATUS_COLOR[status] && STATUS_COLOR[status].colorClass) ||
      "bg-gray-100 text-gray-800"
    );
  };

  /*
    SKELETON LOADER
  */
  const ProfileHeaderSkeleton = () => {
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 animate-pulse">
        {/* Cover */}
        <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-36" />

        <div className="px-8 pb-8">
          <div className="flex flex-col items-start -mt-20">
            {/* Avatar */}
            <div className="h-40 w-40 rounded-full bg-gray-200 border-8 border-white shadow-lg" />

            {/* Name & Meta */}
            <div className="mt-8 w-full">
              <div className="space-y-4">
                <div className="h-10 w-3/5 bg-gray-200 rounded-lg" />
                <div className="h-6 w-2/5 bg-gray-200 rounded-lg" />

                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <div className="h-5 w-48 bg-gray-200 rounded" />
                  <div className="h-5 w-40 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const OtherJsPreviewSkeleton = ({ count = 4 }) => {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 animate-pulse">
        {/* Title */}
        <div className="h-7 w-48 bg-gray-200 rounded-lg mb-6" />

        <div className="space-y-4">
          {Array.from({ length: count }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl"
            >
              {/* Avatar */}
              <div className="h-16 w-16 rounded-full bg-gray-200" />

              {/* Name */}
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-5 w-40 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const ProfileTabSkeleton = ({ rows = 2 }) => {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 animate-pulse">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded-lg" />
        </div>

        {/* Content */}
        <div className="space-y-6">
          {Array.from({ length: rows }).map((_, idx) => (
            <div
              key={idx}
              className="flex justify-between items-start border-b border-gray-200 pb-6"
            >
              <div className="flex gap-5 w-full">
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-2/3 bg-gray-200 rounded" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-screen mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        {/* Main Content */}
        <main className="lg:col-span-3 space-y-6">
          {/* Profile Header */}
          {loading ? (
            <ProfileHeaderSkeleton />
          ) : (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
              {/* Action Buttons */}
              {userData?.id === profileData?.id && (
                <div className="absolute top-4 right-4 flex flex-col sm:flex-row gap-3 z-10">
                  <Link to="/js/applications">
                    <button className="px-5 py-2.5 rounded-xl bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-lg transition-all duration-200 border border-gray-200 font-medium flex items-center gap-2">
                      <i className="fas fa-history"></i>
                      Riwayat Lamaran
                    </button>
                  </Link>
                  <button
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transition-all duration-200 font-medium flex items-center gap-2"
                    onClick={() => setShowEditProfPopup(!showEditProfPopup)}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                    Edit Profile
                  </button>
                </div>
              )}
              
              {/* Cover Photo */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 h-36 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
              
              <div className="px-6 sm:px-8 pb-8 relative">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-20">
                  {/* Profile Picture */}
                  <div className="relative">
                    <div className="h-40 w-40 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-1 shadow-2xl">
                      <div className="h-full w-full rounded-full bg-white p-1">
                        <img
                          src={profileData?.profilePicture || defaultPfp}
                          alt="profile picture"
                          className="h-full w-full rounded-full object-cover border-4 border-white"
                        />
                      </div>
                    </div>
                    
                    {userData?.id === profileData?.id && (
                      <>
                        <label
                          htmlFor="profilePictureInput"
                          className="absolute right-2 bottom-2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer border border-gray-100"
                          title="Ubah Foto Profil"
                        >
                          <i className="fas fa-camera text-gray-700 text-lg"></i>
                        </label>

                        <input
                          id="profilePictureInput"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleEditPfp(e, "upload")}
                        />
                        
                        {profileData?.profilePicture && (
                          <button
                            title="Hapus Foto Profil"
                            onClick={(e) => handleEditPfp(null, "delete")}
                            className="absolute -bottom-2 left-2 bg-white p-2.5 rounded-full shadow-lg hover:shadow-xl hover:bg-red-50 transition-all duration-200 cursor-pointer border border-gray-100"
                          >
                            <i className="fa-solid fa-trash text-red-600 text-sm"></i>
                          </button>
                        )}
                      </>
                    )}
                  </div>

                 {/* Profile Info */}
<div className="flex-1 mt-4 sm:mt-0">
  <div className="space-y-4">
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {profileData?.profile?.fullName}
        </h1>
        
        {/* Gender Icons Only */}
        {profileData?.profile?.gender !== "blank" && (
          <div className="flex items-center">
            {profileData?.profile?.gender === "male" && (
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-300" 
                   title="Pria">
                <i className="fas fa-mars text-blue-600 text-sm"></i>
              </div>
            )}
            {profileData?.profile?.gender === "female" && (
              <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center border-2 border-pink-300"
                   title="Wanita">
                <i className="fas fa-venus text-pink-600 text-sm"></i>
              </div>
            )}
            {profileData?.profile?.gender !== "male" && 
             profileData?.profile?.gender !== "female" && (
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center border-2 border-purple-300"
                   title={profileData?.profile?.gender}>
                <i className="fas fa-transgender text-purple-600 text-sm"></i>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2 mt-1">
        <span className="text-lg text-blue-800 font-bold">
          @{profileData?.username}
        </span>
        <span className="text-gray-400">•</span>
        <span className="text-gray-600">
          Job Seeker
        </span>
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-4 text-gray-600">
      <div className="flex items-center gap-2">
        <i className="fas fa-map-marker-alt text-gray-400"></i>
        <span className="capitalize">
          {profileData?.profile?.city}, {profileData?.profile?.country}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <i className="fas fa-calendar-alt text-gray-400"></i>
        <span>
          Bergabung{" "}
          {profileData?.createdAt
            ? new Intl.DateTimeFormat("id-ID", {
                month: "long",
                year: "numeric",
              }).format(new Date(profileData.createdAt))
            : "-"}
        </span>
      </div>
    </div>

    {/* Bio */}
    {profileData?.profile?.bio && (
      <div className="mt-4">
        <p className="text-gray-700 leading-relaxed">
          {profileData?.profile?.bio}
        </p>
      </div>
    )}
  </div>
</div>
                </div>

                {/* Profile Completion (Only for owner) */}
                {userData?.id === profileData?.id && (
                  <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">Kelengkapan Profil</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Lengkapi profil untuk meningkatkan peluang diterima kerja
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-blue-700">
                          {profileCompletion.percent}%
                        </span>
                        <p className="text-gray-600 text-sm">
                          {profileCompletion.percent === 100 ? 'Sempurna!' : 'Perlu dilengkapi'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          profileCompletion.percent >= 75
                            ? "bg-gradient-to-r from-green-500 to-emerald-600"
                            : profileCompletion.percent >= 50
                            ? "bg-gradient-to-r from-yellow-400 to-amber-500"
                            : "bg-gradient-to-r from-red-400 to-red-500"
                        }`}
                        style={{ width: `${profileCompletion.percent}%` }}
                      />
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: "Foto Profil", completed: profileCompletion.hasPic, icon: "fa-camera" },
                        { label: "Bio", completed: profileCompletion.hasBio, icon: "fa-file-alt" },
                        { label: "Keahlian", completed: profileCompletion.breakdown.hasSkill, icon: "fa-tools" },
                        { label: "Pengalaman", completed: profileCompletion.breakdown.hasExperience, icon: "fa-briefcase" },
                        { label: "Pendidikan", completed: profileCompletion.breakdown.hasEducation, icon: "fa-graduation-cap" },
                        { label: "Disabilitas", completed: profileCompletion.breakdown.hasDisability, icon: "fa-universal-access" },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${item.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            <i className={`fas ${item.icon} text-sm`}></i>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.label}</p>
                            <p className="text-xs text-gray-500">{item.completed ? 'Lengkap' : 'Belum'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-32">
                <h3 className="font-bold text-gray-900 mb-4">Profil Saya</h3>
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl flex items-center gap-3 transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-l-4 border-blue-500 font-medium shadow-sm"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                        activeTab === tab.id 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <i className={`fas fa-${tab.icon} text-sm`}></i>
                      </div>
                      <span className="font-medium">{tab.label}</span>
                      {activeTab === tab.id && (
                        <i className="fas fa-chevron-right text-blue-500 ml-auto"></i>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            {loading ? (
              <ProfileTabSkeleton />
            ) : (
              <div className="lg:col-span-3 space-y-6">
                {/* === Tentang TAB === */}
                {activeTab === "data-diri" && (
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-2 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Tentang
                        </h2>
                      </div>
                      {userData?.id === profileData?.id && (
                        <button
                          onClick={() => setShowEditProfPopup(!showEditProfPopup)}
                          className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200 flex items-center justify-center"
                          title="Edit Profil"
                        >
                          <i className="fa-solid fa-pen-to-square text-sm"></i>
                        </button>
                      )}
                    </div>

                    {/* Bio */}
                    {profileData?.profile?.bio && (
                      <div className="mb-10">
                        <div className="prose max-w-none">
                          <p className="text-gray-700 leading-relaxed">
                            {profileData?.profile?.bio}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Personal Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <i className="fas fa-user text-blue-600"></i>
                          </div>
                          <h3 className="font-semibold text-gray-900">Nama Lengkap</h3>
                        </div>
                        <p className="text-gray-700 font-medium">
                          {profileData?.profile?.fullName}
                        </p>
                        <p className="text-blue-600 text-sm mt-1">
                          @{profileData?.username}
                        </p>
                      </div>

                      {/* Location */}
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <i className="fas fa-map-marker-alt text-green-600"></i>
                          </div>
                          <h3 className="font-semibold text-gray-900">Lokasi</h3>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-700 capitalize">
                            {`${profileData?.profile?.city}, ${profileData?.profile?.country}`}
                          </p>
                          {profileData?.profile?.address && (
                            <p className="text-gray-600 text-sm">
                              {profileData?.profile?.address}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Phone Number */}
                      {profileData?.profile?.phoneNumber && (
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                              <i className="fas fa-phone text-purple-600"></i>
                            </div>
                            <h3 className="font-semibold text-gray-900">Telepon</h3>
                          </div>
                          <p className="text-gray-700 font-medium">
                            {profileData.profile.phoneNumber}
                          </p>
                        </div>
                      )}

                      {/* Date of Birth */}
                      {profileData?.profile?.dateOfBirth && (
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                              <i className="fas fa-calendar text-amber-600"></i>
                            </div>
                            <h3 className="font-semibold text-gray-900">Tanggal Lahir</h3>
                          </div>
                          <p className="text-gray-700">
                            {new Intl.DateTimeFormat("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }).format(new Date(profileData.profile.dateOfBirth))}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* === JENIS DISABILITAS TAB === */}
                {activeTab === "disabilitas" && (
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-2 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Jenis Disabilitas
                        </h2>
                      </div>
                      {userData?.id === profileData?.id && (
                        <button
                          onClick={() => setShowAddDisPopup(!showAddDisPopup)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium flex items-center gap-2"
                        >
                          <i className="fa-solid fa-plus"></i>
                          Tambah
                        </button>
                      )}
                    </div>

                    {disabilities && disabilities.length > 0 ? (
                      <div className="space-y-4">
                        {disabilities.map((d) => (
                          <div
                            className="flex justify-between items-start p-5 hover:bg-gray-50 transition-all duration-200 rounded-xl border border-gray-100"
                            key={d.id}
                          >
                            <div className="flex gap-4">
                              <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                <i className="fas fa-universal-access text-purple-600"></i>
                              </div>
                              <div className="flex flex-col gap-2">
                                <h3 className="font-semibold text-gray-900 capitalize">
                                  {d.disabilityName || d.Disability.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                    {d.type || d.Disability.type}
                                  </span>
                                </div>
                                {d.description && (
                                  <p className="text-gray-600 text-sm mt-2">
                                    {d.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            {userData?.id === profileData?.id && (
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
                      <div className="text-center py-12">
                        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                          <i className="fas fa-universal-access text-3xl text-gray-400"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          Belum ada data disabilitas
                        </h3>
                        <p className="text-gray-500">
                          Tambahkan jenis disabilitas untuk melengkapi profil Anda
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* === KEAHLIAN TAB === */}
                {activeTab === "keahlian" && (
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-2 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Keahlian
                        </h2>
                      </div>
                      {userData?.id === profileData?.id && (
                        <button
                          onClick={() => setShowAddSkiPopup(!showAddSkiPopup)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium flex items-center gap-2"
                        >
                          <i className="fa-solid fa-plus"></i>
                          Tambah
                        </button>
                      )}
                    </div>

                    {skills && skills.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {skills.map((s) => (
                          <div
                            className="flex justify-between items-start p-5 hover:bg-gray-50 transition-all duration-200 rounded-xl border border-gray-100"
                            key={s.id}
                          >
                            <div className="flex flex-col gap-2 flex-1">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                  <i className="fas fa-tools text-green-600"></i>
                                </div>
                                <h3 className="font-semibold text-gray-900 capitalize">
                                  {s.skillName || s.Skill.name}
                                </h3>
                              </div>
                              {s.description && (
                                <p className="text-gray-600 text-sm mt-2">
                                  {s.description}
                                </p>
                              )}
                            </div>
                            {userData?.id === profileData?.id && (
                              <button
                                onClick={() => handleDeleteSkill(s.id)}
                                className="h-8 w-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 flex items-center justify-center ml-4"
                                title="Hapus Keahlian"
                              >
                                <i className="fa-solid fa-trash text-xs"></i>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                          <i className="fas fa-tools text-3xl text-gray-400"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          Belum ada keahlian
                        </h3>
                        <p className="text-gray-500">
                          Tambahkan keahlian yang Anda miliki
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* === PENGALAMAN TAB === */}
                {activeTab === "pengalaman" && (
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-2 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Pengalaman
                        </h2>
                      </div>
                      {userData?.id === profileData?.id && (
                        <button
                          onClick={() => setShowAddExpPopup(!showAddExpPopup)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 transition-all duration-200 font-medium flex items-center gap-2"
                        >
                          <i className="fa-solid fa-plus"></i>
                          Tambah
                        </button>
                      )}
                    </div>

                    {experiences && experiences.length > 0 ? (
                      <div className="space-y-6">
                        {experiences.map((e) => (
                          <div
                            className="flex justify-between items-start p-5 hover:bg-gray-50 transition-all duration-200 rounded-xl border border-gray-100"
                            key={e.id}
                          >
                            <div className="flex gap-4 flex-1">
                              <div className="h-16 w-16 rounded-xl overflow-hidden bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center">
                                {e.Company?.User?.profilePicture ? (
                                  <img
                                    src={e.Company.User.profilePicture}
                                    alt="company logo"
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <i className="fas fa-building text-amber-600 text-2xl"></i>
                                )}
                              </div>
                              <div className="flex flex-col gap-2 flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-bold text-gray-900 text-lg capitalize">
                                      {e.position}
                                    </h3>
                                    <p className="text-gray-700 font-medium">
                                      {e.Company?.companyName || e.companyName}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full capitalize">
                                        {e.experienceType}
                                      </span>
                                      <span className="text-gray-500 text-sm">
                                        {e.startDate} - {e.endDate ? e.endDate : "Sekarang"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {e.description && (
                                  <p className="text-gray-600 mt-2">
                                    {e.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            {userData?.id === profileData?.id && (
                              <button
                                onClick={() => handleDeleteExperience(e.id)}
                                className="h-8 w-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 flex items-center justify-center ml-4"
                                title="Hapus Pengalaman"
                              >
                                <i className="fas fa-trash text-xs"></i>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                          <i className="fas fa-briefcase text-3xl text-gray-400"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          Belum ada pengalaman
                        </h3>
                        <p className="text-gray-500">
                          Tambahkan pengalaman kerja Anda
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* === PENDIDIKAN TAB === */}
                {activeTab === "pendidikan" && (
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-2 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Pendidikan
                        </h2>
                      </div>
                      {userData?.id === profileData?.id && (
                        <button
                          onClick={() => setShowAddEduPopup(!showAddEduPopup)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 transition-all duration-200 font-medium flex items-center gap-2"
                        >
                          <i className="fa-solid fa-plus"></i>
                          Tambah
                        </button>
                      )}
                    </div>

                    {educations && educations.length > 0 ? (
                      <div className="space-y-6">
                        {educations.map((e) => (
                          <div
                            className="flex justify-between items-start p-5 hover:bg-gray-50 transition-all duration-200 rounded-xl border border-gray-100"
                            key={e.id}
                          >
                            <div className="flex gap-4 flex-1">
                              <div className="h-16 w-16 rounded-xl overflow-hidden bg-gradient-to-r from-indigo-100 to-violet-100 flex items-center justify-center">
                                {e.Company?.User?.profilePicture ? (
                                  <img
                                    src={e.Company.User.profilePicture}
                                    alt="institution logo"
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <i className="fas fa-graduation-cap text-indigo-600 text-2xl"></i>
                                )}
                              </div>
                              <div className="flex flex-col gap-2 flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-bold text-gray-900 text-lg">
                                      {e.Company?.companyName || e.institutionName}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-gray-700 font-medium">
                                        {e.degree} - {e.fieldOfStudy}
                                      </span>
                                      {e.score && (
                                        <>
                                          <span className="text-gray-400">•</span>
                                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                                            IPK: {e.score}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                    <p className="text-gray-500 text-sm mt-1">
                                      {e.startDate} - {e.endDate ? e.endDate : "Sekarang"}
                                    </p>
                                  </div>
                                </div>
                                {e.description && (
                                  <p className="text-gray-600 mt-2">
                                    {e.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            {userData?.id === profileData?.id && (
                              <button
                                onClick={() => handleDeleteEducation(e.id)}
                                className="h-8 w-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 flex items-center justify-center ml-4"
                                title="Hapus Pendidikan"
                              >
                                <i className="fa-solid fa-trash text-xs"></i>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                          <i className="fas fa-graduation-cap text-3xl text-gray-400"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          Belum ada pendidikan
                        </h3>
                        <p className="text-gray-500">
                          Tambahkan riwayat pendidikan Anda
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Applications Preview (For Company Users) */}
          {previewApp.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <i className="fa-solid fa-circle-info text-blue-600"></i>
                  Melamar di Perusahaan Anda
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  User ini telah melamar di lowongan Anda
                </p>
              </div>
              
              <div className="p-4">
                <div className="space-y-4">
                  {previewApp.map((pa) => (
                    <div
                      key={pa.id}
                      className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:bg-blue-50 transition-all duration-200 group"
                    >
                      <div className="h-12 w-12 rounded-xl overflow-hidden bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                        {company?.User?.profilePicture ? (
                          <img
                            src={company.User.profilePicture}
                            alt="company logo"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <i className="fas fa-building text-blue-600"></i>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900 truncate">
                              {company?.companyName}
                            </h4>
                            <p className="text-sm text-blue-600 font-medium truncate">
                              @{company?.User?.username}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs uppercase font-medium ml-2 whitespace-nowrap ${getStatusBadgeClass(
                              pa.status
                            )}`}
                          >
                            {pa.status}
                          </span>
                        </div>
                        
                        <Link
                          to={`/job/${pa.Job?.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm block mt-2 truncate"
                        >
                          {pa.Job?.title}
                        </Link>
                        
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <i className="fa-solid fa-calendar"></i>
                          Dilamar pada{" "}
                          {pa?.appliedAt
                            ? new Intl.DateTimeFormat("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }).format(new Date(pa.appliedAt))
                            : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    to={`/employer/applications?q=${profileData?.username}`}
                    className="w-full text-center text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-center gap-2 py-3"
                  >
                    <i className="fa-solid fa-eye"></i>
                    Lihat Detail Lamaran
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Other Job Seekers */}
          {asideLoading ? (
            <OtherJsPreviewSkeleton count={3} />
          ) : (
            otherJsPreview.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-lg text-gray-900">Pencari Kerja Lainnya</h3>
                  <p className="text-gray-600 text-sm mt-1">Temukan talenta lainnya</p>
                </div>
                
                <div className="p-4">
                  <div className="space-y-4">
                    {otherJsPreview.map((ojp) => (
                      <Link to={`/js/${ojp.id}`} key={ojp.id}>
                        <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white group">
                          <div className="relative">
                            <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 p-0.5">
                              <img
                                src={ojp.profilePicture || defaultPfp}
                                alt="Profile Picture"
                                className="h-full w-full rounded-full object-cover border-2 border-white"
                              />
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                              {ojp.UserProfile?.fullName}
                            </h4>
                            <p className="text-sm text-blue-600 font-medium truncate">
                              @{ojp.username}
                            </p>
                            {ojp.UserProfile?.bio && (
                              <p className="text-xs text-gray-500 truncate mt-1">
                                {ojp.UserProfile.bio.substring(0, 50)}...
                              </p>
                            )}
                          </div>
                          
                          <i className="fas fa-chevron-right text-gray-400 group-hover:text-blue-600 transition-colors"></i>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Link to="/job-seekers">
                      <button className="w-full text-center text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-center gap-2">
                        Lihat Semua Pencari Kerja
                        <i className="fas fa-arrow-right"></i>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )
          )}
        </aside>
      </div>
      
      <EditProfilePopup
        isVisible={showEditProfPopup}
        onClose={() => setShowEditProfPopup(false)}
        profileData={profileData}
        onEdit={handleEditProfile}
        countries={countries}
      />
      <AddUserDisPopup
        isVisible={showAddDisPopup}
        onClose={() => setShowAddDisPopup(false)}
        profileData={profileData}
        onCreate={handleAddDisability}
      />
      <AddUserEduPopup
        isVisible={showAddEduPopup}
        onClose={() => setShowAddEduPopup(false)}
        profileData={profileData}
        onCreate={handleAddEducation}
      />
      <AddUserExpPopup
        isVisible={showAddExpPopup}
        onClose={() => setShowAddExpPopup(false)}
        profileData={profileData}
        onCreate={handleAddExperience}
      />
      <AddUserSkiPopup
        isVisible={showAddSkiPopup}
        onClose={() => setShowAddSkiPopup(false)}
        profileData={profileData}
        onCreate={handleAddSKill}
      />
    </>
  );
};

export default ProfilePage;