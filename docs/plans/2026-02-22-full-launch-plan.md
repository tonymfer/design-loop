# design-loop Full Launch Plan

> Single source of truth. All copy-paste-ready content, strategy, timeline, and checklists in one place.

---

## 1. Strategy Overview

### Core Narrative

AI can code your UI — but the output always looks AI-generated. design-loop is a Claude Code plugin that gives Claude visual feedback: it screenshots what Claude builds, scores it against 5 design criteria, and fixes issues autonomously until the result looks *designed*, not generated.

### Audience Segmentation

| Platform | Primary audience | What they care about | beep.works integration |
|----------|-----------------|---------------------|----------------------|
| **X** | Claude Code builders, AI devs | Technical details, install command, proof it works | **Minimal** — "a Farcaster app with ~43K users" (credibility number only, no tag, no crypto) |
| **Farcaster** | Builders, crypto-native devs | Composability, real products, builder credibility | **Full** — audience already knows beep.works, lead with it |
| **LinkedIn** | Hiring managers, VCs, founders | Career narrative, systems thinking, scale | **Subtle** — co-founder credential in one paragraph + headline |

### Platform Sequencing

| Day | Platform | Content | beep.works exposure |
|-----|----------|---------|-------------------|
| Pre-launch | X | Pre-engage with Claude Code builders | None |
| Day 1 | X | 8-tweet thread | One sentence in Tweet 2 ("43K users") |
| Day 2 | Farcaster | Cast 1 — beep.works origin hook | Full |
| Day 2 | X | Quote-tweet follow-up with terminal GIF | None |
| Day 3 | X | /export-loop proof reply | None |
| Day 4-5 | Farcaster | Cast 2 — composable intelligence | Tech stack anchor line |
| Day 5 | LinkedIn | Long-form career narrative | Co-founder paragraph + headline |
| Day 6+ | Farcaster | Cast 3 — dual narrative (conditional) | Full — "co-founding beep.works" |
| Day 7+ | Farcaster | Cast 4 — before/after proof (conditional) | Full — visual proof |

---

## 2. X Thread (8 tweets, copy-paste ready)

**When:** Tuesday–Thursday, 9:30 AM EST (11:30 PM KST)
**Tags:** @geoffreyhuntley (Tweet 2), @claudeai + @AnthropicAI (Tweet 8)
**Hashtags:** NONE (developer X is network-driven)
**Cross-post:** Bluesky same day

### Tweet 1 — HOOK

```
AI can code your UI. But the result always looks... AI-generated.

Same Inter font. Same purple gradient. Same uniform card grid. You know the look.

I built design-loop — a Claude Code plugin that detects AI-default aesthetics and fixes them. Autonomously.

Here's what it does
```

**ATTACH:** 30-60 sec screen recording of design-loop.vercel.app — click through Before → Iter 1 → Iter 2 → Iter 3 → Final while scores animate. The whole page transforms. This is the hero video.

---

### Tweet 2 — ORIGIN STORY + ralph-loop credit (UPDATED)

```
It started when I was iterating on a Farcaster app with ~43K users.

Ralph taught Claude to loop. But Claude was still flying blind — writing CSS without ever seeing the result.

What if Claude could actually see each change?

So I gave it eyes. design-loop screenshots your page after every change, evaluates it, fixes what's wrong, and loops again.
```

> **beep.works note:** One sentence swap. "a Farcaster app with ~43K users" replaces "my website". No @beeponbase tag. No crypto details. The X dev audience reads "real app, real scale" — that's all they need.

---

### Tweet 3 — PILLAR 1: Screenshot intelligence

```
Most screenshot tools capture one full-page blob. Useless for design — problems blur together.

design-loop captures each section individually.

It detects semantic HTML landmarks — <header>, <main>, <section>, <footer> — and screenshots each one. If your page lacks landmarks, it scrolls with 30% overlap so nothing is missed.

Claude sees every section at full resolution. That's how it catches the 12px/16px spacing inconsistency your eyes skip.
```

