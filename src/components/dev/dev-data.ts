export interface Developer {
  id: string;
  name: string;
  role: string;
  avatarInitials?: string;
  tagline?: string;
  bio?: string;
  email: string;
  phone: string;
  linkedInUrl: string;
  linkedInHandle?: string;
  githubUrl?: string;
  location?: string;
  skills: string[];
}

export const DEVELOPERS: Developer[] = [
  {
    id: "Karm",
    name: "Karm Sorathiya",
    role: "Full Stack Developer",
    avatarInitials: "KS",
    tagline: "Building interactive spatial web applications and modern educational tools.",
    bio: "Full stack developer crafting high-performance 3D interactive web experiences using Next.js, React Three Fiber, Three.js, and TypeScript.",
    email: "karmsorathiya532@gmail.com",
    phone: "+91 9512881044",
    linkedInUrl: "https://www.linkedin.com/in/karm-sorathiya-b66214377",
    linkedInHandle: "karm-sorathiya-b66214377",
    githubUrl: "https://github.com/KarmSorathiya378",
    location: "Jamnagar, Gujarat, India",
    skills: ["React 19", "Next.js 16", "Three.js", "R3F / Drei", "TypeScript", "Tailwind CSS"],
  },
];

export const PROJECT_SPECS = [
  {
    label: "3D Engine",
    value: "Three.js & React Three Fiber",
    detail: "Custom procedural geometry and photographic UV textures",
  },
  {
    label: "Framework",
    value: "Next.js 16 (Turbopack)",
    detail: "App Router with component caching & partial prefetching",
  },
  {
    label: "Assessment Engine",
    value: "64 Hardware Challenges",
    detail: "Across 8 hardware domains with 6 interactive test formats",
  },
  {
    label: "Styling & System",
    value: "Tailwind CSS v4 & Pure CSS",
    detail: "Fluid typography, hardware study-table palette, responsive design",
  },
];