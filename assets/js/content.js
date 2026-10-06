/*
 * All the text and the card order of the site live here.
 *
 * Each section is a deck. The first card (head: true) is the one that sits
 * under the arrow when the section opens; the other cards follow in the order
 * written below. A card without `image` is drawn as an empty white card.
 *
 * Card fields (all optional except id):
 *   image     path of the card svg, relative to index.html
 *   title     big line in the text panel
 *   subtitle  role, degree, author...
 *   meta      short facts on one line (location, period, language)
 *   body      paragraphs
 *   facts     [label, value] pairs
 *   list      simple list (interests)
 *   links     [{ label, href }]
 *   me        true on the card with my portrait: the ME under the arrow shows only there
 */

export const CONFIG = {
  // Section shown when the page opens (unless the URL has a #hash).
  defaultSection: 'about',

  // 'fewer'     -> each section shows only its real cards.
  // 'duplicate' -> non-head cards repeat until the wheel holds `minCards`.
  fillMode: 'fewer',
  minCards: 10,

  // Idle rotation of the wheel. It stops for good at the first interaction.
  autoRotate: false,
  autoRotateEvery: 3.6, // seconds
};

const EMAIL = 'moscatello.dario@gmail.com';
const LINKS = [
  { label: EMAIL, href: `mailto:${EMAIL}` },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dario-moscatello' },
  { label: 'GitHub', href: 'https://github.com/DarioMoscatello' },
];

