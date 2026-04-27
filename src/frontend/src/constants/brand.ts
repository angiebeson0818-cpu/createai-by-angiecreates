/**
 * @file constants/brand.ts
 * @description Centralized brand strings, route constants, and asset paths for
 * CREATEai by angieCREATEs. Import from this file wherever a brand name, URL,
 * or asset path is needed so that changes propagate everywhere automatically.
 */

// ── Identity ──────────────────────────────────────────────────────────────

/** Full product name including creator attribution. */
export const BRAND_NAME = "CREATEai by angieCREATEs" as const;

/** Short product name used in compact UI contexts (navbar, page titles). */
export const BRAND_SHORT = "CREATEai" as const;

/** Hero tagline used in the main landing page headline. */
export const BRAND_TAGLINE = "The Future of Fashion Design" as const;

/**
 * One-sentence platform description used in meta tags,
 * hero subtitles, and SEO content.
 */
export const BRAND_DESCRIPTION =
  "The all-in-one AI fashion platform for designers who refuse to be contained." as const;

// ── Contact & Legal ───────────────────────────────────────────────────────

/** Primary contact email address for Angela Beson / angieCREATEs. */
export const CONTACT_EMAIL = "angie@angiecreates.com" as const;

/** External brand website link. */
export const CONTACT_WEBSITE = "https://angiecreates.pro" as const;

/**
 * Support contact address.
 * Users seeking billing, refunds, or account help should use this address.
 */
export const SUPPORT_EMAIL = "angie@angiecreates.com" as const;

/**
 * Image retention policy warning shown near any generated output.
 * Images are stored server-side but expire after 48 hours.
 */
export const IMAGE_DELETION_WARNING =
  "Note: Generated images are automatically deleted after 48 hours. Download your designs to keep them." as const;

// ── Studio Routes ─────────────────────────────────────────────────────────

/**
 * Maps each studio's stable ID to its URL path.
 * Keep in sync with the route definitions in App.tsx.
 * @example
 *   <Link to={STUDIO_ROUTES['design']}>Open Design Atelier</Link>
 */
export const STUDIO_ROUTES: Record<string, string> = {
  design: "/studio/design",
  "virtual-try-on": "/studio/virtual-try-on",
  models: "/studio/models",
  stylist: "/studio/stylist",
  branding: "/studio/branding",
  "tech-pack": "/studio/tech-pack",
  trends: "/studio/trends",
} as const;

// ── App Routes ────────────────────────────────────────────────────────────

/**
 * All top-level application routes in one place.
 * Use these constants in <Link to={...}> and programmatic navigation
 * so typos cause a TypeScript error rather than a silent 404.
 */
export const ALL_ROUTES = {
  /** Landing / home page. */
  home: "/",
  /** Features explorer — all 48 studio features in one grid. */
  features: "/features",
  /** Pricing page — credit packs and subscription plans. */
  pricing: "/pricing",
  /** Community gallery — public AI designs from all creators. */
  community: "/community",
  /** Developer docs — API reference and key management. */
  developers: "/developers",
  /** About page — brand story and team. */
  about: "/about",
  /** Contact page — Angela Beson's contact details. */
  contact: "/contact",
  /** Terms of Service. */
  terms: "/terms",
  /** Privacy Policy. */
  privacy: "/privacy",
  /** Authenticated user dashboard. */
  dashboard: "/dashboard",
  /** Nail Atelier showcase page. */
  nailAtelier: "/nail-atelier",
} as const;

// ── Static Asset Paths ────────────────────────────────────────────────────

/**
 * Paths to static assets served from the /public folder.
 * Using constants prevents broken references when files are renamed.
 */
export const ASSET_PATHS = {
  /**
   * Official CREATEai / angieCREATEs onyx logo used in the navbar.
   * High-resolution PNG with transparent background.
   */
  logo: "/assets/onyx_500-019d4b2d-dc4c-7172-9071-c2b206069bbc.png",

  /**
   * "Angin Water" dramatic water-scene image used as the landing page
   * hero background with a dark overlay.
   */
  heroBackground: "/assets/bg-angin-water.png",

  /**
   * Angela Beson — founder portrait photo.
   * Used in the hero, About page, Contact page, and Brand Vision section.
   */
  portrait: "/assets/angingray-019d4b2d-e30e-7214-a387-48b6bdcb3136.png",

  /** Fallback placeholder image when a generated asset URL has expired. */
  placeholder: "/assets/images/placeholder.svg",
} as const;
