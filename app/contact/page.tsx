import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { profile } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${profile.firstName} ${profile.lastName} — ${profile.email}`,
};

export default function ContactPage() {
  return (
    <div className="page">
      <PageHead
        eyebrow="06 — Contact"
        title="Say"
        accent="ciao"
        lede="Deals, research, chess, or a coffee in Milan — I answer everything."
      />

      <section className="prose">
        <p>
          <a className="mailto" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </p>
      </section>

      <div className="rule" />

      <section>
        <p className="section-label">Elsewhere</p>
        <ul className="plain-list">
          <li>
            <a
              className="link"
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <span className="right">Professional</span>
          </li>
          <li>
            <a className="link" href={`mailto:${profile.email}`}>
              Email
            </a>
            <span className="right">Fastest</span>
          </li>
        </ul>
      </section>

      <div className="rule" />

      <p className="coursework">
        <b>Based in — </b>
        {profile.city}, {profile.country} · {profile.coordinates}
      </p>
    </div>
  );
}
