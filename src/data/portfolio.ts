import { brand } from "@/data/brand";

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
  platform: "github" | "facebook" | "tiktok";
  url: string;
  username: string;
  status: "active" | "unavailable";
};

export const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Projects", href: "/#projects", icon: "projects" },
  { label: "About Me", href: "/about", icon: "about" },
  { label: "Contact", href: "/contact", icon: "contact" },
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
  title: `Welcome to ${brand.name}. I build simple, useful web projects.`,
  description:
    "This is where I share the work I have been building, the ideas I am exploring, and the projects I am continuing to improve.",
};

export const overviewParagraphs = [
  `Hi, welcome to my portfolio hub, ${brand.name}. I am Paul (Xyrus).`,
  "Right now I am working on hobby projects like the ones you see here, while learning and improving step by step.",
  "I enjoy trying new technology, especially AI, because it helps me work faster, stay productive, and build better than I could in the past.",
];

export const aboutPageContent = {
  eyebrow: "About me",
  title: "A little more about me and how I build.",
  intro:
    "Hello, my name is Paul. Welcome to my portfolio hub (DEZE), where I showcase all of my side projects, each serving a different purpose - from apps to a business website, a streaming site, and more.",
  email: "paul@account.deze.me",
  paragraphs: [
    "Building everything from scratch can be a hassle for me: coming up with design ideas, figuring out how to implement them, and deciding on features and functionality. Most importantly, every project needs a clear purpose; without that, there is no reason for me to develop it in the first place.",
    "The kind of hustle I am talking about is very different from what it used to be in a world without AI. Now, thanks to advanced technology, AI helps me a lot by reducing the time I spend brainstorming ideas, writing code, and fixing bugs. What used to take reading countless articles and digging through Stack Overflow can now start with a single AI prompt.",
    "Even so, I still run into challenges because AI is just a tool. It cannot perfectly guess what I am thinking or what the final result should look like. That is why I still need to plan carefully and guide the process to get the outcome I want.",
    'So, in the end, I am doing what I would call "vibe coding" with a hybrid approach - combining my own ideas and decisions with AI assistance.',
  ],
} as const;

export const contactPageContent = {
  eyebrow: "Contact",
  title: "Let's connect",
  paragraphs: [
    "Did my side projects impress you? If not, that's okay. I hope they sparked your interest, even just a little, and that's why you're here on this page.",
    "If you'd like to collaborate with me or just chat, you can reach me using the contact information on this page. Feel free to send me a message; I'll reply as soon as possible.",
  ],
  thankYou: "Thank you!",
  contactNote: "Choose whichever contact option feels easiest for you.",
  responseLabel: "Reply time",
  responseValue: "I'll get back to you as soon as I can.",
} as const;

export const projectSectionContent = {
  eyebrow: "Selected Projects",
  title: "Current portfolio highlights",
  description:
    "These are a few recent projects, each presented with enough detail to browse quickly and open when you want a closer look.",
};

export const footerContent = {
  copyright: `${brand.name}. A small portfolio where I share what I am building.`,
};

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    platform: "github",
    url: "https://github.com/xyrusL",
    username: "xyrusL",
    status: "active",
  },
  {
    label: "Facebook",
    platform: "facebook",
    url: "",
    username: "Unavailable right now",
    status: "unavailable",
  },
  {
    label: "TikTok",
    platform: "tiktok",
    url: "",
    username: "Unavailable right now",
    status: "unavailable",
  },
];
