/**
 * @file pages/PrivacyPage.tsx
 * @description Privacy Policy page for CREATEai by angieCREATEs.
 *
 * Renders the full Privacy Policy for angiecreates.pro with a sticky-friendly
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
const PRIVACY_SECTIONS = [
  {
    slug: "introduction",
    title: "Introduction",
    content:
      "At CREATEai by angieCREATEs (angiecreates.pro), we are deeply committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this policy carefully. If you disagree with its terms, please discontinue use of the platform.",
  },
  {
    slug: "data-we-collect",
    title: "Data We Collect",
    content: `We may collect information about you in several ways:

• Personal Data: Name, email address, and similar contact data you provide when creating an account, contacting us, or subscribing to a plan.
• Usage Data: Information about how you use the platform, including features accessed, designs created, and interaction patterns — used to improve the service.
• Technical Data: IP address, browser type and version, device information, time zone, and cookies used for analytics, performance, and security.
• Payment Data: Payment processing is handled by secure, PCI-DSS compliant third-party processors. We do not store full payment card details on our servers.
• API Usage Data: When you use our API, we log request metadata (endpoint, timestamp, credits used) to manage billing and detect abuse.`,
  },
  {
    slug: "how-we-use-data",
    title: "How We Use Your Data",
    content: `We use the information we collect to:

• Provide, operate, and maintain the CREATEai platform and all its studios
• Process transactions, manage subscriptions, and debit credits for API usage
• Send transactional communications (account notifications, billing receipts)
• Analyze usage patterns to improve platform features and user experience
• Comply with legal obligations and regulatory requirements
• Detect, prevent, and address fraudulent, unauthorized, or illegal activity
• Respond to customer support requests and inquiries

We do not sell, rent, or share your personal data with third parties for marketing purposes without your explicit consent.`,
  },
  {
    slug: "data-security",
    title: "Data Security",
    content: `Your data is stored on secure, encrypted servers. We implement industry-standard security measures including:

• SSL/TLS encryption for all data in transit
• AES-256 encryption for sensitive data at rest
• PCI-DSS compliance for payment data handling
• Regular security audits and vulnerability assessments

While we take all reasonable precautions, no method of internet transmission or electronic storage is 100% secure. We cannot guarantee absolute security and encourage users to take appropriate precautions on their end.`,
  },
  {
    slug: "api-data-storage",
    title: "API Data & Image Storage",
    content: `Images generated through the CREATEai API are automatically and permanently deleted from our servers after 48 hours from the time of generation. This applies to all API-generated outputs including clothing designs, virtual try-ons, model renders, and tech pack images.

You are solely responsible for saving any generated content you wish to retain before the 48-hour deletion window expires. CREATEai accepts no liability for content lost due to the expiry of this storage period.

API call metadata (endpoint, timestamp, credits) is retained for billing purposes and may be kept for up to 12 months.`,
  },
  {
    slug: "cookies",
    title: "Cookies & Tracking",
    content: `We use cookies and similar tracking technologies to enhance your experience on CREATEai. Cookies allow us to:

• Remember your preferences and authentication state
• Analyze site traffic and user interaction patterns
• Provide personalized features and recommendations

You can instruct your browser to refuse all cookies or to alert you when a cookie is being sent. However, some features of our platform may not function properly if cookies are disabled.`,
  },
  {
    slug: "third-party",
    title: "Third-Party Services",
    content: `We may employ third-party companies and service providers to facilitate our platform. These providers have access to your personal information only to perform specific tasks on our behalf and are contractually obligated not to disclose or use it for other purposes.

Our platform may contain links to third-party websites. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party sites. We encourage you to review the privacy policies of any sites you visit.`,
  },
  {
    slug: "your-rights",
    title: "Your Rights",
    content: `Depending on your jurisdiction, you may have the following rights regarding your personal data:

• Right of Access: Request a copy of the personal data we hold about you
• Right to Rectification: Request correction of inaccurate or incomplete data
• Right to Erasure: Request deletion of your personal data ("right to be forgotten")
• Right to Data Portability: Receive your data in a structured, machine-readable format
• Right to Object: Object to the processing of your personal data for specific purposes
• Right to Restrict Processing: Request that we limit how we use your data

To exercise any of these rights, please contact us at ${CONTACT_EMAIL}. We will respond within 30 days.`,
  },
  {
    slug: "childrens-privacy",
    title: "Children's Privacy",
    content: `Our services are not directed to individuals under the age of 13 (or the applicable minimum age in your jurisdiction). We do not knowingly collect personal information from minors. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately at ${CONTACT_EMAIL} and we will take steps to remove that information.`,
  },
  {
    slug: "contact",
    title: "Contact Information",
    content: `If you have questions, concerns, or requests regarding this Privacy Policy or the handling of your personal data, please contact us:

Angela Beson
angieCREATEs / CREATEai
Email: ${CONTACT_EMAIL}
Website: angiecreates.pro`,
  },
  {
    slug: "changes",
    title: "Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. We will notify you of any material changes by posting the updated policy on this page with a revised effective date. We encourage you to review this Privacy Policy periodically. Continued use of the platform after changes constitutes acceptance of the updated policy.",
  },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * PrivacyPage
 *
 * Displays the full Privacy Policy for angiecreates.pro. Includes:
 * - Editorial hero with "Last updated" badge
 * - Sticky-compatible table of contents with smooth-scroll jump links
 * - Numbered section headings with onyx shimmer
 * - Founder contact block at the foot of the document
 */
export default function PrivacyPage() {
  return (
    <main id="main-content" aria-label="Privacy Policy">
      {/* ── Hero ── */}
      <section
        className="relative py-24 bg-card border-b border-border overflow-hidden"
        aria-label="Privacy Policy header"
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
              aria-label="Privacy Policy"
            >
              <span className="onyx-shimmer">Privacy Policy</span>
            </h1>
            {/* Last updated — prominent placement */}
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-4">
              <span className="text-gold text-xs font-body font-semibold uppercase tracking-wider">
                Last updated: April 27, 2026
              </span>
            </div>
            <p className="text-muted-foreground mt-3 leading-relaxed">
              This Privacy Policy describes how {BRAND_NAME} (angiecreates.pro)
              collects, uses, and protects your personal information when you
              use our platform.
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
              aria-label="Privacy Policy table of contents"
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <p className="text-xs font-body uppercase tracking-widest text-gold mb-3">
                Contents
              </p>
              <ol className="space-y-1.5">
                {PRIVACY_SECTIONS.map((section, i) => (
                  <li key={section.slug}>
                    <a
                      href={`#privacy-${section.slug}`}
                      className="flex items-start gap-2 text-sm text-muted-foreground hover:text-gold transition-colors leading-snug group"
                      data-ocid={`privacy.toc_link.${i + 1}`}
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
              {PRIVACY_SECTIONS.map((section, i) => (
                <motion.div
                  key={section.slug}
                  id={`privacy-${section.slug}`}
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
                  {i < PRIVACY_SECTIONS.length - 1 && (
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
                    For privacy inquiries, please contact us at{" "}
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
