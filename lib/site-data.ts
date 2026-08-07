import { RAW_PAGES } from "@/lib/generated-pages";
import { CITY_FACTS } from "@/lib/city-facts";
import { hashIndex, serviceMetaFor } from "@/lib/service-meta";

export type SeoPage = (typeof RAW_PAGES)[number];

export const SITE_NAME = "RestoreClaimPro";
export const DEFAULT_SITE_URL = "https://restoreclaimpro.com";
export const PHONE_DISPLAY = "1-888-827-7751";
export const PHONE_E164 = "+18888277751";

export const SEO_PAGES: SeoPage[] = [...RAW_PAGES];
export const SERVICE_PILLARS = SEO_PAGES.filter((page) => page.pageType === "Service Pillar");
export const EMERGENCY_PAGES = SEO_PAGES.filter((page) => page.pageType === "Emergency Landing");
export const SERVICE_PAGES = SEO_PAGES.filter((page) => page.pageType === "Service Page");
export const CITY_PAGES = SEO_PAGES.filter((page) => page.pageType === "City Service Page");
export const COMPANY_PAGES = SEO_PAGES.filter((page) => page.pageType === "Company Page");
export const SUPPORT_PAGES = SEO_PAGES.filter(
  (page) => page.pageType !== "Service Pillar" && !isCityPage(page),
);

const PILLAR_SLUGS = new Set(SERVICE_PILLARS.map((page) => page.pageSlug));

// Emergency, near-me, cost and company pages map to the pillar that best represents
// their work so breadcrumbs and related links stay coherent.
const FAMILY_RULES: Array<[string, string]> = [
  ["/emergency-water-damage-restoration", "/water-damage-restoration"],
  ["/emergency-mold-remediation", "/mold-remediation"],
  ["/emergency-fire-smoke-damage", "/fire-damage-restoration"],
  ["/emergency-flood-sewage-cleanup", "/flood-damage-restoration"],
  ["/water-damage-restoration-near-me", "/water-damage-restoration"],
  ["/mold-remediation-near-me", "/mold-remediation"],
  ["/fire-damage-restoration-near-me", "/fire-damage-restoration"],
  ["/mold-remediation-cost", "/mold-remediation"],
  ["/insurance-approved-contractor", "/water-damage-restoration"],
  ["/disaster-restoration-company", "/water-damage-restoration"],
  ["/property-restoration-company", "/water-damage-restoration"],
];

// City-page slugs are built from the service prefix plus the city slug. Longest, most
// specific prefixes are listed first so matching stays deterministic.
const CITY_PREFIX_RULES: Array<[string, string]> = [
  ["/water-damage-restoration-", "/water-damage-restoration"],
  ["/mold-remediation-", "/mold-remediation"],
  ["/fire-damage-restoration-", "/fire-damage-restoration"],
];

export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    DEFAULT_SITE_URL;

  const normalized = raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;
  return normalized.replace(/\/+$/, "");
}

export function toPath(slug: string) {
  return slug.startsWith("/") ? slug : `/${slug}`;
}

export function absoluteUrl(path: string) {
  return `${getSiteUrl()}${toPath(path)}`;
}

