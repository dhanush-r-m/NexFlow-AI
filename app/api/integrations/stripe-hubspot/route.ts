import { NextRequest, NextResponse } from 'next/server'
import { getRecentPayments } from '@/lib/stripe'
import { createContact } from '@/lib/hubspot'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const results = []
  const errors = []

  try {
    // Step 1 — Fetch recent Stripe payments
    const payments = await getRecentPayments()

    if (payments.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No recent payments found',
        synced: 0,
      })
    }

    // Step 2 — Create HubSpot contact for each payment
    for (const payment of payments) {
      try {
        if (!payment.email) continue

        const result = await createContact(
          payment.email,
          payment.name || payment.email,
          payment.amount
        )

        // Step 3 — Log to Supabase
        await supabase.from('integration_logs').insert({
          integration_id: null,
          status: 'success',
          message: `Contact synced: ${payment.email} ($${payment.amount})`,
          payload: { payment, hubspot: result },
        })

        results.push({ email: payment.email, amount: payment.amount })
      } catch (err: any) {
        errors.push({ email: payment.email, error: err.message })

        await supabase.from('integration_logs').insert({
          integration_id: null,
          status: 'error',
          message: `Failed to sync: ${payment.email}`,
          payload: { error: err.message },
        })
      }
    }

    return NextResponse.json({
      success: true,
      synced: results.length,
      failed: errors.length,
      results,
      errors,
    })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const payments = await getRecentPayments()
    return NextResponse.json({ success: true, payments })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}