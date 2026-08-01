import { NextLink } from "@/components/PageHead";

export default function NotFound() {
  return (
    <div className="page">
      <div className="stagger">
        <p className="eyebrow">404 — Not found</p>
        <h1 className="display">
          Nothing
          <em>at this address</em>
        </h1>
        <p className="lede">
          The page you asked for does not exist. The panel on the left still
          works.
        </p>
        <div className="rule" />
      </div>
      <NextLink href="/" label="Back to the start" />
    </div>
  );
}
