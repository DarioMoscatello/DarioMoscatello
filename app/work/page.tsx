import type { Metadata } from "next";
import { NextLink, PageHead } from "@/components/PageHead";
import { work } from "@/data/site";

export const metadata: Metadata = {
  description:
    "Real Estate Analyst at Copernicus, valuing real estate-backed UTP and NPL positions. Previously co-founder of MrXShop.",
};

export default function WorkPage() {
  return (
    <div className="page">
      <PageHead
        title="Work"
        subtitle="Milan, Tallinn"
        lede="Exploring the unknown... Building and selling since I was fifteen."
        wideLede
      />

      <section>
        {work.map((job) => (
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
              {job.note ? <p className="entry-note">{job.note}</p> : null}
            </div>
          </article>
        ))}
      </section>

      <NextLink href="/projects" label="Projects" />
    </div>
  );
}
