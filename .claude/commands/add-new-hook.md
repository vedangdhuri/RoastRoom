---
name: add-new-hook
description: Workflow command scaffold for add-new-hook in RoastRoom.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-new-hook

Use this workflow when working on **add-new-hook** in `RoastRoom`.

## Goal

Adds a new custom React hook for encapsulating reusable logic.

## Common Files

- `app/hooks/*.js`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create a new file under app/hooks/useFeature.js
- Implement the hook logic

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.