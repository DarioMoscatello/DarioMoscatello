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
  github: "https://github.com/DarioMoscaBC",
};

export const nav = [
  { label: "About", href: "/" },
  { label: "Education", href: "/education" },
  { label: "Work", href: "/work" },
  { label: "Projects", href: "/projects" },
  { label: "Readings", href: "/readings" },
  { label: "More", href: "/more" },
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
  // Kept optional for backwards compatibility with earlier page components
  // that rendered an institution/company brand mark.
  brand?: string;
  note?: string;
  coursework?: string;
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
      "Thesis: \"Smart Cities in The Data-Driven Era\", relator Prof. Gianmario Verona.",
      "Active member of the Bocconi Real Estate Club, BS for Hedge Funds, and the Ruy Lopez Chess Society.",
    ],
  },
  {
    title: "IIS Jean Monnet",
    meta: "Diploma in Administration, Finance and Marketing — 100/100",
    place: "Como, Italy",
    period: "2023",
    points: ["Mathematics Olympiad team member, competing at national level."],
    coursework:
      "Law, Political Economy, Business Administration, Financial Accounting, Financial Mathematics",
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
    meta: "Co-Founder — Crypto & Web3",
    place: "Milan, Italy",
    period: "May 2019 — Oct 2022",
    points: [
      "Grew it to €100,000+ in revenue and a peak of 3000+ monthly clients — all of it before I turned eighteen.",
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
    meta: "Founder",
    place: "Milan, Italy",
    period: "2026",
    points: ["..."],
    link: { label: "Hedels.com", href: "https://hedels.com" },
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
  // language the book was read in — drives the flag next to the title
  language?: "it" | "en" | "ee";
};

export const books: Book[] = [
  {
    title: "Principles for Dealing with the Changing World Order",
    author: "Ray Dalio",
    cover: "/books/changing-world-order.jpg",
    width: 760,
    height: 1154,
    language: "en",
  },
  {
    title: "The Selfish Gene",
    author: "Richard Dawkins",
    cover: "/books/selfish-gene.jpg",
    width: 657,
    height: 1000,
    language: "it",
  },
  {
    title: "Zero to One",
    author: "Peter Thiel",
    cover: "/books/zero-to-one.jpg",
    width: 760,
    height: 1193,
    language: "en",
  },
  {
    title: "Manifesteeri",
    author: "Roxie Nafousi",
    cover: "/books/manifesteeri.jpg",
    width: 760,
    height: 1140,
    language: "ee",
  },
  {
    title: "Breaking the Social Media Prism",
    author: "Chris Bail",
    cover: "/books/breaking-social-media-prism.jpg",
    width: 647,
    height: 1000,
    language: "en",
  },
  {
    title: "The Black Swan",
    author: "Nassim Nicholas Taleb",
    cover: "/books/black-swan.jpg",
    width: 700,
    height: 1065,
    language: "en",
  },
  {
    title: "La lotteria dei geni",
    author: "Kathryn Paige Harden",
    cover: "/books/lotteria-dei-geni.jpg",
    width: 700,
    height: 1050,
    language: "it",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    cover: "/books/atomic-habits.jpg",
    width: 700,
    height: 1066,
    language: "it",
  },
  {
    title: "Formae mentis",
    author: "Howard Gardner",
    cover: "/books/formae-mentis.jpg",
    width: 700,
    height: 1077,
    language: "it",
  },
  {
    title: "Il management",
    author: "Abraham Maslow",
    cover: "/books/il-management.jpg",
    width: 700,
    height: 1050,
    language: "it",
  },
  {
    title: "L'arte della guerra",
    author: "Sun Tzu",
    cover: "/books/arte-della-guerra.jpg",
    width: 650,
    height: 1000,
    language: "it",
  },
  {
    title: "Meditazioni di Marco Aurelio",
    author: "Jonas Weifeld",
    cover: "/books/meditazioni.jpg",
    width: 687,
    height: 1100,
    language: "it",
  },
  {
    title: "Gli Sforza",
    author: "Carlo Maria Lomartire",
    cover: "/books/gli-sforza.jpg",
    width: 664,
    height: 1000,
    language: "it",
  },
  {
    title: "Caterina Sforza — Leonessa di Romagna",
    author: "Marco Viroli",
    cover: "/books/caterina-sforza.jpg",
    width: 700,
    height: 993,
    language: "it",
  },
  {
    title: "Caterina de' Medici",
    author: "Alessandra Necci",
    cover: "/books/caterina-de-medici.jpg",
    width: 651,
    height: 1000,
    language: "it",
  },
  {
    title: "La casa dell'oppio",
    author: "Su Tong",
    cover: "/books/casa-dell-oppio.jpg",
    width: 620,
    height: 1000,
    language: "it",
  },
];

// ------------------------------------------------------------------ more --

export const languages = [
  { name: "Italian", level: "Fluent" },
  { name: "English", level: "Fluent" },
  { name: "Estonian", level: "Fluent" },
  { name: "German", level: "B2" },
  { name: "Spanish", level: "B1" },
];

export const awards = [
  {
    year: "2022",
    title: "FIDE 1N Title — Chess",
    detail:
      "National title awarded by the Fédération Internationale des Échecs.",
  },
];
