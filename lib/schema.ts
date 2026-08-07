import {
  PHONE_E164,
  SITE_NAME,
  SeoPage,
  absoluteUrl,
  breadcrumbTrail,
  buildH1,
  faqsFor,
  isCityPage,
  pageLocation,
  serviceTopicLabel,
} from "@/lib/site-data";

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Breadcrumb schema that mirrors the visible Home > Services > Pillar > Page trail. */
export function pageBreadcrumb(page: SeoPage) {
  return breadcrumbSchema(breadcrumbTrail(page));
}

export function faqSchema(page: SeoPage) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqsFor(page).map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function cityServiceSchema(page: SeoPage) {
  if (!isCityPage(page)) return null;
  return [
    {
      "@context": "https://schema.org",
      "@type": "HomeAndConstructionBusiness",
      "@id": `${absoluteUrl(page.pageSlug)}#local-business`,
      name: SITE_NAME,
      telephone: PHONE_E164,
      url: absoluteUrl(page.pageSlug),
      areaServed: {
        "@type": "City",
        name: pageLocation(page),
      },
      priceRange: "$$",
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${absoluteUrl(page.pageSlug)}#service`,
      name: buildH1(page),
      provider: {
        "@id": `${absoluteUrl(page.pageSlug)}#local-business`,
      },
      areaServed: pageLocation(page),
      serviceType: serviceTopicLabel(page),
      url: absoluteUrl(page.pageSlug),
    },
  ];
}
