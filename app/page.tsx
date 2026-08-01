import { NextLink } from "@/components/PageHead";
import { intro, interests, profile } from "@/data/site";

export default function AboutPage() {
  return (
    <div className="page">
      <div className="stagger">
        <h1 className="display">I am</h1>
        <p className="subtitle">
          {profile.firstName} {profile.lastName}
        </p>
        <div className="rule" />
        <div className="prose">
          {intro.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </div>

      <div className="rule" />

      <section>
        <p className="section-label">Some of my interests</p>
        <ul className="plain-list">
          {interests.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="rule" />

      <section className="prose">
        <p>
          Write to me at{" "}
          <a className="link" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          . I answer everything, and I like meeting people who are building
          something.
        </p>
        <NextLink href="/education" label="Education" />
      </section>
    </div>
  );
}
