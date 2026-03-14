# Deze Dev

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3a8.svg" alt="Palette" width="28" height="28" />
  <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f680.svg" alt="Rocket" width="28" height="28" />
  <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4bb.svg" alt="Laptop" width="28" height="28" />
</p>

This is the source for **Deze Dev**, a personal portfolio hub built with Next.js.  
It is designed to feel simple, modern, and personal while making it easy to browse projects, open external links, and grow the site over time.

Created by **Paul (Xyrus)**. GitHub: [xyrusL](https://github.com/xyrusL)

If you fork, reuse, or download this repo, please keep visible credit to Paul (Xyrus) and link back to the original repository when possible.

## Why this project exists

Deze Dev is meant to be more than a plain project list.  
It is a small home on the web for experiments, hobby builds, and work-in-progress ideas, presented in a way that feels clean, approachable, and a little more alive than a default starter template.

## What is inside

- A polished landing page with a strong portfolio-first layout
- Project cards with modal-based launch flow
- Social links with reusable status messaging for unavailable profiles
- Responsive design for desktop and mobile
- Custom branding, icons, and portfolio content driven from one data file

## Tech stack

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`

## Getting started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

For a production build:

```bash
npm run build
npm run start
```

## Project structure

- `src/app`
  App Router entry files, metadata, global styles, and app icons
- `src/components`
  Reusable UI sections, modal components, and shared SVG icons
- `src/data/portfolio.ts`
  Portfolio content, navigation, project details, and social link config
- `public`
  Static assets such as logos and exported icons

## Editing content

Most of the visible portfolio content can be updated in:

```ts
src/data/portfolio.ts
```

That includes:

- project names and descriptions
- social links
- hero copy
- section labels

## Design notes

The site intentionally leans into:

- soft glass panels
- smooth hover feedback
- lightweight modal interactions
- a clean, personal tone instead of generic product marketing copy

## Small note

This project has been shaped through lots of little refinements:  
better spacing, clearer project descriptions, smoother motion, stronger branding, and a more thoughtful mobile experience.

That is part of the point of Deze Dev too: keep building, keep refining, keep shipping.
