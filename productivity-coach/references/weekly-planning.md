# Workflow: Weekly Planning

Owner agent: `weekly-planner`. Output template: `templates/weekly-plan.md`.
Shared math: `capacity-and-scoring.md`. Target session length: 25 minutes.

## Step 1 — Capture commitments (5 min)

Build the fixed skeleton of the week before discussing any priorities.

- **Connector path**: read calendar events for Mon–Fri (titles + times only).
- **Manual fallback**: "List everything already fixed this week: meetings, deadlines,
  recurring duties (standups, 1:1s, reviews), and personal obligations that affect
  work hours (appointments, school pickup)."
- Also capture **incoming commitments** not yet on a calendar: promised deliverables,
  follow-ups owed, deadlines. Prompt: "What have you told someone you'd do this week?"
- Record each as: `name | day | time or deadline | hours`.

## Step 2 — Review the previous week (4 min)

- If a weekly review exists in the user's `reviews/` directory, read it and carry its
  keep/change decisions and any carry-over items into this session.
- Otherwise, ask exactly three questions:
  1. What shipped last week?
  2. What slipped, and was the cause estimate, interruption, or priority change?
  3. What stole the most time that wasn't planned?
- Carry-overs are re-scored in Step 3 like any other candidate — slipping last week
  does not grant automatic priority.

## Step 3 — Identify priorities (5 min)

- Collect candidates: carry-overs, deadline-driven work, goal-driven work (check
  active quarterly objectives and skill roadmaps if on file), and incoming requests.
- Score every candidate with the IUE model (`capacity-and-scoring.md` §3). Show the
  scored table.
- Select **at most 3 weekly priorities** from the ≥15 band. 10–14 becomes scheduled
  work; <10 goes to backlog with its score recorded.

## Step 4 — Estimate capacity (3 min)

- Compute per-day `focus_capacity` using the capacity model (§1). Show the table —
  users consistently overestimate by 2–3× until they see the math.
- Identify the week's **deep-work landscape**: which days have a ≥90-minute
  uninterrupted gap. These are the only homes for priority work.

## Step 5 — Create the plan (5 min)

Allocation order:

1. Priority 1 gets the best deep-work gaps first (earliest, longest).
2. Priorities 2–3 fill remaining deep-work gaps.
3. Scheduled work (10–14 band) fills shallow gaps (<90 min).
4. Leave ≥15% of each day's focus capacity unallocated as reaction buffer.

- **Connector path (optional)**: offer to write the deep-work blocks to the calendar,
  one confirmation per event.
- **Manual fallback**: the plan's day-by-day table is the schedule; user transcribes
  what they want.

## Step 6 — Flag overloaded days (2 min)

Apply the overload rules (§2). For each flagged day present the four cut options
(move / shrink / delegate / drop) with a concrete suggestion for each, and get a
decision. The plan is not final while any flag is unresolved.

## Step 7 — Define success criteria (3 min)

Each weekly priority gets a "done means" statement meeting the §5 standard, plus the
**Friday question**: "On Friday, what single sentence would prove this week worked?"
Record it at the top of the plan.

## Quality bar (self-check before emitting)

- [ ] ≤3 priorities, each scored ≥15 and carrying a binary "done means"
- [ ] Capacity table shown with the math visible
- [ ] Zero unresolved OVERLOADED flags
- [ ] Reaction buffer present every day
- [ ] Backlog items listed with scores (nothing silently dropped)
