import Link from "next/link";
import { NextLink } from "@/components/PageHead";
import { intro, interests, profile } from "@/data/site";

export default function AboutPage() {
  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-copy stagger">
          <p className="eyebrow">Portfolio / {profile.city} / 2026</p>
          <h1 className="hero-title">
            <span>Dario</span>
            <span className="hero-title-accent">Moscatello</span>
          </h1>
          <p className="hero-lede">
            Real estate, finance and technology—brought together to build what
            comes next.
          </p>
          <div className="hero-actions">
            <Link className="primary-action" href="/work">
              Explore my work <span aria-hidden="true">↗</span>
            </Link>
            <a className="text-action" href={`mailto:${profile.email}`}>
              Start a conversation
            </a>
          </div>
        </div>

        <div className="hero-object" data-interactive>
          <svg viewBox="0 0 520 520" aria-hidden="true">
            <defs>
              <linearGradient id="heroEdge" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#b57aff" />
                <stop offset=".48" stopColor="#5624ae" stopOpacity=".25" />
                <stop offset="1" stopColor="#8e48ff" />
              </linearGradient>
              <radialGradient id="heroFace">
                <stop offset="0" stopColor="#09070e" stopOpacity=".25" />
                <stop offset="1" stopColor="#6b2ad4" stopOpacity=".22" />
              </radialGradient>
            </defs>
            <polygon className="hero-polygon" points="260,20 410,83 495,232 454,393 304,495 135,455 25,313 70,142" fill="url(#heroFace)" stroke="url(#heroEdge)" />
            <path className="hero-facet" d="M260 20 303 142l107-59-55 146 140 3-126 91 85 70-150 102-44-151-125 111 48-146L25 313l137-86L70 142l149 24 41-146Z" fill="none" stroke="url(#heroEdge)" />
            <circle cx="260" cy="260" r="135" fill="none" stroke="#a35bff" strokeOpacity=".18" />
          </svg>
          <div className="hero-object-core">
            <span className="core-monogram">DM</span>
            <span className="core-line" />
            <strong>Dreamer.<br /><em>Builder.</em></strong>
          </div>
          <span className="object-coordinate coordinate-a">45.4642° N</span>
          <span className="object-coordinate coordinate-b">09.1900° E</span>
        </div>
      </section>

      <section className="home-grid">
        <article className="glass-panel about-panel" data-interactive>
          <p className="section-label">01 / About</p>
          <div className="prose">
            {intro.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </article>

        <article className="glass-panel signal-panel" data-interactive>
          <p className="section-label">02 / Current signal</p>
          <div className="signal-item">
            <span>Working</span>
            <strong>RE Analyst / Copernicus</strong>
          </div>
          <div className="signal-item">
            <span>Studying</span>
            <strong>Economics / Bocconi</strong>
          </div>
          <div className="signal-item">
            <span>Building</span>
            <strong>BExams / Hedels</strong>
          </div>
        </article>

        <article className="glass-panel interests-panel" data-interactive>
          <p className="section-label">03 / Interests</p>
          <ul className="interest-cloud">
            {interests.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="glass-panel contact-panel" data-interactive>
          <p className="section-label">04 / Connect</p>
          <p>Have an ambitious idea at the intersection of capital and technology?</p>
          <a className="mailto" href={`mailto:${profile.email}`}>
            {profile.email}<span aria-hidden="true">↗</span>
          </a>
        </article>
      </section>

      <NextLink href="/education" label="Education" />
    </div>
  );
}
