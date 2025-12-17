// src/pages/CompaniesPage.js
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

import defaultPfp from "../assets/default-pfp.png";

const CandidatePage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [jobSeekers, setJobSeekers] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    country: "",
    limit: 30,
    page: 1,
  });
  const [meta, setMeta] = useState({
    page: 1,
    limit: 30,
    total: 0,
    totalPages: 0,
  });
  const [searchInput, setSearchInput] = useState("");
  const [countryInput, setCountryInput] = useState("");

  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  //fetch job seekers
  const fetchJobSeekers = async (page) => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: filters.limit,
        search: filters.search || "",
        country: filters.country || "",
      };

      const res = await axios.get("/api/job-seekers", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobSeekers(res.data.data || []);
      setMeta({
        page: res.data.meta.page,
        limit: res.data.meta.limit,
        total: res.data.meta.total,
        totalPages: res.data.meta.totalPages,
      });
    } catch (err) {
      console.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  //fetch countries
  const fetchCountries = async () => {
    try {
      const res = await axios.get(
        "https://restcountries.com/v3.1/all?fields=name"
      );
      const list = res.data.map((c) => c.name.common).sort();
      setCountries(list);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };
  //effects
  useEffect(() => {
    fetchJobSeekers(filters.page);
  }, [filters.page, filters.search, filters.country, filters.limit, token]);
  useEffect(() => {
    fetchCountries();
  }, []);

  //filter handlers
  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: searchInput,
      country: countryInput,
      page: 1,
    }));
  };

  // Reset filters
  const resetFilters = (filterType = "all") => {
    setFilters((prev) => {
      const newFilters = { ...prev, page: 1 };

      if (filterType === "search" || filterType === "all") {
        newFilters.search = "";
      }

      if (filterType === "country" || filterType === "all") {
        newFilters.country = "";
      }

      return newFilters;
    });

    if (filterType === "search" || filterType === "all") {
      setSearchInput("");
    }
    if (filterType === "country" || filterType === "all") {
      setCountryInput("");
    }
  };

  // Change limit
  const handleLimitChange = (newLimit) => {
    const newFilters = {
      ...filters,
      limit: Number(newLimit),
      page: 1,
    };

    setFilters(newFilters);
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  /*
    SKELETON LOADER
  */
  const CandidateCardSkeleton = () => {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm animate-pulse">
        {/* Header */}
        <div className="flex items-center gap-4 mb-3">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gray-200" />

          {/* Name & meta */}
          <div className="flex-1 space-y-2">
            <div className="h-5 w-2/3 bg-gray-200 rounded" />
            <div className="h-4 w-1/3 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-11/12 bg-gray-200 rounded" />
          <div className="h-4 w-4/5 bg-gray-200 rounded" />
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
          <div className="h-6 w-24 bg-gray-200 rounded-full" />
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
          <div className="h-6 w-14 bg-gray-200 rounded-full" />
        </div>

        {/* Disabilities */}
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-28 bg-gray-200 rounded-full" />
          <div className="h-6 w-32 bg-gray-200 rounded-full" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen container mx-auto lg:px-32 xl:px-36 py-8 mb-32">
      {/* Header Section */}
      {token ? null : (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Lebih dekat dengan{" "}
              <span className="text-blue-600">Talenta Inklusif</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Jelajahi profil kandidat dari berbagai latar belakang disabilitas,
              dengan keterampilan dan pengalaman yang siap berkontribusi dalam
              lingkungan kerja yang inklusif dan setara.
            </p>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex w-full justify-center mb-8">
        <div className="max-w-5xl w-full flex gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-xl p-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
              <i className="fa-solid fa-magnifying-glass text-gray-400" />
              <input
                type="search"
                placeholder="Cari nama kandidat..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Country */}
          <div className="relative">
            <div className="relative">
              <i className="fas fa-globe absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={countryInput}
                placeholder="Negara"
                onChange={(e) => {
                  const value = e.target.value;
                  setCountryInput(value);

                  if (!value.trim()) {
                    setFilteredCountries([]);
                    setShowDropdown(false);
                    return;
                  }

                  const filtered = countries.filter((name) =>
                    name.toLowerCase().includes(value.toLowerCase())
                  );

                  setFilteredCountries(filtered);
                  setShowDropdown(true);
                }}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {showDropdown && filteredCountries.length > 0 && (
              <ul className="absolute z-20 mt-2 w-full max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
                {filteredCountries.slice(0, 10).map((name) => (
                  <li
                    key={name}
                    className="px-4 py-3 text-sm hover:bg-green-50 cursor-pointer transition"
                    onClick={() => {
                      setCountryInput(name);
                      setShowDropdown(false);
                    }}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={handleSearch}
            className="w-full px-10 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            <i class="fa-solid fa-magnifying-glass"></i> Cari
          </button>
        </div>
      </div>

      <main className="flex flex-col gap-6">
        {/* Results Header */}
        <div className="flex gap-6 items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {meta?.total || 0} Kandidat Ditemukan
          </h2>
          <div className="flex gap-4 mt-1 text-sm text-gray-600">
            {filters.search && (
              <span className="rounded-full px-5 py-1 bg-white text-blue-800 border border-blue-200 font-medium">
                "{filters.search}"{" "}
                <button onClick={() => resetFilters("search")} className="ml-2">
                  <i className="fas fa-x text-xs"></i>
                </button>
              </span>
            )}
            {filters.country && (
              <span className="rounded-full px-5 py-1 bg-white text-blue-800 border border-blue-200 font-medium">
                {filters.country}{" "}
                <button
                  onClick={() => resetFilters("country")}
                  className="ml-2"
                >
                  <i className="fas fa-x text-xs"></i>
                </button>
              </span>
            )}
          </div>
        </div>
        {/* Grid Candidate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading &&
            Array.from({ length: 9 }).map((_, i) => (
              <CandidateCardSkeleton key={i} />
            ))}
          {!loading && jobSeekers.length === 0 && (
            <div className="text-center py-8 text-gray-600 col-span-3">
              Tidak ada apa-apa disini
            </div>
          )}

          {!loading && jobSeekers.map((js) => {
            const skillsPreview = js.UserSkills?.slice(0, 2) || [];
            const extraSkills =
              js.UserSkills?.length > 2 ? js.UserSkills.length - 2 : 0;

            const disabilityPreview = js.UserDisabilities?.slice(0, 2) || [];
            const extraDisability =
              js.UserDisabilities?.length > 2
                ? js.UserDisabilities.length - 2
                : 0;

            return (
              <div
                key={js.id}
                onClick={() => navigate(`/js/${js.id}`)}
                className="group cursor-pointer bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all"
                role="button"
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-3">
                  {/* Avatar */}
                  <img
                    src={js.profilePicture || defaultPfp}
                    alt={js.UserProfile?.fullName}
                    className="w-16 h-16 object-cover aspect-square rounded-full"
                  />

                  {/* Name & meta */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition truncate text-lg">
                      {js.UserProfile?.fullName}
                    </h3>
                    <p className="text-xs text-blue-600 truncate">
                      @{js.username}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 truncate capitalize flex items-center gap-2">
                      <i className="fas fa-location-dot text-xs" />{" "}
                      {js.UserProfile?.city}, {js.UserProfile?.country}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                {js.UserProfile?.bio && (
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-3">
                    {js.UserProfile?.bio}
                  </p>
                )}

                {/* Disabilities & Skills */}
                {/* Skills */}
                {skillsPreview.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 mt-4">
                    {skillsPreview.map((skill) => (
                      <span
                        key={skill.id}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium capitalize"
                      >
                        {skill.skillName}
                      </span>
                    ))}

                    {extraSkills > 0 && (
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                        +{extraSkills} lainnya
                      </span>
                    )}
                  </div>
                )}

                {/* Disabilities */}
                {disabilityPreview.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {disabilityPreview.map((disability) => (
                      <span
                        key={disability.id}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium text-xs capitalize"
                      >
                        {disability.disabilityName} / {disability.type}
                      </span>
                    ))}

                    {extraDisability > 0 && (
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                        +{extraDisability} lainnya
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 rounded-lg border border-gray-200 p-4 bg-blue-50">
          <div className="flex gap-1 items-center text-sm text-gray-600">
            <span>Showing</span>
            <select
              className="font-inter outline-none border border-gray-300 bg-white text-sm rounded-md px-2 py-1 shadow-sm"
              value={filters.limit}
              onChange={(e) => handleLimitChange(e.target.value)}
            >
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={80}>80</option>
            </select>
            <span>data from {meta.total}</span>
          </div>
          <div className="flex gap-2 items-center">
            <button
              className="px-3 py-1 bg-gray-50 cursor-pointer border rounded disabled:opacity-50"
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page <= 1 || loading}
            >
              Prev
            </button>
            <span className="px-3 py-1 text-xs">
              Page {meta.page} of {meta.totalPages || 1}
            </span>
            <button
              className="px-3 py-1 border bg-gray-50 cursor-pointer rounded disabled:opacity-50"
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page >= (meta.totalPages || 1) || loading}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CandidatePage;
