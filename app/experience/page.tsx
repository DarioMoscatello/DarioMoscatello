import type { Metadata } from "next";
import { NextLink, PageHead } from "@/components/PageHead";
import { experience } from "@/data/site";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Real Estate Analyst at Copernicus RE Italia, project management at NOBE.ee in Tallinn, and four years co-founding MrXShop.",
};

export default function ExperiencePage() {
  return (
    <div className="page">
      <PageHead
        eyebrow="02 — Experience"
        title="Where I"
        accent="have worked"
        lede="Underwriting today, building since I was fifteen."
      />

      <section>
        {experience.map((job) => (
          <article className="entry" key={job.title}>
            <div className="entry-period">
              {job.period}
              <span>{job.place}</span>
            </div>
            <div>
              <h2>{job.title}</h2>
              <p className="entry-meta">{job.meta}</p>
              <ul className="points">
                {job.points.map((p) => (
                  <li key={p.slice(0, 24)}>{p}</li>
                ))}
              </ul>
              {job.tags ? (
                <div className="tags">
                  {job.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      <NextLink href="/research" label="Research" />
    </div>
  );
}
