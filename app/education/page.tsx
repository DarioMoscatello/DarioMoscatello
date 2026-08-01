import type { Metadata } from "next";
import { NextLink, PageHead } from "@/components/PageHead";
import { education } from "@/data/site";

export const metadata: Metadata = {
  title: "Education",
  description:
    "BSc in Economics and Management at Bocconi University, Milan. High school diploma in Administration, Finance and Marketing at IIS Jean Monnet, Como.",
};

export default function EducationPage() {
  return (
    <div className="page">
      <PageHead
        eyebrow="04 — Education"
        title="Where I"
        accent="learned it"
        lede="Milan and Como, plus the summers spent in American research labs."
      />

      <section>
        {education.map((school) => (
          <article className="entry" key={school.school}>
            <div className="entry-period">
              {school.period}
              <span>{school.place}</span>
            </div>
            <div>
              <h2>{school.school}</h2>
              <p className="entry-meta">{school.degree}</p>
              <ul className="points">
                {school.notes.map((n) => (
                  <li key={n.slice(0, 24)}>{n}</li>
                ))}
              </ul>
              <p className="coursework">
                <b>Coursework — </b>
                {school.coursework}
              </p>
            </div>
          </article>
        ))}
      </section>

      <div className="next-links">
        <NextLink href="/research" label="Research at Harvard and Duke" />
        <NextLink href="/awards" label="Awards" />
      </div>
    </div>
  );
}
