import type { Metadata } from "next";
import { NextLink, PageHead } from "@/components/PageHead";
import { projects } from "@/data/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A global pharmaceutical supply-chain tracker built at Harvard Business School, and a polarization analysis application built at Duke.",
};

export default function ProjectsPage() {
  return (
    <div className="page">
      <PageHead
        title="Projects"
        subtitle="Built during the summer of 2025"
        lede="Two applications that turn unwieldy datasets into something you can actually interrogate."
      />

      <section>
        {projects.map((item) => (
          <article className="entry" key={item.title}>
            <div className="entry-period">
              {item.period}
              <span>{item.place}</span>
            </div>
            <div>
              <h2>{item.title}</h2>
              <p className="entry-meta">{item.meta}</p>
              <ul className="points">
                {item.points.map((p) => (
                  <li key={p.slice(0, 24)}>{p}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      <NextLink href="/awards" label="Awards" />
    </div>
  );
}
