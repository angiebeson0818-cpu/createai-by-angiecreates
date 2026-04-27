/**
 * @file pages/HomePage.tsx
 * @description CREATEai landing page — the primary entry point for all visitors.
 *
 * Sections (in order):
 *  1. Hero             — Full-viewport backdrop (Angin Water image + dark overlay),
 *                        headline copy, gold-framed founder photo, CTAs.
 *  2. Stats Bar        — Four platform-wide proof points (users, studios, designs, satisfaction).
 *  3. Studios Grid     — All 7 AI studios loaded from studioData.ts, rendered as StudioCards.
 *  4. Architecture     — "You Were Made For This" confidence-boosting section with inclusive
 *                        messaging ("every man, every woman, every visionary") and Pure Flow callout.
 *  5. Nail Atelier     — Teaser card linking to /nail-atelier.
 *  6. Featured Features — Six signature feature cards pulled from allFeatures.
 *  7. Testimonials     — Three real creator quotes.
 *  8. Brand Vision     — Placeholder image slots for user-supplied brand/store photos.
 *  9. Community Preview — Three most recent public designs via useAllPublicDesigns()
 *                        with skeleton loading state and graceful empty state on error.
 * 10. CTA Banner       — Final call-to-action to pricing and community.
 * 11. FAQ              — Accordion with five frequently-asked questions.
 *
 * Dependencies:
 *  - ASSET_PATHS, BRAND_NAME, ALL_ROUTES from constants/brand.ts
 *  - useAllPublicDesigns from hooks/useQueries.ts
 *  - studios, allFeatures from data/studioData.ts
 *  - StudioCard, FeatureCard from components/
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Camera,
  ImagePlus,
  Quote,
  Sparkles,
  Store,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import FeatureCard from "../components/FeatureCard";
import StudioCard from "../components/StudioCard";
import { ALL_ROUTES, ASSET_PATHS, BRAND_NAME } from "../constants/brand";
import { allFeatures, studios } from "../data/studioData";
import { useAllPublicDesigns } from "../hooks/useQueries";

// ── Brand image placeholder slots ─────────────────────────────────────────
// Three portrait slots for user-supplied collection / editorial / boutique photos.
// The "Your Dream Store" wide slot has been replaced by Angela's founder portrait above.
const brandImageSlots = [
  {
    id: "brand-template-1",
    label: "Signature Collection",
    hint: "Place your brand template or lookbook image here",
    icon: <ImagePlus className="w-8 h-8" />,
    accent: "Collection I",
    wide: false,
  },
  {
    id: "brand-template-2",
    label: "Editorial Campaign",
    hint: "Your editorial or campaign imagery",
    icon: <Camera className="w-8 h-8" />,
    accent: "Campaign II",
    wide: false,
  },
  {
    id: "brand-template-3",
    label: "Fantasy Boutique",
    hint: "Your dream store interior or display",
    icon: <Store className="w-8 h-8" />,
    accent: "The Boutique",
    wide: false,
  },
];

// ── Featured feature IDs ───────────────────────────────────────────────────
// Selects six signature features from across the 7 studios for the homepage preview.
const FEATURED_FEATURE_IDS = [
  "prompt-to-piece",
  "digital-drape",
  "signature-persona",
  "live-trend-pulse",
  "identity-forge",
  "spec-architect",
];

const featuredFeatures = FEATURED_FEATURE_IDS.map((id) =>
  allFeatures.find((f) => f.id === id),
).filter(Boolean) as typeof allFeatures;

// ── Testimonials ──────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Marcelline O.",
    role: "Independent Fashion Designer",
    quote:
      "CREATEai is my entire design process now. From sketch to color story to tech pack — in one place. I see myself as a powerhouse creator for the first time.",
  },
  {
    name: "Devon K.",
    role: "E-commerce Brand Founder",
    quote:
      "Virtual try-ons cut our return rate in half. Our product pages look like editorial shoots now, and our customers feel more confident ordering.",
  },
  {
    name: "Priya S.",
    role: "Trend Consultant",
    quote:
      "The Trend Intelligence studio alone is worth everything. I catch what's coming before my competitors even notice the shift. It's a superpower.",
  },
];

// ── Stats ─────────────────────────────────────────────────────────────────
const stats = [
  {
    icon: <Users className="w-5 h-5" />,
    value: "50,000+",
    label: "Fashion Creators",
  },
  { icon: <Zap className="w-5 h-5" />, value: "7", label: "AI Studios" },
  {
    icon: <Sparkles className="w-5 h-5" />,
    value: "2M+",
    label: "Designs Created",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    value: "98%",
    label: "Satisfaction Rate",
  },
];

// ── Confidence booster tiles ──────────────────────────────────────────────
const confidenceTiles = [
  { icon: "⚡", title: "10× Faster", desc: "Design iteration speed" },
  { icon: "✦", title: "Pure Flow", desc: "Creative exploration, unleashed" },
  {
    icon: "🌍",
    title: "Global Scale",
    desc: "Trusted by visionaries worldwide",
  },
  {
    icon: "📈",
    title: "Higher ROI",
    desc: "Better visuals, better conversions",
  },
  { icon: "🎯", title: "Total Control", desc: "Every detail in your hands" },
  {
    icon: "🌟",
    title: "Inclusive by Design",
    desc: "For every creator, every story",
  },
];

// ── FAQ items ─────────────────────────────────────────────────────────────
const faqItems = [
  {
    q: `What is ${BRAND_NAME}?`,
    a: "CREATEai is an all-in-one fashion AI platform engineered to bridge creative imagination and commercial reality. It provides 7 specialized AI studios — The Design Atelier, The Mirror Studio, The Model Forge, The Style Compass, The Brand Vault, The Precision Lab, and The Trend Intelligence.",
  },
  {
    q: "How do credits work?",
    a: "One credit equals one image or creation. Credits never expire and can be used across all studios. Purchase credit packs starting at $5 or subscribe to a monthly plan for regular usage.",
  },
  {
    q: "Can I use CREATEai for e-commerce?",
    a: "Absolutely. CREATEai is purpose-built for fashion e-commerce. Generate product photos, virtual try-ons, and on-model images without expensive photoshoots.",
  },
  {
    q: "What is Pure Flow?",
    a: "Pure Flow is our design philosophy — creative exploration, unleashed. No barriers, no friction. Just your ideas flowing into beautiful, production-ready designs.",
  },
  {
    q: "Can I collaborate with my team?",
    a: "Yes. Add team members to your account and design together in real time. Share one workspace to build collections collaboratively with your full creative team.",
  },
];

// ── Component ─────────────────────────────────────────────────────────────

/**
 * HomePage — renders the full CREATEai landing page.
 *
 * Data fetching: useAllPublicDesigns() is called once for the community preview
 * section. All other content is static/derived from studioData.ts.
 */
