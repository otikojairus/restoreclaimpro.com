import Image from "next/image";
import Link from "next/link";
import {
  CITY_PAGES,
  PHONE_DISPLAY,
  PHONE_E164,
  SERVICE_PILLARS,
  SITE_NAME,
  SUPPORT_PAGES,
  SeoPage,
  cityFromTargetArea,
  linkLabel,
  pageListLabel,
  serviceShortLabel,
  toPath,
} from "@/lib/site-data";

const SERVICE_LOCATIONS = Array.from(
  CITY_PAGES.reduce((map, page) => {
    const city = cityFromTargetArea(page.targetArea);
    if (!map.has(city)) map.set(city, page);
    return map;
  }, new Map<string, SeoPage>()).values(),
).slice(0, 18);

function footerLinkLabel(page: SeoPage) {
  if (page.pageType === "City Service Page") return linkLabel(page);
  if (page.pageType === "Service Pillar") return serviceShortLabel(page);
  return pageListLabel(page);
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="rcp-footer">
      <div className="rcp-wrap rcp-footer-grid">
        <div>
          <div className="rcp-footer-brand">
            <Image src="/logo.svg" alt="RestoreClaimPro logo" width={36} height={36} />
            <p>{SITE_NAME}</p>
          </div>
          <p className="rcp-footer-copy">
            Insurance restoration crews for water damage, mould remediation, fire &amp; flood restoration and sewage
            cleanup across Canada — restored, documented and handed back with the claim file complete.
          </p>
          <a className="rcp-call rcp-footer-call" href={`tel:${PHONE_E164}`}>
            Call {PHONE_DISPLAY}
          </a>
        </div>
        <div>
          <h2>Services</h2>
          <nav className="rcp-footer-links" aria-label="Footer services">
            {SERVICE_PILLARS.map((page) => (
              <Link key={page.pageSlug} href={toPath(page.pageSlug)}>
                {footerLinkLabel(page)}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h2>More Pages</h2>
          <nav className="rcp-footer-links" aria-label="Footer more pages">
            {SUPPORT_PAGES.slice(0, 8).map((page) => (
              <Link key={page.pageSlug} href={toPath(page.pageSlug)}>
                {footerLinkLabel(page)}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h2>Where We Work</h2>
          <nav className="rcp-footer-links rcp-footer-cities" aria-label="Footer locations we serve">
            {SERVICE_LOCATIONS.map((page) => (
              <Link key={cityFromTargetArea(page.targetArea)} href={toPath(page.pageSlug)} aria-label={linkLabel(page)}>
                {cityFromTargetArea(page.targetArea)}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="rcp-wrap rcp-footer-base">
        © {year} {SITE_NAME}. IICRC-trained restoration crews and claim documentation across Canada. Call {PHONE_DISPLAY}{" "}
        for 24/7 dispatch.
      </div>
    </footer>
  );
}
