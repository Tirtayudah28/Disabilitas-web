import axios from "axios";
import React, { useEffect, useState } from "react";
import defaultCm from "../../assets/default-company.png";
import { enqueueSnackbar } from "notistack";

const AddUserEduPopup = ({ isVisible, onClose, onCreate }) => {
  const [form, setForm] = useState({
    institutionId: "",
    institutionName: "",
    fieldOfStudy: "",
    degree: "",
    score: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [blockDisApi, setBlockDisApi] = useState(false);

  //fetch companies search-based
  const fetchCompanies = async (q) => {
    try {
      if (!q || q.trim() === "") {
        setCompanies([]);
        return;
      }

      const res = await axios.get(
        `/api/companies?search=${encodeURIComponent(q)}&mustSearch=true`
      );
      const data = res.data.data;
      setCompanies(Array.isArray(data) ? data : []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setCompanies([]);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    if (blockDisApi) return;
    const delay = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(delay);
  }, [search]);
  useEffect(() => {
    fetchCompanies(debouncedSearch);
  }, [debouncedSearch]);

  //lock body scroll
  useEffect(() => {
    if (isVisible) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  //state cleaning
  useEffect(() => {
    if (!isVisible) {
      setForm({
        institutionId: "",
        institutionName: "",
        fieldOfStudy: "",
        degree: "",
        score: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      setSearch("");
      setDebouncedSearch("");
      setBlockDisApi(false);
      setCompanies([]);
      setShowSuggestions(false);
    }
  }, [isVisible]);

  const handleCreate = () => {
    if (
      (!form.institutionId && !form.institutionName) ||
      !form.fieldOfStudy ||
      !form.degree ||
      !form.startDate
    ) {
      return enqueueSnackbar("Field yang dibutuhkan masih belum lengkap", {
        variant: "warning",
      });
    }
    onCreate(form);
    onClose();

    setForm({
      institutionId: "",
      institutionName: "",
      fieldOfStudy: "",
      degree: "",
      score: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setSearch("");
    setDebouncedSearch("");
    setBlockDisApi(false);
    setCompanies([]);
    setShowSuggestions(false);
  };

  //suggestion selected
  const handleSelectSuggestion = (d) => {
    const id = d.id ?? null;
    const name = d.companyName ?? "";

    setForm((prev) => ({
      ...prev,
      institutionId: id ?? "",
      institutionName: name,
    }));

    setBlockDisApi(true);
    setSearch(name);
    setShowSuggestions(false);
    setCompanies([]);
  };

  const handleCompanyInput = (e) => {
    const v = e.target.value;
    setBlockDisApi(false);
    setForm((prev) => ({
      ...prev,
      institutionId: "",
      institutionName: v,
    }));
    setSearch(v);
  };

  const handleDescriptionChange = (e) => {
    setForm((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-50 border border-gray-300 rounded shadow-lg flex flex-col w-[90%] max-w-[720px] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between px-4 py-3 border-b border-gray-300 bg-gray-50">
          <h1 className="font-semibold text-lg">Tambah Pendidikan</h1>
          <button onClick={onClose} title="Close">
            <i className="fa-solid fa-x text-gray-700"></i>
          </button>
        </div>

        {/* BODY */}
        <div className="px-7 py-5 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* 1) Company autocomplete */}
          <div className="relative">
            <label className="text-sm text-gray-800">Institusi</label>
            <input
              type="text"
              name="institutionName"
              value={form.institutionName}
              onChange={handleCompanyInput}
              placeholder="Cari atau ketik nama institusi..."
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-blue-500"
              autoComplete="off"
              onFocus={() => {
                if (companies.length > 0) setShowSuggestions(true);
              }}
            />

            {/* suggestions */}
            {showSuggestions && companies.length > 0 && (
              <ul className="absolute z-50 bg-white border border-gray-200 rounded mt-1 w-full max-h-44 overflow-y-auto shadow-lg">
                {companies.map((d) => {
                  const id = d.id ?? "";
                  const name = d.companyName ?? "";
                  const username = d.User.username ?? "";
                  const profilePicture = d.User.profilePicture ?? defaultCm;
                  return (
                    <li
                      key={id || name}
                      onClick={() => handleSelectSuggestion(d)}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={profilePicture}
                          alt="pfp"
                          className="h-16 w-16 aspect-square object-cover"
                        />
                        <div>
                          <div className="font-medium">{name}</div>
                          <div className="text-xs text-blue-800">
                            @{username}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">Pilih</div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* 2) fieldOfStudy */}
          <div>
            <label className="text-sm text-gray-600">Bidang Studi</label>
            <input
              type="text"
              name="fieldOfStudy"
              value={form.fieldOfStudy}
              onChange={handleChange}
              placeholder="mis: Economy"
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-blue-500"
            />
          </div>

          {/* 3) degree */}
          <div>
            <label className="text-sm text-gray-600">Gelar</label>
            <input
              type="text"
              name="degree"
              value={form.degree}
              onChange={handleChange}
              placeholder="mis: Bachelor"
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-blue-500"
            />
          </div>

          {/* 4) score */}
          <div>
            <label className="text-sm text-gray-600">Nilai</label>
            <input
              type="number"
              name="score"
              value={form.score}
              onChange={handleChange}
              min={0}
              max={100}
              step="0.01"
              onInput={(e) => {
                const v = e.target.value;
                if (v.includes(".")) {
                  const [int, dec] = v.split(".");
                  if (dec.length > 2) {
                    e.target.value = int + "." + dec.slice(0, 2);
                  }
                }
              }}
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-blue-500"
            />
          </div>

          {/* 5) startDate */}
          <div>
            <label className="text-sm text-gray-600">Tanggal Mulai</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-blue-500"
            />
          </div>

          {/* 6) endDate */}
          <div>
            <label className="text-sm text-gray-600">Tanggal Berakhir</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-blue-500"
            />
            <p className="text-xs text-gray-600 mt-1">
              Kosongkan jika ini adalah pendidikan anda sekarang.
            </p>
          </div>

          {/* 7) description */}
          <div>
            <label className="text-sm text-gray-800">
              Ceritakan diri anda (opsional)
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleDescriptionChange}
              rows={3}
              maxLength={300}
              placeholder="Tambahkan keterangan (maks 300 karakter)"
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 resize-none focus:outline-blue-500"
            />
            <div className="text-xs text-gray-600 mt-1 text-right">
              {form.description.length}/300
            </div>
          </div>
        </div>

        {/* CREATE BUTTON */}
        <div className="flex w-full justify-end px-4 py-3 border-t border-gray-300 bg-white">
          <button
            onClick={handleCreate}
            className="bg-blue-700 text-white rounded hover:bg-blue-800 transition px-4 py-1"
          >
            Tambahkan
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserEduPopup;
