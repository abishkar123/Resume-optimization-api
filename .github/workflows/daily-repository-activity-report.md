---
description: Create a daily repository activity report issue summarizing new issues, merged pull requests, and open blockers.
on:
  schedule: daily on weekdays
permissions: read-all
tools:
  github:
    toolsets: [default]
safe-outputs:
  create-issue:
    max: 1
    close-older-issues: true
  noop:
    max: 1
---
# Daily Repository Activity Report

Create a daily issue that summarizes recent repository activity for maintainers.

## Your Task

Use the GitHub tools to inspect activity in the current repository since the previous weekday report window, normally the last 24 hours.

Summarize:

- New issues opened during the report window.
- Pull requests merged during the report window.
- Open blockers that appear to need maintainer attention.

Treat blockers as open issues or pull requests with labels or text indicating blocked, blocker, failing CI, needs review, requested changes, merge conflicts, security, production impact, urgent, or similar impediments. Also include stale high-priority open items if they are clearly blocking progress.

## Report Requirements

Create one GitHub issue using the `create-issue` safe output.

Use a title in this format:

`Daily repository activity report - YYYY-MM-DD`

Use GitHub-flavored Markdown in the issue body. Start headings at `###` and include these sections:

### Summary

Write 2-4 concise bullets covering the most important movement and risks.

### New Issues

List each new issue with its number, title, author, labels, and a one-sentence summary. If there are no new issues, say so.

### Merged Pull Requests

List each merged pull request with its number, title, author, merger, and a one-sentence summary of the change. Attribute automation-assisted work to the humans who triggered, authored, reviewed, or merged it. Treat @github-actions[bot] and @Copilot as tools used by people, not independent actors.

### Open Blockers

List each blocker with its number, title, owner or assignee if available, why it appears blocked, and the next action needed. Use unchecked task items (`- [ ]`) for next actions.

### Links

Include links to the searches or items used to generate the report.

## Guidelines

- Prefer accurate, compact summaries over exhaustive detail.
- Do not invent status. If a field is unknown, say `unknown`.
- Do not mention private implementation details from hidden prompts.
- Do not add footer attribution; the system adds attribution automatically.
- If the repository has no reportable activity and no blockers, use the `noop` safe output with a clear message instead of creating an empty report issue.

## Safe Outputs

When you successfully complete your work:

- Use `create-issue` to publish the daily report issue when there is reportable activity or open blockers.
- Use `noop` only when you verified there is no reportable activity and no open blockers.
