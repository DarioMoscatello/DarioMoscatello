"use client";

import { useEffect, useMemo, useState } from "react";
import {
  awards,
  books,
  education,
  interests,
  intro,
  languages,
  profile,
  projects,
  work,
} from "@/data/site";

type Section = "About" | "Education" | "Work" | "Projects" | "Readings" | "More";

const orbitSections: Exclude<Section, "About">[] = [
  "Education",
  "Work",
  "Projects",
  "Readings",
  "More",
];

const orbitPositions = [
  { x: 17, y: 9 },
  { x: 67, y: 25 },
  { x: 84, y: 50 },
  { x: 67, y: 75 },
  { x: 17, y: 91 },
];

function compactEntry(entry: (typeof education)[number]) {
  return {
    institution: entry.title,
    role: entry.meta,
    location: entry.place,
    period: entry.period,
    details: entry.points,
    ...(entry.coursework ? { coursework: entry.coursework } : {}),
    ...(entry.note ? { note: entry.note } : {}),
  };
}

function dataFor(section: Section) {
  if (section === "About") {
    return {
      name: `${profile.firstName} ${profile.lastName}`,
      tagline: profile.tagline,
      based_in: `${profile.city}, ${profile.country}`,
      current: "Real Estate Analyst @ Copernicus",
      studies: "BSc Economics and Management @ Bocconi University",
      about: intro,
      interests,
    };
  }

  if (section === "Education") {
    return education.map(compactEntry);
  }

  if (section === "Work") {
    return {
      note: "Exploring the unknown... Building and selling since I was fifteen.",
      experience: work.map((entry) => ({
        company: entry.title,
        role: entry.meta,
        location: entry.place,
        period: entry.period,
        details: entry.points,
        ...(entry.note ? { note: entry.note } : {}),
      })),
    };
  }

  if (section === "Projects") {
    return projects.map((entry) => ({
      project: entry.title,
      role: entry.meta,
      location: entry.place,
      period: entry.period,
      details: entry.points,
      ...(entry.link ? { link: entry.link.href } : {}),
    }));
  }

  if (section === "Readings") {
    return books.map((book) => ({
      title: book.title,
      author: book.author,
      ...(book.language ? { language: book.language.toUpperCase() } : {}),
    }));
  }

  return {
    languages,
    chess: awards,
    contact: {
      email: profile.email,
      linkedin: profile.linkedin,
      github: profile.github,
    },
  };
}

