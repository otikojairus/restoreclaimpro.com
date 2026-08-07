import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { SERVICES_HERO, pillarCardImage } from "@/lib/images";
import {
  EMERGENCY_PAGES,
  PHONE_DISPLAY,
  PHONE_E164,
  SEO_PAGES,
  SERVICE_PAGES,
  SERVICE_PILLARS,
  SITE_NAME,
  SUPPORT_PAGES,
  absoluteUrl,
  anchorText,
  indexLabel,
  linkLabel,
  pageListLabel,
  pillarTagline,
  serviceShortLabel,
  toPath,
  uniqueCityPages,
} from "@/lib/site-data";
import { breadcrumbSchema } from "@/lib/schema";

const serviceFaqs = [
  {
    q: "Should I start with a service or my city?",
    a: "If you want the full picture of how a restoration works, start with the service page. If you already know your location and just need a crew out, jump straight to your city.",
  },
  {
    q: "Do you cover emergencies?",
    a: "Yes. The emergency pages cover same-day and after-hours water, mould, fire, flood and sewage response. Call and we will give you a real arrival window.",
  },
  {
    q: "Can I just call instead of picking a page?",
    a: "Yes. Call us, tell us what happened and your coverage, and we will point you to the right service and get a crew moving.",
  },
];

export const metadata: Metadata = {
  title: `${SITE_NAME} Services`,
  description:
    "Browse water damage, mould remediation, fire, flood and sewage restoration, emergency response, and city coverage in one place.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: `${SITE_NAME} Services`,
    description: "Browse restoration services, emergency response, and city coverage for RestoreClaimPro.",
    url: absoluteUrl("/services"),
  },
};

export default function ServicesPage() {
  return (
    <main className="rcp-main rcp-page">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: serviceFaqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          },
        ]}
      />
      <section className="rcp-page-head">
        <div className="rcp-wrap rcp-split">
          <div>
            <p className="rcp-kicker">Every service in one place</p>
            <h1>Services</h1>
            <p>
              Find exactly what you need in one place. Whether it is a burst pipe, visible mould, smoke damage, or a
              flooded basement, start with the service that fits and drill down to your city. If you would rather skip
              the browsing, call and we will get you to the right crew.
            </p>
            <div className="rcp-actions">
              <a className="rcp-call rcp-call-large" href={`tel:${PHONE_E164}`}>
                Call {PHONE_DISPLAY}
              </a>
              <Link className="rcp-secondary" href="/">
                Back to Home
              </Link>
            </div>
          </div>
          <div className="rcp-page-media">
            <Image
              src={SERVICES_HERO.image.src}
              alt={SERVICES_HERO.alt}
              width={SERVICES_HERO.image.width}
              height={SERVICES_HERO.image.height}
              priority
              sizes="(max-width: 1020px) 100vw, 46vw"
            />
          </div>
        </div>
      </section>

      <section className="rcp-section">
        <div className="rcp-wrap">
          <p className="rcp-eyebrow">What we restore</p>
          <h2>Core Restoration Services</h2>
          <div className="rcp-grid rcp-grid-3">
            {SERVICE_PILLARS.map((page, index) => {
              const card = pillarCardImage(page.pageSlug);
              return (
                <Link className="rcp-media-card" href={toPath(page.pageSlug)} key={page.pageSlug}>
                  <div className="rcp-media-card-thumb">
                    <Image
                      src={card.image.src}
                      alt={card.alt}
                      width={card.image.width}
                      height={card.image.height}
                      loading="lazy"
                      sizes="(max-width: 1020px) 100vw, 33vw"
                    />
                    <span className="rcp-media-card-num">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="rcp-media-card-body">
                    <span className="rcp-media-card-tag">{serviceShortLabel(page)}</span>
                    <h3>{pageListLabel(page)}</h3>
                    <p>{pillarTagline(page)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rcp-section rcp-section-soft">
        <div className="rcp-wrap">
          <p className="rcp-eyebrow">Same-day response</p>
          <h2>Emergency &amp; Same-Day</h2>
          <div className="rcp-chip-grid">
            {EMERGENCY_PAGES.map((page) => (
              <Link className="rcp-chip" href={toPath(page.pageSlug)} key={page.pageSlug}>
                {anchorText(page)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rcp-section">
        <div className="rcp-wrap">
          <h2>Near Me Pages</h2>
          <div className="rcp-chip-grid">
            {SERVICE_PAGES.map((page) => (
              <Link className="rcp-chip" href={toPath(page.pageSlug)} key={page.pageSlug}>
                {pageListLabel(page)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rcp-section rcp-section-pine">
        <div className="rcp-wrap">
          <p className="rcp-eyebrow">Local crews</p>
          <h2>Local Pages</h2>
          <div className="rcp-city-grid">
            {uniqueCityPages().map((page) => (
              <Link className="rcp-city-tile" href={toPath(page.pageSlug)} key={page.pageSlug}>
                <span>{linkLabel(page)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rcp-section">
        <div className="rcp-wrap">
          <h2>More Pages</h2>
          <div className="rcp-chip-grid">
            {SUPPORT_PAGES.map((page) => (
              <Link className="rcp-chip" href={toPath(page.pageSlug)} key={page.pageSlug}>
                {pageListLabel(page)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rcp-section rcp-section-soft">
        <div className="rcp-wrap">
          <h2>Browse All</h2>
          <div className="rcp-index-list">
            {SEO_PAGES.map((page) => (
              <Link href={toPath(page.pageSlug)} key={page.pageSlug} aria-label={pageListLabel(page)}>
                {indexLabel(page)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rcp-section">
        <div className="rcp-wrap">
          <h2>Common Questions</h2>
          <div className="rcp-faq-grid">
            {serviceFaqs.map((faq, index) => (
              <article className="rcp-card" key={faq.q}>
                <span className="rcp-card-num">{String(index + 1).padStart(2, "0")}</span>
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
