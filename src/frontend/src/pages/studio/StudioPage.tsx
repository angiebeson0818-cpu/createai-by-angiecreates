/**
 * @file pages/studio/StudioPage.tsx
 * @description Individual AI studio page for CREATEai by angieCREATEs.
 *
 * This component is rendered for each of the 7 studios:
 *   /studio/design        → The Design Atelier
 *   /studio/virtual-try-on → The Mirror Studio
 *   /studio/models        → The Model Forge
 *   /studio/stylist       → The Style Compass
 *   /studio/branding      → The Brand Vault
 *   /studio/tech-pack     → The Precision Lab
 *   /studio/trends        → The Trend Intelligence
 *
 * Sections (in order):
 *  1. Hero             — Full-backdrop image + dark overlay, studio icon/name/tagline,
 *                        optional gold-framed image panel (xl+). Falls back to gradient
 *                        background when heroImage is not provided.
 *  2. Stats Bar        — Studio-specific proof points.
 *  3. Insight          — Optional editorial quote from the CREATEai Perspective section.
 *  4. Studio Capabilities — Top 3 features highlighted, remaining in a FeatureCard grid.
 *                          All feature titles use the onyx-shimmer class.
 *  5. Brand Showcase   — 8 branded image slots, all showing "Your Brand Image" for
 *                        unset entries (ready for user-supplied photos).
 *  6. FAQ              — Studio-specific accordion Q&A.
 *  7. CTA              — "Begin Your Journey" final call to action.
 *
 * Props:
 *  - studio: Studio — the matched studio object from studioData.ts passed by App.tsx.
 *    If no matching studio is found the parent renders a 404 fallback.
 *
 * Dependencies:
 *  - BRAND_NAME from constants/brand.ts
 *  - Studio type from data/studioData.ts
 *  - FeatureCard from components/FeatureCard
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ImagePlus,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import FeatureCard from "../../components/FeatureCard";
import { ALL_ROUTES, BRAND_NAME } from "../../constants/brand";
import type { Studio } from "../../data/studioData";

// ── Props ─────────────────────────────────────────────────────────────────

interface StudioPageProps {
  /** The studio data object matched from studioData.ts by the parent route handler. */
  studio: Studio;
}

// ── Studio stat callouts ──────────────────────────────────────────────────
// Per-studio proof-point numbers shown in the stats bar beneath the hero.
const studioStats: Record<string, Array<{ value: string; label: string }>> = {
  design: [
    { value: "18+", label: "Creation Tools" },
    { value: "∞", label: "Design Variations" },
    { value: "30s", label: "Avg Generation Time" },
  ],
  "virtual-try-on": [
    { value: "8+", label: "Try-On Modes" },
    { value: "98%", label: "Fit Accuracy" },
    { value: "10s", label: "Results in Seconds" },
  ],
  models: [
    { value: "12+", label: "Model Stages" },
    { value: "100%", label: "Body Inclusive" },
    { value: "0", label: "Photoshoots Needed" },
  ],
  stylist: [
    { value: "7+", label: "Style Tools" },
    { value: "360°", label: "Style Intelligence" },
    { value: "100%", label: "Personalized" },
  ],
  branding: [
    { value: "8+", label: "Brand Tools" },
    { value: "1-Click", label: "PDF Export" },
    { value: "∞", label: "Brand Directions" },
  ],
  "tech-pack": [
    { value: "8+", label: "Production Tools" },
    { value: "1-Click", label: "PDF Export" },
    { value: "100%", label: "Manufacturer-Ready" },
  ],
  trends: [
    { value: "7+", label: "Intelligence Tools" },
    { value: "Real-Time", label: "Data Analysis" },
    { value: "First", label: "Know Trends Early" },
  ],
};

// ── Brand showcase slots ───────────────────────────────────────────────────
// 8 slots — all set as placeholders ready for user-supplied brand images.
// Labels and hints differentiate each slot; none have a real src yet.
const brandShowcaseSlots = [
  {
    id: "slot-1",
    label: "Your Brand Image",
    hint: "Add your store front or boutique photo",
  },
  {
    id: "slot-2",
    label: "Your Brand Image",
    hint: "Signature collection or lookbook",
  },
  {
    id: "slot-3",
    label: "Your Brand Image",
    hint: "Brand mood board or visual identity",
  },
  { id: "slot-4", label: "Your Brand Image", hint: "Hero product showcase" },
  {
    id: "slot-5",
    label: "Your Brand Image",
    hint: "Drop your brand template here",
  },
  {
    id: "slot-6",
    label: "Your Brand Image",
    hint: "Store mockup or editorial photo",
  },
  {
    id: "slot-7",
    label: "Your Brand Image",
    hint: "Campaign or behind-the-scenes photo",
  },
  {
    id: "slot-8",
    label: "Your Brand Image",
    hint: "Collection or product shot",
  },
];

