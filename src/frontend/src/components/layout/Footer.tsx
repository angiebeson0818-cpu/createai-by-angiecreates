/**
 * @file components/layout/Footer.tsx
 * @description Site-wide footer for CREATEai by angieCREATEs.
 *
 * Renders four columns in a responsive grid:
 *  1. Brand column — logo, tagline, social links, and contact details.
 *  2. Studios — links to all 7 editorial studio pages.
 *  3. Platform — links to Features, Pricing, Community, and Developers.
 *  4. Company — About, Contact, Terms of Service, and Privacy Policy.
 *
 * All brand strings, contact details, and routes are imported from
 * constants/brand.ts so changes propagate everywhere automatically.
 * Studio names and paths are imported from data/studioData.ts to stay
 * in sync with the rest of the application.
 *
 * Accessibility patterns:
 *  - Root element is a semantic <footer>.
 *  - Each navigation column has aria-label="Footer navigation — <section>".
 *  - Social media icon anchors include descriptive aria-label attributes.
 *
 * @example
 *   // Used once in Layout.tsx — no props required
 *   <Footer />
 */

import { Link } from "@tanstack/react-router";
import { Globe, Mail } from "lucide-react";
import { SiInstagram, SiPinterest, SiX } from "react-icons/si";
import {
  ALL_ROUTES,
  ASSET_PATHS,
  BRAND_NAME,
  BRAND_SHORT,
  CONTACT_EMAIL,
  CONTACT_WEBSITE,
  STUDIO_ROUTES,
} from "../../constants/brand";
import { studios } from "../../data/studioData";

/** Derive display name and path from the canonical studioData source. */
const studioLinks = studios.map((s) => ({
  label: s.name,
  path: STUDIO_ROUTES[s.id] ?? s.path,
}));

const platformLinks = [
  { label: "All AI Features", path: ALL_ROUTES.features },
  { label: "Pricing", path: ALL_ROUTES.pricing },
  { label: "Community", path: ALL_ROUTES.community },
  { label: "Developers", path: ALL_ROUTES.developers },
];

const companyLinks = [
  { label: "About", path: ALL_ROUTES.about },
  { label: "Contact", path: ALL_ROUTES.contact },
  { label: "Terms of Service", path: ALL_ROUTES.terms },
  { label: "Privacy Policy", path: ALL_ROUTES.privacy },
];

/** Hostname resolved at runtime for the caffeine.ai UTM link. */
const hostname =
  typeof window !== "undefined" ? window.location.hostname : "angiecreates.pro";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-14">
        {/* ── Top Grid ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand column — spans 2 columns on lg */}
          <div className="lg:col-span-2">
            <Link
              to={ALL_ROUTES.home}
              className="flex items-center gap-2.5 mb-5 w-fit group"
              aria-label={`${BRAND_NAME} — Home`}
            >
              <img
                src={ASSET_PATHS.logo}
                alt="angieCREATEs logo"
                className="w-8 h-8 object-contain rounded-full ring-1 ring-gold/30 group-hover:ring-gold/60 transition-all"
              />
              <span className="font-display text-xl font-bold gradient-text">
                {BRAND_SHORT}
              </span>
              <span className="text-muted-foreground font-body text-xs">
                by angieCREATEs
              </span>
            </Link>

            <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-xs">
              The all-in-one AI fashion platform for designers, brands, and
              visionaries. Seven studios. Infinite creative power.
            </p>

            {/* Social links */}
            <div
              className="flex gap-4 mb-6"
              aria-label="CREATEai social media links"
            >
              <a
                href="https://instagram.com/angiecreates"
                className="text-muted-foreground hover:text-gold transition-colors"
                aria-label="CREATEai on Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiInstagram className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="https://x.com/angiecreates"
                className="text-muted-foreground hover:text-gold transition-colors"
                aria-label="CREATEai on X (formerly Twitter)"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiX className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="https://pinterest.com/angiecreates"
                className="text-muted-foreground hover:text-gold transition-colors"
                aria-label="CREATEai on Pinterest"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiPinterest className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>

            {/* Contact details */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe
                  className="w-3.5 h-3.5 text-gold shrink-0"
                  aria-hidden="true"
                />
                <a
                  href={CONTACT_WEBSITE}
                  className="hover:text-gold transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit angiecreates.pro website"
                >
                  angiecreates.pro
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail
                  className="w-3.5 h-3.5 text-gold shrink-0"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="hover:text-gold transition-colors"
                  aria-label={`Email ${CONTACT_EMAIL}`}
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </div>

          {/* Studios column */}
          <nav aria-label="Footer navigation — Studios">
            <h4 className="font-semibold text-foreground mb-4 text-xs uppercase tracking-widest font-body">
              Studios
            </h4>
            <ul className="space-y-2.5">
              {studioLinks.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-sm text-muted-foreground hover:text-gold transition-colors font-body"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Platform column */}
          <nav aria-label="Footer navigation — Platform">
            <h4 className="font-semibold text-foreground mb-4 text-xs uppercase tracking-widest font-body">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {platformLinks.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-sm text-muted-foreground hover:text-gold transition-colors font-body"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company column */}
          <nav aria-label="Footer navigation — Company">
            <h4 className="font-semibold text-foreground mb-4 text-xs uppercase tracking-widest font-body">
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-sm text-muted-foreground hover:text-gold transition-colors font-body"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ── Divider ───────────────────────────────────────────────── */}
        <div className="section-divider mb-6" />

        {/* ── Bottom Bar ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-body">
          <p>
            &copy; {year} angieCREATEs / angiecreates.pro. All rights reserved.
          </p>
          <p>
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