**ATTACH:** Diagram or annotated screenshot showing sections being captured individually vs one full-page blob.

---

### Tweet 4 — PILLAR 2: Anti-slop criteria

```
"Make it look better" isn't a design criterion. Neither is "is it pretty?"

design-loop scores against 5 criteria, each with anti-slop flags:

Composition — rejects uniform grids
Typography — flags Inter/Roboto defaults
Color & Contrast — flags purple gradients
Visual Identity — flags generic card layouts
Polish — flags mixed spacing scales

Not "does it look nice" but "does it look DESIGNED?"
```

---

### Tweet 5 — PILLAR 3: Adaptive skill discovery

```
Here's the part that gets really interesting.

Install any design skill alongside design-loop and it automatically gets smarter.

frontend-design → design-loop absorbs its bold aesthetic principles
web-design-guidelines → layers WCAG compliance patterns
ui-skills → adds opinionated constraints

Zero config. Zero integration work. Each new skill sharpens what "score 5" means.

design-loop is the iteration engine. Other skills plug into it.
```

---

### Tweet 6 — DEMO + PROOF

```
The demo site was polished by design-loop itself.

2 runs. 18 total iterations. Started at 3.0/5, finished at 4.8/5.

Click through the iterations and watch the entire page transform:

design-loop.vercel.app

Dark cinematic theme. Section-level scoring. Real score progression. All autonomous.
```

**ATTACH:** 4-panel before/after grid showing iteration 0 (rough) → iteration 1 → iteration 3 → final (polished) of the demo site.

---

### Tweet 7 — INSTALL

```
One command:

claude plugin add https://github.com/tonymfer/design-loop

Then:

/design-loop http://localhost:3000

Works with Next.js, Nuxt, SvelteKit, Remix, Astro.
Detects your Tailwind tokens, shadcn components, existing design system.
Playwright auto-installed. Zero dependencies. MIT licensed.

github.com/tonymfer/design-loop
```

---

### Tweet 8 — ENGAGEMENT CTA

```
AI-generated UI is the new "made with Wix."

design-loop exists so your AI-built sites don't look AI-built.

What's the first page you'd point it at? Reply with a screenshot of your ugliest UI.

@claudeai @AnthropicAI
```

---

### X Posting Strategy

- **Pin Tweet 1** immediately after posting
- **Update X bio:** "Built design-loop (autonomous UI iteration for Claude Code)"
- **Respond to every reply** for first 2 hours — algorithm rewards engagement velocity
- **Day 2:** Quote-tweet Tweet 1 with terminal GIF of a live design-loop run
- **Day 3:** Reply to Tweet 1 with /export-loop output showing score progression
- **Day 4:** If traction, reply with "500 people tried this — here's what they built" or similar
- **Engagement farming:** Do NOT gate content behind replies. Give everything upfront. Let quality drive shares.
- **Cross-post** to Bluesky same day

---

## 3. Farcaster Casts (4 casts, copy-paste ready)

**Timing:** Post between 10 AM – 12 PM EST (midnight – 2 AM KST). Farcaster algorithm rewards early engagement heavily.

**Format:** Standalone casts. NOT a thread — Farcaster culture favors strong single casts.

### Cast 1 — beep.works Origin Hook (Day 2, 12-24 hrs after X thread)

```
beep.works light theme had that AI-generated look. Hardcoded hex
colors everywhere, inconsistent tokens, classic slop.

So I built a Claude Code plugin that takes screenshots of what
Claude builds, scores it against 5 design criteria, and fixes it
autonomously.

7 iterations. 14 files. Now I'm open-sourcing the tool.

design-loop.vercel.app — click through the iterations

claude plugin add https://github.com/tonymfer/design-loop
```

**ATTACH:** beep.works before/after if available, otherwise demo site video (square crop, 1080x1080).

**Why this works for FC:** The audience uses beep.works. Leading with it = instant relevance. "Built a tool to fix my own product" earns builder respect.

