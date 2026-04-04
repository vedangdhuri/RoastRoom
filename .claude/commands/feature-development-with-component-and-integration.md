---
name: feature-development-with-component-and-integration
description: Workflow command scaffold for feature-development-with-component-and-integration in RoastRoom.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /feature-development-with-component-and-integration

Use this workflow when working on **feature-development-with-component-and-integration** in `RoastRoom`.

## Goal

Implements a new feature by first creating a dedicated component, then integrating it into the main application and updating shared state.

## Common Files

- `app/components/*.jsx`
- `app/room/[roomId]/page.jsx`
- `app/store/gameStore.js`
- `app/services/roomService.js`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create a new component file in app/components/ (e.g., ReactionRenderer.jsx, AudienceVoting.jsx, HighlightExport.jsx)
- Integrate the new component into a main page (e.g., app/room/[roomId]/page.jsx)
- Update shared state or services if needed (e.g., app/store/gameStore.js, app/services/roomService.js)

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.