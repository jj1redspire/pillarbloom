'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

const SAMPLE_INPUT = `5 Productivity Tips for Remote Workers

Remote work has fundamentally changed how we approach our days. Without a commute, a fixed schedule, or a manager looking over your shoulder, the responsibility for your productivity falls entirely on you. Here are five evidence-backed strategies that actually work.

1. Time-block your calendar, not just your to-do list. The problem with to-do lists is they don't account for time. A task that takes 30 minutes lives next to one that takes 3 hours. Instead, assign every important task a specific time slot. Treat those blocks like meetings you can't reschedule.

2. Create a fake commute. The transition from "home mode" to "work mode" matters. Without it, you're context-switching from your bedroom to your inbox with nothing in between. A 10-minute walk, a specific playlist, or even just making coffee with your phone down — the ritual signals your brain that work has started.

3. Do the hard thing first. Your willpower and focus are highest in the first 90 minutes after you wake. Use that window for your most cognitively demanding work. Don't check email, don't attend optional meetings, don't scroll. The rest of the day is for everything else.

4. Build in visible endings. Office workers have a natural end to their day: the commute home, the building closing, colleagues leaving. Remote workers don't. Set a hard stop time, close your laptop, and do something that signals the end of work. Without visible endings, work bleeds into everything.

5. Protect your energy, not just your time. You can have all the time in the world and still be unproductive if you're exhausted, underfed, or isolated. Sleep, movement, and real social connection are productivity variables — not self-care luxuries.`

const EBOOK_OUTPUT = `# The Remote Worker's Productivity Playbook
## A practical guide for people who work from home and want to actually get things done

---

### Introduction: The Productivity Problem Nobody Talks About

You got the remote job. Congratulations.

Now the hard part begins.

Without the structure of an office — fixed hours, a commute, colleagues you nod at in hallways — your day is a blank canvas. That sounds like freedom. It is. But blank canvases can be paralyzing.

This playbook takes five proven productivity strategies and shows you exactly how to build them into your remote work life. Not theory. Not inspiration. Implementation.

---

### Chapter 1: Time-Blocking — Your Calendar as Your Boss

**The core problem with to-do lists**

A to-do list is an inventory. It tells you what exists, not when to do it. A 30-minute task sits next to a 3-hour task with no distinction. The result? You pick the quick wins, defer the hard work, and end every day wondering where the time went.

**What time-blocking actually looks like**

Instead of a list, you build a schedule. Every important task gets a specific time slot. "Write quarterly report" becomes "9:00–11:00 AM, Tuesday." That slot is yours. It's not a suggestion.

**How to start:**
- Review your to-do list on Sunday evening
- Estimate time for each task honestly (multiply your first estimate by 1.5)
- Open your calendar and assign each task a specific block
- Leave 20% of your calendar empty — buffers save you

**The rule:** If something doesn't have a time slot, it doesn't get done today.

---

### Chapter 2: The Fake Commute — Protecting Your Most Important Transition

**Why transitions matter**

Your brain uses environmental and behavioral cues to shift between modes. When you left for an office, the act of getting ready, driving, and arriving told your brain: work is starting. Remote work removes those cues entirely.

Without a transition ritual, you're trying to go from half-asleep to focused with nothing bridging the gap. You'll spend the first hour in a fog.

**Building your fake commute**

The ritual doesn't need to be long. It needs to be consistent and distinct from your non-work hours.

Options that work:
- A 10–15 minute walk (ideally outside, phone in pocket)
- A specific "work playlist" you only listen to while working
- A full coffee-making ritual, done slowly and deliberately
- Journaling three things you want to accomplish today

The ritual ends when work begins. That's the rule.

---

### Chapter 3: Deep Work First — Protecting Your Peak Hours

**The neuroscience of morning focus**

Cognitive resources aren't infinite. Decision fatigue is real. Your prefrontal cortex — responsible for focused, complex thinking — operates at peak efficiency during the first 90 minutes after you wake.

Most remote workers waste this window on email.

**The inversion**

Flip your day. Use the first 90 minutes for your hardest, most important work. No email. No Slack. No optional meetings. Just the work that moves the needle.

Then check your messages. Then take meetings. Then handle everything else.

**What "hard work first" looks like:**
- Identify your Most Important Task (MIT) the night before
- Start it within 30 minutes of sitting down to work
- Set a timer for 90 minutes and don't stop
- Email doesn't exist until that timer goes off

---

### Chapter 4: Visible Endings — The Art of Actually Stopping

**The office worker's invisible advantage**

Office workers have natural stopping signals: colleagues heading home, the building emptying, the commute back. These aren't productivity hacks — they're environmental structures that enforce boundaries.

Remote workers have none of these.

**Why "I'll just finish this one thing" is dangerous**

Without a hard stop, work expands to fill all available time. You're never truly off. You check your phone at dinner. You think about projects at 11 PM. You're always technically available.

This isn't dedication. It's the slow erosion of everything that makes you effective.

**Building your visible ending:**
- Choose a stop time. Honor it like a flight departure.
- Create a shutdown ritual: close all tabs, write tomorrow's MIT, close the laptop
- Do something distinctly non-work immediately after: walk, call a friend, cook dinner
- Your laptop stays closed until morning

---

### Chapter 5: Energy Management — The Variable Everyone Ignores

**The productivity conversation we're not having**

We obsess over time management. We ignore energy management. But you can have 8 perfectly time-blocked hours and produce nothing if you're running on 5 hours of sleep, haven't moved your body, and haven't talked to another human being in three days.

**The four energy variables:**

1. **Sleep** — Non-negotiable. 7–9 hours. No, you're not an exception.
2. **Movement** — 30 minutes of physical activity increases focus for 2–4 hours afterward. It's not a luxury. It's a productivity tool.
3. **Nutrition** — Don't work through lunch. A 20-minute real meal beats three hours of brain fog.
4. **Connection** — Remote isolation is a genuine cognitive risk. Schedule social contact. It doesn't have to be much. It has to be real.

---

### Conclusion: The System That Actually Works

None of these tips require willpower if you build them as systems.

- Time-blocking: set up on Sunday, follow on Monday
- Fake commute: same ritual, same time, every workday
- Deep work first: MIT written the night before, protected in the morning
- Visible endings: hard stop time, non-negotiable
- Energy management: sleep, move, eat, connect — non-negotiable

Start with one. Build the habit. Add the next.

Your remote work life can be the most productive of your career. Or it can slowly absorb your entire life.

The difference is design.

---

*Generated by PillarBloom — Turn your expertise into products that sell.*
*pillarbloom.com*`

