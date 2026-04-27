# Design Brief: CREATEai by angieCREATEs

**Theme:** Dark luxury editorial, premium fashion platform  
**Tone:** Empowering, confident, inclusive, elite  
**Differentiation:** onyxCREATE shimmer sweep on all titles; gold-framed user identity  
**Signature Detail:** Continuous gold gradient shimmer animation (3s) on headings; gold glow on hover; hero overlay fade  

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| background | oklch(0.08 0.006 280) | Page background, deep indigo |
| foreground | oklch(0.96 0.008 85) | Body text, near-white |
| card | oklch(0.12 0.006 280) | Card backgrounds, slightly elevated |
| primary/accent | oklch(0.78 0.12 85) | Gold — buttons, links, highlights |
| muted | oklch(0.16 0.006 280) | Disabled, secondary text layer |
| border | oklch(0.22 0.006 280) | Dividers, card borders |
| destructive | oklch(0.577 0.245 27.325) | Error states, red |
| success | oklch(0.72 0.1 142) | Success states, green |

## Typography

| Family | Usage | Files |
|--------|-------|-------|
| Playfair Display | h1–h6, display text, editorial serif | Google Fonts (imported) |
| Plus Jakarta Sans | body, p, button, labels, modern sans | /assets/fonts/PlusJakartaSans.woff2 |

**Type Scale:** h1 3.5rem, h2 2.5rem, h3 2rem, h4 1.5rem, h5 1.25rem, h6 1rem; body 1rem (16px), caption 0.875rem (14px)

## Elevation & Depth

- **Cards:** bg-card with 1px border-border; hover: `card-hover` class lifts -translate-y-1, gold glow shadow
- **Popover/modal:** bg-popover with inset shadow
- **Interactive:** `gold-glow`, `gold-glow-hover` for tactile feedback
- **Shimmer layer:** `.onyx-shimmer-border::after` overlays 110° gradient sweep (2.5s) for visual polish

## Structural Zones

| Zone | Treatment |
|------|-----------|
| Header/navbar | bg-card with border-b border-gold/20; logo (onyx) top-left; studio nav in new branded names |
| Hero | bg-background with `hero-overlay` gradient; gold-framed user photo; gradient-text on title |
| Content sections | alternating bg-background / bg-card/5 for rhythm; section-divider between zones |
| Studio cards | bg-card, border-border, `onyx-shimmer` on titles, `card-hover` on interaction |
| Footer | bg-sidebar (slightly elevated), border-t border-gold/10 |

## Spacing & Rhythm

- **Grid:** 4px base (rem: 0.25); 8px increment for all component spacing
- **Section margins:** 2rem (sm), 3rem (md), 4rem (lg) vertical gap between major zones
- **Card padding:** 1.5rem standard; 2rem for featured cards
- **Breathing room:** Hero section min-height 60vh; full-width sections with contained content grid

## Component Patterns

- **Buttons:** bg-primary text-primary-foreground; hover: gold-glow shadow; active: ring-2 ring-gold
- **Links:** text-primary underline on hover; shimmer effect on branded links
- **Forms:** bg-input border-border focus:ring-gold; labels in text-foreground
- **Cards:** bg-card border-border rounded-lg; elevation via box-shadow and -translate-y-1 on hover
- **Badge/pill:** bg-primary/20 text-primary rounded-full px-3 py-1

## Motion & Animations

| Animation | Duration | Trigger | Effect |
|-----------|----------|---------|--------|
| `onyx-shimmer` | 3s | continuous | Gold gradient sweep left-to-right across text |
| `onyx-shimmer-border` | 2.5s | continuous | Overlay shimmer on `.onyx-shimmer-border::after` |
| `card-hover` | 0.3s | hover | -translate-y-1, gold-glow shadow, border-gold |
| `fade-up` | 0.6s | entrance | Fade in + slide up 20px |

## Constraints & Anti-Patterns

- ✗ No default Tailwind shadows — use `gold-glow` or `box-shadow` only
- ✗ No color literals (#fff, rgb) — all colors via CSS variables
- ✗ No arbitrary Tailwind classes — token-only styling
- ✗ Shimmer effect applied sparingly — on headings, brand elements, not every component
- ✓ High contrast: foreground on background > 0.7 lightness; compliance with WCAG AA+
- ✓ Dark mode by default; no light mode variant
- ✓ All fonts loaded locally or via Google Fonts; no system fallbacks

## Accessibility & Inclusivity

- All messaging uses gender-neutral, inclusive language: "every man, every woman, every visionary"
- Confidence-boosting tone: "You were made for this"; "When you feel good, you look good, you work hard, you are unstoppable"
- Color alone never conveys meaning; borders, text, icons provide redundant signaling
- Type scale ensures readability at all sizes; line-height ≥ 1.5 for body text
