import rawPages from "./restoreclaim-pages.json";

export type SeoPage = {
  id: string;
  pageTitle: string;
  pageSlug: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  targetArea: string;
  pageType: string;
  searchIntent: string;
  volumePerMonth: string;
  keywordDifficulty: string;
  cpc: string;
  priority: string;
  ctaStrategy: string;
};

export const RAW_PAGES = rawPages as SeoPage[];
