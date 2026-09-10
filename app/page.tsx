import ParticleOrbit from "@/components/ParticleOrbit";
import { intro, interests, profile } from "@/data/site";

export default function AboutPage() {
  return (
    <div className="page home-page">
      <section className="home-hero">
        <div className="visual-column">
          <ParticleOrbit />
        </div>

        <div className="home-copy stagger">
          <h1 className="home-title">I am</h1>
          <p className="home-name">
            {profile.firstName} {profile.lastName}
          </p>

          <div className="home-intro">
            {intro.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <div className="home-interests" data-interactive>
            <h2>Some of my interests</h2>
            <ul>
              {interests.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="home-links">
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={`mailto:${profile.email}`}>Email</a>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        Based in {profile.city}, {profile.country}
      </footer>
    </div>
  );
}