function sectionCode(section: Section) {
  const variable = section.toLowerCase();
  const json = JSON.stringify(dataFor(section), null, 2);
  return [`export const ${variable} = ${json};`];
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function highlight(line: string) {
  const escaped = escapeHtml(line);
  return escaped
    .replace(/(&quot;.*?&quot;)(\s*:)/g, '<span class="tok-key">$1</span>$2')
    .replace(/(:\s*)(&quot;.*?&quot;)/g, '$1<span class="tok-string">$2</span>')
    .replace(/\b(export|const)\b/g, '<span class="tok-keyword">$1</span>')
    .replace(/\b(true|false|null)\b/g, '<span class="tok-literal">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="tok-number">$1</span>');
}

function GlassKey({ label, docked = false }: { label: string; docked?: boolean }) {
  return (
    <span className={`glass-key-visual${docked ? " docked" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 360 300" role="img" focusable="false">
        <defs>
          <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f6fbff" stopOpacity=".95" />
            <stop offset=".18" stopColor="#2cc7ff" stopOpacity=".98" />
            <stop offset=".42" stopColor="#194cff" stopOpacity=".86" />
            <stop offset=".62" stopColor="#ff2ba6" stopOpacity=".92" />
            <stop offset=".78" stopColor="#ff334d" stopOpacity=".88" />
            <stop offset="1" stopColor="#dff9ff" stopOpacity=".96" />
          </linearGradient>
          <linearGradient id="topGlass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#bdefff" stopOpacity=".19" />
            <stop offset=".23" stopColor="#0b0d18" stopOpacity=".76" />
            <stop offset=".48" stopColor="#11122a" stopOpacity=".54" />
            <stop offset=".72" stopColor="#09090d" stopOpacity=".84" />
            <stop offset="1" stopColor="#ff2d9d" stopOpacity=".2" />
          </linearGradient>
          <linearGradient id="leftGlass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1d7fff" stopOpacity=".36" />
            <stop offset=".45" stopColor="#03050b" stopOpacity=".7" />
            <stop offset=".78" stopColor="#ef236f" stopOpacity=".28" />
            <stop offset="1" stopColor="#f8ffff" stopOpacity=".34" />
          </linearGradient>
          <linearGradient id="frontGlass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#061841" stopOpacity=".72" />
            <stop offset=".35" stopColor="#07111f" stopOpacity=".8" />
            <stop offset=".66" stopColor="#fc1a82" stopOpacity=".28" />
            <stop offset="1" stopColor="#2d83ff" stopOpacity=".34" />
          </linearGradient>
          <filter id="blurGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="topClip">
            <polygon points="95,55 239,25 309,101 155,143" />
          </clipPath>
        </defs>

        <ellipse cx="185" cy="252" rx="132" ry="21" fill="#085cff" opacity=".22" filter="url(#blurGlow)" />
        <ellipse cx="230" cy="228" rx="83" ry="19" fill="#ff167f" opacity=".18" filter="url(#blurGlow)" />

        <polygon points="95,55 155,143 135,259 48,158" fill="url(#leftGlass)" stroke="url(#edge)" strokeWidth="3" />
        <polygon points="155,143 309,101 288,214 135,259" fill="url(#frontGlass)" stroke="url(#edge)" strokeWidth="3" />
        <polygon points="95,55 239,25 309,101 155,143" fill="url(#topGlass)" stroke="url(#edge)" strokeWidth="3.3" filter="url(#softGlow)" />

        <g clipPath="url(#topClip)" opacity=".88">
          <path d="M72 118 C132 69 194 126 258 42" fill="none" stroke="#1f71ff" strokeWidth="18" opacity=".42" filter="url(#blurGlow)" />
          <path d="M132 33 C189 89 233 45 321 88" fill="none" stroke="#ff135e" strokeWidth="12" opacity=".38" filter="url(#blurGlow)" />
          <path d="M83 88 C156 40 214 109 294 67" fill="none" stroke="#fbfeff" strokeWidth="2" opacity=".72" />
        </g>

        <polyline points="112,66 237,41 290,97 157,130 112,66" fill="none" stroke="#ffffff" strokeOpacity=".55" strokeWidth="1.2" />
        <polyline points="64,156 145,151 128,242" fill="none" stroke="#ff60c2" strokeOpacity=".38" strokeWidth="1.2" />
        <polyline points="164,154 295,117 279,201" fill="none" stroke="#57c7ff" strokeOpacity=".46" strokeWidth="1.2" />

        <path d="M74 151 L131 241" stroke="#e7fdff" strokeOpacity=".68" strokeWidth="2.2" />
        <path d="M296 111 L279 202" stroke="#ff55ba" strokeOpacity=".7" strokeWidth="2" />
        <path d="M103 56 L151 132" stroke="#67cfff" strokeOpacity=".74" strokeWidth="2" />

        <text
          x="198"
          y="95"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontFamily="IBM Plex Mono, ui-monospace, monospace"
          fontSize={label.length > 3 ? 24 : 29}
          letterSpacing="3.5"
          transform="rotate(-15 198 95)"
          style={{ textShadow: "0 0 12px rgba(255,255,255,.38)" }}
        >
          {label}
        </text>
      </svg>
    </span>
  );
}

function Editor({ section, onAbout }: { section: Section; onAbout: () => void }) {
  const lines = useMemo(() => sectionCode(section).join("\n").split("\n"), [section]);
  const projectLinks = section === "Projects" ? projects.filter((p) => p.link) : [];

  return (
    <section className="editor" aria-live="polite">
      <div className="editor-chrome">
        <button className={`editor-tab${section === "About" ? " active" : ""}`} onClick={onAbout}>
          <span className="tab-dot" />
          about.ts
        </button>
        {section !== "About" ? (
          <div className="editor-tab active static-tab">
            <span className="tab-dot" />
            {section.toLowerCase()}.ts
          </div>
        ) : null}
        <div className="editor-spacer" />
        <span className="chrome-meta">UTF-8</span>
        <span className="chrome-meta">TS</span>
      </div>

      <div className="editor-titlebar">
        <div>
          <span className="breadcrumb">portfolio</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb">data</span>
          <span className="breadcrumb-sep">/</span>
          <span>{section.toLowerCase()}.ts</span>
        </div>
        <div className="editor-title-right">
          <span>{String(lines.length).padStart(2, "0")} lines</span>
          <span className="blink-caret" aria-hidden="true" />
        </div>
      </div>

      <div className="code-scroll">
        <div className="code-sheet">
          {lines.map((line, index) => (
            <div className="code-line" key={`${section}-${index}`}>
              <span className="line-no">{index + 1}</span>
              <code dangerouslySetInnerHTML={{ __html: highlight(line) }} />
            </div>
          ))}
          <div className="code-line end-line" aria-hidden="true">
            <span className="line-no">{lines.length + 1}</span>
            <code>
              <span className="terminal-caret" />
            </code>
          </div>
        </div>
      </div>

      <div className="editor-status">
        <div className="status-links">
          <a href={`mailto:${profile.email}`}>MAIL</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">LINKEDIN</a>
          <a href={profile.github} target="_blank" rel="noreferrer">GITHUB</a>
          {projectLinks.map((project) => (
            <a key={project.title} href={project.link!.href} target="_blank" rel="noreferrer">
              {project.title.toUpperCase()} ↗
            </a>
          ))}
        </div>
        <div className="status-location">{profile.city.toUpperCase()} / {profile.country.toUpperCase()}</div>
      </div>
    </section>
  );
}

export default function PortfolioExperience() {
  const [entered, setEntered] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("About");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (entered || event.metaKey || event.ctrlKey || event.altKey) return;
      setEntered(true);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [entered]);

  const enter = () => setEntered(true);
  const exit = () => {
    setEntered(false);
    setActiveSection("About");
  };

  return (
    <main className={`experience${entered ? " is-entered" : ""}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="noise" aria-hidden="true" />

      <div className="home-state" aria-hidden={entered}>
        <button className="key-button start-button" onClick={enter} aria-label="Enter portfolio">
          <GlassKey label="START" />
        </button>
        <button className="enter-copy" onClick={enter}>CLICK TO ENTER<span className="copy-caret" /></button>
      </div>

      <div className="entered-state" aria-hidden={!entered}>
        <div className="key-dock">
          <button className="key-button esc-button" onClick={exit} aria-label="Return to start screen">
            <GlassKey label="ESC" docked />
          </button>
          <span className="esc-hint">CLICK ESC TO CLOSE</span>
        </div>

        <nav className="orbit-nav" aria-label="Portfolio sections">
          <svg className="orbit-arc" viewBox="0 0 360 560" preserveAspectRatio="none" aria-hidden="true">
            <path d="M 55 28 C 325 48 325 512 55 532" />
            <path className="orbit-arc-ghost" d="M 55 28 C 325 48 325 512 55 532" />
          </svg>
          <div className="orbit-axis" aria-hidden="true" />
          {orbitSections.map((section, index) => (
            <button
              key={section}
              className={`orbit-node${activeSection === section ? " active" : ""}`}
              style={{ left: `${orbitPositions[index].x}%`, top: `${orbitPositions[index].y}%` }}
              onClick={() => setActiveSection(section)}
            >
              <span className="node-core" />
              <span className="node-label">{section}</span>
            </button>
          ))}
          <button
            className={`about-anchor${activeSection === "About" ? " active" : ""}`}
            onClick={() => setActiveSection("About")}
          >
            ABOUT
          </button>
        </nav>

        <Editor section={activeSection} onAbout={() => setActiveSection("About")} />
      </div>
    </main>
  );
}
