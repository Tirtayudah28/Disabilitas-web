import React, { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";

const RescheduleJobPopup = ({ isVisible, onClose, onUpdate, jobDetail }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const currentStatus = String(jobDetail?.status || "").toLowerCase();

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isVisible]);

  // Set initial dates
  useEffect(() => {
    if (!jobDetail) return;
    setStartDate(jobDetail?.startDate || "");
    setEndDate(jobDetail?.endDate || "");
  }, [jobDetail, isVisible]);

  const isPending = currentStatus === "pending";
  const isOpen = currentStatus === "open";

  const canEdit = isPending || isOpen;

  const handleUpdate = () => {
    if (!canEdit) {
      enqueueSnackbar("Status tidak mengizinkan reschedule", {
        variant: "warning",
      });
      return;
    }

    if (isPending && (!startDate || !endDate)) {
      return enqueueSnackbar("Silakan isi tanggal mulai dan tanggal selesai.", {
        variant: "warning",
      });
    }
    if (isOpen && !endDate) {
      return enqueueSnackbar("Silakan isi tanggal selesai.", {
        variant: "warning",
      });
    }

    const payload = {};
    if (isPending) {
      payload.startDate = startDate;
      payload.endDate = endDate;
    }
    if (isOpen) {
      payload.endDate = endDate;
    }

    onUpdate(payload);
    onClose();
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
        role="dialog"
        aria-modal="true"
        aria-labelledby="action-status-title"
      >
        {/* HEADER */}
        <div className="flex justify-between px-4 py-3 border-b border-gray-300 bg-gray-50">
          <h1 id="action-status-title" className="font-semibold capitalize">
            Reschedule Lowongan
          </h1>
          <button onClick={onClose} title="Close">
            <i className="fa-solid fa-x text-gray-700"></i>
          </button>
        </div>

        <div className="px-7 py-5 space-y-6 overflow-y-auto max-h-[60vh] min-h-[50vh]">
          {!canEdit && (
            <p className="text-sm text-red-600 mb-4">
              Lowongan berstatus <b>{currentStatus}</b> tidak dapat
              di-reschedule.
            </p>
          )}

          {/* START DATE */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Start Date</label>
            <input
              type="date"
              className="border px-3 py-2 rounded w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={!isPending}
            />
          </div>

          {/* END DATE */}
          <div className="mb-4">
            <label className="block text-sm mb-1">End Date</label>
            <input
              type="date"
              className="border px-3 py-2 rounded w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={!isPending && !isOpen}
            />
          </div>
        </div>

        <div className="flex w-full justify-end px-4 py-3 border-t border-gray-300 bg-white">
          <button
            onClick={handleUpdate}
            disabled={!canEdit}
            className={`text-white rounded transition px-4 py-1 ${
              canEdit ? "bg-blue-700 hover:bg-blue-800" : "bg-gray-400"
            }`}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleJobPopup;