const EMAIL_COURSE_OUTPUT = `# 5-Day Email Course: Remote Work Productivity
## "The Remote Worker's Edge" — From scattered to focused in 5 days

---

### Course Overview

**Transformation:** Go from reactive, scattered remote work to intentional, focused, high-output days.

**Who this is for:** Anyone who works from home and feels like they're always busy but never productive.

**Delivery:** One email per day, Monday–Friday. Each email = one strategy + one action.

---

### Day 1: The Problem (and Why It's Not Your Fault)

**Subject:** You're not lazy. Your environment is broken.

**Preview text:** Remote work removed every structure that used to keep you productive.

---

Hey [First Name],

Welcome to The Remote Worker's Edge.

Let me start with something most productivity courses won't say:

*If you're struggling with remote work productivity, it's not a character flaw.*

Offices — for all their annoyances — had an invisible infrastructure keeping you on track. Fixed hours. Physical presence. Social accountability. A commute that forced a mental transition.

Remote work stripped all of that away.

And nobody gave you a replacement.

This week, we're building one.

**Today's action:** Write down your answer to this question — "What's the one hour of my day that most consistently goes to waste?"

Hold onto that answer. We'll use it tomorrow.

See you then,
[Your name]

---

### Day 2: Time-Blocking (The Only System That Actually Works)

**Subject:** Stop making to-do lists. Start making schedules.

**Preview text:** A to-do list tells you what exists. A time block tells you when to do it.

---

Hey [First Name],

Yesterday you identified your most wasted hour. Today, we're fixing it.

The problem with to-do lists: they're inventories, not schedules. A 30-minute task looks identical to a 3-hour task. So you pick the quick wins, defer the hard stuff, and reach 5 PM feeling like you ran a marathon and went nowhere.

**The fix: time-blocking**

Open your calendar right now. Every important task gets a specific time slot — treated like a meeting that can't be rescheduled.

**Your action today:**
1. List your top 3 tasks for tomorrow
2. Estimate how long each actually takes (then add 50%)
3. Assign each one a specific block on tomorrow's calendar
4. Leave two 30-minute buffers for the unexpected

That's it. Do this for one week. Your productive output will double.

Tomorrow: the habit that makes your brain switch into work mode.

[Your name]

---

### Day 3: The Fake Commute

**Subject:** The 10-minute ritual that saved my mornings

**Preview text:** Your brain needs a transition. Here's how to create one from scratch.

---

Hey [First Name],

Here's what happened when offices went remote:

Millions of people went from waking up → commuting → arriving at work (brain switched on)

To waking up → opening laptop (brain still half asleep).

The commute wasn't just wasted time. It was a transition ritual. A signal to your brain that work mode was beginning.

Without it, you spend the first hour of every day in a fog, half-working and half-wondering why you can't focus.

**Build your fake commute:**

Choose ONE ritual you'll do every workday morning before opening your laptop:
- A 10-minute walk (best option — get outside)
- A slow coffee-making ritual, phone in another room
- 5 minutes of journaling: "What are my three priorities today?"

The ritual ends. Work begins. That's the rule.

**Today's action:** Choose your ritual and do it tomorrow morning.

Tomorrow we tackle the hardest part: actually stopping work at the end of the day.

[Your name]

---

### Day 4: Visible Endings

**Subject:** The reason you can never fully relax (and how to fix it)

**Preview text:** Remote work doesn't end. Unless you make it.

---

Hey [First Name],

Office workers have something you don't: automatic stopping signals.

Colleagues leaving. Buildings closing. Commutes home. These aren't productivity strategies — they're environmental structures that enforce an end to the workday.

Without them, work expands. You check Slack at dinner. You think about projects at midnight. You're never fully off.

This isn't dedication. It's the slow erosion of the rest that makes you effective.

**Build your visible ending:**

1. Choose a stop time. Write it down. Honor it like a flight departure.
2. Create a 5-minute shutdown ritual: close all tabs, write tomorrow's single most important task, physically close your laptop.
3. Immediately do something non-work: walk, cook, call someone.

Your laptop stays closed until morning.

**Today's action:** Set your stop time right now. Put it in your calendar as a recurring event: "WORK ENDS."

One more day. Tomorrow: the variable everyone ignores.

[Your name]

---

### Day 5: Energy Management (The One Thing That Overrides Everything)

**Subject:** You can have perfect systems and still produce nothing

**Preview text:** Productivity isn't just time management. It's energy management.

---

Hey [First Name],

You've got your time-blocking system. Your fake commute. Your shutdown ritual.

Here's what overrides all of it: showing up exhausted, undernourished, and isolated.

Productivity is an energy game. And remote workers are at unusual risk for energy depletion — because the isolation, the blurred boundaries, and the sedentary nature of home-based work deplete energy silently.

**The four non-negotiables:**

**Sleep:** 7–9 hours. It's not a personality trait to need less. Sacrificing sleep for productivity is borrowing against tomorrow at very high interest.

**Movement:** 30 minutes of physical activity increases cognitive performance for 2–4 hours afterward. It's not a luxury. It's a productivity tool.

**Food:** Don't work through lunch. A 20-minute real meal beats three hours of brain fog.

**Human connection:** Schedule it. Remote isolation is real. A 20-minute call with a friend is ROI-positive.

**Today's action:** Pick one of these four you're currently neglecting. Put one specific action in your calendar this week.

---

### Course Complete — Your Next Step

You now have the five-part system:

✓ Time-blocking (your work has a when)
✓ Fake commute (your brain has a transition)
✓ Deep work first (your peak hours are protected)
✓ Visible endings (your rest is real)
✓ Energy management (your foundation holds)

Start with the one that would make the biggest difference. Build the habit. Add the next.

If you want to go deeper — and build digital products from your own expertise like this course was built — try PillarBloom free at **pillarbloom.com**

It takes one piece of content and turns it into an ebook, email course, workbook, or sales copy. In minutes. In your voice.

[Your name]

---

*Course generated by PillarBloom — pillarbloom.com*`

