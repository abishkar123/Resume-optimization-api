# Workflow: Personal Review System

Owner agent: `review-coach` (daily review is owned by `daily-execution-coach`).
Templates: `weekly-review.md`, `monthly-review.md`, `quarterly-reset.md`.
Reviews live in the user's `reviews/` directory, named `YYYY-Www.md`, `YYYY-MM.md`,
`YYYY-Qn.md`.

Principle: a review exists to change the next plan. Every review ends in decisions
(keep / change / stop / start), each with an owner action and a landing place.

## Daily review (5 min — see daily-execution.md Ritual 3)

Scores the day, captures one carry-over and one lesson, pre-stages tomorrow. Feeds
the weekly review; nothing else to do here.

## Weekly review (20 min, Friday afternoon or Sunday)

1. **Gather** (3 min): this week's daily plans + the weekly plan. Missing artifacts →
   reconstruct via shipped/slipped/surprised questions; mark coverage partial.
2. **Score** (5 min) — show the table before any narrative:
   - Weekly priorities shipped: n/3, against their "done means" statements
   - Plan completion: estimated hours delivered ÷ planned
   - Deep-work blocks held: n/planned
   - Estimation ratio this week (actual ÷ estimated) → feeds the multiplier in
     `capacity-and-scoring.md` §4
   - Escalated daily lessons (any lesson logged 3+ days)
3. **Diagnose** (5 min): for each miss, attribute to exactly one primary cause —
   estimate, interruption, priority change, energy, or blocked-on-others. Causes must
   point at artifacts ("Tuesday's plan shows 3 unplanned meetings"), never mood.
4. **Decide** (5 min): exactly 3 keep/change decisions feeding next week's plan, plus
   carry-over list with fresh IUE scores.
5. **Handoff** (2 min): save the review; if the user is planning next week now, chain
   directly into `weekly-planner` Step 2 with this review as input.

## Monthly review (45 min, last weekend of the month)

1. **Gather**: the month's weekly reviews, evidence log, skill check-ins.
2. **Scorecard**: priorities shipped n/m; deep-work consistency trend across weeks;
   skill sessions done vs. planned; evidence entries added; estimation-ratio trend.
3. **Trends** (≥3 data points or it's noise — label it as such): improving / flat /
   degrading per metric, with one line of evidence each.
4. **Focus check**: did the month's actual hours go where the stated goals were?
   Show the mismatch table when they didn't — this is the most valuable output.
5. **Outputs**: next month's focus theme (one sentence), 2–3 monthly objectives with
   "done means", **one stop-doing item** (mandatory), evidence-log hygiene done
   (chain to `career-growth-coach`).

## Quarterly reset (90 min, split across 2 sittings if needed)

1. **Gather**: 3 monthly reviews, career goals file, skill roadmaps, evidence log.
2. **Goal audit** — every active goal gets exactly one verdict:
   - **Renew** (still right, evidenced progress)
   - **Resize** (right direction, wrong scope — rewrite it)
   - **Retire** (done or no longer relevant — close it explicitly, note why)
   - Silence is not an option; an unaudited goal is a stale goal.
3. **Identity questions** (the quarterly-only layer): Which work gave energy vs.
   drained? What would you not start again, knowing what you know? What did the
   quarter prove about the career goal's realism?
4. **Commitment audit**: list recurring commitments (meetings, roles, side
   obligations); each is renewed or killed. Count `STRUCTURAL` overload flags from
   weekly plans — 3+ means cuts are mandatory, not optional.
5. **Outputs**: refreshed goals file; next quarter's **3 objectives** with "done
   means" and a monthly milestone each; at least one killed commitment; updated skill
   roadmap decision (continue / pivot / complete); readiness scorecard refresh
   (chain to `career-growth-coach`).

## Goal refinement standard (used at monthly + quarterly)

A goal survives review only if it passes all four:
1. **Relevant** — still serves the career/life direction the user states today
2. **Right-sized** — achievable within the horizon at demonstrated (not hoped)
   capacity, using the estimation ratio
3. **Evidenced** — measurable movement since last review
4. **Owned** — the user, asked directly, still wants it (not inherited "should")

Fails one → resize or retire. The system never carries zombie goals forward silently.

## Anti-patterns (refuse these politely)

- Review-as-journaling: narrative with no decisions → push for the decision table.
- Metric theater: scoring things no decision will ever read → cut the metric.
- All-add resets: a quarterly reset that only adds objectives is rejected until
  something is stopped.
