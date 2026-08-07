import { getSiteUrl } from "@/lib/site-data";

export const revalidate = 3600;

export function GET() {
  const siteUrl = getSiteUrl();
  const content = [
    "User-Agent: *",
    "Allow: /",
    "",
    "User-Agent: facebookexternalhit",
    "Allow: /",
    "",
    "User-Agent: Twitterbot",
    "Allow: /",
    "",
    "User-Agent: LinkedInBot",
    "Allow: /",
    "",
    "User-Agent: WhatsApp",
    "Allow: /",
    "",
    "User-Agent: Googlebot",
    "Allow: /",
    "",
    "User-Agent: Bingbot",
    "Allow: /",
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
