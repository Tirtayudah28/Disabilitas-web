import axios from "axios";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LoginSuggestionPopup = ({ isVisible, onClose }) => {
  //lock body scroll
  useEffect(() => {
    if (isVisible) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed ani-appear inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col w-full max-w-[600px] overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-4 border-b bg-gray-50">
          <h1 className="font-semibold text-xl text-gray-800">Oops..</h1>
          <button
            onClick={onClose}
            title="Close"
            className="p-1 hover:bg-gray-200 rounded-full transition"
          >
            <i className="fa-solid fa-x text-gray-700 text-lg"></i>
          </button>
        </div>

        {/* BODY */}
        <div className="px-7 py-6 space-y-5 overflow-y-auto max-h-[65vh] flex flex-col text-center">
          <h1 className="font-medium text-lg leading-relaxed text-gray-800">
            Untuk melanjutkan aksi, anda perlu login ke InklusiKerja
          </h1>

          <Link to="/login" className="w-full">
            <button className="w-full mb-4 border border-blue-500 text-blue-700 font-medium py-2.5 rounded-lg hover:bg-blue-50 transition shadow-sm">
              Login ke InklusiKerja
            </button>
          </Link>

          <p className="text-gray-600">Belum punya akun?</p>

          <Link to="/register" className="w-full">
            <button className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md">
              Daftar Akun InklusiKerja
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginSuggestionPopup;

/* Tailwind Animations */
// Add this to your global CSS if not existing:
// .animate-fadeIn { @apply opacity-0 translate-y-3; animation: fadeIn .25s forwards; }
// @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
