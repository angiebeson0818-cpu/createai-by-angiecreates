/**
 * @file pages/PricingPage.tsx
 * @description Pricing plans and credit packs for CREATEai by angieCREATEs.
 *
 * Sections:
 *  - Hero             — headline with primary CTA to /dashboard
 *  - Credit Packs     — 5 one-time purchase bundles ($5–$80)
 *  - Monthly Plans    — 6 subscription tiers ($0–$300/mo)
 *  - Credit Cost Guide — per-action credit table for all 7 studios
 *  - API Access       — developer section with example endpoint
 *  - FAQ              — 5 billing Q&As with accordion
 *  - CTA              — bottom sign-up push
 *
 * Credit packs (correct amounts):
 *   Starter 500cr/$5 · Creator 1200cr/$12 · Studio 2500cr/$24 · Pro 5500cr/$50 · Elite 12000cr/$80
 *
 * Monthly plans (correct amounts):
 *   Free $0/100cr · Creator $8/500cr · Studio $25/1500cr · Pro $49/3500cr ·
 *   Team $99/8000cr/5 seats · Enterprise $300/unlimited
 *
 * IMAGE_DELETION_WARNING from constants/brand.ts is displayed in the API section.
 * All CTA buttons that start a subscription link to /dashboard.
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Code,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { IMAGE_DELETION_WARNING } from "../constants/brand";

// ── Credit packs data ────────────────────────────────────────────────────

const CREDIT_PACKS = [
  {
    name: "Starter",
    credits: 500,
    price: 5,
    perCredit: "1¢/credit",
    description: "Explore the studios",
    highlight: "Perfect for first-timers",
    featured: false,
  },
  {
    name: "Creator",
    credits: 1200,
    price: 12,
    perCredit: "~1¢/credit",
    description: "Grow your design practice",
    highlight: "Best for solopreneurs",
    featured: false,
  },
  {
    name: "Studio",
    credits: 2500,
    price: 24,
    perCredit: "~0.96¢/credit",
    description: "Accelerate your workflow",
    highlight: "Best value pack",
    featured: true,
  },
  {
    name: "Pro",
    credits: 5500,
    price: 50,
    perCredit: "~0.91¢/credit",
    description: "Power up production",
    highlight: "Most popular choice",
    featured: false,
  },
  {
    name: "Elite",
    credits: 12000,
    price: 80,
    perCredit: "~0.67¢/credit",
    description: "Maximum creative power",
    highlight: "Best bulk rate",
    featured: false,
  },
] as const;

// ── Monthly plans data ────────────────────────────────────────────────────

const MONTHLY_PLANS = [
  {
    name: "Free",
    credits: 100,
    price: 0,
    seats: 1,
    description: "Begin your creative journey",
    featured: false,
    mostPopular: false,
    features: [
      "100 credits/month",
      "Access to all 7 studios",
      "Community gallery",
      "Standard resolution",
    ],
    missing: [
      "HD exports",
      "API access",
      "Team collaboration",
      "AI style training",
    ],
  },
  {
    name: "Creator",
    credits: 500,
    price: 8,
    seats: 1,
    description: "For independent visionaries",
    featured: false,
    mostPopular: false,
    features: [
      "500 credits/month",
      "All 7 studios",
      "HD image exports",
      "Design history",
      "Priority generation",
    ],
    missing: ["API access", "Team collaboration", "AI style training"],
  },
  {
    name: "Studio",
    credits: 1500,
    price: 25,
    seats: 1,
    description: "Your signature suite",
    featured: true,
    mostPopular: true,
    features: [
      "1,500 credits/month",
      "All studios + latest AI",
      "HD exports + unlimited storage",
      "AI style training",
      "Priority generation",
    ],
    missing: ["Team collaboration", "API access"],
  },
  {
    name: "Pro",
    credits: 3500,
    price: 49,
    seats: 1,
    description: "For power creators & brands",
    featured: false,
    mostPopular: false,
    features: [
      "3,500 credits/month",
      "All Studio features",
      "API access (same credit rate)",
      "Upload model preferences",
      "Advanced style training",
    ],
    missing: ["Team collaboration"],
  },
  {
    name: "Team",
    credits: 8000,
    price: 99,
    seats: 5,
    description: "Unified creative powerhouse",
    featured: false,
    mostPopular: false,
    features: [
      "8,000 credits/month",
      "5 team seats included",
      "All Pro features",
      "Shared credit pool",
      "Team design history",
      "API access",
    ],
    missing: ["Custom AI fine-tuning"],
  },
  {
    name: "Enterprise",
    credits: -1,
    price: 300,
    seats: -1,
    description: "Full scale. No limits.",
    featured: false,
    mostPopular: false,
    features: [
      "Unlimited credits",
      "All Team features",
      "Unlimited seats",
      "Dedicated API endpoint",
      "Custom AI fine-tuning",
      "Priority white-glove support",
    ],
    missing: [],
  },
] as const;

// ── Credit cost guide ─────────────────────────────────────────────────────

const CREDIT_COST_GUIDE = [
  {
    studio: "The Design Atelier",
    action: "Generate garment concept",
    credits: 5,
  },
  {
    studio: "The Design Atelier",
    action: "Refine & iterate design",
    credits: 3,
  },
  { studio: "The Mirror Studio", action: "Virtual try-on render", credits: 8 },
  { studio: "The Mirror Studio", action: "Multi-angle view set", credits: 12 },
  { studio: "The Model Forge", action: "Generate AI model", credits: 6 },
  { studio: "The Model Forge", action: "Custom identity render", credits: 10 },
  { studio: "The Style Compass", action: "Style mood board", credits: 4 },
  { studio: "The Style Compass", action: "Full outfit generation", credits: 7 },
  { studio: "The Brand Vault", action: "Brand identity concept", credits: 5 },
  { studio: "The Brand Vault", action: "Logo + colorway set", credits: 8 },
  { studio: "The Precision Lab", action: "Generate tech pack", credits: 6 },
  { studio: "The Precision Lab", action: "Full spec sheet export", credits: 4 },
  {
    studio: "The Trend Intelligence",
    action: "Trend report generation",
    credits: 3,
  },
  {
    studio: "The Trend Intelligence",
    action: "Live trend pulse snapshot",
    credits: 2,
  },
] as const;

// ── Billing FAQs ─────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "Do credits expire?",
    a: "Never. Credits you purchase as one-time packs never expire. Monthly subscription credits reset at the start of each billing cycle, but any unused credits roll over for up to 90 days.",
  },
  {
    q: "Can I combine a credit pack with a monthly plan?",
    a: "Absolutely. Your pack credits and subscription credits are pooled together. You'll always draw from your total balance, maximising every purchase.",
  },
  {
    q: "How does billing work for the Team plan?",
    a: "The Team plan bills a single monthly charge and provides a shared credit pool across all 5 seats. Admins can view per-member usage in the dashboard.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards (Visa, Mastercard, Amex), as well as Apple Pay and Google Pay. Enterprise clients may request invoice billing.",
  },
  {
    q: "Can I upgrade or downgrade my plan?",
    a: "Yes, anytime. Upgrading takes effect immediately and we prorate the difference. Downgrading takes effect at the end of your current billing period so you keep everything you paid for.",
  },
] as const;

// ── Sub-components ────────────────────────────────────────────────────────

/** Small gold uppercase section label. */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-body uppercase tracking-widest text-gold mb-3 block">
      {children}
    </span>
  );
}

