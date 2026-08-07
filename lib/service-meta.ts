// Concrete, service-specific detail used to generate genuinely different copy per
// service family instead of dropping one keyword into an otherwise identical template.
// Everything here is written to read like a restoration crew explaining the work to a
// homeowner or an adjuster, not like keyword filler.
export type ServiceMeta = {
  audiences: string[];
  items: string[];
  differentiator: string;
  painPoint: string;
  synonym: string;
  certifications: string[];
  timeline: string;
};

export const SERVICE_META: Record<string, ServiceMeta> = {
  "/water-damage-restoration": {
    audiences: ["homeowners after a burst pipe or appliance leak", "property managers with rental units", "strata and condo councils", "insurance adjusters and brokers"],
    items: ["extracting the standing water", "structural drying with air movers and dehumidifiers", "moisture mapping and drying verification"],
    differentiator: "we log the drying curve and document every reading so your claim file is complete before the adjuster asks",
    painPoint: "a hidden leak that turns into rot, mould or a denied claim",
    synonym: "the water restoration service",
    certifications: ["IICRC WRT", "IICRC ASD"],
    timeline: "most water calls get a crew out within hours, with the dry-out scheduled in days, not weeks",
  },
  "/mold-remediation": {
    audiences: ["homeowners with visible mould", "landlords and tenants working through responsibility", "strata and condo councils", "real estate and insurance professionals"],
    items: ["containment and negative air pressure", "removal of mould-affected materials", "HEPA cleaning and clearance verification"],
    differentiator: "we contain the work area and verify clearance with a documented sampling protocol instead of just painting over the stain",
    painPoint: "mould that keeps coming back because the moisture source was never fixed",
    synonym: "the mould remediation",
    certifications: ["IICRC AMRT", "ACAC"],
    timeline: "mould jobs are typically quoted within a day and completed within days for most residential scope",
  },
  "/fire-damage-restoration": {
    audiences: ["homeowners after a kitchen or electrical fire", "landlords of rental properties", "commercial building owners", "insurance adjusters"],
    items: ["soot and smoke cleaning", "content pack-out and cleaning", "odour control and structural rebuild prep"],
    differentiator: "we separate salvageable contents from rebuild scope and document both so your claim reflects what was actually lost",
    painPoint: "smoke odour and soot that linger long after the fire is out",
    synonym: "the fire restoration",
    certifications: ["IICRC FSRT", "IICRC AMRT"],
    timeline: "emergency board-up and mitigation start the same day, with the rebuild planned in phases with your adjuster",
  },
  "/flood-damage-restoration": {
    audiences: ["homeowners in flood-prone areas", "property managers of multi-unit buildings", "basement owners after river or ground-water flooding", "insurance brokers"],
    items: ["pumping and water extraction", "category 3 sanitation and material removal", "structural drying and disinfection"],
    differentiator: "we treat flood water by its contamination category, so sanitation is handled correctly instead of just dried",
    painPoint: "a flooded basement that gets dried but never properly cleaned or sanitized",
    synonym: "the flood restoration",
    certifications: ["IICRC WRT", "IICRC ASD"],
    timeline: "extraction starts within hours, and sanitation and drying run in parallel with your claim",
  },
  "/sewage-cleanup": {
    audiences: ["homeowners with a sewage backup", "basement suite owners", "commercial property managers", "insurance adjusters"],
    items: ["hazardous waste removal", "removal and disposal of affected materials", "disinfection and structural drying"],
    differentiator: "we follow category 3 protocol for sewage, protecting occupants and leaving the space safely usable again",
    painPoint: "a sewage backup that gets wiped down but never properly decontaminated",
    synonym: "the sewage cleanup",
    certifications: ["IICRC WRT", "OSHA"],
    timeline: "backups are treated as emergencies with same-day extraction and decontamination",
  },
  "/emergency-water-damage-restoration": {
    audiences: ["homeowners with active flooding", "property managers after a pipe burst", "condo and strata councils", "insurance emergency lines"],
    items: ["stopping the source of water", "extraction and temporary protection", "drying setup and moisture mapping"],
    differentiator: "we roll a technician the same night so the water is out and the structure is drying before morning",
    painPoint: "water spreading through your home right now",
    synonym: "the emergency water response",
    certifications: ["IICRC WRT", "IICRC ASD"],
    timeline: "24/7 dispatch with a crew out the same night across most regions",
  },
  "/emergency-mold-remediation": {
    audiences: ["homeowners with spreading mould", "landlords and tenants", "strata councils", "real estate professionals"],
    items: ["sealing off the affected area", "containment and air scrubbing", "removal of mould-affected materials"],
    differentiator: "we contain the space first so spores stop spreading, then remove the source under negative air",
    painPoint: "mould spreading fast through a finished space",
    synonym: "the emergency mould response",
    certifications: ["IICRC AMRT", "ACAC"],
    timeline: "24/7 response with containment and air scrubbing started the same day",
  },
  "/emergency-fire-smoke-damage": {
    audiences: ["homeowners after a fire", "landlords of rental properties", "commercial building owners", "insurance emergency lines"],
    items: ["board-up and securing the property", "soot and smoke cleaning", "odour control and content salvage"],
    differentiator: "we secure the property, stop the smoke from setting, and start salvage before the claim even opens",
    painPoint: "a fire that has left your home open and smoke-damaged",
    synonym: "the emergency fire response",
    certifications: ["IICRC FSRT", "IICRC AMRT"],
    timeline: "24/7 dispatch with board-up and mitigation starting the same night",
  },
  "/emergency-flood-sewage-cleanup": {
    audiences: ["homeowners with a flooded basement", "property managers after a sewage backup", "basement suite owners", "insurance emergency lines"],
    items: ["pumping out standing water", "hazardous waste and material removal", "sanitation and drying setup"],
    differentiator: "we treat the water by contamination category and get extraction and sanitation running in one visit",
    painPoint: "a basement filling with water or sewage right now",
    synonym: "the emergency flood and sewage response",
    certifications: ["IICRC WRT", "OSHA"],
    timeline: "24/7 dispatch with extraction and sanitation starting the same day",
  },
  "/insurance-approved-contractor": {
    audiences: ["homeowners filing a claim", "property managers with repeat losses", "condo and strata councils", "insurance adjusters and brokers"],
    items: ["claim documentation and photo logging", "adjuster coordination and estimates", "approved mitigation and rebuild scopes"],
    differentiator: "we have documented the work for every major Canadian insurer's preferred vendor list and speak adjuster fluently",
    painPoint: "a claim that drags because the paperwork and the contractor were never aligned",
    synonym: "the insurance-approved restoration company",
    certifications: ["IICRC WRT", "IICRC AMRT", "IICRC FSRT"],
    timeline: "we open your claim file the same day and keep the adjuster updated at every drying checkpoint",
  },
  "/disaster-restoration-company": {
    audiences: ["homeowners after a natural disaster", "property managers of multi-unit buildings", "condo and strata councils", "municipal and business contacts"],
    items: ["disaster triage and site assessment", "emergency mitigation and protection", "full-scope restoration and rebuild"],
    differentiator: "we run disaster response as a system — triage, stabilize, restore, document — so nothing gets missed in the chaos",
    painPoint: "a storm, flood or fire leaving you with no clear next step",
    synonym: "the disaster restoration company",
    certifications: ["IICRC WRT", "IICRC AMRT", "IICRC FSRT"],
    timeline: "disaster response starts with triage the same day and a clear restoration plan within 24 hours",
  },
  "/property-restoration-company": {
    audiences: ["homeowners", "landlords and rental operators", "strata and condo councils", "commercial building owners"],
    items: ["damage assessment and scoping", "mitigation and structural drying", "finishing, repair and rebuild coordination"],
    differentiator: "we take a property from damage to done under one roof, so you are not juggling a mitigator, a painter and a contractor",
    painPoint: "a damaged property stuck between multiple contractors with no single point of accountability",
    synonym: "the property restoration company",
    certifications: ["IICRC WRT", "IICRC AMRT", "IICRC FSRT"],
    timeline: "we carry a property from mitigation through rebuild on a single schedule you can track",
  },
};

const FALLBACK_META: ServiceMeta = SERVICE_META["/water-damage-restoration"];

export function serviceMetaFor(key: string): ServiceMeta {
  return SERVICE_META[key] || FALLBACK_META;
}

export function hashIndex(value: string, mod: number) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash % mod;
}
