/**
 * @file pages/FeaturesPage.tsx
 * @description All 48 AI studio features for CREATEai by angieCREATEs.
 *
 * Sections:
 *  - Page hero        — headline, feature count badges
 *  - Pure Flow        — 3 platform philosophy cards
 *  - Hero features    — 6 signature features (one from each studio)
 *  - Full explorer    — filter tabs by studio + grouped feature grid (48 tiles)
 *  - CTA banner       — empowering call to action
 *
 * Every feature tile title carries the `onyx-shimmer` class.
 * The filter results region has `aria-live="polite"` for screen-reader
 * announcements when the filter changes.
 * Each filter tab button has an `aria-label` and `aria-selected` state.
 */

import { ArrowRight, Layers, Sparkles, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import FeatureCard from "../components/FeatureCard";
import { allFeatures, studios } from "../data/studioData";

// ── Static data ───────────────────────────────────────────────────────────

const ALL_ID = "All";

/** Human-readable label for each studio filter button. */
const filterLabels: Record<string, string> = {
  [ALL_ID]: "All Studios",
  design: "The Design Atelier",
  "virtual-try-on": "The Mirror Studio",
  models: "The Model Forge",
  stylist: "The Style Compass",
  branding: "The Brand Vault",
  "tech-pack": "The Precision Lab",
  trends: "The Trend Intelligence",
};

/** Decorative symbol for each studio filter button. */
const studioIcons: Record<string, string> = {
  [ALL_ID]: "✦",
  design: "✦",
  "virtual-try-on": "◈",
  models: "◉",
  stylist: "◆",
  branding: "◇",
  "tech-pack": "◑",
  trends: "◎",
};

/**
 * 6 featured tool IDs — one representative from each studio.
 * These appear in the "Defining Tools" hero grid above the full explorer.
 */
const HERO_FEATURE_IDS = [
  "prompt-to-piece", // The Design Atelier
  "digital-drape", // The Mirror Studio
  "signature-persona", // The Model Forge
  "creator-calibration", // The Style Compass
  "signature-shades", // The Brand Vault
  "live-trend-pulse", // The Trend Intelligence
];

const heroFeatures = HERO_FEATURE_IDS.map((id) =>
  allFeatures.find((f) => f.id === id),
).filter(Boolean) as typeof allFeatures;

/** "Pure Flow" philosophy points shown before the feature grid. */
const PURE_FLOW_POINTS = [
  {
    icon: "⚡",
    title: "Instant Iteration",
    desc: "Generate, refine, and perfect designs in seconds — not days. Your creative momentum never breaks.",
  },
  {
    icon: "✦",
    title: "Unified Workspace",
    desc: "7 studios, 48 tools, one platform. No tab-switching, no importing, no losing your train of thought.",
  },
  {
    icon: "◈",
    title: "Infinite Exploration",
    desc: "Every idea is a starting point. Variations, edits, and entirely new directions — always just one click away.",
  },
];

// ── Component ─────────────────────────────────────────────────────────────

export default function FeaturesPage() {
  const [activeFilter, setActiveFilter] = useState(ALL_ID);

  const filters = [ALL_ID, ...studios.map((s) => s.id)];

  const filteredStudios =
    activeFilter === ALL_ID
      ? studios
      : studios.filter((s) => s.id === activeFilter);

  return (
    <main id="main-content" aria-label="All Features" className="min-h-screen">
      {/* ─── Page Hero ──────────────────────────────────────────── */}
      <section
        className="relative py-28 bg-card overflow-hidden"
        data-ocid="features.page"
      >
        {/* Gold radial glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, oklch(0.78 0.12 85 / 0.08) 0%, transparent 70%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px section-divider" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="text-xs font-body uppercase tracking-[0.25em] text-gold mb-4 block">
              Complete Feature Suite
            </span>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-5 leading-tight">
              Every Feature You Need.{" "}
              <span className="onyx-shimmer">Nothing You Don't.</span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-body">
              48 precision-crafted AI tools across 7 editorial studios —
              designed for every creator who refuses to be contained.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              {[
                { icon: <Layers className="w-4 h-4" />, label: "48 Features" },
                { icon: <Sparkles className="w-4 h-4" />, label: "7 Studios" },
                { icon: <Zap className="w-4 h-4" />, label: "Pure Flow" },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-sm font-body"
                >
                  <span className="text-gold" aria-hidden="true">
                    {icon}
                  </span>
                  <span className="text-foreground font-semibold">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Pure Flow Section ──────────────────────────────────── */}
      <section
        className="py-20 bg-background relative overflow-hidden"
        data-ocid="features.pure_flow.section"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 80% at 80% 50%, oklch(0.78 0.12 85 / 0.05) 0%, transparent 70%)",
          }}
        />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-xs font-body uppercase tracking-[0.25em] text-gold mb-3 block">
              Pure Flow
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Creative Exploration,{" "}
              <span className="onyx-shimmer">Unleashed.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto font-body text-base">
              The entire CREATEai platform is engineered so ideas flow freely —
              from first thought to final product without a single moment of
              resistance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {PURE_FLOW_POINTS.map((point, i) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="bg-card border border-border rounded-2xl p-7 onyx-shimmer-border"
                data-ocid={`features.pure_flow.item.${i + 1}`}
              >
                <div className="text-3xl mb-4" aria-hidden="true">
                  {point.icon}
                </div>
                <h3 className="font-display text-lg font-semibold mb-2 text-foreground">
                  {point.title}
                </h3>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">
                  {point.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Hero Feature Cards (6) ──────────────────────────────── */}
      <section
        className="py-20 bg-muted/30 relative"
        data-ocid="features.hero_features.section"
      >
        <div className="absolute top-0 left-0 right-0 h-px section-divider" />
        <div className="absolute bottom-0 left-0 right-0 h-px section-divider" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs font-body uppercase tracking-[0.25em] text-gold mb-3 block">
                  Signature Capabilities
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold">
                  Defining Tools of the{" "}
                  <span className="onyx-shimmer">Platform</span>
                </h2>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground font-body">
                <span>One from every studio</span>
                <ArrowRight className="w-4 h-4 text-gold" aria-hidden="true" />
              </div>
            </div>
          </motion.div>

          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="features.hero_features.list"
          >
            {heroFeatures.map((feature, i) => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                badge={filterLabels[feature.studio]}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Full Features Explorer ──────────────────────────────── */}
      <section
        className="py-20 bg-background"
        data-ocid="features.explorer.section"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <span className="text-xs font-body uppercase tracking-[0.25em] text-gold mb-3 block">
              All 48 Features
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              The Full <span className="onyx-shimmer">CREATEai Arsenal</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto font-body">
              Filter by studio to explore tools by discipline — or browse the
              complete suite.
            </p>
          </motion.div>

          {/* Studio Filter Tabs */}
          <div
            className="flex flex-wrap justify-center gap-2 mb-12"
            role="tablist"
            aria-label="Filter features by studio"
            data-ocid="features.filter.tab"
          >
            {filters.map((f) => (
              <button
                type="button"
                key={f}
                role="tab"
                aria-selected={activeFilter === f}
                aria-label={`Show features from ${filterLabels[f]}`}
                onClick={() => setActiveFilter(f)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-body font-medium border transition-all duration-200 ${
                  activeFilter === f
                    ? "bg-gold text-background border-gold shadow-sm"
                    : "border-border text-muted-foreground hover:border-gold/40 hover:text-foreground"
                }`}
                data-ocid={`features.tab.${f === ALL_ID ? "all" : f}`}
              >
                <span className="text-xs opacity-80" aria-hidden="true">
                  {studioIcons[f]}
                </span>
                <span className="hidden sm:inline">{filterLabels[f]}</span>
                <span className="sm:hidden">
                  {f === ALL_ID
                    ? "All"
                    : filterLabels[f].split(" ").slice(-1)[0]}
                </span>
              </button>
            ))}
          </div>

          {/* Active Studio Banner */}
          <AnimatePresence mode="wait">
            {activeFilter !== ALL_ID && (
              <motion.div
                key={`banner-${activeFilter}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mb-8 px-6 py-4 bg-card border border-gold/20 rounded-xl flex items-center gap-4 onyx-shimmer-border"
              >
                <span
                  className="text-2xl text-gold leading-none"
                  aria-hidden="true"
                >
                  {studioIcons[activeFilter]}
                </span>
                <div>
                  <div className="font-display font-semibold text-foreground onyx-shimmer inline-block">
                    {filterLabels[activeFilter]}
                  </div>
                  <div className="text-xs text-muted-foreground font-body mt-0.5">
                    {
                      studios.find((s) => s.id === activeFilter)?.features
                        .length
                    }{" "}
                    features in this studio
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Features grouped by studio — aria-live announces filter changes */}
          <div aria-live="polite" aria-atomic="false">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                data-ocid="features.list"
              >
                {filteredStudios.map((studio, si) => {
                  const studioFeatures = allFeatures.filter(
                    (f) => f.studio === studio.id,
                  );
                  return (
                    <div key={studio.id} className={si > 0 ? "mt-14" : ""}>
                      {/* Studio Section Header */}
                      <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="flex items-center gap-4 mb-7"
                        data-ocid={`features.studio_header.${si + 1}`}
                      >
                        <span
                          className="text-2xl text-gold leading-none"
                          aria-hidden="true"
                        >
                          {studio.icon}
                        </span>
                        <div>
                          <h3 className="font-display text-xl md:text-2xl font-bold onyx-shimmer inline-block">
                            {studio.name}
                          </h3>
                          <p className="text-xs text-muted-foreground font-body mt-0.5 italic">
                            {studio.tagline}
                          </p>
                        </div>
                        <div
                          className="ml-auto h-px flex-1 max-w-xs section-divider hidden md:block"
                          aria-hidden="true"
                        />
                        <span className="hidden md:inline text-xs font-body text-muted-foreground">
                          {studioFeatures.length} tools
                        </span>
                      </motion.div>

                      {/* Feature Grid — all tile titles carry onyx-shimmer */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {studioFeatures.map((feature, fi) => (
                          <FeatureCard
                            key={`${feature.studio}-${feature.id}`}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            badge={
                              activeFilter === ALL_ID
                                ? undefined
                                : filterLabels[feature.studio]
                            }
                            index={fi}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─────────────────────────────────────────── */}
      <section
        className="py-20 bg-card relative overflow-hidden"
        data-ocid="features.cta.section"
      >
        <div className="absolute top-0 left-0 right-0 h-px section-divider" />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 50% 100%, oklch(0.78 0.12 85 / 0.1) 0%, transparent 70%)",
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-body uppercase tracking-[0.25em] text-gold mb-4 block">
              Begin Your Journey
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-5">
              You Were <span className="onyx-shimmer">Made for This.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto font-body text-lg mb-8">
              Every man, every woman, every visionary who refuses to be
              contained — CREATEai was built for you.
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-gold text-background font-body font-semibold px-8 py-3.5 rounded-full card-hover gold-glow-hover text-sm"
              aria-label="Explore all 7 AI Studios"
              data-ocid="features.cta.primary_button"
            >
              Explore All Studios
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
