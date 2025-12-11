import React, { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";

const ActionStatusJobPopup = ({ isVisible, onClose, onUpdate, jobDetail }) => {
  const [targetStatus, setTargetStatus] = useState("");
  const [endDate, setEndDate] = useState("");

  // lock body scroll
  useEffect(() => {
    if (isVisible) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  // reset saat popup ditutup / jobDetail berubah
  useEffect(() => {
    if (!isVisible) {
      setTargetStatus("");
      setEndDate("");
    }
  }, [isVisible, jobDetail]);

  const getOptionsForStatus = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "pending") {
      return [
        { value: "open", label: "Open" },
        { value: "cancelled", label: "Cancel" },
      ];
    }
    if (s === "open") {
      return [{ value: "cancelled", label: "Cancel" }];
    }
    if (s === "closed") {
      return [{ value: "open", label: "Re-Open" }];
    }
    // cancelled or unknown -> no options
    return [];
  };

  const options = getOptionsForStatus(jobDetail?.status);

  // helper: format date -> YYYY-MM-DD for input[type=date]
  function formatDateForInput(d) {
    if (!d) return "";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "";
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  const handleUpdate = () => {
    if (!targetStatus) {
      enqueueSnackbar("Pilih status target terlebih dahulu", {
        variant: "info",
      });
      return;
    }

    const isReopen =
      targetStatus === "open" &&
      String(jobDetail?.status || "").toLowerCase() === "closed";
    if (isReopen && !endDate) {
      enqueueSnackbar("Silakan pilih tanggal akhir (end date) untuk re-open", {
        variant: "warning",
      });
      return;
    }

    const payload = { status: targetStatus };
    if (isReopen) payload.endDate = endDate;

    onUpdate(payload);
    onClose();
  };

  if (!isVisible) return null;

  const explanationMap = {
    open: "Status Open akan membuat lowongan Anda dapat dilihat oleh publik di platform InklusiKerja.",
    "re-open":
      "Lowongan Anda akan dibuka lagi dan kembali dipublikasikan di platform InklusiKerja.",
    cancelled:
      "Status Cancel akan membuat lowongan Anda menjadi dibatalkan dan tidak dapat dikembalikan lagi menjadi Open.",
  };

  const selectedExplanation = (() => {
    if (!targetStatus) return "";
    const isReopen =
      targetStatus === "open" &&
      String(jobDetail?.status || "").toLowerCase() === "closed";
    if (isReopen) return explanationMap["re-open"];
    if (targetStatus === "open") return explanationMap["open"];
    if (targetStatus === "cancelled") return explanationMap["cancelled"];
    return "";
  })();

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
            Action Status: {jobDetail?.status || "-"}
          </h1>
          <button onClick={onClose} title="Close">
            <i className="fa-solid fa-x text-gray-700"></i>
          </button>
        </div>

        {/* BODY */}
        <div className="px-7 py-5 space-y-6 overflow-y-auto max-h-[60vh] min-h-[50vh]">
          <div className="flex justify-evenly bg-gray-100 p-2 rounded">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600">Open Date</p>
              <p className="text-sm">
                {jobDetail?.startDate
                  ? new Intl.DateTimeFormat("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(jobDetail.startDate))
                  : "-"}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600">Close Date</p>
              <p className="text-sm">
                {jobDetail?.endDate
                  ? new Intl.DateTimeFormat("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(jobDetail.endDate))
                  : "-"}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-800 block mb-3">
              Update Status Lowongan
            </label>

            {/* Radio options */}
            {options.length > 0 ? (
              <div className="space-y-3">
                {options.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="targetStatus"
                      value={opt.value}
                      checked={targetStatus === opt.value}
                      onChange={() => setTargetStatus(opt.value)}
                      className="form-radio"
                    />
                    <span className="text-lg">{opt.label}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">Tidak ada aksi tersedia.</p>
            )}

            {/* Jika ini re-open (status sekarang closed dan user pilih open), tampilkan date input */}
            {targetStatus === "open" &&
              String(jobDetail?.status || "").toLowerCase() === "closed" && (
                <div className="mt-4">
                  <label className="block text-sm text-gray-700 mb-2">
                    Tanggal Tutup Baru (End Date)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border px-3 py-2 rounded w-full max-w-xs"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Pilih tanggal akhir agar lowongan terbuka sampai tanggal
                    tersebut.
                  </p>
                </div>
              )}

            {/* Penjelasan singkat sesuai pilihan */}
            {selectedExplanation && (
              <div className="mt-4 bg-blue-50 border border-blue-100 p-3 rounded">
                <p className="text-sm text-gray-800">{selectedExplanation}</p>
              </div>
            )}
          </div>
        </div>

        {/* CREATE BUTTON */}
        <div className="flex w-full justify-end px-4 py-3 border-t border-gray-300 bg-white">
          <button
            onClick={handleUpdate}
            className={`bg-blue-700 text-white rounded hover:bg-blue-800 transition px-4 py-1 ${
              !targetStatus ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={
              !targetStatus ||
              (targetStatus === "open" &&
                String(jobDetail?.status || "").toLowerCase() === "closed" &&
                !endDate)
            }
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionStatusJobPopup;
