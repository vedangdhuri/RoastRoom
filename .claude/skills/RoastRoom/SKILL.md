```markdown
# RoastRoom Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you how to contribute to the RoastRoom codebase, a Next.js project written in JavaScript. You'll learn the project's coding conventions, file organization, and the main workflows for adding components, hooks, stores, utilities, and database migrations. The guide also covers testing patterns and provides handy commands for common tasks.

## Coding Conventions

### File Naming
- **Components:** Use PascalCase for React component files.
  - Example: `ChatBox.jsx`, `RoomList.jsx`
- **Hooks, stores, utilities:** Use camelCase or descriptive names.
  - Example: `useChat.js`, `gameStore.js`, `supabaseClient.js`
- **Migrations:** Use numeric prefix and snake_case description.
  - Example: `001_create_users_table.sql`

### Imports
- Mixed import styles are used.
  - **Default import:**
    ```js
    import React from 'react';
    ```
  - **Named import:**
    ```js
    import { useState } from 'react';
    ```
  - **Relative import:**
    ```js
    import ChatBox from '../components/chat/ChatBox';
    ```

### Exports
- Prefer **named exports** for modules.
  ```js
  export function useChat() { ... }
  export const gameStore = create(...);
  ```

### Example: Component File
```jsx
// app/components/chat/ChatBox.jsx
import React from 'react';

export function ChatBox({ messages }) {
  return (
    <div>
      {messages.map(msg => <div key={msg.id}>{msg.text}</div>)}
    </div>
  );
}
```

## Workflows

### Add New Component
**Trigger:** When introducing a new UI or logic component  
**Command:** `/new-component`

1. Create a new file under `app/components/[category]/ComponentName.jsx` or `app/components/ui/ComponentName.jsx`
2. Implement the component logic and UI
3. Optionally, update related files to use the new component

**Example:**
```bash
touch app/components/chat/MessageList.jsx
```
```jsx
// app/components/chat/MessageList.jsx
import React from 'react';

export function MessageList({ messages }) {
  return (
    <ul>
      {messages.map(msg => <li key={msg.id}>{msg.text}</li>)}
    </ul>
  );
}
```

---

### Add New Hook
**Trigger:** When abstracting logic into a reusable hook  
**Command:** `/new-hook`

1. Create a new file under `app/hooks/useFeature.js`
2. Implement the hook logic

**Example:**
```bash
touch app/hooks/useOnlineStatus.js
```
```js
// app/hooks/useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  return online;
}
```

---

### Add New Store
**Trigger:** When managing a new piece of global state  
**Command:** `/new-store`

1. Create a new file under `app/store/featureStore.js`
2. Implement the store logic

**Example:**
```bash
touch app/store/gameStore.js
```
```js
// app/store/gameStore.js
import { create } from 'zustand';

export const useGameStore = create(set => ({
  score: 0,
  increment: () => set(state => ({ score: state.score + 1 })),
}));
```

---

### Add New Lib Utility
**Trigger:** When adding a new library integration or utility function  
**Command:** `/new-lib`

1. Create a new file under `app/lib/feature.js`
2. Implement the utility or integration logic

**Example:**
```bash
touch app/lib/supabaseClient.js
```
```js
// app/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
```

---

### Add New Supabase Migration
**Trigger:** When updating the database schema or policies  
**Command:** `/new-migration`

1. Create a new migration file under `supabase/migrations/NNN_description.sql`
2. Write the SQL for schema or policy changes

**Example:**
```bash
touch supabase/migrations/002_add_rooms_table.sql
```
```sql
-- supabase/migrations/002_add_rooms_table.sql
create table rooms (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamp with time zone default now()
);
```

## Testing Patterns

- **Test files** use the pattern `*.test.*`
  - Example: `ChatBox.test.jsx`, `useOnlineStatus.test.js`
- **Testing framework** is not explicitly detected; check for Jest, Vitest, or similar in the project.
- Place tests alongside the file being tested or in a dedicated `__tests__` directory.

**Example:**
```js
// app/components/chat/ChatBox.test.jsx
import { render, screen } from '@testing-library/react';
import { ChatBox } from './ChatBox';

test('renders messages', () => {
  render(<ChatBox messages={[{ id: 1, text: 'Hello' }]} />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

## Commands

| Command         | Purpose                                               |
|-----------------|-------------------------------------------------------|
| /new-component  | Scaffold a new React component                        |
| /new-hook       | Scaffold a new custom React hook                      |
| /new-store      | Scaffold a new global state store                     |
| /new-lib        | Scaffold a new utility or integration in app/lib      |
| /new-migration  | Scaffold a new Supabase SQL migration                 |
```