---

### Cast 2 — Composable Intelligence (Day 4-5)

```
The part of design-loop that surprises people:

It discovers other design skills you've installed and absorbs their
guidelines at runtime. Zero config.

Install frontend-design → design-loop gets bolder aesthetic principles
Install web-design-guidelines → it layers WCAG compliance

The plugin ecosystem as composable intelligence.

Works on any frontend. I used it on beep.works (Next.js + RetroUI),
now testing on plain React + Tailwind sites.
```

**No attachment needed** — this one is concept-driven.

**Why "composable" matters here:** Farcaster audience understands composable protocols (DeFi legos). "Composable intelligence" maps design-loop onto a mental model they already value.

---

### Cast 3 — Dual Narrative (Day 6+, conditional)

**Post only if Cast 1-2 got meaningful engagement (5+ recasts or 30+ likes).**

```
What I learned shipping design-loop while co-founding beep.works:

1. The product is a SKILL.md file. No runtime code. The AI reads
   instructions and executes them. The "code" is prose.
2. I used design-loop on beep.works itself — 7 iterations fixed the
   light theme across 14 files. The tool was born from the problem.
3. Claude Code plugins are underrated. The stop hook that makes
   design-loop loop is 180 lines of bash.

Building tools and shipping product simultaneously. The meta-skill
of 2026 is teaching AI how to do the thing, not doing the thing.
```

**Why this matters for career:** "The product is a markdown file" is genuinely surprising. This is the cast that gets founder DMs.

---

### Cast 4 — Before/After Proof (Day 7+, conditional)

**Post only with visual asset available + good Cast 1-3 engagement.**

```
7 iterations of design-loop on beep.works light theme.

Before: hardcoded hex colors, inconsistent shadows, mixed token
systems across 14 files.

After: unified design token architecture. Every pool color, battery
status, chat bubble, and profile card using the token system.

[before/after image]

The scoring log: 3.9 → 4.0 avg across all criteria. Not a massive
number change, but the consistency diff is night and day.
```

