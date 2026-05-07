'use client'

/**
 * ParamAI Frontend — Parameter Table Component
 * Displays testing parameters in a table format
 * Design: Professional SaaS with dark header
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Group 1, President University
 */

import { Parameter, ParameterType } from '@/lib/types'

interface ParamTableProps {
  parameters: Parameter[]
}

// Type badge color mapping
const TYPE_COLORS: Record<ParameterType, { bg: string; text: string }> = {
  chemical: { bg: '#dbeafe', text: '#1e40af' },
  microbiological: { bg: '#fef3c7', text: '#92400e' },
  heavy_metal: { bg: '#fee2e2', text: '#991b1b' },
  labeling: { bg: '#d1fae5', text: '#065f46' },
  physical: { bg: '#f3f4f6', text: '#374151' },
  contaminant: { bg: '#ffedd5', text: '#9a3412' },
}

const TYPE_LABELS: Record<ParameterType, string> = {
  chemical: 'Chemical',
  microbiological: 'Micro',
  heavy_metal: 'Heavy Metal',
  labeling: 'Labeling',
  physical: 'Physical',
  contaminant: 'Contaminant',
}

export default function ParamTable({ parameters }: ParamTableProps) {
  if (parameters.length === 0) {
    return (
      <div className="rounded-xl p-6" style={{ backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <h3 className="text-lg font-bold mb-2" style={{ color: '#1a1a2e' }}>
          Required Testing Parameters
        </h3>
        <p className="text-sm" style={{ color: '#6b7280' }}>Based on BPOM regulations</p>
        <div className="mt-6 text-center py-8" style={{ color: '#9ca3af' }}>
          <p>No parameters available for this category.</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'white',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4"
        style={{
          backgroundColor: '#384884',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <h3 className="text-lg font-bold text-white">Required Testing Parameters</h3>
        <p className="text-sm text-white/70">Based on BPOM regulations</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead>
            <tr style={{ backgroundColor: '#475569' }}>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
              >
                Parameter
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
              >
                Standard
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
              >
                Regulation
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
              >
                Type
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {parameters.map((param, index) => {
              const colors = TYPE_COLORS[param.type] || TYPE_COLORS.chemical
              const typeLabel = TYPE_LABELS[param.type] || param.type

              return (
                <tr
                  key={param.name}
                  style={
                    index % 2 === 0
                      ? { backgroundColor: 'white' }
                      : { backgroundColor: '#f9fafb' }
                  }
                >
                  {/* Parameter Name */}
                  <td className="px-6 py-3">
                    <span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>
                      {param.name}
                    </span>
                  </td>

                  {/* Standard */}
                  <td className="px-6 py-3">
                    <span className="text-sm" style={{ color: '#374151' }}>
                      {param.standard}
                    </span>
                  </td>

                  {/* Regulation */}
                  <td className="px-6 py-3">
                    <span
                      className="text-xs font-mono"
                      style={{
                        color: '#4F6EF7',
                        backgroundColor: '#eff6ff',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {param.regulation}
                    </span>
                  </td>

                  {/* Type Badge */}
                  <td className="px-6 py-3">
                    <span
                      className="px-2.5 py-1 text-xs font-semibold rounded-full"
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.text,
                      }}
                    >
                      {typeLabel}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer — Summary */}
      <div
        className="px-6 py-3"
        style={{
          backgroundColor: '#f9fafb',
          borderTop: '1px solid #e5e7eb',
        }}
      >
        <p className="text-xs" style={{ color: '#6b7280' }}>
          Total: <strong>{parameters.length}</strong> parameters required for BPOM registration
        </p>
      </div>
    </div>
  )
}