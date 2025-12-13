import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import defaultCm from "../../assets/default-company.png";

const EmployerJobPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 30,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    disabilityType: "",
    sort: "newest",
    limit: 30,
  });

  const [searchInput, setSearchInput] = useState("");
  const searchDebounceRef = useRef(null);

  const stats = {
    totalJobs: 12,
    activeJobs: 8,
    totalApplications: 247,
    newApplications: 23,
    interviewRate: 15,
    hireRate: 8,
    profileViews: 1560,
    totalCandidates: 89,
  };

  //get company's job
  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: filters.limit,
        search: filters.search || undefined,
        status: filters.status || undefined,
        disabilityTypes: filters.disabilityType || undefined,
        sort: filters.sort || undefined,
      };

      const res = await axios.get("/api/company-jobs", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);

      if (res?.data?.success) {
        setJobs(res.data.data || []);
        setMeta({
          page: res.data.meta.page,
          limit: res.data.meta.limit,
          total: res.data.meta.total,
          totalPages: res.data.meta.totalPages,
        });
        setCompany(res.data.company);
      } else {
        setError(res?.data?.message || "Gagal mengambil data");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
  }, [
    filters.status,
    filters.disabilityType,
    filters.sort,
    filters.limit,
    filters.search,
    token,
  ]);

  //debounce
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 450);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchInput]);

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > (meta.totalPages || 1)) return;
    fetchJobs(newPage);
  };

  const getStatusBadgeClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "open":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <>
      <div className="space-y-4">
        <h1 className="font-bold text-gray-900 text-2xl flex items-center gap-2">
          <i className={`fas fa-briefcase`} /> Pekerjaan
        </h1>

        {/* Jobs List */}
        <div className="bg-white rounded-2xl shadow-lg py-6 px-4">
          {/* job header */}
          <div className="flex items-center justify-between">
            <div className="flex gap-5">
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">{meta.total}</p>
                <span className="text-xs font-quicksand">Total Entries</span>
              </div>
              <div className="flex flex-col items-center">
                <i class="fa-solid fa-memory text-xl"></i>
                <span className="text-xs font-quicksand">
                  Page {meta.page} of {meta.totalPages}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <i class="fa-solid fa-hand-pointer text-xl"></i>
                <span className="text-xs text-wrap max-w-28 text-center font-quicksand">
                  Pilih untuk melihat detail
                </span>
              </div>
            </div>
            <Link to={"/employer/jobs/post"}>
              <button className="px-5 py-3 bg-violet-600 hover:bg-violet-700 cursor-pointer text-gray-50 rounded">
                <i className="fa-solid fa-plus"></i> Post Lowongan Baru
              </button>
            </Link>
          </div>

          {/* filters */}
          <div className="flex w-full gap-20 mt-5">
            <div className="flex gap-2 flex-1  bg-gray-50 items-center border border-gray-300 rounded px-4 py-2 shadow">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                className="outline-none flex-1 bg-transparent"
                type="search"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              {/* Filter Status */}
              <select
                className="border border-gray-300 bg-gray-50 rounded px-3 py-2 shadow text-sm"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Filter Disability Type */}
              <select
                className="border border-gray-300 bg-gray-50 rounded px-3 py-2 shadow text-sm"
                value={filters.disabilityType}
                onChange={(e) =>
                  setFilters({ ...filters, disabilityType: e.target.value })
                }
              >
                <option value="">All Disability Types</option>
                <option value="sensory">Sensory</option>
                <option value="intellectual">Intellectual</option>
                <option value="mental">Mental</option>
                <option value="physical">Physical</option>
                <option value="multiple">Multiple</option>
                <option value="other">Other</option>
              </select>

              {/* Sorting */}
              <select
                className="border border-gray-300 bg-gray-50 rounded px-3 py-2 shadow text-sm"
                value={filters.sort}
                onChange={(e) =>
                  setFilters({ ...filters, sort: e.target.value })
                }
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="az">A → Z</option>
                <option value="za">Z → A</option>
              </select>
            </div>
          </div>

          {/* jobs grid */}
          <div className="grid grid-cols-1 gap-4 mt-5">
            {loading && <div className="text-center py-10">Loading...</div>}

            {!loading && error && (
              <div className="text-center text-red-600 py-10">{error}</div>
            )}

            {!loading && jobs.length === 0 && !error && (
              <div className="text-center py-10">Tidak ada lowongan.</div>
            )}

            {/* jobs grid */}
            {jobs.map((job) => (
              <div
                key={job.id}
                className="border border-gray-300 shadow rounded p-4 hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/job/${job.id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 flex gap-4">
                    <img
                      src={company?.User?.profilePicture || defaultCm}
                      alt="Profile Picture"
                      className="h-14 w-14 aspect-square object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-blue-600 text-xl">
                        {job.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {company.companyName} •{" "}
                        <span className="capitalize">
                          {`${job.employmentType} (${job.locationType})`}
                        </span>
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs uppercase font-medium ${getStatusBadgeClass(
                      job.status
                    )}`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="flex gap-8 text-sm mb-3">
                  <div>
                    <span className="text-gray-600 text-xs">Open Date</span>
                    <p className="font-medium mt-1">
                      {new Intl.DateTimeFormat("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }).format(new Date(job?.startDate))}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Close Date</span>
                    <p className="font-medium mt-1">
                      {new Intl.DateTimeFormat("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }).format(new Date(job?.endDate))}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs">Applications</span>
                    <p className="font-medium mt-1">
                      {job.applicationsCount ?? job.applications ?? 0}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs">Views</span>
                    <p className="font-medium mt-1">{job.views ?? "-"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-1 items-center text-sm text-gray-600">
              <span>Showing</span>
              <select
                className="font-inter outline-none border border-gray-300 bg-white text-sm rounded-md px-2 py-1 shadow-sm"
                value={filters.limit}
                onChange={(e) =>
                  setFilters({ ...filters, limit: Number(e.target.value) })
                }
              >
                <option value={30}>30</option>
                <option value={50}>50</option>
                <option value={80}>80</option>
              </select>
              <span>data from {meta.total}</span>
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => goToPage((meta.page || 1) - 1)}
                disabled={(meta.page || 1) <= 1 || loading}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => goToPage((meta.page || 1) + 1)}
                disabled={(meta.page || 1) >= (meta.totalPages || 1) || loading}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployerJobPage;
