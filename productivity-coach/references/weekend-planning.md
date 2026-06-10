# Workflow: Weekend Planning

Owner agent: `weekend-planner`. Output template: `templates/weekend-plan.md`.
Target session length: 10 minutes. Principle: recovery is the deliverable; everything
else fits around it.

## Step 0 — Energy check (1 min)

Ask: "Energy level 1–5 after this week?" This gates the whole plan:

| Energy | Plan shape |
|---|---|
| 1–2 | Recovery-dominant: no personal projects, errands cut to essentials only, learning block dropped or ≤30 min passive (podcast/video) |
| 3 | Standard allocation below |
| 4–5 | Full allocation; personal project block may extend to 3h if the user wants |

## Step 1 — Fixed commitments (2 min)

- **Connector path**: read Sat/Sun calendar (titles + times only).
- **Manual fallback**: "What's already locked in this weekend — plans with people,
  bookings, family obligations?"
- Hard rule: maximum 3 scheduled commitments per weekend day. Over that, the plan
  flags the day and asks what gives.

## Step 2 — Allocate the six blocks (5 min)

Allocate in this strict order; later blocks only get what remains.

1. **Recovery and rest** — ≥40% of waking weekend hours, marked `protected`.
   Includes sleep-in, exercise, and genuinely unstructured time. Unstructured time is
   scheduled as a block with no contents — that is the point.
2. **Errands and admin** — batch into one block per day max; target a single 2-hour
   block on one day. Itemize with checkboxes; anything that doesn't fit moves to next
   weekend's list, stated explicitly.
3. **Learning block** — one 60–90 min block. If a skill roadmap exists
   (`skills/` directory), the block's content comes from the roadmap's current week;
   otherwise ask what the user wants to learn or skip the block.
4. **Relationship / social time** — named and specific: who, when, what. "Dinner with
   Maya, Sat 7pm." If the user has had no social block for 2+ weekends (check prior
   weekend plans), raise it once, neutrally.
5. **Personal projects** — only if 1–4 fit. Cap 2h (3h at energy 4–5). If the user
   wants more, show exactly which rest block it consumes and let them choose.
6. **Monday preparation** — fixed 20-minute Sunday block, late afternoon/evening:
   - Review Monday's calendar (connector or memory)
   - Write Monday's top-3 candidate list
   - Physical staging: bag, clothes, lunch, charger
   - One worry-dump line: anything nagging gets written down to stop looping

## Step 3 — Sanity checks (2 min)

- [ ] Recovery ≥40% and marked protected
- [ ] ≤3 commitments per day
- [ ] At least one half-day with nothing scheduled at all
- [ ] Monday-prep block present with its 4 sub-items
- [ ] At energy ≤2: no personal projects, errands ≤1h essential-only

Emit the filled template. If the user pushes to overfill the weekend, show the
trade-off in hours ("the second project block replaces your only unscheduled
half-day") and let them decide — once.