// ── Component ─────────────────────────────────────────────────────────────

/**
 * StudioPage — renders a single AI studio's full page.
 *
 * Receives `studio` from the parent route handler; if the route param
 * doesn't match any studio in studioData.ts, the parent renders a 404
 * page instead and this component is never mounted.
 */
export default function StudioPage({ studio }: StudioPageProps) {
  const stats = studioStats[studio.id] ?? [];

  // Split features: first 3 are displayed as large highlighted cards;
  // remaining are shown in a smaller FeatureCard grid below.
  const featuredFeatures = studio.features.slice(0, 3);
  const remainingFeatures = studio.features.slice(3);

  return (
    <main id="main-content" className="overflow-x-hidden">
      {/* ─── 1. Hero ──────────────────────────────────────────────────────── */}
      <section
        aria-label={`${studio.name} — studio hero`}
        className="relative min-h-[70vh] flex items-center overflow-hidden"
      >
        {/* Full-backdrop hero image — shown as background with overlay when provided */}
        {studio.heroImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${studio.heroImage}')` }}
            aria-hidden="true"
          />
        )}
        {/* Dark screen overlay — keeps text legible while image shows through */}
        {studio.heroImage && (
          <div className="absolute inset-0 hero-overlay" aria-hidden="true" />
        )}
        {/* Layered gradient — blends into background at bottom and applies studio color tint */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${studio.color} ${studio.heroImage ? "opacity-40" : "opacity-60"}`}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent"
          aria-hidden="true"
        />

        {/* Decorative radial gold accent (top-right corner) */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] opacity-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.78 0.12 85 / 0.5) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Back navigation */}
        <div className="absolute top-6 left-4 md:left-8 z-20">
          <Link
            to={ALL_ROUTES.home}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition-colors font-body tracking-wide"
            data-ocid="studio.back_link"
            aria-label="Back to home page"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            Back to Home
          </Link>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
            {/* Left: Studio name, tagline, description, CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Breadcrumb label */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-2 mb-6"
                aria-label={`${BRAND_NAME} › ${studio.name}`}
              >
                <Sparkles
                  className="w-3.5 h-3.5 text-gold"
                  aria-hidden="true"
                />
                <span className="text-xs font-body uppercase tracking-[0.2em] text-gold">
                  {BRAND_NAME}
                </span>
                <ChevronRight
                  className="w-3 h-3 text-gold/50"
                  aria-hidden="true"
                />
                <span className="text-xs font-body uppercase tracking-[0.15em] text-muted-foreground">
                  {studio.name}
                </span>
              </motion.div>

              {/* Studio icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-5xl mb-5 text-gold drop-shadow-[0_0_12px_oklch(0.78_0.12_85_/_0.5)]"
                aria-hidden="true"
              >
                {studio.icon}
              </motion.div>

              {/* Studio name — onyx shimmer applied */}
              <h1 className="font-display text-5xl md:text-7xl font-bold mb-5 onyx-shimmer leading-tight">
                {studio.name}
              </h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xl md:text-2xl text-gold font-display italic mb-6 max-w-2xl"
              >
                {studio.tagline}
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-base md:text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl"
              >
                {studio.description}
              </motion.p>

              {/* Primary + secondary CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <Button
                  size="lg"
                  className="bg-gold text-background hover:opacity-90 font-semibold gold-glow transition-all duration-300"
                  asChild
                  data-ocid="studio.hero.primary_button"
                >
                  <Link
                    to={ALL_ROUTES.pricing}
                    aria-label={`Start creating in ${studio.name} — view pricing`}
                  >
                    Start in {studio.name}
                    <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gold/30 hover:border-gold/70 hover:bg-gold/5 transition-all duration-300"
                  asChild
                  data-ocid="studio.hero.secondary_button"
                >
                  <Link
                    to={ALL_ROUTES.features}
                    aria-label="Explore all 48 platform features"
                  >
                    Explore All Features
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Right: Studio hero image — visible on xl+ screens only */}
            {studio.heroImage && (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="hidden xl:block"
              >
                <div className="relative rounded-2xl overflow-hidden">
                  {/* Gold gradient border frame */}
                  <div
                    className="absolute -inset-[2px] rounded-2xl bg-gradient-to-b from-gold/60 via-gold/30 to-transparent z-0"
                    aria-hidden="true"
                  />
                  <div className="relative rounded-2xl overflow-hidden z-10">
                    <img
                      src={studio.heroImage}
                      alt={`${studio.name} — studio hero`}
                      className="w-full h-[480px] object-cover object-center"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent"
                      aria-hidden="true"
                    />
                    {/* Studio name + feature count label */}
                    <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                      <span className="text-sm font-display font-semibold text-foreground/90">
                        {studio.name}
                      </span>
                      <span className="text-xs font-body text-gold/70 border border-gold/30 rounded-full px-3 py-1">
                        {studio.features.length} features
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ─── 2. Stats Bar ─────────────────────────────────────────────────── */}
      {stats.length > 0 && (
        <section
          aria-label={`${studio.name} — statistics`}
          className="bg-card border-y border-border py-8"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center md:justify-around gap-8 md:gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="text-center"
                >
                  <div className="font-display text-3xl font-bold onyx-shimmer mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs font-body uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 3. Insight Quote ─────────────────────────────────────────────── */}
      {studio.insight && (
        <section
          aria-label={`${studio.name} — the CREATEai perspective`}
          className="py-20 bg-background relative overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, oklch(0.78 0.12 85) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div
                className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"
                aria-hidden="true"
              />
              <Sparkles
                className="w-6 h-6 text-gold mx-auto mb-6 opacity-70"
                aria-hidden="true"
              />
              <h3 className="font-display text-lg uppercase tracking-[0.2em] text-gold mb-6">
                The {BRAND_NAME} Perspective
              </h3>
              <blockquote className="text-xl md:text-2xl text-foreground/90 leading-relaxed italic font-display">
                &ldquo;{studio.insight}&rdquo;
              </blockquote>
              <div
                className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-8"
                aria-hidden="true"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── 4. Studio Capabilities ───────────────────────────────────────── */}
      <section
        aria-label={`${studio.name} — studio capabilities and features`}
        className="py-24 bg-muted/20"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="text-xs font-body uppercase tracking-[0.2em] text-gold mb-3 block">
              What&apos;s Inside
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold onyx-shimmer mb-4">
              Studio Capabilities
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every tool in {studio.name} is engineered for creative power —
              precision without limits.
            </p>
          </motion.div>

          {/* Top 3 hero features — large highlighted cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {featuredFeatures.map((feature, i) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="bg-card border border-border rounded-2xl p-7 card-hover group onyx-shimmer-border flex flex-col relative overflow-hidden"
                data-ocid={`studio.features.hero.${i + 1}`}
              >
                {/* Subtle radial gold glow in corner */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, oklch(0.78 0.12 85) 0%, transparent 70%)",
                  }}
                  aria-hidden="true"
                />
                <div className="text-3xl mb-4 leading-none" aria-hidden="true">
                  {feature.icon}
                </div>
                {/* Feature title — onyx-shimmer applied per requirement */}
                <h3 className="font-display text-xl font-semibold mb-3 onyx-shimmer">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {feature.description}
                </p>
                <div className="mt-5 pt-4 border-t border-border/40">
                  <span className="text-xs font-body uppercase tracking-widest text-gold/70 group-hover:text-gold transition-colors">
                    {studio.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Remaining features — smaller FeatureCard grid */}
          {remainingFeatures.length > 0 && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              data-ocid="studio.list"
            >
              {remainingFeatures.map((feature, i) => (
                <FeatureCard
                  key={feature.id}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={i + 3}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── 5. Brand Showcase ────────────────────────────────────────────── */}
      <section
        aria-label={`${studio.name} — brand image showcase`}
        className="py-28 bg-card relative overflow-hidden"
        data-ocid="studio.brand_showcase.section"
      >
        {/* Ambient gold glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.06] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.78 0.12 85) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute top-0 left-0 right-0 h-px section-divider"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px section-divider"
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-body uppercase tracking-[0.25em] text-gold mb-4 block">
              Your Brand, Visualized
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold onyx-shimmer mb-5">
              Brand Showcase
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Integrate your own brand template photos, store mockups, and
              editorial imagery. These 8 placeholder slots are ready for your
              real brand visuals — your dream store, lookbook, or collection.
            </p>
          </motion.div>

          {/* 8 placeholder upload slots in a 4-column grid (2 rows of 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {brandShowcaseSlots.map((slot, i) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                data-ocid={`studio.brand_showcase.item.${i + 1}`}
                className="group relative"
              >
                <button
                  type="button"
                  className="w-full rounded-2xl border-2 border-dashed border-gold/25 hover:border-gold/60 bg-muted/10 hover:bg-gold/[0.04] transition-all duration-300 cursor-pointer overflow-hidden"
                  data-ocid={`studio.brand_showcase.upload_button.${i + 1}`}
                  aria-label={`${slot.label} — slot ${i + 1}: ${slot.hint}`}
                >
                  <div className="aspect-[3/2] flex flex-col items-center justify-center p-6 gap-4">
                    {/* Upload icon */}
                    <div className="w-12 h-12 rounded-full border border-gold/30 group-hover:border-gold/60 bg-gold/5 group-hover:bg-gold/10 flex items-center justify-center transition-all duration-300">
                      <ImagePlus
                        className="w-5 h-5 text-gold/50 group-hover:text-gold/80 transition-colors duration-300"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-display text-sm font-semibold text-foreground/60 group-hover:text-foreground/90 transition-colors duration-300 mb-1">
                        {slot.label}
                      </p>
                      <p className="text-xs text-muted-foreground font-body leading-snug max-w-[140px] mx-auto">
                        {slot.hint}
                      </p>
                    </div>
                    <span className="text-[10px] font-body uppercase tracking-[0.15em] text-gold/40 group-hover:text-gold/70 transition-colors duration-300 border border-gold/20 group-hover:border-gold/40 rounded-full px-3 py-1">
                      Your Brand Here
                    </span>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-muted-foreground text-sm mb-5 font-body">
              Ready to integrate your real brand templates and store visuals?
            </p>
            <Button
              size="lg"
              className="bg-gold text-background hover:opacity-90 font-semibold gold-glow transition-all duration-300 px-10"
              asChild
              data-ocid="studio.brand_showcase.primary_button"
            >
              <Link
                to={ALL_ROUTES.pricing}
                aria-label="Unlock brand showcase — view pricing"
              >
                Unlock Brand Showcase
                <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ─── 6. FAQ ───────────────────────────────────────────────────────── */}
      {studio.faq && studio.faq.length > 0 && (
        <section
          aria-label={`${studio.name} — frequently asked questions`}
          className="py-24 bg-background"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <span className="text-xs font-body uppercase tracking-[0.2em] text-gold mb-3 block">
                  Need Answers?
                </span>
                <h2 className="font-display text-4xl font-bold onyx-shimmer">
                  Questions &amp; Answers
                </h2>
              </motion.div>

              <Accordion
                type="single"
                collapsible
                className="space-y-3"
                data-ocid="studio.faq.list"
              >
                {studio.faq.map((item, i) => (
                  <AccordionItem
                    key={item.q}
                    value={`faq-${i}`}
                    className="bg-card border border-border/60 hover:border-gold/30 rounded-xl px-5 transition-colors duration-200"
                    data-ocid={`studio.faq.item.${i + 1}`}
                    aria-label={`FAQ: ${item.q}`}
                  >
                    <AccordionTrigger className="font-display font-semibold text-left hover:text-gold hover:no-underline py-5 text-base">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      )}

      {/* ─── 7. CTA ───────────────────────────────────────────────────────── */}
      <section
        aria-label={`${studio.name} — begin your journey`}
        className="py-24 bg-card relative overflow-hidden"
        data-ocid="studio.cta"
      >
        {/* Ambient gold glow */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, oklch(0.78 0.12 85) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute top-0 left-0 right-0 h-px section-divider"
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="text-5xl mb-6 text-gold drop-shadow-[0_0_16px_oklch(0.78_0.12_85_/_0.6)]"
              aria-hidden="true"
            >
              {studio.icon}
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold onyx-shimmer mb-4">
              Begin Your Journey in {studio.name}
            </h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto text-lg">
              Every man. Every woman. Every visionary deserves to create without
              limits. Your transformation starts here.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button
                size="lg"
                className="bg-gold text-background hover:opacity-90 font-semibold gold-glow transition-all duration-300 px-8"
                asChild
                data-ocid="studio.cta.primary_button"
              >
                <Link
                  to={ALL_ROUTES.pricing}
                  aria-label={`Start creating in ${studio.name} — view pricing`}
                >
                  Start in {studio.name}
                  <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gold/30 hover:border-gold/70 hover:bg-gold/5 transition-all duration-300"
                asChild
                data-ocid="studio.cta.secondary_button"
              >
                <Link
                  to={ALL_ROUTES.features}
                  aria-label="Explore all 48 platform features"
                >
                  Explore All Features
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-px section-divider"
          aria-hidden="true"
        />
      </section>
    </main>
  );
}
