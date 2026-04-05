'use client'

import { useState, useEffect } from 'react'

const OUTPUTS = [
  {
    type: 'LinkedIn Post',
    icon: '💼',
    tab: 'linkedin',
    lines: [
      'Most creators leave 80% of their content',
      'value on the table.',
      '',
      'They publish once. Then move on.',
      "Here's what changes when you stop doing that:",
      '',
      '→ One article becomes 8 platform-native posts',
      '→ One framework becomes a $97 ebook',
      '→ One hour of writing = 30 days of content',
      '',
      'You already have the expertise.',
      'You just need a system.',
    ],
  },
  {
    type: 'Email Course — Day 1',
    icon: '📧',
    tab: 'email',
    lines: [
      'Subject: The content multiplier most creators miss',
      'Preview: One idea. Eight platforms. Zero extra work.',
      '',
      '────────────────────────────',
      '',
      'Hey [First Name],',
      '',
      'Quick question: how long does it take you',
      'to create one piece of content?',
      '',
      'Most creators say 2-4 hours. Then they',
      'publish it once and move on.',
      '',
      "✅ Today's Action: List your last 5 pieces",
    ],
  },
  {
    type: 'Ebook — Chapter 1',
    icon: '📖',
    tab: 'ebook',
    lines: [
      '# The Content Multiplication Framework',
      '',
      '## Overview',
      '',
      'Most creators are stuck in a publish-and-',
      'forget cycle. They create something great,',
      'post it once, and move on to the next thing.',
      '',
      '## The Core Principle',
      '',
      'Every piece of expertise has multiple lives.',
      'This chapter shows you the system.',
    ],
  },
]

export default function HeroMockup() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [visibleLines, setVisibleLines] = useState(0)
  const [isFading, setIsFading] = useState(false)

  const current = OUTPUTS[currentIdx]

  useEffect(() => {
    setVisibleLines(0)
    setIsFading(false)

    const lineTimer = setInterval(() => {
      setVisibleLines((v) => {
        if (v >= current.lines.length) {
          clearInterval(lineTimer)
          // Hold for 2.5s then transition out
          setTimeout(() => {
            setIsFading(true)
            setTimeout(() => {
              setCurrentIdx((i) => (i + 1) % OUTPUTS.length)
            }, 500)
          }, 2500)
          return v
        }
        return v + 1
      })
    }, 110)

    return () => clearInterval(lineTimer)
  }, [currentIdx, current.lines.length])

  return (
    <div className="relative animate-float">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-2xl bg-[#C6A04E]/10 blur-2xl scale-95 -z-10" />

      {/* Browser chrome */}
      <div className="bg-white rounded-2xl border border-[#e8eaed] shadow-2xl overflow-hidden w-full max-w-md">

        {/* Title bar */}
        <div className="bg-[#1B2A4A] px-4 py-3 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
          </div>
          <div className="flex-1 mx-3 bg-white/10 rounded-md px-3 py-1 text-xs text-white/50 font-mono">
            app.pillarbloom.com/dashboard
          </div>
        </div>

        {/* App body */}
        <div className="flex h-72">
          {/* Sidebar */}
          <div className="w-32 bg-[#fafafa] border-r border-[#e8eaed] p-3 flex-shrink-0">
            <div className="text-[9px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-2 px-1">Content</div>
            <SidebarItem icon="📁" label="All Projects" active={false} />
            <SidebarItem icon="✨" label="New Project" active={true} />
            <div className="text-[9px] font-semibold text-[#9CA3AF] uppercase tracking-widest mt-3 mb-2 px-1">Products</div>
            <SidebarItem icon="🎁" label="My Products" active={false} />
            <SidebarItem icon="⚡" label="New Product" active={false} />
            <div className="border-t border-[#e8eaed] mt-3 pt-3">
              <SidebarItem icon="⚙️" label="Settings" active={false} />
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 overflow-hidden">
            {/* Tabs */}
            <div className="flex gap-1 mb-3 overflow-x-hidden">
              {OUTPUTS.map((o, i) => (
                <button
                  key={o.tab}
                  className={`text-[9px] px-2 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    i === currentIdx
                      ? 'bg-[#C6A04E] text-white'
                      : 'text-[#9CA3AF] bg-[#f5f5f5]'
                  }`}
                >
                  {o.icon} {o.type.split('—')[0].trim()}
                </button>
              ))}
            </div>

            {/* Streaming content */}
            <div
              className="relative transition-opacity duration-500"
              style={{ opacity: isFading ? 0 : 1 }}
            >
              <div className="font-mono text-[10px] leading-relaxed text-[#1B2A4A] space-y-px">
                {current.lines.slice(0, visibleLines).map((line, i) => (
                  <div
                    key={`${currentIdx}-${i}`}
                    className="animate-stream-in"
                    style={{ animationDelay: '0ms' }}
                  >
                    {line === '' ? (
                      <span className="block h-2" />
                    ) : line.startsWith('#') ? (
                      <span className="font-bold text-[#1B2A4A]">{line}</span>
                    ) : line.startsWith('→') || line.startsWith('✅') ? (
                      <span className="text-[#C6A04E] font-medium">{line}</span>
                    ) : line.startsWith('Subject:') || line.startsWith('Preview:') ? (
                      <span className="text-[#6B7280]">{line}</span>
                    ) : line.startsWith('────') ? (
                      <span className="text-[#e8eaed]">{line}</span>
                    ) : (
                      <span>{line}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Cursor */}
              {visibleLines < current.lines.length && (
                <span className="inline-block w-1.5 h-3 bg-[#C6A04E] animate-pulse ml-0.5 align-middle" />
              )}
            </div>

            {/* Generating indicator */}
            <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
              {[1,2,3].map((i) => (
                <span key={i} className="typing-dot w-1.5 h-1.5 rounded-full bg-[#C6A04E] inline-block" />
              ))}
              <span className="text-[9px] text-[#9CA3AF] ml-1">generating</span>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="bg-[#fafafa] border-t border-[#e8eaed] px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
            <span className="text-[9px] text-[#6B7280]">Brand voice active</span>
          </div>
          <span className="text-[9px] text-[#9CA3AF]">8 outputs · 6 products</span>
        </div>
      </div>
    </div>
  )
}

function SidebarItem({ icon, label, active }: { icon: string; label: string; active: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 px-1.5 py-1 rounded-md text-[9px] font-medium mb-0.5 ${
      active ? 'bg-[#C6A04E]/10 text-[#C6A04E]' : 'text-[#6B7280]'
    }`}>
      <span className="text-[10px]">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  )
}
