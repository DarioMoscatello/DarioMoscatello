"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, profile } from "@/data/site";

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
            className="button-row"
            data-active={active}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
          >
            <span className="idx">{item.index}</span>
            <span>{item.label}</span>
            <span className="led" aria-hidden="true" />
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
      </div>
      <div className="rail-coords">
        {profile.city} — {profile.coordinates}
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
        <Link href="/" className="plate" aria-label="Home">
          <div className="plate-name">
            {profile.lastName}
            <span>{profile.firstName}</span>
          </div>
          <div className="plate-sub">
            {profile.role} — {profile.city}
          </div>
        </Link>
        <Buttons />
        <Foot />
      </aside>

      {/* mobile bar */}
      <header className="topbar">
        <Link href="/" className="topbar-name">
          {profile.lastName} {profile.firstName}
        </Link>
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
