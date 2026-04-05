export const OUTPUT_PROMPTS: Record<string, { title: string; prompt: string }> = {
  linkedin_post: {
    title: 'LinkedIn Post',
    prompt: `Write a compelling LinkedIn post based on the content.
- 150-250 words
- Hook in first line (no "I" as first word)
- 3-5 key insights as short paragraphs or bullets
- End with a thought-provoking question or call to action
- Professional but conversational tone
- No hashtag spam (max 3 relevant hashtags at end)`,
  },
  email_campaign: {
    title: 'Email Campaign',
    prompt: `Create a 3-email nurture sequence based on the content.

Email 1 — SUBJECT LINE + BODY: Introduce the core concept, deliver immediate value, end with a question.
Email 2 — SUBJECT LINE + BODY: Go deeper on one specific insight, share a framework or checklist.
Email 3 — SUBJECT LINE + BODY: Address the main objection/hesitation, include a clear CTA.

Each email: 150-200 words. Conversational. Specific.`,
  },
  tweet_thread: {
    title: 'Tweet Thread',
    prompt: `Write a 10-tweet thread based on the content.

Tweet 1: Hook — bold claim or surprising stat (under 280 chars)
Tweets 2-9: One insight per tweet, numbered (2/, 3/, etc.), each under 280 chars
Tweet 10: Summary + CTA to follow or share

Make each tweet punchy and standalone. No filler.`,
  },
  lead_magnet: {
    title: 'Lead Magnet',
    prompt: `Create a lead magnet outline based on the content. Choose the best format (checklist, cheat sheet, or mini-guide).

Include:
- Compelling title
- Subtitle explaining the specific benefit
- 5-10 actionable items or sections
- Each item: one line headline + 1-2 sentence explanation
- Brief intro paragraph
- Closing CTA

Make it immediately useful. Someone should get value in 5 minutes.`,
  },
  video_script: {
    title: 'Video Script',
    prompt: `Write a 3-5 minute YouTube/LinkedIn video script based on the content.

Structure:
- HOOK (0:00-0:15): Pattern interrupt — bold statement or question
- PROMISE (0:15-0:30): What viewer will learn/get
- BODY (0:30-3:30): 3 main points, one story or example each
- CTA (last 30s): Subscribe/follow + one action to take

Include [B-ROLL SUGGESTION] notes. Write for spoken delivery — short sentences, natural rhythm.`,
  },
  key_quote: {
    title: 'Key Quotes',
    prompt: `Extract or create 8 quotable, shareable quotes from the content.

Requirements for each:
- 10-30 words
- Self-contained — makes sense without context
- Strong, confident, specific language
- Suitable for image overlay or social share

Format as numbered list. Vary the style: some bold claims, some counterintuitive, some actionable.`,
  },
  newsletter: {
    title: 'Newsletter Edition',
    prompt: `Write a newsletter edition based on the content. Style: smart, opinionated, like a trusted expert sharing what they actually think.

Structure:
- SUBJECT LINE (5-9 words, curiosity-driven)
- PREVIEW TEXT (under 90 chars)
- OPENING (2-3 sentences — hook + why this matters now)
- MAIN SECTION (400-500 words — key insight with examples, data, or story)
- TAKEAWAY (3-bullet summary)
- CLOSING (1-2 sentences + signature)

Opinionated. No corporate hedging.`,
  },
  executive_summary: {
    title: 'Executive Summary',
    prompt: `Write an executive summary of the content for a busy decision-maker.

Format:
- HEADLINE: One-sentence summary of the core message
- SITUATION: What problem or opportunity this addresses (2-3 sentences)
- KEY FINDINGS: 4-5 bullet points, each starting with a strong verb
- IMPLICATIONS: What this means for the reader's business/decisions (2-3 sentences)
- RECOMMENDED ACTION: One clear, specific next step

Total length: 250-350 words. No jargon. Crisp.`,
  },
}

