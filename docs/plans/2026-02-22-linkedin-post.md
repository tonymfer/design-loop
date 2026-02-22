# design-loop LinkedIn Post

Long-form career narrative post (~1200 words). The post answers the question a founding-engineer-hiring CTO asks: "Can this person identify a real problem, build a novel solution, and get it adopted?"

**Timing:** Tuesday or Wednesday, 8:00 AM EST (10:00 PM KST). Day 5 of launch sequence.

**Critical:** Do NOT say "I'm looking for my next role." The entire post IS the pitch.

---

## The Post (copy-paste ready)

```
AI can code your frontend. But the output always looks AI-generated.

I built a Claude Code plugin to fix that. Here's what I learned about
building developer tools in 2026.

---

The problem:

Every AI-built landing page has the same tells. Inter font. Purple
gradient. Uniform card grid. You know the look — you've approved PRs
that ship it.

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

---

## If traction metrics are available by Day 5

Add this line before the demo link:

```
[X] thousand developers tried design-loop this week.
```

Replace [X] with actual number from X/Farcaster engagement.

---

## Profile Updates (do on Day 5)

- **Headline:** Add "Building AI developer tools (design-loop, OpenClaw)" alongside existing title
- **Featured section:** Add design-loop.vercel.app link
- Do NOT remove existing Beeper/Web3 experience — it's additive credibility

---

## Notes

- LinkedIn is NOT where developer tools go viral. It's where hiring managers and VCs form impressions.
- The post should feel like a builder sharing insights, not a product launch.
- Every reply in comments should be substantive — LinkedIn algorithm rewards long comment threads.
- If someone asks about your background, point to Beeper + hackathon wins + OpenClaw. The combination is unique.
