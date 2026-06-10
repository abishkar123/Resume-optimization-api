# Shared Methods: Capacity Estimation and Priority Scoring

All planning agents use these models so numbers mean the same thing everywhere.

## 1. Capacity model

Capacity is computed per day, then summed for the week.

```
gross_hours        = workday end − workday start            (ask once, store; default 8h)
meeting_hours      = sum of fixed commitments that day
overhead_hours     = 1.0                                    (email, chat, context switching — fixed tax)
breaks_hours       = 0.5                                    (minimum; do not plan through lunch)
available_hours    = gross_hours − meeting_hours − overhead_hours − breaks_hours
focus_capacity     = available_hours × 0.8                  (focus factor: plans never assume 100%)
```

Rules:

- `focus_capacity` is what plans may allocate. Negative or <1h → that day is
  **meeting-saturated**: schedule no deep work, only ≤30-min shallow tasks.
- Deep work cap: at most 4h of deep work per day regardless of capacity — quality
  collapses beyond that.
- Weekly focus capacity = sum of daily values. A typical 8h day with 3h of meetings
  yields (8 − 3 − 1 − 0.5) × 0.8 = **2.8h** of plannable focus — show this math to the
  user; it is the single most common realism correction.

## 2. Overload flags

| Condition | Flag | Required response |
|---|---|---|
| Day's allocated work > 85% of `focus_capacity` | `OVERLOADED day` | Present cut options: move / shrink / delegate / drop |
| Week's priorities estimated > 80% of weekly focus capacity | `OVERLOADED week` | Reduce to ≤3 priorities or shrink scope |
| >3 days OVERLOADED in one week | `STRUCTURAL` | Recommend recurring-commitment audit in next weekly review |

A flag must never be emitted without its resolution options. "You're overloaded" alone
is banned output.

## 3. Priority scoring (IUE)

Score each candidate task or project:

| Factor | 1 | 3 | 5 |
|---|---|---|---|
| **Impact** | Nice to have | Helps a goal or stakeholder | Directly advances a quarterly objective / hard deadline |
| **Urgency** | No date pressure | Matters this month | Due or blocking others this week |
| **Effort (inverted)** | >2 days of focus | 0.5–2 days | ≤4 hours |

```
priority_score = (2 × Impact) + Urgency + Effort   →  range 4–20
```

- ≥15: candidate for weekly priority (max 3 chosen).
- 10–14: scheduled work — gets calendar time but not priority status.
- <10: backlog. Revisit at weekly review; three weeks in backlog without movement →
  propose dropping it explicitly.

Tie-breaks: deadline proximity, then dependency (unblocks others first).

## 4. Estimation discipline

- Estimates are made in 0.5h units; anything estimated >4h must be split before it
  can be scheduled.
- Track the user's **estimation ratio** (actual ÷ estimated) in weekly reviews. After
  3 weeks of data, apply it as a multiplier to new estimates and say so:
  "Your last 3 weeks ran 1.4× estimates; I've sized this 5h task at 7h."

## 5. Success criteria standard

Every priority — weekly, daily, or roadmap milestone — carries a "done means"
statement that a third party could verify as true/false. Test: could someone else
check it without asking you how you feel about it?

- ❌ "Make progress on the migration"
- ✅ "Migration PR opened with all 14 endpoints converted and CI green"
