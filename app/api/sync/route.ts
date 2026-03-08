import { NextResponse } from 'next/server'
import { getRecentPayments } from '@/lib/stripe'
import { createContact } from '@/lib/hubspot'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    // Step 1 — Get recent Stripe payments
    const payments = await getRecentPayments()

    if (payments.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No payments found',
        synced: 0
      })
    }

    let synced = 0
    let skipped = 0
    const results = []

    for (const payment of payments) {
      if (!payment.email) {
        skipped++
        continue
      }

      // Step 2 — Check if already synced
      const { data: existing } = await supabase
        .from('synced_payments')
        .select('id')
        .eq('stripe_payment_id', payment.id)
        .single()

      if (existing) {
        skipped++
        continue
      }

      try {
        // Step 3 — Create HubSpot contact
        await createContact(
          payment.email,
          payment.name || payment.email,
          payment.amount
        )

        // Step 4 — Mark as synced in Supabase
        await supabase.from('synced_payments').insert({
          stripe_payment_id: payment.id,
          email: payment.email,
          amount: payment.amount,
        })

        // Step 5 — Log success
        await supabase.from('integration_logs').insert({
          integration_id: null,
          status: 'success',
          message: `Auto-synced: ${payment.email} ($${payment.amount})`,
          payload: { paymentId: payment.id, email: payment.email },
        })

        results.push({ email: payment.email, amount: payment.amount })
        synced++

      } catch (err: any) {
        await supabase.from('integration_logs').insert({
          integration_id: null,
          status: 'error',
          message: `Sync failed: ${payment.email} — ${err.message}`,
          payload: { error: err.message },
        })
      }
    }

    return NextResponse.json({
      success: true,
      synced,
      skipped,
      results,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'Nexflow Auto Sync Running',
    timestamp: new Date().toISOString()
  })
}