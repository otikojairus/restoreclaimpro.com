# RestoreClaimPro — pSEO site

Programmatic SEO site for **insurance restoration** (water damage, mould remediation,
fire & flood restoration, sewage cleanup) across Canada.

Built on Next.js (App Router) + Tailwind CSS v4 with a completely custom design system.

## Pages

- 5 restoration pillar pages
- 4 national emergency pages
- 4 near-me / cost pages
- 3 company / trust pages
- 117 city × service pages (3 services × 39 cities across 10 provinces)
- Homepage, services index, sitemap, robots.txt

All 133 landing pages are generated from `pSEO - restoreclaimpro.com.xlsx` into
`lib/restoreclaim-pages.json` (see `/tmp/gen_rcp_pages.py` as the reference generator).

## Development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm run start     # serve the production build
```

## Docker

```bash
docker compose up --build
```

Serves on port 3000. Set `NEXT_PUBLIC_SITE_URL` for the canonical domain.
