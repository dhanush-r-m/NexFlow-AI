import { useState } from 'react'

interface AgentResponse {
  success: boolean
  plan?: string
  error?: string
}

export function useAgent() {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function runAgent(
    userRequest: string,
    triggerApi: string,
    actionApi: string
  ) {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userRequest, triggerApi, actionApi }),
      })

      const data: AgentResponse = await res.json()

      if (data.success && data.plan) {
        setResponse(data.plan)
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Failed to reach agent')
    } finally {
      setLoading(false)
    }
  }

  return { runAgent, loading, response, error }
}