export function titleCase(value: string) {
  return value
    .split(/(\s|-|\/)/)
    .map((part) => {
      if (/^\s|-|\/$/.test(part)) return part;
      const upper = part.toUpperCase();
      if (["bc", "ab", "on", "mb", "sk", "nb", "ns", "qc", "nl", "pe", "nt", "yt", "nu"].includes(part.toLowerCase())) {
        return upper;
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("")
    .replace(/\bAnd\b/g, "and")
    .replace(/\bIn\b/g, "in")
    .replace(/\bNear Me\b/g, "Near Me")
    .replace(/\bOf\b/g, "of");
}

export function cityFromTargetArea(targetArea: string) {
  return targetArea.replace(/\s*\([^)]*\)/, "").split(",")[0].trim();
}

export function provinceFromTargetArea(targetArea: string) {
  return targetArea.includes(",") ? targetArea.split(",")[1].trim() : "Canada";
}

export function isCityPage(page: SeoPage) {
  return page.pageType === "City Service Page";
}

export function isEmergencyPage(page: SeoPage) {
  return page.pageType === "Emergency Landing";
}

export function isCompanyPage(page: SeoPage) {
  return page.pageType === "Company Page";
}

function stripBrand(value: string) {
  return value.replace(/\s*\|\s*RestoreClaimPro$/i, "").trim();
}

/**
 * Cleans the SEO title suffixes from the Excel plan so the rendered H1 and link
 * labels read naturally instead of echoing keyword-stuffed title text verbatim.
 */
function cleanTitle(value: string) {
  return stripBrand(value)
    .replace(/\s*[-–]\s*24\/7\s*Response\s*Canada\s*$/i, "")
    .replace(/\s*[-–]\s*24\/7\s*Canada\s*$/i, "")
    .replace(/\s*[-–]\s*Find\s+Local\s+Crews\s*\(\s*Canada\s*\)\s*$/i, "")
    .replace(/\s*[-–]\s*Canada\s+Pricing\s+Guide\s*$/i, "")
    .replace(/\s*[-–]\s*Canada\s*$/i, "")
    .replace(/\s*\(\s*Canada\s*\)\s*$/i, "")
    .trim();
}

export function pageListLabel(page: SeoPage) {
  return cleanTitle(page.pageTitle) || titleCase(page.primaryKeyword);
}

export function linkLabel(page: SeoPage) {
  return isCityPage(page) ? cityFromTargetArea(page.targetArea) : pageListLabel(page);
}

/**
 * Compact, unique label for flat index lists. City pages become "{City}, {Prov} — {Service}"
 * so multiple pages in one province stay distinct without repeating the full keyword-heavy
 * title on every line.
 */
export function indexLabel(page: SeoPage) {
  if (!isCityPage(page)) return pageListLabel(page);
  const city = cityFromTargetArea(page.targetArea);
  const prov = provinceFromTargetArea(page.targetArea);
  const family = serviceFamily(page);
  const pillar = SEO_PAGES.find((item) => item.pageSlug === family);
  const service = pillar ? serviceShortLabel(pillar) : "Restoration";
  return `${city}, ${prov} — ${service}`;
}

/** Short, human service label for a pillar card (drops trailing "Restoration" noise). */
export function serviceShortLabel(page: SeoPage) {
  switch (page.pageSlug) {
    case "/water-damage-restoration":
      return "Water Damage";
    case "/mold-remediation":
      return "Mold Remediation";
    case "/fire-damage-restoration":
      return "Fire Damage";
    case "/flood-damage-restoration":
      return "Flood Damage";
    case "/sewage-cleanup":
      return "Sewage Cleanup";
    default:
      return pageListLabel(page);
  }
}

/**
 * One-line, name-free tagline for a pillar card so listing grids never echo the card
 * title back to back (e.g. "Water Damage Restoration Water Damage Restoration handled...").
 */
export function pillarTagline(page: SeoPage): string {
  switch (page.pageSlug) {
    case "/water-damage-restoration":
      return "Standing water extracted, structures dried and monitored until every reading says dry — with the documentation your claim needs.";
    case "/mold-remediation":
      return "Containment, removal and HEPA cleaning that fix the moisture source, so the mould does not just come back.";
    case "/fire-damage-restoration":
      return "Soot, smoke and salvage handled so your home is cleaned, deodorized and ready to rebuild.";
    case "/flood-damage-restoration":
      return "Flood water pumped, sanitized and dried by contamination category, not by guesswork.";
    case "/sewage-cleanup":
      return "Category 3 sewage handled under proper protocol, protecting occupants and leaving the space safe.";
    default:
      return "Insurance restoration handled across Canada, with a real crew on the phone and the paperwork done.";
  }
}

/** Keyword-rich anchor text for internal links (never a generic "click here"). */
export function anchorText(page: SeoPage) {
  return titleCase(page.primaryKeyword);
}

export function pillarAnchor(page: SeoPage) {
  return pageListLabel(page);
}

export function pageLocation(page: SeoPage) {
  if (isCityPage(page)) return cityFromTargetArea(page.targetArea);
  if (page.targetArea.includes("Canada")) return "Canada";
  return provinceFromTargetArea(page.targetArea);
}

export function serviceFamily(page: SeoPage) {
  const slug = toPath(page.pageSlug).replace(/\/+$/, "");
  if (PILLAR_SLUGS.has(slug)) return slug;
  for (const [prefix, family] of FAMILY_RULES) {
    if (slug === prefix || slug.startsWith(prefix)) return family;
  }
  for (const [prefix, family] of CITY_PREFIX_RULES) {
    if (slug.startsWith(prefix)) return family;
  }
  if (slug.includes("water")) return "/water-damage-restoration";
  if (slug.includes("mold") || slug.includes("mould")) return "/mold-remediation";
  if (slug.includes("fire")) return "/fire-damage-restoration";
  if (slug.includes("flood")) return "/flood-damage-restoration";
  if (slug.includes("sewage")) return "/sewage-cleanup";
  return "/water-damage-restoration";
}

export function bySlug(slug: string) {
  const clean = toPath(slug).replace(/\/+$/, "");
  return SEO_PAGES.find((page) => page.pageSlug === clean) || fallbackPageFromSlug();
}

function fallbackPageFromSlug(): SeoPage {
  return (
    SEO_PAGES.find((page) => page.pageSlug === "/water-damage-restoration") ||
    SEO_PAGES[0]
  );
}

export function pillarFor(page: SeoPage) {
  return bySlug(serviceFamily(page)) || SERVICE_PILLARS[0];
}

export function cityPagesForPillar(pillar: SeoPage): SeoPage[] {
  return CITY_PAGES.filter((page) => serviceFamily(page) === pillar.pageSlug);
}

/**
 * One representative city page per location, so "Find Your City"-style grids show each
 * city exactly once instead of repeating it once per service (3×).
 */
export function uniqueCityPages(): SeoPage[] {
  const seen = new Set<string>();
  const out: SeoPage[] = [];
  for (const page of CITY_PAGES) {
    const city = cityFromTargetArea(page.targetArea);
    if (seen.has(city)) continue;
    seen.add(city);
    out.push(page);
  }
  return out;
}

export function sameProvincePages(page: SeoPage) {
  if (!isCityPage(page)) return [];
  const prov = provinceFromTargetArea(page.targetArea);
  return CITY_PAGES.filter(
    (item) => item.pageSlug !== page.pageSlug && provinceFromTargetArea(item.targetArea) === prov,
  );
}

export function sameCityPages(page: SeoPage) {
  if (!isCityPage(page)) return [];
  const city = cityFromTargetArea(page.targetArea);
  return CITY_PAGES.filter((item) => item.pageSlug !== page.pageSlug && cityFromTargetArea(item.targetArea) === city);
}

export function supportCityLinks(page: SeoPage, limit = 5) {
  const family = serviceFamily(page);
  const matches = CITY_PAGES.filter((item) => item.pageSlug !== page.pageSlug && serviceFamily(item) === family);
  if (matches.length >= limit) return matches.slice(0, limit);
  const extras = CITY_PAGES.filter(
    (item) => item.pageSlug !== page.pageSlug && !matches.some((match) => match.pageSlug === item.pageSlug),
  );
  return [...matches, ...extras.slice(0, Math.max(0, limit - matches.length))];
}

export function serviceTopicLabel(page: SeoPage) {
  const target = isCityPage(page) || isEmergencyPage(page) || page.pageType === "Service Page" ? pillarFor(page) : page;
  return pageListLabel(target)
    .replace(/\s+Services?$/i, "")
    .replace(/\s+[-–]\s*Canada$/i, "")
    .replace(/\s+Canada$/i, "")
    .replace(/[-–]\s*$/, "")
    .trim();
}

export function buildH1(page: SeoPage) {
  return pageListLabel(page);
}

/** Ordered Home > Services > Pillar > Page breadcrumb trail, reused for schema + visible UI. */
export function breadcrumbTrail(page: SeoPage): Array<{ name: string; path: string }> {
  const trail = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
  ];
  if (page.pageType === "Service Pillar") {
    trail.push({ name: buildH1(page), path: toPath(page.pageSlug) });
    return trail;
  }
  const pillar = pillarFor(page);
  trail.push({ name: pillarAnchor(pillar), path: toPath(pillar.pageSlug) });
  trail.push({ name: buildH1(page), path: toPath(page.pageSlug) });
  return trail;
}

function fitTitle(base: string, brandSuffix: string): string {
  const min = 50;
  const max = 60;
  let candidate = `${base}${brandSuffix}`;
  if (candidate.length >= min && candidate.length <= max) return candidate;

  if (candidate.length > max) {
    const words = base.split(" ");
    while (words.length > 1 && `${words.join(" ")}${brandSuffix}`.length > max) {
      words.pop();
    }
    candidate = `${words.join(" ")}${brandSuffix}`;
    if (candidate.length <= max) return candidate;
    const hardCut = max - brandSuffix.length;
    return `${base.slice(0, Math.max(hardCut, 1))}${brandSuffix}`;
  }

  const fillers = ["Restoration", "Canada", "Experts", "Company"];
  let widened = base;
  for (const filler of fillers) {
    if (widened.toLowerCase().includes(filler.toLowerCase())) continue;
    const attempt = `${widened} ${filler}`;
    if (`${attempt}${brandSuffix}`.length <= max) {
      widened = attempt;
      candidate = `${widened}${brandSuffix}`;
      if (candidate.length >= min) return candidate;
    }
  }
  return candidate;
}

export function buildMetaTitle(page: SeoPage): string {
  const brandSuffix = ` | ${SITE_NAME}`;
  const keyword = titleCase(page.primaryKeyword);
  const lower = keyword.toLowerCase();
  let base = keyword;
  if (!isCityPage(page) && !lower.includes("near me") && !lower.includes("canada")) {
    base = `${keyword} Canada`;
  }
  return fitTitle(base, brandSuffix);
}

const MIN_DESC = 150;
const MAX_DESC = 160;

/**
 * Grows the description word by word from a long "filler pool" sentence until the total
 * lands inside [150,160]. Word-boundary cuts are checked in increasing order, so this
 * reliably lands in the target window without truncating mid-word or dropping the CTA.
 */
function fitDescription(opener: string, pool: string, cta: string): string {
  const fixedOpener = /[.!?]$/.test(opener.trim()) ? opener.trim() : `${opener.trim()}.`;
  const words = pool.trim().split(/\s+/);
  const danglingConnectors = new Set([
    "a",
    "an",
    "the",
    "and",
    "or",
    "plus",
    "with",
    "since",
    "for",
    "to",
    "in",
    "of",
    "so",
    "is",
    "are",
    "we",
    "that",
  ]);
  let bestCandidate = "";
  let bestDiff = Infinity;
  let fallbackValidButDangling = "";

  for (let i = 1; i <= words.length; i += 1) {
    const lastWord = words[i - 1].replace(/[.,;:]+$/, "").toLowerCase();
    const dangling = danglingConnectors.has(lastWord) && i < words.length;
    let middle = words.slice(0, i).join(" ").replace(/[,;:\s]+$/, "");
    if (!/[.!?]$/.test(middle)) middle += ".";
    const candidate = `${fixedOpener} ${middle} ${cta}`.replace(/\s+/g, " ").trim();
    const len = candidate.length;
    if (len > MAX_DESC) break;
    if (len >= MIN_DESC) {
      if (!dangling) return candidate;
      fallbackValidButDangling = candidate;
      continue;
    }
    if (dangling) continue;
    const diff = MIN_DESC - len;
    if (diff < bestDiff) {
      bestDiff = diff;
      bestCandidate = candidate;
    }
  }

  return fallbackValidButDangling || bestCandidate || `${fixedOpener} ${cta}`.replace(/\s+/g, " ").trim();
}

export function buildMetaDescription(page: SeoPage): string {
  const location = pageLocation(page);
  const meta = serviceMetaFor(serviceKeyFor(page));
  const opener = isEmergencyPage(page)
    ? `Need ${page.primaryKeyword} in ${location} today? We dispatch fast.`
    : `Book ${page.primaryKeyword} in ${location}.`;
  const cta = `Call ${PHONE_DISPLAY} now.`;
  const pool = `We work with ${meta.audiences[0]}, ${meta.audiences[1]}, ${meta.audiences[2]} and ${meta.audiences[3]} across the region. ${meta.synonym} covers extraction, drying, sanitation, content salvage and rebuild coordination, with ${meta.certifications[0]} trained crews. Every drying checkpoint is documented for your insurer, and 24/7 dispatch stays available through the whole year.`;
  return fitDescription(opener, pool, cta);
}

function serviceKeyFor(page: SeoPage): string {
  if (page.pageType === "Emergency Landing") return page.pageSlug;
  if (page.pageType === "Company Page") return page.pageSlug;
  return serviceFamily(page);
}

/** Deterministic pseudo-random pick so the same page always renders the same variant. */
function pick<T>(list: T[], seed: string, salt: string): T {
  return list[hashIndex(`${seed}:${salt}`, list.length)];
}

export function localFacts(page: SeoPage): Array<{ label: string; value: string }> {
  const city = cityFromTargetArea(page.targetArea);
  const facts = CITY_FACTS[city] || CITY_FACTS["Toronto"];
  return [
    { label: "Population", value: facts.population },
    { label: "Local landmark", value: facts.landmark },
    { label: "Housing stock", value: facts.housing },
    { label: "Weather & risk", value: facts.climate },
  ];
}

export function introText(page: SeoPage): string {
  const meta = serviceMetaFor(serviceKeyFor(page));
  const location = pageLocation(page);
  const keyword = page.primaryKeyword;

  if (isCompanyPage(page)) {
    return `${titleCase(keyword)} is the single point of contact that ${meta.audiences[0]} and ${meta.audiences[1]} need after a loss. Every visit centres on ${meta.items[0]}, ${meta.items[1]} and ${meta.items[2]}, and ${meta.differentiator}. Most people reach us because ${meta.painPoint}, and the fix starts with a short call about what happened, your coverage, and how fast you need your home or building livable again. Below, you will see how a claim moves from first call to sign-off, and how ${meta.synonym} keeps your adjuster in the loop at every checkpoint.`;
  }

  if (isEmergencyPage(page)) {
    const opener = needsKeyword(keyword, buildH1(page))
      ? `When you search for ${keyword}, you need one thing: a crew on site now, not a callback next week`
      : `When water is spreading, mould is showing, or smoke is in the air, you need one thing: a crew on site now, not a callback next week`;
    return `${opener}. We keep technicians on standby for ${meta.audiences[0]} and ${meta.audiences[1]} across ${location}, and ${meta.differentiator}. Most of the calls we take are about ${meta.painPoint}, so when you reach us we focus on your address, what is damaged, and how fast we can get there. From there, ${meta.synonym} usually starts the same day, with the property secured and the first drying checkpoints logged before we leave.`;
  }

  if (page.pageType === "Service Pillar") {
    const opener = needsKeyword(keyword, buildH1(page)) ? `${titleCase(keyword)} is for you if you own or manage` : `You are in the right place if you own or manage`;
    return `${opener} ${meta.audiences[0]}, ${meta.audiences[1]}, ${meta.audiences[2]}, or ${meta.audiences[3]} anywhere across Canada. Every visit centres on ${meta.items[0]} and ${meta.items[1]}, and ${meta.differentiator}. Most people call us because ${meta.painPoint} kept happening with a previous contractor, and the fix usually starts with a short conversation about what happened, your coverage, and how soon you need the space usable again. Below, you will see exactly what a visit covers, how your first claim gets opened, and how ${meta.synonym} adapts as your situation changes.`;
  }

  if (isCityPage(page)) {
    const city = cityFromTargetArea(page.targetArea);
    const facts = CITY_FACTS[city] || CITY_FACTS["Toronto"];
    const pillar = pillarFor(page);
    const scopeLine = `you get ${serviceTopicLabel(pillar).toLowerCase()} handled on a schedule that fits how ${city} actually runs`;
    const opener = needsKeyword(keyword, buildH1(page)) ? `With ${titleCase(keyword)}, ${scopeLine}` : `In ${city}, ${scopeLine}`;
    const middle = pick(
      [
        `${city} is home to ${facts.population}, and if your property sits near ${facts.neighbourhood} you already know ${facts.climate}`,
        `Around ${facts.neighbourhood}, ${facts.population} and ${facts.climate} keep restoration crews working through the year, especially given ${facts.housing}`,
        `With ${facts.population} spread through ${facts.region}, ${facts.climate} means basements and roofs take real punishment near ${facts.neighbourhood}, and ${facts.housing}`,
      ],
      `${city}:${serviceFamily(page)}`,
      "intro",
    );
    const closer = pick(
      [
        `Instead of a one-size national route, your visits across ${city} are timed around your access, your coverage, and the fact that ${meta.differentiator}. You end up with a plan that matches your property, not a template pulled from another market.`,
        `Rather than a generic national schedule, your visits in ${city} are built around your access, your coverage, and the fact that ${meta.differentiator}. The result is a plan shaped for your home, not a template pulled from another market.`,
      ],
      `${city}:${serviceFamily(page)}`,
      "closer",
    );
    return `${opener}. ${middle}. ${closer}`;
  }

  // Service Page (near-me / cost intent)
  const opener = needsKeyword(keyword, buildH1(page)) ? `${titleCase(keyword)} is built around` : `Your service is built around`;
  return `${opener} the day-to-day reality of ${meta.audiences[0]} and ${meta.audiences[1]}, where ${meta.painPoint} is the exact problem you want gone. Every visit covers ${meta.items[0]} and ${meta.items[1]} on a schedule you control, and ${meta.differentiator}. You will see who this fits, how your first claim gets opened, and what to ask before you sign with any contractor. If you run ${meta.audiences[2]} or ${meta.audiences[3]}, you get the same approach with only small changes to timing and access.`;
}

function needsKeyword(keyword: string, h1: string): boolean {
  return !h1.toLowerCase().includes(keyword.toLowerCase().trim());
}
export function planningText(page: SeoPage): string {
  const meta = serviceMetaFor(serviceKeyFor(page));
  const location = pageLocation(page);

  if (isCityPage(page)) {
    const city = cityFromTargetArea(page.targetArea);
    return `When you book your first visit in ${city}, we start with a quick rundown of what happened, your coverage, and what is at risk right now. Because ${meta.differentiator}, that first visit usually settles whether you need straight mitigation, a full restoration, or a coordinated rebuild. Getting ${meta.painPoint} off your plate is the whole point, and you are almost always quoted before the crew leaves your property, with ${meta.timeline}.`;
  }
  if (isEmergencyPage(page)) {
    return `On an emergency call, we skip the slow proposal and get to the essentials: your address, how the crew can reach the property, and what is damaged right now. Because ${meta.differentiator}, dispatch can usually give you a real arrival window on the first call across ${location}. ${meta.synonym} secures the property fast, and we handle the extraction, the sanitation, and the first drying checkpoints before we pull away.`;
  }
  if (isCompanyPage(page)) {
    return `When you engage ${meta.synonym}, we open your claim file the same day: what happened, your coverage, and who the adjuster is. Because ${meta.differentiator}, your file is documented from the first reading, so there is no scramble for records later. Expect one clear update at every drying checkpoint, and know that adjuster questions are answered from the log, not from memory.`;
  }
  return `When you plan your service, we start with what happened, how much of the property is affected, and whether ${location} access fits a standard crew or needs equipment staged differently. Because ${meta.differentiator}, you are matched to the right crew on the first call instead of waiting on a drawn-out proposal. Expect one quick follow-up after the first visit once your real numbers are clear, and know that small schedule tweaks then are normal, not a sign anything was set up wrong.`;
}

const STEP_TITLES = ["Emergency Call & Intake", "Assessment & Moisture Mapping", "Mitigation & Drying", "Documentation & Handover"];

export function processSteps(page: SeoPage) {
  const meta = serviceMetaFor(serviceKeyFor(page));
  const location = pageLocation(page);
  return [
    {
      title: STEP_TITLES[0],
      text: `Tell us what happened, your coverage, and whether you need ${location} service today or on a planned schedule. We open your claim file and lock in an arrival window.`,
    },
    {
      title: STEP_TITLES[1],
      text: `The crew maps the affected area, checks for hidden moisture, and confirms whether ${meta.painPoint} has been an issue before, so the plan matches the actual damage rather than a generic checklist.`,
    },
    {
      title: STEP_TITLES[2],
      text: `We carry out ${meta.items[0]}, ${meta.items[1]} and ${meta.items[2]} on site, since ${meta.differentiator}.`,
    },
    {
      title: STEP_TITLES[3],
      text: `We log the drying curve, hand you the documentation your insurer needs, and set the next checkpoint if you want one. After that, changes are a quick call, not a new setup.`,
    },
  ];
}

export function keyTakeaways(page: SeoPage): string[] {
  const meta = serviceMetaFor(serviceKeyFor(page));
  const location = pageLocation(page);

  if (isCityPage(page)) {
    const city = cityFromTargetArea(page.targetArea);
    return [
      `Whether you need a one-time mitigation or a full restoration in ${city}.`,
      `How your ${meta.items[0]} and ${meta.items[1]} should be handled for your property and your coverage.`,
      `A visit window that works with your access and how soon you need the space usable.`,
      `What it takes to keep ${meta.painPoint} from coming back once you are set up.`,
      `How the drying and documentation checkpoints keep your adjuster in the loop.`,
    ];
  }
  return [
    `Whether this fits you better than a general contractor if you deal with ${meta.audiences[0]} or ${meta.audiences[1]}.`,
    `How ${meta.items[0]} gets handled, documented, and handed over across ${location}.`,
    `Why ${meta.differentiator}, and what that means for a cleaner, longer-lasting restoration.`,
    `What usually causes ${meta.painPoint}, and how a proper restoration keeps it away.`,
    `When it makes sense to move from a one-time call to a standing emergency plan.`,
  ];
}

/** Pillar-only deep dive that adds substantive, non-duplicated detail so pillar pages clear an 800-word floor. */
export function pillarDeepDive(page: SeoPage): { heading: string; paragraphs: string[] } | null {
  if (page.pageType !== "Service Pillar") return null;
  const meta = serviceMetaFor(serviceKeyFor(page));
  return {
    heading: "What A Standard Restoration Actually Covers",
    paragraphs: [
      `A restoration starts with ${meta.items[0]}, then moves to ${meta.items[1]} and ${meta.items[2]}, scaled to your property rather than a generic checklist. If you own a ${meta.audiences[0].replace(/s$/, "")}, the job looks different than it does for ${meta.audiences[2]}, so what the crew brings and how long they stay reflects the building in front of them, not a flat template.`,
      `${titleCase(meta.differentiator)}. That matters most if you have already dealt with ${meta.painPoint}, because it is usually a documentation or drying problem rather than a one-off fluke. Fixing the routine, not just clearing today's mess, is what tends to keep it solved.`,
      `Every visit is logged against your claim file: moisture readings, equipment placement, drying checkpoints and the materials removed. When your adjuster asks, the answers come from that log, which is exactly why ${meta.certifications[0]} and ${meta.certifications[1] ?? meta.certifications[0]} trained crews follow the same protocol on every site.`,
      `You usually get a crew on site the same week you call, since teams already run routes through most regions we cover. When a storm, a burst pipe or an emergency hits, we can absorb it without reworking your whole account, because ${meta.synonym} is built to flex around your property rather than lock you into a fixed schedule.`,
    ],
  };
}

export function faqsFor(page: SeoPage) {
  const meta = serviceMetaFor(serviceKeyFor(page));
  const location = pageLocation(page);

  if (isCityPage(page)) {
    const city = cityFromTargetArea(page.targetArea);
    const facts = CITY_FACTS[city] || CITY_FACTS["Toronto"];
    const seed = `${city}:${serviceFamily(page)}`;
    const first = pick(
      [
        {
          q: `What should I have ready before I call?`,
          a: `Have a rough idea of what happened, where the damage sits, and whether you are near ${facts.neighbourhood} or elsewhere in ${city}. That is enough for us to quote the first visit and open your claim file.`,
        },
        {
          q: `What do I need to know before my first visit?`,
          a: `Roughly what happened, how the crew can reach the property, and whether you are near ${facts.neighbourhood} or elsewhere in ${city}. That is enough for us to quote the work and confirm your coverage steps.`,
        },
      ],
      seed,
      "faq1",
    );
    const second = pick(
      [
        {
          q: `Do you handle the insurance paperwork?`,
          a: `Yes. We log every reading and drying checkpoint, and we coordinate with your adjuster across ${location}, so the file you need is complete rather than a stack of receipts.`,
        },
        {
          q: `Can you coordinate with my adjuster for me?`,
          a: `Yes. We keep your adjuster in the loop across ${location} with documented checkpoints, so the claim moves without you chasing both sides.`,
        },
      ],
      seed,
      "faq2",
    );
    const third = pick(
      [
        {
          q: `Do the seasons affect scheduling here?`,
          a: `They can. ${facts.climate}, so spring thaws and storm seasons fill up fast in ${city}. Calling early keeps you near the front of the line.`,
        },
        {
          q: `When does scheduling fill up in ${city}?`,
          a: `Storm and thaw seasons are the busy ones. Given ${facts.climate}, calling early in ${city} keeps you near the front of the line.`,
        },
      ],
      seed,
      "faq3",
    );
    return [first, second, third];
  }

  if (isEmergencyPage(page)) {
    return [
      {
        q: `How fast can a crew reach me?`,
        a: `Across ${location}, dispatch runs 24/7 and can usually give you a real arrival window on the first call. From there, ${meta.synonym} starts the same day in most regions.`,
      },
      {
        q: `What happens on the first emergency visit?`,
        a: `We secure the property, stop what is spreading, and log the first readings. Because ${meta.differentiator}, the emergency response is built to protect occupants and keep the claim moving from hour one.`,
      },
      {
        q: `Will you deal with my insurance?`,
        a: `Yes. We document every step and coordinate with your adjuster, so ${meta.painPoint.toLowerCase()} is handled once and the paperwork does not become a second headache.`,
      },
    ];
  }

  if (isCompanyPage(page)) {
    return [
      {
        q: `Are you on my insurer's vendor list?`,
        a: `Most of the time, yes. As ${meta.synonym}, we document the work to insurer standards and coordinate directly with adjusters across ${location}, so the approval process is usually smooth.`,
      },
      {
        q: `Who do you work with?`,
        a: `${meta.audiences[0]}, ${meta.audiences[1]}, ${meta.audiences[2]} and ${meta.audiences[3]} across ${location}. The approach is the same; only the timing and access change.`,
      },
      {
        q: `What does the whole process look like?`,
        a: `First call, on-site assessment, mitigation and drying, then documentation and handover. Because ${meta.differentiator}, you always know where your property and your claim stand.`,
      },
    ];
  }

  return [
    {
      q: `Should I start with a service or my city?`,
      a: `If you want the full picture of how a restoration works, start with the service page. If you already know your location and just need a crew out, jump straight to your city.`,
    },
    {
      q: `Do you cover emergencies?`,
      a: `Yes. The emergency pages cover same-day and after-hours water, mould, fire and flood response. Call and we will give you a real arrival window.`,
    },
    {
      q: `Can I just call instead of picking a page?`,
      a: `Yes. Call us, tell us what happened and your coverage, and we will point you to the right service and get a crew moving.`,
    },
  ];
}
