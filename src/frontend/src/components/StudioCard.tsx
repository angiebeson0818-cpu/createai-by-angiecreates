/**
 * @file components/StudioCard.tsx
 * @description A clickable studio card displayed in the home page studios grid
 * and in the Features explorer for CREATEai by angieCREATEs.
 *
 * Each card:
 *  - Acts as a navigation link to the studio's dedicated page.
 *  - Renders the studio's icon, name, tagline, description, and feature count.
 *  - Shows a subtle hover background using the studio's brand gradient.
 *  - Optionally fades in the studio's hero image on hover.
 *  - Enters the viewport with a staggered fade-up animation.
 *  - Has an `onyx-shimmer-border` outline for the CREATEai signature aesthetic.
 *
 * @example
 *   <StudioCard studio={studios[0]} index={0} />
 *
 * @prop studio - Full Studio object from studioData.ts.
 * @prop index  - Card position within its grid — drives the staggered entrance delay.
 */

import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import type { Studio } from "../types";

interface StudioCardProps {
  /** Full Studio data object from studioData.ts. */
  studio: Studio;
  /** Card position within its grid — drives the staggered entrance delay. */
  index: number;
}

/**
 * StudioCard renders a full-height, link-wrapped studio tile with hover effects,
 * shimmer border, and staggered entrance animation.
 */
export default function StudioCard({ studio, index }: StudioCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="h-full"
    >
      <Link
        to={studio.path}
        aria-label={studio.name}
        aria-description={studio.tagline}
        data-ocid={`studios.item.${index + 1}`}
        className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded-xl"
      >
        <div className="relative bg-card border border-border rounded-xl p-6 h-full card-hover overflow-hidden group onyx-shimmer-border flex flex-col">
          {/* Studio hero image — revealed subtly on hover */}
          {studio.heroImage && (
            <div
              className="absolute inset-0 overflow-hidden rounded-xl"
              aria-hidden="true"
            >
              <img
                src={studio.heroImage}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover opacity-0 group-hover:opacity-10 transition-opacity duration-500"
              />
            </div>
          )}

          {/* Hover gradient overlay — studio-specific colour */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${studio.color} opacity-0 group-hover:opacity-100 transition-opacity duration-400`}
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col h-full">
            {/* Studio icon + numbered label */}
            <div className="flex items-start justify-between mb-4">
              <span
                className="text-3xl text-gold leading-none"
                aria-hidden="true"
              >
                {studio.icon}
              </span>
              <span className="text-[10px] text-muted-foreground font-body uppercase tracking-[0.15em] border border-border rounded-full px-2 py-0.5">
                Studio {index + 1}
              </span>
            </div>

            {/* Studio name */}
            <h3 className="font-display text-lg font-semibold text-foreground mb-1.5 group-hover:text-gold transition-colors leading-snug">
              {studio.name}
            </h3>

            {/* Tagline */}
            <p className="text-xs text-gold/70 font-body italic mb-3">
              {studio.tagline}
            </p>

            {/* Description — clamped to 3 lines to keep cards uniform height */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3 flex-1">
              {studio.description}
            </p>

            {/* Feature count + Explore CTA */}
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-body text-muted-foreground border border-border/50 rounded-full px-2 py-0.5">
                {studio.features.length} features
              </span>
              <span className="flex items-center gap-1 text-sm text-gold font-medium font-body group-hover:gap-2 transition-all">
                Explore
                <ArrowRight
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
