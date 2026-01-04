// src/pages/CompanyProfilePage.js
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
    const company = profileData?.Company || {};

    // Stage requirements
    const stage1 = [company.companyName, company.country];
    const stage2 = [company.industryId, company.websiteLink];
    const stage3 = [company.companyDescription, profileData?.profilePicture];
    const stage4 = [company.city, company.address, company.establishedYear];

    // Calculate completed items per stage
    const completedStage1 = stage1.filter((item) =>
      Boolean(item?.toString().trim())
    ).length;
    const completedStage2 = stage2.filter((item) =>
      Boolean(item?.toString().trim())
    ).length;
    const completedStage3 = stage3.filter((item) =>
      Boolean(item?.toString().trim())
    ).length;
    const completedStage4 = stage4.filter((item) =>
      Boolean(item?.toString().trim())
    ).length;

    // Determine current stage and percentage
    let currentStage = 1;
    let percent = 0;

    if (completedStage1 === 2) {
      currentStage = 2;
      percent = 25;

      if (completedStage2 === 2) {
        currentStage = 3;
        percent = 50;

        if (completedStage3 === 2) {
          currentStage = 4;
          percent = 75;

          // Stage 4 percentage based on completion
          if (completedStage4 === 3) percent = 100;
          else if (completedStage4 === 2) percent = 90;
          else if (completedStage4 === 1) percent = 83;
        }
      }
    } else {
      // Stage 1 incomplete
      percent = completedStage1 === 1 ? 12 : 5;
    }

    return {
      percent,
      currentStage,
      totalStages: 4,
      completed: {
        stage1: completedStage1,
        stage2: completedStage2,
        stage3: completedStage3,
        stage4: completedStage4,
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

  const AboutSkeleton = () => {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 animate-pulse">
        {/* Title */}
        <div className="h-8 w-40 bg-gray-200 rounded-lg mb-8" />

        {/* Description */}
        <div className="space-y-3 mb-8">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-11/12 bg-gray-200 rounded" />
          <div className="h-4 w-10/12 bg-gray-200 rounded" />
        </div>

        {/* Info Items */}
        <div className="space-y-6">
          <div>
            <div className="h-5 w-48 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-72 bg-gray-200 rounded" />
          </div>
          <div>
            <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-56 bg-gray-200 rounded" />
          </div>
          <div>
            <div className="h-5 w-28 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  };

  const OtherCmPreviewSkeleton = ({ count = 4 }) => {
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
              <div className="h-16 w-16 rounded-xl bg-gray-200" />

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
                  <Link to={`/employer`}>
                    <button className="px-5 py-2.5 rounded-xl bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-lg transition-all duration-200 border border-gray-200 font-medium flex items-center gap-2">
                      <i className="fas fa-tachometer-alt"></i>
                      Dashboard
                    </button>
                  </Link>
                  <button
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transition-all duration-200 font-medium flex items-center gap-2"
                    onClick={() => setShowEditProfPopup(!showEditProfPopup)}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                    Edit Profile
                  </button>
                </div>
              )}

              {/* Cover Photo */}
              <div className="bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500 h-36 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>

              <div className="px-6 sm:px-8 pb-8 relative">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-20">
                  {/* Profile Picture */}
                  <div className="relative">
                    <div className="h-40 w-40 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1 shadow-2xl">
                      <div className="h-full w-full rounded-full bg-white p-1">
                        <img
                          src={profileData?.profilePicture || defaultCm}
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
                    <div className="space-y-2">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                          {profileData?.Company?.companyName}
                        </h1>
                        <div className="flex items-center gap-2">
                          <span className="text-lg text-blue-600 font-medium">
                            @{profileData?.username}
                          </span>
                          {profileData.Company?.Industry?.name && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600 capitalize">
                                {profileData?.Company?.Industry?.name}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-gray-600 ">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-map-marker-alt text-gray-400"></i>
                          <span className="capitalize">
                            {profileData?.Company?.city},{" "}
                            {profileData?.Company?.country}
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

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 mt-6">
                        {profileData?.Company?.websiteLink && (
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={profileData?.Company?.websiteLink}
                            className="inline-block"
                          >
                            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2">
                              <i className="fa-solid fa-link"></i>
                              Kunjungi Website
                            </button>
                          </a>
                        )}

                        <Link
                          to={`/jobs?q=${profileData?.Company?.companyName}`}
                        >
                          <button className="border-2 border-blue-600 text-blue-700 hover:bg-blue-50 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2">
                            <i className="fa-solid fa-eye"></i>
                            Lihat Pekerjaan
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Completion (Only for owner) */}
                {userData?.id === profileData?.id && (
                  <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          Kelengkapan Profil
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {profileCompletion.percent === 100
                            ? "Profil sudah sempurna! Perusahaan Anda siap dilirik pelamar."
                            : profileCompletion.percent >= 75
                            ? "Tingkat kelengkapan baik! Sedikit lagi untuk sempurna."
                            : profileCompletion.percent >= 50
                            ? "Profil cukup lengkap. Tingkatkan untuk kredibilitas lebih."
                            : "Lengkapi profil untuk meningkatkan kredibilitas perusahaan"}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-blue-700">
                          {profileCompletion.percent}%
                        </span>
                        <p className="text-gray-600 text-sm">
                          {profileCompletion.percent === 100
                            ? "Sempurna!"
                            : profileCompletion.percent >= 75
                            ? "Baik"
                            : profileCompletion.percent >= 50
                            ? "Cukup"
                            : "Perlu ditingkatkan"}
                        </p>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          profileCompletion.percent === 100
                            ? "bg-gradient-to-r from-green-500 to-emerald-600"
                            : profileCompletion.percent >= 75
                            ? "bg-gradient-to-r from-blue-500 to-purple-600"
                            : profileCompletion.percent >= 50
                            ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                            : "bg-gradient-to-r from-red-500 to-pink-600"
                        }`}
                        style={{ width: `${profileCompletion.percent}%` }}
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        {
                          label: "Informasi Dasar",
                          completed: profileCompletion.completed.stage1 === 2,
                          icon: "fa-building",
                          items: [
                            {
                              name: "Nama Perusahaan",
                              completed: Boolean(
                                profileData?.Company?.companyName?.trim()
                              ),
                            },
                            {
                              name: "Negara",
                              completed: Boolean(
                                profileData?.Company?.country?.trim()
                              ),
                            },
                          ],
                          required: 2,
                          current: profileCompletion.completed.stage1,
                        },
                        {
                          label: "Detail Perusahaan",
                          completed: profileCompletion.completed.stage2 === 2,
                          icon: "fa-info-circle",
                          items: [
                            {
                              name: "Industri",
                              completed: Boolean(
                                profileData?.Company?.industryId
                              ),
                            },
                            {
                              name: "Website",
                              completed: Boolean(
                                profileData?.Company?.websiteLink?.trim()
                              ),
                            },
                          ],
                          required: 2,
                          current: profileCompletion.completed.stage2,
                        },
                        {
                          label: "Profil Lengkap",
                          completed: profileCompletion.completed.stage3 === 2,
                          icon: "fa-file-alt",
                          items: [
                            {
                              name: "Deskripsi",
                              completed: Boolean(
                                profileData?.Company?.companyDescription?.trim()
                              ),
                            },
                            {
                              name: "Foto Profil",
                              completed: Boolean(
                                profileData?.profilePicture?.trim()
                              ),
                            },
                          ],
                          required: 2,
                          current: profileCompletion.completed.stage3,
                        },
                        {
                          label: "Detail Tambahan",
                          completed: profileCompletion.completed.stage4 === 3,
                          icon: "fa-map-marker-alt",
                          items: [
                            {
                              name: "Kota",
                              completed: Boolean(
                                profileData?.Company?.city?.trim()
                              ),
                            },
                            {
                              name: "Alamat",
                              completed: Boolean(
                                profileData?.Company?.address?.trim()
                              ),
                            },
                            {
                              name: "Tahun Berdiri",
                              completed: Boolean(
                                profileData?.Company?.establishedYear
                              ),
                            },
                          ],
                          required: 3,
                          current: profileCompletion.completed.stage4,
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100"
                        >
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              item.completed
                                ? "bg-green-100 text-green-600"
                                : item.current > 0
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            <i className={`fas ${item.icon} text-sm`}></i>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.label}</p>
                            <p className="text-xs text-gray-500">
                              {item.completed
                                ? "Lengkap"
                                : `${item.current}/${item.required}`}
                            </p>
                            {!item.completed && item.current > 0 && (
                              <div className="mt-1 flex gap-1">
                                {item.items.map((subItem, subIndex) => (
                                  <div
                                    key={subIndex}
                                    className={`w-2 h-2 rounded-full ${
                                      subItem.completed
                                        ? "bg-blue-500"
                                        : "bg-gray-300"
                                    }`}
                                    title={subItem.name}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* About Company */}
          {loading ? (
            <AboutSkeleton />
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-2 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Tentang Perusahaan
                </h1>
              </div>

              {profileData?.Company?.companyDescription && (
                <div className="mb-10">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {profileData?.Company?.companyDescription}
                    </p>
                  </div>
                </div>
              )}

              {/* Company Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama Perusahaan */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <i className="fas fa-building text-blue-600"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      Nama Perusahaan
                    </h3>
                  </div>
                  <p className="text-gray-700 font-medium">
                    {profileData?.Company?.companyName}
                  </p>
                </div>

                {/* Industri */}
                {profileData?.Company?.Industry?.name && (
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <i className="fas fa-industry text-purple-600"></i>
                      </div>
                      <h3 className="font-semibold text-gray-900">Industri</h3>
                    </div>
                    <p className="text-gray-700 capitalize">
                      {profileData?.Company?.Industry?.name ||
                        profileData?.Company?.industryName}
                    </p>
                  </div>
                )}

                {/* Lokasi */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <i className="fas fa-map-marker-alt text-green-600"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900">Lokasi</h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-700 capitalize">
                      {`${profileData?.Company?.city}, ${profileData?.Company?.country}`}
                    </p>
                    {profileData?.Company?.address && (
                      <p className="text-gray-600 text-sm">
                        {profileData?.Company?.address}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tahun Berdiri */}
                {profileData?.Company?.establishedYear && (
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <i className="fas fa-calendar-star text-amber-600"></i>
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        Tahun Berdiri
                      </h3>
                    </div>
                    <p className="text-gray-700 font-medium">
                      {profileData?.Company?.establishedYear}
                    </p>
                  </div>
                )}

                {/* Website */}
                {profileData?.Company?.websiteLink && (
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 md:col-span-2">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                        <i className="fas fa-globe text-cyan-600"></i>
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        Official Website
                      </h3>
                    </div>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium group"
                      href={profileData?.Company?.websiteLink}
                    >
                      <span className="truncate">
                        {profileData?.Company?.websiteLink}
                      </span>
                      <i className="fas fa-external-link-alt text-sm opacity-0 group-hover:opacity-100 transition-opacity"></i>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {asideLoading ? (
            <OtherCmPreviewSkeleton count={3} />
          ) : (
            otherCmPreview.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-lg text-gray-900">
                    Perusahaan Lainnya
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Temukan perusahaan serupa
                  </p>
                </div>

                <div className="p-4">
                  <div className="space-y-4">
                    {otherCmPreview.map((ocp) => (
                      <Link to={`/cm/${ocp.id}`} key={ocp.id}>
                        <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white group">
                          <div className="relative">
                            <div className="h-14 w-14 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 p-0.5">
                              <img
                                src={ocp.profilePicture || defaultCm}
                                alt="Profile Picture"
                                className="h-full w-full rounded-xl object-cover border-2 border-white"
                              />
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-blue-500 rounded-full border-2 border-white"></div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                              {ocp.Company?.companyName}
                            </h4>
                            <p className="text-sm text-blue-600 font-medium truncate">
                              @{ocp.username}
                            </p>
                            {ocp.Company?.industryName && (
                              <p className="text-xs text-gray-500 truncate capitalize mt-1">
                                {ocp.Company.industryName}
                              </p>
                            )}
                          </div>

                          <i className="fas fa-chevron-right text-gray-400 group-hover:text-blue-600 transition-colors"></i>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Link to="/companies">
                      <button className="w-full text-center text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-center gap-2">
                        Lihat Semua Perusahaan
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
