import axios from "axios";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

const AddJobDisPopup = ({ isVisible, onClose, onCreate }) => {
  const [form, setForm] = useState({
    disabilityId: "",
    disabilityName: "",
    type: "",
  });

  const [disabilities, setDisabilities] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [blockDisApi, setBlockDisApi] = useState(false);

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
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching disabilities:", error);
      setDisabilities([]);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    if (blockDisApi) return;
    const delay = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(delay);
  }, [search]);
  useEffect(() => {
    fetchDisabilities(debouncedSearch);
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
        disabilityId: "",
        disabilityName: "",
        type: "",
      });
      setSearch("");
      setDebouncedSearch("");
      setBlockDisApi(false);
      setDisabilities([]);
      setShowSuggestions(false);
    }
  }, [isVisible]);

  const handleCreate = () => {
    if ((!form.disabilityId && !form.disabilityName) || !form.type) {
      return enqueueSnackbar("Field yang dibutuhkan masih belum lengkap", {
        variant: "warning",
      });
    }
    onCreate(form);
    onClose();

    setForm({
      disabilityId: "",
      disabilityName: "",
      type: "",
    });
    setSearch("");
    setDebouncedSearch("");
    setBlockDisApi(false);
    setDisabilities([]);
    setShowSuggestions(false);
  };

  //suggestion selected
  const handleSelectSuggestion = (d) => {
    const id = d.id ?? null;
    const name = d.name ?? "";
    const type = d.type ?? "";

    setForm({
      disabilityId: id ?? "",
      disabilityName: name,
      type: type ?? "",
    });

    setBlockDisApi(true);
    setSearch(name);
    setShowSuggestions(false);
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
    setSearch(v);
  };

  const handleTypeChange = (e) => {
    setForm((prev) => ({ ...prev, type: e.target.value }));
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
          <h1 className="font-semibold text-lg">Tambah Disabilitas</h1>
          <button onClick={onClose} title="Close">
            <i className="fa-solid fa-x text-gray-700"></i>
          </button>
        </div>

        {/* BODY */}
        <div className="px-7 py-5 space-y-6 overflow-y-auto max-h-[60vh] min-h-[50vh]">
          {/* 1) Disability autocomplete */}
          <div className="relative">
            <label className="text-sm text-gray-800">Disabilitas</label>
            <input
              type="text"
              name="disabilityName"
              value={form.disabilityName}
              onChange={handleDisabilityInput}
              placeholder="Cari atau ketik nama disabilitas..."
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-blue-500 capitalize"
              autoComplete="off"
              onFocus={() => {
                if (disabilities.length > 0) setShowSuggestions(true);
              }}
            />

            {/* suggestions */}
            {showSuggestions && disabilities.length > 0 && (
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

          {/* 2) Type select */}
          <div>
            <label className="text-sm text-gray-800">Tipe</label>
            <select
              name="type"
              value={form.type}
              onChange={handleTypeChange}
              disabled={
                !form.disabilityName || // disable jika field pertama kosong
                Boolean(form.disabilityId) // disable jika disabilityId terisi (dipilih dari suggestion)
              }
              className={`w-full mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-blue-500 ${
                !form.disabilityName || form.disabilityId
                  ? "bg-gray-100 cursor-not-allowed"
                  : ""
              }`}
            >
              <option value="">Pilih tipe</option>
              <option value="sensory">Sensory</option>
              <option value="intellectual">Intellectual</option>
              <option value="mental">Mental</option>
              <option value="physical">Physical</option>
              <option value="multiple">Multiple</option>
              <option value="other">Other</option>
            </select>
            <p className="text-xs text-gray-600 mt-1">
              Tipe otomatis terisi jika memilih dari daftar.
            </p>
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

export default AddJobDisPopup;
