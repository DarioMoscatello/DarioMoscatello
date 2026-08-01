import type { Metadata } from "next";
import { NextLink, PageHead } from "@/components/PageHead";
import { research } from "@/data/site";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Student research at Harvard Business School and Duke University: a global pharmaceutical supply-chain tracker and a polarization analysis application.",
};

export default function ResearchPage() {
  return (
    <div className="page">
      <PageHead
        eyebrow="03 — Research"
        title="Things I"
        accent="built to think with"
        lede="Two summers in the US, two applications that turned messy data into something you can actually interrogate."
      />

      <section>
        {research.map((item) => (
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

      <NextLink href="/education" label="Education" />
    </div>
  );
}
