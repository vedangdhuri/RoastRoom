---
name: add-new-component
description: Workflow command scaffold for add-new-component in RoastRoom.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-new-component

Use this workflow when working on **add-new-component** in `RoastRoom`.

## Goal

Adds a new React component to the codebase, typically for a UI feature or logical unit.

## Common Files

- `app/components/auth/*.jsx`
- `app/components/chat/*.jsx`
- `app/components/game/*.jsx`
- `app/components/layout/*.jsx`
- `app/components/room/*.jsx`
- `app/components/ui/*.jsx`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create a new file under app/components/[category]/ComponentName.jsx or app/components/ui/ComponentName.jsx
- Implement the component logic and UI
- Optionally, update related files to use the new component

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.