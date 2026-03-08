'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser, UserButton } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'

const Icons = {
  dashboard: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  integrations: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="12" y1="7" x2="5" y2="17"/><line x1="12" y1="7" x2="19" y2="17"/></svg>,
  logs: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
  settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  bolt: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  refresh: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  agent: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  external: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
}

const navItems = [
  { label: 'Dashboard', Icon: Icons.dashboard },
  { label: 'Integrations', Icon: Icons.integrations },
  { label: 'Logs', Icon: Icons.logs },
  { label: 'Settings', Icon: Icons.settings },
]

// ── DASHBOARD PAGE ────────────────────────────────────────────────────────────
function DashboardPage({ onNav }: { onNav: (page: string) => void }) {
  const router = useRouter()
  const [logs, setLogs] = useState<any[]>([])
  const [syncedCount, setSyncedCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('integration_logs').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('synced_payments').select('id', { count: 'exact', head: true }),
    ]).then(([logsRes, countRes]) => {
      setLogs(logsRes.data || [])
      setSyncedCount(countRes.count || 0)
      setLoading(false)
    })
  }, [])

  const successCount = logs.filter(l => l.status === 'success').length
  const errorCount = logs.filter(l => l.status === 'error').length
  const successRate = logs.length ? Math.round((successCount / logs.length) * 100) : 0

  const stats = [
    { label: 'Active Integrations', value: '1', color: '#00E5A0', sub: 'Stripe → HubSpot' },
    { label: 'Contacts Synced', value: String(syncedCount), color: '#22d3ee', sub: 'via auto sync' },
    { label: 'Success Rate', value: logs.length ? `${successRate}%` : '—', color: '#34d399', sub: 'last 5 runs' },
    { label: 'Errors', value: String(errorCount), color: errorCount > 0 ? '#f43f5e' : '#34d399', sub: 'last 5 runs' },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <div key={i} className="bg-[#0D1420] border border-white/[0.06] p-6 rounded-xl hover:border-[#00E5A0]/20 transition-colors">
            <p className="text-xs text-slate-500 font-medium mb-3">{s.label}</p>
            <p className="font-display text-3xl font-bold mb-1" style={{ color: s.color, fontFamily: 'Space Grotesk, sans-serif' }}>
              {loading ? '—' : s.value}
            </p>
            <p className="text-xs text-slate-600">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-5">
        <button onClick={() => router.push('/dashboard/agent')}
          className="bg-[#0D1420] border border-white/[0.06] p-6 rounded-xl hover:border-[#00E5A0]/30 transition-all text-left group">
          <div className="w-10 h-10 bg-[#00E5A0]/10 rounded-xl flex items-center justify-center text-[#00E5A0] mb-4 group-hover:scale-110 transition-transform">
            <Icons.agent />
          </div>
          <h3 className="font-bold text-slate-100 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>AI Agent</h3>
          <p className="text-xs text-slate-500">Describe an integration in plain English</p>
        </button>
        <button onClick={() => onNav('Integrations')}
          className="bg-[#0D1420] border border-white/[0.06] p-6 rounded-xl hover:border-[#00E5A0]/30 transition-all text-left group">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
            <Icons.integrations />
          </div>
          <h3 className="font-bold text-slate-100 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Stripe → HubSpot</h3>
          <p className="text-xs text-slate-500">Sync payments to contacts automatically</p>
        </button>
        <button onClick={() => router.push('/pricing')}
          className="bg-gradient-to-br from-[#00E5A0]/8 to-cyan-500/5 border border-[#00E5A0]/20 p-6 rounded-xl hover:border-[#00E5A0]/40 transition-all text-left group">
          <div className="w-10 h-10 bg-[#00E5A0]/20 rounded-xl flex items-center justify-center text-[#00E5A0] mb-4 group-hover:scale-110 transition-transform">
            <Icons.bolt />
          </div>
          <h3 className="font-bold text-slate-100 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Upgrade Plan</h3>
          <p className="text-xs text-slate-500">Unlock unlimited integrations</p>
        </button>
      </div>

      {/* Recent activity */}
      <div className="bg-[#0D1420] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="font-bold text-slate-100" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Recent Activity</h2>
          <button onClick={() => onNav('Logs')} className="text-xs text-slate-500 hover:text-[#00E5A0] transition-colors font-bold uppercase tracking-wider">
            View All
          </button>
        </div>
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-5 h-5 border-2 border-[#00E5A0] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : logs.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-slate-500 text-sm">No activity yet</p>
            <p className="text-slate-600 text-xs mt-1">Run a sync to see logs here</p>
          </div>
        ) : logs.map((log, i) => (
          <div key={log.id} className={`flex items-start gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors ${i < logs.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${log.status === 'success' ? 'bg-[#00E5A0]' : 'bg-rose-500'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-300">{log.message}</p>
              <p className="text-xs text-slate-600 mt-0.5">{new Date(log.created_at).toLocaleString()}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded flex-shrink-0 ${log.status === 'success' ? 'bg-[#00E5A0]/10 text-[#00E5A0]' : 'bg-rose-500/10 text-rose-400'}`}>
              {log.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── INTEGRATIONS PAGE ─────────────────────────────────────────────────────────
function IntegrationsPage() {
  const router = useRouter()
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [loadingPayments, setLoadingPayments] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchPayments() {
    setLoadingPayments(true)
    setError(null)
    try {
      const res = await fetch('/api/integrations/stripe-hubspot')
      const data = await res.json()
      if (data.success) setPayments(data.payments || [])
      else setError(data.error)
    } catch { setError('Failed to fetch') }
    setLoadingPayments(false)
  }

  async function runSync() {
    setSyncing(true)
    setSyncResult(null)
    setError(null)
    try {
      const res = await fetch('/api/integrations/stripe-hubspot', { method: 'POST' })
      const data = await res.json()
      if (data.success) setSyncResult(data)
      else setError(data.error)
    } catch { setError('Sync failed') }
    setSyncing(false)
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl text-slate-100" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Integrations</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your active API connections</p>
        </div>
        <button onClick={() => router.push('/dashboard/agent')}
          className="flex items-center gap-2 bg-gradient-to-r from-[#00E5A0] to-cyan-400 text-slate-900 font-bold text-sm px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
          <Icons.plus /> New Integration
        </button>
      </div>

      {/* Stripe → HubSpot card */}
      <div className="bg-[#0D1420] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">S→H</div>
            <div>
              <h3 className="font-bold text-slate-100" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Stripe → HubSpot</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00E5A0] animate-pulse" />
                <span className="text-xs text-slate-400">Active · Auto-syncing every 60s</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchPayments} disabled={loadingPayments}
              className="text-xs px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors flex items-center gap-1.5 disabled:opacity-50">
              <Icons.search /> {loadingPayments ? 'Loading...' : 'Preview Payments'}
            </button>
            <button onClick={runSync} disabled={syncing}
              className="text-xs px-3 py-2 bg-[#00E5A0]/10 hover:bg-[#00E5A0]/20 border border-[#00E5A0]/20 rounded-lg text-[#00E5A0] transition-colors flex items-center gap-1.5 disabled:opacity-50">
              <Icons.refresh /> {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-white/[0.04]">
          {[
            { label: 'Integration Type', value: 'Payment → CRM' },
            { label: 'Trigger', value: 'Stripe Payment Success' },
            { label: 'Action', value: 'Create HubSpot Contact' },
          ].map((item, i) => (
            <div key={i} className="p-4">
              <p className="text-xs text-slate-500 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-slate-300">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Payments preview */}
        {payments.length > 0 && (
          <div className="border-t border-white/[0.04] p-6">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">Recent Stripe Payments</p>
            <div className="space-y-2">
              {payments.map((p, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0">
                  <span className="text-sm text-slate-300">{p.email || 'No email'}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{p.created}</span>
                    <span className="text-sm font-bold text-[#00E5A0]">${p.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sync result */}
        {syncResult && (
          <div className="border-t border-white/[0.04] p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#00E5A0]" />
              <span className="text-xs text-[#00E5A0] font-bold uppercase tracking-wider">Sync Complete</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#00E5A0]/10 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-[#00E5A0]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{syncResult.synced || 0}</p>
                <p className="text-xs text-slate-500 mt-1">Contacts Synced</p>
              </div>
              <div className="bg-rose-500/10 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-rose-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{syncResult.failed || 0}</p>
                <p className="text-xs text-slate-500 mt-1">Failed</p>
              </div>
            </div>
            {(syncResult.results || []).map((r: any, i: number) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0 mt-3">
                <span className="text-sm text-slate-300">{r.email}</span>
                <span className="text-sm font-bold text-[#00E5A0]">${r.amount} synced ✓</span>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="border-t border-white/[0.04] p-4">
            <p className="text-sm text-rose-400">{error}</p>
          </div>
        )}
      </div>

      {/* Add more */}
      <div className="bg-[#0D1420] border border-dashed border-white/10 rounded-xl p-10 text-center">
        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 text-slate-400">
          <Icons.plus />
        </div>
        <h3 className="font-bold text-slate-300 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Add New Integration</h3>
        <p className="text-slate-500 text-sm mb-5">Use the AI agent to connect any two APIs in minutes</p>
        <button onClick={() => router.push('/dashboard/agent')}
          className="bg-gradient-to-r from-[#00E5A0] to-cyan-400 text-slate-900 font-bold text-sm px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
          Open AI Agent
        </button>
      </div>
    </div>
  )
}

// ── LOGS PAGE ─────────────────────────────────────────────────────────────────
function LogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'success' | 'error'>('all')

  useEffect(() => {
    fetchLogs()
    const channel = supabase.channel('logs-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'integration_logs' },
        (payload) => setLogs(prev => [payload.new as any, ...prev]))
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchLogs() {
    setLoading(true)
    const { data } = await supabase.from('integration_logs').select('*').order('created_at', { ascending: false }).limit(50)
    setLogs(data || [])
    setLoading(false)
  }

  const filtered = filter === 'all' ? logs : logs.filter(l => l.status === filter)
  const successCount = logs.filter(l => l.status === 'success').length
  const errorCount = logs.filter(l => l.status === 'error').length

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl text-slate-100" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Activity Logs</h2>
          <p className="text-slate-500 text-sm mt-1">Real-time integration event history</p>
        </div>
        <button onClick={fetchLogs}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 bg-[#0D1420] border border-white/[0.06] px-3 py-2 rounded-lg transition-colors">
          <Icons.refresh /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Events', value: logs.length, color: 'text-slate-100' },
          { label: 'Successful', value: successCount, color: 'text-[#00E5A0]' },
          { label: 'Errors', value: errorCount, color: 'text-rose-400' },
        ].map((s, i) => (
          <div key={i} className="bg-[#0D1420] border border-white/[0.06] rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{loading ? '—' : s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'success', 'error'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${filter === f ? 'bg-[#00E5A0]/10 text-[#00E5A0] border border-[#00E5A0]/20' : 'bg-slate-800/50 text-slate-500 hover:text-slate-300 border border-transparent'}`}>
            {f} {f !== 'all' && `(${f === 'success' ? successCount : errorCount})`}
          </button>
        ))}
      </div>

      {/* Log list */}
      <div className="bg-[#0D1420] border border-white/[0.06] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-6 h-6 border-2 border-[#00E5A0] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-500 text-sm">No {filter !== 'all' ? filter : ''} logs found</p>
            <p className="text-slate-600 text-xs mt-1">Run a sync to generate activity</p>
          </div>
        ) : filtered.map((log, i) => (
          <div key={log.id} className={`flex items-start gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors ${i < filtered.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${log.status === 'success' ? 'bg-[#00E5A0]' : 'bg-rose-500'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-300">{log.message}</p>
              <p className="text-xs text-slate-600 mt-0.5">{new Date(log.created_at).toLocaleString()}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded flex-shrink-0 ${log.status === 'success' ? 'bg-[#00E5A0]/10 text-[#00E5A0]' : 'bg-rose-500/10 text-rose-400'}`}>
              {log.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SETTINGS PAGE ─────────────────────────────────────────────────────────────
function SettingsPage() {
  const { user } = useUser()
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [notifs, setNotifs] = useState({ success: true, error: true, weekly: false })

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-8 space-y-6 max-w-2xl">
      <div>
        <h2 className="font-bold text-2xl text-slate-100" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Settings</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="bg-[#0D1420] border border-white/[0.06] rounded-xl p-6">
        <h3 className="font-bold text-slate-200 mb-5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Profile</h3>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-xl text-white flex-shrink-0">
            {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-bold text-slate-100">{user?.firstName || ''} {user?.lastName || ''}</p>
            <p className="text-sm text-slate-500">{user?.emailAddresses?.[0]?.emailAddress || ''}</p>
            <p className="text-xs text-slate-600 mt-0.5">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</p>
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1.5">Email Address</label>
          <input readOnly value={user?.emailAddresses?.[0]?.emailAddress || ''}
            className="w-full bg-slate-800/50 border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-slate-400 outline-none cursor-not-allowed" />
        </div>
      </div>

      {/* Current plan */}
      <div className="bg-[#0D1420] border border-white/[0.06] rounded-xl p-6">
        <h3 className="font-bold text-slate-200 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Current Plan</h3>
        <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-white/[0.06] mb-4">
          <div>
            <p className="font-bold text-slate-100">Free Plan</p>
            <p className="text-xs text-slate-500 mt-0.5">1 integration · Basic features</p>
          </div>
          <span className="text-xs font-bold text-slate-400 bg-slate-700 px-2.5 py-1 rounded-lg">FREE</span>
        </div>
        <button onClick={() => router.push('/pricing')}
          className="w-full bg-gradient-to-r from-[#00E5A0] to-cyan-400 text-slate-900 font-bold text-sm py-3 rounded-xl hover:opacity-90 transition-opacity">
          Upgrade to Growth — $299/month
        </button>
      </div>

      {/* API Keys */}
      <div className="bg-[#0D1420] border border-white/[0.06] rounded-xl p-6">
        <h3 className="font-bold text-slate-200 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>API Keys</h3>
        <p className="text-xs text-slate-500 mb-5">Stored securely in your .env.local file</p>
        <div className="space-y-3">
          {[
            { label: 'Stripe Secret Key', value: 'sk_test_••••••••••••••' },
            { label: 'HubSpot Access Token', value: 'pat-na1-••••••••••••' },
            { label: 'Gemini API Key', value: 'AIza••••••••••••••••' },
            { label: 'Supabase URL', value: 'https://••••••.supabase.co' },
          ].map((k, i) => (
            <div key={i}>
              <label className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1.5">{k.label}</label>
              <input readOnly value={k.value}
                className="w-full bg-slate-800/50 border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-slate-400 font-mono outline-none cursor-not-allowed" />
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600 mt-3">To update keys, edit .env.local and restart your server.</p>
      </div>

      {/* Notifications */}
      <div className="bg-[#0D1420] border border-white/[0.06] rounded-xl p-6">
        <h3 className="font-bold text-slate-200 mb-5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Notifications</h3>
        <div className="space-y-5">
          {[
            { key: 'success', label: 'Sync success alerts', desc: 'Get notified when a sync completes successfully' },
            { key: 'error', label: 'Error alerts', desc: 'Get notified immediately when a sync fails' },
            { key: 'weekly', label: 'Weekly digest', desc: 'Weekly summary of your integration activity' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-200">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifs(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                className={`w-10 h-6 rounded-full transition-colors relative flex-shrink-0 ${notifs[item.key as keyof typeof notifs] ? 'bg-[#00E5A0]' : 'bg-slate-700'}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notifs[item.key as keyof typeof notifs] ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </div>
        <button onClick={handleSave}
          className={`mt-6 w-full py-3 rounded-xl font-bold text-sm transition-all border ${saved ? 'bg-[#00E5A0]/10 text-[#00E5A0] border-[#00E5A0]/20' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/[0.06]'}`}>
          {saved ? '✓ Preferences Saved!' : 'Save Preferences'}
        </button>
      </div>

      {/* Danger zone */}
      <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-6">
        <h3 className="font-bold text-rose-400 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Danger Zone</h3>
        <p className="text-xs text-slate-500 mb-4">These actions are permanent and cannot be undone.</p>
        <button className="text-sm text-rose-400 border border-rose-500/30 px-4 py-2 rounded-lg hover:bg-rose-500/10 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  )
}

// ── MAIN SHELL ────────────────────────────────────────────────────────────────
export default function NexflowDashboard() {
  const [activeNav, setActiveNav] = useState('Dashboard')
  const { user } = useUser()
  const router = useRouter()

  const renderPage = () => {
    switch (activeNav) {
      case 'Dashboard': return <DashboardPage onNav={setActiveNav} />
      case 'Integrations': return <IntegrationsPage />
      case 'Logs': return <LogsPage />
      case 'Settings': return <SettingsPage />
      default: return <DashboardPage onNav={setActiveNav} />
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="bg-[#070B12] text-slate-100 flex min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:wght@400;500;700&display=swap');
      `}</style>

      {/* SIDEBAR */}
      <aside className="w-[230px] bg-[#0A0F1C] border-r border-white/[0.06] flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-6 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push('/')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 flex-shrink-0">
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'white', fontSize: 16 }}>N</span>
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 20, letterSpacing: '-0.5px' }}>Nexflow</span>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-2">
          <div className="pb-2 px-2">
            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Main</p>
          </div>
          {navItems.map(({ label, Icon }) => {
            const isActive = activeNav === label
            return (
              <button key={label} onClick={() => setActiveNav(label)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'text-[#00E5A0] bg-[#00E5A0]/10 border-r-2 border-[#00E5A0]' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'}`}>
                <Icon />
                {label}
              </button>
            )
          })}

          <div className="pt-4 pb-2 px-2">
            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Quick Access</p>
          </div>
          <button onClick={() => router.push('/dashboard/agent')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all">
            <Icons.agent />
            AI Agent
          </button>
          <button onClick={() => router.push('/dashboard/integrations/stripe-hubspot')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all">
            <Icons.external />
            Stripe → HubSpot
          </button>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-2 py-2">
            <UserButton afterSignOutUrl="/" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-slate-100 truncate">
                {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'You'}
              </span>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Free Plan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 ml-[230px] flex flex-col min-w-0">
        <header className="h-16 border-b border-white/[0.06] flex items-center justify-between px-8 sticky top-0 bg-[#070B12]/80 backdrop-blur-md z-40">
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 20 }}>{activeNav}</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                <Icons.search />
              </div>
              <input className="bg-[#0D1420] border border-white/[0.06] rounded-lg py-1.5 pl-9 pr-4 text-sm w-52 focus:ring-1 focus:ring-[#00E5A0] focus:border-[#00E5A0] placeholder:text-slate-600 outline-none transition-all text-slate-100"
                placeholder="Search..." />
            </div>
            <button onClick={() => setActiveNav('Integrations')}
              className="bg-gradient-to-r from-[#00E5A0] to-cyan-400 text-slate-900 font-bold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
              <Icons.plus /> New Integration
            </button>
          </div>
        </header>

        {renderPage()}
      </main>

      {/* FAB */}
      <button onClick={() => router.push('/dashboard/agent')}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#00E5A0] text-slate-900 rounded-full shadow-2xl shadow-[#00E5A0]/40 flex items-center justify-center hover:scale-105 transition-transform z-50"
        title="Open AI Agent">
        <Icons.bolt />
      </button>
    </div>
  )
}