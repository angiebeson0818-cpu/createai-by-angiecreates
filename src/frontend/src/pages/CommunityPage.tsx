/**
 * @file pages/CommunityPage.tsx
 * @description The CREATEai public community gallery. Shows all public
 * AI-generated designs with studio-filter tabs, loading skeletons,
 * error recovery, and empty states. Also features creator spotlights,
 * style challenges, and a community trend-vote section.
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, truncatePrincipal } from "@/utils/format";
import {
  Award,
  ChevronUp,
  Globe,
  Heart,
  Palette,
  RefreshCw,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { studios } from "../data/studioData";
import { useAllPublicDesigns } from "../hooks/useQueries";

// ── Studio filter configuration ────────────────────────────────────────────

/** All possible studio filter values, with "All" as the first entry. */
const STUDIO_FILTERS = ["All", ...studios.map((s) => s.id)];

/** Maps studio IDs to their editorial display names. */
const STUDIO_LABELS: Record<string, string> = {
  All: "All Studios",
  design: "The Design Atelier",
  "virtual-try-on": "The Mirror Studio",
  models: "The Model Forge",
  stylist: "The Style Compass",
  branding: "The Brand Vault",
  "tech-pack": "The Precision Lab",
  trends: "The Trend Intelligence",
};

// ── Static community data ──────────────────────────────────────────────────

/** Featured creators shown in the Spotlight Series section. */
const FEATURED_CREATORS = [
  {
    name: "Amara Osei",
    handle: "@amaracreates",
    specialty: "The Design Atelier",
    designs: 148,
    followers: "12.4K",
    bio: "Redefining West African couture with generative AI. Every silhouette tells a story of heritage and futurism.",
    avatarImg: "/assets/generated/community-creators-trio.dim_900x400.jpg",
    avatarPosition: "0% center",
    featured: true,
  },
  {
    name: "Remy Vandermeer",
    handle: "@remyvdm",
    specialty: "The Brand Vault",
    designs: 93,
    followers: "8.1K",
    bio: "Architecting brand identities that command attention. I use The Brand Vault to build visual languages that last decades.",
    avatarImg: "/assets/generated/community-creators-trio.dim_900x400.jpg",
    avatarPosition: "50% center",
    featured: false,
  },
  {
    name: "Sage Kimura",
    handle: "@sagekimura",
    specialty: "The Mirror Studio",
    designs: 217,
    followers: "19.7K",
    bio: "Virtual try-on visionary. I help brands and individuals see themselves — and their possibilities — in a completely new light.",
    avatarImg: "/assets/generated/community-creators-trio.dim_900x400.jpg",
    avatarPosition: "100% center",
    featured: false,
  },
];

/** Active and past style challenges. */
const STYLE_CHALLENGES = [
  {
    title: "The Monochrome Manifesto",
    studio: "The Design Atelier",
    entries: 1247,
    prize: "6-Month Pro Plan",
    deadline: "5 days left",
    status: "Active",
    img: "/assets/generated/community-style-challenge.dim_800x500.jpg",
    gradient: null,
  },
  {
    title: "Fluid Identity Edit",
    studio: "The Mirror Studio",
    entries: 892,
    prize: "Creator Spotlight",
    deadline: "12 days left",
    status: "Active",
    img: null,
    gradient: "from-violet-950 to-indigo-900",
  },
  {
    title: "Brand From Zero",
    studio: "The Brand Vault",
    entries: 623,
    prize: "Feature on Homepage",
    deadline: "Submissions closed",
    status: "Voting",
    img: null,
    gradient: "from-amber-950 to-orange-900",
  },
];

/** Trend topics with community vote counts and progress bar fill percentages. */
const TREND_ITEMS = [
  { label: "Quiet Luxury Minimalism", votes: 4821, pct: 92, color: "bg-gold" },
  {
    label: "Neo-Corset Structures",
    votes: 3614,
    pct: 69,
    color: "bg-primary/80",
  },
  {
    label: "Deconstructed Tailoring",
    votes: 3102,
    pct: 59,
    color: "bg-primary/60",
  },
  {
    label: "Iridescent Metallics",
    votes: 2758,
    pct: 53,
    color: "bg-primary/50",
  },
  {
    label: "Bold Monogram Branding",
    votes: 2190,
    pct: 42,
    color: "bg-primary/40",
  },
];

