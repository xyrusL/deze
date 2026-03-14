export type Project = {
  shortName: string;
  url: string;
  description: string;
};

export type NavigationItem = {
  label: string;
  href: string;
  icon: "home" | "projects" | "about" | "contact";
};

export const navigationItems: NavigationItem[] = [
  { label: "Home", href: "#home", icon: "home" },
  { label: "Projects", href: "#projects", icon: "projects" },
  { label: "About", href: "#about", icon: "about" },
  { label: "Contact", href: "#footer", icon: "contact" },
];

export const projects: Project[] = [
  {
    shortName: "RioAnime",
    url: "https://rioanime.deze.me",
    description:
      "Anime-focused web experience with a clean presentation and room for expanding content.",
  },
  {
    shortName: "Papa's Electronic Repair Shop",
    url: "https://papaselectronicrepairshop.deze.me",
    description:
      "Service-oriented business site designed to present repair offerings clearly and credibly.",
  },
  {
    shortName: "Chunkloader",
    url: "https://chunkloader.deze.me",
    description:
      "Utility-style project with a practical layout that prioritizes straightforward interaction.",
  },
  {
    shortName: "Watermelon",
    url: "https://watermelon.deze.me",
    description:
      "Modern web project with a simple identity and space for future product or portfolio growth.",
  },
];

export const heroContent = {
  eyebrow: "Hello",
  title: "Welcome to my portfolio. I build simple, useful web projects.",
  description:
    "This is where I share the work I have been building, the ideas I am exploring, and the projects I am continuing to improve.",
};

export const overviewParagraphs = [
  "I am a developer who enjoys making websites that feel clear, practical, and easy to use.",
  "Here you will find a few of my recent projects, from small ideas to sites I am still growing over time.",
  "If you want to see what I make and how I approach my work, this is a good place to start.",
];

export const projectSectionContent = {
  eyebrow: "Selected Projects",
  title: "Current portfolio highlights",
  description:
    "These are a few recent projects, each presented with enough detail to browse quickly and open when you want a closer look.",
};

export const footerContent = {
  copyright: "© 2026 Deze. Designed as a modern portfolio homepage.",
  note: "Focused on clarity, responsiveness, and room for additional projects.",
};
