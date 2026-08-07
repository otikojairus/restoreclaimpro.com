import type { Metadata } from "next";
import { Fraunces, Public_Sans } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { SITE_NAME, absoluteUrl, getSiteUrl } from "@/lib/site-data";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} | Insurance Restoration — Water, Mold & Fire Damage`,
    template: "%s",
  },
  description:
    "IICRC-trained water damage, mould remediation, fire & flood restoration and sewage cleanup across Canada. 24/7 dispatch with claim documentation on every visit.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} | Water, Mold & Fire Damage Restoration`,
    description:
      "Insurance restoration for water, mould, fire, flood and sewage damage across Canada. Documented for your claim, 24/7 dispatch.",
    url: absoluteUrl("/"),
    type: "website",
    siteName: SITE_NAME,
    locale: "en_CA",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-CA" className={`${fraunces.variable} ${publicSans.variable}`}>
      <body>
        <SiteNavbar />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
