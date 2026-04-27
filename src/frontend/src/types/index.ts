/**
 * @file types/index.ts
 * @description Centralized TypeScript interfaces and types for CREATEai by angieCREATEs.
 * All data shapes used across the app are defined here — import from this file
 * instead of defining types locally in pages or components.
 */

import type { Principal } from "@dfinity/principal";

// ── Enums ─────────────────────────────────────────────────────────────────

/**
 * Subscription tier for a user account.
 * Maps to plan names in the pricing page:
 *   none   → Free / unsubscribed
 *   small  → Creator ($8/mo)
 *   medium → Studio ($25/mo)
 *   big    → Pro ($60/mo)
 *   premium → Agency ($150/mo)
 *   extreme → Enterprise ($300/mo)
 */
export enum SubscriptionTier {
  none = "none",
  small = "small",
  medium = "medium",
  big = "big",
  premium = "premium",
  extreme = "extreme",
}

/**
 * Role assigned to a user within the platform.
 * Used to gate admin features and team-level permissions.
 *   admin → Full platform access, can manage all accounts
 *   user  → Standard authenticated user
 *   guest → Unauthenticated visitor (read-only public content)
 */
export enum UserRole {
  admin = "admin",
  user = "user",
  guest = "guest",
}

// ── Core User Types ───────────────────────────────────────────────────────

/**
 * Full profile for an authenticated CREATEai user.
 * Returned by the backend after login and stored in React Query cache.
 * @example
 *   const { data: profile } = useUserProfile();
 *   console.log(profile?.username); // "AngieCREATEs"
 */
export interface UserProfile {
  /** Display name chosen by the user at onboarding. */
  username: string;
  /** Internet Identity principal that uniquely identifies this account. */
  principal: Principal;
  /** Remaining AI generation credits (stored as bigint on-chain). */
  credits: bigint;
  /** True if the user has an active paid subscription. */
  subscriptionActive: boolean;
  /** The current subscription tier. Defaults to 'none' for free accounts. */
  subscriptionTier: SubscriptionTier;
  /** List of active API keys for programmatic access. */
  apiKeys: string[];
  /** Principals of any team members with access to this workspace. */
  teamMembers: Principal[];
  /** Nanosecond timestamp of account creation (IC time). Optional for stub compat. */
  createdAt?: bigint;
}

// ── Design Types ──────────────────────────────────────────────────────────

/**
 * Flexible metadata bag attached to every saved design.
 * The required keys ensure consistent listing UIs; additional keys
 * carry studio-specific data (prompt, model, fabric swatches, etc.).
 */
export interface DesignMetadata {
  /** Human-readable title shown in galleries and dashboards. */
  title: string;
  /** Which studio produced this design (e.g. 'design', 'virtual-try-on'). */
  studioType: string;
  /** Optional username of the creator (used for community gallery attribution). */
  createdBy?: string;
  /** Catch-all for studio-specific fields (prompt text, seed, resolution, etc.). */
  [key: string]: unknown;
}

/**
 * A saved AI-generated design artifact.
 * Persisted in the IC backend and displayed in the user dashboard,
 * community gallery, and studio history panels.
 */
export interface Design {
  /** Unique design ID (UUID string from the backend). */
  id: string;
  /** Human-readable title for the design. */
  title: string;
  /** Direct CDN URL for the generated image (may expire after 48 hours). */
  imageUrl?: string;
  /** Which studio produced this design. */
  studioId: string;
  /** Whether this design is visible in the public community gallery. */
  isPublic: boolean;
  /** Creation timestamp in nanoseconds (IC time). */
  createdAt: bigint;
  /** Studio-specific metadata (prompts, model settings, etc.). */
  metadata: DesignMetadata;
}

// ── Studio Types ──────────────────────────────────────────────────────────

/**
 * A single feature card within a studio page.
 * Rendered as a shimmer tile in FeaturesPage and as a detail card in StudioPage.
 */
