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

      <section>
        <p className="section-label">Let&rsquo;s keep in touch</p>
        <a className="mailto" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
      </section>
    </div>
  );
}
