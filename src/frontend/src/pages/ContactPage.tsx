/**
 * @file pages/ContactPage.tsx
 * @description Contact page for CREATEai by angieCREATEs.
 *
 * Features a contact form with client-side validation (name, email, subject,
 * message), a 500ms simulated submission delay for UX feedback, and a toast
 * notification confirming the message with a direct email fallback. Also
 * displays Angela Beson's contact details (email, website, response time).
 *
 * No email extension is available — the form resolves locally and prompts
 * the user to email Angela directly if needed.
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ASSET_PATHS, CONTACT_EMAIL, CONTACT_WEBSITE } from "@/constants/brand";
import { Clock, Globe, Mail, Send, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

/** Dropdown options for the subject field — eight explicit options. */
const SUBJECTS = [
  "General Inquiry",
  "Technical Support",
  "Billing & Credits",
  "Partnership",
  "Press",
  "Feature Request",
  "Bug Report",
  "Other",
] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM: FormState = { name: "", email: "", subject: "", message: "" };
const EMPTY_ERRORS: FormErrors = {};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Validates the full form and returns an error map. Empty map means valid. */
function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) {
    errors.name = "Your name is required.";
  }

  if (!form.email.trim()) {
    errors.email = "Your email address is required.";
  } else if (!EMAIL_REGEX.test(form.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!form.subject) {
    errors.subject = "Please select a subject.";
  }

  if (!form.message.trim()) {
    errors.message = "Please enter a message.";
  } else if (form.message.trim().length < 20) {
    errors.message = "Your message must be at least 20 characters.";
  }

  return errors;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * ContactPage
 *
 * Two-column layout: Angela Beson's contact details on the left (photo,
 * email, website, response time, personal quote) and the validated contact
 * form on the right. Inline errors appear on blur and on submit attempt.
 * Submission fires a toast with the email fallback and clears the form.
 */
