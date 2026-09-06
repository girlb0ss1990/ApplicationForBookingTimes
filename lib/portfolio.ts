export type NavSection = "work" | "process" | "cognition" | "connect";

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  href?: string;
  accent: string;
  year: string;
  status: "live" | "showcase" | "impact";
}

export const projects: Project[] = [
  {
    id: "tikanga",
    slug: "on-my-tikanga-terms",
    title: "On My Tikanga Terms",
    subtitle: "ACC Sensitive Claims · Survivor-centred MVP",
    description:
      "A meaningful application designed by CB Tech Charitable Trust for ACC Sensitive Claims survivors — built with dignity, cultural safety, and clarity at the centre. One of our charity MVPs proving that software can serve people who need it most.",
    tags: ["Next.js", "Trauma-informed UX", "NZ Public Sector Adjacent", "Charity MVP"],
    href: "https://on-my-tikanga-terms-7p68pl8s3-girlb0ss1990s-projects.vercel.app/",
    accent: "#00F0FF",
    year: "2025",
    status: "live",
  },
  {
    id: "cbtech",
    slug: "cb-tech-trust",
    title: "CB Tech Charitable Trust",
    subtitle: "Accessible software for Southland communities",
    description:
      "Founded to close the digital divide across Southland — delivering free and accessible tech support, education, and software solutions for people and organisations who are often left behind.",
    tags: ["Community Impact", "Founder", "Southland NZ", "Digital Equity"],
    href: "https://www.techstep.nz/portfolio/tumara-hall-cb-tech-nz/",
    accent: "#B026FF",
    year: "2024+",
    status: "impact",
  },
  {
    id: "press",
    slug: "odt-feature",
    title: "Big need for IT help",
    subtitle: "Featured · Otago Daily Times",
    description:
      "National and regional press coverage on the demand for accessible IT help in Southland — and the work CB Tech Trust is doing to meet it.",
    tags: ["Press", "Leadership", "Community"],
    href: "https://www.odt.co.nz/news/southland/big-need-for-it-help-qpzd3soc",
    accent: "#00F0FF",
    year: "2025",
    status: "showcase",
  },
];

export const manifestoLines = [
  "> init manifesto — Tumara Hall / Ngāti Whatua",
  "> role: Software Developer · Founder · CB Tech Trust",
  "> location: Southland, Aotearoa New Zealand",
  ">",
  "> I build systems that respect people.",
  "> Not dashboards for vanity — tools for dignity.",
  "> ACC Sensitive Claims survivors. Whānau. Community.",
  ">",
  "> Stack: C# · T-SQL · Next.js · Agentic AI",
  "> Intent: meaningful applications with real-world impact.",
  "> status: available for BookingTimes & mission-aligned builds",
  "> _",
];

export const stats = [
  { label: "Years building", value: 6, suffix: "+" },
  { label: "Projects shipped", value: 24, suffix: "" },
  { label: "Community focus", value: 100, suffix: "%" },
];
