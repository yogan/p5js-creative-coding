# Agent Guidelines for p5.js Creative Coding Project

## Build/Lint/Test Commands
- `npm run build` - TypeScript compile and Vite build
- `npm run lint` - Check code with Biome
- `npm run lint:fix` - Fix linting issues automatically
- `npm run format` - Format code with Biome
- `npm run knip` - Check for unused code or package inconsistencies
- `npm run typecheck` - TypeScript type checking
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:e2e:ui` - Run Playwright tests with UI mode

## Forbidden Actions
- Do NOT start a dev server
- Do NOT use cURL to test the app, as it's a graphical p5.js project
- Do ONLY create commits when explicitly requested

## Code Style Guidelines
- Use Biome for formatting and linting (semicolons as needed)
- TypeScript strict mode enabled with all strict flags
- Import style: `import type` for types, regular imports for values
- Export named functions/constants with `export const`
- Use camelCase for variables and functions
- DOM types enabled, no unused locals/parameters allowed
- p5.js sketches follow pattern: `export const sketchName = (p: p5) => { ... }`
- Use arrow functions and const declarations
- RGB color mode for p5.js animations
- Responsive canvas sizing with windowResized handler
- No comments added unless explicitly requested

## E2E Testing Guidelines
- Use page locators for element selection
- The page locators may only be placed in `tests/page-objects.ts`
- Each test should start with: `const loc = createPageLocators(page)`
- Do not put timeouts in the code unless explicitly requested
