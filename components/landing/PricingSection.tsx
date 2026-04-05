'use client'

import { useState } from 'react'
import Link from 'next/link'

const PLANS = [
  {
    key: 'free',
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    repurposes: '3 repurposes',
    products: 'No products',
    features: [
      '3 content repurposes/month',
      '8 output formats',
      'Basic editing',
    ],
    cta: 'Start Free',
    href: '/signup',
    highlight: false,
    badge: null,
  },
  {
    key: 'starter',
    name: 'Starter',
    monthlyPrice: 49,
    annualPrice: 39,
    repurposes: '15 repurposes/mo',
    products: '1 product/mo',
    features: [
      '15 content repurposes/month',
      '1 digital product/month',
      'Brand voice learning',
      'All 8 output formats',
      'All 6 product types',
    ],
    cta: 'Get Started',
    href: '/signup',
    highlight: false,
    badge: null,
  },
  {
    key: 'pro',
    name: 'Pro',
    monthlyPrice: 99,
    annualPrice: 79,
    repurposes: 'Unlimited repurposes',
    products: '5 products/mo',
    features: [
      'Unlimited content repurposes',
      '5 digital products/month',
      'Brand voice learning',
      'Priority generation',
      'Download & export',
    ],
    cta: 'Get Pro',
    href: '/signup',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    key: 'creator',
    name: 'Creator',
    monthlyPrice: 149,
    annualPrice: 119,
    repurposes: 'Unlimited repurposes',
    products: 'Unlimited products',
    features: [
      'Unlimited everything',
      'Unlimited digital products',
      'Advanced brand voice',
      'API access (coming soon)',
      'Early feature access',
    ],
    cta: 'Go Creator',
    href: '/signup',
    highlight: false,
    badge: null,
  },
]

export default function PricingSection() {
  const [annual, setAnnual] = useState(false)

  return (
    <div>
      {/* Toggle */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <span className={`text-sm font-medium transition-colors ${!annual ? 'text-[#1B2A4A]' : 'text-[#9CA3AF]'}`}>
          Monthly
        </span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative w-12 h-6 rounded-full transition-colors ${annual ? 'bg-[#C6A04E]' : 'bg-[#e8eaed]'}`}
        >
          <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${annual ? 'left-7' : 'left-1'}`} />
        </button>
        <span className={`text-sm font-medium transition-colors ${annual ? 'text-[#1B2A4A]' : 'text-[#9CA3AF]'}`}>
          Annual
        </span>
        <span className="bg-[#C6A04E]/10 text-[#C6A04E] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#C6A04E]/20">
          Save 20%
        </span>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PLANS.map((plan) => {
          const price = annual ? plan.annualPrice : plan.monthlyPrice
          return (
            <div
              key={plan.key}
              className={`relative rounded-2xl p-6 flex flex-col transition-all duration-200 ${
                plan.highlight
                  ? 'bg-[#1B2A4A] text-white shadow-xl scale-[1.03] ring-2 ring-[#C6A04E]'
                  : 'bg-white border border-[#e8eaed] hover:border-[#C6A04E]/40 hover:-translate-y-1 hover:shadow-lg'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-[#C6A04E] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${plan.highlight ? 'text-white/50' : 'text-[#9CA3AF]'}`}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1">
                  <span className={`text-4xl font-bold tracking-tight ${plan.highlight ? 'text-white' : 'text-[#1B2A4A]'}`}>
                    ${price}
                  </span>
                  {price > 0 && (
                    <span className={`text-sm pb-1.5 ${plan.highlight ? 'text-white/50' : 'text-[#9CA3AF]'}`}>
                      /mo
                    </span>
                  )}
                </div>
                {annual && price > 0 && (
                  <p className={`text-xs mt-1 ${plan.highlight ? 'text-white/50' : 'text-[#9CA3AF]'}`}>
                    Billed annually
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <span className={`mt-0.5 text-xs flex-shrink-0 ${plan.highlight ? 'text-[#C6A04E]' : 'text-[#C6A04E]'}`}>✓</span>
                    <span className={`text-sm ${plan.highlight ? 'text-white/80' : 'text-[#6B7280]'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block text-center text-sm font-semibold py-3 rounded-xl transition-all ${
                  plan.highlight
                    ? 'bg-[#C6A04E] hover:bg-[#D4B574] text-white'
                    : plan.key === 'free'
                    ? 'border-2 border-[#1B2A4A] text-[#1B2A4A] hover:bg-[#1B2A4A] hover:text-white'
                    : 'bg-[#1B2A4A] hover:bg-[#2D4270] text-white'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          )
        })}
      </div>

      <p className="text-center text-sm text-[#9CA3AF] mt-8">
        All plans start with a 14-day free trial. No credit card required.
      </p>
    </div>
  )
}
