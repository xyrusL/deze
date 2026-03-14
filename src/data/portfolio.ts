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

export type SocialLink = {
  label: string;
  platform: "github";
  url: string;
  username: string;
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
      "Anime streaming hub focused on free Tagalog anime, with featured shows, search, category filters, and a large browseable catalog.",
  },
  {
    shortName: "Papa's Electronic Repair Shop",
    url: "https://papaselectronicrepairshop.deze.me",
    description:
      "Service business website for a Quezon City and Rizal repair shop, highlighting TV and appliance repair, home service, and fast contact options.",
  },
  {
    shortName: "Chunkloader",
    url: "https://chunkloader.deze.me",
    description:
      "Minecraft seed exploration tool that turns raw seeds into interactive biome maps with overlays, structure previews, coordinates, and dimension switching.",
  },
  {
    shortName: "Watermelon",
    url: "https://watermelon.deze.me",
    description:
      "Minecraft community website for Watermelon SMP, featuring server info, custom gameplay highlights, tools, commands, and mobile download links.",
  },
];

export const heroContent = {
  eyebrow: "Learning in public",
  title: "Welcome to Deze Dev. I build simple, useful web projects.",
  description:
    "This is where I share the work I have been building, the ideas I am exploring, and the projects I am continuing to improve.",
};

export const overviewParagraphs = [
  "Hi, welcome to my portfolio hub, Deze Dev. I am Paul, also known as Xyrus, and I am 22 years old.",
  "Right now I am working on hobby projects like the ones you see here, while learning and improving step by step.",
  "I enjoy trying new technology, especially AI, because it helps me work faster, stay productive, and build better than I could in the past.",
];

export const projectSectionContent = {
  eyebrow: "Selected Projects",
  title: "Current portfolio highlights",
  description:
    "These are a few recent projects, each presented with enough detail to browse quickly and open when you want a closer look.",
};

export const footerContent = {
  copyright: "Deze Dev. A small portfolio where I share what I am building.",
};

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    platform: "github",
    url: "https://github.com/xyrusL",
    username: "xyrusL",
  },
];