export const SECTIONS = [
  {
    id: 'about',
    label: 'About',
    cards: [
      {
        id: 'about',
        head: true,
        image: 'About/ABOUT_card_site_ready.svg',
        me: true,
        title: 'Dario Moscatello',
        meta: ['Based in Milano, Italy'],
        links: LINKS,
      },
      {
        id: 'introduction',
        image: 'About/INTRODUCTION_card_site_ready.svg',
        title: 'Introduction',
        body: [
          'I am studying Economics and Management at Bocconi University in Milan. Over the past few years, I have developed a strong interest in technology, artificial intelligence and building products with real-world impact.',
          'I am always open to ambitious projects, new ideas and opportunities at the intersection of business and technology.',
        ],
      },
      {
        id: 'interests',
        image: 'About/INTERESTS_card_site_ready.svg',
        title: 'Interests',
        list: [
          'Economics & Game Theory',
          'Real Estate and Architecture',
          'Tech',
          'Chess',
          'Exploring AI and Agents',
          'Reading',
        ],
      },
    ],
  },

  {
    id: 'education',
    label: 'Education',
    cards: [
      {
        id: 'education',
        head: true,
        image: 'Education/Education_card_site_ready.svg',
        title: 'Education',
      },
      {
        id: 'harvard',
        image: 'Education/HBS_card_site_ready.svg',
        title: 'Harvard Business School',
        subtitle: 'Student Researcher',
        meta: ['Cambridge, USA', 'Jul 2025 — Aug 2025'],
        body: [
          'Built a data-driven pharmaceutical API supply-chain tracker using data independently scraped from FDA sources.',
          'Developed global supplier mapping, risk indicators, resilience scoring, and interactive scenario analysis using Python, Streamlit, Pandas, and Plotly.',
        ],
        facts: [
          ['Supervisor', 'Prof. Michael Lingzhi Li'],
          ['Project', 'API Supply-Chain Tracker'],
        ],
      },
      {
        id: 'duke',
        image: 'Education/Duke_card_site_ready.svg',
        title: 'Duke University',
        subtitle: 'Student Researcher, The Polarization Lab',
        meta: ['Durham, USA', 'May 2025 — Jul 2025'],
        body: [
          'Developed an interactive and data-driven web application for the Duke Polarization Lab to analyze political polarization trends using complex political datasets and dynamic visualizations.',
          'Implemented front-end and back-end solutions using Streamlit, NumPy, Pandas, Plotly, and HoloViews.',
        ],
        facts: [
          ['Supervisors', 'Prof. Chris Bail, Sunshine Hillyguy and Alex Volfovsky'],
          ['Project', 'Data+ poster, Duke Polarization Lab'],
        ],
      },
      {
        id: 'bocconi',
        image: 'Education/Bocconi_card_site_ready_white.svg',
        title: 'Bocconi University',
        subtitle: 'BSc in Economics and Management',
        meta: ['Milan, Italy', '2023 — 2026'],
        body: [
          'Relevant coursework: Introduction to Blockchain, Venture and Development Capital, International & Monetary Economics, Statistics, Technology and Operations.',
          'Thesis: "Smart Cities in The Data-Driven Era", relator Prof. Gianmario Verona.',
          'Active member of the Bocconi Real Estate Club, BS for Hedge Funds, and the Ruy Lopez Chess Society.',
        ],
      },
      {
        id: 'jean-monnet',
        image: 'Education/Logo_card_black_site_ready.svg',
        title: 'IIS Jean Monnet',
        subtitle: 'Diploma in Administration, Finance and Marketing, 100/100',
        meta: ['Como, Italy', '2023'],
        body: ['Mathematics Olympiad team member, competing at national level.'],
        facts: [
          ['Coursework', 'Law, Political Economy, Business Administration, Financial Accounting, Financial Mathematics'],
        ],
      },
    ],
  },

  {
    id: 'work',
    label: 'Work',
    cards: [
      {
        id: 'work',
        head: true,
        image: 'Work/WORK_card_chrome_report_site_ready.svg',
        title: 'Work',
      },
      {
        id: 'copernicus',
        image: 'Work/Copernicus_card_site_ready_v3.svg',
        title: 'Copernicus',
        subtitle: 'Real Estate Analyst',
        meta: ['Milan, Italy', 'Mar 2026 — Sep 2026'],
        body: [
          'Conduct valuations and financial analysis of real estate-backed UTP and NPL positions, primarily within single-name portfolios.',
          'Build financial models, cash-flow forecasts and recovery scenarios to support credit and investment decisions.',
        ],
        facts: [['Additional education', 'Executive Programme in NPL Management @ Luiss Business School']],
      },
      {
        id: 'mrxshop',
        image: 'Work/Mask_logo_card_site_ready.svg',
        title: 'MrXShop',
        subtitle: 'Co-Founder, Crypto & Web3',
        meta: ['Milan, Italy', 'May 2019 — Oct 2022'],
        body: [
          'DeFi for everyone.',
          'Grew it to €100,000+ in revenue and a peak of 3000+ monthly clients, all of it before I turned eighteen.',
        ],
      },
    ],
  },

  {
    id: 'projects',
    label: 'Projects',
    cards: [
      {
        id: 'projects',
        head: true,
        image: 'Projects/PROJECTS_AI_exploded_site_ready.svg',
        title: 'Projects',
      },
      {
        id: 'bexams',
        image: 'Projects/BExams_card_site_ready.svg',
        title: 'BExams',
        subtitle: 'Founder',
        meta: ['Milan, Italy', '2025'],
        body: ['Founded a Bocconi exam-prep platform for practicing past exams by course and topic.'],
        links: [{ label: 'bexams.app', href: 'https://bexams.app' }],
      },
      {
        id: 'hedels',
        image: 'Projects/HEDELS_card_site_ready.svg',
        title: 'Hedels',
        subtitle: 'Founder',
        meta: ['Milan, Italy', '2026'],
        body: [
          'Hedels is Italy\u2019s largest real estate transaction database for hotels, student housing (PBSA) and care homes (RSA), covering 1,500+ deals.',
          'Clients include hedge funds, valuers and real estate companies looking for comparable deals to price assets.',
        ],
        links: [{ label: 'hedels.com', href: 'https://hedels.com' }],
      },
    ],
  },

  {
    id: 'readings',
    label: 'Readings',
    cards: [
      {
        id: 'readings',
        head: true,
        image: 'Readings/READINGS_vortex_site_ready.svg',
        title: 'Readings',
      },
      book('principles-changing-world-order', 'Principles for Dealing with the Changing World Order', 'Ray Dalio', 'English', 'Readings/Principles_card.svg'),
      book('selfish-gene', 'The Selfish Gene', 'Richard Dawkins', 'Italian', 'Readings/The_Selfish_Gene_card.svg'),
      book('zero-to-one', 'Zero to One', 'Peter Thiel', 'English', 'Readings/Zero_to_One_card_UK_flag_site_ready.svg'),
      book('manifesteeri', 'Manifesteeri', 'Roxie Nafousi', 'Estonian', 'Readings/Manifest_card.svg'),
      book('social-media-prism', 'Breaking the Social Media Prism', 'Chris Bail', 'English', 'Readings/Social_Media_Prism_card.svg'),
      book('black-swan', 'The Black Swan', 'Nassim Nicholas Taleb', 'English', 'Readings/The_Black_Swan_card.svg'),
      book('lotteria-dei-geni', 'La lotteria dei geni', 'Kathryn Paige Harden', 'Italian', 'Readings/La_lotteria_dei_geni_card.svg'),
      book('atomic-habits', 'Atomic Habits', 'James Clear', 'Italian', 'Readings/Atomic_Habits_card.svg'),
      book('formae-mentis', 'Formae mentis', 'Howard Gardner', 'Italian', 'Readings/Formae_mentis_card.svg'),
      book('il-management', 'Il management', 'Abraham Maslow', 'Italian', 'Readings/Il_management_card.svg'),
      book('arte-della-guerra', "L'arte della guerra", 'Sun Tzu', 'Italian', 'Readings/Arte_della_guerra_card.svg'),
      book('marco-aurelio', 'Meditazioni di Marco Aurelio', 'Jonas Weifeld', 'Italian', 'Readings/Meditazioni_card.svg'),
      book('gli-sforza', 'Gli Sforza', 'Carlo Maria Lomartire', 'Italian', 'Readings/Gli_Sforza_card.svg'),
      book('caterina-sforza', 'Caterina Sforza, Leonessa di Romagna', 'Marco Viroli', 'Italian', 'Readings/Caterina_Sforza_card.svg'),
      book('caterina-de-medici', "Caterina de' Medici", 'Alessandra Necci', 'Italian', 'Readings/Caterina_de_Medici_card.svg'),
      book('casa-dell-oppio', "La casa dell'oppio", 'Su Tong', 'Italian', 'Readings/La_casa_dell_oppio_card.svg'),
      book('intelligenza-emotiva', 'Intelligenza emotiva', 'Daniel Goleman', 'Italian', 'Readings/Intelligenza_emotiva_card.svg'),
      book('il-principe', 'Il Principe', 'Niccolò Machiavelli', 'Italian', 'Readings/Il_Principe_card.svg'),
      book('rockefeller', 'John D. Rockefeller, The Original Titan', 'JR MacGregor', 'Italian', 'Readings/Rockefeller_card.svg'),
      book('valutazione-immobiliare', 'Valutazione immobiliare', 'Giacomo Morri and Paolo Benedetto', 'Italian', 'Readings/Valutazione_immobiliare_card.svg'),
      book('inganno-dei-confini', "L'inganno dei confini", 'Simone Guida', 'Italian', 'Readings/Inganno_dei_confini_card.svg'),
    ],
  },

  {
    id: 'more',
    label: 'More',
    cards: [
      {
        id: 'more',
        head: true,
        image: 'More/MORE_open_index_site_ready.svg',
        title: 'More',
      },
      {
        id: 'languages',
        image: 'More/LANGUAGES_card.svg',
        title: 'Languages',
        list: ['Italian · Fluent', 'English · Fluent', 'Estonian · Fluent', 'German · B1', 'Spanish · B1'],
      },
      {
        id: 'chess',
        image: 'More/Horse_card_black_site_ready.svg',
        title: '2000+ Rated',
        subtitle: 'Chess lover',
      },
      {
        id: 'contact',
        image: 'More/Contact_social_card_site_ready.svg',
        title: 'Contact',
        meta: ['Milano, Italy'],
        links: LINKS,
      },
    ],
  },
];

function book(id, title, author, lang, image) {
  return { id, image, title, subtitle: author, meta: [lang] };
}

