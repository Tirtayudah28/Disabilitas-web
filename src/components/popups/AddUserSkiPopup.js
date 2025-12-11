import axios from "axios";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

const AddUserSkiPopup = ({ isVisible, onClose, onCreate }) => {
  const [form, setForm] = useState({
    skillId: "",
    skillName: "",
    description: "",
  });

  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [blockDisApi, setBlockDisApi] = useState(false);

  //fetch disabilities search-based
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
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching skills:", error);
      setSkills([]);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    if (blockDisApi) return;
    const delay = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(delay);
  }, [search]);
  useEffect(() => {
    fetchSkills(debouncedSearch);
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
        skillId: "",
        skillName: "",
        description: "",
      });
      setSearch("");
      setDebouncedSearch("");
      setBlockDisApi(false);
      setSkills([]);
      setShowSuggestions(false);
    }
  }, [isVisible]);

  const handleCreate = () => {
    if (!form.skillId && !form.skillName) {
      return enqueueSnackbar("Field yang dibutuhkan masih belum lengkap", {
        variant: "warning",
      });
    }
    if (form.description && form.description.length > 300) {
      return enqueueSnackbar("Deskripsi terlalu panjang (max 300 karakter)", {
        variant: "warning",
      });
    }
    if (form.description && form.description.length < 3) {
      return enqueueSnackbar("Deskripsi terlalu pendek (min 3 karakter)", {
        variant: "warning",
      });
    }
    onCreate(form);
    onClose();

    setForm({
      skillId: "",
      skillName: "",
      description: "",
    });
    setSearch("");
    setDebouncedSearch("");
    setBlockDisApi(false);
    setSkills([]);
    setShowSuggestions(false);
  };

  //suggestion selected
  const handleSelectSuggestion = (d) => {
    const id = d.id ?? null;
    const name = d.name ?? "";

    setForm({
      skillId: id ?? "",
      skillName: name,
      description: form.description,
    });

    setBlockDisApi(true);
    setSearch(name);
    setShowSuggestions(false);
    setSkills([]);
  };

  const handleSkillInput = (e) => {
    const v = e.target.value;
    setBlockDisApi(false);
    setForm((prev) => ({
      ...prev,
      skillId: "",
      skillName: v,
    }));
    setSearch(v);
  };

  const handleDescriptionChange = (e) => {
    setForm((prev) => ({ ...prev, description: e.target.value }));
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
          <h1 className="font-semibold text-lg">Tambah Keahlian</h1>
          <button onClick={onClose} title="Close">
            <i className="fa-solid fa-x text-gray-700"></i>
          </button>
        </div>

        {/* BODY */}
        <div className="px-7 py-5 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* 1) Skill autocomplete */}
          <div className="relative">
            <label className="text-sm text-gray-800">Keahlian anda</label>
            <input
              type="text"
              name="skillName"
              value={form.skillName}
              onChange={handleSkillInput}
              placeholder="Cari atau ketik nama keahlian..."
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-blue-500 capitalize"
              autoComplete="off"
              onFocus={() => {
                if (skills.length > 0) setShowSuggestions(true);
              }}
            />

            {/* suggestions */}
            {showSuggestions && skills.length > 0 && (
              <ul className="absolute z-50 bg-white border border-gray-200 rounded mt-1 w-full max-h-44 overflow-y-auto shadow-lg">
                {skills.map((d) => {
                  const id = d.id ?? "";
                  const name = d.name ?? "";
                  return (
                    <li
                      key={id || name}
                      onClick={() => handleSelectSuggestion(d)}
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

          {/* 2) Description */}
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
              placeholder="Tambahkan keterangan (maks 100 karakter)"
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

export default AddUserSkiPopup;
