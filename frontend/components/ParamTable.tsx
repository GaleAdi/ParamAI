'use client'

/**
 * ParamAI Frontend — Parameter Table Component
 * Displays testing parameters in a table format
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
  chemical: { bg: 'bg-blue-100', text: 'text-blue-700' },
  microbiological: { bg: 'bg-amber-100', text: 'text-amber-700' },
  heavy_metal: { bg: 'bg-red-100', text: 'text-red-700' },
  labeling: { bg: 'bg-green-100', text: 'text-green-700' },
  physical: { bg: 'bg-gray-100', text: 'text-gray-700' },
  contaminant: { bg: 'bg-orange-100', text: 'text-orange-700' },
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
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Required Testing Parameters
        </h3>
        <p className="text-sm text-gray-500">Based on BPOM regulations</p>
        <div className="mt-6 text-center py-8 text-gray-500">
          <p>No parameters available for this category.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">
          Required Testing Parameters
        </h3>
        <p className="text-sm text-gray-500">Based on BPOM regulations</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-[#1E3A5F]">
            <tr>
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
          <tbody className="divide-y divide-gray-100">
            {parameters.map((param, index) => {
              const colors = TYPE_COLORS[param.type] || TYPE_COLORS.chemical
              const typeLabel = TYPE_LABELS[param.type] || param.type

              return (
                <tr
                  key={param.name}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  {/* Parameter Name */}
                  <td className="px-6 py-3">
                    <span className="text-sm font-medium text-gray-900">
                      {param.name}
                    </span>
                  </td>

                  {/* Standard */}
                  <td className="px-6 py-3">
                    <span className="text-sm text-gray-700">
                      {param.standard}
                    </span>
                  </td>

                  {/* Regulation */}
                  <td className="px-6 py-3">
                    <span className="text-sm text-gray-600 font-mono text-xs">
                      {param.regulation}
                    </span>
                  </td>

                  {/* Type Badge */}
                  <td className="px-6 py-3">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}
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
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Total: {parameters.length} parameters required for BPOM registration
        </p>
      </div>
    </div>
  )
}