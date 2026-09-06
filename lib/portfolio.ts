export type NavSection = "start" | "work" | "cognition" | "connect";

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

export const contact = {
  email: "tumara.hall@gmail.com",
  phone: "022 400 6030",
  phoneHref: "tel:+64224006030",
  address: "288 Conyers Street, Invercargill",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=288+Conyers+Street+Invercargill",
};

export const bringItems = [
  "Two degrees – Business Management + IT (Open Polytech)",
  "Full-stack dev – Community Bridge Technologies",
  "Logistics brain – Ran Sims Pacific Metals as sole-charge",
  "AI enthusiast – Built custom assistive devices, resolved 74/77 Windows 11 upgrades",
  "Real-world resilience – Forklift licensed, health & safety certified, comfortable under pressure",
];

export const techStack = [
  "ASP.NET",
  "C#",
  "VB.NET",
  "SQL Server",
  "T-SQL",
  "HTML",
  "CSS",
  "JavaScript",
  "AI-assisted dev tools",
];

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
  "> init manifesto — Tumara Hall",
  "> role: Software Developer | Invercargill, NZ",
  ">",
  "> I build systems that actually work. In the real world.",
  "> Industrial yards. Logistics. Assistive tech for families.",
  "> I don't just write code — I solve problems people actually have.",
  ">",
  "> looking for: features that matter",
  "> scheduling · payments · integrations · AI-assisted development",
  "> mode: own the problem from start to finish",
  "> _",
];

export const stats = [
  { label: "Degrees", value: 2, suffix: "" },
  { label: "Win11 upgrades", value: 74, suffix: "/77" },
  { label: "Community focus", value: 100, suffix: "%" },
];
