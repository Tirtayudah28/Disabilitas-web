// src/pages/ProfilePage.js - VERSI FIXED
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import defaultCm from "../../assets/default-company.png";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackbar } from "notistack";
import CmEditProfilePopup from "../../components/popups/CmEditProfilePopup";

const CompanyProfilePage = () => {
  const { token, userData } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [asideLoading, setAsideLoading] = useState(false);

  const [profileData, setProfileData] = useState({});
  const [educations, setEducations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [disabilities, setDisabilities] = useState([]);
  const [otherCmPreview, setOtherCmPreview] = useState([]);

  const [countries, setCountries] = useState([]);

  const [showEditProfPopup, setShowEditProfPopup] = useState(false);

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
    setLoading(true);
    try {
      const res = await axios.get(`/api/user/${userId}`);

      if (res.data.data.role === "job-seeker") {
        navigate(`/js/${userId}`);
      }
      setProfileData(res.data.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };
  const getOtherCmPreview = async () => {
    setAsideLoading(true);
    try {
      const res = await axios.get(
        `/api/data/other-user-preview?excludeCurrentUserId=${userId}&role=company`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOtherCmPreview(res.data.data);
    } catch (error) {
      console.error("Error fetching app preview:", error);
    } finally {
      setAsideLoading(false);
    }
  };

  useEffect(() => {
    getUserById();
  }, [userId]);
  useEffect(() => {
    getOtherCmPreview();
  }, [token, userId]);

  /*
    fatir: EDITING/UPDATING OPERATIONS
  */
  //handle edit profile
  const handleEditProfile = async (form) => {
    setLoading(true);
    try {
      const payload = {};
      Object.keys(form).forEach((key) => {
        if (profileData?.company?.[key] !== form[key]) {
          payload[key] = form[key] === "" ? null : form[key];
        }
      });
      if (Object.keys(payload).length === 0) {
        enqueueSnackbar("Tidak ada perubahan data", { variant: "info" });
        return;
      }

      console.log(payload);

      const res = await axios.put("/api/user/cm/profile", payload, {
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
    SKELETON LOADER
  */
  const ProfileHeaderSkeleton = () => {
    return (
      <div className="bg-white rounded-md shadow-lg overflow-hidden mb-4 animate-pulse">
        {/* Cover */}
        <div className="bg-gray-200 h-28" />

        <div className="px-8 pb-8">
          <div className="flex flex-col items-start -mt-16">
            {/* Avatar */}
            <div className="h-32 w-32 rounded-full bg-gray-200 border-4 border-white" />

            {/* Name & Meta */}
            <div className="mt-6 w-full">
              <div className="space-y-3">
                <div className="h-8 w-1/2 bg-gray-200 rounded" />
                <div className="h-5 w-1/3 bg-gray-200 rounded" />

                <div className="flex items-center gap-4 mt-2">
                  <div className="h-4 w-40 bg-gray-200 rounded" />
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const AboutSkeleton = () => {
    return (
      <div className="flex flex-col bg-white shadow-lg overflow-hidden p-7 mb-4 animate-pulse">
        {/* Title */}
        <div className="h-7 w-32 bg-gray-200 rounded" />

        {/* Description */}
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-11/12 bg-gray-200 rounded" />
          <div className="h-4 w-10/12 bg-gray-200 rounded" />
        </div>

        {/* Nama Perusahaan */}
        <div className="mt-8">
          <div className="h-4 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-64 bg-gray-200 rounded mt-2" />
        </div>

        {/* Industri */}
        <div className="mt-6">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-48 bg-gray-200 rounded mt-2" />
        </div>

        {/* Lokasi */}
        <div className="mt-6">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-56 bg-gray-200 rounded mt-2" />
          <div className="h-4 w-72 bg-gray-200 rounded mt-2" />
        </div>

        {/* Tahun Berdiri */}
        <div className="mt-6">
          <div className="h-4 w-28 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded mt-2" />
        </div>

        {/* Website */}
        <div className="mt-6">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-72 bg-gray-200 rounded mt-2" />
        </div>
      </div>
    );
  };
  const OtherCmPreviewSkeleton = ({ count = 4 }) => {
    return (
      <div className="bg-white rounded shadow-lg overflow-hidden mb-4 p-4 animate-pulse">
        {/* Title */}
        <h2>Pengguna lain</h2>

        <div className="flex flex-col gap-3 mt-4">
          {Array.from({ length: count }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-3 p-3 border border-gray-200 rounded-md"
            >
              {/* Avatar */}
              <div className="h-20 w-20 bg-gray-200" />

              {/* Name */}
              <div className="flex flex-col items-center gap-2">
                <div className="h-5 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-screen mx-auto lg:px-28 xl:px-32 py-8">
        {/* Main Content */}
        <main id="main-content" className="container col-span-3">
          {/* Profile Header */}
          {loading ? (
            <ProfileHeaderSkeleton />
          ) : (
            <div className="bg-white rounded shadow-lg overflow-hidden mb-4 relative">
              {userData?.id === profileData?.id && (
                <div className="absolute top-3 right-3 flex gap-5">
                  <Link to={`/employer`}>
                    <button className="px-5 py-2 rounded bg-white">
                      Dashboard{" "}
                      <i
                        className="fas fa-tachometer-alt w-4"
                        aria-hidden="true"
                      ></i>{" "}
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
              <div className="bg-gradient-to-r from-violet-700 to-violet-300 h-28"></div>
              <div className="px-8 pb-8">
                <div className="flex flex-col items-start -mt-16">
                  <div className="relative">
                    <div className="h-32 w-32 aspect-square rounded-full bg-white">
                      <img
                        src={profileData?.profilePicture || defaultCm}
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

                  <div className="flex flex-col mt-6 flex-1 md:flex-row md:items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {profileData?.company?.companyName}{" "}
                        <Link
                          to={`/cm/${profileData?.id}`}
                          className="text-base text-blue-600 font-normal"
                        >
                          @{profileData?.username}
                        </Link>
                      </h1>
                      <p className="mt-1 text-gray-600 capitalize">
                        {profileData?.company?.Industry?.name ||
                          profileData?.company?.industryName}
                      </p>

                      <div className="flex items-center mt-2 text-gray-600">
                        <i className="fas fa-map-marker-alt mr-2"></i>
                        <span className="capitalize">
                          {profileData?.company?.country},{" "}
                          {profileData?.company?.city}
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

                      <div className="flex gap-4 mt-4">
                        {profileData?.company?.websiteLink && (
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={profileData?.company?.websiteLink}
                          >
                            <button className="bg-blue-600 text-sm text-white cursor-pointer hover:bg-blue-700 rounded-full px-5 py-2">
                              <i class="fa-solid fa-link"></i> Kunjungi Website
                            </button>
                          </a>
                        )}
                        <Link
                          to={`/jobs?q=${profileData?.company?.companyName}`}
                        >
                          <button className="text-sm text-blue-700 border border-blue-700 cursor-pointer hover:bg-gray-100 rounded-full px-5 py-2">
                            <i class="fa-solid fa-eye"></i> Lihat Pekerjaan
                          </button>
                        </Link>
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
          )}

          {/* About Company */}
          {loading ? (
            <AboutSkeleton />
          ) : (
            <div className="flex flex-col bg-white shadow-lg overflow-hidden p-7 mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Tentang</h1>
              {profileData?.company?.companyDescription && (
                <p className="mt-3 text-gray-600 leading-loose whitespace-pre-line">
                  {profileData?.company?.companyDescription}
                </p>
              )}
              <div className="mt-8">
                <h2 className="font-semibold text-gray-900">Nama Perusahaan</h2>
                <p className="mt-1 text-gray-600">
                  {profileData?.company?.companyName}
                </p>
              </div>
              <div className="mt-6">
                <h2 className="font-semibold text-gray-900">Industri</h2>
                <p className="mt-1 text-gray-600 capitalize">
                  {profileData?.company?.Industry?.name ||
                    profileData?.company?.industryName}
                </p>
              </div>
              <div className="mt-6">
                <h2 className="font-semibold text-gray-900">Lokasi</h2>
                <p className="mt-1 text-gray-600 capitalize">
                  {`${profileData?.company?.country}, ${profileData?.company?.city}`}
                </p>
                {profileData?.company?.address && (
                  <p className="mt-1 text-gray-600">
                    {profileData?.company?.address}
                  </p>
                )}
              </div>
              {profileData?.company?.establishedYear && (
                <div className="mt-6">
                  <h2 className="font-semibold text-gray-900">Tahun Berdiri</h2>
                  <p className="mt-1 text-gray-600">
                    {profileData?.company?.establishedYear}
                  </p>
                </div>
              )}
              {profileData?.company?.websiteLink && (
                <div className="mt-6">
                  <h2 className="font-semibold text-gray-900">
                    Official Website
                  </h2>
                  <div className="mt-1">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600"
                      href={profileData?.company?.websiteLink}
                    >
                      {profileData?.company?.websiteLink}
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
        {/* Aside */}
        <aside className="flex flex-col col-span-1">
          {asideLoading ? (
            <OtherCmPreviewSkeleton />
          ) : (
            otherCmPreview.length > 0 && (
              <div className="bg-white rounded shadow-lg overflow-hidden mb-4 p-4">
                <h2>Perusahaan lain</h2>
                <div className="flex flex-col gap-3 mt-4">
                  {otherCmPreview.map((ocp) => (
                    <Link to={`/cm/${ocp.id}`}>
                      <div
                        key={ocp.id}
                        className="flex flex-col items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-blue-50 transition"
                      >
                        <img
                          src={ocp.profilePicture || defaultCm}
                          alt="Profile Picture"
                          className="h-20 w-20 object-cover aspect-square"
                        />
                        <div className="flex flex-col items-center">
                          <h3 className="font-semibold text-center">
                            {ocp.Company?.companyName}
                          </h3>
                          <p className="text-sm text-blue-600">
                            @{ocp.username}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          )}
        </aside>
      </div>
      <CmEditProfilePopup
        isVisible={showEditProfPopup}
        onClose={() => setShowEditProfPopup(false)}
        profileData={profileData}
        onEdit={handleEditProfile}
        countries={countries}
      />
    </>
  );
};

export default CompanyProfilePage;
