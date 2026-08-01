// ---------------------------------------------------------------------------
// Every piece of copy on the site lives here. Edit this file, not the pages.
// ---------------------------------------------------------------------------

export const profile = {
  firstName: "Dario",
  lastName: "Moscatello",
  role: "Real Estate Analyst",
  tagline: "Distressed credit, real estate, and things worth building.",
  city: "Milano",
  country: "Italy",
  coordinates: "45.4642° N, 9.1900° E",
  email: "moscatello.dario@gmail.com",
  // TODO: paste your full LinkedIn URL here
  linkedin: "https://www.linkedin.com/in/dario-moscatello",
};

export const nav = [
  { index: "01", label: "About", href: "/" },
  { index: "02", label: "Experience", href: "/experience" },
  { index: "03", label: "Research", href: "/research" },
  { index: "04", label: "Education", href: "/education" },
  { index: "05", label: "Awards", href: "/awards" },
  { index: "06", label: "Contact", href: "/contact" },
];

export const intro = [
  "I study Economics and Management at Bocconi University in Milan, and I work as a Real Estate Analyst at Copernicus RE Italia.",
  "My day job is pricing and underwriting UTP and NPL single names and portfolios — for Copernicus' own fund, for other investment funds, and for banks. Most of it comes down to reading a situation faster and more honestly than the next person.",
  "Before that I spent two summers in the US building research tools at Duke and Harvard Business School, and four years running a Web3 shop I co-founded at sixteen.",
];

export const interests = [
  "Distressed credit and special situations",
  "Real estate and architecture",
  "Chess and pattern recognition",
  "Running, golf, and the gym",
  "Reading",
];

export const languages = [
  { name: "Italian", level: "C2 — Native" },
  { name: "Estonian", level: "C2 — Native" },
  { name: "English", level: "C1 — Fluent" },
  { name: "Spanish", level: "B1 / B2" },
  { name: "German", level: "B1 / B2" },
];

export type Entry = {
  title: string;
  meta: string;
  place: string;
  period: string;
  points: string[];
  tags?: string[];
};

export const experience: Entry[] = [
  {
    title: "Copernicus RE Italia Srl",
    meta: "Real Estate Analyst",
    place: "Milan, Italy",
    period: "Mar 2026 — Present",
    points: [
      "Pricing and underwriting of UTP and NPL single names and portfolios for Copernicus' own fund, for third-party investment funds, and for banks.",
      "Build the valuation cases behind each position: collateral, recovery paths, timing, and the discount that makes the trade work.",
    ],
    tags: ["Financial analysis", "Underwriting", "Technical communication"],
  },
  {
    title: "NOBE.ee",
    meta: "Project Manager Intern",
    place: "Tallinn, Estonia",
    period: "Jun 2023 — Aug 2023",
    points: [
      "Supported the execution of two major developments: Keila Keskus and the EEDU Education & Business Campus.",
      "Handled the organisational and strategic side of both projects, keeping delivery on schedule and clients in the loop.",
    ],
    tags: ["Negotiation", "Time management", "Data analysis"],
  },
  {
    title: "MrXShop",
    meta: "Co-Founder — Crypto & NFTs",
    place: "Milan, Italy",
    period: "May 2019 — Oct 2022",
    points: [
      "Researched the Web3 B2B market and turned the gaps into a product: custom NFT solutions built for business clients.",
      "Grew it with a team of three to €50,000+ in revenue and 600+ clients served — all of it before I turned eighteen.",
    ],
    tags: ["Business development", "Digital strategy", "Blockchain"],
  },
];

export const research: Entry[] = [
  {
    title: "Global Pharma API Supply Chain Tracker",
    meta: "Student Researcher — Harvard Business School",
    place: "Cambridge, USA",
    period: "Jul 2025 — Aug 2025",
    points: [
      "Built an application that maps the global pharmaceutical API supply chain: manufacturing sites, logistics routes, and market dependencies in one view.",
      "Modelled disruption scenarios — a major port closing, for instance — to estimate inventory depletion timelines and the availability of essential medicines across affected regions.",
      "Used for supply-chain risk and resilience analysis.",
    ],
  },
  {
    title: "The Polarization Lab",
    meta: "Student Researcher — Duke University",
    place: "Durham, USA",
    period: "May 2025 — Jul 2025",
    points: [
      "Built an interactive, data-driven web application for Duke's Polarization Lab to analyse political polarization trends.",
      "Turned complex political datasets into dynamic visualizations researchers could actually explore.",
    ],
  },
];

export const education = [
  {
    school: "Bocconi University",
    degree: "BSc in Economics and Management",
    place: "Milan, Italy",
    period: "2023 — 2026",
    notes: [
      "Expected GPA: 3.8",
      "Active member of the Bocconi Real Estate Club, BS for Hedge Funds, and the Ruy Lopez Chess Society.",
    ],
    coursework:
      "Management, Macroeconomics, Financial Accounting, Statistics, Critical Thinking, Corporate Finance",
  },
  {
    school: "IIS Jean Monnet",
    degree: "High School Diploma in Administration, Finance and Marketing",
    place: "Como, Italy",
    period: "2023",
    notes: [
      "Final grade: 100/100",
      "Mathematics Olympiad team member, competing at national level.",
    ],
    coursework:
      "Law, Political Economy, Business Administration, Financial Accounting, Financial Mathematics",
  },
];

export const awards = [
  {
    year: "2022",
    title: "Mathematics Olympiad — Individual National Finals",
    detail: "31st in Italy out of 45,000+ participants.",
  },
  {
    year: "2022",
    title: "FIDE 1N Title — Chess",
    detail: "National chess title awarded by the Fédération Internationale des Échecs.",
  },
  {
    year: "2023",
    title: "High School Diploma — 100/100",
    detail: "IIS Jean Monnet, Como.",
  },
];

export const strengths = [
  "Market analysis",
  "Pattern recognition",
  "Product development",
  "Rapid iteration",
  "Data analysis & organisation",
  "Adaptability",
];
