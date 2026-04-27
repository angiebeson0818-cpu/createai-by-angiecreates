/**
 * @file pages/DevelopersPage.tsx
 * @description The CREATEai Developer Platform page.
 *
 * Provides full API reference documentation (9 endpoints with HTTP method,
 * full path, description, and credit cost), a Quick Start code example,
 * authentication guide, image storage policy warning, API key management
 * (backed by useGenerateApiKey mutation and useApiKeys query), and a
 * Usage & Billing tab with a per-endpoint credit table.
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IMAGE_DELETION_WARNING } from "@/constants/brand";
import type { ApiEndpoint } from "@/types";
import { Code, Copy, Key, Loader2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useApiKeys, useGenerateApiKey } from "../hooks/useQueries";

// ── API endpoint definitions ───────────────────────────────────────────────

/**
 * The 9 documented REST endpoints for the CREATEai API.
 * Full paths include the /API/1.1/wf/ prefix used in the base URL.
 */
const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: "gen-clothing",
    method: "POST",
    path: "/API/1.1/wf/clothing",
    description: "Generate AI fashion design",
    credits: 10,
    studio: "design",
  },
  {
    id: "virtual-tryon",
    method: "POST",
    path: "/API/1.1/wf/virtual-tryon",
    description: "Virtual try-on overlay",
    credits: 15,
    studio: "virtual-try-on",
  },
  {
    id: "model-generate",
    method: "POST",
    path: "/API/1.1/wf/model-generate",
    description: "Generate AI model photo",
    credits: 20,
    studio: "models",
  },
  {
    id: "style-recs",
    method: "POST",
    path: "/API/1.1/wf/style-recs",
    description: "Style recommendations",
    credits: 5,
    studio: "stylist",
  },
  {
    id: "brand-kit",
    method: "POST",
    path: "/API/1.1/wf/brand-kit",
    description: "Generate brand identity kit",
    credits: 25,
    studio: "branding",
  },
  {
    id: "tech-pack",
    method: "POST",
    path: "/API/1.1/wf/tech-pack",
    description: "Generate technical specification pack",
    credits: 30,
    studio: "tech-pack",
  },
  {
    id: "trends",
    method: "GET",
    path: "/API/1.1/wf/trends",
    description: "Fetch live trend intelligence",
    credits: 3,
    studio: "trends",
  },
  {
    id: "nail-design",
    method: "POST",
    path: "/API/1.1/wf/nail-design",
    description: "Apply nail design to model",
    credits: 12,
    studio: "virtual-try-on",
  },
  {
    id: "get-designs",
    method: "GET",
    path: "/API/1.1/wf/designs",
    description: "Retrieve all saved designs",
    credits: 1,
    studio: "design",
  },
];

/** Editorial studio display names mapped from studio IDs. */
const STUDIO_NAMES: Record<string, string> = {
  design: "The Design Atelier",
  "virtual-try-on": "The Mirror Studio",
  models: "The Model Forge",
  stylist: "The Style Compass",
  branding: "The Brand Vault",
  "tech-pack": "The Precision Lab",
  trends: "The Trend Intelligence",
};

// ── Quick Start code example ───────────────────────────────────────────────

/**
 * JavaScript fetch example demonstrating how to call the clothing endpoint.
 * Includes the IMAGE_DELETION_WARNING reminder as a code comment.
 */
const QUICK_START_CODE = `// Example: Generate AI fashion design
const response = await fetch(
  "https://createai/API/1.1/wf/clothing?api_key=YOUR_API_KEY",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model_image: "https://your-cdn.com/model.jpg",
      clothing_description: "Tailored charcoal blazer, structured shoulders",
      style: "editorial",
    }),
  }
);

const { design_url, credits_used } = await response.json();

// ⚠️  ${IMAGE_DELETION_WARNING}`;

// ── Endpoint row component ─────────────────────────────────────────────────

interface EndpointRowProps {
  endpoint: ApiEndpoint;
  /** 1-based position index used for data-ocid markers. */
  position: number;
}

/**
 * Renders a single API endpoint row with method badge, full path, description,
 * studio attribution, and credit cost badge.
 */
