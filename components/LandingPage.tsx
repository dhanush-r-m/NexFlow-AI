'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

export default function LandingPage() {
  const router = useRouter()
  const { isSignedIn } = useAuth()

  const handleSignIn = () => router.push(isSignedIn ? '/dashboard' : '/sign-in')
  const handleSignUp = () => router.push(isSignedIn ? '/dashboard' : '/sign-up')
  const handlePricing = () => router.push('/pricing')
  const handleDemo = () => router.push('/dashboard/agent')

  return (
    <div className="bg-[#070B12] text-slate-100 min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .gradient-text {
          background: linear-gradient(90deg, #00e6a1, #0066FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .glass-nav {
          background: rgba(7, 11, 18, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .card-dark {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .hero-glow {
          background: radial-gradient(circle at 50% 40%, rgba(0,230,161,0.12) 0%, transparent 65%);
        }
        .btn-primary {
          background: linear-gradient(135deg, #00e6a1, #0066FF);
          color: #070B12;
          font-weight: 700;
          transition: opacity 0.2s, transform 0.2s;
        }
        .btn-primary:hover { opacity: 0.9; transform: scale(1.02); }
        .feature-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(0,230,161,0.2);
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-animate { animation: fadeUp 0.7s ease forwards; }
        .hero-animate-2 { animation: fadeUp 0.7s 0.15s ease both; }
        .hero-animate-3 { animation: fadeUp 0.7s 0.3s ease both; }
        .nav-link { font-size: 14px; font-weight: 500; color: #94a3b8; text-decoration: none; transition: color 0.2s; }
        .nav-link:hover { color: #00e6a1; }
      `}</style>

      {/* NAVBAR */}
      <nav className="glass-nav fixed top-0 w-full z-50">
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => router.push('/')}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #00e6a1, #0066FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="font-display" style={{ color: '#070B12', fontWeight: 800, fontSize: 18 }}>N</span>
            </div>
            <span className="font-display" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px' }}>Nexflow</span>
          </div>
          <div style={{ display: 'flex', gap: 40 }}>
            <a className="nav-link" href="#features">Features</a>
            <a className="nav-link" href="#pricing">Pricing</a>
            <a className="nav-link" href="#testimonials">Reviews</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={handleSignIn}
              style={{ fontSize: 14, fontWeight: 600, background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#00e6a1')}
              onMouseLeave={e => (e.currentTarget.style.color = '#e2e8f0')}>
              {isSignedIn ? 'Dashboard' : 'Sign In'}
            </button>
            <button className="btn-primary" onClick={handleSignUp}
              style={{ padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, boxShadow: '0 4px 20px rgba(0,230,161,0.2)' }}>
              {isSignedIn ? 'Go to Dashboard' : 'Start Free Trial'}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-glow" style={{ paddingTop: 160, paddingBottom: 96, overflow: 'hidden' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div className="hero-animate" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, border: '1px solid rgba(0,230,161,0.2)', background: 'rgba(0,230,161,0.05)', marginBottom: 32 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#00e6a1', letterSpacing: '0.5px' }}>⚡ AI-Powered Integration Agent</span>
          </div>
          <h1 className="font-display hero-animate-2" style={{ fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 800, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-2px' }}>
            Stop writing API<br />integrations{' '}
            <span className="gradient-text">manually.</span>
          </h1>
          <p className="hero-animate-3" style={{ fontSize: 18, color: '#94a3b8', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Nexflow's AI agent reads API docs, writes production-ready code,
            deploys integrations, and monitors them 24/7 — in minutes, not days.
          </p>
          <div className="hero-animate-3" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
            <button className="btn-primary" onClick={handleSignUp}
              style={{ padding: '16px 36px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 16, boxShadow: '0 8px 30px rgba(0,230,161,0.25)' }}>
              {isSignedIn ? 'Go to Dashboard →' : 'Start Free Trial →'}
            </button>
            <button onClick={handleDemo}
              style={{ padding: '16px 36px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#e2e8f0', fontSize: 16, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}>
              ▶ Try AI Agent
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 64 }}>
            <div style={{ display: 'flex' }}>
              {['🧑‍💻', '👩‍💻', '🧑‍🔬', '+2k'].map((a, i) => (
                <div key={i} style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '2px solid #070B12', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: i < 3 ? 18 : 10, fontWeight: 700, marginLeft: i > 0 ? -10 : 0, color: '#94a3b8' }}>
                  {a}
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: '#64748b' }}>Trusted by teams at Figma, Vercel, and Linear</p>
          </div>
          {/* Terminal mockup */}
          <div style={{ maxWidth: 900, margin: '0 auto', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
            <div style={{ height: 36, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8 }}>
              {['#ef4444', '#eab308', '#22c55e'].map((c, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.6 }} />
              ))}
              <span style={{ marginLeft: 16, fontSize: 10, color: '#475569', fontFamily: 'monospace', letterSpacing: 2, textTransform: 'uppercase' }}>nexflow-terminal — integration-agent</span>
            </div>
            <div style={{ background: '#0d1117', padding: '32px 40px', textAlign: 'left', fontFamily: 'monospace', fontSize: 14, lineHeight: 2 }}>
              <div style={{ color: '#00e6a1' }}><span style={{ color: '#475569', marginRight: 16 }}>1</span><span style={{ color: '#60a5fa' }}>nexflow</span> integrate stripe --target hubspot</div>
              <div style={{ color: '#64748b' }}><span style={{ color: '#475569', marginRight: 16 }}>2</span>🔍 Reading Stripe API documentation...</div>
              <div style={{ color: '#64748b' }}><span style={{ color: '#475569', marginRight: 16 }}>3</span>🏗️ Mapping schemas to HubSpot contacts...</div>
              <div style={{ color: '#64748b' }}><span style={{ color: '#475569', marginRight: 16 }}>4</span>✨ Integration live at <span style={{ color: '#00e6a1' }}>/integrations/stripe-hubspot</span></div>
              <div style={{ marginTop: 16 }}>
                <span style={{ color: '#475569', marginRight: 16 }}>5</span>
                <span style={{ color: '#c084fc' }}>export const</span>{' '}
                <span style={{ color: '#fde68a' }}>syncPayment</span>{' '}
                <span style={{ color: '#60a5fa' }}>= async</span>{' '}
                <span style={{ color: '#e2e8f0' }}>(payment) =&gt; {'{'}</span><br />
                <span style={{ color: '#94a3b8', marginLeft: 48 }}>// Generated by Nexflow AI Agent</span><br />
                <span style={{ color: '#c084fc', marginLeft: 48 }}>return await</span>{' '}
                <span style={{ color: '#e2e8f0' }}>nexflow.</span><span style={{ color: '#60a5fa' }}>sync</span><span style={{ color: '#e2e8f0' }}>(payment);</span><br />
                <span style={{ color: '#e2e8f0' }}>{'}'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGOS */}
      <section style={{ padding: '48px 24px', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#334155', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 32 }}>Trusted by teams using</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px 48px', opacity: 0.3 }}>
            {['STRIPE', 'HUBSPOT', 'SHOPIFY', 'SLACK', 'SALESFORCE', 'NOTION'].map(logo => (
              <span key={logo} className="font-display" style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.5, color: '#e2e8f0' }}>{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="features" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, marginBottom: 16, letterSpacing: -1 }}>
              Your developers are drowning<br />in integration work.
            </h2>
            <p style={{ color: '#64748b', maxWidth: 520, margin: '0 auto' }}>Integrating third-party services shouldn't take weeks of engineering time.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { icon: '⏱', color: '#ef4444', title: 'Infinite Dev Time', desc: 'Engineers spend up to 40% of their time writing and maintaining brittle API connectors instead of shipping features.' },
              { icon: '⚠️', color: '#f97316', title: 'Breaking APIs', desc: 'A single undocumented change in a third-party API can bring down your entire production environment without warning.' },
              { icon: '📋', color: '#eab308', title: 'Integration Backlog', desc: 'Customer requests for native integrations pile up for months because your team is too busy with core development.' },
            ].map((item, i) => (
              <div key={i} className="card-dark feature-card" style={{ padding: 32, borderRadius: 20, transition: 'all 0.2s' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 20 }}>
                  {item.icon}
                </div>
                <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{item.title}</h3>
                <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section style={{ padding: '96px 24px', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, marginBottom: 16, letterSpacing: -1 }}>One sentence. Full integration.</h2>
            <p style={{ color: '#64748b' }}>Describe what you need, Nexflow handles the heavy lifting.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { num: '01', icon: '💬', title: 'Describe', desc: '"Create a Stripe customer when a new user signs up."', color: '#00e6a1' },
              { num: '02', icon: '🧠', title: 'Plan', desc: 'Nexflow reads docs and maps schemas across both systems.', color: '#0066FF' },
              { num: '03', icon: '⚡', title: 'Code', desc: 'AI generates production-ready, type-safe integration code.', color: '#a855f7' },
              { num: '04', icon: '🚀', title: 'Live', desc: 'Deploy via CLI or use our managed serverless runner.', color: '#00e6a1' },
            ].map((step, i) => (
              <div key={i} className="card-dark" style={{ padding: 32, borderRadius: 20, textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `${step.color}15`, border: `1px solid ${step.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 20px' }}>
                  {step.icon}
                </div>
                <div style={{ fontSize: 11, color: step.color, fontWeight: 800, letterSpacing: 2, marginBottom: 8 }}>{step.num}</div>
                <h4 className="font-display" style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{step.title}</h4>
                <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: -1 }}>Everything your team needs</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { icon: '📖', title: 'AI Doc Reader', desc: 'Point us to any URL or upload a PDF. We ingest technical docs in seconds.' },
              { icon: '⚙️', title: 'Auto Code Gen', desc: 'Zero-boilerplate. We write the auth, retry logic, and error handling for you.' },
              { icon: '🔧', title: 'Self Healing', desc: 'When an API schema changes, our AI detects it and suggests the fix automatically.' },
              { icon: '📊', title: 'Observable Logs', desc: 'Full payload inspection and tracing for every request made through Nexflow.' },
              { icon: '🔗', title: 'Multi-API Sync', desc: 'Orchestrate data between dozens of different services with unified webhooks.' },
              { icon: '👥', title: 'Team Access', desc: 'Role-based access control and shared API secrets for large engineering teams.' },
            ].map((f, i) => (
              <div key={i} className="card-dark feature-card" style={{ padding: 36, borderRadius: 24, transition: 'all 0.2s', cursor: 'default' }}>
                <div style={{ fontSize: 32, marginBottom: 20 }}>{f.icon}</div>
                <h3 className="font-display" style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section style={{ padding: '96px 24px', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 800, textAlign: 'center', marginBottom: 56, letterSpacing: -1 }}>
            Why developers choose Nexflow
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  {['Feature', 'Zapier', 'MuleSoft', 'Nexflow ✦'].map((h, i) => (
                    <th key={i} style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: i === 0 ? 'left' : 'center', fontSize: 13, fontWeight: 700, color: i === 3 ? '#00e6a1' : i === 0 ? '#e2e8f0' : '#475569', background: i === 3 ? 'rgba(0,230,161,0.04)' : 'transparent' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['AI Code Generation', '❌', '❌', '✅'],
                  ['Self-Healing APIs', '❌', 'Manual', '✅'],
                  ['Custom Schemas', 'Limited', '✅', '✅'],
                  ['Developer First', 'No-Code', 'Enterprise', '✅'],
                  ['Startup Pricing', '✅', '❌', '✅'],
                ].map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', textAlign: j === 0 ? 'left' : 'center', fontSize: 14, color: j === 0 ? '#cbd5e1' : '#64748b', fontWeight: j === 0 ? 500 : 400, background: j === 3 ? 'rgba(0,230,161,0.04)' : 'transparent' }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, marginBottom: 16, letterSpacing: -1 }}>Simple pricing. Serious ROI.</h2>
            <p style={{ color: '#64748b', maxWidth: 480, margin: '0 auto' }}>One integration saves $3,000–10,000 in developer time. Nexflow pays for itself on day one.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, maxWidth: 800, margin: '0 auto' }}>
            {[
              { name: 'Starter', price: '$99', popular: false, features: ['5 Active Integrations', 'AI Agent Planning', '10,000 API calls/month', 'Email Support', 'Basic Monitoring'], cta: 'Get Started' },
              { name: 'Growth', price: '$299', popular: true, features: ['20 Active Integrations', 'AI Agent + Auto Healing', '100,000 API calls/month', 'Priority Support', 'Advanced Analytics', 'Custom Webhooks', 'Team Access'], cta: 'Start Free Trial' },
            ].map((plan, i) => (
              <div key={i} style={{ padding: 40, borderRadius: 24, position: 'relative', ...(plan.popular ? { background: '#0f1e2e', border: '2px solid #00e6a1', boxShadow: '0 0 60px rgba(0,230,161,0.1)' } : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }) }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #00e6a1, #0066FF)', color: '#070B12', fontSize: 10, fontWeight: 900, padding: '4px 16px', borderRadius: 999, whiteSpace: 'nowrap', letterSpacing: 1 }}>
                    MOST POPULAR
                  </div>
                )}
                <h3 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 32 }}>
                  <span className="font-display" style={{ fontSize: 52, fontWeight: 800, color: plan.popular ? '#00e6a1' : '#e2e8f0', letterSpacing: -2 }}>{plan.price}</span>
                  <span style={{ color: '#475569', fontSize: 15 }}>/month</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                      <span style={{ color: '#00e6a1', fontWeight: 700 }}>✓</span>
                      <span style={{ color: '#94a3b8' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button className={plan.popular ? 'btn-primary' : ''} onClick={handlePricing}
                  style={plan.popular
                    ? { width: '100%', padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 15, boxShadow: '0 0 30px rgba(0,230,161,0.25)' }
                    : { width: '100%', padding: '14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#e2e8f0', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: '#334155', fontSize: 13, marginTop: 32 }}>No contracts. Cancel anytime. 7-day free trial included.</p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{ padding: '96px 24px', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 800, textAlign: 'center', marginBottom: 56, letterSpacing: -1 }}>What CTOs are saying</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { quote: '"Nexflow reduced our integration delivery time from months to literally hours. It\'s magic."', name: 'David Chen', role: 'CTO @ FlowState', avatar: '👨‍💼' },
              { quote: '"The code generated is cleaner than what our senior engineers were writing manually. Truly impressive."', name: 'Sarah Jenkins', role: 'VP Engineering @ Nexus.io', avatar: '👩‍💼' },
              { quote: '"Self-healing is the killer feature. We haven\'t had a broken API incident in 6 months."', name: 'Marcus Thorne', role: 'CTO @ PayScale', avatar: '🧑‍💼' },
            ].map((t, i) => (
              <div key={i} className="card-dark" style={{ padding: 32, borderRadius: 20 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
                  {[...Array(5)].map((_, j) => <span key={j} style={{ color: '#00e6a1', fontSize: 14 }}>★</span>)}
                </div>
                <p style={{ color: '#cbd5e1', fontSize: 15, lineHeight: 1.7, fontStyle: 'italic', marginBottom: 24 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #1e293b, #0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: '1px solid rgba(255,255,255,0.08)' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#475569' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ padding: '80px 48px', borderRadius: 48, border: '1px solid rgba(255,255,255,0.06)', background: '#0a0f1c', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(0,230,161,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 className="font-display" style={{ fontSize: 'clamp(28px, 5vw, 60px)', fontWeight: 800, marginBottom: 24, letterSpacing: -2 }}>
                Ready to stop writing<br />integrations manually?
              </h2>
              <p style={{ color: '#64748b', fontSize: 18, maxWidth: 480, margin: '0 auto 48px' }}>
                Join 5,000+ developers automating their API workflows with Nexflow.
              </p>
              <button className="btn-primary" onClick={handleSignUp}
                style={{ padding: '20px 56px', borderRadius: 16, border: 'none', cursor: 'pointer', fontSize: 18, boxShadow: '0 12px 40px rgba(0,230,161,0.3)' }}>
                {isSignedIn ? 'Go to Dashboard →' : 'Get Started for Free'}
              </button>
              <p style={{ color: '#334155', fontSize: 13, marginTop: 20 }}>No credit card required. 14-day free trial.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '64px 24px 40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 64 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, cursor: 'pointer' }} onClick={() => router.push('/')}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #00e6a1, #0066FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="font-display" style={{ color: '#070B12', fontWeight: 800, fontSize: 15 }}>N</span>
                </div>
                <span className="font-display" style={{ fontSize: 18, fontWeight: 700 }}>Nexflow</span>
              </div>
              <p style={{ color: '#334155', fontSize: 14, lineHeight: 1.8, maxWidth: 260 }}>
                Automating the world's APIs with production-ready AI agents. Built by developers, for developers.
              </p>
            </div>
            {[
              { title: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }, { label: 'Reviews', href: '#testimonials' }, { label: 'Dashboard', href: '/dashboard' }] },
              { title: 'Resources', links: [{ label: 'AI Agent', href: '/dashboard/agent' }, { label: 'Integrations', href: '/dashboard/integrations/stripe-hubspot' }, { label: 'Logs', href: '/dashboard/logs' }, { label: 'Community', href: '#' }] },
              { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Blog', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Contact', href: '#' }] },
            ].map((col, i) => (
              <div key={i}>
                <h5 className="font-display" style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: '#e2e8f0', marginBottom: 20 }}>{col.title}</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {col.links.map(link => (
                    <a key={link.label} href={link.href}
                      style={{ fontSize: 14, color: '#334155', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#00e6a1')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#334155')}>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.04)', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ fontSize: 12, color: '#1e293b' }}>© 2026 Nexflow AI Inc. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 32 }}>
              {['Privacy Policy', 'Terms of Service', 'Security'].map(link => (
                <a key={link} href="#"
                  style={{ fontSize: 12, color: '#1e293b', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#475569')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#1e293b')}>
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}