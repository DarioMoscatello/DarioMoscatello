import type { Metadata } from "next";
import Image from "next/image";
import { NextLink, PageHead } from "@/components/PageHead";
import { projects } from "@/data/site";

export const metadata: Metadata = {
  title: "Projects",
  description: "BExams, a Bocconi exam-prep platform, and Hedels.",
};

export default function ProjectsPage() {
  return (
    <div className="page">
      <PageHead title="Projects" />

      <section>
        {projects.map((item) => (
          <article className="entry" key={item.title}>
            <div className="entry-period">
              {item.period}
              <span>{item.place}</span>
            </div>
            <div>
              {item.logo ? (
                <Image
                  className="logo"
                  src={item.logo.src}
                  alt={item.logo.alt}
                  width={item.logo.width}
                  height={item.logo.height}
                />
              ) : null}
              <h2>{item.title}</h2>
              <p className="entry-meta">{item.meta}</p>
              <ul className="points">
                {item.points.map((p) => (
                  <li key={p.slice(0, 24)}>{p}</li>
                ))}
              </ul>
              {item.link ? (
                <a
                  className="entry-link"
                  href={item.link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.link.label}
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      <NextLink href="/readings" label="Readings" />
    </div>
  );
}