/** Single accordion FAQ item with expand/collapse animation. */
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="border-b border-border last:border-0"
    >
      <button
        type="button"
        className="w-full text-left py-5 flex justify-between items-center gap-4 hover:text-gold transition-colors duration-200"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`faq-body-${index}`}
        data-ocid={`faq.toggle.${index + 1}`}
      >
        <span className="font-display font-semibold text-base">{q}</span>
        {open ? (
          <ChevronUp
            className="w-4 h-4 text-gold flex-shrink-0"
            aria-hidden="true"
          />
        ) : (
          <ChevronDown
            className="w-4 h-4 text-muted-foreground flex-shrink-0"
            aria-hidden="true"
          />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`faq-body-${index}`}
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-muted-foreground text-sm leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function PricingPage() {
  return (
    <main id="main-content" aria-label="Pricing Plans" className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="py-28 text-center relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, oklch(0.78 0.12 85 / 0.12), transparent)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4"
        >
          <SectionLabel>Invest in Your Vision</SectionLabel>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-5 onyx-shimmer leading-tight">
            Invest in Your
            <br className="hidden sm:block" /> Creative Power
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Start free. Scale as you create. Every credit unlocks AI-powered
            design, visualization, and commerce — with no expiry on purchased
            credits.
          </p>
          <Button
            className="bg-gold text-background hover:opacity-90 font-body font-semibold px-8 py-3 text-base"
            aria-label="Start creating for free on the dashboard"
            data-ocid="pricing.hero.primary_button"
            asChild
          >
            <Link to="/dashboard">Start Creating Free</Link>
          </Button>
        </motion.div>
      </section>

      {/* ── Credit Packs ──────────────────────────────────────── */}
      <section className="py-20 bg-muted/30" data-ocid="credit_packs.section">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <SectionLabel>One-Time Purchases</SectionLabel>
            <h2 className="font-display text-4xl font-bold mb-3 onyx-shimmer">
              Credit Packs
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Top up whenever you want. Credits never expire and stack with any
              monthly plan.
            </p>
          </motion.div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 max-w-6xl mx-auto"
            data-ocid="credit_packs.list"
          >
            {CREDIT_PACKS.map((pack, i) => (
              <motion.div
                key={pack.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative flex flex-col rounded-xl p-6 border card-hover ${
                  pack.featured
                    ? "border-gold gold-glow onyx-shimmer-border bg-card"
                    : "border-border bg-card"
                }`}
                aria-label={`${pack.name} credit pack — ${pack.credits.toLocaleString()} credits for $${pack.price}`}
                data-ocid={`credit_packs.item.${i + 1}`}
              >
                {pack.featured && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-background whitespace-nowrap font-body text-xs">
                    Most Popular
                  </Badge>
                )}
                <div className="mb-4">
                  <h3
                    className={`font-display text-lg font-bold mb-0.5 ${pack.featured ? "onyx-shimmer" : ""}`}
                  >
                    {pack.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {pack.description}
                  </p>
                </div>

                <div className="mb-3">
                  <div className="font-display text-4xl font-bold gradient-text">
                    ${pack.price}
                  </div>
                  <div className="text-xs text-muted-foreground">one-time</div>
                </div>

                <div className="text-sm text-gold font-semibold flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  {pack.credits.toLocaleString()} credits
                </div>
                <div className="text-xs text-muted-foreground mb-5">
                  {pack.perCredit}
                </div>

                <p className="text-xs text-muted-foreground italic mb-5">
                  {pack.highlight}
                </p>

                <Button
                  className={`mt-auto text-sm ${
                    pack.featured
                      ? "bg-gold text-background hover:opacity-90"
                      : "border border-border hover:border-gold/50"
                  }`}
                  variant={pack.featured ? "default" : "outline"}
                  asChild
                  aria-label={`Buy ${pack.name} pack — ${pack.credits.toLocaleString()} credits for $${pack.price}`}
                  data-ocid={`credit_packs.buy_button.${i + 1}`}
                >
                  <Link to="/dashboard">
                    Add {pack.credits.toLocaleString()} Credits
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Monthly Plans ─────────────────────────────────────── */}
      <section className="py-20" data-ocid="monthly_plans.section">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <SectionLabel>Recurring Access</SectionLabel>
            <h2 className="font-display text-4xl font-bold mb-3 onyx-shimmer">
              Monthly Plans
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Subscribe for monthly credits, priority generation, and advanced
              studio features. Cancel anytime.
            </p>
          </motion.div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 max-w-7xl mx-auto"
            data-ocid="monthly_plans.list"
          >
            {MONTHLY_PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`relative flex flex-col rounded-xl p-5 border card-hover ${
                  plan.featured
                    ? "border-gold gold-glow onyx-shimmer-border bg-card"
                    : "border-border bg-card"
                }`}
                aria-label={`${plan.name} plan — ${plan.price === 0 ? "Free" : `$${plan.price}/mo`}`}
                data-ocid={`monthly_plans.item.${i + 1}`}
              >
                {plan.mostPopular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-background whitespace-nowrap font-body text-xs">
                    Most Popular
                  </Badge>
                )}

                <div className="mb-3">
                  <h3
                    className={`font-display text-lg font-bold mb-0.5 ${plan.featured ? "onyx-shimmer" : ""}`}
                  >
                    {plan.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-1">
                  <div className="font-display text-3xl font-bold gradient-text">
                    {plan.price === 0 ? "Free" : `$${plan.price}`}
                  </div>
                  {plan.price > 0 && (
                    <div className="text-xs text-muted-foreground">/month</div>
                  )}
                </div>

                <div className="text-xs text-gold font-semibold mb-1">
                  {plan.credits === -1
                    ? "Unlimited credits"
                    : `${plan.credits.toLocaleString()} credits/mo`}
                </div>
                {plan.seats > 1 && (
                  <div className="text-xs text-muted-foreground mb-1">
                    {plan.seats === -1
                      ? "Unlimited seats"
                      : `${plan.seats} seats included`}
                  </div>
                )}

                <ul className="space-y-1.5 my-4 flex-1">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-1.5 text-xs text-muted-foreground"
                    >
                      <Check
                        className="w-3 h-3 text-gold flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      {f}
                    </li>
                  ))}
                  {plan.missing.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-1.5 text-xs text-muted-foreground/35 line-through"
                    >
                      <X
                        className="w-3 h-3 flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`mt-auto text-xs py-2 ${
                    plan.featured
                      ? "bg-gold text-background hover:opacity-90"
                      : "border border-border hover:border-gold/50"
                  }`}
                  variant={plan.featured ? "default" : "outline"}
                  asChild
                  aria-label={
                    plan.price === 0
                      ? "Get started free"
                      : plan.name === "Enterprise"
                        ? "Contact sales for Enterprise plan"
                        : `Subscribe to ${plan.name} plan`
                  }
                  data-ocid={`monthly_plans.subscribe_button.${i + 1}`}
                >
                  <Link to="/dashboard">
                    {plan.price === 0
                      ? "Get Started Free"
                      : plan.name === "Enterprise"
                        ? "Contact Sales"
                        : "Subscribe"}
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Credit Cost Guide ─────────────────────────────────── */}
      <section className="py-20 bg-muted/30" data-ocid="credit_guide.section">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <SectionLabel>Studio Credit Guide</SectionLabel>
            <h2 className="font-display text-4xl font-bold mb-3 onyx-shimmer">
              What Each Action Costs
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every creative action has a transparent credit cost. Know exactly
              what you're spending before you create.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto" data-ocid="credit_guide.table">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-background/40">
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium font-body">
                      Studio
                    </th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium font-body">
                      Action
                    </th>
                    <th className="text-right py-4 px-6 text-muted-foreground font-medium font-body">
                      Credits
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {CREDIT_COST_GUIDE.map((row, i) => (
                    <tr
                      key={`${row.studio}-${row.action}`}
                      className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-background/20"}`}
                    >
                      <td className="py-3.5 px-6 text-xs text-gold font-semibold">
                        {row.studio}
                      </td>
                      <td className="py-3.5 px-6 text-muted-foreground">
                        {row.action}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <span className="inline-flex items-center gap-1 text-foreground font-semibold">
                          <Zap
                            className="w-3 h-3 text-gold"
                            aria-hidden="true"
                          />
                          {row.credits}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <p className="mt-4 text-xs text-center text-muted-foreground">
            API calls share the same credit rate — no additional surcharges.
          </p>
        </div>
      </section>

      {/* ── API Access ────────────────────────────────────────── */}
      <section className="py-20" data-ocid="api_access.section">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-xl p-8 md:p-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Code className="w-6 h-6 text-gold" aria-hidden="true" />
              <SectionLabel>For Developers</SectionLabel>
            </div>
            <h2 className="font-display text-3xl font-bold mb-4 onyx-shimmer">
              Fashion AI API
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl leading-relaxed">
              Embed CREATEai's full generative power directly in your own
              platform. Every API call draws from your credit balance at the
              exact same rate as the UI — no surcharges, no hidden fees.
              CREATEai stays invisible; your brand stays front and center.
            </p>

            {/* Example endpoint */}
            <div className="bg-background border border-border rounded-lg p-4 mb-6 font-mono">
              <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wider font-body">
                Example Endpoint
              </p>
              <code className="text-sm text-gold break-all">
                https://createai/API/1.1/wf/clothing?api_key=YOUR_API_KEY
              </code>
            </div>

            {/* API feature highlights */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
                {
                  icon: "🔑",
                  title: "API Authentication",
                  body: "Generate your API key from the dashboard. Available on Pro, Team, and Enterprise plans.",
                },
                {
                  icon: "⚡",
                  title: "Same Credit Rate",
                  body: "API calls cost the same credits as UI actions — no extra surcharges. Your balance is shared.",
                },
                {
                  icon: "⏱️",
                  title: "48-Hour Image Storage",
                  body: IMAGE_DELETION_WARNING,
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-background border border-border rounded-lg p-4"
                >
                  <div className="text-xl mb-2" aria-hidden="true">
                    {card.icon}
                  </div>
                  <h4 className="font-display font-semibold text-sm mb-1">
                    {card.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                className="bg-gold text-background hover:opacity-90 font-body"
                asChild
                aria-label="Read the developer documentation"
                data-ocid="api_access.docs_button"
              >
                <Link to="/developers">Read Developer Docs</Link>
              </Button>
              <Button
                variant="outline"
                className="border-border hover:border-gold/50"
                asChild
                aria-label="Contact us to request a custom API endpoint"
                data-ocid="api_access.contact_button"
              >
                <Link to="/contact">Request Custom Endpoint</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="py-20 bg-muted/30" data-ocid="faq.section">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <SectionLabel>Got Questions?</SectionLabel>
            <h2 className="font-display text-4xl font-bold onyx-shimmer">
              Billing FAQ
            </h2>
          </motion.div>

          <div
            className="bg-card border border-border rounded-xl px-6 divide-y divide-border"
            data-ocid="faq.list"
          >
            {FAQS.map((item, i) => (
              <FaqItem key={item.q} q={item.q} a={item.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-28 text-center relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, oklch(0.78 0.12 85 / 0.08), transparent)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 onyx-shimmer">
            Your Vision, Powered by AI.
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            Join thousands of fashion visionaries building the future of design.
            Start for free — no credit card required.
          </p>
          <Button
            className="bg-gold text-background hover:opacity-90 font-body font-semibold px-10 py-3 text-base gold-glow-hover"
            aria-label="Sign up free — no credit card required"
            data-ocid="pricing.cta.primary_button"
            asChild
          >
            <Link to="/dashboard">Sign Up Free</Link>
          </Button>
        </motion.div>
      </section>
    </main>
  );
}
