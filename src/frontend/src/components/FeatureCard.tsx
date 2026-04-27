/**
 * @file components/FeatureCard.tsx
 * @description A single AI feature tile used in the Features explorer page
 * and on individual studio pages within CREATEai by angieCREATEs.
 *
 * Each card enters the viewport with a staggered fade-up animation driven
 * by the `index` prop. The feature title is rendered with the `onyx-shimmer`
 * CSS class to give it the signature CREATEai gold-shimmer effect.
 * An optional studio badge is displayed above the title for context.
 *
 * @example
 *   <FeatureCard
 *     icon="✍"
 *     title="Prompt to Piece"
 *     description="Describe a silhouette and our AI generates a full design."
 *     badge="The Design Atelier"
 *     index={0}
 *   />
 *
 * @prop icon        - Emoji or symbol used as a visual accent above the title.
 * @prop title       - Elevated editorial feature name shown in the card heading.
 * @prop description - One-paragraph description of what the feature does.
 * @prop badge       - Optional studio label rendered as a gold pill badge.
 * @prop index       - Card position within its list, used for stagger delay (default 0).
 */

import { motion } from "motion/react";

interface FeatureCardProps {
  /** Emoji or symbol used as a visual accent above the title. */
  icon: string;
  /** Elevated editorial feature name shown in the card heading. */
  title: string;
  /** One-paragraph description of what the feature does. */
  description: string;
  /** Optional studio label rendered as a gold pill badge. */
  badge?: string;
  /** Card position within its list — drives the staggered entrance delay. */
  index?: number;
}

/**
 * FeatureCard renders a single AI feature tile with entrance animation,
 * onyx shimmer title, optional studio badge, and full accessibility markup.
 */
export default function FeatureCard({
  icon,
  title,
  description,
  badge,
  index = 0,
}: FeatureCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      aria-label={title}
      className="bg-card border border-border rounded-xl p-5 card-hover group onyx-shimmer-border flex flex-col"
      data-ocid={`features.item.${index + 1}`}
    >
      {/* Emoji / symbol icon */}
      <div className="text-2xl mb-3 leading-none" aria-hidden="true">
        {icon}
      </div>

      {/* Optional studio badge */}
      {badge && (
        <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 mb-2.5 font-body tracking-wide w-fit">
          {badge}
        </span>
      )}

      {/* Feature title — onyx shimmer effect applied via CSS class */}
      <h3 className="font-display text-base font-semibold mb-2 onyx-shimmer leading-snug">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
        {description}
      </p>
    </motion.article>
  );
}
