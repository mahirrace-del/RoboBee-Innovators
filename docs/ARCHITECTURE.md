# Architecture

> Explorer curriculum update map — October 17, 2026

## Overview

RoboBEE Innovators is a Next.js App Router website with a public robotics academy experience and an authenticated member/admin portal. Curriculum records live in one typed source, then feed the public Explorer page and the member curriculum workspace.

## Explorer data flow

```text
src/lib/curriculumData.ts
        |
        +--> /explorers (public, client-side lesson selection and simulator)
        |
        +--> /dashboard/curriculum (member lesson workspace and projector view)
        |
        +--> /dashboard/admin/curriculum (administration)
```

## Relevant components

| Component | Location | Role |
|---|---|---|
| Curriculum data | `src/lib/curriculumData.ts` | Typed lesson records, including the four Explorer lessons |
| Explorer page | `src/app/explorers/page.tsx` | Public visual curriculum journey and lesson details |
| Explorer styles | `src/app/explorers/explorers.module.css` | Responsive layout and branded visual system |
| Simulator | `src/components/curriculum/CurriculumSimulator.tsx` | Interactive visual chosen by each lesson's `visualizerId` |
| Illustrations | `public/illustrations/` | Local curriculum visual assets served from `/illustrations/...` |

## Integration points

| Service | Purpose |
|---|---|
| Firebase Auth | Member portal sign-in |
| Firestore | Member curriculum status and submissions where configured |

## Current technical notes

- The Explorer route is intentionally a Client Component because it uses selection and lesson-tab state.
- SVG illustrations are local public assets, avoiding remote-image configuration and making the course usable without third-party image hosts.
- The existing curriculum validator checks lesson record integrity and referenced wiring assets; the Explorer display must continue to consume `ALL_ROBOTICS_LESSONS` rather than a duplicate data source.
