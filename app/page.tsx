import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { HOME_HERO, pillarCardImage } from "@/lib/images";
import {
  EMERGENCY_PAGES,
  PHONE_DISPLAY,
  PHONE_E164,
  SERVICE_PAGES,
  SERVICE_PILLARS,
  SITE_NAME,
  absoluteUrl,
  anchorText,
  linkLabel,
  pageListLabel,
  pillarTagline,
  serviceShortLabel,
  toPath,
  uniqueCityPages,
} from "@/lib/site-data";
import { breadcrumbSchema } from "@/lib/schema";

const homeFaqs = [
  {
    q: "Do you work with a home or building like mine?",
    a: "If you own or manage a house, a condo, a rental unit, or a commercial building, yes. You get a crew matched to your property, your coverage, and the kind of damage you are dealing with.",
  },
  {
    q: "How do I know which service I need?",
    a: "Tell us what happened — a burst pipe, visible mould, smoke damage, or a flooded basement. If you know your city, start there; if not, describe the damage and we will point you to the right service and quote it.",
  },
  {
    q: "Can I just call before I figure it all out?",
    a: "Yes. Call us, describe what happened and your coverage, and how soon you need a crew. We take it from there and give you a real arrival window.",
  },
];

export const metadata: Metadata = {
  title: `${SITE_NAME} | Insurance Restoration — Water, Mold & Fire Damage`,
  description:
    "IICRC-trained water damage, mould remediation, fire & flood restoration and sewage cleanup across Canada. 24/7 dispatch with claim documentation on every visit.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} | Water, Mold & Fire Damage Restoration`,
    description: "Insurance restoration for water, mould, fire, flood and sewage damage across Canada. 24/7 dispatch.",
    url: absoluteUrl("/"),
    type: "website",
    siteName: SITE_NAME,
  },
};

export default function HomePage() {
  return (
    <main className="rcp-main">
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }]),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: homeFaqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          },
        ]}
      />

      <section className="rcp-hero">
        <div className="rcp-hero-strata" aria-hidden="true" />
        <div className="rcp-wrap rcp-hero-content">
          <div className="rcp-hero-copy">
            <p className="rcp-kicker">Insurance restoration · Coast to coast · 24/7 dispatch</p>
            <h1>From Damage to Done — With the Paperwork Your Claim Needs</h1>
            <p className="rcp-hero-lede">
              Water, mould, fire, flood and sewage damage, restored by IICRC-trained crews. Tell us what happened and
              where the crew can park, and we stabilize the property, document every reading, and hand the claim back
              complete before we leave.
            </p>
            <div className="rcp-actions">
              <a className="rcp-call rcp-call-large" href={`tel:${PHONE_E164}`}>
                Call {PHONE_DISPLAY}
              </a>
              <Link className="rcp-secondary" href="/services">
                Browse Services
              </Link>
            </div>
            <ul className="rcp-hero-seals" aria-label="Credentials">
              <li>IICRC WRT</li>
              <li>IICRC AMRT</li>
              <li>IICRC FSRT</li>
              <li>Claims documented</li>
            </ul>
          </div>

          <div className="rcp-hero-stage">
            <div className="rcp-hero-panel">
              <Image
                src={HOME_HERO.image.src}
                alt={HOME_HERO.alt}
                width={HOME_HERO.image.width}
                height={HOME_HERO.image.height}
                priority
                sizes="(max-width: 1020px) 100vw, 46vw"
              />
              <div className="rcp-hero-badge" aria-hidden="true">
                <span>24/7</span>
                <em>dispatch</em>
              </div>
            </div>
            <div className="rcp-drycard" aria-hidden="true">
              <div className="rcp-drycard-head">
                <span>Drying log — Site 1847</span>
                <b>Day 3</b>
              </div>
              <div className="rcp-drycard-row">
                <span>Floor slab</span>
                <div className="rcp-meter">
                  <i style={{ width: "86%" }} />
                </div>
                <b>86%</b>
              </div>
              <div className="rcp-drycard-row">
                <span>Drywall</span>
                <div className="rcp-meter rcp-meter-amber">
                  <i style={{ width: "94%" }} />
                </div>
                <b>94%</b>
              </div>
              <p className="rcp-drycard-note">Readings logged &amp; shared with your adjuster.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="rcp-trustbar" aria-label="Certifications and approach">
        <div className="rcp-wrap rcp-trustbar-inner">
          <span>Every visit is documented for your claim</span>
          <span>IICRC-trained crews</span>
          <span>Direct adjuster coordination</span>
          <span>24/7 emergency dispatch</span>
        </div>
      </div>

      <section className="rcp-section rcp-section-soft">
        <div className="rcp-wrap">
          <div className="rcp-split">
            <div>
              <p className="rcp-eyebrow">Damage right now?</p>
              <h2>Secured, Dried and Documented — Without the Runaround</h2>
            </div>
            <p>
              A burst pipe at midnight, mould behind a finished wall, smoke damage after a kitchen fire — the damage
              itself is rarely the whole problem. The bigger risk is a restoration that is never properly documented, so
              the claim drags or gets shorted. We handle the mitigation, the drying, and the paperwork as one job, with
              a crew sized for your property and a log your adjuster can read.
            </p>
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

      <section className="rcp-section rcp-section-pine">
        <div className="rcp-wrap">
          <div className="rcp-alert">
            <div>
              <strong>Active damage right now?</strong>
              <p>We keep crews on standby for after-hours water, mould, fire, flood and sewage emergencies.</p>
            </div>
            <a className="rcp-call" href={`tel:${PHONE_E164}`}>
              Emergency Line
            </a>
          </div>
        </div>
      </section>

      <section className="rcp-section">
        <div className="rcp-wrap">
          <p className="rcp-eyebrow">Emergency &amp; near-me pages</p>
          <h2>Fast Response &amp; Local Coverage</h2>
          <div className="rcp-chip-grid">
            {[...EMERGENCY_PAGES, ...SERVICE_PAGES].map((page) => (
              <Link className="rcp-chip" href={toPath(page.pageSlug)} key={page.pageSlug}>
                {anchorText(page)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rcp-section rcp-section-soft">
        <div className="rcp-wrap">
          <p className="rcp-eyebrow">Find your city</p>
          <h2>Local Restoration Crews</h2>
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
          <h2>Common Questions</h2>
          <div className="rcp-faq-grid">
            {homeFaqs.map((faq, index) => (
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