export interface StudioFeature {
  /** Stable machine-readable ID used for routing and analytics. */
  id: string;
  /** Elevated editorial title shown in the UI (e.g. "Sketch Alchemy"). */
  title: string;
  /** One-paragraph description of what this feature does. */
  description: string;
  /** Emoji or icon character used as a visual accent. */
  icon: string;
  /** Optional badge label (e.g. "NEW", "BETA") shown on the card. */
  badge?: string;
}

/**
 * A frequently-asked question and its answer for a studio help section.
 */
export interface FAQ {
  /** The question text. */
  q: string;
  /** The answer text. */
  a: string;
}

/**
 * Full definition of one of the 7 AI studios.
 * Used in studioData.ts, routing (App.tsx), studio pages, navbar, and features explorer.
 * @example
 *   import { studios } from '@/data/studioData';
 *   const design = studios.find(s => s.id === 'design');
 */
export interface Studio {
  /**
   * Stable lowercase ID used in routes and data lookups.
   * One of: 'design' | 'virtual-try-on' | 'models' | 'stylist' | 'branding' | 'tech-pack' | 'trends'
   */
  id: string;
  /** Editorial studio name (e.g. "The Design Atelier"). */
  name: string;
  /** Short brand tagline shown under the studio name. */
  tagline: string;
  /** Longer description paragraph for the studio hero section. */
  description: string;
  /** URL path for this studio's page (e.g. '/studio/design'). */
  path: string;
  /** Symbol/emoji icon used in nav and cards. */
  icon: string;
  /** Tailwind gradient class string for background accents. */
  color: string;
  /** Optional path to a hero background image asset. */
  heroImage?: string;
  /** Ordered list of feature tiles rendered on the studio page. */
  features: StudioFeature[];
  /** Optional editorial insight quote shown in the studio 'Philosophy' section. */
  insight?: string;
  /** Optional FAQ items rendered at the bottom of the studio page. */
  faq?: FAQ[];
}

// ── Monetization Types ────────────────────────────────────────────────────

/**
 * A one-time credit bundle that users can purchase.
 * Displayed in the pricing page 'Credit Packs' section.
 * @example
 *   { id: 'pack-sm', name: 'Starter', credits: 100, price: 5 }
 */
export interface CreditPack {
  /** Stable machine-readable ID. */
  id: string;
  /** Display name for the pack (e.g. "Starter", "Studio"). */
  name: string;
  /** Number of credits included in this pack. */
  credits: number;
  /** Price in USD (dollars, not cents). */
  price: number;
  /** Highlight this pack as the most popular option. */
  popular?: boolean;
}

/**
 * A monthly or annual subscription plan.
 * Displayed in the pricing page 'Plans' section.
 * @example
 *   { id: 'creator', name: 'Creator', price: 8, credits: 200, features: ['...'] }
 */
export interface SubscriptionPlan {
  /** Stable machine-readable ID. */
  id: string;
  /** Display name for the plan (e.g. "Creator", "Studio Pro"). */
  name: string;
  /** Monthly price in USD. */
  price: number;
  /** Credits included per billing cycle. */
  credits: number;
  /** Bullet-point feature list for the pricing card. */
  features: string[];
  /** Highlight this plan as the most popular or recommended option. */
  popular?: boolean;
}

// ── Developer / API Types ─────────────────────────────────────────────────

/**
 * Describes a single REST-style API endpoint in the Developers docs page.
 * @example
 *   { id: 'gen-design', method: 'POST', path: '/API/1.1/wf/clothing', credits: 5 }
 */
export interface ApiEndpoint {
  /** Stable machine-readable ID. */
  id: string;
  /** HTTP method in uppercase (GET, POST, PUT, DELETE). */
  method: string;
  /** Endpoint path relative to the API base URL. */
  path: string;
  /** Plain-English description of what this endpoint does. */
  description: string;
  /** Credit cost per successful call. */
  credits: number;
  /** Which studio this endpoint belongs to (maps to Studio.id). */
  studio: string;
}
