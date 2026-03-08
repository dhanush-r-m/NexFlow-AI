import { useState, useEffect, useCallback } from 'react'

interface SyncStatus {
  lastSync: string | null
  lastResult: string | null
  isRunning: boolean
  totalSynced: number
}

export function useAutoSync(intervalMs = 60000) {
  const [status, setStatus] = useState<SyncStatus>({
    lastSync: null,
    lastResult: null,
    isRunning: false,
    totalSynced: 0,
  })

  const runSync = useCallback(async () => {
    setStatus(prev => ({ ...prev, isRunning: true }))

    try {
      const res = await fetch('/api/sync', { method: 'POST' })
      const data = await res.json()

      setStatus(prev => ({
        isRunning: false,
        lastSync: new Date().toLocaleTimeString(),
        lastResult: data.synced > 0
          ? `${data.synced} contact${data.synced > 1 ? 's' : ''} synced`
          : 'No new payments',
        totalSynced: prev.totalSynced + (data.synced || 0),
      }))
    } catch {
      setStatus(prev => ({
        ...prev,
        isRunning: false,
        lastResult: 'Sync failed',
      }))
    }
  }, [])

  useEffect(() => {
    // Run immediately on mount
    runSync()

    // Then run every intervalMs
    const interval = setInterval(runSync, intervalMs)
    return () => clearInterval(interval)
  }, [runSync, intervalMs])

  return { status, runSync }
}