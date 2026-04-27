/**
 * @file pages/AboutPage.tsx
 * @description About page for CREATEai by angieCREATEs.
 *
 * Tells the brand story, showcases platform stats, highlights the five founding
 * pillars, and features Angela Beson as the visionary founder. Hero uses the
 * glass tower backdrop with a dark overlay for editorial drama. Messaging is
 * intentionally inclusive — every man, every woman, every visionary.
 */

import { Button } from "@/components/ui/button";
import {
  ASSET_PATHS,
  BRAND_NAME,
  CONTACT_EMAIL,
  CONTACT_WEBSITE,
} from "@/constants/brand";
import { Link } from "@tanstack/react-router";
import { Globe, Heart, Sparkles, Users, Zap } from "lucide-react";
import { motion } from "motion/react";

// ── Data ──────────────────────────────────────────────────────────────────────

const stats = [
  { value: "50K+", label: "Creators Worldwide" },
  { value: "2M+", label: "Designs Generated" },
  { value: "7", label: "AI Studios" },
  { value: "150+", label: "Countries Reached" },
];

const pillars = [
  {
    icon: <Sparkles className="w-6 h-6" aria-hidden="true" />,
    title: "Creative Innovation",
    desc: "Pioneering new possibilities at the intersection of AI and fashion — where imagination becomes product.",
  },
  {
    icon: <Zap className="w-6 h-6" aria-hidden="true" />,
    title: "Pure Flow",
    desc: "Compressing weeks of creative work into seconds. No barriers — only creative exploration, unleashed.",
  },
  {
    icon: <Globe className="w-6 h-6" aria-hidden="true" />,
    title: "Radical Accessibility",
    desc: "Elite fashion AI tools available to every man, every woman, every visionary — regardless of background or budget.",
  },
  {
    icon: <Users className="w-6 h-6" aria-hidden="true" />,
    title: "Community Power",
    desc: "A global ecosystem of creators who inspire, support, and elevate each other to new heights of expression.",
  },
  {
    icon: <Heart className="w-6 h-6" aria-hidden="true" />,
    title: "Empowerment",
    desc: "When you feel good, you look good. When you look good, you work harder. And when you work hard — you become unstoppable.",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * AboutPage
 *
 * Renders the full About page experience: editorial hero with glass tower
 * backdrop, platform stats, brand vision sections, founder biography with
 * Angela Beson's portrait and quote, five pillars grid, and a closing CTA.
 */
export default function AboutPage() {
  return (
    <main id="main-content" aria-label="About CREATEai">
      {/* ── Hero: glass tower backdrop + editorial intro ── */}
      <section
        className="relative min-h-[70vh] flex items-center overflow-hidden"
        aria-label="About hero"
      >
        {/* Glass tower background image with dark screen overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80')",
          }}
          role="presentation"
        />
        <div className="absolute inset-0 hero-overlay" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30"
          aria-hidden="true"
        />

        <div className="relative z-10 container mx-auto px-4 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Copy */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-xs font-body uppercase tracking-[0.25em] text-gold mb-4 block">
                Our Story
              </span>
              <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="onyx-shimmer">About {BRAND_NAME}</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {BRAND_NAME} is an all-in-one fashion AI platform built to
                bridge the gap between creative imagination and commercial
                reality — for every creator who refuses to be contained.
              </p>
              <Button
                size="lg"
                className="bg-gold text-background hover:bg-gold/90 font-semibold"
                asChild
                data-ocid="about.primary_button"
                aria-label="Begin your journey with CREATEai — go to pricing"
              >
                <Link to="/pricing">Begin Your Journey</Link>
              </Button>
            </motion.div>

            {/* Founder portrait with gold frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                <div className="relative w-72 h-96 md:w-80 md:h-[440px] rounded-2xl overflow-hidden border-2 border-gold gold-glow">
                  <img
                    src={ASSET_PATHS.portrait}
                    alt="Angela Beson — Founder and visionary behind CREATEai by angieCREATEs"
                    className="w-full h-full object-cover object-top"
                  />
                  <div
                    className="absolute inset-0 onyx-shimmer-border pointer-events-none rounded-2xl"
                    aria-hidden="true"
                  />
                </div>
                {/* Name tag */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-card border border-gold/40 rounded-xl px-5 py-3 text-center shadow-lg whitespace-nowrap">
                  <p className="font-display font-bold text-sm">Angela Beson</p>
                  <p className="text-gold text-xs uppercase tracking-wider font-body">
                    Founder &amp; Fashion AI Creator
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section
        className="py-16 bg-background border-b border-border"
        aria-label="Platform statistics"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto text-center"
          >
            {stats.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <div
                  className="font-display text-4xl font-bold gradient-text mb-1"
                  aria-label={`${value} ${label}`}
                >
                  {value}
                </div>
                <div className="text-xs font-body text-muted-foreground tracking-wider uppercase">
                  {label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Vision ── */}
      <section className="py-24 bg-background" aria-label="Our vision">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl font-bold mb-6">
                <span className="onyx-shimmer">The Vision</span>
              </h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed text-lg">
                <p>
                  Trusted by a global community of fashion creators, our
                  ecosystem provides the professional infrastructure to scale
                  your brand with unprecedented speed. From the initial spark in
                  The Design Atelier to generating high-fidelity virtual try-ons
                  in The Mirror Studio and professional model imagery in The
                  Model Forge, we have unified the entire production cycle.
                </p>
                <p>
                  Whether you are a solo designer just beginning your journey or
                  a global e-commerce team shipping thousands of SKUs,{" "}
                  {BRAND_NAME} provides the tools to design, market, and sell
                  more efficiently — and more beautifully — than ever before.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden border border-gold/20 gold-glow">
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80"
                  alt="Fashion editorial — the CREATEai aesthetic"
                  className="w-full h-80 object-cover"
                />
              </div>
              <div className="absolute -top-3 -right-3 w-24 h-24 rounded-xl overflow-hidden border-2 border-gold gold-glow hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&q=80"
                  alt="Design atelier close-up"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CREATEai Effect ── */}
      <section
        className="py-24 bg-muted/20 border-y border-border"
        aria-label="The CREATEai effect"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="rounded-2xl overflow-hidden border border-gold/20">
                <img
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80"
                  alt="CREATEai AI innovation technology visual"
                  className="w-full h-72 object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="font-display text-4xl font-bold mb-6">
                <span className="onyx-shimmer">The CREATEai Effect</span>
              </h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed text-lg">
                <p>
                  {BRAND_NAME} is transforming the fashion industry by
                  empowering creators to build new concepts, identities,
                  clothing designs, and mood boards with unprecedented
                  efficiency. By analyzing market trends, consumer behavior, and
                  brand strategy data, {BRAND_NAME} generates concepts that
                  resonate deeply with target audiences.
                </p>
                <p>
                  Our AI crafts brand identities, slogans, and unique selling
                  propositions that are simultaneously unique and commercially
                  viable — making design more data-driven, personalized, and
                  responsive to the diverse tastes of creators worldwide.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Founder biography ── */}
      <section
        className="py-24 bg-card border-y border-border"
        aria-label="The visionary behind the platform"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-4xl font-bold mb-2">
                <span className="onyx-shimmer">
                  The Visionary Behind the Platform
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center"
            >
              {/* Founder portrait */}
              <div className="md:col-span-2 flex justify-center">
                <div className="relative">
                  <div className="w-56 h-72 md:w-64 md:h-80 rounded-2xl overflow-hidden border-2 border-gold gold-glow onyx-shimmer-border">
                    <img
                      src={ASSET_PATHS.portrait}
                      alt="Angela Beson — Founder of CREATEai by angieCREATEs"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div
                    className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gold flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <Sparkles className="w-5 h-5 text-background" />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="md:col-span-3">
                <h3 className="font-display text-3xl font-bold mb-1">
                  Angela Beson
                </h3>
                <p className="text-gold font-body text-sm mb-6 uppercase tracking-wider">
                  Founder &amp; Fashion AI Creator
                </p>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Angela Beson is the visionary founder of angieCREATEs and
                    the creative force behind {BRAND_NAME}. With a deep belief
                    that every creator deserves access to professional-grade
                    tools, Angela built a platform that puts elite AI
                    capabilities into the hands of designers, stylists, and
                    entrepreneurs worldwide.
                  </p>
                  <p>
                    Her philosophy is simple: when you feel good, you look good.
                    When you look good, you work hard. And when you work hard,
                    you become unstoppable. {BRAND_NAME} is the platform that
                    makes that transformation possible — for every man, every
                    woman, every visionary who refuses to be contained.
                  </p>
                  <blockquote className="border-l-2 border-gold pl-4 italic text-sm mt-6">
                    "You were made for this. {BRAND_NAME} is here to prove it."
                    <footer className="mt-1 not-italic text-gold text-xs">
                      — Angela Beson
                    </footer>
                  </blockquote>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <a
                    href={CONTACT_WEBSITE}
                    className="text-sm text-gold hover:underline font-body"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit Angela Beson's website at angiecreates.pro"
                  >
                    angiecreates.pro
                  </a>
                  <span className="text-border" aria-hidden="true">
                    |
                  </span>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-sm text-muted-foreground hover:text-gold transition-colors font-body"
                    aria-label={`Email Angela Beson at ${CONTACT_EMAIL}`}
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Community banner ── */}
      <section
        className="py-24 bg-background"
        aria-label="Built for every creator"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="rounded-2xl overflow-hidden border border-gold/20 relative">
              <img
                src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1600&q=80"
                alt="A vibrant global community of fashion creators"
                className="w-full h-72 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/50 to-transparent flex items-end p-10">
                <div className="max-w-xl">
                  <h2 className="font-display text-3xl font-bold mb-3">
                    <span className="onyx-shimmer">
                      Built for Every Creator
                    </span>
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Every man, every woman, every visionary — {BRAND_NAME} is a
                    platform that sees you, believes in you, and gives you the
                    tools to show the world what you're made of.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Five pillars grid ── */}
      <section
        className="py-24 bg-muted/20 border-t border-border"
        aria-label="Our founding pillars"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-4xl font-bold">
              <span className="onyx-shimmer">Our Pillars</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pillars.map(({ icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 bg-card border border-border rounded-xl card-hover text-center"
                data-ocid={`about.pillar.${i + 1}`}
              >
                <div className="text-gold flex justify-center mb-4">{icon}</div>
                <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section
        className="py-24 bg-card border-t border-border text-center"
        aria-label="Call to action — step into your power"
      >
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl font-bold mb-4">
              <span className="onyx-shimmer">Step Into Your Power</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Join a global community of creators who are designing, building,
              and living with intention, beauty, and ambition.
            </p>
            <Button
              size="lg"
              className="bg-gold text-background hover:bg-gold/90 font-semibold"
              asChild
              data-ocid="about.cta_button"
              aria-label="Begin your journey — go to CREATEai pricing"
            >
              <Link to="/pricing">Begin Your Journey</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
