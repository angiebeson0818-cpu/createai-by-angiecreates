/**
 * @file pages/NailAtelierPage.tsx
 * @description The Nail Atelier — a dedicated showcase inside The Mirror Studio
 * for AI-applied nail design. Displays 8 live nail design sets and 7 open
 * upload slots, with a gold-framed model preview, how-it-works steps, and
 * a Mirror Studio integration teaser.
 */

import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Eye, Sparkles, Upload } from "lucide-react";
import { motion } from "motion/react";

// ── Nail design data ───────────────────────────────────────────────────────

/** A single nail design set entry. isLive=true means we have a real image. */
interface NailSet {
  /** 1-based position in the collection (used for display numbering). */
  id: number;
  /** Editorial name shown in onyx-shimmer text. */
  name: string;
  /** Path to the nail design image, or null for empty upload slots. */
  image: string | null;
  /** Short description of the design style. */
  description: string;
  /** Whether a real image is available (vs. an empty upload slot). */
  isLive: boolean;
}

/**
 * The 8 live nail design sets — exact descriptions as specified.
 * Sets 9–15 are generated as empty placeholder upload slots below.
 */
const LIVE_NAIL_SETS: NailSet[] = [
  {
    id: 1,
    name: "Chrome Luxe",
    image: "/assets/nail-design-reference.png",
    description:
      "Peach-nude coffins with diagonal silver/gold chrome streaks, glitter accents & crescent moon ring",
    isLive: true,
  },
  {
    id: 2,
    name: "Galaxy Cosmos",
    image: "/assets/nail-galaxy.png",
    description:
      "Midnight galaxies on coffin tips — silver stars, cosmic purple, iridescent shimmer",
    isLive: true,
  },
  {
    id: 3,
    name: "Leopard French Luxe",
    image: "/assets/nail-leopard-french.png",
    description:
      "Gold leopard French tips — chrome rosegold base, wild-luxe pattern",
    isLive: true,
  },
  {
    id: 4,
    name: "Emerald Baroque",
    image: "/assets/nail-emerald-baroque.png",
    description:
      "Deep emerald baroque — ornate gold filigree on forest green gel",
    isLive: true,
  },
  {
    id: 5,
    name: "Pink Bow Dream",
    image: "/assets/nail-pink-bow.png",
    description:
      "Soft pink 3D bow nail — pastel glitter base, sculpted ribbon accent",
    isLive: true,
  },
  {
    id: 6,
    name: "Crimson Noir",
    image: "/assets/nail-crimson-noir.png",
    description:
      "Deep crimson noir — matte base with gloss drip, chrome stiletto tip",
    isLive: true,
  },
  {
    id: 7,
    name: "Pink Leopard Royale",
    image: "/assets/nail-pink-leopard.png",
    description:
      "Pink leopard royale — baby pink base, black-gold spots, diamond accent",
    isLive: true,
  },
  {
    id: 8,
    name: "Orange Sunset Floral",
    image: "/assets/nail-orange-floral.png",
    description:
      "Orange sunset floral — warm ombré from tangerine to gold with painted daisy",
    isLive: true,
  },
];

/** 7 empty upload placeholder slots (IDs 9–15). */
const EMPTY_SLOTS: NailSet[] = Array.from({ length: 7 }, (_, i) => ({
  id: i + 9,
  name: "Upload Nail Design",
  image: null,
  description: "",
  isLive: false,
}));

/** Full 15-set collection — 8 live designs followed by 7 empty slots. */
const ALL_NAIL_SETS: NailSet[] = [...LIVE_NAIL_SETS, ...EMPTY_SLOTS];

// ── How it works steps ─────────────────────────────────────────────────────

/** Three-step explanation of the AI nail application process. */
const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Upload Design",
    desc: "Select from 15 signature nail sets — from chrome luxe to baroque floral, each precision-crafted for the editorial eye.",
  },
  {
    step: "02",
    title: "Select Model Hand",
    desc: "Our AI reads the model's hand pose, scales the design precisely, and overlays each nail seamlessly to every finger.",
  },
  {
    step: "03",
    title: "AI Applies Nails",
    desc: "Download high-resolution results ready for lookbooks, social campaigns, e-commerce pages, or client presentations.",
  },
];

