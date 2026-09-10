"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, profile } from "@/data/site";
import ThemeToggle from "@/components/ThemeToggle";

function Buttons({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="panel" aria-label="Main">
      {nav.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="nav-row"
            data-active={active}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
          >
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Foot() {
  return (
    <div className="rail-foot">
      <div className="rail-links">
        <a href={`mailto:${profile.email}`}>Email</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href={profile.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
      <div>
        {profile.city}, {profile.country} · 2026
      </div>
    </div>
  );
}

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* desktop rail */}
      <aside className="rail">
        <div className="brand-cluster">
          <ThemeToggle />
          <Link href="/" className="wordmark" aria-label="Home">
            <div className="wordmark-copy">
              <div className="wordmark-name">
                {profile.firstName} {profile.lastName}
              </div>
              <div className="wordmark-sub">{profile.tagline}</div>
            </div>
          </Link>
        </div>
        <Buttons />
        <Foot />
      </aside>

      {/* mobile bar */}
      <header className="topbar">
        <div className="topbar-brand">
          <ThemeToggle />
          <Link href="/" className="topbar-name">
            <span>{profile.firstName} {profile.lastName}</span>
          </Link>
        </div>
        <button
          type="button"
          className="menu-btn"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>

      {open && (
        <div className="drawer">
          <Buttons onNavigate={() => setOpen(false)} />
          <Foot />
        </div>
      )}
    </>
  );
}
