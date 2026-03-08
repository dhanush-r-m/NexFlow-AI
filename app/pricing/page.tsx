'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const plans = [
  {
    name: 'Starter',
    price: '$99',
    period: '/month',
    description: 'Perfect for small teams',
    priceId: 'price_1T7hY5DJxL0lAdO5BSPQGx5H', // paste your actual Starter price ID here
    features: [
      '5 active integrations',
      'AI agent planning',
      '10,000 API calls/month',
      'Email support',
      'Basic logs & monitoring',
    ],
    color: '#0066FF',
    popular: false,
  },
  {
    name: 'Growth',
    price: '$299',
    period: '/month',
    description: 'For scaling SaaS companies',
    priceId: 'price_1T7hYpDJxL0lAdO59IdOCf8V', // paste your actual Growth price ID here
    features: [
      '20 active integrations',
      'AI agent + auto healing',
      '100,000 API calls/month',
      'Priority support',
      'Advanced analytics',
      'Custom webhooks',
      'Team access',
    ],
    color: '#00E5A0',
    popular: true,
  },
]


export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  async function handleCheckout(plan: typeof plans[0]) {
    setLoading(plan.name)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.priceId,
          plan: plan.name,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      alert('Something went wrong')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#070B12] py-16 px-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:wght@400;500;700&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
      `}</style>

      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br 
          from-cyan-400 to-blue-600 flex items-center justify-center 
          font-bold text-white text-sm">
            N
          </div>
          <span className="font-display font-bold text-xl 
          text-slate-100">Nexflow</span>
        </div>
        <h1 className="font-display text-4xl font-bold 
        text-slate-100 mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          One integration saves you 3-10 days of developer time.
          Nexflow pays for itself on day one.
        </p>
      </div>

      {/* Plans */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="relative rounded-2xl p-8"
            style={{
              background: plan.popular
                ? 'linear-gradient(135deg, #0D1F2D, #0D1420)'
                : '#0D1420',
              border: `1px solid ${plan.popular
                ? 'rgba(0,229,160,0.2)'
                : 'rgba(255,255,255,0.06)'}`,
              boxShadow: plan.popular
                ? '0 0 40px rgba(0,229,160,0.08)'
                : 'none',
            }}
          >
            {/* Popular badge */}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 
              -translate-x-1/2">
                <span className="bg-gradient-to-r from-[#00E5A0] 
                to-cyan-400 text-slate-900 text-xs font-bold 
                px-4 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
            )}

            {/* Plan header */}
            <div className="mb-8">
              <h2 className="font-display text-xl font-bold 
              text-slate-100 mb-1">
                {plan.name}
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                {plan.description}
              </p>
              <div className="flex items-baseline gap-1">
                <span
                  className="font-display text-5xl font-bold"
                  style={{ color: plan.color }}
                >
                  {plan.price}
                </span>
                <span className="text-slate-500 text-sm">
                  {plan.period}
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full flex items-center 
                    justify-center flex-shrink-0 text-xs font-bold"
                    style={{
                      background: `${plan.color}20`,
                      color: plan.color,
                    }}
                  >
                    ✓
                  </div>
                  <span className="text-sm text-slate-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handleCheckout(plan)}
              disabled={loading === plan.name}
              className="w-full py-3 rounded-xl font-bold text-sm 
              transition-all disabled:opacity-50"
              style={{
                background: plan.popular
                  ? 'linear-gradient(135deg, #00E5A0, #0066FF)'
                  : 'rgba(255,255,255,0.05)',
                color: plan.popular ? '#070B12' : '#E2E8F0',
                border: plan.popular
                  ? 'none'
                  : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {loading === plan.name
                ? 'Redirecting to checkout...'
                : `Start with ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      {/* Bottom note */}
      <div className="text-center mt-12">
        <p className="text-slate-600 text-sm">
          No contracts. Cancel anytime. 
          All plans include a 7-day free trial.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-slate-500 hover:text-slate-300 
          text-sm mt-4 transition-colors underline"
        >
          Back to dashboard
        </button>
      </div>
    </div>
  )
}
