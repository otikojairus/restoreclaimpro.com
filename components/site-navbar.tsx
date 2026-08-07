"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PHONE_DISPLAY, PHONE_E164, SERVICE_PILLARS, SITE_NAME, serviceShortLabel, toPath } from "@/lib/site-data";

export function SiteNavbar() {
  const [open, setOpen] = useState(false);
  const [showCall, setShowCall] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowCall(window.matchMedia("(max-width: 900px)").matches && window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="rcp-header">
        <div className="rcp-wrap rcp-nav">
          <Link href="/" className="rcp-brand" aria-label={SITE_NAME} onClick={() => setOpen(false)}>
            <Image src="/logo.svg" alt="RestoreClaimPro logo" width={42} height={42} priority />
            <span className="rcp-brand-name">
              <span>Restore</span>
              <em>Claim</em>
              <span>Pro</span>
            </span>
          </Link>
          <nav className="rcp-links" aria-label="Primary navigation">
            <Link href="/">Home</Link>
            <Link href="/services">Services</Link>
            {SERVICE_PILLARS.slice(0, 4).map((page) => (
              <Link key={page.pageSlug} href={toPath(page.pageSlug)}>
                {serviceShortLabel(page)}
              </Link>
            ))}
          </nav>
          <a className="rcp-call rcp-call-desktop" href={`tel:${PHONE_E164}`}>
            Call {PHONE_DISPLAY}
          </a>
          <button
            type="button"
            className="rcp-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className={`rcp-drawer ${open ? "rcp-drawer-open" : ""}`} aria-hidden={!open}>
        <button className="rcp-drawer-shade" type="button" aria-label="Close menu" onClick={() => setOpen(false)} />
        <aside className="rcp-drawer-panel">
          <nav className="rcp-drawer-links" aria-label="Mobile navigation">
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="/services" onClick={() => setOpen(false)}>
              Services
            </Link>
            {SERVICE_PILLARS.map((page) => (
              <Link key={page.pageSlug} href={toPath(page.pageSlug)} onClick={() => setOpen(false)}>
                {serviceShortLabel(page)}
              </Link>
            ))}
          </nav>
        </aside>
      </div>

      <div className={`rcp-mobile-call ${showCall && !open ? "rcp-mobile-call-show" : ""}`}>
        <a className="rcp-call" href={`tel:${PHONE_E164}`}>
          Call {PHONE_DISPLAY} — 24/7 Emergency Line
        </a>
      </div>
    </>
  );
}
