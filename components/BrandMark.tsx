import type { BrandKey } from "@/data/site";

const LABELS: Record<BrandKey, string> = {
  hbs: "Harvard Business School",
  duke: "Duke University",
  bocconi: "Bocconi University",
  jeanmonnet: "IIS Jean Monnet",
  copernicus: "Copernicus",
  mrxshop: "MrXShop",
};

function Symbol({ brand }: { brand: BrandKey }) {
  if (brand === "hbs") {
    return (
      <svg viewBox="0 0 48 56" aria-hidden="true">
        <path d="M4 3h40v31c0 9-8 15-20 19C12 49 4 43 4 34V3Z" fill="#A51C30" />
        <path d="M10 12h8v9h-8zm10 0h8v9h-8zm10 0h8v9h-8zM10 25h28v4H10z" fill="#fff" />
        <path d="M14 35h20M17 40h14" stroke="#fff" strokeWidth="2" />
      </svg>
    );
  }

  if (brand === "copernicus") {
    return (
      <svg viewBox="0 0 56 56" aria-hidden="true">
        <circle cx="28" cy="28" r="7" fill="currentColor" />
        <ellipse cx="28" cy="28" rx="22" ry="10" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(-28 28 28)" />
        <ellipse cx="28" cy="28" rx="22" ry="10" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(35 28 28)" />
      </svg>
    );
  }

  const letters: Record<Exclude<BrandKey, "hbs" | "copernicus">, string> = {
    duke: "D",
    bocconi: "B",
    jeanmonnet: "JM",
    mrxshop: "X",
  };

  return <span aria-hidden="true">{letters[brand]}</span>;
}

export default function BrandMark({ brand }: { brand: BrandKey }) {
  return (
    <div className={`brand-lockup brand-${brand}`} aria-label={LABELS[brand]}>
      <div className="brand-symbol">
        <Symbol brand={brand} />
      </div>
      <span className="brand-name">{LABELS[brand]}</span>
    </div>
  );
}
