// src/pages/employer/EmployerDashboard.js - COMPLETE VERSION
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import defaultCm from "../../assets/default-company.png";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const EmployerDashboard = () => {
  const { userData, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const [company, setCompany] = useState({});
  const [jobStats, setJobStats] = useState({});
  const [appStats, setAppStats] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  //fatir: get user by id
  const getUserById = async () => {
    try {
      const res = await axios.get(`/api/user/${userData.id}`);

      if (res.data.data.role === "job-seeker") {
        navigate(`/`);
      }
      setCompany(res.data.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    if (!userData) return;
    getUserById();
  }, [userData]);

  // handle logout
  const handleLogout = async () => {
    const confirmation = window.confirm("Yakin ingin logout?");

    if (confirmation) {
      try {
        const res = await axios.delete("/api/auth/logout");

        logout();
        enqueueSnackbar(res.data.message || "Logout berhasil", {variant: "info"});
        navigate("/");
      } catch (err) {
        enqueueSnackbar(err.response?.data?.message);
      }
    }
  };

  const getActiveClass = (href) => {
    return location.pathname === href
      ? "bg-primary-100 text-primary-600 border-l-4 border-primary-500"
      : "hover:bg-gray-100";
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "chart-bar", href: "/employer" },
    {
      id: "jobs",
      label: "Pekerjaan",
      icon: "briefcase",
      href: "/employer/jobs",
    },
    {
      id: "applications",
      label: "Lamaran",
      icon: "file-alt",
      href: "/employer/applications",
    },
  ];

  return (
    <div className="min-h-screen">
      <main id="main-content" className="container mx-auto px-6 py-10">
        <div className="flex items-start gap-6">
          {/* Sidebar */}
          <div className="flex flex-col bg-gray-50 rounded-md shadow-lg p-6 sticky top-28 min-w-48 w-[20rem]">
            {/* Company Info */}
            <Link
              to={`/cm/${userData?.id}`}
              className="hover:opacity-80 transition flex flex-col items-center w-full"
            >
              <img
                src={company?.profilePicture || defaultCm}
                alt="Profile Picture"
                className="aspect-square w-28 h-28 object-cover"
              />
              <h3 className="font-bold text-gray-900 mt-2">
                {company?.company?.companyName}
              </h3>
              <p className="text-sm text-gray-600 capitalize">
                {company?.company?.Industry?.name ||
                  company?.company?.industryName}
              </p>
            </Link>

            {/* Navigation */}
            <nav className="space-y-2 mt-10">
              {tabs.map((tab) => (
                <Link
                  to={tab.href}
                  key={tab.id}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${getActiveClass(
                    tab.href
                  )}`}
                >
                  <i
                    className={`fas fa-${tab.icon} text-primary-500 w-5 text-center`}
                  ></i>
                  <span>{tab.label}</span>
                </Link>
              ))}
            </nav>

            <div className="bg-gray-200 h-1 w-full my-6"></div>

            <div className="flex justify-center">
              <button
                title="Logout"
                className="text-sm text-red-600 transition cursor-pointer hover:bg-gray-100 rounded-md p-2"
                onClick={handleLogout}
              >
                Logout <i class="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployerDashboard;
