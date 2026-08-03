const LABELS = {
  it: "Read in Italian",
  en: "Read in English",
  ee: "Read in Estonian",
} as const;

export type Lang = keyof typeof LABELS;

function Shape({ lang }: { lang: Lang }) {
  if (lang === "it") {
    return (
      <svg viewBox="0 0 60 40" aria-hidden="true">
        <rect width="20" height="40" fill="#008C45" />
        <rect x="20" width="20" height="40" fill="#F4F5F0" />
        <rect x="40" width="20" height="40" fill="#CD212A" />
      </svg>
    );
  }

  if (lang === "ee") {
    return (
      <svg viewBox="0 0 60 40" aria-hidden="true">
        <rect width="60" height="13.34" fill="#0072CE" />
        <rect y="13.34" width="60" height="13.33" fill="#111111" />
        <rect y="26.67" width="60" height="13.33" fill="#FFFFFF" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 60 40" aria-hidden="true">
      <rect width="60" height="40" fill="#012169" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#FFFFFF" strokeWidth="8" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 V40 M0,20 H60" stroke="#FFFFFF" strokeWidth="13" />
      <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="8" />
    </svg>
  );
}

export default function Flag({ lang }: { lang: Lang }) {
  const label = LABELS[lang];
  return (
    <span className="flag" data-tip={label} tabIndex={0} role="img" aria-label={label}>
      <Shape lang={lang} />
    </span>
  );
}
