'use client'
import { useState } from 'react'

interface SyncResult {
  synced: number
  failed: number
  results: { email: string; amount: number }[]
  errors: { email: string; error: string }[]
}

export default function StripeHubSpotPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SyncResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [payments, setPayments] = useState<any[]>([])

  async function fetchPayments() {
    setLoading(true)
    try {
      const res = await fetch('/api/integrations/stripe-hubspot')
      const data = await res.json()
      if (data.success) setPayments(data.payments)
    } catch {
      setError('Failed to fetch payments')
    } finally {
      setLoading(false)
    }
  }

  async function runSync() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/integrations/stripe-hubspot', {
        method: 'POST',
      })
      const data = await res.json()
      if (data.success) setResult(data)
      else setError(data.error)
    } catch {
      setError('Sync failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070B12] p-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 
            border border-indigo-500/30 flex items-center 
            justify-center text-indigo-400 font-bold text-xs">
              S
            </div>
            <span className="text-slate-400">→</span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 
            border border-orange-500/30 flex items-center 
            justify-center text-orange-400 font-bold text-xs">
              H
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-100"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Stripe → HubSpot
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Sync successful Stripe payments as HubSpot contacts
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={fetchPayments}
            disabled={loading}
            className="flex-1 bg-[#0D1420] border 
            border-white/[0.06] text-slate-300 font-bold 
            text-sm py-3 rounded-xl hover:border-[#00E5A0]/30 
            transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : '👀 Preview Payments'}
          </button>
          <button
            onClick={runSync}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-[#00E5A0] 
            to-cyan-400 text-slate-900 font-bold text-sm py-3 
            rounded-xl hover:opacity-90 transition-opacity 
            disabled:opacity-50"
          >
            {loading ? 'Syncing...' : '⚡ Sync to HubSpot'}
          </button>
        </div>

        {/* Payments Preview */}
        {payments.length > 0 && (
          <div className="bg-[#0D1420] border border-white/[0.06] 
          rounded-xl overflow-hidden mb-6">
            <div className="p-4 border-b border-white/[0.06]">
              <h3 className="text-sm font-bold text-slate-100"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Recent Stripe Payments
              </h3>
            </div>
            {payments.map((p, i) => (
              <div key={i} className="flex items-center 
              justify-between px-4 py-3 border-b 
              border-white/[0.04] last:border-0 
              hover:bg-white/[0.02] transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    {p.email || 'No email'}
                  </p>
                  <p className="text-xs text-slate-500">{p.created}</p>
                </div>
                <span className="text-sm font-bold text-[#00E5A0]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  ${p.amount}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Sync Result */}
        {result && (
          <div className="bg-[#0D1420] border border-[#00E5A0]/20 
          rounded-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#00E5A0]" />
              <span className="text-xs text-[#00E5A0] font-bold 
              uppercase tracking-wider">Sync Complete</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-[#00E5A0]/10 rounded-lg p-3 
              text-center">
                <p className="text-2xl font-bold text-[#00E5A0]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {result.synced}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Contacts Synced
                </p>
              </div>
              <div className="bg-rose-500/10 rounded-lg p-3 
              text-center">
                <p className="text-2xl font-bold text-rose-400"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {result.failed}
                </p>
                <p className="text-xs text-slate-400 mt-1">Failed</p>
              </div>
            </div>
            {(result.results || []).map((r, i) => (
              <div key={i} className="flex justify-between 
              items-center py-2 border-b border-white/[0.04] 
              last:border-0">
                <span className="text-sm text-slate-300">
                  {r.email}
                </span>
                <span className="text-sm font-bold text-[#00E5A0]">
                  ${r.amount} synced ✓
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 
          rounded-xl p-4">
            <p className="text-rose-400 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}