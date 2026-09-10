import Link from "next/link";

export function PageHead({
  title,
  subtitle,
  lede,
  wideLede,
}: {
  title: string;
  subtitle?: string;
  lede?: string;
  wideLede?: boolean;
}) {
  return (
    <header className="page-head stagger">
      <p className="eyebrow">Selected chapter / {title}</p>
      <h1 className="display">{title}</h1>
      {subtitle ? <p className="subtitle">{subtitle}</p> : null}
      {lede ? (
        <p className={wideLede ? "lede lede-wide" : "lede"}>{lede}</p>
      ) : null}
      <div className="rule" />
    </header>
  );
}

export function NextLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="next-link">
      <span>Continue to {label}</span>
      <span className="next-orb" aria-hidden="true">↗</span>
    </Link>
  );
}
