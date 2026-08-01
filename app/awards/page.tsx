import type { Metadata } from "next";
import { NextLink, PageHead } from "@/components/PageHead";
import { awards } from "@/data/site";

export const metadata: Metadata = {
  title: "Awards",
  description:
    "Mathematics Olympiad national finalist, FIDE 1N chess title, and a 100/100 high school diploma.",
};

export default function AwardsPage() {
  return (
    <div className="page">
      <PageHead
        title="Awards"
        subtitle="Chess and mathematics"
        lede="Mostly proof that I enjoy problems with a clock attached."
      />

      <section>
        {awards.map((a) => (
          <article className="entry" key={a.title}>
            <div className="entry-period">{a.year}</div>
            <div>
              <h2>{a.title}</h2>
              <p className="coursework" style={{ marginTop: 10 }}>
                {a.detail}
              </p>
            </div>
          </article>
        ))}
      </section>

      <NextLink href="/" label="Back to the start" />
    </div>
  );
}
