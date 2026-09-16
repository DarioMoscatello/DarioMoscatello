import type { BrandKey } from "@/data/site";

type BrandMarkProps = {
  brand: BrandKey;
  className?: string;
};

const LABELS: Record<string, string> = {
  hbs: "Harvard Business School",
  harvard: "Harvard Business School",
  duke: "Duke University",
  bocconi: "Bocconi University",
  jeanmonnet: "IIS Jean Monnet",
  "jean-monnet": "IIS Jean Monnet",
  copernicus: "Copernicus",
};

export function BrandMark({ brand, className }: BrandMarkProps) {
  const key = String(brand).trim();
  const label = LABELS[key.toLowerCase()] ?? key;

  return (
    <span className={className} aria-label={label} title={label}>
      {label}
    </span>
  );
}

export default BrandMark;
