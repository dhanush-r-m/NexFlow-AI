import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createContact } from '@/lib/hubspot'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )
  } catch (err: any) {
    console.error('Webhook signature failed:', err.message)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    const email = paymentIntent.receipt_email || ''
    const amount = paymentIntent.amount / 100
    const name = paymentIntent.shipping?.name || email

    console.log('Payment received:', email, amount)

    if (email) {
      try {
        await createContact(email, name, amount)

        await supabase.from('integration_logs').insert({
          integration_id: null,
          status: 'success',
          message: `Auto-synced via webhook: ${email} ($${amount})`,
          payload: { paymentIntentId: paymentIntent.id, email, amount },
        })

        console.log('HubSpot contact created:', email)
      } catch (err: any) {
        await supabase.from('integration_logs').insert({
          integration_id: null,
          status: 'error',
          message: `Webhook sync failed: ${email}`,
          payload: { error: err.message },
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}