**ATTACH:** beep.works before/after comparison image (REQUIRED for this cast — don't post without it).

---

### Farcaster Notes

- Do NOT build a Farcaster Frame for launch — the demo site already serves the purpose
- Consider a "score your site" Frame as a follow-up if traction happens
- If beep.works users ask about the tool — GOOD. Reply with the install command. Power users who can test on their own apps.

---

## 4. LinkedIn Post (copy-paste ready)

**When:** Tuesday or Wednesday, 8:00 AM EST (10:00 PM KST). Day 5 of launch sequence.

**Critical:** Do NOT say "I'm looking for my next role." The entire post IS the pitch.

### The Post

```
AI can code your frontend. But the output always looks AI-generated.

I built a Claude Code plugin to fix that. Here's what I learned about
building developer tools in 2026.

---

The problem:

Every AI-built landing page has the same tells. Inter font. Purple
gradient. Uniform card grid. You know the look — you've approved PRs
that ship it.

I know it too. I co-founded beep.works — a protocol on Base with
~43K users. When we added a light theme, the AI-generated CSS had
the same tells. Functional, but obviously generated.

The issue isn't that AI can't write CSS. It can. The issue is that AI
can't SEE what it writes. It has no visual feedback loop.

What I built:

design-loop is a Claude Code plugin that:
1. Takes section-level screenshots (not a full-page blob — it detects
   semantic HTML landmarks and captures each section individually)
2. Scores against 5 design criteria with specific anti-AI-default
   detection
3. Fixes the top issues in code
4. Repeats autonomously until polished

One command: /design-loop http://localhost:3000

What's interesting technically:

- The entire product is a SKILL.md file. No runtime code. Claude reads
  the instructions and executes the workflow. The "product" is structured
  prose.
- A 180-line bash stop hook turns a single AI response into an
  autonomous iteration loop
- The plugin discovers other installed design skills at runtime and
  absorbs their guidelines — composable AI intelligence with zero
  configuration

What I learned:

1. The hardest part of AI developer tools isn't engineering — it's
   taste. Anyone can make Claude loop. Teaching it what "good design"
   means requires codifying aesthetic judgment into scoring criteria.

2. Screenshots are an underrated interface. Most AI coding tools operate
   purely on text. Giving Claude visual feedback unlocked a completely
   different capability.

3. The plugin ecosystem is the product. design-loop by itself is useful.
   design-loop + frontend-design + web-design-guidelines is
   transformative. Building for composability means your product gets
   better without you shipping anything.

Interactive demo: design-loop.vercel.app
GitHub: github.com/tonymfer/design-loop

---

What's the ugliest AI-generated UI you've shipped? I'm curious if the
tells are universal.
```

### If Traction Metrics Available by Day 5

Add this line before the demo link:

```
[X] thousand developers tried design-loop this week.
```

Replace [X] with actual number from X/Farcaster engagement.

### LinkedIn Profile Updates (do on Day 5)

- **Headline:** `Co-founder beep.works (43K users) | Building design-loop (AI dev tools)`
- **Featured section:** Add design-loop.vercel.app link
- Do NOT remove existing Beeper/Web3 experience — it's additive credibility

### LinkedIn Notes

- LinkedIn is NOT where developer tools go viral. It's where hiring managers and VCs form impressions.
- The post should feel like a builder sharing insights, not a product launch.
- Every reply in comments should be substantive — LinkedIn algorithm rewards long comment threads.
- If someone asks about your background, point to beep.works co-founding + hackathon wins + OpenClaw.

---

## 5. Visual Assets

### Priority Matrix

| Priority | Asset | Used in | Format | How to create | Status |
|----------|-------|---------|--------|---------------|--------|
| 1 (MUST) | **Demo site video** | X Tweet 1, FC Cast 1 | 30-40 sec, 1080x1080 MP4 | Screen record design-loop.vercel.app: Before → Iter 1 → 2 → 3 → Final. Linger on score cards animating. QuickTime or OBS. | [ ] |
| 2 (HIGH) | **Before/After 4-panel** | X Tweet 6, LinkedIn | 1200x1200 PNG | Screenshot demo site at state 0, 1, 3, 4. Arrange 2x2 grid with labels in Figma. | [ ] |
| 2.5 (OPT) | **beep.works before/after** | FC Cast 1 & 4 | 1200x600 PNG | Git checkout pre-design-loop commit in beep.works, screenshot light theme, compare to current. | [ ] OPTIONAL |
| 3 (NICE) | **Section screenshot diagram** | X Tweet 3 | Static PNG | Annotated screenshot showing individual section captures vs full-page blob. | [ ] |
| 4 (OPT) | **Terminal recording** | X Day 2 quote-tweet | 15 sec GIF | Screen record `/design-loop` running in terminal, showing iteration scores. | [ ] |
| 5 (OPT) | **/export-loop screenshot** | X Day 3 reply | PNG | Run design-loop on any site, `/export-loop`, screenshot the markdown output. | [ ] |

**Only Asset 1 is required before Day 1.** Assets 2-5 can be created between posting days. Do NOT delay launch for optional assets.

---

## 6. Execution Timeline

### Pre-Launch (48 hrs before Day 1)

- [ ] Record demo site video — 30-40 sec of design-loop.vercel.app iteration walkthrough
- [ ] Pre-engage on X — reply thoughtfully to 5-10 tweets from Claude Code builders:
  - Geoffrey Huntley (@geoffreyhuntley) — ralph-loop creator
  - Evan Bacon (@Baconbrix) — Expo skills
  - Other Claude Code plugin builders
  - Don't pitch. Be helpful. Get on their radar.
- [ ] Submit plugin resubmission — use form data from `2026-02-21-resubmission-form.md`
- [ ] Monitor @AnthropicAI — if major announcement drops, delay 2-3 days
- [ ] **[OPTIONAL, 15 min] Capture beep.works before/after** — git checkout pre-design-loop commit in beep.works, screenshot light theme, compare to current. Skip if time-constrained. Only needed for FC Cast 1 & 4.

### Day 1: X Thread (Tue/Wed, 9:30 AM EST / 11:30 PM KST)

- [ ] Post 8-tweet thread (Section 2 above)
- [ ] Attach demo site video to Tweet 1
- [ ] Pin Tweet 1 immediately
- [ ] Update X bio: "Built design-loop (autonomous UI iteration for Claude Code)"
- [ ] Respond to every reply for first 2 hours

### Day 2: Farcaster Cast 1 + X Follow-up

**Farcaster (10 AM – 12 PM EST / midnight – 2 AM KST):**
- [ ] Post Cast 1 (beep.works origin version) from Section 3 above
- [ ] Attach beep.works before/after if available, otherwise demo site video (square crop)

**X Follow-up (2 PM EST):**
- [ ] Quote-tweet Tweet 1 with terminal GIF (Asset 4)
- [ ] If terminal GIF not ready, use a compelling before/after screenshot instead

### Day 3: X Follow-up

- [ ] Reply to Tweet 1 with /export-loop output showing score progression

### Day 4-5: Farcaster Cast 2

- [ ] Post Cast 2 — composable intelligence + beep.works tech stack anchor
- [ ] No attachment needed — concept-driven

### Day 5: LinkedIn Post (Tue, 8:00 AM EST / 10:00 PM KST)

- [ ] Post long-form from Section 4 above
- [ ] If traction metrics available, add "[X] developers tried design-loop this week" line
- [ ] Update LinkedIn headline: `Co-founder beep.works (43K users) | Building design-loop (AI dev tools)`
- [ ] Add design-loop.vercel.app to Featured section
- [ ] Do NOT remove existing Beeper/Web3 experience

### Day 6+: Farcaster Cast 3 (conditional)

- [ ] Only post if Cast 1-2 got meaningful engagement (5+ recasts or 30+ likes)
- [ ] Post Cast 3 — dual narrative (co-founding beep.works + shipping design-loop)

### Day 7+: Farcaster Cast 4 (conditional)

- [ ] Only post if beep.works before/after image is available AND Cast 1-3 had good engagement
- [ ] Post Cast 4 — before/after proof with visual asset

### Ongoing (Day 7+)

- [ ] Respond to all replies across platforms
- [ ] Share user screenshots if any emerge
- [ ] If someone notable uses design-loop, amplify their result
- [ ] "Drop a URL and I'll run design-loop on it" as engagement tactic
- [ ] Track install count via GitHub stars / plugin marketplace

### Profile Updates Summary

| Platform | Update | When |
|----------|--------|------|
| X | Bio: "Built design-loop (autonomous UI iteration for Claude Code)" | Day 1 |
| X | Pin Tweet 1 | Day 1 |
| LinkedIn | Headline: `Co-founder beep.works (43K users) | Building design-loop (AI dev tools)` | Day 5 |
| LinkedIn | Featured: design-loop.vercel.app | Day 5 |
| GitHub | Profile README mentions design-loop | Day 1 |

---

## 7. Risk Mitigations

| Risk | Trigger | Response |
|------|---------|----------|
| X thread flops (<50 likes in 24h) | Day 2 check | Don't delete. Post standalone repackaged tweet 3 days later. Farcaster (24K) is the safety net. |
| "It's just a prompt" dismissal | Any platform | Lean in: "The product is a markdown file. In 2026, the best AI tools are instructions, not code. The hard part isn't engineering — it's codifying taste." |
| Low install conversion | Week 1 | Reply to comments: "Drop a URL and I'll run design-loop on it" to create proof content. |
| Anthropic announcement collision | Pre-launch check | Delay 2-3 days. Content isn't time-sensitive. |
| "Is this just crypto promo?" | X (unlikely given minimal mention) | "beep.works was the problem that created design-loop. The tool works on any frontend. The connection is just the origin story." |
| beep.works users ask about the tool | Farcaster | GOOD — reply with install command. Power users who can test on their own apps. |

---

## 8. Guardrails

### What NOT to Mention (any platform)

1. **Tokens / $BEEP** — token narrative is completely separate from design-loop
2. **Airdrops / rewards** — this is a dev tool launch, not token promo
3. **Tokenomics** — not relevant
4. **Battery system** — beep.works product detail, not relevant here
5. **Beeperbot** — beep.works product detail, not relevant here

### Language Rules

| DO | DON'T |
|----|-------|
| "co-founded beep.works" | "PM'ed beep.works" |
| "a protocol on Base with ~43K users" | "my crypto app" |
| "I co-founded" | "I built" (when referring to beep.works — Tony is 1 of 2 founders) |

### Platform-Specific Rules

| Rule | Why |
|------|-----|
| Do NOT tag @beeponbase on X | Dev tool audience doesn't need it — crypto context is a distraction |
| Do NOT link beep.works from X thread | "43K users" number is enough context for X |
| Do NOT delay launch for beep.works visual assets | Demo site video is the primary asset — beep.works before/after is optional |
| Do NOT build a Farcaster Frame for launch | Demo site already serves the interactive purpose |

---

## 9. Success Metrics

| Metric | Base case (likely) | Upside (achievable) | Viral (unlikely) |
|--------|-------------------|---------------------|-------------------|
| Installs | 5-15K | 30-50K | 100K+ |
| X thread likes | 50-200 | 500+ | 2000+ |
| Farcaster Cast 1 likes | 100-300 | 500+ | 1000+ |
| LinkedIn post impressions | 5-15K | 30K+ | 100K+ |
| Inbound DMs (career) | 2-5 | 10+ | 20+ |

**Remember:** You don't need 100K installs. You need **500 right people to see this.** With 24K Farcaster + 2K X, that's very achievable.

### Reputation Conversion Funnel

```
Plugin works well (utility)
  → Installs + GitHub stars (metric)
    → "X people use this" in social posts (social proof)
      → Developer mindshare (brand)
        → Inbound from founders/VCs/hiring teams (opportunity)
```

### The 4 Layers of Proof-of-Work

1. **Technical proof:** Section-level screenshot architecture → systems thinking
2. **Product proof:** "SKILL.md, no runtime code" → understands AI products in 2026
3. **Ecosystem proof:** Adaptive skill discovery → platform thinking (founding engineer signal)
4. **Adoption proof:** Install count + engagement → market validates the insight

---

## 10. Verification Checklist

### Content Completeness

- [ ] All 8 X tweets present and copy-paste ready
- [ ] All 4 Farcaster casts present and copy-paste ready
- [ ] LinkedIn post present and copy-paste ready
- [ ] Visual asset instructions for each attachment

### beep.works Integration

- [ ] X Tweet 2: "a Farcaster app with ~43K users" — no tag, no crypto details
- [ ] X Tweets 1, 3-8: completely unchanged (no beep.works references)
- [ ] FC Cast 1: leads with beep.works hook
- [ ] FC Cast 2: has beep.works tech stack anchor line at end
- [ ] FC Cast 3: says "co-founding beep.works" (not "PM'ing")
- [ ] FC Cast 4: exists as conditional before/after proof content
- [ ] LinkedIn: one paragraph grounding problem in beep.works co-founder experience
- [ ] LinkedIn headline: includes "Co-founder beep.works"

### Guardrails

- [ ] ZERO mentions of token / airdrop / rewards / battery across entire document
- [ ] All beep.works references use "co-founded" language (not "PM")
- [ ] No @beeponbase tag in X content
- [ ] No beep.works link in X content

### Execution

- [ ] Day-by-day timeline with checkboxes
- [ ] Profile updates listed with platform + timing
- [ ] Risk mitigations include crypto-confusion response
- [ ] Success metrics with base/upside/viral tiers
