# Productivity Coach — Multi-Agent Package

A reusable, standards-based productivity operating system for Claude Code, built as a
set of cooperating subagents. It covers weekly planning, weekend planning, daily
execution, skill-building, professional growth, and periodic reviews — and works with
or without external connectors.

## Package layout

```
productivity-coach/
├── README.md                       ← this file
├── agents/                         ← Claude Code subagent definitions
│   ├── productivity-coach.md       ← orchestrator / router
│   ├── weekly-planner.md
│   ├── weekend-planner.md
│   ├── daily-execution-coach.md
│   ├── skill-building-coach.md
│   ├── career-growth-coach.md
│   └── review-coach.md
├── references/                     ← detailed workflows the agents follow
│   ├── weekly-planning.md
│   ├── weekend-planning.md
│   ├── daily-execution.md
│   ├── skill-building.md
│   ├── professional-growth.md
│   ├── review-system.md
│   ├── capacity-and-scoring.md     ← shared math: capacity, priority scores, overload flags
│   └── connectors-and-privacy.md   ← connector strategy, permission boundaries, manual fallbacks
└── templates/                      ← repeatable structured outputs
    ├── weekly-plan.md
    ├── weekend-plan.md
    ├── daily-plan.md
    ├── skill-roadmap-30-60-90.md
    ├── daily-review.md
    ├── weekly-review.md
    ├── monthly-review.md
    ├── quarterly-reset.md
    └── evidence-log.md
```

## Installation

Copy the agent definitions into a Claude Code agents directory:

```bash
# Project-level (this repo only)
mkdir -p .claude/agents
cp productivity-coach/agents/*.md .claude/agents/

# Or user-level (all projects)
mkdir -p ~/.claude/agents
cp productivity-coach/agents/*.md ~/.claude/agents/
```

Keep the `references/` and `templates/` directories where the agents can read them
(the agents resolve them relative to this package directory). If you relocate the
package, update the `Package root` line at the top of each agent's body.

## How it works

- **`productivity-coach`** is the entry point. It classifies the request and routes to
  the right specialist agent, or runs short multi-step flows (e.g. weekly review →
  weekly plan) by chaining specialists.
- Each specialist reads its workflow from `references/` and emits output using the
  matching file in `templates/`. Outputs are structured: checklists, scored tables,
  capacity math, and action plans — not vague coaching language.
- All agents work **fully manually by default**. Connectors (calendar, email, tasks,
  notes, GitHub, web search) are optional accelerators; every connector step has a
  documented manual fallback in `references/connectors-and-privacy.md`.

## Data the user keeps

Plans, reviews, roadmaps, and the evidence log are written as markdown files in a
user-chosen directory (default suggestion: `~/productivity/`). Nothing is sent to
external services unless the user explicitly asks for a connector action.

## Acceptance criteria → where it's satisfied

| Deliverable | Agent | Workflow | Template |
|---|---|---|---|
| Realistic weekly plan | `weekly-planner` | `references/weekly-planning.md` | `templates/weekly-plan.md` |
| Weekend plan | `weekend-planner` | `references/weekend-planning.md` | `templates/weekend-plan.md` |
| Daily plan | `daily-execution-coach` | `references/daily-execution.md` | `templates/daily-plan.md` |
| 30/60/90-day skill plan | `skill-building-coach` | `references/skill-building.md` | `templates/skill-roadmap-30-60-90.md` |
| Monthly review | `review-coach` | `references/review-system.md` | `templates/monthly-review.md` |
| Growth evidence log | `career-growth-coach` | `references/professional-growth.md` | `templates/evidence-log.md` |
| Connector recommendations + privacy notes | all | `references/connectors-and-privacy.md` | — |
| Manual fallback workflows | all | `references/connectors-and-privacy.md` (per-connector fallback table) | — |

## Example requests that activate the system

- "Plan my week" / "I have too much on this week, help me triage"
- "Plan my weekend — I need real rest but also have errands"
- "What are my top 3 priorities today?" / "Run my end-of-day review"
- "Build me a 90-day plan to get good at system design"
- "Am I ready for promotion? What evidence am I missing?"
- "Run my monthly review" / "Quarterly reset"
