/**
 * @file pages/TermsPage.tsx
 * @description Terms of Service page for CREATEai by angieCREATEs.
 *
 * Renders the full Terms of Service for angiecreates.pro with a sticky-friendly
 * table of contents (jump links), a "Last updated" date banner, and numbered
 * section headings with onyx shimmer styling. Contact details use brand
 * constants so changes propagate everywhere automatically.
 */

import { BRAND_NAME, CONTACT_EMAIL, CONTACT_WEBSITE } from "@/constants/brand";
import { motion } from "motion/react";

// ── Data ──────────────────────────────────────────────────────────────────────

/**
 * Each section maps to a heading, body text, and a unique slug used for the
 * table-of-contents jump links and section `id` attributes.
 */
const TERMS_SECTIONS = [
  {
    slug: "preamble",
    title: "Preamble",
    content:
      "CREATEai by angieCREATEs operates the website angiecreates.pro, a web application for generating AI clothing design images and other fashion resources. These Terms of Service apply to all users of the CREATEai platform. By using the platform, you agree to be bound by these terms.",
  },
  {
    slug: "use-of-service",
    title: "Use of Service",
    content: `The operator has the right to restrict the use of the platform without giving reasons, or to block users whose behavior violates these terms. By creating an account, you agree that the operator may store your IP address to verify usage and prevent abuse.

You may use CREATEai only for lawful purposes and in accordance with these Terms. You agree not to use the platform:

• In any way that violates applicable local, national, or international law or regulation
• To transmit or upload any content that is harmful, offensive, obscene, or otherwise objectionable
• To misrepresent your identity or affiliation`,
  },
  {
    slug: "user-content",
    title: "User Content & Ownership",
    content: `All designs, images, videos, text, or resources created on CREATEai are the intellectual property of the creator (the user). The user retains full license to use, reproduce, distribute, and commercialize their creations as they wish, within the limits of applicable law.

For photos uploaded to CREATEai for editing or processing, the user guarantees they hold all necessary rights — including copyright, accessory copyright, industrial property rights, and trademark rights — to modify and use the uploaded content.`,
  },
  {
    slug: "credits-payments",
    title: "Credits & Payments",
    content: `CREATEai operates on a credit-based system. Credits are used for both UI interactions and API calls. Credits are purchased as one-time packs or included in monthly subscription plans.

Subscriptions may be cancelled at any time. Cancellation takes effect at the end of the current billing period — for example, a monthly subscription will remain active until the end of the current month. No refunds are issued for past or current billing periods.

Credits do not expire as long as your account remains active.`,
  },
  {
    slug: "api-usage",
    title: "API Usage",
    content: `Access to CREATEai's REST API is provided to registered users with active API keys. Each API call deducts the specified number of credits from your account balance.

API-generated images are automatically deleted from our servers after 48 hours. You are solely responsible for saving any generated content you wish to retain. CREATEai accepts no liability for content lost due to the expiry of the 48-hour storage window.`,
  },
  {
    slug: "prohibited-uses",
    title: "Prohibited Uses",
    content: `You are expressly prohibited from:

• Scanning or testing the security of the platform
• Bypassing authentication or security systems
• Integrating malware or harmful code into the platform
• Reverse engineering, decompiling, or disassembling any component of the service
• Using the platform to generate content that violates intellectual property rights, is defamatory, or is otherwise unlawful
• Reselling or sublicensing API access without written consent`,
  },
  {
    slug: "warranty-liability",
    title: "Warranty & Liability",
    content: `Any warranty for the results of the software and its availability is excluded. If a warranty claim exists, the warranty period is one month.

The operator is not liable for software speed, availability, data loss, or correctness of results. The operator's liability is excluded unless damage was caused intentionally or through gross negligence. In any case, the operator's liability is limited to 100 US dollars.

You use CREATEai at your own risk.`,
  },
  {
    slug: "termination",
    title: "Termination",
    content: `We may terminate or suspend your access to CREATEai immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the service ceases immediately.

All provisions which by their nature should survive termination — including ownership provisions, warranty disclaimers, and limitations of liability — shall survive.`,
  },
  {
    slug: "privacy",
    title: "Privacy",
    content:
      "Your use of CREATEai is also governed by our Privacy Policy, which is incorporated by reference into these Terms. Please review our Privacy Policy to understand our practices. By using the platform, you agree to the collection and use of information as described therein.",
  },
  {
    slug: "governing-law",
    title: "Governing Law & Language",
    content: `These Terms are governed by and construed in accordance with applicable law. If these Terms are presented in a language other than English, the translation was prepared by an independent translator. In the event of a dispute, only the original English-language text shall apply.

If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions will continue in full force and effect.`,
  },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * TermsPage
 *
 * Displays the full Terms of Service for angiecreates.pro. Includes:
 * - Editorial hero with "Last updated" badge
 * - Sticky-compatible table of contents with smooth-scroll jump links
 * - Numbered section headings with onyx shimmer
 * - Founder contact block at the foot of the document
 */
export default function TermsPage() {
  return (
    <main id="main-content" aria-label="Terms of Service">
      {/* ── Hero ── */}
      <section
        className="relative py-24 bg-card border-b border-border overflow-hidden"
        aria-label="Terms of Service header"
      >
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src="/assets/generated/about-hero-bg.dim_1200x600.jpg"
            alt=""
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-card/40 to-card" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="text-xs font-body uppercase tracking-[0.25em] text-gold mb-4 block">
              Legal
            </span>
            <h1
              className="font-display text-5xl md:text-6xl font-bold mb-4"
              aria-label="Terms of Service"
            >
              <span className="onyx-shimmer">Terms of Service</span>
            </h1>
            {/* Last updated — prominent placement */}
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-4">
              <span className="text-gold text-xs font-body font-semibold uppercase tracking-wider">
                Last updated: April 27, 2026
              </span>
            </div>
            <p className="text-muted-foreground mt-3 leading-relaxed">
              Please read these Terms carefully before using the {BRAND_NAME}{" "}
              platform at angiecreates.pro. By accessing or using {BRAND_NAME},
              you agree to be bound by these terms.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Two-column layout: TOC + content ── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12"
          >
            {/* Table of contents — sticky on large screens */}
            <nav
              aria-label="Terms of Service table of contents"
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <p className="text-xs font-body uppercase tracking-widest text-gold mb-3">
                Contents
              </p>
              <ol className="space-y-1.5">
                {TERMS_SECTIONS.map((section, i) => (
                  <li key={section.slug}>
                    <a
                      href={`#terms-${section.slug}`}
                      className="flex items-start gap-2 text-sm text-muted-foreground hover:text-gold transition-colors leading-snug group"
                      data-ocid={`terms.toc_link.${i + 1}`}
                    >
                      <span className="text-gold/50 font-mono text-[10px] mt-0.5 shrink-0 group-hover:text-gold transition-colors">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Main content */}
            <div className="space-y-10">
              {TERMS_SECTIONS.map((section, i) => (
                <motion.div
                  key={section.slug}
                  id={`terms-${section.slug}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="scroll-mt-24"
                >
                  <h2
                    className="font-display text-xl font-bold mb-4"
                    aria-label={`Section ${i + 1}: ${section.title}`}
                  >
                    <span className="text-gold">
                      {String(i + 1).padStart(2, "0")}.
                    </span>{" "}
                    <span className="onyx-shimmer">{section.title}</span>
                  </h2>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-[15px]">
                    {section.content}
                  </div>
                  {i < TERMS_SECTIONS.length - 1 && (
                    <div className="section-divider mt-10" aria-hidden="true" />
                  )}
                </motion.div>
              ))}

              {/* Founder contact block */}
              <div className="mt-16 p-6 bg-card border border-gold/20 rounded-xl flex flex-col sm:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold gold-glow shrink-0">
                  <img
                    src="/assets/angingray-019d4b2d-e30e-7214-a387-48b6bdcb3136.png"
                    alt="Angela Beson — Founder of CREATEai by angieCREATEs"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Questions about these Terms? Contact us at{" "}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-gold hover:underline"
                      aria-label={`Email ${CONTACT_EMAIL}`}
                    >
                      {CONTACT_EMAIL}
                    </a>{" "}
                    or visit{" "}
                    <a
                      href={CONTACT_WEBSITE}
                      className="text-gold hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Visit angiecreates.pro"
                    >
                      angiecreates.pro
                    </a>
                    .
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    Angela Beson · Founder, {BRAND_NAME}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
