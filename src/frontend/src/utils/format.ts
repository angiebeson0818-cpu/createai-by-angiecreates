/**
 * @file utils/format.ts
 * @description Pure formatting utility functions used throughout CREATEai.
 * All functions are stateless and side-effect-free — safe to call anywhere.
 */

import { SubscriptionTier } from "@/types";

// ── Credits ───────────────────────────────────────────────────────────────

/**
 * Format a bigint credit balance as a locale-aware string with thousands separators.
 *
 * @param credits - The raw credit balance from the backend (stored as bigint).
 * @returns A human-readable string with commas and no decimal places.
 *
 * @example
 *   formatCredits(1000n)    // "1,000"
 *   formatCredits(12500n)   // "12,500"
 *   formatCredits(0n)       // "0"
 */
export function formatCredits(credits: bigint): string {
  return Number(credits).toLocaleString("en-US", { maximumFractionDigits: 0 });
}

// ── Timestamps ────────────────────────────────────────────────────────────

/**
 * Convert an Internet Computer nanosecond timestamp (bigint) to a readable date string.
 * IC timestamps are nanoseconds since UNIX epoch; JavaScript Date uses milliseconds.
 *
 * @param timestamp - Nanosecond timestamp from the IC backend.
 * @returns A locale-formatted date string (e.g. "Apr 27, 2026").
 *
 * @example
 *   formatDate(1714167600000000000n) // "Apr 26, 2024"
 */
export function formatDate(timestamp: bigint): string {
  const milliseconds = Number(timestamp / 1_000_000n);
  return new Date(milliseconds).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ── Subscription Tiers ────────────────────────────────────────────────────

/**
 * Convert a SubscriptionTier enum value to the display name shown in the UI.
 * Maps directly to the plan names on the Pricing page.
 *
 * @param tier - The SubscriptionTier enum value.
 * @returns A formatted plan name string.
 *
 * @example
 *   formatSubscriptionTier(SubscriptionTier.none)    // "Free"
 *   formatSubscriptionTier(SubscriptionTier.small)   // "Creator"
 *   formatSubscriptionTier(SubscriptionTier.medium)  // "Studio"
 *   formatSubscriptionTier(SubscriptionTier.big)     // "Pro"
 *   formatSubscriptionTier(SubscriptionTier.premium) // "Agency"
 *   formatSubscriptionTier(SubscriptionTier.extreme) // "Enterprise"
 */
export function formatSubscriptionTier(tier: SubscriptionTier): string {
  const names: Record<SubscriptionTier, string> = {
    [SubscriptionTier.none]: "Free",
    [SubscriptionTier.small]: "Creator",
    [SubscriptionTier.medium]: "Studio",
    [SubscriptionTier.big]: "Pro",
    [SubscriptionTier.premium]: "Agency",
    [SubscriptionTier.extreme]: "Enterprise",
  };
  return names[tier] ?? "Free";
}

// ── Principals ────────────────────────────────────────────────────────────

/**
 * Truncate an Internet Identity principal string for compact display.
 * Shows the first 8 characters, an ellipsis, and the last 4 characters.
 * If the principal is too short to truncate it is returned as-is.
 *
 * @param principal - The full principal string (e.g. from identity.getPrincipal().toText()).
 * @returns A short display-safe version of the principal.
 *
 * @example
 *   truncatePrincipal("rdmx6-jaaaa-aaaah-qdrqq-cai") // "rdmx6-ja...q-cai"
 *   truncatePrincipal("abc")                          // "abc"
 */
export function truncatePrincipal(principal: string): string {
  if (principal.length <= 16) return principal;
  return `${principal.slice(0, 8)}...${principal.slice(-4)}`;
}

// ── Class Names ───────────────────────────────────────────────────────────

/**
 * Conditionally join Tailwind class strings, filtering falsy values.
 * A lightweight alternative to the `clsx` library for simple use-cases.
 *
 * @param classes - Any number of class strings or falsy values to filter out.
 * @returns A single trimmed class string with falsy entries removed.
 *
 * @example
 *   classNames("px-4", isActive && "bg-primary", null, "text-sm")
 *   // "px-4 bg-primary text-sm"  (when isActive is true)
 *   // "px-4 text-sm"             (when isActive is false)
 */
export function classNames(
  ...classes: (string | undefined | false | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}
