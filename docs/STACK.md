# Technology Stack

> Explorer curriculum update map — October 17, 2026

## Runtime

| Technology | Version | Purpose |
|---|---:|---|
| Next.js | 16.3.8 | App Router website framework |
| React | 19.2.8 | UI rendering and local interactivity |
| TypeScript | 5.x | Typed application and curriculum data |
| Firebase | 12.19.0 | Authentication and Firestore integration |
| Lucide React | 1.51.0 | Interface icons |

## Relevant implementation choices

- CSS Modules provide route-scoped styling for the Explorer page.
- `next/image` renders local SVG curriculum illustrations with descriptive alt text.
- Local SVG assets under `public/illustrations/` avoid unlicensed or unstable external images.

## Useful commands

| Command | Purpose |
|---|---|
| `npm run dev` | Run the local site |
| `npm run lint` | Run ESLint |
| `npm run validate` | Check curriculum completeness and visualizer/diagram references |
| `npm run build` | Create a production build |
