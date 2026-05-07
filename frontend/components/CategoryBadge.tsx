'use client'

/**
 * ParamAI Frontend — Category Badge Component
 * Displays BPOM category with confidence score
 * Design: Professional SaaS with gradient accents
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
        className="rounded-xl p-5"
        style={{
          background: isHighConfidence
            ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
            : 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          border: isHighConfidence ? '1px solid #a7f3d0' : '1px solid #fcd34d',
        }}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Left Side — Category Info */}
          <div className="flex-1">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{
                color: isHighConfidence ? '#059669' : '#d97706',
              }}
            >
              BPOM Product Category
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="px-3 py-1 text-sm font-bold font-mono rounded-lg"
                style={{
                  backgroundColor: isHighConfidence ? '#059669' : '#d97706',
                  color: 'white',
                }}
              >
                {category_code}
              </span>
              <h3 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>
                {category_name}
              </h3>
            </div>
          </div>

          {/* Right Side — Confidence Badge */}
          <div
            className="px-4 py-2 rounded-xl flex items-center gap-2"
            style={{
              backgroundColor: isHighConfidence ? '#10b981' : '#f59e0b',
            }}
          >
            <span className="text-3xl font-bold text-white">{confidencePercent}%</span>
            <span className="text-xs text-white/80">confidence</span>
          </div>
        </div>

        {/* Confidence Context */}
        {!isHighConfidence && (
          <div className="mt-3 text-sm font-medium" style={{ color: '#92400e' }}>
            <span style={{ marginRight: '6px' }}>&#9888;</span>
            Below 80% threshold — expert review recommended
          </div>
        )}
      </div>

      {/* Warning Banner — shows only if review_flag is true */}
      {review_flag && (
        <div
          className="mt-3 px-4 py-3 rounded-xl"
          style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fcd34d',
          }}
        >
          <div className="flex items-start gap-3">
            <span style={{ fontSize: '24px', lineHeight: '1' }}>&#9888;</span>
            <div>
              <p className="text-sm font-bold" style={{ color: '#92400e' }}>
                Multiple categories matched
              </p>
              <p className="text-xs mt-1" style={{ color: '#a16207' }}>
                Expert review recommended to determine the correct classification.
                Please consult a BPOM regulatory specialist before proceeding.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}