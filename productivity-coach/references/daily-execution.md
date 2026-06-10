# Workflow: Daily Execution

Owner agent: `daily-execution-coach`. Output template: `templates/daily-plan.md`.
Three rituals: morning plan (≤5 min), distraction triage (on demand, ≤1 min),
end-of-day review (≤5 min).

## Ritual 1 — Morning plan

1. **Fixed commitments.** Connector path: today's calendar (titles + times only).
   Manual fallback: "What's locked on your calendar today?"
2. **Weekly alignment.** Read the current weekly plan if present. Today's must-do
   should serve a weekly priority. If nothing today serves any weekly priority, state
   it: "None of today's work advances your weekly priorities — deliberate or drift?"
3. **Top 3.** Exactly one must-do + two should-dos:
   - Must-do: the day fails without it. Gets the deep work block.
   - Each item: "done means" statement (binary, see `capacity-and-scoring.md` §5) and
     a 0.5h-unit estimate.
   - Items beyond 3 go to **won't-do-today** — written, visible, guilt-free.
4. **Deep work block.** One 60–120 min block on the largest free gap, earliest
   available, assigned to the must-do. Defenses, pick what applies: calendar block
   titled "Hold", notifications off, phone elsewhere, one writing/coding surface open.
   If no ≥60-min gap exists, flag the day: "No deep-work gap today — must-do needs
   either a meeting moved or a 45-min reduced block. Which?"
5. **Capacity sanity.** Sum of top-3 estimates must fit within today's
   `focus_capacity` (capacity model §1). Over → shrink before the day starts, not at
   4pm.

## Ritual 2 — Distraction handling (on demand)

When the user reports being derailed, run the 3-question triage — fast, no lecture:

1. **Truly urgent?** Due today AND user is the only one who can act → it becomes the
   new must-do, old must-do explicitly demoted (said out loud, written down).
2. **Park it.** Not truly urgent → capture in one line on the plan's capture list
   with a when ("tomorrow's triage" / "Friday admin block"). Parked ≠ lost; that's
   what makes parking psychologically possible.
3. **Re-entry step.** Name the literal next physical action on the interrupted work:
   the file to reopen, the test to rerun, the sentence to finish. Re-entry beats
   willpower.

Recurring patterns (same interrupter or channel ≥3× in a week) get noted for the
weekly review as a structural fix candidate (e.g. office hours, channel mute, SLA).

## Ritual 3 — End-of-day review

Score, capture, pre-stage — then stop. Not a retrospective.

1. **Score the day** (fills the template's review section):
   - Must-do done? Y/N (if N: one-line cause — estimate / interruption / priority change)
   - Should-dos done: 0–2
   - Deep work block held? Y/N
   - Interruptions: parked vs. chased counts
2. **Capture:** one carry-over (top candidate for tomorrow) and one lesson, single
   line each. A lesson repeated 3 days running is escalated to the weekly review.
3. **Pre-stage tomorrow:** must-do candidate + first physical action. Tomorrow's
   morning plan starts 80% done.
4. **Shutdown line.** End with an explicit "day closed" — open loops are written down,
   not carried in the head.

## Quality bar

- Exactly 3 priorities, one deep work block, won't-do list present.
- Estimates fit focus capacity before the day starts.
- Evening output is ≤10 lines. Speed is what keeps the habit alive.