export default function ContactPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>(EMPTY_ERRORS);
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormState, boolean>>
  >({});
  const [sending, setSending] = useState(false);

  // Validate a single field on blur
  const handleBlur = (field: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, ...validate({ ...form }) }));
  };

  // Update field value; re-validate if already touched
  const handleChange = (field: keyof FormState, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field]) {
      setErrors(validate(updated));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched and run full validation
    setTouched({ name: true, email: true, subject: true, message: true });
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setSending(true);
    // 500ms delay for UX feedback before resolving
    setTimeout(() => {
      setSending(false);
      toast.success(
        `Thank you for reaching out! We aim to respond within 24 hours. You can also email us directly at ${CONTACT_EMAIL}`,
        { duration: 6000 },
      );
      setForm(EMPTY_FORM);
      setTouched({});
      setErrors(EMPTY_ERRORS);
    }, 500);
  };

  return (
    <main id="main-content" aria-label="Contact Us">
      {/* ── Hero ── */}
      <section
        className="relative py-28 bg-card border-b border-border overflow-hidden"
        aria-label="Contact hero"
      >
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src="/assets/generated/about-hero-bg.dim_1200x600.jpg"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-card/60 to-card/95" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <span className="text-xs font-body uppercase tracking-[0.25em] text-gold mb-4 block">
              We'd Love to Hear from You
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
              <span className="onyx-shimmer">Contact Us</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Questions, collaborations, or just want to say hello — Angela and
              the team are here for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Two-column layout: contact info + form ── */}
      <section
        className="py-20 bg-background"
        aria-label="Contact details and form"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col gap-8">
                {/* Angela portrait card */}
                <div className="relative rounded-2xl overflow-hidden border border-gold/30 gold-glow">
                  <img
                    src={ASSET_PATHS.portrait}
                    alt="Angela Beson — Founder of CREATEai by angieCREATEs"
                    className="w-full h-64 object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/30 to-transparent flex items-end p-6">
                    <div>
                      <h2 className="font-display text-2xl font-bold mb-0.5">
                        Angela Beson
                      </h2>
                      <p className="text-gold font-body text-xs uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="w-3 h-3" aria-hidden="true" />
                        Founder &amp; Fashion AI Creator
                      </p>
                    </div>
                  </div>
                  <div
                    className="absolute inset-0 onyx-shimmer-border pointer-events-none"
                    aria-hidden="true"
                  />
                </div>

                {/* Contact detail cards */}
                <div className="space-y-4">
                  <a
                    href={CONTACT_WEBSITE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-gold/30 transition-colors group"
                    aria-label={`Visit Angela's website at ${CONTACT_WEBSITE}`}
                    data-ocid="contact.website_link"
                  >
                    <Globe
                      className="w-5 h-5 text-gold shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5">
                        Website
                      </p>
                      <p className="text-foreground group-hover:text-gold transition-colors font-body">
                        angiecreates.pro
                      </p>
                    </div>
                  </a>

                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-gold/30 transition-colors group"
                    aria-label={`Send an email to ${CONTACT_EMAIL}`}
                    data-ocid="contact.email_link"
                  >
                    <Mail
                      className="w-5 h-5 text-gold shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5">
                        Email
                      </p>
                      <p className="text-foreground group-hover:text-gold transition-colors font-body">
                        {CONTACT_EMAIL}
                      </p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
                    <Clock
                      className="w-5 h-5 text-gold shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5">
                        Response Time
                      </p>
                      <p className="text-foreground font-body">
                        Within 24 hours, Mon–Fri
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal quote */}
                <blockquote className="border-l-2 border-gold pl-4 italic text-muted-foreground text-sm leading-relaxed">
                  "Every message matters to me. Whether you're a first-time
                  creator or an industry veteran, I want to hear your story and
                  help you bring your vision to life."
                  <footer className="mt-2 not-italic text-gold text-xs">
                    — Angela Beson
                  </footer>
                </blockquote>
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div
                className="bg-card border border-border rounded-xl p-8"
                data-ocid="contact.panel"
              >
                <h3 className="font-display text-2xl font-bold mb-6">
                  <span className="onyx-shimmer">Send a Message</span>
                </h3>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  noValidate
                  aria-label="Contact form"
                >
                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="contact-name"
                        className="text-xs uppercase tracking-wider text-muted-foreground"
                      >
                        Name{" "}
                        <span className="text-destructive" aria-hidden="true">
                          *
                        </span>
                      </Label>
                      <Input
                        id="contact-name"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        onBlur={() => handleBlur("name")}
                        placeholder="Your name"
                        className="bg-background border-border"
                        aria-required="true"
                        aria-invalid={!!errors.name}
                        aria-describedby={
                          errors.name ? "contact-name-error" : undefined
                        }
                        data-ocid="contact.name_input"
                      />
                      {errors.name && touched.name && (
                        <p
                          id="contact-name-error"
                          className="text-destructive text-xs mt-1"
                          role="alert"
                          data-ocid="contact.name_input.field_error"
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="contact-email"
                        className="text-xs uppercase tracking-wider text-muted-foreground"
                      >
                        Email{" "}
                        <span className="text-destructive" aria-hidden="true">
                          *
                        </span>
                      </Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        placeholder="your@email.com"
                        className="bg-background border-border"
                        aria-required="true"
                        aria-invalid={!!errors.email}
                        aria-describedby={
                          errors.email ? "contact-email-error" : undefined
                        }
                        data-ocid="contact.email_input"
                      />
                      {errors.email && touched.email && (
                        <p
                          id="contact-email-error"
                          className="text-destructive text-xs mt-1"
                          role="alert"
                          data-ocid="contact.email_input.field_error"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject dropdown */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="contact-subject"
                      className="text-xs uppercase tracking-wider text-muted-foreground"
                    >
                      Subject{" "}
                      <span className="text-destructive" aria-hidden="true">
                        *
                      </span>
                    </Label>
                    <Select
                      value={form.subject}
                      onValueChange={(v) => {
                        handleChange("subject", v);
                        setTouched((prev) => ({ ...prev, subject: true }));
                      }}
                    >
                      <SelectTrigger
                        id="contact-subject"
                        className="bg-background border-border"
                        aria-required="true"
                        aria-invalid={!!errors.subject}
                        aria-describedby={
                          errors.subject ? "contact-subject-error" : undefined
                        }
                        data-ocid="contact.subject_select"
                      >
                        <SelectValue placeholder="What is this about?" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subject && touched.subject && (
                      <p
                        id="contact-subject-error"
                        className="text-destructive text-xs mt-1"
                        role="alert"
                        data-ocid="contact.subject_select.field_error"
                      >
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message textarea */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="contact-message"
                      className="text-xs uppercase tracking-wider text-muted-foreground"
                    >
                      Message{" "}
                      <span className="text-destructive" aria-hidden="true">
                        *
                      </span>
                    </Label>
                    <Textarea
                      id="contact-message"
                      value={form.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      onBlur={() => handleBlur("message")}
                      placeholder="Tell us how we can help or what's on your mind... (min 20 characters)"
                      rows={5}
                      className="bg-background border-border resize-none"
                      aria-required="true"
                      aria-invalid={!!errors.message}
                      aria-describedby={
                        errors.message ? "contact-message-error" : undefined
                      }
                      data-ocid="contact.message_textarea"
                    />
                    {errors.message && touched.message && (
                      <p
                        id="contact-message-error"
                        className="text-destructive text-xs mt-1"
                        role="alert"
                        data-ocid="contact.message_textarea.field_error"
                      >
                        {errors.message}
                      </p>
                    )}
                    <p className="text-[11px] text-muted-foreground/60 text-right">
                      {form.message.length} / 20 min chars
                    </p>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full bg-gold text-background hover:bg-gold/90 font-semibold h-12 gold-glow-hover transition-all"
                    disabled={sending}
                    data-ocid="contact.submit_button"
                    aria-busy={sending}
                  >
                    {sending ? (
                      <span className="flex items-center gap-2">
                        <Send
                          className="w-4 h-4 animate-pulse"
                          aria-hidden="true"
                        />
                        Sending your message…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" aria-hidden="true" />
                        Send Message
                      </span>
                    )}
                  </Button>

                  {/* Direct email fallback note */}
                  <p className="text-xs text-muted-foreground/60 text-center leading-relaxed">
                    You can also email us directly at{" "}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-gold hover:underline"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
