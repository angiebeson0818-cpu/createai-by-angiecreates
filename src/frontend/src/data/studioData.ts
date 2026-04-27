// studioData.ts — 7 AI Studios for CREATEai by angieCREATEs
// All studio names, taglines, descriptions, and feature titles are elevated
// to the CREATEai editorial brand standard.

export interface StudioFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge?: string;
}

export interface Studio {
  id: string;
  name: string;
  tagline: string;
  description: string;
  path: string;
  icon: string;
  color: string;
  heroImage?: string;
  features: StudioFeature[];
  insight?: string;
  faq?: Array<{ q: string; a: string }>;
}

export const studios: Studio[] = [
  // ── Studio 1: The Design Atelier ────────────────────────────────────────
  {
    id: "design",
    name: "The Design Atelier",
    tagline: "Where imagination becomes a collection.",
    description:
      "Generate original fashion designs from text, sketches, fabrics, or reference images. Refine, iterate, and create with total freedom. Every man, every woman, every visionary deserves a space where ideas become reality — instantly.",
    path: "/studio/design",
    icon: "✦",
    color: "from-amber-900/30 to-yellow-900/20",
    heroImage: "/assets/bg-studio-a.png",
    insight:
      "The real power of AI in fashion isn't automation — it's liberation. When every creator can explore, discard, and refine ideas without limits, extraordinary work happens faster than you ever imagined.",
    features: [
      {
        id: "prompt-to-piece",
        title: "Prompt to Piece",
        description:
          "Describe a silhouette, outfit, or garment and our AI transforms your words into a fully realized clothing design in seconds. Dresses, jackets, bags, jewelry, swimwear, footwear — your vision, materialized.",
        icon: "✍",
      },
      {
        id: "sketch-alchemy",
        title: "Sketch Alchemy",
        description:
          "Upload your hand-drawn sketch and watch AI transform it into a vibrant, professional digital design. Bridge imagination and creation with a single upload.",
        icon: "📐",
      },
      {
        id: "palette-architect",
        title: "Palette Architect",
        description:
          "Highlight any area of your design, select a new hue, and watch your creation evolve instantly. Fine-tune details or completely reinvent the color story with surgical precision.",
        icon: "🎨",
      },
      {
        id: "fabric-intelligence",
        title: "Fabric Intelligence",
        description:
          "Upload a photo of any fabric or textile and instantly transform it into a unique clothing design. From concept to creation — seamless and effortless.",
        icon: "🧵",
      },
      {
        id: "silhouette-engine",
        title: "Silhouette Engine",
        description:
          "Turn any clothing photo into a production-ready flat sketch in seconds. Perfect for tech pack creation and clear manufacturer communication.",
        icon: "📄",
      },
      {
        id: "seasonal-visionary",
        title: "Seasonal Visionary",
        description:
          "Generate multiple variations of your design guided by seasonal themes and trend directions. Rapidly experiment with new directions from a single original image.",
        icon: "✨",
      },
      {
        id: "style-lineage",
        title: "Style Lineage",
        description:
          "Upload reference images to inspire and create new designs in the same aesthetic. Train your AI on specific fashion sensibilities and build a consistent creative legacy.",
        icon: "🧠",
      },
      {
        id: "texture-exchange",
        title: "Texture Exchange",
        description:
          "Upload a clothing photo and a new fabric image. Our AI seamlessly replaces the original fabric with the new one — a game-changer for designers and brands.",
        icon: "🔄",
      },
      {
        id: "drape-studio",
        title: "Drape Studio",
        description:
          "Apply any fabric or textile pattern onto a flat sketch with AI precision. Upload your fabric and sketch and let AI do the draping.",
        icon: "🖌",
      },
      {
        id: "motion-runway",
        title: "Motion Runway",
        description:
          "Transform designs or text descriptions into dynamic fashion videos. Turn your ideas into striking motion showcases that command attention.",
        icon: "🎬",
      },
      {
        id: "dimension-form",
        title: "Dimension Form",
        description:
          "Generate 3D clothing models in seconds from text or images. Transform clothing photos into AI 3D models ready for exploration.",
        icon: "🧊",
      },
      {
        id: "phantom-form",
        title: "Phantom Form",
        description:
          "Instantly transform any garment photo into a ghost mannequin display — ideal for designers, brands, and e-commerce product pages.",
        icon: "👤",
      },
      {
        id: "perspective-shift",
        title: "Perspective Shift",
        description:
          "Create new alternative views and angles of a fashion model. Upload your original and let AI generate fresh perspectives.",
        icon: "🔭",
      },
      {
        id: "scene-architect",
        title: "Scene Architect",
        description:
          "Edit the background of any fashion photo instantly. Create alternative scenes and settings without a new photoshoot.",
        icon: "🌅",
      },
      {
        id: "brand-mark",
        title: "Brand Mark",
        description:
          "Integrate logos into clothing images with precision. Add your brand mark to t-shirts, hoodies, hats, and more in seconds.",
        icon: "🏷",
      },
      {
        id: "model-canvas",
        title: "Model Canvas",
        description:
          "Transform your clothing photo into an AI fashion model visual in 30 seconds. Say goodbye to expensive photoshoots.",
        icon: "👗",
      },
      {
        id: "identity-remix",
        title: "Identity Remix",
        description:
          "Showcase creations on different people without reshooting or recreating the garment. A powerful tool for representation and brand campaigns.",
        icon: "👥",
      },
      {
        id: "co-create",
        title: "Co-Create",
        description:
          "Add team members and design together in real time. Share a workspace to build collections collaboratively with your creative team.",
        icon: "🤝",
      },
    ],
    faq: [
      {
        q: "How do I create an AI clothing design?",
        a: "Fill in the creation fields with your ideas — text descriptions, sketch uploads, or fabric photos — and our AI will generate multiple design directions instantly.",
      },
      {
        q: "Can I iterate on my designs?",
        a: "Yes. Every detail is adjustable. Change colors, swap fabrics, alter silhouettes, or generate variations from a single image without starting over.",
      },
    ],
  },

  // ── Studio 2: The Mirror Studio ─────────────────────────────────────────
  {
    id: "virtual-try-on",
    name: "The Mirror Studio",
    tagline: "See yourself. Trust what you see. Own the moment.",
    description:
      "Try on clothes, jewelry, and accessories with AI precision and creative control. What you see is what you can become — for every man, every woman, every visionary who deserves confidence before they commit.",
    path: "/studio/virtual-try-on",
    icon: "◈",
    color: "from-rose-900/30 to-pink-900/20",
    heroImage: "/assets/bg-studio-b.png",
    insight:
      "Realism alone isn't enough. What truly drives confidence is consistency. When proportions, lighting, and fit behave predictably, every person can trust what they see — and feel empowered to act.",
    features: [
      {
        id: "digital-drape",
        title: "Digital Drape",
        description:
          "Virtually try on garments in seconds by combining a person photo with a clothing image. Dresses, jackets, tops, or full outfits applied naturally with realistic proportions.",
        icon: "👚",
      },
      {
        id: "body-blueprint",
        title: "Body Blueprint",
        description:
          "Preview footwear with accurate scale and grounding. Replace shoes in any image while preserving foot position, perspective, lighting, and balance.",
        icon: "👟",
      },
      {
        id: "fit-oracle",
        title: "Fit Oracle",
        description:
          "Place accessories naturally on the body — rings, bracelets, necklaces, earrings, sunglasses, and watches — while respecting scale, angles, and materials.",
        icon: "💍",
      },
      {
        id: "texture-projection",
        title: "Texture Projection",
        description:
          "See how a hat, cap, or beanie looks instantly. Seamlessly combine a model photo with any headwear image for immediate results.",
        icon: "🎩",
      },
      {
        id: "virtual-runway",
        title: "Virtual Runway",
        description:
          "Understand how a bag looks when carried — not just photographed. Generate realistic try-ons adapting proportions, lighting, and perspective.",
        icon: "👜",
      },
      {
        id: "collection-carousel",
        title: "Collection Carousel",
        description:
          "Transform static try-on images into short AI-generated videos showing garments moving naturally on the body. Ideal for immersive product pages.",
        icon: "▶",
      },
      {
        id: "size-certainty",
        title: "Size Certainty",
        description:
          "Describe an outfit and the AI generates it directly on your model image. Explore variations and styles in seconds without uploading garment photos.",
        icon: "💬",
      },
      {
        id: "try-on-engine",
        title: "Try-On Engine",
        description:
          "Integrate real-time virtual try-on into your platform via API. Let users upload photos, choose outfits, and instantly see results — built for e-commerce.",
        icon: "⚡",
      },
      {
        id: "nail-atelier",
        title: "Nail Atelier",
        description:
          "AI-precision nail overlays fitted seamlessly to model hands — 15 signature sets, scalable to any pose and skin tone.",
        icon: "💅",
        badge: "NEW",
      },
    ],
    faq: [
      {
        q: "What is AI virtual try-on?",
        a: "AI virtual try-on lets anyone preview how clothing and accessories look when worn — without physical samples or photo shoots — using computer vision and generative AI.",
      },
      {
        q: "How realistic are the results?",
        a: "Our AI preserves proportions, lighting, fit, and style for realistic results that help brands, designers, and shoppers explore styles with confidence.",
      },
    ],
  },

  // ── Studio 3: The Model Forge ────────────────────────────────────────────
  {
    id: "models",
    name: "The Model Forge",
    tagline: "Every garment. Every body. Every vision.",
    description:
      "Turn product photos into realistic on-model images showing how garments actually look when worn. Represent every body, every style, every identity — without the photoshoot. Ideal for e-commerce, digital showrooms, and rapid collection launches.",
    path: "/studio/models",
    icon: "◉",
    color: "from-purple-900/30 to-violet-900/20",
    heroImage: "/assets/bg-studio-a.png",
    insight:
      "Brands need realism in service of clarity. When shoppers can understand fit, proportions, and how a product is worn — whether on a man, woman, or anyone — hesitation drops and confidence rises.",
    features: [
      {
        id: "signature-persona",
        title: "Signature Persona",
        description:
          "Generate natural, lifelike model renders from simple product photos. Help customers understand fit, proportions, and style across every garment in your catalog.",
        icon: "👩",
      },
      {
        id: "pose-mastery",
        title: "Pose Mastery",
        description:
          "Generate front and back perspectives of a model wearing your garment from just product photos. Improved product understanding, better trust, fewer returns.",
        icon: "↕",
      },
      {
        id: "diversity-canvas",
        title: "Diversity Canvas",
        description:
          "Keep the same garments and seamlessly change the model to explore different identities, body types, aesthetics, or campaigns — inclusivity built in.",
        icon: "🔀",
      },
      {
        id: "expression-studio",
        title: "Expression Studio",
        description:
          "Bring beauty products to life with AI-generated model visuals. Transform cosmetics from fragrances to skincare into stunning editorial showcases.",
        icon: "💄",
      },
      {
        id: "brand-ambassador",
        title: "Brand Ambassador",
        description:
          "Reuse the same digital model across multiple outfits, collections, or campaigns. Maintain a coherent, recognizable brand identity at scale.",
        icon: "🎭",
      },
      {
        id: "scene-architect-model",
        title: "Scene Architect",
        description:
          "Generate realistic children's fashion visuals without the complexity of kids photoshoots. Faster, safer, and more flexible than traditional production.",
        icon: "🧒",
      },
      {
        id: "luminance-director",
        title: "Luminance Director",
        description:
          "Transform product photos into short AI-generated videos showing garments in motion. Ideal for product pages, lookbooks, and social content.",
        icon: "🎥",
      },
      {
        id: "jewel-stage",
        title: "Jewel Stage",
        description:
          "Place jewelry on realistic models while preserving scale, materials, and details. Perfect for luxury accessories and premium digital catalogs.",
        icon: "💎",
      },
      {
        id: "carry-stage",
        title: "Carry Stage",
        description:
          "Generate realistic on-model visuals for handbags and backpacks. Showcase scale, silhouette, and attitude with full creative control.",
        icon: "👜",
      },
      {
        id: "step-stage",
        title: "Step Stage",
        description:
          "Create on-model footwear visuals that highlight silhouette, balance, and detail. Give your shoes the editorial presence they deserve.",
        icon: "👠",
      },
      {
        id: "shore-stage",
        title: "Shore Stage",
        description:
          "Upload product images and generate realistic swimwear model visuals respecting design, colors, and cuts for fast-moving collections.",
        icon: "🌊",
      },
      {
        id: "crown-stage",
        title: "Crown Stage",
        description:
          "Showcase hats, caps, and beanies on realistic models — giving your designs the presence and context they need to resonate.",
        icon: "🎓",
      },
    ],
    faq: [
      {
        q: "Why use AI fashion models?",
        a: "Traditional photoshoots are slow, expensive, and inflexible. AI models reduce costs, launch faster, and let you showcase diversity at scale with full creative control.",
      },
      {
        q: "How do AI models increase sales?",
        a: "Better visuals lead to better decisions. Realistic model images help customers understand fit and style, leading to higher conversion rates and fewer returns.",
      },
    ],
  },

  // ── Studio 4: The Style Compass ──────────────────────────────────────────
  {
    id: "stylist",
    name: "The Style Compass",
    tagline: "Your personal AI stylist. Designed around every you.",
    description:
      "Finding the right outfit should feel empowering, not overwhelming. Your AI stylist understands body shape, proportions, lifestyle, and personal preferences to generate truly tailored outfit suggestions — for every person, every body, every occasion.",
    path: "/studio/stylist",
    icon: "◆",
    color: "from-emerald-900/30 to-teal-900/20",
    heroImage: "/assets/bg-studio-b.png",
    features: [
      {
        id: "wardrobe-alchemy",
        title: "Wardrobe Alchemy",
        description:
          "Get outfit suggestions tailored precisely to body shape, proportions, preferences, and lifestyle. For every body. For every person. Intentional, never generic.",
        icon: "✨",
      },
      {
        id: "occasion-intelligence",
        title: "Occasion Intelligence",
        description:
          "Whether dressing for work, a formal event, travel, or a special occasion — the AI understands the moment and suggests outfits that match both the setting and your identity.",
        icon: "📅",
      },
      {
        id: "capsule-curator",
        title: "Capsule Curator",
        description:
          "Upload a photo of yourself and preview outfit suggestions directly on your own image. See proportions, silhouette, and energy instantly — your body is the canvas.",
        icon: "🪞",
      },
      {
        id: "color-harmony",
        title: "Color Harmony",
        description:
          "Identify the colors that naturally complement your skin tone, hair, and eyes. Every recommendation becomes more confident, harmonious, and uniquely you.",
        icon: "🌈",
      },
      {
        id: "creator-calibration",
        title: "Creator Calibration",
        description:
          "Precise influencer matching based on engagement, audience demographics, and niche focus. Find the perfect voices to amplify your brand and style identity.",
        icon: "🌟",
      },
      {
        id: "style-evolution",
        title: "Style Evolution",
        description:
          "AI-generated outfit videos bring your looks to life. See how garments move, how silhouettes flow, and how pieces interact together in motion.",
        icon: "🎬",
      },
      {
        id: "trend-fusion",
        title: "Trend Fusion",
        description:
          "Once you've created an outfit you love, our AI helps you find real, purchasable pieces that match the look — from similar cuts to comparable styles.",
        icon: "🛍",
      },
    ],
    faq: [
      {
        q: "How does the AI understand my style?",
        a: "By analyzing body shape, proportions, lifestyle inputs, and preferences, the AI generates suggestions that feel intentional — adapting to who you are, not just current trends.",
      },
      {
        q: "Can I shop the suggested outfits?",
        a: "Yes. Our AI shopping assistant helps you find real, purchasable pieces matching the suggested looks, bridging inspiration and your actual wardrobe.",
      },
    ],
  },

  // ── Studio 5: The Brand Vault ────────────────────────────────────────────
  {
    id: "branding",
    name: "The Brand Vault",
    tagline: "Build your identity. Command your market.",
    description:
      "Create compelling brand concepts, generate fashion assets, craft logos, and define your unique voice — faster than ever. From initial spark to full brand identity. Your vision, amplified by AI precision.",
    path: "/studio/branding",
    icon: "◇",
    color: "from-blue-900/30 to-indigo-900/20",
    heroImage: "/assets/bg-studio-a.png",
    features: [
      {
        id: "identity-forge",
        title: "Identity Forge",
        description:
          "Design unique logos for your clothing brand with ease. Create original, memorable marks that capture the spirit of your brand in a few clicks.",
        icon: "🏆",
      },
      {
        id: "signature-shades",
        title: "Signature Shades",
        description:
          "Automatically create stunning, cohesive AI mood boards in seconds for clothes, jewelry, shoes, bags, and more. The ultimate tool for creative vision-setting.",
        icon: "🖼",
      },
      {
        id: "voice-architect",
        title: "Voice Architect",
        description:
          "Craft powerful brand slogans with AI. Generate ideas that capture the spirit and essence of your brand — instantly and compellingly.",
        icon: "💬",
      },
      {
        id: "brand-narrative",
        title: "Brand Narrative",
        description:
          "Find the perfect name for your clothing brand. Describe your concept and spark endless unique, memorable name ideas aligned to your market.",
        icon: "💡",
      },
      {
        id: "visual-legacy",
        title: "Visual Legacy",
        description:
          "Create your own custom mood board using an intuitive canvas. Drag, drop, and arrange visuals, colors, and inspirations — then export to PDF.",
        icon: "✏",
      },
      {
        id: "campaign-intelligence",
        title: "Campaign Intelligence",
        description:
          "Turn your brand concept into a full range of clothing designs. Generate and visualize different styles, imagining what your future collections could look like.",
        icon: "👔",
      },
      {
        id: "market-resonance",
        title: "Market Resonance",
        description:
          "Define what makes your brand truly unique with AI-crafted positioning ideas. Highlight your brand's strengths and stand apart from competitors with clarity.",
        icon: "⭐",
      },
      {
        id: "space-concept",
        title: "Space Concept",
        description:
          "Visualize your store with stunning interior design concepts that align with your brand. Project yourself into your future retail space before spending a single dollar.",
        icon: "🏪",
      },
    ],
    faq: [
      {
        q: "Can I export mood boards?",
        a: "Yes. Export your mood board as a PDF, perfect for presentations, client meetings, or personal archives.",
      },
      {
        q: "How does AI help with brand building?",
        a: "CREATEai analyzes market trends, consumer behavior, and competitor strategies to generate brand concepts, logos, slogans, and positioning that resonate with your audience.",
      },
    ],
  },

  // ── Studio 6: The Precision Lab ──────────────────────────────────────────
  {
    id: "tech-pack",
    name: "The Precision Lab",
    tagline: "From concept to production. Precise. Powerful. Fast.",
    description:
      "Create professional clothing tech packs with our AI-powered maker. Upload sketches, add annotations, define specifications, and export to PDF in one click. Built for every creator who moves at the speed of ideas.",
    path: "/studio/tech-pack",
    icon: "◑",
    color: "from-orange-900/30 to-red-900/20",
    heroImage: "/assets/bg-studio-b.png",
    features: [
      {
        id: "spec-architect",
        title: "Spec Architect",
        description:
          "Create professional clothing tech packs with our easy-to-use tool. Upload sketches, add text and annotations, define size specifications, and export to PDF instantly.",
        icon: "📋",
      },
      {
        id: "measurement-mastery",
        title: "Measurement Mastery",
        description:
          "Use our AI fashion sketch generator to create precise sketches and drawings for your clothing designs. Import AI designs, logos, and mood boards with one click.",
        icon: "✏",
      },
      {
        id: "construction-blueprint",
        title: "Construction Blueprint",
        description:
          "Upload your sketch and watch AI transform it into a realistic, fully detailed design. Import directly into your technical files — faster, smarter, more precise.",
        icon: "🔄",
      },
      {
        id: "material-intelligence",
        title: "Material Intelligence",
        description:
          "Apply any fabric or textile pattern onto a sketch with AI in seconds. Upload your textile and sketch and instantly visualize creations with real textures.",
        icon: "🎨",
      },
      {
        id: "quality-sentinel",
        title: "Quality Sentinel",
        description:
          "Turn every front-view flat sketch into a complete garment story. AI predicts the reverse to validate proportions and communicate specs to manufacturers.",
        icon: "↩",
      },
      {
        id: "production-command",
        title: "Production Command",
        description:
          "Use connectors, shapes, and annotation tools on the canvas to precisely detail your design. Choose from ready-to-use shapes to illustrate and communicate clearly.",
        icon: "📐",
      },
      {
        id: "compliance-navigator",
        title: "Compliance Navigator",
        description:
          "Download your complete tech pack as a PDF in seconds. Add as many pages as needed, including measurements and comprehensive information for manufacturers.",
        icon: "📤",
      },
      {
        id: "collective-gallery",
        title: "Collective Gallery",
        description:
          "Discover inspiring AI fashion sketches from the CREATEai community. Explore designs created by other visionaries and spark fresh ideas for your own projects.",
        icon: "👥",
      },
    ],
    faq: [
      {
        q: "What is a tech pack?",
        a: "A tech pack is a detailed document communicating all technical specifications of a design: measurements, materials, colors, construction details, and production guidelines.",
      },
      {
        q: "How can AI help with tech packs?",
        a: "AI streamlines tech pack creation by automating sketch generation, predicting fabric compatibility, suggesting measurements, and ensuring spec accuracy to reduce time and errors.",
      },
    ],
  },

  // ── Studio 7: The Trend Intelligence ────────────────────────────────────
  {
    id: "trends",
    name: "The Trend Intelligence",
    tagline: "See what's next before the world catches on.",
    description:
      "Empowering designers, brands, and fashion visionaries with real-time, actionable trend intelligence. Advanced AI gathers fashion data across the web and uncovers emerging patterns — so you're always ahead of the curve.",
    path: "/studio/trends",
    icon: "◎",
    color: "from-cyan-900/30 to-sky-900/20",
    heroImage: "/assets/bg-studio-a.png",
    features: [
      {
        id: "live-trend-pulse",
        title: "Live Trend Pulse",
        description:
          "Ask anything about the latest trends, styling advice, or fashion industry updates. Get accurate, up-to-the-minute answers with trusted resources and runway highlights.",
        icon: "⚡",
      },
      {
        id: "market-radar",
        title: "Market Radar",
        description:
          "Uncover emerging trends, style preferences, color palettes, and seasonal patterns. Track the competitive landscape and identify new opportunities with real-time AI.",
        icon: "📊",
      },
      {
        id: "forecast-oracle",
        title: "Forecast Oracle",
        description:
          "Identify which trends are likely to gain popularity by monitoring social media, online searches, retail sales, and runway shows with machine learning.",
        icon: "🌸",
      },
      {
        id: "consumer-intelligence",
        title: "Consumer Intelligence",
        description:
          "Upload an image or ask any question about trends, styling, or industry news. CREATEai browses the web to deliver accurate, up-to-date answers with trusted sources.",
        icon: "👁",
      },
      {
        id: "competitive-vision",
        title: "Competitive Vision",
        description:
          "Detect subtle shifts in color preferences across the fashion industry. Stay ahead of color trends before they hit mainstream markets and command the conversation.",
        icon: "🎨",
      },
      {
        id: "cultural-compass",
        title: "Cultural Compass",
        description:
          "Precise influencer matching based on engagement, audience demographics, and niche focus. Find the perfect voices to amplify your brand at the right cultural moment.",
        icon: "🌟",
      },
      {
        id: "opportunity-mapper",
        title: "Opportunity Mapper",
        description:
          "Translate trend intelligence into actionable product opportunities. Map where your brand can lead the next wave of fashion before competitors see it coming.",
        icon: "🗺",
      },
    ],
    faq: [
      {
        q: "How does AI predict fashion trends?",
        a: "Our AI analyzes vast amounts of data from social media, online searches, retail sales, and runway shows to identify emerging patterns and predict which trends will gain popularity.",
      },
      {
        q: "Are the trend insights real-time?",
        a: "Yes. Our system continuously monitors and analyzes real-time data, providing designers and brands with actionable insights to stay ahead of evolving consumer tastes.",
      },
    ],
  },
];

export const allFeatures = studios.flatMap((studio) =>
  studio.features.map((f) => ({
    ...f,
    studio: studio.id,
    studioName: studio.name,
  })),
);
