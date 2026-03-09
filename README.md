# Nexflow AI — API Integration Platform

> **Connect anything. Automate everything.**  
> AI-powered API integration platform that reads docs, writes production code, and monitors integrations 24/7.

[![Deploy with Vercel](https://vercel.com/button)](https://nexflow-app.vercel.app)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)
![Stripe](https://img.shields.io/badge/Stripe-Payments-purple?style=flat-square&logo=stripe)

---

## 🚀 Live Demo

**[nexflow-app-woad.vercel.app](https://nexflow-app-woad.vercel.app)**

---

## 📸 Screenshots

| Landing Page | Dashboard | AI Agent |
|---|---|---|
| Dark hero with terminal mockup | Real-time stats + activity logs | Gemini-powered integration planner |

---

## ✨ Features

- **AI Integration Agent** — Describe an integration in plain English, get a production-ready plan powered by Google Gemini
- **Stripe → HubSpot Sync** — Auto-syncs payment data to CRM contacts every 60 seconds
- **Real-time Logs** — Every integration event tracked and displayed live via Supabase
- **Stripe Subscriptions** — Full billing with Starter ($99/mo) and Growth ($299/mo) plans
- **Auto-healing** — Duplicate prevention via payment tracking table
- **Dark Dashboard** — Premium UI with live stats, integrations manager, and settings
- **Auth** — Clerk authentication with protected routes

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, Tailwind CSS |
| **Backend** | Next.js API Routes |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Clerk |
| **Payments** | Stripe |
| **AI** | Google Gemini 2.5 Flash |
| **CRM** | HubSpot API |
| **Deploy** | Vercel |

---

## 📁 Project Structure

```
nexflow/
├── app/
│   ├── api/
│   │   ├── agent/route.ts          # Gemini AI integration planner
│   │   ├── integrations/
│   │   │   └── stripe-hubspot/     # Manual sync endpoint
│   │   ├── sync/route.ts           # Auto-polling sync (60s)
│   │   └── billing/
│   │       ├── checkout/route.ts   # Stripe checkout session
│   │       └── portal/route.ts     # Customer billing portal
│   ├── dashboard/
│   │   ├── page.tsx                # Main dashboard
│   │   ├── agent/page.tsx          # AI agent UI
│   │   ├── integrations/           # Integration pages
│   │   └── logs/page.tsx           # Activity logs
│   ├── pricing/page.tsx            # Pricing page
│   └── page.tsx                    # Landing page
├── components/
│   ├── NexflowDashboard.tsx        # Dashboard shell + all pages
│   └── LandingPage.tsx             # Public landing page
└── lib/
    ├── stripe.ts                   # Stripe client + helpers
    ├── hubspot.ts                  # HubSpot client + helpers
    ├── supabase.ts                 # Supabase client
    └── useAutoSync.ts              # Auto-polling hook
```

---

## ⚡ Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/dhanush-r-m/NexFlow-AI.git
cd NexFlow-AI
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID=price_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID=price_xxxxxxxxxxxxx

# HubSpot
HUBSPOT_API_KEY=your_hubspot_private_app_token

# Gemini
GEMINI_API_KEY=your_gemini_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up Supabase tables

Run these in your Supabase SQL editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT,
  subscription_status TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  subscription_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Integration logs
CREATE TABLE integration_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  integration_id TEXT,
  status TEXT NOT NULL,
  message TEXT,
  payload JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Synced payments (prevents duplicates)
CREATE TABLE synced_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_payment_id TEXT UNIQUE NOT NULL,
  email TEXT,
  amount DECIMAL,
  synced_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔄 How the Stripe → HubSpot Sync Works

```
1. User makes payment on Stripe
         ↓
2. Auto-sync polls every 60 seconds
         ↓
3. Fetches recent Stripe payment intents
         ↓
4. Checks synced_payments table (no duplicates)
         ↓
5. Creates HubSpot contact for new payments
         ↓
6. Logs result to integration_logs table
         ↓
7. Dashboard updates in real-time
```

---

## 💰 Pricing

| Feature | Starter | Growth |
|---|---|---|
| Price | $99/month | $299/month |
| Integrations | 5 | 20 |
| API calls | 10,000/month | 100,000/month |
| AI Agent | ✅ | ✅ |
| Auto Healing | ❌ | ✅ |
| Priority Support | ❌ | ✅ |
| Team Access | ❌ | ✅ |

---

## 🗺 Roadmap

- [x] AI integration agent (Gemini)
- [x] Stripe → HubSpot sync
- [x] Auto-polling every 60s
- [x] Stripe subscription billing
- [x] Real-time dashboard
- [x] Public landing page
- [x] Vercel deployment
- [ ] Custom domain
- [ ] Email notifications (Resend)
- [ ] Production webhooks
- [ ] More integrations (Shopify, Slack, Notion)
- [ ] Multi-tenancy
- [ ] Self-healing AI

---

## 📄 License

MIT License — feel free to use this as a template for your own SaaS.

---

## 👤 Author

**Dhanush R M**  
Built with ☕ and a lot of debugging

[![GitHub](https://img.shields.io/badge/GitHub-dhanush--r--m-black?style=flat-square&logo=github)](https://github.com/dhanush-r-m)
