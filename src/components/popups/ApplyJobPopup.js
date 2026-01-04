import axios from "axios";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const ApplyJobPopup = ({ isVisible, onClose, onCreate, jobDetail, userData }) => {
  const {userData: loginUser} = useAuth()
  const [form, setForm] = useState({
    message: "",
    email: "",
    portofolioLink: "",
  });

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
        message: "",
        portofolioLink: "",
        email: loginUser?.email ?? ""
      });
    }
  }, [isVisible]);

  const handleCreate = () => {
    onCreate(form);
    onClose();

    setForm({
      message: "",
      portofolioLink: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed ani-appear inset-0 bg-black/60 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="relative  bg-gray-50 border border-gray-300 rounded shadow-lg flex flex-col w-[90%] max-w-[720px] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between px-4 py-3 border-b border-gray-300 bg-gray-50">
          <h1 className="font-semibold text-lg">Lamar Pekerjaan</h1>
          <button onClick={onClose} title="Close">
            <i className="fa-solid fa-x text-gray-700"></i>
          </button>
        </div>

        {/* BODY */}
        <div className="px-7 py-5 space-y-6 overflow-y-auto max-h-[70vh] min-h-[50vh]">
          <div className="mt-4 bg-blue-50 border border-blue-100 p-3 rounded">
            <h2 className="text-blue-500">
              <i class="fa-solid fa-circle-info mr-2"></i> Lamar Pekerjaan
            </h2>
            <p className="text-sm text-gray-800 mt-1">
              Data mengenai pelamar akan dilihat oleh perusahaan melalui profil
              anda di InklusiKerja, pastikan profil anda lengkap untuk
              meningkatkan peluang diterima kerja.
            </p>
            <table className="text-sm text-gray-800 mt-3">
              <tbody>
                <tr>
                  <td>Pelamar</td>
                  <td className="px-2 py-1">:</td>
                  <td>
                    {userData?.UserProfile?.fullName}{" "}
                    <span className="text-xs">@{userData?.username}</span>
                  </td>
                </tr>
                <tr>
                  <td>Perusahaan</td>
                  <td className="px-2 py-1">:</td>
                  <td>
                    {jobDetail?.Company?.companyName}{" "}
                    <span className="text-xs">
                      @{jobDetail?.Company?.User?.username}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Pekerjaan</td>
                  <td className="px-2 py-1">:</td>
                  <td>{jobDetail?.title || "-"}</td>
                </tr>
              </tbody>
            </table>
            <p className="text-sm text-gray-800 mt-3"></p>
          </div>

          {/* 1) email */}
          <div>
            <label className="text-sm text-gray-800">Email Anda</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-blue-500"
            />
          </div>

          {/* 2) message */}
          <div>
            <label className="text-sm text-gray-800">
              Pesan untuk perusahaan (opsional)
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              maxLength={1000}
              placeholder="Tambahkan pesan (maks 1000 karakter)"
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 resize-none focus:outline-blue-500"
            />
            <div className="text-xs text-gray-600 mt-1 text-right">
              {form.message.length}/1000
            </div>
          </div>

          {/* 3) external link */}
          <div>
            <label className="text-sm text-gray-800">
              Tautkan link eksternal
            </label>
            <input
              type="text"
              name="portofolioLink"
              value={form.portofolioLink}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-blue-500"
            />
            <div className="text-xs text-gray-600 mt-1 text-right">
              Tautkan media sosial / portofolio / dll yang dapat diakses online
            </div>
          </div>
        </div>

        {/* CREATE BUTTON */}
        <div className="flex w-full justify-end px-4 py-3 border-t border-gray-300 bg-white">
          <button
            onClick={handleCreate}
            className="bg-blue-700 text-white rounded hover:bg-blue-800 transition px-4 py-1"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyJobPopup;
