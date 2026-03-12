<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" width="800" height="200">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a1a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0d1b2a;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="neon" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#00f5ff;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#bf5fff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#00f5ff;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="softglow">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- background -->
  <rect width="800" height="200" fill="url(#bg)" rx="16"/>

  <!-- hex grid pattern -->
  <g opacity="0.08" stroke="#00f5ff" stroke-width="0.5" fill="none">
    <polygon points="60,20 80,10 100,20 100,40 80,50 60,40"/>
    <polygon points="100,20 120,10 140,20 140,40 120,50 100,40"/>
    <polygon points="140,20 160,10 180,20 180,40 160,50 140,40"/>
    <polygon points="180,20 200,10 220,20 220,40 200,50 180,40"/>
    <polygon points="220,20 240,10 260,20 260,40 240,50 220,40"/>
    <polygon points="80,50 100,40 120,50 120,70 100,80 80,70"/>
    <polygon points="120,50 140,40 160,50 160,70 140,80 120,70"/>
    <polygon points="160,50 180,40 200,50 200,70 180,80 160,70"/>
    <polygon points="200,50 220,40 240,50 240,70 220,80 200,70"/>
    <polygon points="60,80 80,70 100,80 100,100 80,110 60,100"/>
    <polygon points="100,80 120,70 140,80 140,100 120,110 100,100"/>
    <polygon points="580,10 600,0 620,10 620,30 600,40 580,30"/>
    <polygon points="620,10 640,0 660,10 660,30 640,40 620,30"/>
    <polygon points="660,10 680,0 700,10 700,30 680,40 660,30"/>
    <polygon points="700,10 720,0 740,10 740,30 720,40 700,30"/>
    <polygon points="600,40 620,30 640,40 640,60 620,70 600,60"/>
    <polygon points="640,40 660,30 680,40 680,60 660,70 640,60"/>
    <polygon points="680,40 700,30 720,40 720,60 700,70 680,60"/>
  </g>

  <!-- circuit lines -->
  <g opacity="0.18" stroke="#00f5ff" stroke-width="1" fill="none">
    <line x1="0" y1="160" x2="120" y2="160"/>
    <line x1="120" y1="160" x2="150" y2="140"/>
    <line x1="150" y1="140" x2="200" y2="140"/>
    <line x1="680" y1="160" x2="800" y2="160"/>
    <line x1="650" y1="140" x2="680" y2="160"/>
    <line x1="600" y1="140" x2="650" y2="140"/>
    <circle cx="120" cy="160" r="3" fill="#00f5ff" opacity="0.6"/>
    <circle cx="150" cy="140" r="3" fill="#00f5ff" opacity="0.6"/>
    <circle cx="680" cy="160" r="3" fill="#00f5ff" opacity="0.6"/>
    <circle cx="650" cy="140" r="3" fill="#00f5ff" opacity="0.6"/>
  </g>

  <!-- glowing dots -->
  <circle cx="30" cy="100" r="2" fill="#00f5ff" opacity="0.7" filter="url(#softglow)"/>
  <circle cx="770" cy="100" r="2" fill="#bf5fff" opacity="0.7" filter="url(#softglow)"/>
  <circle cx="50" cy="60" r="1.5" fill="#00f5ff" opacity="0.5"/>
  <circle cx="750" cy="60" r="1.5" fill="#bf5fff" opacity="0.5"/>
  <circle cx="40" cy="140" r="1.5" fill="#bf5fff" opacity="0.5"/>
  <circle cx="760" cy="140" r="1.5" fill="#00f5ff" opacity="0.5"/>

  <!-- welcome text -->
  <text x="400" y="68" font-family="'Courier New', monospace" font-size="13" fill="#00f5ff" text-anchor="middle" opacity="0.8" filter="url(#softglow)">— welcome to —</text>

  <!-- main title -->
  <text x="400" y="122" font-family="'Courier New', monospace" font-size="58" font-weight="bold" fill="url(#neon)" text-anchor="middle" filter="url(#glow)" letter-spacing="8">DEZE</text>

  <!-- subtitle -->
  <text x="400" y="155" font-family="'Courier New', monospace" font-size="12" fill="#bf5fff" text-anchor="middle" opacity="0.85" letter-spacing="4">GATEWAY · NETWORK · PORTFOLIO</text>

  <!-- bottom divider line -->
  <line x1="200" y1="175" x2="600" y2="175" stroke="url(#neon)" stroke-width="1" opacity="0.4"/>
  <circle cx="200" cy="175" r="2" fill="#00f5ff" opacity="0.6"/>
  <circle cx="600" cy="175" r="2" fill="#bf5fff" opacity="0.6"/>
</svg>

# 🌐 Deze — Gateway of Networks

> *A portfolio that connects current work, future ideas, and a love for the latest tech.*

</div>

---

## 👋 Hello there, welcome!

Hey! 🎉 This is **Deze** — my personal portfolio site where I showcase my current projects and future ones. Think of it as my own little corner of the internet — a **gateway** that links everything I've been building and experimenting with.

I'm always on the lookout for the **latest tech** 🔭 and love jumping in to test things out. If it's new, shiny, and interesting — I'm probably already playing with it. ✨

---

## 🤖 How I Work with AI

I use **AI as a productivity booster** — not a replacement for thinking. Here's how I see it:

- 🧠 **Thinking & Planning** — AI helps me brainstorm, break down complex problems, and plan my projects faster.
- 🐛 **Bug Fixing** — Great at spotting issues and suggesting fixes I might have missed.
- ⚙️ **Handling Complexity** — When a task gets complicated, AI helps me work through it step by step.
- 🚀 **Shipping Faster** — With AI on my side, I can focus on what matters and ship more confidently.

> 💬 *"I'm not saying AI replaces my ability to think — I use it to **boost my productivity**."*

Some of the projects here were built with the help of AI. That's not a limitation — it's just really cool tech, and I'm taking full advantage of the opportunity. 🤩

---

<div align="center">

Made with 💙 + 🤖 + ☕ by **xyrusL**

[![GitHub](https://img.shields.io/badge/GitHub-xyrusL-181717?style=flat-square&logo=github)](https://github.com/xyrusL)

</div>
