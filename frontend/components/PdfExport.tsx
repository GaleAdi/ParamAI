'use client'

/**
 * ParamAI Frontend — PDF Export Component
 * Generate and download recommendation as PDF
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Kebut Semalam, President University
 */

import { useState, useRef } from 'react'
import { FileDown, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { RecommendationResult } from '@/lib/types'

interface PdfExportProps {
  result: RecommendationResult
  productName?: string
}

export default function PdfExport({ result, productName }: PdfExportProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const generatePdfContent = () => {
    // Generate HTML content for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>BPOM Testing Parameters - ${productName || result.entities.product_name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 11px;
      color: #1a1a2e;
      line-height: 1.5;
      padding: 30px;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #384884;
      padding-bottom: 20px;
      margin-bottom: 25px;
    }
    .header h1 {
      font-size: 22px;
      color: #384884;
      margin-bottom: 5px;
    }
    .header p {
      color: #6b7280;
      font-size: 10px;
    }
    .meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      padding: 15px;
      background: #f9fafb;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }
    .meta-item { text-align: center; }
    .meta-label { font-size: 9px; color: #6b7280; text-transform: uppercase; }
    .meta-value { font-size: 14px; font-weight: bold; color: #1a1a2e; }
    .category-badge {
      display: inline-block;
      padding: 6px 12px;
      background: #384884;
      color: white;
      border-radius: 6px;
      font-weight: bold;
      font-size: 12px;
    }
    .confidence-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 6px;
      font-weight: bold;
      font-size: 12px;
    }
    .section { margin-bottom: 20px; }
    .section-title {
      font-size: 13px;
      font-weight: bold;
      color: #384884;
      border-bottom: 2px solid #4F6EF7;
      padding-bottom: 5px;
      margin-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
    }
    th {
      background: #384884;
      color: white;
      padding: 8px 10px;
      text-align: left;
      font-size: 9px;
      text-transform: uppercase;
    }
    td {
      padding: 8px 10px;
      border-bottom: 1px solid #e5e7eb;
    }
    tr:nth-child(even) { background: #f9fafb; }
    .type-badge {
      padding: 3px 8px;
      border-radius: 10px;
      font-size: 9px;
      font-weight: 500;
    }
    .type-chemical { background: #dbeafe; color: #1e40af; }
    .type-micro { background: #fef3c7; color: #92400e; }
    .type-heavy { background: #fee2e2; color: #991b1b; }
    .type-labeling { background: #d1fae5; color: #065f46; }
    .type-physical { background: #f3f4f6; color: #374151; }
    .type-contaminant { background: #ffedd5; color: #9a3412; }
    .disclaimer {
      margin-top: 25px;
      padding: 15px;
      background: #fffbeb;
      border: 1px solid #fcd34d;
      border-radius: 8px;
      font-size: 10px;
      color: #92400e;
    }
    .disclaimer-title { font-weight: bold; margin-bottom: 5px; }
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 9px;
      color: #9ca3af;
      border-top: 1px solid #e5e7eb;
      padding-top: 15px;
    }
    @media print {
      body { padding: 15px; }
      .meta { page-break-inside: avoid; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>BPOM Testing Parameter Recommendation</h1>
    <p>ParamAI - AI-Powered BPOM Food Testing Parameter Recommendation System</p>
  </div>

  <div class="meta">
    <div class="meta-item">
      <div class="meta-label">Product Name</div>
      <div class="meta-value">${productName || result.entities.product_name || 'N/A'}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Category</div>
      <div class="meta-value"><span class="category-badge">${result.category_code}</span></div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Category Name</div>
      <div class="meta-value">${result.category_name}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Confidence</div>
      <div class="meta-value">
        <span class="confidence-badge" style="background: ${result.confidence >= 0.8 ? '#d1fae5' : '#fef3c7'}; color: ${result.confidence >= 0.8 ? '#065f46' : '#92400e'}">
          ${Math.round(result.confidence * 100)}%
        </span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Required Testing Parameters (${result.parameters.length} total)</div>
    <table>
      <thead>
        <tr>
          <th style="width: 5%">#</th>
          <th style="width: 25%">Parameter</th>
          <th style="width: 25%">Standard</th>
          <th style="width: 25%">Regulation Citation</th>
          <th style="width: 20%">Type</th>
        </tr>
      </thead>
      <tbody>
        ${result.parameters.map((param, i) => `
          <tr>
            <td>${i + 1}</td>
            <td><strong>${param.name}</strong></td>
            <td>${param.standard}</td>
            <td><code style="color: #4F6EF7; font-size: 9px;">${param.regulation}</code></td>
            <td><span class="type-badge type-${param.type.replace('_', '')}">${param.type.replace('_', ' ')}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  ${result.candidates && result.candidates.length > 0 ? `
    <div class="section">
      <div class="section-title">Alternative Categories (for comparison)</div>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Category Name</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          ${result.candidates.slice(1).map(c => `
            <tr>
              <td><code>${c.code}</code></td>
              <td>${c.name}</td>
              <td>${Math.round(c.confidence * 100)}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : ''}

  <div class="disclaimer">
    <div class="disclaimer-title">Important Disclaimer</div>
    ${result.disclaimer || 'This recommendation requires final verification by a laboratory expert before client communication. The parameters listed are based on BPOM regulations and are subject to change. Always verify with the latest BPOM guidelines.'}
  </div>

  <div class="footer">
    <p>Generated by <strong>ParamAI</strong> - BPOM Testing Recommendation System</p>
    <p>AI Open Innovation Challenge 2026 • Team Kebut Semalam • President University</p>
    <p>Generated on: ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
  </div>
</body>
</html>
    `
    return htmlContent
  }

  const handleExportPdf = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const htmlContent = generatePdfContent()

      // Create a hidden iframe for printing
      const iframe = document.createElement('iframe')
      iframe.style.position = 'absolute'
      iframe.style.width = '0'
      iframe.style.height = '0'
      iframe.style.border = 'none'
      document.body.appendChild(iframe)

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (!iframeDoc) throw new Error('Cannot access iframe document')

      iframeDoc.open()
      iframeDoc.write(htmlContent)
      iframeDoc.close()

      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 500))

      // Trigger print
      iframe.contentWindow?.print()

      // Remove iframe after print dialog
      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 1000)

      setIsGenerated(true)
      setTimeout(() => setIsGenerated(false), 2000)

    } catch (err) {
      console.error('PDF generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate PDF')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      onClick={handleExportPdf}
      disabled={isGenerating}
      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200"
      style={{
        backgroundColor: isGenerated ? '#10b981' : '#374151',
      }}
      onMouseEnter={(e) => {
        if (!isGenerating) {
          e.currentTarget.style.backgroundColor = '#1f2937'
        }
      }}
      onMouseLeave={(e) => {
        if (!isGenerating) {
          e.currentTarget.style.backgroundColor = isGenerated ? '#10b981' : '#374151'
        }
      }}
    >
      {isGenerating ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : isGenerated ? (
        <>
          <CheckCircle size={18} />
          <span>PDF Saved!</span>
        </>
      ) : (
        <>
          <FileDown size={18} />
          <span>Export PDF</span>
        </>
      )}
    </button>
  )
}