'use client'

/**
 * ParamAI Frontend — Help/Tutorial Page
 * Complete guide on how to use the ParamAI system
 *
 * Competition: AI Open Innovation Challenge 2026
 * Team: Kebut Semalam, President University
 */

import { useState } from 'react'
import {
  BookOpen,
  Play,
  FileText,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Copy,
  Download,
  Clock,
  Search,
  BarChart3,
  HelpCircle,
} from 'lucide-react'

// FAQ Item Component
function FaqItem({
  question,
  answer,
}: {
  question: string
  answer: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        marginBottom: '12px',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left transition-colors"
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <div className="flex items-center gap-3">
          <HelpCircle size={20} style={{ color: '#4F6EF7' }} />
          <span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>
            {question}
          </span>
        </div>
        {isOpen ? (
          <ChevronDown size={20} style={{ color: '#6b7280' }} />
        ) : (
          <ChevronRight size={20} style={{ color: '#6b7280' }} />
        )}
      </button>

      {isOpen && (
        <div
          className="px-4 pb-4 pt-0"
          style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}
        >
          <p className="text-sm" style={{ color: '#6b7280' }}>
            {answer}
          </p>
        </div>
      )}
    </div>
  )
}

// Step Card Component
function StepCard({
  step,
  title,
  description,
  icon,
  tips,
}: {
  step: number
  title: string
  description: string
  icon: React.ReactNode
  tips?: string[]
}) {
  return (
    <div
      className="p-6 rounded-xl"
      style={{
        backgroundColor: 'white',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="flex items-start gap-4">
        {/* Step Number */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #4F6EF7 0%, #6B83F8 100%)' }}
        >
          {step}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div style={{ color: '#4F6EF7' }}>{icon}</div>
            <h3 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>
              {title}
            </h3>
          </div>

          <p className="text-sm mb-3" style={{ color: '#6b7280' }}>
            {description}
          </p>

          {tips && tips.length > 0 && (
            <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: '#eff6ff' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: '#1e40af' }}>
                <span style={{ marginRight: '4px' }}>&#9432;</span> Tips:
              </p>
              <ul className="space-y-1">
                {tips.map((tip, i) => (
                  <li key={i} className="text-xs flex items-start gap-2" style={{ color: '#1e40af' }}>
                    <CheckCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: '#10b981' }} />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState<'tutorial' | 'features' | 'faq'>('tutorial')

  const tabs = [
    { id: 'tutorial' as const, label: 'Step-by-Step Guide', icon: <BookOpen size={16} /> },
    { id: 'features' as const, label: 'Feature Overview', icon: <BarChart3 size={16} /> },
    { id: 'faq' as const, label: 'FAQ', icon: <HelpCircle size={16} /> },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#D8DAE7' }}>
      {/* Top Bar */}
      <div
        className="px-6 py-5"
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #4F6EF7 0%, #8B5CF6 100%)' }}
          >
            <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>
              Help & Tutorial
            </h1>
            <p className="text-sm" style={{ color: '#6b7280' }}>
              Learn how to use ParamAI effectively
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tab Navigation */}
        <div
          className="flex gap-2 p-1 rounded-xl mb-6"
          style={{ backgroundColor: 'white', width: 'fit-content' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={
                activeTab === tab.id
                  ? { backgroundColor: '#384884', color: 'white' }
                  : { color: '#6b7280' }
              }
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* TUTORIAL TAB */}
        {activeTab === 'tutorial' && (
          <div className="space-y-6">
            {/* Introduction */}
            <div
              className="p-6 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #384884 0%, #4F6EF7 100%)',
                color: 'white',
              }}
            >
              <h2 className="text-xl font-bold mb-3">Welcome to ParamAI!</h2>
              <p className="text-white/90 text-sm mb-4">
                ParamAI is an AI-powered system that helps identify the correct BPOM testing
                parameters for your food, beverage, and supplement products. This guide will
                walk you through the complete process.
              </p>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>~2 minutes per query</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle size={14} />
                  <span>26+ BPOM parameters</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText size={14} />
                  <span>Regulation citations included</span>
                </div>
              </div>
            </div>

            {/* Step-by-Step Guide */}
            <h2 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>
              Step-by-Step Guide
            </h2>

            <StepCard
              step={1}
              title="Navigate to Simulator"
              description="Go to the Simulator page from the sidebar navigation. This is where you input product information and receive recommendations."
              icon={<Search size={20} />}
              tips={[
                'Access via sidebar menu or URL: /simulator',
                'The simulator is optimized for product classification',
              ]}
            />

            <StepCard
              step={2}
              title="Enter Product Information"
              description="Fill in the product details form. The more information you provide, the more accurate the classification will be."
              icon={<FileText size={20} />}
              tips={[
                'Product Name is required (minimum)',
                'Include ingredients for better accuracy',
                'Production method helps identify the category',
                'Health claims can affect classification',
              ]}
            />

            <StepCard
              step={3}
              title="Click Analyze"
              description="Press the 'Analyze Product' button to submit your query. The system will process your input through AI entity extraction and BPOM rule matching."
              icon={<Play size={20} />}
              tips={[
                'Wait for the loading animation to complete',
                'You can see the processing steps in real-time',
                'Average processing time: 2-5 seconds',
              ]}
            />

            <StepCard
              step={4}
              title="Review the Results"
              description="The recommendation will show the matched BPOM category, confidence score, and required testing parameters. Review the results carefully."
              icon={<BarChart3 size={20} />}
              tips={[
                'Check the confidence score (higher = more accurate)',
                'Review alternative categories if flagged',
                'Note the disclaimer about expert verification',
              ]}
            />

            <StepCard
              step={5}
              title="Export & Save"
              description="Use the action buttons to copy citations, export as PDF, or save to history for future reference."
              icon={<Download size={20} />}
              tips={[
                'Copy Citations in 3 formats: Plain Text, Structured, Markdown',
                'Export PDF creates a printable official report',
                'History page stores all your past queries',
              ]}
            />

            {/* Important Notice */}
            <div
              className="p-4 rounded-xl flex items-start gap-3"
              style={{ backgroundColor: '#fffbeb', border: '1px solid #fcd34d' }}
            >
              <AlertTriangle size={20} style={{ color: '#f59e0b' }} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold" style={{ color: '#92400e' }}>
                  Important Disclaimer
                </p>
                <p className="text-xs mt-1" style={{ color: '#a16207' }}>
                  All recommendations should be verified by a BPOM regulatory expert before
                  communicating to clients. ParamAI is a decision support tool, not a
                  replacement for professional judgment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FEATURES TAB */}
        {activeTab === 'features' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Simulator */}
              <div
                className="p-6 rounded-xl"
                style={{
                  backgroundColor: 'white',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: '#eff6ff' }}
                  >
                    <Search size={20} style={{ color: '#4F6EF7' }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>
                    Product Simulator
                  </h3>
                </div>
                <p className="text-sm mb-4" style={{ color: '#6b7280' }}>
                  The main interface for entering product information and receiving BPOM
                  parameter recommendations. Features real-time API status and loading
                  indicators.
                </p>
                <ul className="space-y-2 text-sm" style={{ color: '#374151' }}>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} style={{ color: '#10b981' }} />
                    Product information form
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} style={{ color: '#10b981' }} />
                    Sample product quick-fill
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} style={{ color: '#10b981' }} />
                    Real-time validation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} style={{ color: '#10b981' }} />
                    Loading step tracker
                  </li>
                </ul>
              </div>

              {/* Copy Citations */}
              <div
                className="p-6 rounded-xl"
                style={{
                  backgroundColor: 'white',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: '#d1fae5' }}
                  >
                    <Copy size={20} style={{ color: '#065f46' }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>
                    Copy Citations
                  </h3>
                </div>
                <p className="text-sm mb-4" style={{ color: '#6b7280' }}>
                  Export regulation citations in multiple formats for documentation,
                  reports, or communication with clients.
                </p>
                <ul className="space-y-2 text-sm" style={{ color: '#374151' }}>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} style={{ color: '#10b981' }} />
                    Plain Text List format
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} style={{ color: '#10b981' }} />
                    Structured Report format
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} style={{ color: '#10b981' }} />
                    Markdown Table format
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} style={{ color: '#10b981' }} />
                    One-click clipboard copy
                  </li>
                </ul>
              </div>

              {/* PDF Export */}
              <div
                className="p-6 rounded-xl"
                style={{
                  backgroundColor: 'white',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: '#fce7f3' }}
                  >
                    <Download size={20} style={{ color: '#9d174d' }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>
                    PDF Export
                  </h3>
                </div>
                <p className="text-sm mb-4" style={{ color: '#6b7280' }}>
                  Generate professional PDF reports for official documentation,
                  client presentations, or regulatory submissions.
                </p>
                <ul className="space-y-2 text-sm" style={{ color: '#374151' }}>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} style={{ color: '#10b981' }} />
                    Print-ready formatting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} style={{ color: '#10b981' }} />
                    Professional header/footer
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} style={{ color: '#10b981' }} />
                    Complete parameter table
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} style={{ color: '#10b981' }} />
                    Regulation citations included
                  </li>
                </ul>
              </div>

              {/* Dashboard */}
              <div
                className="p-6 rounded-xl"
                style={{
                  backgroundColor: 'white',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: '#f3e8ff' }}
                  >
                    <BarChart3 size={20} style={{ color: '#7c3aed' }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>
                    Dashboard
                  </h3>
                </div>
                <p className="text-sm mb-4" style={{ color: '#6b7280' }}>
                  Overview of system performance, query statistics, and category
                  distribution analytics.
                </p>
                <ul className="space-y-2 text-sm" style={{ color: '#374151' }}>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} style={{ color: '#10b981' }} />
                    KPI cards with metrics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} style={{ color: '#10b981' }} />
                    Query history table
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} style={{ color: '#10b981' }} />
                    Category distribution chart
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} style={{ color: '#10b981' }} />
                    Performance trends
                  </li>
                </ul>
              </div>
            </div>

            {/* API Status Info */}
            <div
              className="p-6 rounded-xl"
              style={{
                backgroundColor: 'white',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#dbeafe' }}
                >
                  <MessageSquare size={20} style={{ color: '#1e40af' }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>
                    AI-Powered Classification
                  </h3>
                  <p className="text-sm" style={{ color: '#6b7280' }}>
                    Powered by Snifox AI with Claude Sonnet model
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
                  <p className="font-semibold" style={{ color: '#1a1a2e' }}>
                    Entity Extraction
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
                    AI understands informal product descriptions and extracts
                    structured information.
                  </p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
                  <p className="font-semibold" style={{ color: '#1a1a2e' }}>
                    BPOM Rule Engine
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
                    Maps products to correct BPOM categories using weighted
                    scoring algorithm.
                  </p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
                  <p className="font-semibold" style={{ color: '#1a1a2e' }}>
                    Parameter Generation
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
                    Returns all required testing parameters with official
                    regulation citations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ TAB */}
        {activeTab === 'faq' && (
          <div className="max-w-3xl">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a2e' }}>
              Frequently Asked Questions
            </h2>

            <FaqItem
              question="What is the confidence score?"
              answer="The confidence score indicates how well the AI matched your product to a BPOM category. Scores above 80% are considered high confidence. Below 80%, the system will flag for expert review and show alternative category candidates."
            />

            <FaqItem
              question="What do I do if the category confidence is low?"
              answer="When confidence is below 80%, review the suggested alternative categories. If unsure, consult a BPOM regulatory specialist for the final classification decision. You can also add more product details (ingredients, production method) to improve accuracy."
            />

            <FaqItem
              question="What BPOM categories are supported?"
              answer="Currently supported categories include: 07.1 (Crackers, Cookies, Biscuits), 14.1 (Non-Alcoholic Beverages), supplement (Dietary/Health Supplements), 01.2 (Fermented Milk Products), and 08.3 (Processed Meat). More categories are being added."
            />

            <FaqItem
              question="How accurate are the parameters?"
              answer="Parameters are sourced from official BPOM regulations (PerBPOM No. 34/2019, 16/2016, 5/2018, 22/2019, etc.) and Indonesian National Standards (SNI). However, regulations may be updated periodically, so always verify with the latest official sources."
            />

            <FaqItem
              question="Can I export the recommendation?"
              answer="Yes! You can copy citations in 3 formats (Plain Text, Structured, Markdown) or export as a professional PDF report. PDF reports include all parameters, regulation citations, and the required disclaimer."
            />

            <FaqItem
              question="Is my query data stored?"
              answer="Query history is stored in-memory during your session. No personally identifiable information is stored. The history is cleared when the server restarts. No data is shared or sent to third parties."
            />

            <FaqItem
              question="How do I interpret the regulation citations?"
              answer="Citations follow the format: 'PerBPOM No. XX/YYYY Article/Clause/Section'. For example, 'PerBPOM No. 34/2019 Clause 4.1' refers to Article 34 of 2019 regulation, Clause 4.1. You can verify these on the official BPOM website."
            />

            <FaqItem
              question="What if my product doesn't match any category?"
              answer="If no category matches above the threshold, the system will return the closest matches with their confidence scores. You should consult a BPOM expert for borderline cases. The system is designed to assist, not replace, professional judgment."
            />

            <FaqItem
              question="How can I improve classification accuracy?"
              answer="1) Provide complete product information (name, ingredients, production method). 2) Include specific details like baking temperature, fermentation time, etc. 3) Specify target consumer group. 4) List any health claims made on the packaging."
            />

            <FaqItem
              question="Who should I contact for support?"
              answer="For technical issues, contact the development team. For regulatory/BPOM questions, consult a BPOM regulatory specialist. Remember that ParamAI is a decision support tool and recommendations should be verified by experts."
            />
          </div>
        )}
      </div>

      {/* Footer Spacer */}
      <div style={{ height: '48px' }}></div>
    </div>
  )
}