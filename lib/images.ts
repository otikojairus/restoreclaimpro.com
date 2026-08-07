import { SeoPage, isCityPage, pageLocation, serviceFamily, serviceTopicLabel } from "@/lib/site-data";

export type SiteImage = {
  src: string;
  width: number;
  height: number;
};

// Pexels CDN URLs. Each photo was verified against its description so the imagery
// matches the restoration context (flooded rooms, mould, fire damage, working crews)
// instead of generic or unrelated stock.
const pexels = (id: string) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&fit=crop&dpr=1`;

const IMG = {
  crewRebuild: { src: pexels("5493654"), width: 1600, height: 1000 },
  technician: { src: pexels("5691521"), width: 1600, height: 1000 },
  floodedRoom: { src: pexels("10631759"), width: 1600, height: 1000 },
  leakingPipe: { src: pexels("15206136"), width: 1600, height: 1000 },
  peelingWall: { src: pexels("36050822"), width: 1600, height: 1000 },
  moldInspection: { src: pexels("18351809"), width: 1600, height: 1000 },
  mildewWall: { src: pexels("7434331"), width: 1600, height: 1000 },
  moldSpores: { src: pexels("18063447"), width: 1600, height: 1000 },
  fireKitchen: { src: pexels("10252682"), width: 1600, height: 1000 },
  fireDebris: { src: pexels("19832605"), width: 1600, height: 1000 },
  charredInterior: { src: pexels("10252687"), width: 1600, height: 1000 },
  charredBuilding: { src: pexels("12736402"), width: 1600, height: 1000 },
  floodHouse: { src: pexels("28447774"), width: 1600, height: 1000 },
  floodBasement: { src: pexels("4092026"), width: 1600, height: 1000 },
  floodStreet: { src: pexels("14216445"), width: 1600, height: 1000 },
  collapsedCeiling: { src: pexels("30499666"), width: 1600, height: 1000 },
  debrisRoom: { src: pexels("18865386"), width: 1600, height: 1000 },
} as const;

type FamilyImageSet = { hero: SiteImage; secondary: SiteImage; subject: string };

const FAMILY_IMAGES: Record<string, FamilyImageSet> = {
  "/water-damage-restoration": {
    hero: IMG.floodedRoom,
    secondary: IMG.leakingPipe,
    subject: "a flooded room being dried after water damage",
  },
  "/mold-remediation": {
    hero: IMG.moldInspection,
    secondary: IMG.mildewWall,
    subject: "an inspector checking mould on interior walls",
  },
  "/fire-damage-restoration": {
    hero: IMG.fireKitchen,
    secondary: IMG.fireDebris,
    subject: "a kitchen damaged by fire being cleared for restoration",
  },
  "/flood-damage-restoration": {
    hero: IMG.floodHouse,
    secondary: IMG.floodBasement,
    subject: "a house surrounded by floodwater awaiting restoration",
  },
  "/sewage-cleanup": {
    hero: IMG.collapsedCeiling,
    secondary: IMG.debrisRoom,
    subject: "a damaged room being prepped for cleanup and sanitation",
  },
};

const EMERGENCY_IMAGES: Record<string, FamilyImageSet> = {
  "/emergency-water-damage-restoration": {
    hero: IMG.leakingPipe,
    secondary: IMG.floodedRoom,
    subject: "a leaking pipe causing active water damage",
  },
  "/emergency-mold-remediation": {
    hero: IMG.moldSpores,
    secondary: IMG.mildewWall,
    subject: "mould growth spreading on an interior surface",
  },
  "/emergency-fire-smoke-damage": {
    hero: IMG.charredBuilding,
    secondary: IMG.charredInterior,
    subject: "a building damaged by fire and smoke",
  },
  "/emergency-flood-sewage-cleanup": {
    hero: IMG.floodStreet,
    secondary: IMG.floodHouse,
    subject: "a flooded street and property after heavy rain",
  },
};

const FALLBACK_SET: FamilyImageSet = FAMILY_IMAGES["/water-damage-restoration"];

function baseSetFor(page: SeoPage): FamilyImageSet {
  if (EMERGENCY_IMAGES[page.pageSlug]) return EMERGENCY_IMAGES[page.pageSlug];
  const family = serviceFamily(page);
  return FAMILY_IMAGES[family] || FALLBACK_SET;
}

export function heroImageFor(page: SeoPage): { image: SiteImage; alt: string } {
  const set = baseSetFor(page);
  const topic = serviceTopicLabel(page);
  const location = pageLocation(page);
  const alt = isCityPage(page)
    ? `${set.subject}, representing ${topic.toLowerCase()} service in ${location}`
    : `${set.subject}, representing ${topic.toLowerCase()} service across ${location}`;
  return { image: set.hero, alt };
}

export function secondaryImageFor(page: SeoPage): { image: SiteImage; alt: string } {
  const set = baseSetFor(page);
  const location = pageLocation(page);
  const alt = `${set.subject}, on a restoration call in ${location}`;
  return { image: set.secondary, alt };
}

/** Hero image for the homepage. */
export const HOME_HERO: { image: SiteImage; alt: string } = {
  image: IMG.crewRebuild,
  alt: "A RestoreClaimPro crew rebuilding an interior after water, mould or fire damage in Canada",
};

/** Banner image for the services index page. */
export const SERVICES_HERO: { image: SiteImage; alt: string } = {
  image: IMG.technician,
  alt: "A RestoreClaimPro technician restoring a damaged interior across Canada",
};

/** Small card image for a service pillar, used in listing grids. */
export function pillarCardImage(slug: string): { image: SiteImage; alt: string } {
  const set = FAMILY_IMAGES[slug] || FALLBACK_SET;
  return { image: set.hero, alt: `${set.subject}, illustrating the service` };
}
