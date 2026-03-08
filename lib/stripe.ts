import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

export async function getRecentPayments() {
  const paymentIntents = await stripe.paymentIntents.list({
    limit: 10,
  })

  return paymentIntents.data
    .filter(p => p.status === 'succeeded')
    .map(p => ({
      id: p.id,
      amount: p.amount / 100,
      currency: p.currency,
      email: p.receipt_email || p.metadata?.email || '',
      name: p.shipping?.name || '',
      created: new Date(p.created * 1000).toLocaleDateString(),
    }))
}