# DEZE — Personal Hub

> *"Gateway to the Future"* — A personal landing page by a dev exploring the web one line of code at a time.

DEZE is a personal home on the internet. It acts as a central hub that links to various personal projects and creations, all hosted under the `deze.me` domain network.

---

## 🌐 What's Inside

- 🍉 **Watermelon** — A cozy Minecraft SMP server with custom plugins and endless adventures
- 📺 **RioAnime** — An anime streaming platform — stream, discover, and enjoy anime
- 🔧 **Papa's Electronic Repair Shop** — Trusted electronics repair service since 2021
- 🕹️ **Arcade** — A built-in browser game hub with multiple classic games

### 🎮 Arcade Games
The DEZE Arcade hosts the following browser-playable games:
- **Flappy Bird** — Guide your bird through the pipes
- **Mental Math Practice** — Sharpen your arithmetic skills
- **Meteor Catch** — Catch falling meteors
- **Neon Dodger** — Dodge obstacles in neon style
- **Snake** — Classic snake game
- **Tap Tap Shoots** — Quick-reflex tapping game
- **Tetris** — Classic block stacking puzzle
- **Word Guess** — Guess the hidden word (Wordle-style)

---

## 🛡️ Asset Protection

DEZE also acts as a **private asset server**, serving static assets (e.g. stylesheets for RioAnime) with CORS protection. Only verified `deze.me` subdomains are allowed to load assets from `/assets/rio/*`.

To add a new allowed domain, edit `src/middleware.ts`:
```ts
const ALLOWED_ORIGINS = [
  'https://rioanime.deze.me',
  'https://landing.deze.me',
  // Add your subdomain here
];
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Installation
```bash
# 1. Clone the repository
git clone <your-repo-url>
cd deze

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the site.

---

## 🏗️ Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 16 | React framework & routing |
| [React](https://react.dev) | 19 | UI library |
| [TypeScript](https://www.typescriptlang.org) | 5 | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Utility-first styling |

---

## 📦 Available Scripts

```bash
npm run dev        # Start local development server (hot-reload)
npm run build      # Build for production (also minifies CSS)
npm run start      # Run the production build
npm run lint       # Run ESLint to check for code issues
```

---

## 📁 Project Structure

```
deze/
├── public/
│   └── assets/          # Static assets (images, stylesheets for subdomains)
└── src/
    ├── app/
    │   ├── arcade/      # Arcade hub page + individual game routes
    │   │   ├── fluppy-bird/
    │   │   ├── snake/
    │   │   ├── tetris/
    │   │   └── ...      # (+ 5 more games)
    │   ├── components/  # Reusable UI components
    │   ├── layout.tsx   # Root HTML layout & metadata
    │   └── page.tsx     # Main landing page (hub with project cards)
    └── middleware.ts    # Asset CORS protection logic
```

---

## 🌍 Deployment

This site is deployed on **Vercel** using the [Vercel Platform](https://vercel.com/new). Vercel handles automatic deployments on every push to the main branch.

```bash
# Production build preview (optional, before pushing)
npm run build
npm run start
```

---

*© 2025 DEZE — Built with ❤️*
