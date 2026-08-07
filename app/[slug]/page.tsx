import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { heroImageFor, secondaryImageFor } from "@/lib/images";
import {
  PHONE_DISPLAY,
  PHONE_E164,
  SEO_PAGES,
  SITE_NAME,
  SeoPage,
  anchorText,
  breadcrumbTrail,
  buildH1,
  buildMetaDescription,
  buildMetaTitle,
  bySlug,
  cityPagesForPillar,
  faqsFor,
  introText,
  isCityPage,
  isEmergencyPage,
  keyTakeaways,
  localFacts,
  pageLocation,
  pillarAnchor,
  pillarDeepDive,
  pillarFor,
  planningText,
  processSteps,
  sameCityPages,
  serviceTopicLabel,
  supportCityLinks,
  toPath,
} from "@/lib/site-data";
import { cityServiceSchema, faqSchema, pageBreadcrumb } from "@/lib/schema";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 86400;

export async function generateStaticParams() {
  return SEO_PAGES.map((page) => ({ slug: page.pageSlug.replace(/^\//, "") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = bySlug(slug);
  return {
    title: buildMetaTitle(page),
    description: buildMetaDescription(page),
    alternates: { canonical: toPath(page.pageSlug) },
    openGraph: {
      title: buildMetaTitle(page),
      description: buildMetaDescription(page),
      url: toPath(page.pageSlug),
      type: "article",
      siteName: SITE_NAME,
      locale: "en_CA",
    },
  };
}

function Breadcrumbs({ page }: { page: SeoPage }) {
  const trail = breadcrumbTrail(page);
  return (
    <nav className="rcp-crumbs" aria-label="Breadcrumb">
      <ol>
        {trail.map((item, index) => (
          <li key={item.path}>
            {index === trail.length - 1 ? (
              <span aria-current="page">{item.name}</span>
            ) : (
              <Link href={item.path}>{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function EmergencyBanner({ page }: { page: SeoPage }) {
  if (!isEmergencyPage(page)) return null;
  return (
    <div className="rcp-wrap">
      <div className="rcp-alert-inline">
        <div>
          <strong>Need a crew now?</strong>
          <p>
            This is a same-day, after-hours line. Call and we will give you a real arrival window in{" "}
            {pageLocation(page)}.
          </p>
        </div>
        <a className="rcp-call" href={`tel:${PHONE_E164}`}>
          Call {PHONE_DISPLAY}
        </a>
      </div>
    </div>
  );
}

function LocalFacts({ page }: { page: SeoPage }) {
  if (!isCityPage(page)) return null;
  const facts = localFacts(page);
  return (
    <section className="rcp-section">
      <div className="rcp-wrap">
        <p className="rcp-eyebrow">Local details</p>
        <h2>What Makes {pageLocation(page)} Different</h2>
        <div className="rcp-grid rcp-grid-4">
          {facts.map((fact) => (
            <div className="rcp-fact" key={fact.label}>
              <span>{fact.label}</span>
              <p>{fact.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeepDive({ page }: { page: SeoPage }) {
  const deepDive = pillarDeepDive(page);
  if (!deepDive) return null;
  return (
    <section className="rcp-section rcp-section-soft">
      <div className="rcp-wrap">
        <p className="rcp-eyebrow">Service details</p>
        <h2>{deepDive.heading}</h2>
        <div className="rcp-prose">
          {deepDive.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function PageLinks({ page }: { page: SeoPage }) {
  const pillar = pillarFor(page);
  const cityLinks = cityPagesForPillar(pillar);
  const siblingLinks = sameCityPages(page);
  const supportLinks = supportCityLinks(page, 5);

  if (page.pageType === "Service Pillar") {
    const links = cityLinks.length ? cityLinks : supportLinks;
    return (
      <section className="rcp-detail">
        <h2>{buildH1(page)} By City</h2>
        <p>
          Pick your city below and you get the same {serviceTopicLabel(page).toLowerCase()} work, sized and scheduled
          around your local property.
        </p>
        <div className="rcp-chip-grid">
          {links.map((item) => (
            <Link className="rcp-chip" key={item.pageSlug} href={toPath(item.pageSlug)}>
              {anchorText(item)}
            </Link>
          ))}
        </div>
      </section>
    );
  }

  if (isCityPage(page)) {
    return (
      <section className="rcp-detail">
        <h2>Related Local Work</h2>
        <div className="rcp-link-panels">
          <Link className="rcp-card rcp-card-link" href={toPath(pillar.pageSlug)}>
            <span>Parent service</span>
            <h3>{pillarAnchor(pillar)}</h3>
            <p>See how your {serviceTopicLabel(pillar).toLowerCase()} visit is set up, quoted and documented.</p>
          </Link>
          {siblingLinks.slice(0, 5).map((item) => (
            <Link className="rcp-card rcp-card-link" key={item.pageSlug} href={toPath(item.pageSlug)}>
              <span>Same city</span>
              <h3>{anchorText(item)}</h3>
              <p>Add {anchorText(item).toLowerCase()} to the same local claim file.</p>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rcp-detail">
      <h2>Related Service And City Pages</h2>
      <div className="rcp-link-panels">
        <Link className="rcp-card rcp-card-link" href={toPath(pillar.pageSlug)}>
          <span>Recommended service</span>
          <h3>{pillarAnchor(pillar)}</h3>
          <p>See the full {serviceTopicLabel(pillar).toLowerCase()} service and how a restoration is run.</p>
        </Link>
        {supportLinks.slice(0, 5).map((item) => (
          <Link className="rcp-card rcp-card-link" key={item.pageSlug} href={toPath(item.pageSlug)}>
            <span>City route</span>
            <h3>{anchorText(item)}</h3>
            <p>Book {anchorText(item).toLowerCase()} if your property is in that area.</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function DynamicSeoPage({ params }: Props) {
  const { slug } = await params;
  const page = bySlug(slug);
  const faqs = faqsFor(page);
  const takeaways = keyTakeaways(page);
  const hero = heroImageFor(page);
  const secondary = secondaryImageFor(page);
  const serviceSchema = cityServiceSchema(page);
  const schema = serviceSchema
    ? [pageBreadcrumb(page), faqSchema(page), ...serviceSchema]
    : [pageBreadcrumb(page), faqSchema(page)];

  return (
    <main className="rcp-main rcp-page">
      <JsonLd data={schema} />
      <div className="rcp-wrap">
        <Breadcrumbs page={page} />
      </div>

      <section className="rcp-page-head">
        <div className="rcp-wrap rcp-split">
          <div>
            <p className="rcp-kicker">{page.pageType}</p>
            <h1>{buildH1(page)}</h1>
            <p>{introText(page)}</p>
            <div className="rcp-actions">
              <a className="rcp-call rcp-call-large" href={`tel:${PHONE_E164}`}>
                Call {PHONE_DISPLAY}
              </a>
              <Link className="rcp-secondary" href="/services">
                Browse All Services
              </Link>
            </div>
          </div>
          <div className="rcp-page-media">
            <Image
              src={hero.image.src}
              alt={hero.alt}
              width={hero.image.width}
              height={hero.image.height}
              priority
              sizes="(max-width: 1020px) 100vw, 46vw"
            />
          </div>
        </div>
      </section>

      <div className="rcp-wrap">
        <EmergencyBanner page={page} />
      </div>

      <LocalFacts page={page} />

      <section className="rcp-section rcp-section-pine">
        <div className="rcp-wrap rcp-split">
          <div>
            <p className="rcp-eyebrow">Getting started</p>
            <h2>What We Sort Out On Your First Call</h2>
          </div>
          <p>{planningText(page)}</p>
        </div>
      </section>

      <section className="rcp-section">
        <div className="rcp-wrap rcp-split rcp-split-reverse">
          <div className="rcp-page-media rcp-page-media-small">
            <Image
              src={secondary.image.src}
              alt={secondary.alt}
              width={secondary.image.width}
              height={secondary.image.height}
              loading="lazy"
              sizes="(max-width: 1020px) 100vw, 40vw"
            />
          </div>
          <div>
            <p className="rcp-eyebrow">How a visit works</p>
            <h2>From First Call to Handover</h2>
            <div className="rcp-rail">
              {processSteps(page).map((step, index) => (
                <article className="rcp-rail-step" key={step.title}>
                  <span className="rcp-rail-num">{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rcp-section rcp-section-soft">
        <div className="rcp-wrap rcp-split">
          <div>
            <p className="rcp-eyebrow">Before you call</p>
            <h2>What You Will Sort Out Before You Call</h2>
          </div>
          <ul className="rcp-checks">
            {takeaways.map((item) => (
              <li key={item.slice(0, 40)}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <DeepDive page={page} />

      <div className="rcp-wrap">
        <PageLinks page={page} />
      </div>

      <section className="rcp-section">
        <div className="rcp-wrap">
          <p className="rcp-eyebrow">Good to know</p>
          <h2>Common Questions</h2>
          <div className="rcp-faq-grid">
            {faqs.map((faq, index) => (
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
