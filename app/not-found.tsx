import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found-code">404<span className="terminal-caret" /></div>
      <p>Nothing at this address.</p>
      <Link href="/">RETURN_HOME</Link>
    </main>
  );
}