type OutputKey = 'ebook' | 'email_course'

const OUTPUTS: { key: OutputKey; label: string; icon: string; content: string }[] = [
  { key: 'ebook', label: 'Ebook / PDF', icon: '📖', content: EBOOK_OUTPUT },
  { key: 'email_course', label: '5-Day Email Course', icon: '📧', content: EMAIL_COURSE_OUTPUT },
]

export default function DemoClient() {
  const [activeTab, setActiveTab] = useState<OutputKey>('ebook')
  const [running, setRunning] = useState(false)
  const [started, setStarted] = useState(false)
  const [displayedText, setDisplayedText] = useState<Record<OutputKey, string>>({ ebook: '', email_course: '' })
  const [done, setDone] = useState<Record<OutputKey, boolean>>({ ebook: false, email_course: false })
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const positionRef = useRef<Record<OutputKey, number>>({ ebook: 0, email_course: 0 })

  function streamOutput(key: OutputKey, onDone: () => void) {
    const fullText = OUTPUTS.find((o) => o.key === key)!.content
    const chunkSize = 12

    timerRef.current = setInterval(() => {
      const pos = positionRef.current[key]
      if (pos >= fullText.length) {
        if (timerRef.current) clearInterval(timerRef.current)
        setDone((prev) => ({ ...prev, [key]: true }))
        onDone()
        return
      }
      const next = Math.min(pos + chunkSize, fullText.length)
      positionRef.current[key] = next
      setDisplayedText((prev) => ({ ...prev, [key]: fullText.slice(0, next) }))
    }, 16)
  }

  function handleRun() {
    if (running || started) return
    setRunning(true)
    setStarted(true)
    setActiveTab('ebook')

    streamOutput('ebook', () => {
      // Small pause then stream email course
      setTimeout(() => {
        setActiveTab('email_course')
        streamOutput('email_course', () => {
          setRunning(false)
        })
      }, 600)
    })
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <nav className="bg-white border-b border-[#e8eaed] px-6 h-14 flex items-center justify-between">
        <Link href="/">
          <Logo variant="dark" width={140} />
        </Link>
        <Link
          href="/signup"
          className="bg-[#C6A04E] hover:bg-[#D4B574] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Start Free →
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-[#C6A04E]/10 border border-[#C6A04E]/25 rounded-full px-4 py-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A04E] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#C6A04E]">Live Demo — No Signup Required</span>
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#1B2A4A] tracking-tight leading-tight mb-4">
            Watch PillarBloom Work
          </h1>
          <p className="text-lg text-[#6B7280] max-w-xl mx-auto">
            One blog post → an ebook and a 5-day email course. Hit the button and watch it generate in real time.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* Input */}
          <div className="bg-white rounded-2xl border border-[#e8eaed] overflow-hidden shadow-sm">
            <div className="bg-[#fafafa] border-b border-[#e8eaed] px-5 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#e8eaed]" />
                <div className="w-3 h-3 rounded-full bg-[#e8eaed]" />
                <div className="w-3 h-3 rounded-full bg-[#e8eaed]" />
              </div>
              <span className="text-xs font-medium text-[#6B7280] mx-auto">Input — Your Content</span>
            </div>
            <div className="p-5">
              <div className="bg-[#fafafa] border border-[#e8eaed] rounded-xl p-4 h-72 overflow-y-auto">
                <p className="text-xs text-[#6B7280] font-medium mb-3 uppercase tracking-widest">Sample post loaded:</p>
                <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-wrap font-mono">{SAMPLE_INPUT}</p>
              </div>

              {/* Product selections */}
              <div className="mt-4 space-y-2">
                {OUTPUTS.map((o) => (
                  <div key={o.key} className="flex items-center gap-3 bg-[#fafafa] border border-[#C6A04E]/30 rounded-lg px-4 py-2.5">
                    <div className="w-4 h-4 rounded bg-[#C6A04E] flex items-center justify-center flex-shrink-0">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-sm">{o.icon}</span>
                    <span className="text-sm font-medium text-[#1B2A4A]">{o.label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleRun}
                disabled={running || started}
                className={`w-full mt-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                  started
                    ? 'bg-green-50 border border-green-200 text-green-700 cursor-default'
                    : 'bg-[#C6A04E] hover:bg-[#D4B574] text-white shadow-lg shadow-[#C6A04E]/25 hover:-translate-y-0.5'
                }`}
              >
                {running ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white typing-dot" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white typing-dot" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white typing-dot" />
                    <span>Generating…</span>
                  </span>
                ) : started ? (
                  '✓ Generated!'
                ) : (
                  '✨ Generate Products'
                )}
              </button>
            </div>
          </div>

          {/* Output */}
          <div className="bg-white rounded-2xl border border-[#e8eaed] overflow-hidden shadow-sm flex flex-col">
            <div className="bg-[#fafafa] border-b border-[#e8eaed] px-5 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#e8eaed]" />
                <div className="w-3 h-3 rounded-full bg-[#e8eaed]" />
                <div className="w-3 h-3 rounded-full bg-[#e8eaed]" />
              </div>
              <span className="text-xs font-medium text-[#6B7280] mx-auto">Output — Your Products</span>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#e8eaed] px-4 pt-3 gap-1">
              {OUTPUTS.map((o) => (
                <button
                  key={o.key}
                  onClick={() => setActiveTab(o.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg transition-all border-b-2 -mb-px ${
                    activeTab === o.key
                      ? 'border-[#C6A04E] text-[#1B2A4A] bg-white'
                      : 'border-transparent text-[#9CA3AF] hover:text-[#6B7280]'
                  }`}
                >
                  <span>{o.icon}</span>
                  <span>{o.label}</span>
                  {done[o.key] && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
                  {running && activeTab === o.key && !done[o.key] && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6A04E] animate-pulse" />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 p-5 overflow-hidden">
              {!started ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-[#fafafa] rounded-2xl border border-[#e8eaed] flex items-center justify-center text-2xl mx-auto mb-4">
                      ✨
                    </div>
                    <p className="text-sm text-[#9CA3AF] font-medium">Hit &ldquo;Generate Products&rdquo; to see it happen</p>
                    <p className="text-xs text-[#C6A04E] mt-1">Watch real-time AI generation</p>
                  </div>
                </div>
              ) : (
                <div className="h-80 overflow-y-auto">
                  <pre className="text-xs text-[#374151] leading-relaxed whitespace-pre-wrap font-mono">
                    {displayedText[activeTab]}
                    {running && activeTab === activeTab && !done[activeTab] && (
                      <span className="inline-block w-2 h-3.5 bg-[#C6A04E] ml-0.5 animate-pulse" />
                    )}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Post-demo CTA */}
        {started && (
          <div className="mt-8 bg-[#1B2A4A] rounded-2xl p-8 text-center animate-fade-up">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
              That was your content. In your voice.
            </h2>
            <p className="text-white/70 mb-6 max-w-xl mx-auto leading-relaxed">
              This demo uses a sample post. Imagine running your own content through PillarBloom — your expertise, your audience, your products.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-[#C6A04E] hover:bg-[#D4B574] text-white font-semibold px-8 py-4 rounded-xl text-sm transition-all shadow-lg shadow-[#C6A04E]/30 hover:-translate-y-0.5"
              >
                Create free account — try with your content →
              </Link>
              <Link
                href="/lead-magnet"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/80 hover:text-white hover:border-white/40 font-medium px-8 py-4 rounded-xl text-sm transition-all"
              >
                Get the free playbook first
              </Link>
            </div>
            <p className="text-white/40 text-xs mt-4">No credit card required · 14-day free trial</p>
          </div>
        )}

      </div>
    </div>
  )
}
