# Workflow: Skill Building

Owner agent: `skill-building-coach`. Output template:
`templates/skill-roadmap-30-60-90.md`. Artifacts live in the user's `skills/`
directory, one file per skill.

## Step 1 — Skill selection (skip if the user already chose)

Score up to 5 candidates:

| Factor | 1 | 3 | 5 |
|---|---|---|---|
| Career leverage | Rarely relevant to target role | Useful in current role | Named gap for next role / quarterly objective |
| Interest | Would need discipline to start | Curious | Would do it unprompted |
| Time-to-usable | >6 months to apply at work | 2–6 months | Usable within 30 days |

Recommend the highest total; on ties prefer career leverage. **One active skill at a
time** — starting a second requires pausing or finishing the first, recorded in the
roadmap file.

## Step 2 — Baseline assessment

Place the user on the 5-level scale using 3 concrete probes, not self-rating:

| Level | Name | Probe that confirms it |
|---|---|---|
| 1 | Aware | Can describe what the skill is and why it matters |
| 2 | Assisted | Can complete a basic task with docs/examples open |
| 3 | Independent | Can complete a typical work task without references |
| 4 | Fluent | Can handle novel/edge cases; others ask them for help |
| 5 | Can teach | Can explain trade-offs and design exercises for others |

Probes are skill-specific doing-questions: "Could you implement X right now without
looking anything up?" Record level + the probe answers — day-30/60/90 re-assessments
reuse the same probes.

## Step 3 — Budget check

Get realistic weekly hours (cross-check the weekly plan's focus capacity if on file).

| Budget | Honest framing |
|---|---|
| <2 h/wk | 90 days moves ~1 level at most; shrink the target and say so |
| 2–4 h/wk | Standard roadmap; 1 level in ~60–90 days |
| 5–8 h/wk | Aggressive roadmap viable; watch for burnout at week 4 |
| >8 h/wk | Only if work-sanctioned; verify against actual calendar |

## Step 4 — Build the 30/60/90 roadmap

Each phase: a theme, 2–3 milestones, named resources, and a concrete weekly practice
schedule (days × duration × activity).

- Typical arc: **Days 1–30** fundamentals + first real artifact → **31–60** applied
  depth + external feedback → **61–90** integration into real work + re-assessment.
- Milestones are demonstrable artifacts or performances with a "done means" line
  ("implement an LRU cache from memory in <30 min", "design doc reviewed by 2
  seniors"). Exposure statements ("understand caching") are rejected.
- Practice mix per week: **~60% doing** (building, solving, producing), **~25%
  studying** (reading, courses), **~15% feedback** (review, critique, assessment).
  A plan that is mostly studying is a consumption plan, not a practice plan — fix it.
- Reserve the blocks: tell the user which calendar slots to protect, and if a weekly
  plan exists, add the practice blocks to its scheduled work.

## Step 5 — Feedback loops (mandatory)

Every phase names ≥1 external feedback source; self-assessment alone doesn't count:

- Person: mentor, senior colleague, coach (highest value; ask who could fill this)
- Community: code review, forum critique, study group
- Automated: test suites, kata platforms, graded exercises
- Market: publishing work, talks, interviews, shipping to users

Connector note: web search (if available) may locate resources/communities; GitHub
(if available) can track practice-project commits. Manual fallback: recommend from
own knowledge with a currency caveat, and have the user self-report sessions.

## Step 6 — Progress tracking

- **Weekly check-in (10 min):** sessions done vs. planned, milestone status
  (on/at-risk/done), one friction note. Append to the roadmap file.
- **Day 30/60/90 re-assessment:** rerun the baseline probes, update the level, mark
  milestones, then adjust the next phase — plans are expected to change.
- **Adaptation rules:**
  - <50% planned sessions two weeks running → shrink the plan (smaller blocks or
    longer timeline). Never prescribe "try harder".
  - Milestone done early → pull the next phase forward; don't pad.
  - Interest score honestly drops → surface the option to stop. A consciously
    abandoned skill beats a zombie roadmap.
