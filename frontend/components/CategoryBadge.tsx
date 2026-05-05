'use client'

/**
 * ParamAI Frontend — Category Badge Component
 * Displays BPOM category with confidence score
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Group 1, President University
 */

interface CategoryBadgeProps {
  category_code: string
  category_name: string
  confidence: number
  review_flag: boolean
}

export default function CategoryBadge({
  category_code,
  category_name,
  confidence,
  review_flag,
}: CategoryBadgeProps) {
  const confidencePercent = Math.round(confidence * 100)
  const isHighConfidence = confidence >= 0.80

  return (
    <div className="w-full">
      {/* Main Badge Card */}
      <div
        className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100
                   rounded-xl p-4 border border-blue-100"
      >
        <div className="flex items-start justify-between gap-4">
          {/* Left Side — Category Info */}
          <div className="flex-1">
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
              BPOM Product Category
            </p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-blue-600 text-white rounded">
                {category_code}
              </span>
              <h3 className="text-lg font-bold text-gray-900">
                {category_name}
              </h3>
            </div>
          </div>

          {/* Right Side — Confidence Badge */}
          <div className="flex-shrink-0">
            {isHighConfidence ? (
              <div className="px-3 py-1.5 bg-green-500 rounded-full">
                <span className="text-xs font-semibold text-white">
                  Confidence: {confidencePercent}%
                </span>
              </div>
            ) : (
              <div className="px-3 py-1.5 bg-amber-500 rounded-full">
                <span className="text-xs font-semibold text-white">
                  Confidence: {confidencePercent}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Confidence Context */}
        {!isHighConfidence && (
          <div className="mt-2 text-xs text-amber-700 font-medium">
            Review recommended for optimal accuracy
          </div>
        )}
      </div>

      {/* Warning Banner — shows only if review_flag is true */}
      {review_flag && (
        <div className="mt-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Multiple categories matched
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Expert review recommended to determine the correct classification.
                Please consult a BPOM regulatory specialist.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}