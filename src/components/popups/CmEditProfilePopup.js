import axios from "axios";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

const CmEditProfilePopup = ({
  isVisible,
  onClose,
  onEdit,
  profileData,
  countries,
}) => {
  const [form, setForm] = useState({
    industryId: "",
    industryName: "",
    companyName: "",
    companyDescription: "",
    country: "",
    city: "",
    address: "",
    establishedYear: "",
    websiteLink: "",
  });

  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [industries, setIndustries] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showIndSuggestions, setShowIndSuggestions] = useState(false);
  const [blockDisApi, setBlockDisApi] = useState(false);

  const handleEdit = () => {
    if (
      (!form.industryId && !form.industryName) ||
      !form.companyName ||
      !form.country ||
      !form.city
    ) {
      return enqueueSnackbar("Field yang dibutuhkan masih belum lengkap", {
        variant: "warning",
      });
    }
    if (form.companyDescription && form.companyDescription.length > 1000) {
      return enqueueSnackbar("Deskripsi terlalu panjang (max 1000 karakter)", {
        variant: "warning",
      });
    }
    if (form.companyDescription && form.companyDescription.length < 3) {
      return enqueueSnackbar("Deskripsi terlalu pendek (min 3 karakter)", {
        variant: "warning",
      });
    }
    if (form.address && form.address.length > 100) {
      return enqueueSnackbar("Alamat terlalu panjang (max 100 karakter)", {
        variant: "warning",
      });
    }
    if (form.address && form.address.length < 3) {
      return enqueueSnackbar("Alamat terlalu pendek (min 3 karakter)", {
        variant: "warning",
      });
    }

    console.log(form)

    onEdit(form);
    onClose();
  };

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
  const selectCountry = (countryName) => {
    setForm({ ...form, country: countryName });
    setFilteredCountries([]);
    setShowSuggestions(false);
  };

  //input industry
  const handleIndustryInput = (e) => {
    const v = e.target.value;
    setBlockDisApi(false);
    setForm((prev) => ({
      ...prev,
      industryId: "",
      industryName: v,
    }));
    setSearch(v);
  };

  //fetch industries search-based
  const fetchIndustries = async (q) => {
    try {
      if (!q || q.trim() === "") {
        setIndustries([]);
        return;
      }

      const res = await axios.get(
        `/api/data/industries?search=${encodeURIComponent(q)}`
      );
      const data = res.data.data;
      setIndustries(Array.isArray(data) ? data : []);
      setShowIndSuggestions(true);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setIndustries([]);
      setShowIndSuggestions(false);
    }
  };
  useEffect(() => {
    if (blockDisApi) return;
    const delay = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(delay);
  }, [search]);
  useEffect(() => {
    fetchIndustries(debouncedSearch);
  }, [debouncedSearch]);

  //industry suggestion
  const handleSelectSuggestion = (d) => {
    const id = d.id ?? null;
    const name = d.name ?? "";

    setForm((prev) => ({
      ...prev,
      industryId: id,
      industryName: name,
    }));

    setBlockDisApi(true);
    setSearch(name);
    setShowIndSuggestions(false);
    setIndustries([]);
  };

  //form initial
  useEffect(() => {
    if (!profileData) return;
    setForm({
      industryId: profileData?.Company?.industryId|| "",
      industryName: profileData?.Company?.Industry?.name || "",
      companyName: profileData?.Company?.companyName || "",
      companyDescription: profileData?.Company?.companyDescription || "",
      country: profileData?.Company?.country || "",
      city: profileData?.Company?.city || "",
      address: profileData?.Company?.address || "",
      establishedYear: profileData?.Company?.establishedYear || "",
      websiteLink: profileData?.Company?.websiteLink || "",
    });
  }, [profileData]);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

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
          <h1 className="font-semibold text-lg">Edit Profil</h1>
          <button onClick={onClose} title="Close">
            <i className="fa-solid fa-x text-gray-700"></i>
          </button>
        </div>

        {/* FORM AREA (scrollable) */}
        <div className="px-7 py-5 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Company Name */}
          <div>
            <label className="text-sm text-gray-600">Nama Perusahaan</label>
            <input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-blue-500"
            />
          </div>

          {/* Industry */}
          <div className="relative">
            <label className="text-sm text-gray-800">Industri</label>
            <input
              type="text"
              name="industryName"
              value={form.industryName}
              onChange={handleIndustryInput}
              placeholder="Cari atau ketik nama industri..."
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-blue-500 capitalize"
              autoComplete="off"
              onFocus={() => {
                if (industries.length > 0) setShowIndSuggestions(true);
              }}
            />

            {/* suggestions */}
            {showIndSuggestions && industries.length > 0 && (
              <ul className="absolute z-50 bg-white border border-gray-200 rounded mt-1 w-full max-h-44 overflow-y-auto shadow-lg">
                {industries.map((d) => {
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

          {/* Description */}
          <div>
            <label className="text-sm text-gray-600">Description</label>
            <textarea
              name="companyDescription"
              maxLength={1000}
              value={form.companyDescription}
              onChange={handleChange}
              rows="5"
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 resize-none focus:outline-blue-500"
            ></textarea>
            <div className="text-xs text-gray-600 mt-1 text-right">
              {form.companyDescription.length}/1000
            </div>
          </div>

          {/* Country */}
          <div className="country-wrapper relative">
            <label className="text-sm text-gray-600">Negara</label>
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-blue-500 capitalize"
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

            {/* SUGGESTIONS */}
            {showSuggestions && filteredCountries.length > 0 && (
              <ul className="absolute z-50 bg-white border border-gray-300 rounded mt-1 w-full max-h-48 overflow-y-auto shadow-lg">
                {filteredCountries.map((country, idx) => (
                  <li
                    key={idx}
                    onClick={() => selectCountry(country)}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-200 capitalize"
                  >
                    {country}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* City */}
          <div>
            <label className="text-sm text-gray-600">Kota</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-blue-500 capitalize"
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-sm text-gray-600">Alamat</label>
            <textarea
              name="address"
              maxLength={100}
              value={form.address}
              onChange={handleChange}
              rows="2"
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 resize-none focus:outline-blue-500"
            ></textarea>
            <div className="text-xs te0xt-gray-600 mt-1 text-right">
              {form.address.length}/100
            </div>
          </div>

          {/* Established Year */}
          <div>
            <label className="text-sm text-gray-600">Tahun Berdiri</label>
            <input
              type="number"
              name="establishedYear"
              value={form.establishedYear}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-blue-500"
            />
          </div>

          {/* Website Link */}
          <div>
            <label className="text-sm text-gray-600">Official Website</label>
            <input
              type="text"
              name="websiteLink"
              value={form.websiteLink}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-blue-500"
            />
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex w-full justify-end px-4 py-3 border-t border-gray-300 bg-white">
          <button
            onClick={handleEdit}
            className="bg-blue-700 text-white rounded hover:bg-blue-800 transition px-4 py-1"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default CmEditProfilePopup;
