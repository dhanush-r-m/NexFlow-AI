import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  console.log('Checkout route hit')

  try {
    const { userId } = await auth()
    console.log('User ID:', userId)

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { priceId, plan } = await req.json()
    console.log('Price ID:', priceId)
    console.log('Plan:', plan)

    // Get or create Stripe customer
    const { data: user } = await supabase
      .from('users')
      .select('stripe_customer_id, email')
      .eq('clerk_id', userId)
      .single()

    console.log('User from Supabase:', user)

    let customerId = user?.stripe_customer_id

    if (!customerId) {
      console.log('Creating new Stripe customer...')
      const customer = await stripe.customers.create({
        metadata: { clerkId: userId },
      })
      customerId = customer.id
      console.log('Stripe customer created:', customerId)

      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('clerk_id', userId)
    }

    console.log('Creating checkout session...')

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: { clerkId: userId, plan },
    })

    console.log('Checkout session created:', session.id)

    return NextResponse.json({ url: session.url })

  } catch (error: any) {
    console.error('CHECKOUT ERROR:', error.message)
    console.error('FULL ERROR:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}