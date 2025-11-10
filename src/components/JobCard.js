// src/components/JobCard.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const JobCard = ({ job, isBookmarked, onBookmark, onApply }) => {
  const navigate = useNavigate();
  
  const getMatchBadgeClass = (match) => {
    if (match >= 90) return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium";
    return "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium";
  };

  return (
    <div className="job-card bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-4">
          <div className={`w-16 h-16 bg-gradient-to-br ${job.logoColor} rounded-lg flex items-center justify-center text-white font-bold text-xl`}>
            {job.logo}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold">{job.title}</h3>
              <span className={getMatchBadgeClass(job.match)}>
                {job.match >= 90 && <i className="fas fa-bolt mr-1"></i>}
                {job.match}% Match
              </span>
            </div>
            <p className="text-blue-600 font-medium">{job.company} • {job.location}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span><i className="fas fa-clock mr-1"></i>{job.type}</span>
              <span><i className="fas fa-money-bill-wave mr-1"></i>{job.salary}</span>
              <span><i className="fas fa-calendar mr-1"></i>{job.posted}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => onBookmark(job.id)}
          className={`${isBookmarked ? 'text-blue-500' : 'text-gray-400'} hover:text-blue-600`}
        >
          <i className={`${isBookmarked ? 'fas' : 'far'} fa-bookmark text-xl`}></i>
        </button>
      </div>

      <p className="text-gray-700 mb-4">{job.description}</p>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.map((skill, index) => (
          <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {skill}
          </span>
        ))}
      </div>

      {/* Accommodation Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.accommodations.map((accommodation, index) => (
          <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            <i className="fas fa-check mr-1"></i>
            {accommodation}
          </span>
        ))}
      </div>

      {/* Disability Support */}
      <div className="bg-green-50 p-3 rounded-lg mb-4">
        <div className="flex items-center gap-2 text-green-800 font-medium mb-1">
          <i className="fas fa-check-circle"></i>
          <span>Didukung untuk: {job.disabilitySupport.join(', ')}</span>
        </div>
        <p className="text-green-700 text-sm">
          Perusahaan ini memiliki pengalaman bekerja dengan penyandang disabilitas dan menyediakan lingkungan kerja yang inklusif.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button 
            onClick={() => onApply(job)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition font-medium"
          >
            Lamar Sekarang
          </button>
          <Link 
            to={`/lowongan/${job.id}`}
            className="border border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-medium inline-block"
          >
            Lihat Detail
          </Link>
        </div>
        <span className="text-sm text-gray-500">{job.applicants} pelamar</span>
      </div>
    </div>
  );
};

export default JobCard;