/** Platform-wide headline statistics shown in the stats bar. */
const PLATFORM_STATS = [
  {
    icon: <Users className="w-5 h-5" />,
    value: "50K+",
    label: "Active Creators",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    value: "2M+",
    label: "Designs Created",
  },
  { icon: <Palette className="w-5 h-5" />, value: "7", label: "AI Studios" },
  { icon: <Globe className="w-5 h-5" />, value: "150+", label: "Countries" },
];

// ── Skeleton grid helper ───────────────────────────────────────────────────

/** Renders 12 placeholder skeleton cards while the gallery is loading. */
function GallerySkeleton() {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
      data-ocid="community.loading_state"
      aria-label="Loading gallery designs"
    >
      {[
        "s1",
        "s2",
        "s3",
        "s4",
        "s5",
        "s6",
        "s7",
        "s8",
        "s9",
        "s10",
        "s11",
        "s12",
      ].map((k) => (
        <Skeleton key={k} className="aspect-[3/4] rounded-xl" />
      ))}
    </div>
  );
}

// ── Design card for backend DesignRecord items ─────────────────────────────

interface BackendDesignCardProps {
  design: {
    id: string;
    metadata: {
      title: string;
      studioType: string;
      createdBy: { toText: () => string };
    };
    creationDate: bigint;
    image: Uint8Array;
  };
  index: number;
}

