// src/components/JobCard.js
import React from "react";
import defaultCm from "../assets/default-company.png";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";

dayjs.locale("id");
dayjs.extend(relativeTime);

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const skillsPreview = job.JobSkills?.slice(0, 2) || [];
  const extraSkills = job.JobSkills?.length > 2 ? job.JobSkills.length - 2 : 0;

  const disabilityPreview = job.JobDisabilities?.slice(0, 2) || [];
  const extraDisability =
    job.JobDisabilities?.length > 2 ? job.JobDisabilities.length - 2 : 0;

  return (
    <div
      className="bg-white border border-gray-200 rounded p-5 shadow hover:shadow-md transition cursor-pointer"
      onClick={() => navigate(`/job/${job?.id}`)}
    >
      {/* Job Title + Company */}
      <div className="mb-3 flex gap-3">
        <img
          src={job.Company?.User?.profilePicture || defaultCm}
          alt="Profile Picture"
          className="h-16 w-16 aspect-square object-cover"
        />
        <div>
          <h3 className="text-xl font-semibold text-blue-700">{job.title}</h3>
          <p className="text-sm text-gray-600">
            {job.Company?.companyName} •{" "}
            <span className="capitalize">
              {`${job.employmentType} (${job.locationType})`}
            </span>
          </p>
          {job?.address && (
            <p className="text-sm text-gray-600">{job.address}</p>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="flex flex-wrap gap-3 text-sm mb-3">
        <span className="px-4 py-1 rounded-full border border-blue-400 text-blue-800">
          <i className="fa-solid fa-calendar mr-2"></i>
          {dayjs(job?.startDate).fromNow()}
        </span>

        {job?.minSalary && (
          <span className="px-4 py-1 rounded-full border text-sm border-blue-400 text-blue-800 ">
            <i className="fa-solid fa-money-bill-wave mr-2"></i>
            Rp{formatCurrency(job?.minSalary)}{" "}
            {job?.maxSalary && `- Rp${formatCurrency(job?.maxSalary)}`}
          </span>
        )}
      </div>

      {/* Short Description */}
      <p className="text-gray-700 text-sm line-clamp-2 mb-4">
        {job.description}
      </p>

      {/* Skills */}
      {skillsPreview.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 mt-4">
          {skillsPreview.map((skill) => (
            <span
              key={skill.Skill.id}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize"
            >
              {skill.Skill?.name}
            </span>
          ))}

          {extraSkills > 0 && (
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
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
              key={disability.Disability.id}
              className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium text-sm capitalize"
            >
              {disability.Disability?.name} / {disability.Disability?.type}
            </span>
          ))}

          {extraDisability > 0 && (
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              +{extraDisability} lainnya
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default JobCard;
