import type { Metadata } from "next";
import Image from "next/image";
import Flag from "@/components/Flag";
import { NextLink, PageHead } from "@/components/PageHead";
import { books } from "@/data/site";

export const metadata: Metadata = {
  title: "Readings",
  description: "The shelf — books worth the time.",
};

export default function ReadingsPage() {
  return (
    <div className="page">
      <PageHead title="Readings" subtitle="The shelf" />

      <section className="shelf">
        {books.map((book) => (
          <div key={book.title}>
            <div className="book-cover">
              {book.cover ? (
                <Image
                  src={book.cover}
                  alt={`${book.title} — ${book.author}`}
                  width={book.width ?? 760}
                  height={book.height ?? 1140}
                  sizes="(max-width: 860px) 33vw, 160px"
                />
              ) : (
                <div className="book-spine">{book.title}</div>
              )}
            </div>
            <p className="book-title">
              {book.title}
              {book.language ? <Flag lang={book.language} /> : null}
            </p>
            <p className="book-author">{book.author}</p>
          </div>
        ))}
      </section>

      <NextLink href="/awards" label="Awards" />
    </div>
  );
}
