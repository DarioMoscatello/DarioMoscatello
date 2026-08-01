import { NextLink } from "@/components/PageHead";
import { intro, interests, languages, profile, strengths } from "@/data/site";

export default function AboutPage() {
  return (
    <div className="page">
      <div className="stagger">
        <p className="eyebrow">01 — About</p>
        <h1 className="display">
          {profile.firstName}
          <em>{profile.lastName}</em>
        </h1>
        <p className="lede">{profile.tagline}</p>
        <div className="rule" />
        <div className="prose">
          {intro.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </div>

      <div className="rule" />

      <section>
        <p className="section-label">What I spend my time on</p>
        <ul className="plain-list">
          {interests.map((item) => (
            <li key={item}>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="rule" />

      <section>
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

      <section>
        <p className="section-label">Strengths</p>
        <div className="tags">
          {strengths.map((s) => (
            <span className="tag" key={s}>
              {s}
            </span>
          ))}
        </div>
      </section>

      <div className="rule" />

      <section>
        <p className="prose">
          Write to me at{" "}
          <a className="link" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          . I answer everything, and I like meeting people who are building
          something.
        </p>
        <NextLink href="/experience" label="Experience" />
      </section>
    </div>
  );
}
