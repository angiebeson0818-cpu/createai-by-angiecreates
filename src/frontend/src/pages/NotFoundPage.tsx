/**
 * @file pages/NotFoundPage.tsx
 * @description 404 Not Found page for CREATEai by angieCREATEs.
 *
 * Rendered when a user navigates to any route that does not exist in the
 * router tree (the catch-all '*' route in App.tsx). Maintains the dark
 * luxury editorial aesthetic with gold accents and offers two clear
 * recovery paths: Return Home or Explore Studios.
 */

import { ALL_ROUTES } from "@/constants/brand";
import { Link } from "@tanstack/react-router";

/**
 * NotFoundPage
 *
 * A full-viewport 404 experience styled to match the CREATEai dark luxury
 * theme. Shows a large gradient "404", a branded headline, a helpful
 * subtext, and two action buttons so users are never stranded.
 */
export default function NotFoundPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center"
      data-ocid="not_found.page"
    >
      {/* Decorative background shimmer */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-6">
        {/* Large 404 number */}
        <span
          className="text-[9rem] md:text-[12rem] font-display font-bold leading-none select-none"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.75 0.12 75) 0%, oklch(0.55 0.08 75) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          aria-label="404"
        >
          404
        </span>

        {/* Headline */}
        <h1 className="text-2xl md:text-3xl font-display font-semibold text-foreground tracking-tight">
          This Page Has Left the Atelier
        </h1>

        {/* Subtext */}
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md">
          The page you're looking for has moved, expired, or never existed.
          Let's get you back to something beautiful.
        </p>

        {/* Decorative divider */}
        <div className="w-12 h-px bg-primary/40 my-2" aria-hidden="true" />

        {/* Recovery actions */}
        <nav
          className="flex flex-col sm:flex-row gap-4 items-center"
          aria-label="Recovery options"
        >
          <Link
            to={ALL_ROUTES.home}
            data-ocid="not_found.home_button"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded border border-primary text-primary font-body text-sm uppercase tracking-widest transition-colors duration-200 hover:bg-primary hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background min-w-[160px]"
          >
            Return Home
          </Link>

          <Link
            to={ALL_ROUTES.features}
            data-ocid="not_found.explore_button"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded border border-border text-muted-foreground font-body text-sm uppercase tracking-widest transition-colors duration-200 hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background min-w-[160px]"
          >
            Explore Studios
          </Link>
        </nav>
      </div>
    </main>
  );
}
