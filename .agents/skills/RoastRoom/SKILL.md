```markdown
# RoastRoom Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you the core development patterns, coding conventions, and workflows used in the RoastRoom codebase, a Next.js application written in JavaScript. You'll learn how to structure features, follow commit and code style conventions, and implement or bundle features efficiently. This guide also covers testing patterns and provides handy commands for common development tasks.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `reactionRenderer.jsx`, `gameStore.js`

### Import Style
- Use **relative imports** for modules within the project.
  ```js
  import ReactionRenderer from '../components/reactionRenderer';
  ```

### Export Style
- Use **named exports** for modules.
  ```js
  // In gameStore.js
  export const gameState = { ... };
  export function updateGameState() { ... }
  ```

### Commit Messages
- Follow **conventional commit** format.
- Common prefixes: `feat`, `chore`
- Example:
  ```
  feat: add audience voting component to room page
  chore: upgrade Next.js to v13.4.2
  ```

## Workflows

### Feature Development with Component and Integration
**Trigger:** When adding a new interactive feature for spectators or users  
**Command:** `/add-feature-component`

1. **Create a new component** in `app/components/`
   - Example: `app/components/audienceVoting.jsx`
2. **Integrate the component** into a main page
   - Example: Add `<AudienceVoting />` to `app/room/[roomId]/page.jsx`
3. **Update shared state or services** if needed
   - Example: Modify `app/store/gameStore.js` or `app/services/roomService.js` to support the new feature

**Example:**
```js
// app/components/audienceVoting.jsx
export function AudienceVoting({ onVote }) {
  // component logic
}

// app/room/[roomId]/page.jsx
import { AudienceVoting } from '../../components/audienceVoting';

export default function RoomPage() {
  return (
    <div>
      {/* ...other components */}
      <AudienceVoting onVote={handleVote} />
    </div>
  );
}
```

---

### Feature Bundle with E2E and UI Integration
**Trigger:** When releasing a set of related features in one update  
**Command:** `/bundle-feature-release`

1. **Update or create multiple components** in `app/components/`
2. **Integrate components** into relevant pages (e.g., `app/room/[roomId]/page.jsx`, `app/dashboard/page.jsx`)
3. **Update shared state/services** as needed (`app/store/gameStore.js`, `app/services/roomService.js`)
4. **Add or update end-to-end tests**
   - Example: `e2e/spectator.spec.js`
5. **Update config or test result files** if necessary

**Example:**
```js
// e2e/spectator.spec.js
test('spectator can vote and see highlights', async ({ page }) => {
  // e2e test logic
});
```

---

### Dependency Upgrade
**Trigger:** When updating project dependencies to newer versions  
**Command:** `/upgrade-dependencies`

1. **Update `package.json`** with new dependency versions
2. **Update `package-lock.json`** to lock new versions

**Example:**
```json
// package.json
"dependencies": {
  "next": "^13.4.2",
  "react": "^18.2.0"
}
```

## Testing Patterns

- **Test files** follow the pattern: `*.test.*`
  - Example: `reactionRenderer.test.js`
- **Testing framework** is not explicitly specified, but end-to-end tests are found in `e2e/*.spec.js` (likely Playwright or similar).
- **End-to-end tests** are integrated into the feature bundle workflow.

**Example:**
```js
// reactionRenderer.test.js
import { render } from '@testing-library/react';
import { ReactionRenderer } from './reactionRenderer';

test('renders reactions', () => {
  render(<ReactionRenderer />);
  // assertions
});
```

## Commands

| Command                 | Purpose                                                        |
|-------------------------|----------------------------------------------------------------|
| /add-feature-component  | Start a new feature by creating and integrating a component    |
| /bundle-feature-release | Bundle and release multiple related features with E2E tests    |
| /upgrade-dependencies   | Upgrade core dependencies (Next.js, React, etc.)              |
```
