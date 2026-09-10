import Link from "next/link";
import GlassPrism from "@/components/GlassPrism";
import { intro, interests, profile } from "@/data/site";

export default function AboutPage() {
  return (
    <div className="page home-page">
      <section className="launch">
        <div className="launch-backdrop" aria-hidden="true">
          DARIO
        </div>

        <div className="launch-copy stagger">
          <p className="launch-role">Real estate analyst and builder</p>
          <h1>
            Ideas become
            <span>assets.</span>
          </h1>
          <p className="launch-lede">
            Finance, real estate and technology brought together with a bias
            toward building.
          </p>
          <Link className="launch-link" href="#about">
            Discover more <span aria-hidden="true">↓</span>
          </Link>
        </div>

        <GlassPrism />

        <div className="launch-aside">
          <span>{profile.city}, {profile.country}</span>
          <span>Economics at Bocconi</span>
        </div>
      </section>

      <section className="profile-section" id="about">
        <div className="profile-heading">
          <p>About</p>
          <h2>
            Curious about how capital,
            <br />
            places and technology connect.
          </h2>
        </div>

        <div className="profile-body" data-interactive>
          {intro.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="interest-section" data-interactive>
        <h2>Interests</h2>
        <ul>
          {interests.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <footer className="site-footer">
        <span>{profile.firstName} {profile.lastName}</span>
        <div>
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={`mailto:${profile.email}`}>Email</a>
        </div>
      </footer>
    </div>
  );
}
