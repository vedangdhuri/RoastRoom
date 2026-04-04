---
name: feature-bundle-with-e2e-and-ui-integration
description: Workflow command scaffold for feature-bundle-with-e2e-and-ui-integration in RoastRoom.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /feature-bundle-with-e2e-and-ui-integration

Use this workflow when working on **feature-bundle-with-e2e-and-ui-integration** in `RoastRoom`.

## Goal

Bundles multiple related features, integrates them across UI pages, updates shared services/state, and adds end-to-end tests.

## Common Files

- `app/components/*.jsx`
- `app/*/page.jsx`
- `app/store/gameStore.js`
- `app/services/roomService.js`
- `e2e/*.spec.js`
- `playwright.config.js`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Update or create multiple component files in app/components/
- Integrate components into various pages (e.g., app/room/[roomId]/page.jsx, app/dashboard/page.jsx, etc.)
- Update shared state/services (e.g., app/store/gameStore.js, app/services/roomService.js)
- Add or update end-to-end tests (e.g., e2e/spectator.spec.js)
- Update configuration or test result files as needed

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.