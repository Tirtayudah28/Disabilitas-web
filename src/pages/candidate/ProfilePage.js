// src/pages/ProfilePage.js - VERSI FIXED
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

const ProfilePage = () => {
  const { token, userData } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({});
  const [educations, setEducations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [disabilities, setDisabilities] = useState([]);

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

      // OPTIONAL: refresh data
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
    setLoading(true);
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
      setLoading(false);
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

    setLoading(true);
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
      setLoading(false);
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
    setLoading(true);
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
      setLoading(false);
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
    setLoading(true);
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
      setLoading(false);
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
    setLoading(true);
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
      setLoading(false);
    }
  };
  //handle delete education
  const handleDeleteEducation = async (id) => {
    if (!id) return;

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    setLoading(true);
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
      setLoading(false);
    }
  };
  //handle delete experience
  const handleDeleteExperience = async (id) => {
    if (!id) return;

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-10 min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 mx-auto lg:px-32 xl:px-36 py-8">
        {/* Main Content */}
        <main id="main-content" className="container">
          {/* Profile Header */}
          <div className="bg-white rounded shadow-lg overflow-hidden mb-4 relative">
            {userData?.id === profileData?.id && (
              <div className="absolute top-3 right-3 flex gap-5">
                <Link to="/js/applications">
                  <button className="px-5 py-2 rounded bg-white">
                    Riwayat Lamaran{" "}
                    <i className="fas fa-history w-4" aria-hidden="true"></i>
                  </button>
                </Link>
                <button
                  className="px-5 py-2 rounded bg-white"
                  onClick={() => setShowEditProfPopup(!showEditProfPopup)}
                >
                  Edit Profile <i class="fa-solid fa-pen-to-square"></i>
                </button>
              </div>
            )}
            <div className="bg-gradient-to-r from-blue-600 to-blue-300 h-28"></div>
            <div className="px-8 pb-8">
              <div className="flex flex-col items-start -mt-16">
                <div className="relative">
                  <div className="h-32 w-32 aspect-square rounded-full bg-white">
                    <img
                      src={profileData?.profilePicture || defaultPfp}
                      alt="profile picture"
                      className="h-32 w-32 aspect-square rounded-full object-cover"
                    />
                  </div>
                  {userData?.id === profileData?.id && (
                    <>
                      <label
                        htmlFor="profilePictureInput"
                        className={`${
                          profileData?.profilePicture
                            ? "absolute right-0 bottom-0"
                            : "absolute bottom-2 right-2"
                        } bg-white/70 p-2 rounded-full shadow-md hover:bg-gray-100 transition cursor-pointer`}
                      >
                        <i className="fas fa-camera text-gray-600"></i>
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
                          title="Delete Profile Picture"
                          onClick={(e) => handleEditPfp(null, "delete")}
                          className="absolute -bottom-4 right-10 p-2 bg-white/70 rounded-full shadow-md hover:bg-gray-100 transition cursor-pointer"
                        >
                          <i class="fa-solid fa-trash text-gray-600"></i>
                        </button>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-6 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {profileData?.profile?.fullName}{" "}
                        <span className="text-gray-500 text-base font-normal">
                          {profileData?.profile?.gender !== "blank"
                            ? profileData?.profile?.gender
                            : ""}
                        </span>
                      </h1>
                      <Link
                        to={`/js/${profileData?.id}`}
                        className="text-lg text-blue-600"
                      >
                        @{profileData?.username}
                      </Link>
                      <div className="flex items-center mt-2 text-gray-500">
                        <i className="fas fa-map-marker-alt mr-2"></i>
                        <span className="capitalize">
                          {profileData?.profile?.country},{" "}
                          {profileData?.profile?.city}
                        </span>
                        <span className="mx-2">•</span>
                        <i className="fas fa-clock mr-2"></i>
                        <span>
                          Bergabung sejak{" "}
                          {profileData?.createdAt
                            ? new Intl.DateTimeFormat("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }).format(new Date(profileData.createdAt))
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Completion */}
              {userData?.id === profileData?.id && (
                <div className="mt-6 bg-primary-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Kelengkapan Profil</span>
                    <span className="font-bold text-primary-600">
                      {profileCompletion.percent}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        profileCompletion.percent >= 75
                          ? "bg-green-500"
                          : profileCompletion.percent >= 50
                          ? "bg-yellow-400"
                          : "bg-red-400"
                      }`}
                      style={{ width: `${profileCompletion.percent}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {profileCompletion.percent !== 100
                      ? "Lengkapi profil Anda untuk meningkatkan peluang diterima kerja"
                      : "Profil anda sudah sempurna!"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded shadow-lg p-6 sticky top-32">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                        activeTab === tab.id
                          ? "bg-primary-100 text-primary-600 border-l-4 border-primary-500"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <i
                        className={`fas fa-${tab.icon} text-primary-500 w-5 text-center`}
                      ></i>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              {/* === Tentang TAB === */}
              {activeTab === "data-diri" && (
                <div className="bg-white rounded shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Tentang
                    </h2>
                    {userData?.id === profileData?.id && (
                      <button
                        onClick={() => setShowEditProfPopup(!showEditProfPopup)}
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                    )}
                  </div>

                  <p className="mb-4">{profileData?.profile?.bio}</p>

                  <table className="table-auto">
                    <tbody>
                      <tr>
                        <td className="pr-3 py-2">
                          <i class="fa-solid fa-user"></i>
                        </td>
                        <td className="py-2">
                          {profileData?.profile?.fullName}{" "}
                          <Link
                            to={`/js/${profileData?.id}`}
                            className="text-xs text-blue-600"
                          >
                            @{profileData?.username}
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td className="pr-3 pb-2 pt-1 align-top">
                          <i class="fa-solid fa-location-dot"></i>
                        </td>
                        <td className="align-top pb-2 pt-1">
                          <span className="capitalize">
                            {profileData?.profile?.country}
                            {", "}
                            {profileData?.profile?.city}
                          </span>
                          {profileData?.profile?.address && (
                            <>
                              <br />
                              <span className="text-xs text-gray-600">
                                {profileData?.profile?.address}
                              </span>
                            </>
                          )}
                        </td>
                      </tr>
                      {profileData?.profile?.phoneNumber && (
                        <tr>
                          <td className="pr-3 py-2">
                            <i class="fa-solid fa-phone"></i>
                          </td>
                          <td>{profileData.profile.phoneNumber}</td>
                        </tr>
                      )}
                      {profileData?.profile?.dateOfBirth && (
                        <tr>
                          <td className="pr-3 py-2">
                            <i class="fa-solid fa-calendar"></i>
                          </td>
                          <td>
                            {new Intl.DateTimeFormat("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }).format(
                              new Date(profileData.profile.dateOfBirth)
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* === JENIS DISABILITAS TAB === */}
              {activeTab === "disabilitas" && (
                <div className="bg-white rounded shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Jenis Disabilitas
                    </h2>
                    {userData?.id === profileData?.id && (
                      <button
                        onClick={() => setShowAddDisPopup(!showAddDisPopup)}
                      >
                        <i class="fa-solid fa-plus"></i>
                      </button>
                    )}
                  </div>

                  {disabilities && disabilities.length > 0 ? (
                    disabilities.map((d) => (
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
                        {userData?.id === profileData?.id && (
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
              )}

              {/* === KEAHLIAN TAB === */}
              {activeTab === "keahlian" && (
                <div className="bg-white rounded shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Keahlian
                    </h2>
                    {userData?.id === profileData?.id && (
                      <button
                        onClick={() => setShowAddSkiPopup(!showAddSkiPopup)}
                      >
                        <i class="fa-solid fa-plus"></i>
                      </button>
                    )}
                  </div>

                  {skills && skills.length > 0 ? (
                    skills.map((s) => (
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
                        {userData?.id === profileData?.id && (
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
              )}

              {/* === PENGALAMAN TAB === */}
              {activeTab === "pengalaman" && (
                <div className="bg-white rounded shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Pengalaman
                    </h2>
                    {userData?.id === profileData?.id && (
                      <button
                        onClick={() => setShowAddExpPopup(!showAddExpPopup)}
                      >
                        <i class="fa-solid fa-plus"></i>
                      </button>
                    )}
                  </div>

                  {experiences && experiences.length > 0 ? (
                    experiences.map((e) => (
                      <div
                        className="flex justify-between items-start px-2 py-6 hover:bg-gray-100 transition border-b border-gray-300"
                        key={e.id}
                      >
                        <div className="flex gap-5">
                          <img
                            src={e.Company?.User?.profilePicture || defaultCm}
                            alt="companyPfp"
                            className="aspect-square h-20 w-20 object-cover"
                          />
                          <div className="flex flex-col gap-1">
                            <h3 className="capitalize text-lg font-semibold">
                              {e.position}
                            </h3>
                            <p className="text-sm">
                              {e.Company?.companyName || e.companyName}{" "}
                              <span className="mx-1">•</span>{" "}
                              <span className="capitalize">
                                {e.experienceType}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              {e.startDate} - {e.endDate ? e.endDate : "now"}
                            </p>
                            {e.description && (
                              <p className="text-gray-600 text-sm">
                                {e.description}
                              </p>
                            )}
                          </div>
                        </div>
                        {userData?.id === profileData?.id && (
                          <button onClick={() => handleDeleteExperience(e.id)}>
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-sm">
                      Tidak ada data pengalaman.
                    </p>
                  )}
                </div>
              )}

              {/* === PENDIDIKAN TAB === */}
              {activeTab === "pendidikan" && (
                <div className="bg-white rounded shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Pendidikan
                    </h2>
                    {userData?.id === profileData?.id && (
                      <button
                        onClick={() => setShowAddEduPopup(!showAddEduPopup)}
                      >
                        <i class="fa-solid fa-plus"></i>
                      </button>
                    )}
                  </div>

                  {educations && educations.length > 0 ? (
                    educations.map((e) => (
                      <div
                        className="flex justify-between items-start px-2 py-6 hover:bg-gray-100 transition border-b border-gray-300"
                        key={e.id}
                      >
                        <div className="flex gap-5">
                          <img
                            src={e.Company?.User?.profilePicture || defaultCm}
                            alt="companyPfp"
                            className="aspect-square h-20 w-20 object-cover"
                          />
                          <div className="flex flex-col gap-1">
                            <h3 className="capitalize text-lg font-semibold">
                              {e.Company?.companyName || e.institutionName}
                            </h3>
                            <p className="text-sm">
                              {e.degree}/{e.fieldOfStudy}{" "}
                              {e.score && (
                                <>
                                  <span className="mx-1">•</span>
                                  <span className="capitalize">{e.score}</span>
                                </>
                              )}
                            </p>
                            <p className="text-sm text-gray-600">
                              {e.startDate} - {e.endDate ? e.endDate : "now"}
                            </p>
                            {e.description && (
                              <p className="text-gray-600 text-sm">
                                {e.description}
                              </p>
                            )}
                          </div>
                        </div>
                        {userData?.id === profileData?.id && (
                          <button onClick={() => handleDeleteEducation(e.id)}>
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-sm">
                      Tidak ada data pendidikan.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
        {/* Aside */}
        <aside className="flex flex-col">
          <h2>Orang/Perusahaan lain</h2>
          <div className="h-56 w-56"></div>
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
