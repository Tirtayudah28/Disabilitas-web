import React, { useEffect, useState } from "react";

const EditJobPopup = ({ isVisible, onClose, onEdit, jobDetail }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    employmentType: "",
    locationType: "",
    address: "",
    minSalary: "",
    maxSalary: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
  };

  const handleEdit = () => {
    onEdit(form);
    onClose();
  };

  useEffect(() => {
    if (!jobDetail) return;
    setForm({
      title: jobDetail?.title || "",
      description: jobDetail?.description || "",
      employmentType: jobDetail?.employmentType || "",
      locationType: jobDetail?.locationType || "",
      address: jobDetail?.address || "",
      minSalary: jobDetail?.minSalary || "",
      maxSalary: jobDetail?.maxSalary || "",
    });
  }, [jobDetail]);

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
          <h1 className="font-semibold text-lg">Edit Lowongan</h1>
          <button onClick={onClose} title="Close">
            <i className="fa-solid fa-x text-gray-700"></i>
          </button>
        </div>

        {/* FORM AREA (scrollable) */}
        <div className="px-7 py-5 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Title */}
          <div>
            <label className="text-sm text-gray-600">Posisi / Jabatan</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-blue-500"
            />
          </div>
          {/* Description */}
          <div>
            <label className="text-sm text-gray-800">Deskripsi Pekerjaan</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={10}
              maxLength={2000}
              placeholder="Tambahkan keterangan (maks 2000 karakter)"
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 resize-none focus:outline-blue-500"
            />
            <div className="text-xs text-gray-600 mt-1 text-right">
              {form.description.length}/2000
            </div>
          </div>
          {/* Employment Type */}
          <div>
            <label className="text-sm text-gray-600">Jenis Pekerjaan</label>
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
          {/* Location type */}
          <div>
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
          {/* Address */}
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

          {/* min salary */}
          <div>
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

          {/* max salary */}
          <div>
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

export default EditJobPopup;
