'use client';

import { JobListing, CompatibilityScore } from '../types';
import {
  MapPin,
  DollarSign,
  Clock,
  Building2,
  Star,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface JobCardProps {
  job: JobListing;
  compatibilityScore?: CompatibilityScore;
  onApply?: () => void;
}

export default function JobCard({
  job,
  compatibilityScore,
  onApply,
}: JobCardProps) {
  const scorePercentage = compatibilityScore?.overallScore || 0;
  const scoreColor =
    scorePercentage >= 80
      ? 'text-green-600'
      : scorePercentage >= 60
        ? 'text-yellow-600'
        : 'text-orange-600';

  const scoreBg =
    scorePercentage >= 80
      ? 'bg-green-50'
      : scorePercentage >= 60
        ? 'bg-yellow-50'
        : 'bg-orange-50';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 className="w-4 h-4" />
            {job.company}
          </div>
        </div>

        {compatibilityScore && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`text-center p-4 rounded-lg ${scoreBg}`}
          >
            <div className={`text-3xl font-bold ${scoreColor}`}>
              {Math.round(scorePercentage)}%
            </div>
            <p className="text-xs text-gray-600 font-medium">Match</p>
          </motion.div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-blue-500" />
          {job.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-purple-500" />
          {job.jobType}
        </div>
        {job.salaryRange && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4 text-green-500" />
            ${job.salaryRange.min}k - ${job.salaryRange.max}k
          </div>
        )}
        {job.stipend && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4 text-green-500" />
            ₹{job.stipend}/month
          </div>
        )}
      </div>

      {/* Company Rating */}
      {job.companyReviews && (
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="font-semibold text-gray-900">
            {job.companyReviews.overallRating.toFixed(1)}
          </span>
          <span className="text-gray-600 text-sm">
            ({job.companyReviews.reviewCount} reviews)
          </span>
        </div>
      )}

      {/* Skills */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">Required Skills</p>
        <div className="flex flex-wrap gap-2">
          {job.requiredSkills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
            >
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 4 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              +{job.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Compatibility Info */}
      {compatibilityScore && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="grid grid-cols-3 gap-2 text-center mb-3">
            <div>
              <p className="text-xs text-gray-600">Skills</p>
              <p className="text-lg font-bold text-blue-600">
                {Math.round(compatibilityScore.skillMatch)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Experience</p>
              <p className="text-lg font-bold text-purple-600">
                {Math.round(compatibilityScore.experienceMatch)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Education</p>
              <p className="text-lg font-bold text-green-600">
                {Math.round(compatibilityScore.educationMatch)}%
              </p>
            </div>
          </div>
          {compatibilityScore.gaps.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">
                Areas to Improve:
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                {compatibilityScore.gaps.slice(0, 2).map((gap, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-gray-400 rounded-full" />
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onApply}
        className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
      >
        <TrendingUp className="w-4 h-4" />
        View Preparation Plan
        <ExternalLink className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}
