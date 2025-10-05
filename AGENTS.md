# Agent Guidelines for p5.js Creative Coding Project

## Build/Lint/Test Commands
- `npm run dev` - Start development server
- `npm run build` - TypeScript compile and Vite build
- `npm run lint` - Check code with Biome
- `npm run lint:fix` - Fix linting issues automatically
- `npm run format` - Format code with Biome
- No test framework configured

## Tool Usage
- Never start a dev server on your own, unless explicitly asked
- There will usually be one running on port 3000 already, which can be accessed

## Code Style Guidelines
- Use Biome for formatting and linting (semicolons as needed)
- TypeScript strict mode enabled with all strict flags
- Import style: `import type` for types, regular imports for values
- Export named functions/constants with `export const`
- Use camelCase for variables and functions
- DOM types enabled, no unused locals/parameters allowed
- p5.js sketches follow pattern: `export const sketchName = (p: p5) => { ... }`
- Use arrow functions and const declarations
- HSB color mode for p5.js animations
- Responsive canvas sizing with windowResized handler
- No comments added unless explicitly requested
