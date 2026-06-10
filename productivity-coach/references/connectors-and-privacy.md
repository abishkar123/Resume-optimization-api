# Connector Strategy, Permission Boundaries, and Manual Fallbacks

The system is **manual-first**: every workflow completes with user-typed input alone.
Connectors are optional accelerators. Never assume one exists; discover what is
actually available in the current session before offering it, and never report a
connector as available without checking.

## Recommended connectors (all optional)

| Connector | Used by | What it reads/writes | Minimum data needed | Manual fallback |
|---|---|---|---|---|
| **Calendar** (e.g. Google Calendar) | weekly, weekend, daily planners | Read: event titles + start/end times for the planning window. Write: deep-work blocks (only with per-event confirmation) | Titles and times only — never attendees, descriptions, or locations | User pastes or lists their commitments; agent builds a text timetable |
| **Task manager** (e.g. Todoist, Linear, Jira) | weekly, daily planners | Read: open tasks + due dates. Write: nothing by default | Task title, due date, status | User lists open tasks; the plan file itself is the task list |
| **Email** (e.g. Gmail) | weekly planner (commitment capture) | Read: only messages the user explicitly points at ("the thread from Sam"). Never bulk-scan an inbox | Sender + subject of named threads | User summarizes the commitment in one line |
| **Notes** (e.g. Notion, Obsidian) | review-coach, skill-building-coach | Read/write review and roadmap pages if the user keeps artifacts there | Only the productivity pages the user names | Local markdown files in the productivity directory (the default) |
| **Documents** (e.g. Google Drive) | career-growth-coach | Read: ladder/expectations doc the user names. Write: nothing | The single named document | User pastes the relevant ladder text |
| **GitHub** | career-growth-coach (impact evidence), skill-building-coach (practice tracking) | Read: the user's merged PRs / commit titles in named repos | PR titles, dates, repo names — not diffs or code | User lists shipped work from memory; agent prompts with "what merged this month?" |
| **Web search** | skill-building-coach (resources), career-growth-coach (role expectations) | Read-only public web | The search query | Agent recommends from its own knowledge and labels currency limits |
| **Collaboration tools** (e.g. Slack) | daily-execution-coach (distraction triage) | None recommended. Advice-only: mute/status strategies | — | Always manual — this connector is intentionally not used for reading messages |

## Permission boundaries

1. **Read-by-default, write-by-exception.** Reads happen only for the active workflow's
   window (this week, this weekend, today). Any write to an external system (calendar
   event, task, page) requires explicit per-action confirmation showing exactly what
   will be written.
2. **Scope to the window.** Never read beyond the planning period. A weekly plan reads
   7 days of calendar, not the whole month.
3. **Titles, not contents.** Planning needs *when the user is busy and what the block
   is called*. Event descriptions, attendee lists, email bodies, and document contents
   stay unread unless the user explicitly pastes or names them.
4. **No silent propagation.** Data read from one connector is never written to another
   (e.g. calendar titles never end up in a Notion page) without the user seeing and
   approving the exact content.
5. **Career data is the most sensitive tier.** Evidence logs, promotion scorecards, and
   resume material never leave local files via a connector without a per-export
   confirmation that names the destination and reminds the user the content may
   include employer-confidential metrics.

## Data minimization rules

- Ask only for what the current step needs. The weekly planner needs time blocks and
  commitment names — not why a meeting exists.
- Never request or store: credentials, compensation, health details, message bodies,
  or other people's personal information. If the user volunteers sensitive detail,
  use it for the current reasoning step and exclude it from saved artifacts unless
  they explicitly ask to keep it.
- Saved artifacts default to the local productivity directory. The user owns the
  files; nothing syncs anywhere by default.
- When summarizing connector data into an artifact, prefer aggregates ("6h of
  meetings Tuesday") over itemized copies of the source data.

## Connector offer script (all agents)

1. Check whether a relevant connector is actually available in this session.
2. If yes: "I can read your calendar for this week's commitments (titles and times
   only), or you can list them — which do you prefer?"
3. If declined, unavailable, or it fails mid-flow: switch to the manual fallback from
   the table above without re-asking, and continue the workflow seamlessly.
4. Never block a workflow on a connector. Manual completion is always possible.
