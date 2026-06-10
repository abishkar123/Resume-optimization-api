# Workflow: Professional Growth

Owner agent: `career-growth-coach`. Primary artifact:
`career/evidence-log.md` (template: `templates/evidence-log.md`). Supporting
artifacts: `career/goals.md`, `career/readiness-scorecard.md`,
`career/resume-bullets.md`.

Principle: careers advance on **evidence captured while fresh**, not on year-end
recollection. The evidence log is the system's backbone; everything else reads from it.

## 1. Career goals

Turn ambition into a testable goal:

```
Target role/level: ____            Horizon: ____ (e.g. 18 months)
Why (one sentence, user's words): ____
Gap areas (3–5), each with: current state → required state → closing action
```

Gap areas come from the ladder/expectations doc if the user can supply one
(connector path: read the single named document; manual fallback: user pastes the
relevant section, or use the generic dimensions below). Refresh at quarterly reset.

## 2. Promotion-readiness scorecard

Score 1–5 per dimension. Use the user's actual ladder when available; otherwise:

| Dimension | What 5 looks like (generic senior bar) |
|---|---|
| Scope | Owns problems spanning multiple teams/quarters |
| Autonomy | Identifies and drives work without being asked |
| Impact | Outcomes measurably moved team/company metrics |
| Influence | Changes others' decisions: mentoring, design direction, hiring |
| Craft | Work is the team's quality reference point |

Rules:
- Every score ≥3 must cite a specific evidence-log entry by date. No entry → the
  score caps at 2 ("claimed, not evidenced").
- Output: scorecard table, the 2 weakest dimensions, and **one evidence-generating
  action per gap** with a target date (e.g. "Influence at 2 → volunteer to run the
  Q3 design review series; first session by July 15").
- Readiness call: ready (all ≥4), 1–2 quarters out (one dimension <4), building
  (≥two <4). State it plainly.

## 3. Project impact tracking (SARQ)

Capture within a week of shipping — quantification decays fastest:

```
Situation:        context + why it mattered (1–2 lines)
Action:           what the user specifically did (not the team)
Result:           what changed
Quantification:   number + unit + baseline ("p95 420ms → 180ms", "saved ~6 h/wk")
```

No number available → record the best proxy and tag `[proxy]` ("~30 engineers use
it weekly"). At review time, push to upgrade proxies to measurements.

Connector path: GitHub merged-PR titles for the period can seed the "what shipped"
list (titles and dates only). Manual fallback: "What shipped in the last month that
you touched?"

## 4. Evidence log maintenance

- Append-only; never rewrite history (corrections are new entries referencing old).
- Entry fields: date, project, SARQ, skills demonstrated, witnesses/stakeholders
  (people who can corroborate), ladder dimension(s) supported.
- Monthly hygiene (run with `review-coach`'s monthly review): add missing entries,
  upgrade `[proxy]` tags, check dimension coverage — a dimension with no entries in
  2 months is a flag for the readiness scorecard.

## 5. Communication coaching

Rewrite, always showing before/after:

- **Status updates:** outcome first, then risk, then ask. Cut process narration.
- **Promo packet / self-assessment:** one claim per paragraph; every claim cites an
  evidence entry; reviewer-relevant ordering (lead with the target level's weakest
  assumed dimension).
- **Difficult messages (pushback, scope cuts):** state the decision, the reason, the
  cost of the alternative — three sentences before any softening.

## 6. Resume / LinkedIn achievement capture

Convert evidence entries on demand or quarterly:

```
[Action verb] [what], [result clause with quantification]
"Led migration of 14 payment endpoints to the new gateway, cutting checkout p95
latency 57% and eliminating a class of duplicate-charge incidents."
```

- Maintain `career/resume-bullets.md` grouped by role/project.
- **Privacy gate:** before writing any bullet containing internal numbers, ask
  whether the figure is safe to state publicly; offer a de-identified variant
  ("cut latency by more than half").

## Sensitivity rules (stricter tier — see also connectors-and-privacy.md)

- Compensation, ratings, manager feedback, interpersonal conflict: discussed freely
  in conversation, written to artifacts only on explicit user request.
- Any export or connector write of career artifacts requires per-action confirmation
  naming the destination.
