# design-loop Multi-Platform Launch Timeline

Master execution guide. All content lives in sibling docs — this is the sequencing and checklist.

---

## Content Documents

| Platform | File | Status |
|----------|------|--------|
| X/Twitter (8-tweet thread) | `2026-02-21-x-thread.md` | Ready |
| Plugin resubmission form | `2026-02-21-resubmission-form.md` | Ready |
| Farcaster (3 casts) | `2026-02-22-farcaster-casts.md` | Ready |
| LinkedIn (long-form post) | `2026-02-22-linkedin-post.md` | Ready |

---

## Visual Assets

| # | Asset | For | Format | How to create | Status |
|---|-------|-----|--------|---------------|--------|
| 1 | **Demo site video** | X Tweet 1, FC Cast 1 | 30-40 sec, 1080x1080 MP4 | Screen record design-loop.vercel.app: Before → Iter 1 → 2 → 3 → Final. Linger on score cards animating. QuickTime or OBS. | [ ] |
| 2 | **Before/After 4-panel** | X Tweet 6, LinkedIn | 1200x1200 PNG | Screenshot demo site at state 0, 1, 3, 4. Arrange 2x2 grid with labels in Figma. | [ ] |
| 3 | **Terminal recording** | X Day 2 quote-tweet | 15 sec GIF | Screen record `/design-loop` running in terminal, showing iteration scores. | [ ] |
| 4 | **/export-loop screenshot** | X Day 3 reply | PNG | Run design-loop on any site, `/export-loop`, screenshot the markdown output. | [ ] |

**Only Asset 1 is required before Day 1.** Assets 2-4 can be created between posting days.

---

## Pre-Launch (48 hrs before Day 1)

- [ ] **Record demo site video** — 30-40 sec of design-loop.vercel.app iteration walkthrough
- [ ] **Pre-engage on X** — Reply thoughtfully to 5-10 tweets from Claude Code builders:
  - Geoffrey Huntley (@geoffreyhuntley) — ralph-loop creator
  - Evan Bacon (@Baconbrix) — Expo skills
  - Other Claude Code plugin builders
  - Don't pitch. Be helpful. Get on their radar.
- [ ] **Submit plugin resubmission** — Use form data from `2026-02-21-resubmission-form.md`
- [ ] **Monitor @AnthropicAI** — If major announcement drops, delay 2-3 days

---

## Day 1: X Thread (Tue/Wed, 9:30 AM EST / 11:30 PM KST)

- [ ] Post 8-tweet thread from `2026-02-21-x-thread.md`
- [ ] Attach demo site video to Tweet 1
- [ ] Pin Tweet 1 immediately
- [ ] Update X bio: include "Built design-loop (autonomous UI iteration for Claude Code)"
- [ ] Respond to every reply for first 2 hours

**No hashtags.** Developer X is network-driven.

---

## Day 2: Farcaster Cast 1 + X Follow-up

### Farcaster (10 AM – 12 PM EST / midnight – 2 AM KST)
- [ ] Post Cast 1 from `2026-02-22-farcaster-casts.md`
- [ ] Attach demo site video (square crop)

### X Follow-up (2 PM EST)
- [ ] Quote-tweet Tweet 1 with terminal GIF (Asset 3)
- [ ] If terminal GIF not ready, use a compelling before/after screenshot instead

---

## Day 4-5: Farcaster Cast 2

- [ ] Post Cast 2 — "composable intelligence" angle
- [ ] No attachment needed — this one is concept-driven

---

## Day 5: LinkedIn Post (Tue, 8:00 AM EST / 10:00 PM KST)

- [ ] Post long-form from `2026-02-22-linkedin-post.md`
- [ ] If traction metrics available, add "[X] developers tried design-loop this week" line
- [ ] Update LinkedIn headline: add "Building AI developer tools (design-loop, OpenClaw)"
- [ ] Add design-loop.vercel.app to Featured section
- [ ] Do NOT remove existing Beeper/Web3 experience

---

## Day 6+: Farcaster Cast 3 (conditional)

- [ ] Only post if Cast 1-2 got meaningful engagement (10+ recasts or 50+ likes)
- [ ] Post Cast 3 — "builder lessons" angle
- [ ] "The product is a markdown file" is the hook — this gets founder DMs

---

## Ongoing (Day 7+)

- [ ] Respond to all replies across platforms
- [ ] Share user screenshots if any emerge
- [ ] If someone notable uses design-loop, amplify their result
- [ ] "Drop a URL and I'll run design-loop on it" as engagement tactic
- [ ] Track install count via GitHub stars / plugin marketplace

---

## Profile Updates Summary

| Platform | Update | When |
|----------|--------|------|
| X | Bio: "Built design-loop (autonomous UI iteration for Claude Code)" | Day 1 |
| X | Pin Tweet 1 | Day 1 |
| LinkedIn | Headline: add design-loop + OpenClaw | Day 5 |
| LinkedIn | Featured: design-loop.vercel.app | Day 5 |
| GitHub | Profile README mentions design-loop | Day 1 |

---

## Risk Mitigations

| Risk | Trigger | Response |
|------|---------|----------|
| X thread flops (<50 likes in 24h) | Day 2 check | Don't delete. Post standalone repackaged tweet 3 days later. Farcaster (24K) is the safety net. |
| "It's just a prompt" dismissal | Any platform | Lean in: "The product is a markdown file. In 2026, the best AI tools are instructions, not code. The hard part isn't engineering — it's codifying taste." |
| Low install conversion | Week 1 | Reply to comments: "Drop a URL and I'll run design-loop on it" to create proof content. |
| Anthropic announcement collision | Pre-launch check | Delay 2-3 days. Content isn't time-sensitive. |

---

## Success Metrics

| Metric | Base case (likely) | Upside (achievable) | Viral (unlikely) |
|--------|-------------------|---------------------|-------------------|
| Installs | 5-15K | 30-50K | 100K+ |
| X thread likes | 50-200 | 500+ | 2000+ |
| Farcaster Cast 1 likes | 100-300 | 500+ | 1000+ |
| LinkedIn post impressions | 5-15K | 30K+ | 100K+ |
| Inbound DMs (career) | 2-5 | 10+ | 20+ |

**Remember:** You don't need 100K installs. You need **500 right people to see this.** With 24K Farcaster + 2K X, that's very achievable.

---

## Reputation Conversion Funnel

```
Plugin works well (utility)
  → Installs + GitHub stars (metric)
    → "X people use this" in social posts (social proof)
      → Developer mindshare (brand)
        → Inbound from founders/VCs/hiring teams (opportunity)
```

### The 4 layers of proof-of-work

1. **Technical proof:** Section-level screenshot architecture → systems thinking
2. **Product proof:** "SKILL.md, no runtime code" → understands AI products in 2026
3. **Ecosystem proof:** Adaptive skill discovery → platform thinking (founding engineer signal)
4. **Adoption proof:** Install count + engagement → market validates the insight