// ── Nail set card component ────────────────────────────────────────────────

interface NailSetCardProps {
  set: NailSet;
  /** Position index in the rendered grid (used for animation delay). */
  index: number;
}

/**
 * NailSetCard — renders one nail design tile.
 * Live sets show the design image; empty slots show a dashed upload prompt.
 */
function NailSetCard({ set, index }: NailSetCardProps) {
  const padded = String(set.id).padStart(2, "0");
  const ariaLabel = set.isLive
    ? `Set ${padded} — ${set.name}: ${set.description}`
    : `Set ${padded} — empty upload slot`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="group relative rounded-xl overflow-hidden border border-border bg-card card-hover onyx-shimmer-border"
      aria-label={ariaLabel}
      data-ocid={`nail_atelier.set.${set.id}`}
    >
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden bg-background">
        {set.isLive && set.image !== null ? (
          <img
            src={set.image}
            alt={`Set ${padded} — ${set.name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          /* Empty upload slot — dashed border treatment */
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gold/25 m-2 rounded-lg relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/6 via-transparent to-gold/4 rounded-lg" />
            {/* Decorative corner accents */}
            <div className="absolute top-2 left-2 w-5 h-5 border-t border-l border-gold/30 rounded-tl" />
            <div className="absolute top-2 right-2 w-5 h-5 border-t border-r border-gold/30 rounded-tr" />
            <div className="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-gold/30 rounded-bl" />
            <div className="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-gold/30 rounded-br" />
            <Upload className="w-6 h-6 text-gold/40 relative z-10" />
            <p className="text-[10px] text-muted-foreground font-body tracking-widest uppercase relative z-10">
              Slot {padded}
            </p>
          </div>
        )}
        {/* Gold number badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-card/80 backdrop-blur-sm border border-gold/40 text-gold text-[10px] font-body font-bold">
            {padded}
          </span>
        </div>
      </div>

      {/* Card footer */}
      <div className="p-3">
        {/* Design name in onyx-shimmer text */}
        <h3 className="font-display text-sm font-semibold onyx-shimmer leading-tight mb-1 truncate">
          {set.isLive ? `Set ${padded} — ${set.name}` : set.name}
        </h3>

        {set.isLive && set.description !== "" ? (
          <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2 mb-2">
            {set.description}
          </p>
        ) : null}

        {!set.isLive ? (
          <Button
            variant="ghost"
            size="sm"
            className="w-full border border-gold/20 text-gold/60 hover:border-gold/60 hover:text-gold hover:bg-gold/5 text-xs h-8 font-body"
            aria-label={`Upload design for slot ${padded}`}
            data-ocid={`nail_atelier.upload_button.${set.id}`}
          >
            <Upload className="w-3 h-3 mr-1.5" />
            Upload Nail Design
          </Button>
        ) : null}
      </div>
    </motion.article>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

/**
 * NailAtelierPage — the dedicated Nail Atelier feature within The Mirror Studio.
 *
 * Features:
 * - Hero section with nail design reference backdrop
 * - Gold-framed model preview with "AI Nail Overlay Applied" label
 * - How-it-works section with 3 steps: Upload Design, Select Model Hand, AI Applies Nails
 * - 15-slot gallery: 8 live designs + 7 empty placeholder upload slots
 * - Upload CTA and Mirror Studio integration teaser
 */
export default function NailAtelierPage() {
  return (
    <main id="main-content" aria-label="Nail Atelier">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/nail-design-reference.png')",
          }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/40" />

        {/* Decorative gold particle dots */}
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-gold/40 blur-sm" />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 rounded-full bg-gold/60" />
        <div className="absolute bottom-1/3 right-1/5 w-2 h-2 rounded-full bg-gold/30 blur-sm" />

        <div className="relative z-10 container mx-auto px-4 py-40 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-xs font-body uppercase tracking-widest text-gold">
                The Mirror Studio · Beauty Collection
              </span>
            </div>
            <h1 className="font-display text-6xl md:text-8xl font-bold leading-tight mb-6">
              <span className="onyx-shimmer">The Nail</span>
              <br />
              <span className="gradient-text">Atelier</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-10 max-w-2xl font-body">
              Precision-crafted AI nail design — fitted seamlessly to every
              hand.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-gold text-background hover:opacity-90 font-semibold text-base h-14 px-8 gold-glow-hover transition-all"
                onClick={() =>
                  document
                    .getElementById("nail-collection")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                aria-label="Scroll to nail design collection"
                data-ocid="nail_atelier.hero.primary_button"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Explore Nail Sets
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gold/40 text-gold hover:bg-gold/10 font-semibold text-base h-14 px-8 transition-all"
                asChild
                data-ocid="nail_atelier.hero.secondary_button"
              >
                <Link to="/studio/virtual-try-on">
                  The Mirror Studio <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
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

      {/* ── Model Preview + How It Works ─────────────────────────────── */}
      <section className="py-24 bg-card" id="nail-preview">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-body uppercase tracking-widest text-gold mb-3 block">
              AI Precision Overlay
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 onyx-shimmer">
              Seamlessly Fitted. Every Time.
            </h2>
          </motion.div>

          {/* Transformation subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center text-muted-foreground text-lg mb-14 max-w-2xl mx-auto"
          >
            See the transformation — AI places your chosen nail design{" "}
            <span className="text-foreground font-medium">seamlessly</span> onto
            the model's hands.
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-20">
            {/* Left: gold-framed model photo showing nails applied */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
              data-ocid="nail_atelier.model_preview"
            >
              <div className="relative">
                {/* Gold glow behind image */}
                <div className="absolute -inset-3 rounded-2xl bg-gradient-to-b from-gold/30 via-gold/10 to-transparent blur-xl" />
                {/* Gold border frame */}
                <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-b from-gold via-gold/50 to-gold/20" />
                {/* Corner accents */}
                <div className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-gold rounded-tl z-10" />
                <div className="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-gold rounded-tr z-10" />
                <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-gold rounded-bl z-10" />
                <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-gold rounded-br z-10" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/assets/nail-model-reference.png"
                    alt="Fashion model in gold sequin jumpsuit — AI Chrome Luxe nails applied to hands"
                    className="w-full h-auto object-cover object-top"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-card/90 to-transparent" />
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm border border-gold/40 rounded-full px-4 py-1.5 flex items-center gap-2 whitespace-nowrap gold-glow">
                    <Sparkles className="w-3.5 h-3.5 text-gold" />
                    <span className="text-xs font-body text-gold tracking-wide">
                      AI Nail Overlay · Applied
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: editorial copy + how it works steps */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex flex-col gap-8"
            >
              {/* Editorial copy */}
              <div>
                <h3 className="font-display text-2xl font-bold gradient-text mb-4">
                  AI Precision on Every Hand
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg mb-5">
                  Each design is{" "}
                  <span className="text-foreground font-medium">
                    precision-scaled
                  </span>{" "}
                  and seamlessly overlaid onto your model's hands — AI-fitted to
                  every pose and skin tone.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  No reshoots. No physical samples. Just editorial-quality nail
                  visuals generated in seconds, ready for campaigns, lookbooks,
                  and e-commerce pages.
                </p>
                {/* Chrome Luxe highlight badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs font-body tracking-wide">
                  <Sparkles className="w-3 h-3" />
                  Currently featuring Set 01 — Chrome Luxe
                </div>
              </div>

              {/* How it works — 3 steps */}
              <div className="space-y-4" data-ocid="nail_atelier.how_it_works">
                <h3 className="font-display text-lg font-bold gradient-text mb-5">
                  How It Works
                </h3>
                {HOW_IT_WORKS.map((step, i) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 items-start group"
                    data-ocid={`nail_atelier.step.${i + 1}`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/60 transition-all duration-300">
                      <span className="text-gold font-body font-bold text-xs">
                        {step.step}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="font-display font-semibold text-foreground text-sm mb-1">
                        {step.title}
                      </div>
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        {step.desc}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 15-Set Nail Design Gallery ───────────────────────────────── */}
      <section
        className="py-24 bg-background"
        id="nail-collection"
        data-ocid="nail_atelier.gallery.section"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-body uppercase tracking-widest text-gold mb-3 block">
              The Collection
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 onyx-shimmer">
              15 Signature Sets
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-body">
              Each set is AI-scaled, precisely fitted, and ready to transform
              any model's hands into an editorial statement.
            </p>
          </motion.div>

          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            aria-label="Nail design collection — 8 live designs and 7 open slots"
            data-ocid="nail_atelier.gallery.list"
          >
            {ALL_NAIL_SETS.map((set, i) => (
              <NailSetCard key={set.id} set={set} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Upload CTA ────────────────────────────────────────────────── */}
      <section
        className="py-20 bg-card"
        data-ocid="nail_atelier.upload.section"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden border border-gold/40 bg-background p-10 text-center gold-glow">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/8 via-transparent to-gold/4 pointer-events-none" />
              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gold/50 rounded-tl" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gold/50 rounded-tr" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gold/50 rounded-bl" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gold/50 rounded-br" />

              <div className="relative z-10">
                <div className="text-4xl mb-5" aria-hidden="true">
                  💅
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 gradient-text">
                  You Have 15 Stunning Nail Sets
                </h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  Ready to showcase them? Upload your nail designs and watch AI
                  fit them seamlessly onto your models' hands — precision-scaled
                  and editorial-ready.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    size="lg"
                    className="bg-gold text-background hover:opacity-90 font-semibold h-14 px-8 gold-glow-hover transition-all"
                    onClick={() =>
                      document
                        .getElementById("nail-collection")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    aria-label="Go to upload slots in the nail collection"
                    data-ocid="nail_atelier.upload.primary_button"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Your Designs
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gold/40 text-gold hover:bg-gold/10 font-semibold h-14 px-8 transition-all"
                    onClick={() =>
                      document
                        .getElementById("nail-collection")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    aria-label="View the nail design gallery"
                    data-ocid="nail_atelier.upload.secondary_button"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    View Gallery
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Mirror Studio Integration Teaser ─────────────────────────── */}
      <section
        className="py-20 bg-background"
        data-ocid="nail_atelier.integration.section"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-10">
              <span className="text-xs font-body uppercase tracking-widest text-gold mb-3 block">
                Powered By
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 onyx-shimmer">
                The Mirror Studio
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto font-body">
                Nail Atelier runs inside The Mirror Studio — our full AI virtual
                try-on suite for clothing, accessories, footwear, and now, nail
                design.
              </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-gold/25 bg-card group card-hover onyx-shimmer-border">
              <div className="absolute inset-0 bg-gradient-to-r from-gold/6 via-transparent to-gold/4 pointer-events-none" />
              <div className="p-8 flex flex-col sm:flex-row items-center gap-8">
                {/* Studio icon */}
                <div
                  className="flex-shrink-0 w-20 h-20 rounded-full bg-background border border-gold/30 flex items-center justify-center text-4xl group-hover:border-gold/60 transition-all duration-300"
                  aria-hidden="true"
                >
                  ◈
                </div>
                {/* Copy */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 mb-3 font-body tracking-wide">
                    The Mirror Studio
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    Full Virtual Try-On Suite
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 font-body">
                    Beyond nails — try on garments, jewelry, shoes, bags, and
                    hats with the same AI precision. One studio, total creative
                    control.
                  </p>
                  <Button
                    variant="outline"
                    className="border-gold/40 text-gold hover:bg-gold/10 font-semibold transition-all"
                    asChild
                    data-ocid="nail_atelier.integration.cta_button"
                  >
                    <Link to="/studio/virtual-try-on">
                      Open The Mirror Studio{" "}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