export const PRODUCT_PROMPTS: Record<string, { title: string; prompt: string }> = {
  ebook: {
    title: 'Ebook / PDF Lead Magnet',
    prompt: `Create a complete, professional ebook based on the source content.

# [COMPELLING, BENEFIT-DRIVEN TITLE]
## [Supporting subtitle clarifying the transformation]

---

## Introduction

[Hook, credibility statement, promise of transformation, how to use this ebook — 200 words]

---

## Chapter 1: [Title]

### Overview
[100-word chapter overview]

### Key Concepts
**Concept 1: [Name]**
[2-3 sentence explanation with real-world relevance]

**Concept 2: [Name]**
[2-3 sentence explanation]

**Concept 3: [Name]**
[2-3 sentence explanation]

### Real-World Application
[Concrete example showing these concepts in action — 100 words]

### Chapter Takeaway
> [One-sentence key insight formatted as a pull quote]

---

## Chapter 2: [Title]

[Same structure as Chapter 1]

---

## Chapter 3: [Title]

[Same structure as Chapter 1]

---

## Conclusion

[Recap key insights, call to transformation, next steps CTA — 150 words]

---

## About the Author

[2-3 sentence placeholder based on content expertise demonstrated]

---

*Total target: 2,000–2,500 words. Every chapter must be immediately actionable.*`,
  },
  mini_course: {
    title: 'Mini-Course Outline',
    prompt: `Design a complete mini-course from the source content.

# [TRANSFORMATION-FOCUSED COURSE TITLE]
**Tagline:** [One-sentence promise]
**Target Student:** [Who this is for, what problem it solves]

## Learning Outcomes
By the end of this course, students will be able to:
1. [Specific skill/result]
2. [Specific skill/result]
3. [Specific skill/result]
4. [Specific skill/result]
5. [Specific skill/result]

---

## Module 1: [Title] ⏱ Est. [X] minutes

**Module Goal:** [What students will achieve in this module]

| Lesson | Title | What You'll Learn | Time |
|--------|-------|-------------------|------|
| 1.1 | [Title] | [2-sentence description] | [X] min |
| 1.2 | [Title] | [2-sentence description] | [X] min |
| 1.3 | [Title] | [2-sentence description] | [X] min |

**Module Assignment:** [Specific action to complete before Module 2]

**Assessment Questions:**
1. [Quiz question testing Module 1 comprehension]
2. [Application question]
3. [Reflection question]

---

## Module 2: [Title] ⏱ Est. [X] minutes

[Same structure]

---

## Module 3: [Title] ⏱ Est. [X] minutes

[Same structure]

---

## Module 4: [Title] ⏱ Est. [X] minutes

[Same structure]

---

## Bonus Module: [Title — advanced or supplementary]

[2 lessons with same format]

---

## Course Completion
**Certificate criteria:** [What earns the certificate]
**Community/Support:** [Where students connect]
**Next Steps:** [What to do after completing the course]`,
  },
  email_course: {
    title: 'Email Course (5-7 Days)',
    prompt: `Write a complete 7-day email course based on the source content.

# [COURSE NAME]

---

## Welcome Email (Day 0)

**Subject:** [Compelling subject line]
**Preview text:** [Under 90 chars]

---

[Welcome body — 200 words. Cover: what to expect, why you'll love it, one quick win to build momentum. End with "Your first lesson arrives tomorrow."]

---

## Day 1: [Core Concept Title]

**Subject:** [Subject line]
**Preview text:** [Under 90 chars]

---

[250-word body. One big idea. Why it matters. One specific action step. End with a forward hook to Day 2.]

**✅ Today's Action:** [Specific, completable task]

---

## Day 2: [Core Concept Title]

**Subject:** [Subject line]
**Preview text:** [Under 90 chars]

---

[250-word body. Build on Day 1. Include a case example or story. One action step.]

**✅ Today's Action:** [Specific, completable task]

---

## Day 3: [Core Concept Title]

**Subject:** [Subject line]
**Preview text:** [Under 90 chars]

---

[250-word body. Common mistake to avoid. Framework or checklist. One action step.]

**✅ Today's Action:** [Specific, completable task]

---

## Day 4: [Advanced Application Title]

**Subject:** [Subject line]
**Preview text:** [Under 90 chars]

---

[250-word body. Level up from Days 1-3. Introduce a tool or system.]

**✅ Today's Action:** [Specific, completable task]

---

## Day 5: [Real-World Example Title]

**Subject:** [Subject line]
**Preview text:** [Under 90 chars]

---

[250-word body. Case study or detailed example. Show the system working in practice.]

**✅ Today's Action:** [Specific, completable task]

---

## Day 6: [Putting It Together Title]

**Subject:** [Subject line]
**Preview text:** [Under 90 chars]

---

[250-word body. Synthesize all concepts. Give them the complete system/process summary.]

**✅ Today's Action:** [Specific, completable task]

---

## Day 7: Graduation 🎓

**Subject:** [Subject line]
**Preview text:** [Under 90 chars]

---

[200-word body. Celebrate their completion. Recap what they've learned. Present the natural next step CTA.]

**🎯 Your Next Step:** [Clear, compelling call to action]`,
  },
  workbook: {
    title: 'Coaching Workbook',
    prompt: `Create a professional coaching workbook from the source content.

# [ACTION-ORIENTED WORKBOOK TITLE]
### Your Step-by-Step Guide to [Transformation]

---

**How to use this workbook:** [150-word intro — pace yourself, be honest, commit to the process]

**My commitment:** I commit to completing this workbook by _____________ because _____________.

**Signature:** _______________________

---

## Section 1: Foundation — Where You Are Now

### Reflection Prompt 1
[Deep question about their current situation]

**Your answer:**
_______________________________________________
_______________________________________________
_______________________________________________

### Reflection Prompt 2
[Question about their desired outcome in specific terms]

**Your answer:**
_______________________________________________
_______________________________________________
_______________________________________________

### Framework Exercise: [Name from source content]
[Apply the core concept — step-by-step instructions for the exercise]

| Step | Action | Your Response |
|------|--------|---------------|
| 1 | [Action] | |
| 2 | [Action] | |
| 3 | [Action] | |

**✅ Section 1 Action Step:** [Concrete, immediate action]

---

## Section 2: Strategy — Your Game Plan

### Obstacle Mapping
What's standing between you and [outcome]?

**Your top 3 obstacles:**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

**For each obstacle, your countermove:**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Framework Exercise: [Name]
[Apply a tool or model from source content]

### 30-Day Implementation Plan

| Week | Focus | Key Actions | Done? |
|------|-------|-------------|-------|
| Week 1 | [Focus] | [Actions] | ☐ |
| Week 2 | [Focus] | [Actions] | ☐ |
| Week 3 | [Focus] | [Actions] | ☐ |
| Week 4 | [Focus] | [Actions] | ☐ |

**✅ Section 2 Action Step:** [Concrete strategic action]

---

## Section 3: Execution — Daily Practice

### 7-Day Check-In Prompts
Complete one each morning:

**Day 1:** [Question]
_______________________________________________

**Day 2:** [Question]
_______________________________________________

**Day 3:** [Question]
_______________________________________________

**Day 4:** [Question]
_______________________________________________

**Day 5:** [Question]
_______________________________________________

**Day 6:** [Question]
_______________________________________________

**Day 7:** [Question]
_______________________________________________

### Weekly Review (Complete each Sunday)
1. What did I accomplish this week? _______________
2. What got in the way? _______________
3. What do I want to focus on next week? _______________
4. What am I most proud of? _______________
5. What will I do differently? _______________

---

## Section 4: Integration — Locking In the Gains

### What Has Changed?
[Reflection prompt comparing where they started to where they are now]

**Your answer:**
_______________________________________________
_______________________________________________

### Wins & Lessons Log

| Date | Win | Lesson Learned |
|------|-----|----------------|
| | | |
| | | |
| | | |

### My Next 90-Day Vision
[Guided prompts for planning the next phase]

**In 90 days, I will have:** _______________________________________________
**My #1 priority is:** _______________________________________________
**The one habit I'll build:** _______________________________________________

---

## Appendix

### Key Frameworks Summary
[Summarize the main frameworks/tools covered in the workbook]

### Recommended Resources
[2-3 resource suggestions based on the source content topic]`,
  },
  checklist: {
    title: 'Checklist / Cheat Sheet',
    prompt: `Create a comprehensive, actionable checklist and cheat sheet from the source content.

# The Ultimate [Topic] Checklist
### [Specific benefit — e.g., "Everything you need to go from X to Y in 30 days"]

---

## ⚡ Quick Reference Card

**The 3 Core Principles:**
1. **[Principle]** — [One-line explanation]
2. **[Principle]** — [One-line explanation]
3. **[Principle]** — [One-line explanation]

**The #1 Mistake Most People Make:**
[One sentence]

**The Fastest Win You Can Get Today:**
[One sentence]

---

## ✅ The Master Checklist

### Phase 1: [Stage Name] — [Goal of this phase]

- [ ] [Specific action item — include brief context explaining why]
- [ ] [Specific action item — include brief context]
- [ ] [Specific action item — include brief context]
- [ ] [Specific action item — include brief context]
- [ ] [Specific action item — include brief context]

**Phase 1 Complete When:** [Clear completion criteria]

---

### Phase 2: [Stage Name] — [Goal]

- [ ] [Action item]
- [ ] [Action item]
- [ ] [Action item]
- [ ] [Action item]
- [ ] [Action item]

**Phase 2 Complete When:** [Clear completion criteria]

---

### Phase 3: [Stage Name] — [Goal]

- [ ] [Action item]
- [ ] [Action item]
- [ ] [Action item]
- [ ] [Action item]
- [ ] [Action item]

**Phase 3 Complete When:** [Clear completion criteria]

---

### Phase 4: [Stage Name] — [Goal]

- [ ] [Action item]
- [ ] [Action item]
- [ ] [Action item]
- [ ] [Action item]
- [ ] [Action item]

**Phase 4 Complete When:** [Clear completion criteria]

---

## ❌ Common Mistakes to Avoid

| Mistake | Why It Fails | The Fix |
|---------|-------------|---------|
| [Mistake] | [Why] | [Fix] |
| [Mistake] | [Why] | [Fix] |
| [Mistake] | [Why] | [Fix] |

---

## ⚡ Quick Wins — Do These First

1. **[Highest-leverage action]** — [Expected result]
2. **[Highest-leverage action]** — [Expected result]
3. **[Highest-leverage action]** — [Expected result]

---

## 📚 Resources & Tools

[Relevant tools, templates, or references from source content — 3-5 items with one-line descriptions]`,
  },
  product_description: {
    title: 'Product Sales Copy (Gumroad/Payhip)',
    prompt: `Write complete sales copy for this digital product, ready for Gumroad, Payhip, or Etsy.

# [COMPELLING, BENEFIT-FOCUSED PRODUCT NAME]

**Tagline:** [One sentence — the transformation this product delivers]

**Suggested Price:** $[XX] | ~~$[anchor price]~~ — [Brief justification]

---

## Short Description
*(160 chars — for SEO/marketplace preview)*

[Punchy, keyword-rich description that makes someone stop scrolling]

---

## Full Sales Page

### [BOLD BENEFIT HEADLINE — make it about the reader's outcome]

[Opening hook — 100 words. Speak directly to the pain. "You've tried X, Y, Z. Nothing worked. Here's why — and the fix."]

---

### What You Get

✓ **[Deliverable]** — [Specific benefit, not feature]
✓ **[Deliverable]** — [Specific benefit]
✓ **[Deliverable]** — [Specific benefit]
✓ **[Deliverable]** — [Specific benefit]
✓ **[Deliverable]** — [Specific benefit]

---

### This Is For You If...

→ You're a [persona] who [struggle]
→ You want [outcome] without [sacrifice]
→ You're ready to [action — commitment signal]

### This Is NOT For You If...

→ [Disqualifier — sets expectations, builds trust]
→ [Disqualifier]

---

### The Result

[Vivid, specific description of transformation — what their work/life/business looks like after using this. 75 words.]

---

### FAQ

**Q: [Most common objection — usually price or time]**
A: [Confident, specific answer]

**Q: [Second most common concern]**
A: [Confident answer]

**Q: [Question about what they actually get]**
A: [Clear, reassuring answer]

---

### [Get [Product Name] — $XX →]

✓ Instant download
✓ 30-day money-back guarantee — if you don't find it useful, email me and I'll refund you immediately
✓ [One more reassurance specific to the product]

---

**Tags for marketplace:** [8-10 relevant search tags separated by commas]`,
  },
}
