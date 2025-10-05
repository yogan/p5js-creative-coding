# Creative Coding with p5.js + TypeScript

A modern development setup for creative coding using p5.js with TypeScript and Vite for fast development feedback.

## Features

- ✨ p5.js with full TypeScript support
- 🔥 Hot reloading via Vite dev server
- 📱 Responsive canvas that adapts to window size
- 🎨 Organized sketch structure
- 🛠️ Modern ES6+ modules

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   Opens browser at `http://localhost:3000` with hot reloading enabled.

3. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── main.ts              # Entry point - loads and runs sketches
└── sketches/
    └── sketch1.ts       # Your first animated sketch
```

## Creating New Sketches

1. Create a new file in `src/sketches/` (e.g., `mySketch.ts`)
2. Export a function that takes a p5 instance:

```typescript
import p5 from 'p5'

export const mySketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(800, 600)
  }

  p.draw = () => {
    p.background(220)
    p.ellipse(p.mouseX, p.mouseY, 50, 50)
  }
}
```

3. Import and use it in `main.ts`:

```typescript
import { mySketch } from './sketches/mySketch'
new p5(mySketch, sketchContainer)
```

## Development Tips

- Sketches auto-reload when you save changes
- Use `p.windowResized()` to handle responsive canvas sizing
- Organize complex projects by creating multiple sketch files
- The canvas is centered and styled with a dark background

Happy coding! 🎨
