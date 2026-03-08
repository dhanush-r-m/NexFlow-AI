'use client'
import { useState } from 'react'
import { useAgent } from '@/lib/useAgent'

export default function AgentPage() {
  const [trigger, setTrigger] = useState('Stripe')
  const [action, setAction] = useState('HubSpot')
  const [request, setRequest] = useState('')
  const { runAgent, loading, response, error } = useAgent()

  const handleSubmit = () => {
    if (!request.trim()) return
    runAgent(request, trigger, action)
  }

  return (
    <div className="min-h-screen bg-[#070B12] p-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-100"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            AI Agent
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Describe your integration in plain English
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-[#0D1420] border border-white/[0.06] 
        rounded-xl p-6 mb-6">
          
          {/* API Selectors */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-slate-500 
              uppercase tracking-wider font-bold mb-2 block">
                Trigger API
              </label>
              <input
                value={trigger}
                onChange={e => setTrigger(e.target.value)}
                className="w-full bg-slate-800/50 border 
                border-white/[0.06] rounded-lg px-3 py-2 
                text-sm text-slate-100 outline-none 
                focus:border-[#00E5A0] transition-colors"
                placeholder="e.g. Stripe"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 
              uppercase tracking-wider font-bold mb-2 block">
                Action API
              </label>
              <input
                value={action}
                onChange={e => setAction(e.target.value)}
                className="w-full bg-slate-800/50 border 
                border-white/[0.06] rounded-lg px-3 py-2 
                text-sm text-slate-100 outline-none 
                focus:border-[#00E5A0] transition-colors"
                placeholder="e.g. HubSpot"
              />
            </div>
          </div>

          {/* Request Input */}
          <div className="mb-4">
            <label className="text-xs text-slate-500 
            uppercase tracking-wider font-bold mb-2 block">
              What should happen?
            </label>
            <textarea
              value={request}
              onChange={e => setRequest(e.target.value)}
              rows={3}
              className="w-full bg-slate-800/50 border 
              border-white/[0.06] rounded-lg px-3 py-2 
              text-sm text-slate-100 outline-none 
              focus:border-[#00E5A0] transition-colors 
              resize-none placeholder:text-slate-600"
              placeholder="e.g. When a payment succeeds in Stripe, create a new contact in HubSpot with their email and payment amount"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !request.trim()}
            className="w-full bg-gradient-to-r from-[#00E5A0] 
            to-cyan-400 text-slate-900 font-bold text-sm py-2.5 
            rounded-lg hover:opacity-90 transition-opacity 
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Agent thinking...' : '⚡ Generate Integration Plan'}
          </button>
        </div>

        {/* Response */}
        {loading && (
          <div className="bg-[#0D1420] border border-[#00E5A0]/20 
          rounded-xl p-6 text-center">
            <div className="w-8 h-8 border-2 border-[#00E5A0] 
            border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm">
              Agent is analyzing APIs...
            </p>
          </div>
        )}

        {response && (
          <div className="bg-[#0D1420] border border-[#00E5A0]/20 
          rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#00E5A0] 
              animate-pulse" />
              <span className="text-xs text-[#00E5A0] font-bold 
              uppercase tracking-wider">
                Integration Plan Ready
              </span>
            </div>
            <div className="text-sm text-slate-300 leading-relaxed 
            whitespace-pre-wrap">
              {response}
            </div>
          </div>
        )}

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