/** Renders a single design card sourced from the live backend gallery. */
function BackendDesignCard({ design, index }: BackendDesignCardProps) {
  // Build an object URL from the raw image bytes so we can display it.
  const imageSrc =
    design.image && design.image.length > 0
      ? URL.createObjectURL(
          new Blob([new Uint8Array(design.image.buffer as ArrayBuffer)], {
            type: "image/jpeg",
          }),
        )
      : "/assets/images/placeholder.svg";

  const studioLabel =
    STUDIO_LABELS[design.metadata.studioType] ?? design.metadata.studioType;
  const creatorText = truncatePrincipal(design.metadata.createdBy.toText());
  const dateText = formatDate(design.creationDate);

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04 }}
      className="group cursor-pointer"
      aria-label={`${design.metadata.title} — ${studioLabel}`}
      data-ocid={`community.item.${index + 1}`}
    >
      <div className="aspect-[3/4] bg-card border border-border rounded-xl overflow-hidden card-hover onyx-shimmer-border flex flex-col">
        <div className="flex-1 overflow-hidden">
          <img
            src={imageSrc}
            alt={design.metadata.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="p-3 bg-card">
          <p className="text-sm font-semibold font-body text-foreground line-clamp-1 mb-1">
            {design.metadata.title}
          </p>
          <Badge
            variant="outline"
            className="text-[10px] border-border text-gold font-body mb-1"
          >
            {studioLabel.split(" ").slice(-1)[0]}
          </Badge>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-body mt-1">
            <span>{creatorText}</span>
            <span>{dateText}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ── Sample design card for when no backend data is available ───────────────

interface SampleDesign {
  id: string;
  title: string;
  studio: string;
  creator: string;
  gradient: string;
  likes: number;
  days: number;
}

/** Sample designs shown when no public backend designs are available yet. */
const SAMPLE_DESIGNS: SampleDesign[] = [
  {
    id: "1",
    title: "Crimson Evening Gown",
    studio: "design",
    creator: "ElisaM",
    gradient: "from-rose-950 to-red-900",
    likes: 284,
    days: 2,
  },
  {
    id: "2",
    title: "Structured Power Blazer",
    studio: "design",
    creator: "NathanF",
    gradient: "from-[oklch(0.18_0.01_264)] to-[oklch(0.25_0.03_250)]",
    likes: 197,
    days: 4,
  },
  {
    id: "3",
    title: "Summer Floral Lookbook",
    studio: "virtual-try-on",
    creator: "SophieB",
    gradient: "from-amber-950 to-yellow-900",
    likes: 312,
    days: 1,
  },
  {
    id: "4",
    title: "Avant-Garde Jacket",
    studio: "design",
    creator: "MarcusT",
    gradient: "from-indigo-950 to-blue-900",
    likes: 445,
    days: 3,
  },
  {
    id: "5",
    title: "Minimalist White Edit",
    studio: "models",
    creator: "ClaraH",
    gradient: "from-[oklch(0.20_0.005_60)] to-[oklch(0.26_0.01_60)]",
    likes: 163,
    days: 5,
  },
  {
    id: "6",
    title: "Street Style Lookbook",
    studio: "stylist",
    creator: "JordanK",
    gradient: "from-emerald-950 to-green-900",
    likes: 229,
    days: 2,
  },
  {
    id: "7",
    title: "Luxury Brand Identity",
    studio: "branding",
    creator: "AmelieR",
    gradient: "from-purple-950 to-violet-900",
    likes: 398,
    days: 6,
  },
  {
    id: "8",
    title: "Denim Tech Pack",
    studio: "tech-pack",
    creator: "SamuelD",
    gradient: "from-cyan-950 to-teal-900",
    likes: 142,
    days: 3,
  },
  {
    id: "9",
    title: "Futuristic Silhouette",
    studio: "design",
    creator: "NinaW",
    gradient: "from-orange-950 to-red-900",
    likes: 521,
    days: 1,
  },
  {
    id: "10",
    title: "Resort Collection 2026",
    studio: "models",
    creator: "LiamC",
    gradient: "from-sky-950 to-blue-900",
    likes: 278,
    days: 7,
  },
  {
    id: "11",
    title: "Capsule Wardrobe Edit",
    studio: "stylist",
    creator: "ZoeP",
    gradient: "from-pink-950 to-rose-900",
    likes: 334,
    days: 4,
  },
  {
    id: "12",
    title: "Bold Logo Collection",
    studio: "branding",
    creator: "ArjunM",
    gradient: "from-yellow-950 to-amber-900",
    likes: 187,
    days: 2,
  },
];

interface SampleDesignCardProps {
  design: SampleDesign;
  index: number;
}

/** Renders a single gradient design card for sample (non-backend) data. */
function SampleDesignCard({ design, index }: SampleDesignCardProps) {
  const studioLabel = STUDIO_LABELS[design.studio] ?? design.studio;
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04 }}
      className="group cursor-pointer"
      aria-label={`${design.title} — ${studioLabel}`}
      data-ocid={`community.item.${index + 1}`}
    >
      <div
        className={`aspect-[3/4] bg-gradient-to-br ${design.gradient} rounded-xl flex flex-col justify-between p-4 card-hover border border-border/30 group-hover:border-gold/30 onyx-shimmer-border`}
      >
        <div className="flex justify-between items-start">
          <Badge
            className="text-[10px] bg-background/50 text-gold border-gold/20 font-body"
            variant="outline"
          >
            {studioLabel.split(" ").slice(-1)[0]}
          </Badge>
          <span className="text-[10px] text-foreground/40 font-body">
            {design.days}d ago
          </span>
        </div>
        <div>
          <p className="text-sm text-foreground/90 font-semibold font-body line-clamp-2 mb-1">
            {design.title}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-foreground/50 font-body">
              @{design.creator}
            </p>
            <span className="flex items-center gap-1 text-[11px] text-gold/70">
              <Heart className="w-3 h-3" />
              {design.likes}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

/**
 * CommunityPage — the public-facing gallery and community hub for CREATEai.
 *
 * Features:
 * - Live public designs from the backend via useAllPublicDesigns()
 * - Studio-filter tabs using editorial studio names
 * - Loading skeletons (12 cards), error state with Retry, empty state
 * - Creator spotlights, style challenges, and trend vote sections
 */