function EndpointRow({ endpoint, position }: EndpointRowProps) {
  const isGet = endpoint.method === "GET";
  return (
    <div
      className="flex items-start gap-4 p-4 bg-background border border-border rounded-lg hover:border-gold/20 transition-colors"
      data-ocid={`developers.item.${position}`}
    >
      {/* HTTP method badge */}
      <Badge
        className={`font-mono text-xs shrink-0 mt-0.5 ${
          isGet
            ? "bg-emerald-900/30 text-emerald-400 border-emerald-800/40"
            : "bg-gold/10 text-gold border-gold/20"
        }`}
        aria-label={`HTTP ${endpoint.method}`}
      >
        {endpoint.method}
      </Badge>

      {/* Path + description + studio */}
      <div className="flex-1 min-w-0">
        <code className="text-sm text-foreground font-mono">
          {endpoint.path}
        </code>
        <p className="text-sm text-muted-foreground mt-1 font-body">
          {endpoint.description}
        </p>
        <Badge
          variant="outline"
          className="mt-2 text-[10px] border-border text-muted-foreground font-body"
        >
          {STUDIO_NAMES[endpoint.studio] ?? endpoint.studio}
        </Badge>
      </div>

      {/* Credit cost */}
      <Badge
        variant="outline"
        className="border-gold/20 text-gold text-xs shrink-0 font-mono"
        aria-label={`${endpoint.credits} credit${endpoint.credits > 1 ? "s" : ""} per call`}
      >
        {endpoint.credits} credit{endpoint.credits > 1 ? "s" : ""}
      </Badge>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

/**
 * DevelopersPage — the API documentation and key management hub for CREATEai.
 *
 * Features:
 * - Hero section with base URL display
 * - Tabbed layout: API Docs | API Keys | Usage & Billing
 * - API Docs: authentication guide, Quick Start code example (copy button),
 *   9 endpoint listings, IMAGE_DELETION_WARNING banner, integration guides
 * - API Keys: list of generated keys with copy button; generate new key via
 *   useGenerateApiKey() mutation with loading state; login-gated
 * - Usage & Billing: per-endpoint credit cost table
 */
export default function DevelopersPage() {
  const { identity } = useInternetIdentity();
  const { data: apiKeys, isLoading: keysLoading } = useApiKeys();
  const generateKey = useGenerateApiKey();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  /** Copy an API key to clipboard and briefly show a visual confirmation. */
  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    toast.success("API key copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  /** Copy the Quick Start code example to clipboard. */
  const copyCode = () => {
    navigator.clipboard.writeText(QUICK_START_CODE);
    setCodeCopied(true);
    toast.success("Code example copied!");
    setTimeout(() => setCodeCopied(false), 2000);
  };

  /** Generate a new API key and show toast feedback. */
  const handleGenerate = async () => {
    try {
      await generateKey.mutateAsync();
      toast.success("New API key generated!");
    } catch {
      toast.error("Failed to generate API key. Please try again.");
    }
  };

  return (
    <main id="main-content" aria-label="Developer Documentation">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative py-28 bg-card border-b border-border overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/about-ai-innovation.dim_800x500.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/90 to-card/60" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="text-xs font-body uppercase tracking-[0.25em] text-gold mb-4 block">
              Developer Platform
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="onyx-shimmer">Build with</span>
              <br />
              <span className="onyx-shimmer">CREATEai</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl font-body">
              Integrate the full power of CREATEai's fashion AI directly into
              your platform. Every studio, every capability — accessible via a
              clean REST API with credit-based usage.
            </p>
            {/* Base URL display */}
            <div className="flex items-center gap-3 mt-8 p-4 bg-background border border-gold/20 rounded-lg max-w-lg">
              <code className="text-sm text-gold font-mono break-all">
                https://createai/API/1.1/wf/
              </code>
              <Badge className="bg-gold/10 text-gold border-gold/20 font-mono whitespace-nowrap text-xs">
                Base URL
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Tabbed content ────────────────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="docs" className="max-w-5xl">
            <TabsList
              className="bg-card border border-border mb-8 h-auto p-1"
              aria-label="Developer documentation sections"
            >
              <TabsTrigger
                value="docs"
                className="font-body"
                aria-label="API documentation"
                data-ocid="developers.tab"
              >
                API Docs
              </TabsTrigger>
              <TabsTrigger
                value="keys"
                className="font-body"
                aria-label="API key management"
                data-ocid="developers.tab"
              >
                API Keys
              </TabsTrigger>
              <TabsTrigger
                value="usage"
                className="font-body"
                aria-label="Usage and billing information"
                data-ocid="developers.tab"
              >
                Usage &amp; Billing
              </TabsTrigger>
            </TabsList>

            {/* ── Docs tab ─────────────────────────────────────────────── */}
            <TabsContent value="docs">
              <div className="space-y-8">
                {/* Authentication */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <h2 className="font-display text-2xl font-bold mb-3">
                    <span className="onyx-shimmer">Authentication</span>
                  </h2>
                  <p className="text-muted-foreground mb-4 leading-relaxed font-body">
                    Include your API key as a query parameter on every request.
                    Generate keys from the API Keys tab. Each call deducts
                    credits from your balance.
                  </p>
                  <div
                    className="bg-background border border-border rounded-lg p-4 font-mono text-sm text-gold break-all"
                    aria-label="Authentication example URL"
                  >
                    https://createai/API/1.1/wf/clothing?api_key=YOUR_API_KEY
                  </div>
                </motion.div>

                {/* IMAGE_DELETION_WARNING — prominently placed after auth */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="bg-gold/5 border border-gold/30 rounded-xl p-5"
                  role="alert"
                  aria-live="polite"
                >
                  <p className="text-sm">
                    <strong className="text-gold">
                      ⚠️ Image Storage Policy:{" "}
                    </strong>
                    <span className="text-muted-foreground font-body">
                      {IMAGE_DELETION_WARNING}
                    </span>
                  </p>
                </motion.div>

                {/* Quick Start code example */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-2xl font-bold">
                      <span className="onyx-shimmer">Quick Start</span>
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyCode}
                      className="text-muted-foreground hover:text-gold"
                      aria-label={
                        codeCopied ? "Code copied" : "Copy code example"
                      }
                      data-ocid="developers.secondary_button"
                    >
                      {codeCopied ? (
                        <Zap className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <pre className="bg-background border border-border rounded-lg p-4 text-xs font-mono text-muted-foreground overflow-x-auto leading-relaxed">
                    <code>{QUICK_START_CODE}</code>
                  </pre>
                </motion.div>

                {/* 9 API endpoints */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <h2 className="font-display text-2xl font-bold mb-6">
                    <span className="onyx-shimmer">Available Endpoints</span>
                  </h2>
                  <div className="space-y-3" data-ocid="developers.list">
                    {API_ENDPOINTS.map((ep, i) => (
                      <EndpointRow key={ep.id} endpoint={ep} position={i + 1} />
                    ))}
                  </div>
                </motion.div>

                {/* Integration guides */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <h2 className="font-display text-2xl font-bold mb-4">
                    <span className="onyx-shimmer">Integration Guides</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        title: "E-Commerce Platforms",
                        desc: "Add AI virtual try-on and model renders to your Shopify, WooCommerce, or custom storefront.",
                      },
                      {
                        title: "Design Tools",
                        desc: "Embed design generation and style matching into Figma plugins, design apps, or internal tools.",
                      },
                      {
                        title: "Mobile Apps",
                        desc: "Use REST endpoints directly from iOS, Android, or React Native with any HTTP client.",
                      },
                    ].map(({ title, desc }) => (
                      <div
                        key={title}
                        className="p-4 bg-background border border-border rounded-lg"
                      >
                        <h3 className="font-body font-semibold text-sm mb-2 text-foreground">
                          {title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed font-body">
                          {desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* CTA to API keys tab */}
                <div className="flex justify-start">
                  <Button
                    size="lg"
                    className="bg-gold text-background hover:bg-gold/90 font-semibold"
                    aria-label="Navigate to API Keys tab"
                    onClick={() => {
                      const keysTab = document.querySelector(
                        '[data-value="keys"]',
                      ) as HTMLButtonElement | null;
                      keysTab?.click();
                    }}
                    data-ocid="developers.primary_button"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Get Your API Key
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* ── API Keys tab ──────────────────────────────────────────── */}
            <TabsContent value="keys">
              <div
                className="bg-card border border-border rounded-xl p-6"
                data-ocid="developers.panel"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-display text-2xl font-bold">
                      <span className="onyx-shimmer">Your API Keys</span>
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1 font-body">
                      Manage programmatic access to the CREATEai platform.
                    </p>
                  </div>
                  {identity !== null ? (
                    <Button
                      className="bg-gold text-background hover:bg-gold/90 font-semibold"
                      onClick={handleGenerate}
                      disabled={generateKey.isPending}
                      aria-label={
                        generateKey.isPending
                          ? "Generating API key…"
                          : "Generate new API key"
                      }
                      data-ocid="developers.primary_button"
                    >
                      {generateKey.isPending ? (
                        <>
                          <Loader2
                            className="w-4 h-4 mr-2 animate-spin"
                            aria-hidden="true"
                          />
                          Generating…
                        </>
                      ) : (
                        <>
                          <Key className="w-4 h-4 mr-2" aria-hidden="true" />
                          Generate New Key
                        </>
                      )}
                    </Button>
                  ) : null}
                </div>

                {/* Not signed in */}
                {identity === null ? (
                  <div
                    className="text-center py-16 text-muted-foreground"
                    data-ocid="developers.empty_state"
                  >
                    <Key
                      className="w-12 h-12 mx-auto mb-4 text-gold/30"
                      aria-hidden="true"
                    />
                    <p className="font-display text-lg mb-1 text-foreground">
                      Sign in to manage API keys
                    </p>
                    <p className="text-sm font-body">
                      Use Internet Identity to access your developer
                      credentials.
                    </p>
                  </div>
                ) : keysLoading ? (
                  /* Loading skeleton */
                  <div
                    className="space-y-3"
                    data-ocid="developers.loading_state"
                  >
                    {["a", "b"].map((k) => (
                      <div
                        key={k}
                        className="h-14 bg-background border border-border rounded-lg animate-pulse"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                ) : apiKeys && apiKeys.length > 0 ? (
                  /* Keys list */
                  <div className="space-y-3" data-ocid="developers.keys.list">
                    {apiKeys.map((key, i) => (
                      <div
                        key={key}
                        className="flex items-center gap-3 p-4 bg-background border border-border rounded-lg"
                        data-ocid={`developers.keys.item.${i + 1}`}
                      >
                        <Code
                          className="w-4 h-4 text-gold shrink-0"
                          aria-hidden="true"
                        />
                        <code className="flex-1 text-sm font-mono text-muted-foreground truncate min-w-0">
                          {key}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyKey(key)}
                          className="text-muted-foreground hover:text-gold shrink-0"
                          aria-label={
                            copiedKey === key
                              ? "Key copied"
                              : "Copy API key to clipboard"
                          }
                          data-ocid="developers.secondary_button"
                        >
                          {copiedKey === key ? (
                            <Zap className="w-4 h-4" aria-hidden="true" />
                          ) : (
                            <Copy className="w-4 h-4" aria-hidden="true" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* No keys yet */
                  <div
                    className="text-center py-16 text-muted-foreground"
                    data-ocid="developers.empty_state"
                  >
                    <Key
                      className="w-12 h-12 mx-auto mb-4 text-gold/30"
                      aria-hidden="true"
                    />
                    <p className="font-display text-lg mb-1 text-foreground">
                      No API keys yet
                    </p>
                    <p className="text-sm font-body">
                      Generate your first key to start building with CREATEai.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ── Usage & Billing tab ───────────────────────────────────── */}
            <TabsContent value="usage">
              <div className="space-y-6">
                {/* Per-endpoint credit cost table */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-display text-2xl font-bold mb-6">
                    <span className="onyx-shimmer">Credit Usage Table</span>
                  </h2>
                  <div className="overflow-x-auto">
                    <table
                      className="w-full text-sm"
                      aria-label="API endpoints and their credit costs"
                    >
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left font-body font-semibold text-muted-foreground py-3 pr-4">
                            Endpoint
                          </th>
                          <th className="text-left font-body font-semibold text-muted-foreground py-3 pr-4">
                            Studio
                          </th>
                          <th className="text-right font-body font-semibold text-muted-foreground py-3">
                            Credits / Call
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {API_ENDPOINTS.map((ep, i) => (
                          <tr
                            key={ep.id}
                            className={
                              i < API_ENDPOINTS.length - 1
                                ? "border-b border-border/40"
                                : ""
                            }
                          >
                            <td className="py-3 pr-4">
                              <code className="text-xs font-mono text-gold">
                                {ep.path}
                              </code>
                            </td>
                            <td className="py-3 pr-4 text-muted-foreground text-xs font-body">
                              {STUDIO_NAMES[ep.studio] ?? ep.studio}
                            </td>
                            <td className="py-3 text-right font-mono font-semibold text-foreground">
                              {ep.credits}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Inline IMAGE_DELETION_WARNING reminder in billing context */}
                <div
                  className="bg-gold/5 border border-gold/30 rounded-xl p-5"
                  role="note"
                  aria-label="Image storage policy"
                >
                  <p className="text-sm">
                    <strong className="text-gold">⚠️ Remember: </strong>
                    <span className="text-muted-foreground font-body">
                      {IMAGE_DELETION_WARNING}
                    </span>
                  </p>
                </div>

                {/* Your API usage section */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-display text-2xl font-bold mb-4">
                    <span className="onyx-shimmer">Your API Usage</span>
                  </h2>
                  {identity === null ? (
                    <div
                      className="text-center py-12 text-muted-foreground"
                      data-ocid="developers.usage.empty_state"
                    >
                      <p className="font-body">
                        Sign in to view your API call history and credit
                        consumption.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Zap
                        className="w-10 h-10 mx-auto mb-3 text-gold/30"
                        aria-hidden="true"
                      />
                      <p className="font-display text-lg mb-1 text-foreground">
                        Usage analytics coming soon
                      </p>
                      <p className="text-sm font-body">
                        Your call history and credit consumption will appear
                        here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
