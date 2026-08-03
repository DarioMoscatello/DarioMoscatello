// ---------------------------------------------------------------------------
// Every piece of copy on the site lives here. Edit this file, not the pages.
// ---------------------------------------------------------------------------

export const profile = {
  firstName: "Dario",
  lastName: "Moscatello",
  tagline: "Dreamer · Thinker · Builder",
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
  { label: "Readings", href: "/readings" },
  { label: "Awards", href: "/awards" },
];

export const intro = [
  "I am studying Economics and Management at Bocconi University in Milan. Real estate has always been my greatest love, and I currently work as a RE Analyst at Copernicus.",
  "Over the past few years, I have also developed a strong interest in technology and its potential to transform the real estate industry. My ambition is to combine finance, technology and innovation to build something meaningful and create lasting value.",
];

export const interests = [
  "Economics & Game Theory",
  "Real Estate and architecture",
  "Chess",
  "Exploring AI and agents",
  "Reading",
];

export type Media = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export type Entry = {
  title: string;
  meta: string;
  place: string;
  period: string;
  points: string[];
  note?: string;
  image?: Media;
  logo?: Media;
  link?: { label: string; href: string };
};

// ------------------------------------------------------------- education --

export const education: Entry[] = [
  {
    title: "Harvard Business School",
    meta: "Student Researcher",
    place: "Cambridge, USA",
    period: "Jul 2025 — Aug 2025",
    points: [
      "Built a data-driven pharmaceutical API supply-chain tracker using data independently scraped from FDA sources.",
      "Developed global supplier mapping, risk indicators, resilience scoring, and interactive scenario analysis using Python, Streamlit, Pandas, and Plotly.",
    ],
    note: "Supervisor: Prof. Michael Lingzhi Li",
    image: {
      src: "/media/hbs-supply-chain-tracker.jpg",
      alt: "API Supply-Chain Tracker — risk and resilience overview dashboard",
      width: 1672,
      height: 941,
      caption: "API Supply-Chain Tracker",
    },
  },
  {
    title: "Duke University",
    meta: "Student Researcher — The Polarization Lab",
    place: "Durham, USA",
    period: "May 2025 — Jul 2025",
    points: [
      "Developed an interactive and data-driven web application for the Duke Polarization Lab to analyze political polarization trends using complex political datasets and dynamic visualizations.",
      "Implemented front-end and back-end solutions using Streamlit, NumPy, Pandas, Plotly, and HoloViews.",
    ],
    note: "Supervisors: Prof. Chris Bail, Sunshine Hillyguy and Alex Volfovsky",
    image: {
      src: "/media/duke-polarization-lab.jpg",
      alt: "Research poster — Visualizing polarization in American public opinion",
      width: 1448,
      height: 1086,
      caption: "Data+ poster, Duke Polarization Lab",
    },
  },
  {
    title: "Bocconi University",
    meta: "BSc in Economics and Management",
    place: "Milan, Italy",
    period: "2023 — 2026",
    points: [
      "Relevant coursework: Introduction to Blockchain 30, Venture and Development Capital 30L, International & Monetary Economics 30, Statistics 30L, Technology and Operations 30.",
      "Active member of the Bocconi Real Estate Club, BS for Hedge Funds, and the Ruy Lopez Chess Society.",
    ],
  },
  {
    title: "IIS Jean Monnet",
    meta: "Diploma in Administration, Finance and Marketing — 100/100",
    place: "Como, Italy",
    period: "2023",
    points: ["Mathematics Olympiad team member, competing at national level."],
  },
];

// ------------------------------------------------------------------ work --

export const work: Entry[] = [
  {
    title: "Copernicus",
    meta: "Real Estate Analyst",
    place: "Milan, Italy",
    period: "Mar 2026 — Present",
    points: [
      "Conduct valuations and financial analysis of real estate-backed UTP and NPL positions, primarily within single-name portfolios.",
      "Build financial models, cash-flow forecasts and recovery scenarios to support credit and investment decisions.",
    ],
    note: "Attended: Executive Programme in NPL Management @ Luiss Business School",
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
    title: "BExams",
    meta: "Founder",
    place: "Milan, Italy",
    period: "2025",
    points: [
      "Founded a Bocconi exam-prep platform for practicing past exams by course and topic.",
    ],
    link: { label: "bexams.app", href: "https://bexams.app" },
    logo: {
      src: "/media/bexams-logo.png",
      alt: "B.Exams",
      width: 544,
      height: 146,
    },
  },
  {
    title: "Hedels",
    meta: "In progress",
    place: "Milan, Italy",
    period: "2026",
    points: ["..."],
    logo: {
      src: "/media/hedels-logo.png",
      alt: "Hedels",
      width: 620,
      height: 279,
    },
  },
];

// -------------------------------------------------------------- readings --
// To add a book: drop the cover in /public/books and add an entry here.

export type Book = {
  title: string;
  author: string;
  cover?: string;
  width?: number;
  height?: number;
};

export const books: Book[] = [
  {
    title: "Principles for Dealing with the Changing World Order",
    author: "Ray Dalio",
    cover: "/books/changing-world-order.jpg",
    width: 760,
    height: 1154,
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
];