export default function CommunityPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [votedTrend, setVotedTrend] = useState<string | null>(null);

  // Public query — always enabled, no auth required.
  const {
    data: backendDesigns,
    isLoading,
    isError,
    refetch,
  } = useAllPublicDesigns();

  // Determine which data source to render.
  const hasBackendDesigns = backendDesigns && backendDesigns.length > 0;

  // Filter backend designs by studioType when a studio filter is active.
  const filteredBackendDesigns = hasBackendDesigns
    ? backendDesigns.filter(
        (d) => activeFilter === "All" || d.metadata.studioType === activeFilter,
      )
    : [];

  // Filter sample designs by studio when no backend data is available.
  const filteredSampleDesigns = SAMPLE_DESIGNS.filter(
    (d) => activeFilter === "All" || d.studio === activeFilter,
  );

  // The gallery shows backend data when available; otherwise shows sample designs.
  const galleryIsEmpty =
    !isLoading &&
    !isError &&
    (hasBackendDesigns
      ? filteredBackendDesigns.length === 0
      : filteredSampleDesigns.length === 0);

  return (
    <main id="main-content" aria-label="Community Gallery">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-card border-b border-border overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/user-underwater-gown.png"
            alt="CREATEai Community Gallery"
            className="w-full h-full object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-card/80 via-card/50 to-card/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-card/70 via-transparent to-card/70" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-xs font-body uppercase tracking-[0.3em] text-gold mb-5 block">
              Where Vision Meets Community
            </span>
            <h1 className="font-display text-6xl md:text-8xl font-bold mb-6 leading-none">
              <span className="onyx-shimmer">The Creative</span>
              <br />
              <span className="onyx-shimmer">Collective</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              Every man, every woman, every visionary — united by a love for
              fashion and the courage to create without limits. This is your
              stage. Discover, inspire, and be seen.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gold text-background hover:bg-gold/90 font-body font-semibold px-8 gold-glow-hover transition-all duration-300"
                data-ocid="community.share_design_button"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Share Your Creation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:border-gold/50 font-body transition-all duration-300"
                onClick={() =>
                  document
                    .getElementById("gallery")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                data-ocid="community.explore_button"
              >
                Explore All Designs
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────────────── */}
      <section className="py-10 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div
            className="flex flex-wrap justify-center gap-8 md:gap-16"
            data-ocid="community.stats.section"
          >
            {PLATFORM_STATS.map(({ icon, value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center text-gold mb-2">{icon}</div>
                <div className="font-display text-3xl font-bold gradient-text">
                  {value}
                </div>
                <div className="text-xs font-body text-muted-foreground mt-1 tracking-widest uppercase">
                  {label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-background" id="gallery">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-3">
              <span className="onyx-shimmer">Community Gallery</span>
            </h2>
            <p className="text-muted-foreground text-sm font-body">
              A living canvas of creativity — curated from our global collective
            </p>
          </motion.div>

          {/* Studio filter tabs */}
          <div
            className="flex flex-wrap justify-center gap-2 mb-10"
            role="tablist"
            aria-label="Filter designs by studio"
            data-ocid="community.filter.tab"
          >
            {STUDIO_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={activeFilter === f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-body font-medium border transition-all duration-200 ${
                  activeFilter === f
                    ? "bg-gold text-background border-gold shadow-sm"
                    : "border-border text-muted-foreground hover:border-gold/40 hover:text-foreground"
                }`}
                data-ocid="community.tab"
              >
                {STUDIO_LABELS[f] ?? f}
              </button>
            ))}
          </div>

          {/* Loading state — 12 skeleton cards */}
          {isLoading ? (
            <GallerySkeleton />
          ) : isError ? (
            /* Error state — retry button */
            <div
              className="text-center py-24 text-muted-foreground"
              data-ocid="community.error_state"
            >
              <RefreshCw className="w-12 h-12 mx-auto mb-4 text-gold/30" />
              <p className="font-display text-xl mb-2 text-foreground">
                Unable to load the gallery right now. Please try again.
              </p>
              <Button
                variant="outline"
                className="mt-4 border-gold/30 hover:border-gold text-gold font-body"
                onClick={() => refetch()}
                data-ocid="community.retry_button"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : galleryIsEmpty ? (
            /* Empty state */
            <div
              className="text-center py-24 text-muted-foreground"
              data-ocid="community.empty_state"
            >
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-gold/30" />
              <p className="font-display text-2xl mb-2 text-foreground">
                No public designs yet — be the first to share your creation!
              </p>
              <p className="text-sm mb-6">
                This studio is waiting for your vision. No experience required —
                just your imagination.
              </p>
              <Button
                variant="outline"
                className="border-gold/30 hover:border-gold text-gold font-body"
                data-ocid="community.empty_cta_button"
              >
                Start Creating
              </Button>
            </div>
          ) : (
            /* Gallery grid — backend or sample designs */
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              aria-live="polite"
              aria-label="Design gallery"
              data-ocid="community.list"
            >
              {hasBackendDesigns
                ? filteredBackendDesigns.map((design, i) => (
                    <BackendDesignCard
                      key={design.id}
                      design={design}
                      index={i}
                    />
                  ))
                : filteredSampleDesigns.map((design, i) => (
                    <SampleDesignCard
                      key={design.id}
                      design={design}
                      index={i}
                    />
                  ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Featured Creators ─────────────────────────────────────────── */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-body uppercase tracking-[0.3em] text-gold mb-3 block">
              Spotlight Series
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              <span className="onyx-shimmer">Creator Spotlights</span>
            </h2>
            <p className="text-muted-foreground text-sm font-body mt-3 max-w-xl mx-auto">
              Every one of them started exactly where you are. Meet the
              visionaries who are redefining what fashion creation looks like.
            </p>
          </motion.div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            data-ocid="community.creators.list"
          >
            {FEATURED_CREATORS.map((creator, i) => (
              <motion.div
                key={creator.handle}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className={`relative rounded-2xl border overflow-hidden card-hover onyx-shimmer-border cursor-pointer ${
                  creator.featured
                    ? "border-gold/40 md:scale-[1.03]"
                    : "border-border"
                }`}
                data-ocid={`community.creator.${i + 1}`}
              >
                {creator.featured && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-gold text-background font-body text-[10px] font-semibold">
                      <Star className="w-3 h-3 mr-1" /> Featured
                    </Badge>
                  </div>
                )}
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={creator.avatarImg}
                    alt={creator.name}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: creator.avatarPosition }}
                  />
                  <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-transparent to-card/60" />
                </div>
                <div className="p-6 bg-card">
                  <div className="mb-3">
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {creator.name}
                    </h3>
                    <p className="text-xs text-gold font-body">
                      {creator.handle}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4 line-clamp-3">
                    {creator.bio}
                  </p>
                  <div className="flex gap-4 mb-4">
                    <div className="text-center">
                      <div className="font-display text-2xl font-bold gradient-text">
                        {creator.designs}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">
                        Designs
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-display text-2xl font-bold gradient-text">
                        {creator.followers}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">
                        Followers
                      </div>
                    </div>
                    <div className="flex-1 text-right">
                      <Badge
                        variant="outline"
                        className="text-[10px] border-border text-muted-foreground font-body"
                      >
                        {creator.specialty.split(" ").slice(-1)[0]}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-border hover:border-gold/50 font-body text-xs transition-all duration-200"
                    aria-label={`Follow ${creator.name}`}
                    data-ocid={`community.follow_button.${i + 1}`}
                  >
                    Follow Creator
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Style Challenges ──────────────────────────────────────────── */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
          >
            <div>
              <span className="text-xs font-body uppercase tracking-[0.3em] text-gold mb-3 block">
                Open to Everyone
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                <span className="onyx-shimmer">Style Challenges</span>
              </h2>
              <p className="text-muted-foreground font-body text-sm mt-3 max-w-lg">
                No gatekeeping. No prerequisites. If you have a vision, you have
                a place here. Compete, collaborate, and get noticed — regardless
                of your experience level.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-gold/30 hover:border-gold text-gold font-body text-sm shrink-0"
              data-ocid="community.view_all_challenges_button"
            >
              <Trophy className="w-4 h-4 mr-2" /> View All Challenges
            </Button>
          </motion.div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            data-ocid="community.challenges.list"
          >
            {STYLE_CHALLENGES.map((challenge, i) => (
              <motion.div
                key={challenge.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card overflow-hidden card-hover onyx-shimmer-border cursor-pointer"
                data-ocid={`community.challenge.${i + 1}`}
              >
                <div className="h-44 overflow-hidden relative">
                  {challenge.img ? (
                    <img
                      src={challenge.img}
                      alt={challenge.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${challenge.gradient}`}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={`font-body text-[10px] font-semibold ${
                        challenge.status === "Active"
                          ? "bg-emerald-900/80 text-emerald-300 border-emerald-700/50"
                          : "bg-amber-900/80 text-amber-300 border-amber-700/50"
                      }`}
                      variant="outline"
                    >
                      {challenge.status}
                    </Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold mb-1">
                    {challenge.title}
                  </h3>
                  <p className="text-xs text-gold font-body mb-3">
                    {challenge.studio}
                  </p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground font-body mb-4">
                    <span>{challenge.entries.toLocaleString()} entries</span>
                    <span>{challenge.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-body text-muted-foreground mb-4">
                    <Award className="w-3.5 h-3.5 text-gold" />
                    <span>{challenge.prize}</span>
                  </div>
                  <Button
                    size="sm"
                    className={`w-full font-body text-xs ${
                      challenge.status === "Active"
                        ? "bg-gold text-background hover:bg-gold/90"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                    data-ocid={`community.enter_challenge_button.${i + 1}`}
                  >
                    {challenge.status === "Active"
                      ? "Enter Challenge"
                      : "View Results"}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trend Vote ────────────────────────────────────────────────── */}
      <section className="py-20 bg-card border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/assets/generated/community-trend-vote-bg.dim_1200x500.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-card/70" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs font-body uppercase tracking-[0.3em] text-gold mb-3 block">
              The People's Edit
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-3">
              <span className="onyx-shimmer">Trend Vote</span>
            </h2>
            <p className="text-sm text-muted-foreground font-body max-w-lg mx-auto">
              The community shapes what's next. Cast your vote — the top trends
              get featured across the platform and inspire upcoming design
              challenges.
            </p>
          </motion.div>

          <div
            className="max-w-2xl mx-auto space-y-4"
            data-ocid="community.trend_vote.list"
          >
            {TREND_ITEMS.map((trend, i) => (
              <motion.div
                key={trend.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-xl border p-4 cursor-pointer transition-all duration-300 ${
                  votedTrend === trend.label
                    ? "border-gold/50 bg-gold/5"
                    : "border-border bg-background/60 hover:border-gold/30"
                }`}
                onClick={() => setVotedTrend(trend.label)}
                data-ocid={`community.trend.${i + 1}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-body font-semibold text-sm text-foreground">
                    {trend.label}
                  </span>
                  <button
                    type="button"
                    aria-label={`Vote for ${trend.label}`}
                    aria-pressed={votedTrend === trend.label}
                    className={`flex items-center gap-1.5 text-xs font-body px-3 py-1.5 rounded-full border transition-all duration-200 ${
                      votedTrend === trend.label
                        ? "bg-gold text-background border-gold"
                        : "border-border text-muted-foreground hover:border-gold/50 hover:text-gold"
                    }`}
                    data-ocid={`community.vote_button.${i + 1}`}
                  >
                    <ChevronUp className="w-3 h-3" />
                    {trend.votes.toLocaleString()}
                  </button>
                </div>
                <div className="h-1.5 rounded-full bg-border overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${trend.color}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${trend.pct}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.8,
                      delay: 0.2 + i * 0.08,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {votedTrend !== null ? (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-6 text-sm text-gold font-body"
              data-ocid="community.vote_success_state"
            >
              <Sparkles className="w-4 h-4 inline mr-1" />
              Your vote for <strong>{votedTrend}</strong> is live. Thank you for
              shaping the future of fashion.
            </motion.p>
          ) : null}
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-body uppercase tracking-[0.3em] text-gold mb-5 block">
              Your Seat at the Table
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
              <span className="onyx-shimmer">Your Vision</span>
              <br />
              <span className="onyx-shimmer">Belongs Here</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
              Every creator — regardless of background, experience, or style —
              has a place in this collective. Share your work, find your people,
              and let the world see what you were born to create.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gold text-background hover:bg-gold/90 font-body font-semibold px-10 gold-glow-hover transition-all duration-300"
                data-ocid="community.cta_primary_button"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Join The Collective
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:border-gold/50 font-body transition-all duration-300"
                data-ocid="community.cta_secondary_button"
              >
                Browse Galleries
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
