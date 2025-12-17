import axios from "axios";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const PostJobPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    employmentType: "full-time",
    locationType: "on-site",
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
  };
  const handleDescriptionChange = (e) => {
    const v = e.target.value.slice(0, 2000);
    setForm((prev) => ({ ...prev, description: v }));
  };

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

    setForm((prev) => ({
      ...prev,
      disabilityId: id ?? "",
      disabilityName: name,
      type: type ?? "",
    }));

    setBlockDisApi(true);
    setDisSearch(name);
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
  //add disability
  const handleAddDisability = () => {
    const name = (form.disabilityName || "").trim();
    if (!name) return;

    const id = form.disabilityId ?? "";
    const type = form.type ?? "";

    if (!id) {
      if (!type || !DISABILITY_TYPES.includes(type)) {
        return enqueueSnackbar(
          "Tipe disabilitas tidak dapat kosong",
          { variant: "warning" }
        );
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

    setForm((prev) => ({
      ...prev,
      skillId: id ?? "",
      skillName: name,
    }));

    setBlockSkiApi(true);
    setSkiSearch(name);
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
  //add skill
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
      navigate('/employer/jobs')
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
      <div className="space-y-4">
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

        <div
          className="grid grid-cols-5 gap-4"
          style={{ gridAutoRows: "minmax(0, 1fr)" }}
        >
          {/* informasi umum */}
          <div className="bg-white rounded-md shadow-lg py-6 px-4 col-span-3 row-span-2 flex flex-col">
            <h2 className="font-semibold text-gray-900 text-lg">
              Informasi Umum
            </h2>
            <div className="space-y-5 mt-6">
              {/* 1) title */}
              <div>
                <label className="text-sm text-gray-600">
                  Posisi / Jabatan
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="mis: Accountant"
                  className="w-full mt-1 border border-gray-400 rounded px-3 py-2 focus:outline-blue-500"
                />
              </div>
              {/* 2) description */}
              <div>
                <label className="text-sm text-gray-600">
                  Deskripsi Pekerjaan
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleDescriptionChange}
                  rows={10}
                  maxLength={2000}
                  placeholder="Tambahkan keterangan (maks 2000 karakter)"
                  className="w-full mt-1 border border-gray-400 rounded px-3 py-2 resize-none focus:outline-blue-500"
                />
                <div className="text-xs text-gray-600 mt-1 text-right">
                  {form.description.length}/2000
                </div>
              </div>
              {/* 3) employment / location type */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm text-gray-600">
                    Jenis Pekerjaan
                  </label>
                  <select
                    name="employmentType"
                    value={form.employmentType}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-400 rounded px-3 py-2 focus:outline-blue-500"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="internship">Internship</option>
                    <option value="blank">Tidak ingin mengisi</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600">Jenis Lokasi</label>
                  <select
                    name="locationType"
                    value={form.locationType}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-400 rounded px-3 py-2 focus:outline-blue-500"
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
                <label className="text-sm text-gray-600">
                  Alamat / Lokasi Pekerjaan (optional)
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                  maxLength={100}
                  placeholder="Alamat (maks 100 karakter)"
                  className="w-full mt-1 border border-gray-400 rounded px-3 py-2 resize-none focus:outline-blue-500"
                />
                <div className="text-xs text-gray-600 mt-1 text-right">
                  {form.address.length}/100
                </div>
              </div>

              {/* 5) salary */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm text-gray-600">
                    Minimum Gaji (optional)
                  </label>
                  <input
                    type="number"
                    name="minSalary"
                    value={form.minSalary}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-400 rounded px-3 py-2 focus:outline-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600">
                    Maksimum Gaji (optional)
                  </label>
                  <input
                    type="number"
                    name="maxSalary"
                    value={form.maxSalary}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-400 rounded px-3 py-2 focus:outline-blue-500"
                  />
                  <div className="text-xs text-gray-600 mt-1 text-right">
                    Kosongkan jika nominal gaji fixed (bukan range)
                  </div>
                </div>
              </div>

              {/* 6) start / end date */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm text-gray-600">
                    Tanggal Lowongan Dibuka
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-400 rounded px-3 py-2 focus:outline-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600">
                    Tanggal Lowongan Ditutup
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-400 rounded px-3 py-2 focus:outline-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* disabilitas */}
          <div className="bg-white rounded-md shadow-lg py-6 px-4 col-span-2 flex flex-col">
            <h2 className="font-semibold text-gray-900 text-lg">Disabilitas terkait</h2>
            <div className="flex flex-col gap-2 mt-6">
              <div className="flex gap-3 items-center">
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="disabilityName"
                    value={form.disabilityName}
                    onChange={handleDisabilityInput}
                    placeholder="Cari atau ketik nama disabilitas..."
                    className="w-full border border-gray-400 rounded px-3 py-2 focus:outline-blue-500 capitalize"
                    autoComplete="off"
                    onFocus={() => {
                      if (disabilities.length > 0) setShowDisSuggestions(true);
                    }}
                  />

                  {/* suggestions */}
                  {showDisSuggestions && disabilities.length > 0 && (
                    <ul className="absolute z-50 bg-white border border-gray-200 rounded mt-1 w-full max-h-44 overflow-y-auto shadow-lg">
                      {disabilities.map((d) => {
                        const id = d.id ?? "";
                        const name = d.name ?? "";
                        const type = d.type ?? "";
                        return (
                          <li
                            key={id || name}
                            onClick={() => handleSelectSuggestion(d)}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center capitalize"
                          >
                            <div>
                              <div className="font-medium">{name}</div>
                              <div className="text-xs text-blue-800 capitalize">
                                {type}
                              </div>
                            </div>
                            <div className="text-xs text-gray-600">Pilih</div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    disabled={!!form.disabilityId}
                    className={`w-full text-sm border border-gray-400 rounded px-3 py-2 focus:outline-blue-500 capitalize ${
                      form.disabilityId ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <option value="">
                      {form.disabilityId ? form.type || "Tipe" : "Pilih Tipe"}
                    </option>
                    {DISABILITY_TYPES.map((t) => (
                      <option key={t} value={t} className="capitalize">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddDisability}
                className="text-sm rounded px-7 py-2 text-center bg-violet-600 hover:bg-violet-700 cursor-pointer text-gray-50"
              >
                Add
              </button>
            </div>

            {selectedDisabilities.length > 0 ? (
              <div className="mt-4 overflow-auto max-h-[15rem]">
                <div className="text-sm text-gray-600 mb-2">
                  Disabilitas yang dipilih:
                </div>
                <div className="flex flex-col gap-2">
                  {selectedDisabilities.map((d, i) => (
                    <div
                      key={`${d.id || d.name}-${i}`}
                      className="flex items-center justify-between border border-gray-200 rounded px-3 py-2"
                    >
                      <div>
                        <div className="font-medium capitalize">{d.name}</div>
                        {d.type && (
                          <div className="text-xs text-gray-500 capitalize">
                            {d.type}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDisability(i)}
                        className="p-1 rounded hover:bg-gray-100"
                        aria-label={`Hapus ${d.name}`}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600 mb-2 mt-4">
                Pilih disabilitas di atas
              </div>
            )}
          </div>

          {/* skill */}
          <div className="bg-white rounded-md shadow-lg py-6 px-4 col-span-2 flex flex-col">
            <h2 className="font-semibold text-gray-900 text-lg">Keahlian terkait</h2>
            <div className="flex gap-3 mt-6 items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  name="skillName"
                  value={form.skillName}
                  onChange={handleSkillInput}
                  placeholder="Cari atau ketik nama keahlian..."
                  className="w-full border border-gray-400 rounded px-3 py-2 focus:outline-blue-500 capitalize"
                  autoComplete="off"
                  onFocus={() => {
                    if (skills.length > 0) setShowSkiSuggestions(true);
                  }}
                />

                {/* suggestions */}
                {showSkiSuggestions && skills.length > 0 && (
                  <ul className="absolute z-50 bg-white border border-gray-200 rounded mt-1 w-full max-h-44 overflow-y-auto shadow-lg">
                    {skills.map((d) => {
                      const id = d.id ?? "";
                      const name = d.name ?? "";
                      return (
                        <li
                          key={id || name}
                          onClick={() => handleSelectSkiSuggestion(d)}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center capitalize"
                        >
                          <div>
                            <div className="font-medium">{name}</div>
                          </div>
                          <div className="text-xs text-gray-600">Pilih</div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <button
                type="button"
                onClick={handleAddSkill}
                className="text-sm rounded px-7 py-2 text-center bg-violet-600 hover:bg-violet-700 cursor-pointer text-gray-50"
              >
                Add
              </button>
            </div>

            {selectedSkills.length > 0 ? (
              <div className="mt-4 overflow-auto max-h-[15rem]">
                <div className="text-sm text-gray-600 mb-2">
                  Keahlian yang dipilih:
                </div>
                <div className="flex flex-col gap-2">
                  {selectedSkills.map((d, i) => (
                    <div
                      key={`${d.id || d.name}-${i}`}
                      className="flex items-center justify-between border border-gray-200 rounded px-3 py-2"
                    >
                      <div>
                        <div className="font-medium capitalize">{d.name}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(i)}
                        className="p-1 rounded hover:bg-gray-100"
                        aria-label={`Hapus ${d.name}`}
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600 mb-2 mt-4">
                Pilih keahlian di atas
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-md shadow-lg py-6 px-4 flex gap-6 justify-evenly items-center">
          <p className="max-w-[40rem] text-gray-800">
            NOTE: Pastikan semua data bersifat fakta dan sesuai keadaan.
            Lowongan anda akan terlihat secara publik ketika Open di platform
            Inklusi Kerja.
          </p>
          <button
            onClick={handlePostJob}
            disabled={loading}
            className="cursor-pointer rounded text-gray-50 px-16 py-2 bg-violet-600 hover:bg-violet-700 transition"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i> Mengirim...
              </>
            ) : (
              <>
                <i className="fa-solid fa-plus"></i> Posting
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default PostJobPage;
