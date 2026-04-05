'use client'

import { useState } from 'react'

export default function ROICalculator() {
  const [contentPieces, setContentPieces] = useState(8)
  const [productPrice, setProductPrice] = useState(97)

  const productsPerMonth = Math.round(contentPieces * 0.65)
  const monthlyValue = productsPerMonth * productPrice
  const annualValue = monthlyValue * 12
  const roi = Math.round(((monthlyValue - 49) / 49) * 100)

  return (
    <div className="bg-white rounded-3xl border border-[#e8eaed] p-8 md:p-12 shadow-sm">
      <div className="max-w-2xl mx-auto">

        <div className="grid md:grid-cols-2 gap-10">
          {/* Sliders */}
          <div className="space-y-8">
            {/* Slider 1 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-[#1B2A4A]">
                  Content pieces per month
                </label>
                <span className="text-xl font-bold text-[#1B2A4A] tabular-nums">{contentPieces}</span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={contentPieces}
                onChange={(e) => setContentPieces(Number(e.target.value))}
                className="w-full"
                style={{
                  background: `linear-gradient(to right, #C6A04E ${((contentPieces - 1) / 19) * 100}%, #e8eaed ${((contentPieces - 1) / 19) * 100}%)`
                }}
              />
              <div className="flex justify-between text-xs text-[#9CA3AF] mt-1.5">
                <span>1</span>
                <span>20</span>
              </div>
            </div>

            {/* Slider 2 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-[#1B2A4A]">
                  Average product price
                </label>
                <span className="text-xl font-bold text-[#1B2A4A] tabular-nums">${productPrice}</span>
              </div>
              <input
                type="range"
                min={19}
                max={297}
                step={1}
                value={productPrice}
                onChange={(e) => setProductPrice(Number(e.target.value))}
                className="w-full"
                style={{
                  background: `linear-gradient(to right, #C6A04E ${((productPrice - 19) / (297 - 19)) * 100}%, #e8eaed ${((productPrice - 19) / (297 - 19)) * 100}%)`
                }}
              />
              <div className="flex justify-between text-xs text-[#9CA3AF] mt-1.5">
                <span>$19</span>
                <span>$297</span>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="flex flex-col justify-center">
            <div className="bg-[#1B2A4A] rounded-2xl p-7 text-white text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">
                PillarBloom could generate
              </p>
              <div className="text-5xl font-bold text-[#C6A04E] mb-1 tabular-nums tracking-tight">
                ${monthlyValue.toLocaleString()}
              </div>
              <p className="text-sm text-white/70 mb-5">
                per month from your existing content
              </p>

              <div className="space-y-2 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Products generated</span>
                  <span className="font-semibold text-white">{productsPerMonth}/month</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Annual potential</span>
                  <span className="font-semibold text-white">${annualValue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">ROI on $49/mo plan</span>
                  <span className="font-semibold text-[#C6A04E]">{roi > 0 ? `${roi}%` : 'Start free'}</span>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-[#9CA3AF] mt-3 leading-relaxed">
              Based on 65% of content pieces becoming sellable products.
              Starting at <strong className="text-[#1B2A4A]">$49/month</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
