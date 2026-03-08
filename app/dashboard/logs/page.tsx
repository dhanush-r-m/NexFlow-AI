'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Log {
  id: string
  status: string
  message: string
  created_at: string
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()

    // Real time updates
    const channel = supabase
      .channel('logs')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'integration_logs',
      }, (payload) => {
        setLogs(prev => [payload.new as Log, ...prev])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchLogs() {
    const { data } = await supabase
      .from('integration_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    setLogs(data || [])
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#070B12] p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-100"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Live Logs
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Real time webhook activity
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-[#00E5A0] 
            border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-[#0D1420] border border-white/[0.06] 
          rounded-xl p-12 text-center">
            <p className="text-slate-500">No logs yet</p>
            <p className="text-slate-600 text-sm mt-2">
              Trigger a payment to see logs appear here in real time
            </p>
          </div>
        ) : (
          <div className="bg-[#0D1420] border border-white/[0.06] 
          rounded-xl overflow-hidden">
            {logs.map((log, i) => (
              <div key={log.id}
                className={`flex items-start gap-4 p-4 
                ${i < logs.length - 1 ? 'border-b border-white/[0.04]' : ''}
                hover:bg-white/[0.02] transition-colors`}
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 
                flex-shrink-0 ${
                  log.status === 'success'
                    ? 'bg-[#00E5A0]'
                    : 'bg-rose-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300">
                    {log.message}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 
                rounded-md flex-shrink-0 ${
                  log.status === 'success'
                    ? 'bg-[#00E5A0]/10 text-[#00E5A0]'
                    : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {log.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