export default function HomePage() {
  const {
    data: publicDesigns = [],
    isLoading: designsLoading,
    isError: designsError,
  } = useAllPublicDesigns();

  // Show the three most recent public designs in the community preview.
  const previewDesigns = publicDesigns.slice(0, 3);

  return (
    <main id="main-content">
      {/* ─── 1. Hero ──────────────────────────────────────────────────────── */}
      <section
        aria-label="Hero — CREATEai platform introduction"
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* Full-viewport Angin Water backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${ASSET_PATHS.heroBackground}')` }}
          aria-hidden="true"
        />
        {/* Dark screen overlay — preserves image as backdrop while making text readable */}
        <div className="absolute inset-0 hero-overlay" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30"
          aria-hidden="true"
        />

        <div className="relative z-10 container mx-auto px-4 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-4 h-4 text-gold" aria-hidden="true" />
                <span className="text-xs font-body uppercase tracking-widest text-gold">
                  All-in-One Fashion AI Platform
                </span>
              </div>

              <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
                <span className="gradient-text">Design. Visualize.</span>{" "}
                <span className="onyx-shimmer">Sell.</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-3 max-w-2xl">
                Powered by AI. Built for every creator.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mb-10 max-w-2xl">
                {BRAND_NAME} is engineered to bridge the gap between creative
                imagination and commercial reality. Every man, every woman,
                every visionary — trusted by a global community to design,
                market, and sell faster than ever before.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-gold text-background hover:opacity-90 font-semibold text-base h-14 px-8 gold-glow-hover transition-all"
                  asChild
                  data-ocid="hero.primary_button"
                >
                  <Link
                    to={ALL_ROUTES.home}
                    aria-label="Start creating in the Design Atelier"
                  >
                    <Sparkles className="w-5 h-5 mr-2" aria-hidden="true" />
                    Start Creating
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-gold/40 text-gold hover:bg-gold/10 font-semibold text-base h-14 px-8 transition-all"
                  asChild
                  data-ocid="hero.secondary_button"
                >
                  <Link
                    to={ALL_ROUTES.features}
                    aria-label="Explore all 7 AI studios"
                  >
                    Explore Studios{" "}
                    <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Right: Angela's gold-framed founder photo */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="hidden lg:flex justify-center items-end"
            >
              <div className="relative">
                {/* Ornate gold glow */}
                <div
                  className="absolute -inset-3 rounded-2xl bg-gradient-to-b from-gold/50 via-gold/20 to-transparent blur-xl"
                  aria-hidden="true"
                />
                {/* Gold border frame */}
                <div
                  className="absolute -inset-[3px] rounded-2xl bg-gradient-to-b from-gold via-gold/60 to-gold/20"
                  aria-hidden="true"
                />
                {/* Corner accent marks */}
                <div
                  className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-gold rounded-tl"
                  aria-hidden="true"
                />
                <div
                  className="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-gold rounded-tr"
                  aria-hidden="true"
                />
                <div
                  className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-gold rounded-bl"
                  aria-hidden="true"
                />
                <div
                  className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-gold rounded-br"
                  aria-hidden="true"
                />

                <div
                  className="relative rounded-2xl overflow-hidden shadow-2xl"
                  style={{ maxHeight: "75vh" }}
                >
                  <img
                    src={ASSET_PATHS.portrait}
                    alt="Angela Beson – Fashion AI Creator & Founder of CREATEai by angieCREATEs"
                    className="object-cover object-top w-full h-full"
                    style={{ maxHeight: "75vh", minWidth: "320px" }}
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/80 to-transparent"
                    aria-hidden="true"
                  />
                </div>

                {/* Founder badge */}
                <div
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-card border border-gold/40 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-lg whitespace-nowrap gold-glow"
                  aria-label="Angela Beson, Founder"
                >
                  <Sparkles
                    className="w-3.5 h-3.5 text-gold"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-body text-gold tracking-wide">
                    Angela Beson · Founder
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          aria-hidden="true"
        >
          <div className="w-6 h-10 border-2 border-gold/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-gold/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ─── 2. Stats Bar ─────────────────────────────────────────────────── */}
      <section
        aria-label="Platform statistics"
        className="py-12 border-y border-border bg-card/60"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(({ icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className="text-gold mb-1" aria-hidden="true">
                  {icon}
                </div>
                <div className="font-display text-3xl font-bold gradient-text">
                  {value}
                </div>
                <div className="text-sm text-muted-foreground font-body">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. Studios Grid ──────────────────────────────────────────────── */}
      <section
        id="studios"
        aria-label="The seven AI studios"
        className="py-24 bg-background"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-body uppercase tracking-widest text-gold mb-3 block">
                The Studios
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 onyx-shimmer">
                The Architecture of Creative Power
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Seven specialized AI studios. One seamless creative ecosystem —
                from concept to commerce at the speed of imagination.
              </p>
            </motion.div>
          </div>

          <ul
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 list-none p-0 m-0"
            data-ocid="studios.list"
            aria-label="List of AI studios"
          >
            {studios.map((studio, i) => (
              <li key={studio.id}>
                <StudioCard studio={studio} index={i} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── 4. Architecture of Creative Power / Confidence Boosters ─────── */}
      <section
        aria-label="You Were Made For This — confidence and empowerment"
        className="py-24 bg-card"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Inspirational copy — inclusive, gender-neutral, empowering */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-body uppercase tracking-widest text-gold mb-3 block">
                The Revolution
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                You Were Made For This.
              </h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  {BRAND_NAME} is built for the creator who knows they have
                  something powerful inside — and just needs the tools to let it
                  out. This platform is your stage, your studio, your unfair
                  advantage.
                </p>
                <p>
                  When you step into these studios, you step into a version of
                  yourself that moves faster, thinks bolder, and creates with a
                  confidence you may not have felt before. That's not
                  coincidence — that's by design. This platform is for{" "}
                  <span className="text-foreground font-medium">
                    every man, every woman, every visionary who refuses to be
                    contained.
                  </span>
                </p>
                <p>
                  Because when you feel good, you look good. When you look good,
                  you work harder. And when you work with intent, beauty, and
                  brains? You become{" "}
                  <span className="gradient-text font-semibold">
                    unstoppable.
                  </span>
                </p>
                <p>
                  {BRAND_NAME} doesn't just accelerate your workflow — it
                  elevates your identity as a creator. Every design you generate
                  is proof of your vision. Every collection you build is a
                  testament to your power. You will see yourself differently
                  here. And the world will too.
                </p>
              </div>
            </motion.div>

            {/* Callout tiles: Pure Flow + other proof points */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {confidenceTiles.map(({ icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-background border border-border rounded-xl p-5 text-center card-hover"
                >
                  <div className="text-3xl mb-2" aria-hidden="true">
                    {icon}
                  </div>
                  <div className="font-display font-bold text-foreground mb-1">
                    {title}
                  </div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 5. Nail Atelier Teaser ───────────────────────────────────────── */}
      <section
        aria-label="The Nail Atelier — new feature spotlight"
        className="py-16 bg-card border-y border-border"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden border border-gold/40 bg-background group card-hover onyx-shimmer-border">
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/assets/nail-design-reference.png')",
                }}
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-background/97 via-background/85 to-background/40"
                aria-hidden="true"
              />

              {/* Gold corner accents */}
              <div
                className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-gold/50 rounded-tl z-10"
                aria-hidden="true"
              />
              <div
                className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-gold/50 rounded-tr z-10"
                aria-hidden="true"
              />
              <div
                className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-gold/50 rounded-bl z-10"
                aria-hidden="true"
              />
              <div
                className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-gold/50 rounded-br z-10"
                aria-hidden="true"
              />

              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 p-8 sm:p-10">
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-3xl group-hover:bg-gold/20 group-hover:border-gold/70 transition-all duration-300"
                  aria-hidden="true"
                >
                  💅
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display text-2xl md:text-3xl font-bold onyx-shimmer">
                      The Nail Atelier
                    </h3>
                    <span
                      className="flex-shrink-0 text-[10px] px-2.5 py-1 rounded-full bg-gold/15 text-gold border border-gold/40 font-body tracking-wider uppercase font-bold"
                      aria-label="New feature"
                    >
                      NEW
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-5 max-w-lg">
                    AI-precision nail overlays fitted seamlessly to model hands.
                    15 signature sets — chrome luxe to editorial art — scalable
                    to any pose and skin tone.
                  </p>
                  <Button
                    className="bg-gold text-background hover:opacity-90 font-semibold gold-glow-hover transition-all"
                    asChild
                    data-ocid="nail_atelier.teaser.cta_button"
                  >
                    <Link
                      to={ALL_ROUTES.nailAtelier}
                      aria-label="Explore The Nail Atelier studio"
                    >
                      <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
                      Explore The Nail Atelier
                      <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 6. Featured Features Preview ────────────────────────────────── */}
      <section
        aria-label="Signature feature highlights"
        className="py-24 bg-background"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-body uppercase tracking-widest text-gold mb-3 block">
              Signature Capabilities
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 onyx-shimmer">
              Standout Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A glimpse at the tools redefining what creators can achieve. 48
              features. Infinite possibilities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {featuredFeatures.map((feature, i) => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                badge={feature.studioName}
                index={i}
              />
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10 h-12 px-8 font-semibold"
              asChild
              data-ocid="features.preview.cta"
            >
              <Link
                to={ALL_ROUTES.features}
                aria-label="View all 48 platform features"
              >
                View All 48 Features{" "}
                <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── 7. Testimonials ──────────────────────────────────────────────── */}
      <section aria-label="Creator testimonials" className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-body uppercase tracking-widest text-gold mb-3 block">
              The Community Speaks
            </span>
            <h2 className="font-display text-4xl font-bold mb-4 onyx-shimmer">
              Creators Transformed
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Real creators. Real results. Real confidence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background border border-border rounded-xl p-7 flex flex-col gap-4 card-hover onyx-shimmer-border"
              >
                <Quote className="w-7 h-7 text-gold/50" aria-hidden="true" />
                <p className="text-muted-foreground leading-relaxed flex-1 italic">
                  "{t.quote}"
                </p>
                <div>
                  <div className="font-display font-semibold text-foreground">
                    {t.name}
                  </div>
                  <div className="text-xs text-gold/70 font-body">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. Your Vision, Your Brand ───────────────────────────────────── */}
      <section
        id="brand-vision"
        aria-label="Your brand image showcase — placeholder slots"
        className="py-24 bg-background"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-body uppercase tracking-widest text-gold mb-3 block">
              Your Brand, Your World
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 onyx-shimmer">
              Your Vision, Your Brand
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              This space is yours. Showcase your store, your collections, and
              your creative world — exactly as you imagined it.
            </p>
          </motion.div>

          {/* Brand image grid: 1 wide founder portrait + 3 portrait slots */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
            {/* Wide: Angela Beson editorial founder portrait card */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 relative group"
              data-ocid="brand_vision.slot.1"
            >
              <div className="relative rounded-2xl overflow-hidden border-2 border-gold/50 h-80 lg:h-[460px] card-hover gold-glow">
                {/* Gold glow backdrop */}
                <div
                  className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-gold via-gold/50 to-gold/20 pointer-events-none z-10"
                  aria-hidden="true"
                />
                {/* Angela's portrait */}
                <img
                  src={ASSET_PATHS.portrait}
                  alt="Angela Beson – Founder & Creative Director of CREATEai by angieCREATEs"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                {/* Dark overlay gradient */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent z-20"
                  aria-hidden="true"
                />
                {/* Corner accent marks */}
                <div
                  className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gold rounded-tl-sm z-30"
                  aria-hidden="true"
                />
                <div
                  className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gold rounded-tr-sm z-30"
                  aria-hidden="true"
                />
                <div
                  className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gold rounded-bl-sm z-30"
                  aria-hidden="true"
                />
                <div
                  className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gold rounded-br-sm z-30"
                  aria-hidden="true"
                />
                {/* Name badge at bottom */}
                <div className="absolute bottom-6 left-0 right-0 z-30 px-8">
                  <div className="flex items-end gap-4">
                    <div>
                      <div className="font-display text-xl md:text-2xl font-bold text-foreground leading-tight">
                        Angela Beson
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Sparkles
                          className="w-3 h-3 text-gold"
                          aria-hidden="true"
                        />
                        <span className="text-gold font-body text-xs uppercase tracking-[0.2em]">
                          Founder &amp; Creative Director
                        </span>
                      </div>
                    </div>
                    <div className="ml-auto flex-shrink-0 px-3 py-1.5 rounded-full border border-gold/40 bg-card/70 backdrop-blur-sm text-gold text-[10px] font-body tracking-widest uppercase">
                      angieCREATEs
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Three portrait slots */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-5">
              {brandImageSlots
                .filter((s) => !s.wide)
                .map((slot, i) => (
                  <motion.div
                    key={slot.id}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    className="relative group"
                    data-ocid={`brand_vision.slot.${i + 2}`}
                  >
                    <div className="relative rounded-xl overflow-hidden border border-gold/20 bg-card h-36 lg:h-[140px] flex items-center gap-5 px-6 card-hover">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-gold/6 via-transparent to-transparent pointer-events-none"
                        aria-hidden="true"
                      />
                      <div
                        className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-gold/50 to-transparent"
                        aria-hidden="true"
                      />
                      <div
                        className="relative z-10 text-gold/35 flex-shrink-0"
                        aria-hidden="true"
                      >
                        {slot.icon}
                      </div>
                      <div className="relative z-10 flex-1 min-w-0">
                        <div className="font-display font-semibold text-foreground text-sm mb-1 truncate">
                          {slot.label}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {slot.hint}
                        </div>
                      </div>
                      <div className="relative z-10 flex-shrink-0">
                        <div
                          className="w-8 h-8 rounded-full border border-gold/25 flex items-center justify-center text-gold/40 group-hover:border-gold/60 group-hover:text-gold/80 transition-all duration-300"
                          aria-hidden="true"
                        >
                          <ImagePlus className="w-4 h-4" />
                        </div>
                      </div>
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-gold/5 to-transparent pointer-events-none"
                        aria-hidden="true"
                      />
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground font-body italic">
              Share your brand images and we'll integrate them directly into
              your platform →{" "}
              <a
                href="mailto:angie@angiecreates.com"
                className="text-gold/70 hover:text-gold transition-colors underline underline-offset-2"
                aria-label="Email Angela Beson to integrate your brand images"
              >
                angie@angiecreates.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ─── 9. Community Preview ─────────────────────────────────────────── */}
      <section
        aria-label="Community gallery preview — recent public designs"
        className="py-24 bg-card"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-body uppercase tracking-widest text-gold mb-3 block">
              The Community
            </span>
            <h2 className="font-display text-4xl font-bold mb-4 onyx-shimmer">
              From the Gallery
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A glimpse at what creators are building right now.
            </p>
          </motion.div>

          {/* Loading skeleton */}
          {designsLoading && (
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-5"
              data-ocid="community.loading_state"
              aria-label="Loading community designs"
              aria-busy="true"
            >
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="rounded-2xl overflow-hidden border border-border bg-card"
                >
                  <Skeleton className="w-full aspect-square" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error / graceful empty state */}
          {!designsLoading && (designsError || previewDesigns.length === 0) && (
            <div
              className="text-center py-16 rounded-2xl border border-border bg-background"
              data-ocid="community.empty_state"
              aria-label="No community designs available"
            >
              <div className="text-5xl mb-4" aria-hidden="true">
                ✦
              </div>
              <p className="font-display text-xl font-semibold text-foreground mb-2">
                Be the first to inspire
              </p>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
                {designsError
                  ? "Gallery is temporarily unavailable. Check back soon."
                  : "No designs have been shared yet. Yours could be the first."}
              </p>
              <Button
                variant="outline"
                className="border-gold/40 text-gold hover:bg-gold/10"
                asChild
                data-ocid="community.empty_state.cta_button"
              >
                <Link
                  to={ALL_ROUTES.community}
                  aria-label="Visit the full community gallery"
                >
                  Visit the Gallery{" "}
                  <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          )}

          {/* Design cards */}
          {!designsLoading && !designsError && previewDesigns.length > 0 && (
            <>
              <ul
                className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8 list-none p-0 m-0"
                data-ocid="community.list"
                aria-label="Community design preview"
              >
                {previewDesigns.map((design, i) => (
                  <motion.li
                    key={design.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl overflow-hidden border border-border bg-card card-hover group"
                    data-ocid={`community.item.${i + 1}`}
                  >
                    {/* Image area — designs stored as Uint8Array; show placeholder when empty */}
                    <div className="aspect-square bg-muted relative overflow-hidden flex items-center justify-center">
                      {design.image?.length > 0 ? (
                        <div
                          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                          style={{
                            backgroundImage: `url("data:image/png;base64,${btoa(String.fromCharCode(...design.image))}")`,
                          }}
                          role="img"
                          aria-label={`Community design: ${design.metadata.title}`}
                        />
                      ) : (
                        <span
                          className="text-4xl text-muted-foreground/30"
                          aria-hidden="true"
                        >
                          ✦
                        </span>
                      )}
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="p-4">
                      <div className="font-display font-semibold text-foreground text-sm truncate mb-1">
                        {design.metadata.title || "Untitled Design"}
                      </div>
                      <div className="text-xs text-gold/60 font-body">
                        {design.metadata.studioType || "CREATEai Studio"}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <div className="text-center">
                <Button
                  variant="outline"
                  className="border-gold/40 text-gold hover:bg-gold/10 h-12 px-8 font-semibold"
                  asChild
                  data-ocid="community.view_all.button"
                >
                  <Link
                    to={ALL_ROUTES.community}
                    aria-label="View all designs in the community gallery"
                  >
                    View Full Gallery{" "}
                    <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ─── 10. CTA Banner ───────────────────────────────────────────────── */}
      <section
        aria-label="Call to action — begin your creative journey"
        className="py-24 bg-background relative overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent pointer-events-none"
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Begin Your Vision
            </h2>
            <p className="text-muted-foreground text-lg mb-3 max-w-xl mx-auto">
              Join 50,000+ fashion creators using AI to design, market, and sell
              faster than ever before.
            </p>
            <p className="text-gold/70 text-sm mb-10 font-body italic">
              Every man. Every woman. Every visionary.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-gold text-background hover:opacity-90 font-semibold text-base h-14 px-10 gold-glow"
                asChild
                data-ocid="cta.primary_button"
              >
                <Link
                  to={ALL_ROUTES.pricing}
                  aria-label="View pricing plans and credit packs"
                >
                  View Pricing{" "}
                  <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:border-gold/50 font-semibold h-14 px-10 transition-all"
                asChild
                data-ocid="cta.secondary_button"
              >
                <Link
                  to={ALL_ROUTES.community}
                  aria-label="Explore the community gallery"
                >
                  Explore Community
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 11. FAQ ──────────────────────────────────────────────────────── */}
      <section
        aria-label="Frequently asked questions"
        className="py-24 bg-card"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4 onyx-shimmer">
                The Brief
              </h2>
              <p className="text-muted-foreground">
                Everything you need to know about {BRAND_NAME}.
              </p>
            </div>

            <Accordion
              type="single"
              collapsible
              className="space-y-2"
              data-ocid="faq.list"
            >
              {faqItems.map((item, i) => (
                <AccordionItem
                  key={item.q}
                  value={`item-${i}`}
                  className="bg-background border border-border rounded-lg px-4"
                  data-ocid={`faq.item.${i + 1}`}
                  aria-label={`FAQ: ${item.q}`}
                >
                  <AccordionTrigger className="font-display font-semibold text-left hover:text-gold hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </main>
  );
}
