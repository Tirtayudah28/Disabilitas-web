import axios from "axios";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const PostJobPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    employmentType: "full-time",
    locationType: "on-site",
    country: "",
    city: "",
    address: "",
    minSalary: "",
    maxSalary: "",
    startDate: "",
    endDate: "",

    disabilityId: "",
    disabilityName: "",
    type: "",

    skillId: "",
    skillName: "",
  });
  const [selectedDisabilities, setSelectedDisabilities] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const [disabilities, setDisabilities] = useState([]);
  const [disSearch, setDisSearch] = useState("");
  const [disDebouncedSearch, setDisDebouncedSearch] = useState("");
  const [showDisSuggestions, setShowDisSuggestions] = useState(false);
  const [blockDisApi, setBlockDisApi] = useState(false);

  const [skills, setSkills] = useState([]);
  const [skiSearch, setSkiSearch] = useState("");
  const [skiDebouncedSearch, setSkiDebouncedSearch] = useState("");
  const [showSkiSuggestions, setShowSkiSuggestions] = useState(false);
  const [blockSkiApi, setBlockSkiApi] = useState(false);

  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const DISABILITY_TYPES = [
    "sensory",
    "intellectual",
    "mental",
    "physical",
    "multiple",
    "other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (name === "country") {
      if (value.trim() === "") {
        setFilteredCountries([]);
        setShowSuggestions(false);
        return;
      }

      const filter = countries.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );

      setFilteredCountries(filter.slice(0, 8));
      setShowSuggestions(true);
    }
  };
  const handleDescriptionChange = (e) => {
    const v = e.target.value.slice(0, 2000);
    setForm((prev) => ({ ...prev, description: v }));
  };

  const selectCountry = (countryName) => {
    setForm({ ...form, country: countryName });
    setFilteredCountries([]);
    setShowSuggestions(false);
  };
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

  //fetch disabilities search-based
  const fetchDisabilities = async (q) => {
    try {
      if (!q || q.trim() === "") {
        setDisabilities([]);
        return;
      }

      const res = await axios.get(
        `/api/data/disabilities?search=${encodeURIComponent(q)}`
      );
      const data = res.data.data;
      setDisabilities(Array.isArray(data) ? data : []);
      setShowDisSuggestions(true);
    } catch (error) {
      console.error("Error fetching disabilities:", error);
      setDisabilities([]);
      setShowDisSuggestions(false);
    }
  };
  useEffect(() => {
    if (blockDisApi) return;
    const delay = setTimeout(() => setDisDebouncedSearch(disSearch), 500);
    return () => clearTimeout(delay);
  }, [disSearch]);
  useEffect(() => {
    fetchDisabilities(disDebouncedSearch);
  }, [disDebouncedSearch]);

  //fetch skills search-based
  const fetchSkills = async (q) => {
    try {
      if (!q || q.trim() === "") {
        setSkills([]);
        return;
      }

      const res = await axios.get(
        `/api/data/skills?search=${encodeURIComponent(q)}`
      );
      const data = res.data.data;
      setSkills(Array.isArray(data) ? data : []);
      setShowSkiSuggestions(true);
    } catch (error) {
      console.error("Error fetching skills:", error);
      setSkills([]);
      setShowSkiSuggestions(false);
    }
  };
  useEffect(() => {
    if (blockSkiApi) return;
    const delay = setTimeout(() => setSkiDebouncedSearch(skiSearch), 500);
    return () => clearTimeout(delay);
  }, [skiSearch]);
  useEffect(() => {
    fetchSkills(skiDebouncedSearch);
  }, [skiDebouncedSearch]);

  /*
  DISABILITIES CONTROLS
  */
  //suggestion selected
  const handleSelectSuggestion = (d) => {
    const id = d.id ?? null;
    const name = d.name ?? "";
    const type = d.type ?? "";

    const disabilityForm = {
      disabilityId: id ?? "",
      disabilityName: name,
      type: type ?? "",
    };

    if (name && (id || (type && DISABILITY_TYPES.includes(type)))) {
      handleAddDisabilityFromSuggestion(disabilityForm);
    }

    // DON'T update form state with suggestion values
    // Only clear the search input
    setForm((prev) => ({
      ...prev,
      disabilityId: "",
      disabilityName: "",
      type: "",
    }));

    setBlockDisApi(true);
    setDisSearch("");
    setShowDisSuggestions(false);
    setDisabilities([]);
  };

  const handleDisabilityInput = (e) => {
    const v = e.target.value;
    setBlockDisApi(false);
    setForm((prev) => ({
      ...prev,
      disabilityId: "",
      disabilityName: v,
      type: "",
    }));
    setDisSearch(v);
  };

  //add disability from suggestion
  const handleAddDisabilityFromSuggestion = (disabilityForm) => {
    const name = (disabilityForm.disabilityName || "").trim();
    if (!name) return;

    const id = disabilityForm.disabilityId ?? "";
    const type = disabilityForm.type ?? "";

    if (!id) {
      if (!type || !DISABILITY_TYPES.includes(type)) {
        return enqueueSnackbar("Tipe disabilitas tidak dapat kosong", {
          variant: "warning",
        });
      }
    }

    const exists = selectedDisabilities.some((sd) =>
      id
        ? sd.id && sd.id.toString() === id.toString()
        : sd.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      return enqueueSnackbar("Disabilitas sudah ada", { variant: "warning" });
    }

    const newItem = { id, name, type };
    setSelectedDisabilities((prev) => [...prev, newItem]);

    // Clear form is handled by the parent function
  };

  //add disability from form (manual)
  const handleAddDisability = () => {
    const name = (form.disabilityName || "").trim();
    if (!name) return;

    const id = form.disabilityId ?? "";
    const type = form.type ?? "";

    if (!id) {
      if (!type || !DISABILITY_TYPES.includes(type)) {
        return enqueueSnackbar("Tipe disabilitas tidak dapat kosong", {
          variant: "warning",
        });
      }
    }

    const exists = selectedDisabilities.some((sd) =>
      id
        ? sd.id && sd.id.toString() === id.toString()
        : sd.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      setForm((prev) => ({
        ...prev,
        disabilityId: "",
        disabilityName: "",
        type: "",
      }));
      return enqueueSnackbar("Disabilitas sudah ada", { variant: "warning" });
    }

    const newItem = { id, name, type };
    setSelectedDisabilities((prev) => [...prev, newItem]);

    setForm((prev) => ({
      ...prev,
      disabilityId: "",
      disabilityName: "",
      type: "",
    }));
    setDisSearch("");
    setBlockDisApi(false);
    setDisabilities([]);
    setShowDisSuggestions(false);
  };

  const handleRemoveDisability = (index) => {
    setSelectedDisabilities((prev) => prev.filter((_, i) => i !== index));
  };

  /*
  SKILLS CONTROLS
  */
  //suggestion selected
  const handleSelectSkiSuggestion = (d) => {
    const id = d.id ?? null;
    const name = d.name ?? "";

    const skillForm = {
      skillId: id ?? "",
      skillName: name,
    };

    if (name) {
      handleAddSkillFromSuggestion(skillForm);
    }

    // DON'T update form state with suggestion values
    // Only clear the search input
    setForm((prev) => ({
      ...prev,
      skillId: "",
      skillName: "",
    }));

    setBlockSkiApi(true);
    setSkiSearch("");
    setShowSkiSuggestions(false);
    setSkills([]);
  };

  const handleSkillInput = (e) => {
    const v = e.target.value;
    setBlockSkiApi(false);
    setForm((prev) => ({
      ...prev,
      skillId: "",
      skillName: v,
    }));
    setSkiSearch(v);
  };

  //add skill from suggestion
  const handleAddSkillFromSuggestion = (skillForm) => {
    const name = (skillForm.skillName || "").trim();
    if (!name) return;

    const id = skillForm.skillId ?? "";

    const exists = selectedSkills.some((sd) =>
      id
        ? sd.id && sd.id.toString() === id.toString()
        : sd.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      return enqueueSnackbar("Keahlian sudah ada", { variant: "warning" });
    }

    const newItem = { id, name };
    setSelectedSkills((prev) => [...prev, newItem]);

    // Clear form is handled by the parent function
  };

  //add skill from form (manual)
  const handleAddSkill = () => {
    const name = (form.skillName || "").trim();
    if (!name) return;

    const id = form.skillId ?? "";

    const exists = selectedSkills.some((sd) =>
      id
        ? sd.id && sd.id.toString() === id.toString()
        : sd.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      setForm((prev) => ({
        ...prev,
        skillId: "",
        skillName: "",
      }));
      return enqueueSnackbar("Keahlian sudah ada", { variant: "warning" });
    }

    const newItem = { id, name };
    setSelectedSkills((prev) => [...prev, newItem]);

    setForm((prev) => ({
      ...prev,
      skillId: "",
      skillName: "",
    }));
    setSkiSearch("");
    setBlockSkiApi(false);
    setSkills([]);
    setShowSkiSuggestions(false);
  };

  const handleRemoveSkill = (index) => {
    setSelectedSkills((prev) => prev.filter((_, i) => i !== index));
  };

  /*
    POST JOB
  */
  const handlePostJob = async () => {
    if (
      !form.title ||
      !form.description ||
      !form.locationType ||
      !form.employmentType ||
      !form.startDate ||
      !form.endDate ||
      !form.country ||
      selectedDisabilities.length <= 0 ||
      selectedSkills.length <= 0
    ) {
      return enqueueSnackbar("Field yang dibutuhkan masih belum lengkap", {
        variant: "warning",
      });
    }

    const payload = {
      title: form.title,
      description: form.description,
      employmentType: form.employmentType,
      locationType: form.locationType,
      country: form.country,
      city: form.city,
      address: form.address,
      minSalary: form.minSalary,
      maxSalary: form.maxSalary,
      startDate: form.startDate,
      endDate: form.endDate,
      skills: selectedSkills,
      disabilities: selectedDisabilities,
    };
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      setLoading(true);
      console.log(payload);

      const res = await axios.post("/api/job", payload, { headers });

      enqueueSnackbar(
        res.data.message || "Lowongan baru berhasil ditambahkan",
        { variant: "success" }
      );
      navigate("/employer/jobs");
    } catch (error) {
      enqueueSnackbar(error.response.data.message || "Terjadi kesalahan", {
        variant: "warning",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <h1 className="font-bold text-gray-900 text-2xl flex items-center gap-2">
          <i className="fas fa-briefcase" />

          <Link
            to="/employer/jobs"
            className="hover:underline hover:text-blue-600 transition"
          >
            Pekerjaan
          </Link>

          <span>{">"}</span>

          <Link
            to="/employer/jobs/post"
            className="hover:underline hover:text-blue-600 transition"
          >
            Post Lowongan Baru
          </Link>
        </h1>

        <div className="grid grid-cols-5 gap-6">
          {/* informasi umum */}
          <div className="bg-white rounded-xl shadow-lg p-6 col-span-3">
            <h2 className="font-bold text-gray-900 text-lg mb-6">
              Informasi Umum
            </h2>
            <div className="space-y-5">
              {/* 1) title */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Posisi / Jabatan
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="mis: Accountant"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
              {/* 2) description */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Deskripsi Pekerjaan
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleDescriptionChange}
                  rows={8}
                  maxLength={2000}
                  placeholder="Tambahkan keterangan (maks 2000 karakter)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {form.description.length}/2000
                </div>
              </div>
              {/* 3) employment / location type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Jenis Pekerjaan
                  </label>
                  <select
                    name="employmentType"
                    value={form.employmentType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="internship">Internship</option>
                    <option value="blank">Tidak ingin mengisi</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Jenis Lokasi
                  </label>
                  <select
                    name="locationType"
                    value={form.locationType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="on-site">On Site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="blank">Tidak ingin mengisi</option>
                  </select>
                </div>
              </div>

              {/* 4) address */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Alamat / Lokasi Pekerjaan (optional)
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={2}
                  maxLength={100}
                  placeholder="Alamat (maks 100 karakter)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {form.address.length}/100
                </div>
              </div>

              {/* 5) country/city */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Negara
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent capitalize"
                    autoComplete="off"
                    onFocus={() => {
                      if (
                        form.country.trim() !== "" &&
                        filteredCountries.length > 0
                      ) {
                        setShowSuggestions(true);
                      }
                    }}
                  />
                  {showSuggestions && filteredCountries.length > 0 && (
                    <ul className="absolute z-50 bg-white border border-gray-200 rounded-lg mt-1 w-full max-h-48 overflow-y-auto shadow-lg">
                      {filteredCountries.map((country, idx) => (
                        <li
                          key={idx}
                          onClick={() => selectCountry(country)}
                          className="px-4 py-3 cursor-pointer hover:bg-gray-50 capitalize border-b border-gray-100 last:border-b-0"
                        >
                          {country}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Kota
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent capitalize"
                  />
                </div>
              </div>

              {/* 6) salary */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Minimum Gaji (optional)
                  </label>
                  <input
                    type="number"
                    name="minSalary"
                    value={form.minSalary}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Maksimum Gaji (optional)
                  </label>
                  <input
                    type="number"
                    name="maxSalary"
                    value={form.maxSalary}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Kosongkan jika nominal gaji fixed (bukan range)
                  </div>
                </div>
              </div>

              {/* 7) start / end date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Tanggal Lowongan Dibuka
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Tanggal Lowongan Ditutup
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="col-span-2 space-y-6">
            {/* disabilitas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-4">
                Disabilitas terkait
              </h2>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Cari atau ketik disabilitas
                </label>

                <div className="space-y-3">
                  {/* Search input */}
                  <div className="relative">
                    <input
                      type="text"
                      name="disabilityName"
                      value={form.disabilityName}
                      onChange={handleDisabilityInput}
                      placeholder="Ketik nama disabilitas..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent capitalize"
                      autoComplete="off"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && form.disabilityName.trim()) {
                          e.preventDefault();
                          handleAddDisability();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddDisability}
                      disabled={
                        !form.disabilityName.trim() ||
                        (!form.disabilityId && !form.type)
                      }
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Tambah
                    </button>

                    {/* suggestions */}
                    {showDisSuggestions && disabilities.length > 0 && (
                      <ul className="absolute z-50 bg-white border border-gray-200 rounded-lg mt-1 w-full max-h-44 overflow-y-auto shadow-lg">
                        {disabilities.map((d) => {
                          const id = d.id ?? "";
                          const name = d.name ?? "";
                          const type = d.type ?? "";
                          return (
                            <li
                              key={id || name}
                              onClick={() => handleSelectSuggestion(d)}
                              className="px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium capitalize">
                                    {name}
                                  </div>
                                  <div className="text-xs text-gray-500 capitalize">
                                    {type}
                                  </div>
                                </div>
                                <span className="text-xs bg-violet-100 text-violet-800 px-2 py-1 rounded-full">
                                  Pilih
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  {/* Type selection - always visible for consistency */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      Pilih tipe disabilitas
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DISABILITY_TYPES.map((t) => (
                        <button
                          type="button"
                          key={t}
                          onClick={() =>
                            setForm((prev) => ({ ...prev, type: t }))
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs capitalize font-medium transition-all ${
                            form.type === t
                              ? "bg-violet-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    {form.type && (
                      <div className="mt-2 text-xs text-violet-600 flex items-center gap-1">
                        <i className="fas fa-check-circle"></i>
                        Tipe dipilih:{" "}
                        <span className="font-semibold capitalize">
                          {form.type}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Selected disabilities as pills */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Disabilitas dipilih ({selectedDisabilities.length})
                </div>
                {selectedDisabilities.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg min-h-[3rem]">
                    {selectedDisabilities.map((d, i) => (
                      <div
                        key={`${d.id || d.name}-${i}`}
                        className="inline-flex items-center gap-2 bg-violet-100 text-violet-800 rounded-full px-3 py-1.5 text-sm"
                      >
                        <span className="capitalize">{d.name}</span>
                        {d.type && (
                          <span className="text-xs bg-white text-violet-600 px-2 py-0.5 rounded-full capitalize">
                            {d.type}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveDisability(i)}
                          className="h-4 w-4 rounded-full hover:bg-violet-200 flex items-center justify-center"
                          aria-label={`Hapus ${d.name}`}
                        >
                          <i className="fas fa-times text-xs"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic p-3 border border-gray-200 rounded-lg bg-gray-50">
                    Belum ada disabilitas dipilih
                  </div>
                )}
              </div>
            </div>

            {/* skill */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-4">
                Keahlian terkait
              </h2>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Cari atau ketik keahlian
                </label>

                <div className="relative">
                  <input
                    type="text"
                    name="skillName"
                    value={form.skillName}
                    onChange={handleSkillInput}
                    placeholder="Ketik nama keahlian..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent capitalize"
                    autoComplete="off"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && form.skillName.trim()) {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    disabled={!form.skillName.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Tambah
                  </button>

                  {/* suggestions */}
                  {showSkiSuggestions && skills.length > 0 && (
                    <ul className="absolute z-50 bg-white border border-gray-200 rounded-lg mt-1 w-full max-h-44 overflow-y-auto shadow-lg">
                      {skills.map((d) => {
                        const id = d.id ?? "";
                        const name = d.name ?? "";
                        return (
                          <li
                            key={id || name}
                            onClick={() => handleSelectSkiSuggestion(d)}
                            className="px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex justify-between items-center">
                              <div className="font-medium capitalize">
                                {name}
                              </div>
                              <span className="text-xs bg-violet-100 text-violet-800 px-2 py-1 rounded-full">
                                Pilih
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>

              {/* Selected skills as pills */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Keahlian dipilih ({selectedSkills.length})
                </div>
                {selectedSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg min-h-[3rem]">
                    {selectedSkills.map((d, i) => (
                      <div
                        key={`${d.id || d.name}-${i}`}
                        className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 rounded-full px-3 py-1.5 text-sm"
                      >
                        <span className="capitalize">{d.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(i)}
                          className="h-4 w-4 rounded-full hover:bg-emerald-200 flex items-center justify-center"
                          aria-label={`Hapus ${d.name}`}
                        >
                          <i className="fas fa-times text-xs"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic p-3 border border-gray-200 rounded-lg bg-gray-50">
                    Belum ada keahlian dipilih
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex-1">
            <p className="text-gray-700">
              <strong className="font-semibold">NOTE:</strong> Pastikan semua
              data bersifat fakta dan sesuai keadaan. Lowongan anda akan
              terlihat secara publik ketika Open di platform Inklusi Kerja.
            </p>
          </div>
          <button
            onClick={handlePostJob}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Mengirim...
              </>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane"></i>
                Posting Lowongan
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default PostJobPage;
