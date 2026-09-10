import type { Metadata } from "next";
import { NextLink, PageHead } from "@/components/PageHead";
import { awards, languages } from "@/data/site";

export const metadata: Metadata = {
  description: "Languages spoken and a FIDE chess title.",
};

export default function MorePage() {
  return (
    <div className="page">
      <PageHead title="More" />

      <section className="glass-panel compact-panel" data-interactive>
        <p className="section-label">Languages</p>
        <ul className="plain-list">
          {languages.map((l) => (
            <li key={l.name}>
              <span>{l.name}</span>
              <span className="right">{l.level}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="rule" />

      <section className="glass-panel compact-panel" data-interactive>
        <p className="section-label">Chess</p>
        {awards.map((a) => (
          <article className="entry embedded-entry" key={a.title}>
            <div className="entry-period">{a.year}</div>
            <div>
              <h2>{a.title}</h2>
              <p className="entry-note" style={{ marginTop: 10 }}>
                {a.detail}
              </p>
            </div>
          </article>
        ))}
      </section>

      <NextLink href="/" label="Back to the start" />
    </div>
  );
}
