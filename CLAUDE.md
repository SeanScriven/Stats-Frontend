# STATS Frontend

## Stack
- React 19, TypeScript, Vite
- Material UI for reusable components
- SCSS Modules or ts styles for page section styling
- Vitest and React Testing Library for tests
- React Router for navigation

## Project Structure
- src/pages/ — full pages, each in their own folder
- src/components/ — reusable components
- src/services/ — API calls, one file per resource
- src/types/ — TypeScript interfaces
- src/constants/ - Reusable constant variables 
- src/api/ — http client setup

## Conventions
- Generate new components with: npm run generate <Name> <location> <scss|styled>
- Each component folder contains: Component.tsx, Component.module.scss or Component.styles.ts, Component.lazy.tsx, Component.test.tsx, index.ts
- Always use import type for type imports
- Two space indentation
- Semicolons required
- No trailing commas
- Blank line at end of every file

## Theme
- Background: #0a0e1a
- Card background: #111827
- Border: #1f2937
- Accent blue: #3b82f6
- Text primary: #f9fafb
- Text muted: #6b7280
- Font display: Bebas Neue
- Font body: Inter

## API
- Base URL: http://localhost:8000
- Endpoints: /leagues, /teams, /standings, /games

## Testing
- Always mock services with vi.spyOn
- Wrap components in MemoryRouter when they use routing hooks
- Use renderWithRouter helper for pages that use useParams