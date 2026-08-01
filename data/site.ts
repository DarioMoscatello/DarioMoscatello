// ---------------------------------------------------------------------------
// Every piece of copy on the site lives here. Edit this file, not the pages.
// ---------------------------------------------------------------------------

export const profile = {
  firstName: "Dario",
  lastName: "Moscatello",
  tagline: "Analyst. Builder. Chess player.",
  city: "Milano",
  country: "Italy",
  email: "moscatello.dario@gmail.com",
  // TODO: paste your full LinkedIn URL here
  linkedin: "https://www.linkedin.com/in/dario-moscatello",
};

export const nav = [
  { label: "Education", href: "/education" },
  { label: "Work", href: "/work" },
  { label: "Projects", href: "/projects" },
  { label: "Awards", href: "/awards" },
];

export const intro = [
  "I study Economics and Management at Bocconi University, Milan. I currently work as a Real Estate Analyst at Copernicus RE Italia, pricing and underwriting UTP and NPL single names and portfolios — for our own fund, for other investment funds, and for banks.",
  "I spent the summer of 2025 in the US, building research tools at Duke and Harvard Business School. Before university I co-founded a Web3 shop and ran it for four years.",
];

export const interests = [
  "Distressed credit and special situations",
  "Real estate and architecture",
  "Chess and pattern recognition",
  "Running, golf, and the gym",
  "Reading",
];

export type Entry = {
  title: string;
  meta: string;
  place: string;
  period: string;
  points: string[];
  tags?: string[];
};

// ------------------------------------------------------------- education --
// Harvard and Duke sit at the top: most recent, and the reason the
// Projects page exists.

export const education: Entry[] = [
  {
    title: "Harvard Business School",
    meta: "Student Researcher",
    place: "Cambridge, USA",
    period: "Jul 2025 — Aug 2025",
    points: [
      "Built a global pharmaceutical API supply-chain tracker used for risk and resilience analysis.",
    ],
  },
  {
    title: "Duke University",
    meta: "Student Researcher — The Polarization Lab",
    place: "Durham, USA",
    period: "May 2025 — Jul 2025",
    points: [
      "Built an interactive application for analysing political polarization trends across complex datasets.",
    ],
  },
  {
    title: "Bocconi University",
    meta: "BSc in Economics and Management",
    place: "Milan, Italy",
    period: "2023 — 2026",
    points: [
      "Expected GPA: 3.8.",
      "Active member of the Bocconi Real Estate Club, BS for Hedge Funds, and the Ruy Lopez Chess Society.",
    ],
    tags: [
      "Management",
      "Macroeconomics",
      "Financial Accounting",
      "Statistics",
      "Critical Thinking",
      "Corporate Finance",
    ],
  },
  {
    title: "IIS Jean Monnet",
    meta: "Diploma in Administration, Finance and Marketing — 100/100",
    place: "Como, Italy",
    period: "2023",
    points: ["Mathematics Olympiad team member, competing at national level."],
    tags: [
      "Law",
      "Political Economy",
      "Business Administration",
      "Financial Accounting",
      "Financial Mathematics",
    ],
  },
];

// ------------------------------------------------------------------ work --

export const work: Entry[] = [
  {
    title: "Copernicus RE Italia Srl",
    meta: "Real Estate Analyst",
    place: "Milan, Italy",
    period: "Mar 2026 — Present",
    points: [
      "Pricing and underwriting of UTP and NPL single names and portfolios for Copernicus' own fund, for third-party investment funds, and for banks.",
      "Build the valuation case behind each position: collateral, recovery paths, timing, and the discount that makes the trade work.",
    ],
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
  },
];

// -------------------------------------------------------------- projects --

export const projects: Entry[] = [
  {
    title: "Global Pharma API Supply Chain Tracker",
    meta: "Harvard Business School",
    place: "Cambridge, USA",
    period: "2025",
    points: [
      "An application that maps the global pharmaceutical API supply chain — manufacturing sites, logistics routes, and market dependencies — in a single view.",
      "Models disruption scenarios, a major port closing for instance, to estimate inventory depletion timelines and the availability of essential medicines across affected regions.",
    ],
  },
  {
    title: "The Polarization Lab",
    meta: "Duke University",
    place: "Durham, USA",
    period: "2025",
    points: [
      "An interactive, data-driven web application built for Duke's Polarization Lab to analyse political polarization trends.",
      "Turned complex political datasets into dynamic visualizations researchers could explore themselves.",
    ],
  },
];

// ---------------------------------------------------------------- awards --

export const awards = [
  {
    year: "2022",
    title: "Mathematics Olympiad — Individual National Finals",
    detail: "31st in Italy out of 45,000+ participants.",
  },
  {
    year: "2022",
    title: "FIDE 1N Title — Chess",
    detail:
      "National title awarded by the Fédération Internationale des Échecs.",
  },
  {
    year: "2023",
    title: "High School Diploma — 100/100",
    detail: "IIS Jean Monnet, Como.",
  },
];
