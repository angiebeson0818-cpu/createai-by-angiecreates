/**
 * @file pages/DashboardPage.tsx
 * @description Authenticated user dashboard for CREATEai by angieCREATEs.
 *
 * Sections:
 *  - Auth gate    — redirects unauthenticated visitors with a branded prompt
 *  - Profile setup — onboarding flow for first-time users (no profile yet)
 *  - Stats row    — live credits, plan, design count, team member count
 *  - Design grid  — last 6 designs from useAllUserDesigns(); empty state CTA
 *  - Studio inspiration — brand imagery panel
 *  - Sidebar      — founder card, plan card with credit bar, API keys
 *  - Team section — members list with invite and remove; empty state
 *  - Profile settings — display name, notifications
 *
 * All data sections show skeleton loaders while fetching and graceful
 * error messages on failure. No hardcoded sample data is used for real
 * user data; the designs grid shows an empty-state when the user has
 * no designs yet.
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Clock,
  Copy,
  CreditCard,
  Crown,
  Eye,
  EyeOff,
  Globe,
  Key,
  Layers,
  Loader2,
  Lock,
  Sparkles,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllUserDesigns,
  useApiKeys,
  useBalance,
  useCreateUserProfile,
  useGenerateApiKey,
  useSubscriptionTier,
  useTeamMembers,
  useUserProfile,
} from "../hooks/useQueries";
import type { SubscriptionTier } from "../types";
import {
  formatCredits,
  formatDate,
  formatSubscriptionTier,
  truncatePrincipal,
} from "../utils/format";

// ── Tier badge styling ────────────────────────────────────────────────────

const TIER_STYLES: Record<string, string> = {
  none: "bg-muted/30 text-muted-foreground border-border",
  free: "bg-muted/30 text-muted-foreground border-border",
  small: "bg-gold/10 text-gold border-gold/20",
  medium: "bg-gold/20 text-gold border-gold/40",
  big: "bg-gold/30 text-gold border-gold/60",
  premium: "bg-gold/35 text-gold border-gold/70",
  extreme: "bg-gold/40 text-gold border-gold/80",
};

// ── Inline error banner ───────────────────────────────────────────────────

function SectionError({ message }: { message: string }) {
  return (
    <div
      className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive"
      role="alert"
    >
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { identity } = useInternetIdentity();

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useUserProfile();

  const {
    data: balance,
    isLoading: balanceLoading,
    isError: balanceError,
  } = useBalance();

  const {
    data: tierRaw,
    isLoading: tierLoading,
    isError: tierError,
  } = useSubscriptionTier();

  const {
    data: designs,
    isLoading: designsLoading,
    isError: designsError,
  } = useAllUserDesigns();

  const {
    data: apiKeys,
    isLoading: apiKeysLoading,
    isError: apiKeysError,
  } = useApiKeys();

  const {
    data: teamMembers,
    isLoading: teamLoading,
    isError: teamError,
  } = useTeamMembers();

  const generateKey = useGenerateApiKey();
  const createProfile = useCreateUserProfile();

  const [revealedKeys, setRevealedKeys] = useState<Set<number>>(new Set());
  const [usernameInput, setUsernameInput] = useState("");
  const [inviteInput, setInviteInput] = useState("");

  // ── Unauthenticated gate ──────────────────────────────────────────────

  if (!identity) {
    return (
      <main
        id="main-content"
        aria-label="User Dashboard"
        className="min-h-screen flex items-center justify-center"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-b from-gold/60 to-gold/20 blur-md" />
              <div className="absolute -inset-[2px] rounded-full bg-gradient-to-b from-gold to-gold/40" />
              <img
                src="/assets/angingray-019d4b2d-e30e-7214-a387-48b6bdcb3136.png"
                alt="CREATEai founder"
                className="relative w-full h-full rounded-full object-cover object-top"
              />
            </div>
            <h1 className="font-display text-4xl font-bold mb-3">
              Your Creative Studio Awaits
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Sign in to access your personal dashboard — designs, credits, API
              keys, and your full creative history.
            </p>
            <Button
              className="bg-gold text-background hover:opacity-90 h-12 px-8 font-semibold"
              asChild
              aria-label="Return to home page"
              data-ocid="dashboard.primary_button"
            >
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // ── Full-page loading skeleton ────────────────────────────────────────

  if (profileLoading) {
    return (
      <main id="main-content" aria-label="User Dashboard" className="py-32">
        <div
          className="container mx-auto px-4"
          data-ocid="dashboard.loading_state"
        >
          <div className="mb-10 space-y-3">
            <Skeleton className="h-4 w-24 bg-muted" />
            <Skeleton className="h-10 w-64 bg-muted" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[1, 2, 3, 4].map((k) => (
              <Skeleton key={k} className="h-28 rounded-xl bg-muted" />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <Skeleton key={k} className="aspect-[4/5] rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ── Profile error ─────────────────────────────────────────────────────

  if (profileError) {
    return (
      <main
        id="main-content"
        aria-label="User Dashboard"
        className="min-h-screen flex items-center justify-center"
      >
        <div className="container mx-auto px-4 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">
            Could not load your profile
          </h2>
          <p className="text-muted-foreground mb-6">
            There was a problem connecting to the platform. Please refresh the
            page or try again shortly.
          </p>
          <Button
            aria-label="Reload the page"
            onClick={() => window.location.reload()}
            className="bg-gold text-background hover:opacity-90"
            data-ocid="dashboard.error_state"
          >
            Reload Page
          </Button>
        </div>
      </main>
    );
  }

  // ── Profile setup (first-time login) ─────────────────────────────────

  if (!profile) {
    return (
      <main
        id="main-content"
        aria-label="User Dashboard"
        className="min-h-screen flex items-center justify-center"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-card border border-border rounded-2xl overflow-hidden onyx-shimmer-border">
              <div className="h-32 relative overflow-hidden">
                <img
                  src="/assets/user-armor-gown.jpg"
                  alt="Design studio"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/90" />
              </div>
              <div className="p-8 text-center -mt-4">
                <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-7 h-7 text-gold" />
                </div>
                <h2 className="font-display text-2xl font-bold mb-1">
                  Set Up Your Profile
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Choose your creator name to join the CREATEai community.
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Your creator name"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="border-border bg-background focus:border-gold/50"
                    aria-label="Creator name"
                    data-ocid="dashboard.create_profile.input"
                  />
                  <Button
                    className="bg-gold text-background hover:opacity-90 shrink-0"
                    disabled={!usernameInput.trim() || createProfile.isPending}
                    aria-label="Create profile"
                    onClick={async () => {
                      try {
                        await createProfile.mutateAsync(usernameInput.trim());
                        toast.success("Profile created! Welcome to CREATEai.");
                      } catch {
                        toast.error("Could not create profile. Try again.");
                      }
                    }}
                    data-ocid="dashboard.create_profile.submit"
                  >
                    {createProfile.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Create"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Derived values ────────────────────────────────────────────────────

  /** Resolve tier — may be null/undefined while loading; fall back to 'none'. */
  const resolvedTier = (tierRaw as string | null | undefined) ?? "none";
  const tierLabel = formatSubscriptionTier(resolvedTier as SubscriptionTier);
  const tierStyle = TIER_STYLES[resolvedTier] ?? TIER_STYLES.none;
  const isElite = ["big", "premium", "extreme"].includes(resolvedTier);
  const creditDisplay = balance != null ? formatCredits(balance) : "—";

  // ── Handlers ─────────────────────────────────────────────────────────

  const handleGenerateKey = async () => {
    try {
      await generateKey.mutateAsync();
      toast.success("New API key generated!");
    } catch {
      toast.error("Failed to generate API key.");
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      toast.success("API key copied to clipboard.");
    });
  };

  const toggleReveal = (i: number) => {
    setRevealedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  // ── Main render ───────────────────────────────────────────────────────

  return (
    <main id="main-content" aria-label="User Dashboard">
      {/* ─── Dashboard Header Banner ──────────────────────────────── */}
      <section className="relative h-52 overflow-hidden">
        <img
          src="/assets/user-armor-gown.jpg"
          alt="Dashboard header backdrop"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

        {/* Floating profile card pinned to bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container mx-auto px-4">
            <div className="flex items-end gap-6">
              {/* Gold-framed profile photo */}
              <div className="relative shrink-0 translate-y-10">
                <div className="absolute -inset-[3px] rounded-2xl bg-gradient-to-b from-gold via-gold/70 to-gold/30" />
                <div className="absolute -inset-1 rounded-2xl bg-gold/20 blur-md" />
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden">
                  <img
                    src="/assets/angingray-019d4b2d-e30e-7214-a387-48b6bdcb3136.png"
                    alt={profile.username}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Username + tier badge */}
              <div className="pb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    {profile.username}
                  </h1>
                  {isElite && (
                    <Crown
                      className="w-5 h-5 text-gold shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <Badge className={tierStyle}>{tierLabel}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  angieCREATEs Member · CREATEai Platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Content ─────────────────────────────────────────── */}
      <section className="pt-16 pb-20">
        <div className="container mx-auto px-4">
          {/* ─── Stats Row ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
            data-ocid="dashboard.stats.section"
          >
            {/* Credits stat */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-xl p-5 flex flex-col gap-1 card-hover"
              data-ocid="dashboard.stat.item.1"
            >
              <CreditCard
                className="w-5 h-5 text-gold mb-2"
                aria-hidden="true"
              />
              <div className="font-display text-2xl font-bold gradient-text">
                {balanceLoading ? (
                  <Skeleton className="h-7 w-20 bg-muted" />
                ) : balanceError ? (
                  <span className="text-destructive text-base">Error</span>
                ) : (
                  creditDisplay
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Credits Available
              </div>
              <div className="mt-1">
                <Link
                  to="/pricing"
                  className="text-xs text-gold hover:underline"
                  aria-label="Add more credits on the pricing page"
                  data-ocid="dashboard.credits.cta"
                >
                  Add Credits →
                </Link>
              </div>
            </motion.div>

            {/* Plan stat */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="bg-card border border-border rounded-xl p-5 flex flex-col gap-1 card-hover"
              data-ocid="dashboard.stat.item.2"
            >
              <Sparkles className="w-5 h-5 text-gold mb-2" aria-hidden="true" />
              <div className="font-display text-2xl font-bold gradient-text">
                {tierLoading ? (
                  <Skeleton className="h-7 w-20 bg-muted" />
                ) : tierError ? (
                  <span className="text-destructive text-base">Error</span>
                ) : (
                  tierLabel
                )}
              </div>
              <div className="text-xs text-muted-foreground">Current Plan</div>
              <div className="mt-1">
                <Link
                  to="/pricing"
                  className="text-xs text-gold hover:underline"
                  aria-label="Upgrade your plan on the pricing page"
                  data-ocid="dashboard.plan.cta"
                >
                  Upgrade →
                </Link>
              </div>
            </motion.div>

            {/* Designs stat */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="bg-card border border-border rounded-xl p-5 flex flex-col gap-1 card-hover"
              data-ocid="dashboard.stat.item.3"
            >
              <Layers className="w-5 h-5 text-gold mb-2" aria-hidden="true" />
              <div className="font-display text-2xl font-bold gradient-text">
                {designsLoading ? (
                  <Skeleton className="h-7 w-12 bg-muted" />
                ) : designsError ? (
                  <span className="text-destructive text-base">Error</span>
                ) : (
                  String(designs?.length ?? 0)
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Designs Created
              </div>
              <div className="mt-1">
                <Link
                  to="/studio/design"
                  className="text-xs text-gold hover:underline"
                  aria-label="Create a new design in The Design Atelier"
                  data-ocid="dashboard.designs.cta"
                >
                  Create New →
                </Link>
              </div>
            </motion.div>

            {/* Team stat */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="bg-card border border-border rounded-xl p-5 flex flex-col gap-1 card-hover"
              data-ocid="dashboard.stat.item.4"
            >
              <Users className="w-5 h-5 text-gold mb-2" aria-hidden="true" />
              <div className="font-display text-2xl font-bold gradient-text">
                {teamLoading ? (
                  <Skeleton className="h-7 w-10 bg-muted" />
                ) : teamError ? (
                  <span className="text-destructive text-base">Error</span>
                ) : (
                  String(teamMembers?.length ?? 0)
                )}
              </div>
              <div className="text-xs text-muted-foreground">Team Members</div>
            </motion.div>
          </motion.div>

          {/* ─── Main Grid ─────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ─── Left: Design History + Inspiration ──────────────── */}
            <div className="lg:col-span-2 space-y-4">
              {/* Design History panel */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-display text-2xl font-bold onyx-shimmer">
                      Design History
                    </h2>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gold/30 text-gold hover:bg-gold/10 text-xs"
                    asChild
                    aria-label="Create a new design"
                    data-ocid="dashboard.designs.create_button"
                  >
                    <Link to="/studio/design">
                      <Sparkles className="w-3 h-3 mr-1.5" aria-hidden="true" />
                      New Design
                    </Link>
                  </Button>
                </div>

                {/* Designs loading skeleton */}
                {designsLoading ? (
                  <div
                    className="grid grid-cols-3 gap-3"
                    data-ocid="dashboard.designs.loading_state"
                  >
                    {[1, 2, 3, 4, 5, 6].map((k) => (
                      <Skeleton
                        key={k}
                        className="aspect-[4/5] rounded-lg bg-muted"
                      />
                    ))}
                  </div>

                  /* Designs error */
                ) : designsError ? (
                  <SectionError message="Could not load your designs. Please refresh the page." />

                  /* Empty state */
                ) : !designs || designs.length === 0 ? (
                  <div
                    className="text-center py-16 text-muted-foreground"
                    data-ocid="dashboard.designs.empty_state"
                  >
                    <Layers
                      className="w-10 h-10 text-gold/30 mx-auto mb-3"
                      aria-hidden="true"
                    />
                    <p className="font-display text-base mb-1">
                      No designs yet — start creating in any studio
                    </p>
                    <p className="text-sm mb-4">
                      Your saved AI-generated designs will appear here.
                    </p>
                    <Button
                      asChild
                      className="bg-gold text-background hover:opacity-90"
                      aria-label="Go to The Design Atelier"
                      data-ocid="dashboard.designs.start_button"
                    >
                      <Link to="/studio/design">Open The Design Atelier</Link>
                    </Button>
                  </div>

                  /* Design grid */
                ) : (
                  <div
                    className="grid grid-cols-3 gap-3"
                    data-ocid="dashboard.designs.list"
                  >
                    {designs.slice(0, 6).map((d, i) => (
                      <motion.div
                        key={d.id}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 + i * 0.06 }}
                        className="group relative aspect-[4/5] bg-background border border-border rounded-xl overflow-hidden card-hover cursor-pointer"
                        data-ocid={`dashboard.designs.item.${i + 1}`}
                      >
                        {/* No image blob stored in this version — show a gradient placeholder */}
                        <div className="w-full h-full bg-gradient-to-br from-muted to-background flex items-center justify-center">
                          <Layers
                            className="w-8 h-8 text-gold/30"
                            aria-hidden="true"
                          />
                        </div>

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Public/private badge */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-6 h-6 rounded-full bg-background/80 flex items-center justify-center">
                            {d.metadata.isPublic ? (
                              <Globe
                                className="w-3 h-3 text-gold"
                                aria-hidden="true"
                              />
                            ) : (
                              <Lock
                                className="w-3 h-3 text-muted-foreground"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                        </div>

                        {/* Info bar */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-xs font-medium text-foreground truncate">
                            {d.metadata.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Clock
                              className="w-2.5 h-2.5 text-gold/60 shrink-0"
                              aria-hidden="true"
                            />
                            <span className="text-[10px] text-muted-foreground truncate">
                              {formatDate(d.creationDate)} ·{" "}
                              {d.metadata.studioType}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Studio Inspiration panel */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="mb-5">
                  <h2 className="font-display text-xl font-bold onyx-shimmer">
                    Studio Inspiration
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Visual references from across your 7 AI Studios
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      src: "/assets/user-armor-gown.jpg",
                      label: "Design Atelier",
                    },
                    {
                      src: "/assets/user-underwater-gown.png",
                      label: "Mirror Studio",
                    },
                    { src: "/assets/user-sky-tower.jpg", label: "Model Forge" },
                    {
                      src: "/assets/user-nyc-street.jpg",
                      label: "Style Compass",
                    },
                    { src: "/assets/user-boutique.jpg", label: "Brand Vault" },
                    {
                      src: "/assets/user-ai-workspace.png",
                      label: "Precision Lab",
                    },
                  ].map(({ src, label }) => (
                    <div
                      key={label}
                      className="relative aspect-video rounded-lg overflow-hidden group card-hover cursor-pointer"
                    >
                      <img
                        src={src}
                        alt={label}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <span className="absolute bottom-1.5 left-2 text-[10px] font-body text-gold/80 font-medium">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ─── Right Sidebar ───────────────────────────────────── */}
            <div className="space-y-5">
              {/* Founder card */}
              <div className="bg-card border border-border rounded-xl overflow-hidden onyx-shimmer-border">
                <div className="relative h-32">
                  <img
                    src="/assets/angingray-019d4b2d-e30e-7214-a387-48b6bdcb3136.png"
                    alt="Angela Beson — angieCREATEs founder"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card" />
                </div>
                <div className="p-4 -mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display font-bold text-foreground text-sm">
                      Angela Beson
                    </span>
                    <Crown
                      className="w-3.5 h-3.5 text-gold"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Founder · angieCREATEs
                  </p>
                  <p className="text-xs text-muted-foreground italic leading-relaxed">
                    "When you feel good, you look good. When you look good, you
                    work harder. You are unstoppable."
                  </p>
                </div>
              </div>

              {/* Plan card */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-display text-base font-bold mb-3">
                  Your Plan
                </h3>

                {tierLoading ? (
                  <Skeleton
                    className="h-7 w-24 bg-muted mb-4"
                    data-ocid="dashboard.plan.loading_state"
                  />
                ) : tierError ? (
                  <SectionError message="Could not load plan info." />
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className={tierStyle}>{tierLabel}</Badge>
                      {profile.subscriptionActive && (
                        <Badge className="bg-emerald-900/20 text-emerald-400 border-emerald-800/20 text-xs">
                          Active
                        </Badge>
                      )}
                    </div>

                    {/* Credit progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Credits</span>
                        <span className="text-gold font-medium">
                          {balanceLoading
                            ? "…"
                            : balanceError
                              ? "—"
                              : `${creditDisplay} remaining`}
                        </span>
                      </div>
                      <div
                        className="h-1.5 bg-muted rounded-full overflow-hidden"
                        role="progressbar"
                        aria-label="Credit balance indicator"
                        aria-valuenow={Math.min(
                          100,
                          (Number(balance ?? 0n) / 500) * 100,
                        )}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        tabIndex={-1}
                      >
                        <div
                          className="h-full bg-gold rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.min(100, (Number(balance ?? 0n) / 500) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button
                  variant="outline"
                  className="w-full border-gold/30 text-gold hover:bg-gold/10 text-sm h-9"
                  asChild
                  aria-label="View upgrade options on the pricing page"
                  data-ocid="dashboard.plan.upgrade_button"
                >
                  <Link to="/pricing">Upgrade Plan</Link>
                </Button>
              </div>

              {/* API Keys panel */}
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-base font-bold">API Keys</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gold hover:bg-gold/10 h-7 px-2 text-xs"
                    onClick={handleGenerateKey}
                    disabled={generateKey.isPending}
                    aria-label="Generate a new API key"
                    data-ocid="dashboard.api.primary_button"
                  >
                    {generateKey.isPending ? (
                      <Loader2
                        className="w-3 h-3 animate-spin mr-1"
                        aria-hidden="true"
                      />
                    ) : (
                      <Key className="w-3 h-3 mr-1" aria-hidden="true" />
                    )}
                    New Key
                  </Button>
                </div>

                {/* API keys loading */}
                {apiKeysLoading ? (
                  <div
                    className="space-y-2"
                    data-ocid="dashboard.api.loading_state"
                  >
                    {[1, 2].map((k) => (
                      <Skeleton key={k} className="h-9 rounded-lg bg-muted" />
                    ))}
                  </div>

                  /* API keys error */
                ) : apiKeysError ? (
                  <SectionError message="Could not load API keys." />

                  /* Key list */
                ) : apiKeys && apiKeys.length > 0 ? (
                  <div className="space-y-2" data-ocid="dashboard.api.list">
                    {apiKeys.map((key, i) => (
                      <div
                        key={key}
                        className="flex items-center gap-1.5 bg-background border border-border rounded-lg px-3 py-2"
                        data-ocid={`dashboard.api.item.${i + 1}`}
                      >
                        <code className="text-xs font-mono text-muted-foreground flex-1 truncate min-w-0">
                          {revealedKeys.has(i)
                            ? key
                            : `${key.substring(0, 10)}${"•".repeat(8)}`}
                        </code>
                        <button
                          type="button"
                          aria-label={
                            revealedKeys.has(i)
                              ? "Hide API key"
                              : "Reveal API key"
                          }
                          className="text-muted-foreground hover:text-gold transition-colors shrink-0"
                          onClick={() => toggleReveal(i)}
                        >
                          {revealedKeys.has(i) ? (
                            <EyeOff
                              className="w-3.5 h-3.5"
                              aria-hidden="true"
                            />
                          ) : (
                            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                          )}
                        </button>
                        <button
                          type="button"
                          aria-label="Copy API key to clipboard"
                          className="text-muted-foreground hover:text-gold transition-colors shrink-0"
                          onClick={() => handleCopyKey(key)}
                        >
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>

                  /* Empty state */
                ) : (
                  <p
                    className="text-xs text-muted-foreground"
                    data-ocid="dashboard.api.empty_state"
                  >
                    No API keys yet. Generate one to start building.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ─── Team Members ──────────────────────────────────────── */}
          <Separator className="my-10 bg-border" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold onyx-shimmer">
                  Creative Team
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Collaborate with your creative crew in real time.
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              {/* Invite row */}
              <div className="flex gap-3 mb-6">
                <Input
                  placeholder="Enter Principal ID to invite"
                  value={inviteInput}
                  onChange={(e) => setInviteInput(e.target.value)}
                  className="border-border bg-background focus:border-gold/50 max-w-sm text-sm"
                  aria-label="Principal ID to invite"
                  data-ocid="dashboard.team.invite_input"
                />
                <Button
                  className="bg-gold text-background hover:opacity-90 shrink-0"
                  disabled={!inviteInput.trim()}
                  aria-label="Invite team member"
                  onClick={() => {
                    toast.info("Team invitations available when fully live.");
                    setInviteInput("");
                  }}
                  data-ocid="dashboard.team.invite_button"
                >
                  <UserPlus className="w-4 h-4 mr-2" aria-hidden="true" />
                  Invite
                </Button>
              </div>

              {/* Team members loading */}
              {teamLoading ? (
                <div
                  className="space-y-3"
                  data-ocid="dashboard.team.loading_state"
                >
                  {[1, 2, 3].map((k) => (
                    <Skeleton key={k} className="h-14 rounded-lg bg-muted" />
                  ))}
                </div>

                /* Team error */
              ) : teamError ? (
                <SectionError message="Could not load team members." />

                /* Member list */
              ) : teamMembers && teamMembers.length > 0 ? (
                <div className="space-y-3" data-ocid="dashboard.team.list">
                  {teamMembers.map((member, i) => {
                    const fullId = member.toString();
                    const displayName = truncatePrincipal(fullId);
                    return (
                      <div
                        key={fullId}
                        className="flex items-center justify-between py-3 px-4 bg-background border border-border rounded-lg"
                        data-ocid={`dashboard.team.item.${i + 1}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-xs font-display font-bold text-gold">
                            {fullId.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-foreground font-mono">
                            {displayName}
                          </span>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove team member ${displayName}`}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          onClick={() =>
                            toast.info(
                              "Remove functionality available when backend is live.",
                            )
                          }
                        >
                          <X className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                /* Team empty state */
              ) : (
                <div
                  className="text-center py-10 text-muted-foreground"
                  data-ocid="dashboard.team.empty_state"
                >
                  <div className="flex justify-center gap-2 mb-4">
                    {[
                      "/assets/user-armor-gown.jpg",
                      "/assets/user-underwater-gown.png",
                      "/assets/user-sky-tower.jpg",
                    ].map((src, i) => (
                      <div
                        key={src}
                        className="w-10 h-10 rounded-full overflow-hidden border-2 border-card"
                        style={{ marginLeft: i > 0 ? "-8px" : "0" }}
                      >
                        <img
                          src={src}
                          alt=""
                          aria-hidden="true"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full bg-gold/10 border-2 border-card flex items-center justify-center -ml-2">
                      <Users
                        className="w-4 h-4 text-gold/50"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <p className="font-display text-base mb-1">
                    No team members yet
                  </p>
                  <p className="text-sm">
                    Invite collaborators to design together.
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* ─── Profile Settings ──────────────────────────────────── */}
          <Separator className="my-10 bg-border" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl font-bold onyx-shimmer mb-6">
              Profile Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Display name */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-display font-bold mb-4 text-base">
                  Display Name
                </h3>
                <div className="flex gap-3">
                  <Input
                    defaultValue={profile.username}
                    className="border-border bg-background focus:border-gold/50"
                    aria-label="Display name"
                    data-ocid="dashboard.profile.name_input"
                  />
                  <Button
                    variant="outline"
                    className="border-gold/30 text-gold hover:bg-gold/10 shrink-0"
                    aria-label="Save display name"
                    onClick={() =>
                      toast.info(
                        "Profile editing available when backend is live.",
                      )
                    }
                    data-ocid="dashboard.profile.save_button"
                  >
                    Save
                  </Button>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-display font-bold mb-4 text-base">
                  Notifications
                </h3>
                <div className="space-y-3">
                  {[
                    "Design completed",
                    "New trend alerts",
                    "Team activity",
                  ].map((label) => {
                    const id = `notif-${label.replace(/\s+/g, "-").toLowerCase()}`;
                    return (
                      <label
                        key={label}
                        htmlFor={id}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          id={id}
                          type="checkbox"
                          defaultChecked
                          className="sr-only"
                        />
                        <div className="w-4 h-4 rounded border border-gold/30 bg-gold/10 flex items-center justify-center group-hover:border-gold/60 transition-colors">
                          <div className="w-2 h-2 rounded-sm bg-gold" />
                        </div>
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
