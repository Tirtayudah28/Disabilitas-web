import React, { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";

const ActionStatusAppPopup = ({
  isVisible,
  onClose,
  onUpdate,
  applicationDetail,
}) => {
  const [form, setForm] = useState({
    status: "",
    companyMessage: "",
    companyExternalLink: "",
  });

  // lock body scroll
  useEffect(() => {
    if (isVisible) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  // reset saat popup ditutup
  useEffect(() => {
    if (!isVisible) {
      setForm({
        companyMessage: "",
        companyExternalLink: "",
        status: "",
      });
    }
  }, [isVisible, applicationDetail]);

  const options = [
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
  ];

  const handleUpdate = () => {
    onUpdate(form, applicationDetail);
    onClose();

    setForm({
      companyMessage: "",
      companyExternalLink: "",
      status: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
  };

  if (!isVisible) return null;

  const explanationMap = {
    accepted:
      "Pelamar akan menerima pemberitahuan bahwa lamarannya diterima.",
    rejected:
      "Pelamar akan menerima pemberitahuan penolakan.",
  };

  const selectedExplanation = form.status
    ? explanationMap[form.status] || ""
    : "";

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-50 border border-gray-300 rounded shadow-lg flex flex-col w-[90%] max-w-[720px] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="action-status-title"
      >
        {/* HEADER */}
        <div className="flex justify-between px-4 py-3 border-b border-gray-300 bg-gray-50">
          <h1 id="action-status-title" className="font-semibold capitalize">
            Action Status: {applicationDetail?.status || "-"}
          </h1>
          <button onClick={onClose} title="Close">
            <i className="fa-solid fa-x text-gray-700"></i>
          </button>
        </div>

        {/* BODY */}
        <div className="px-7 py-5 space-y-6 overflow-y-auto max-h-[60vh] min-h-[50vh]">
          <div className="mt-4 bg-blue-50 border border-blue-100 p-3 rounded">
            <h2 className="text-blue-500">
              <i class="fa-solid fa-circle-info mr-2"></i> Action Status
            </h2>
            <p className="text-sm text-gray-800 mt-1">
              Sebagai perusahaan, Anda dapat menerima/menolak lamaran dari
              pelamar, pilihan anda akan diberitahukan kepada pelamar.
            </p>
            <table className="text-sm text-gray-800 mt-3">
              <tbody>
                <tr>
                  <td>Pelamar</td>
                  <td className="px-2 py-1">:</td>
                  <td>
                    {applicationDetail?.User?.UserProfile?.fullName}{" "}
                    <span className="text-xs">
                      @{applicationDetail?.User?.username}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Perusahaan</td>
                  <td className="px-2 py-1">:</td>
                  <td>{applicationDetail?.Job?.Company?.companyName} </td>
                </tr>
                <tr>
                  <td>Pekerjaan</td>
                  <td className="px-2 py-1">:</td>
                  <td>{applicationDetail?.Job?.title || "-"}</td>
                </tr>
              </tbody>
            </table>
            <p className="text-sm text-gray-800 mt-3"></p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-800 text-center font-medium">Your Choice</label>
            {options.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {options.map((opt) => {
                  const isActive = form.status === opt.value;

                  return (
                    <label
                      key={opt.value}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition
            ${
              isActive
                ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                : "border-gray-300 hover:border-blue-400"
            }
          `}
                    >
                      {/* hidden radio */}
                      <input
                        type="radio"
                        name="status"
                        value={opt.value}
                        checked={isActive}
                        onChange={() =>
                          setForm((prev) => ({ ...prev, status: opt.value }))
                        }
                        className="sr-only"
                      />

                      {/* label text */}
                      <span className="text-sm font-medium text-gray-800">
                        {opt.label}
                      </span>

                      {/* custom indicator */}
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center
              ${isActive ? "border-blue-600 bg-blue-600" : "border-gray-400"}
            `}
                      >
                        {isActive && (
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-600">Tidak ada aksi tersedia.</p>
            )}
          </div>

          {selectedExplanation && (
            <div className="mt-4 bg-blue-50 border border-blue-100 p-3 rounded">
              <p className="text-sm text-gray-800">{selectedExplanation}</p>
            </div>
          )}

          {/* 1) message */}
          <div>
            <label className="text-sm text-gray-800">Pesan untuk pelamar</label>
            <textarea
              name="companyMessage"
              value={form.companyMessage}
              onChange={handleChange}
              rows={5}
              maxLength={1000}
              placeholder="Tambahkan pesan (maks 1000 karakter)"
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 resize-none focus:outline-blue-500"
            />
            <div className="text-xs text-gray-600 mt-1 text-right">
              {form.companyMessage.length}/1000
            </div>
          </div>

          {/* 2) external link */}
          <div>
            <label className="text-sm text-gray-800">
              Tautkan link eksternal
            </label>
            <input
              type="text"
              name="companyExternalLink"
              value={form.companyExternalLink}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-blue-500"
            />
            <div className="text-xs text-gray-600 mt-1 text-right">
              Tautkan informasi lanjutan yang dapat diakses online (opsional)
            </div>
          </div>
        </div>

        {/* CREATE BUTTON */}
        <div className="flex w-full justify-end px-4 py-3 border-t border-gray-300 bg-white">
          <button
            onClick={handleUpdate}
            className={`bg-blue-700 text-white rounded hover:bg-blue-800 transition px-4 py-1`}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionStatusAppPopup;
