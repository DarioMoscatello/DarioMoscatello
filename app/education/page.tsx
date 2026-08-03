import type { Metadata } from "next";
import { NextLink, PageHead } from "@/components/PageHead";
import Plate from "@/components/Plate";
import { education } from "@/data/site";

export const metadata: Metadata = {
  title: "Education",
  description:
    "Student research at Harvard Business School and Duke University, BSc in Economics and Management at Bocconi, diploma at IIS Jean Monnet.",
};

export default function EducationPage() {
  return (
    <div className="page">
      <PageHead
        title="Education"
        subtitle="Cambridge, Durham, Milan, Como"
        lede="Two American research labs, one Italian business school, and the school in Como where the maths started."
      />

      <section>
        {education.map((item) => (
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
              {item.note ? <p className="entry-note">{item.note}</p> : null}
              {item.image ? <Plate media={item.image} /> : null}
            </div>
          </article>
        ))}
      </section>

      <NextLink href="/work" label="Work" />
    </div>
  );
}
