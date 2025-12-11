import React, { useEffect, useState } from "react";

const EditProfilePopup = ({
  isVisible,
  onClose,
  onEdit,
  profileData,
  countries,
}) => {
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    bio: "",
    country: "",
    city: "",
    address: "",
    gender: "",
    dateOfBirth: "",
  });

  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const handleEdit = () => {
    onEdit(form);
    onClose();
  };

  useEffect(() => {
    if (!profileData) return;
    setForm({
      fullName: profileData?.profile?.fullName || "",
      phoneNumber: profileData?.profile?.phoneNumber || "",
      bio: profileData?.profile?.bio || "",
      country: profileData?.profile?.country || "",
      city: profileData?.profile?.city || "",
      address: profileData?.profile?.address || "",
      gender: profileData?.profile?.gender || "",
      dateOfBirth: profileData?.profile?.dateOfBirth || "",
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
          {/* Full Name */}
          <div>
            <label className="text-sm text-gray-600">Nama Lengkap</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-600">Nomor HP</label>
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-blue-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm text-gray-600">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows="5"
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 resize-none focus:outline-blue-500"
            ></textarea>
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
              value={form.address}
              onChange={handleChange}
              rows="2"
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 resize-none focus:outline-blue-500"
            ></textarea>
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm text-gray-600">Jenis Kelamin</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="blank">Privat</option>
            </select>
          </div>

          {/* Birthdate */}
          <div>
            <label className="text-sm text-gray-600">Tanggal Lahir</label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
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

export default EditProfilePopup;
