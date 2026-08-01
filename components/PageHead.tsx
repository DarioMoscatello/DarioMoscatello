import Link from "next/link";

export function PageHead({
  eyebrow,
  title,
  accent,
  lede,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  lede?: string;
}) {
  return (
    <div className="stagger">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="display">
        {title}
        {accent ? <em>{accent}</em> : null}
      </h1>
      {lede ? <p className="lede">{lede}</p> : null}
      <div className="rule" />
    </div>
  );
}

export function NextLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="next-link">
      <span aria-hidden="true">→</span>
      {label}
    </Link>
  );
}
