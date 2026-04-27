/**
 * @file App.tsx
 * @description Root application component for CREATEai by angieCREATEs.
 *
 * Responsibilities:
 *  - Declares all TanStack Router routes and the route tree
 *  - Wraps the router outlet in Layout (Navbar + Footer + Toaster)
 *  - Wraps the entire app in ErrorBoundary for graceful render-error recovery
 *  - Registers a catch-all '*' route rendering NotFoundPage for unknown paths
 *
 * This file contains ONLY routing and provider wiring.
 * All page logic lives in src/pages/. All layout logic lives in Layout below.
 */

import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import { studios } from "./data/studioData";
import AboutPage from "./pages/AboutPage";
import CommunityPage from "./pages/CommunityPage";
import ContactPage from "./pages/ContactPage";
import DashboardPage from "./pages/DashboardPage";
import DevelopersPage from "./pages/DevelopersPage";
import FeaturesPage from "./pages/FeaturesPage";
import HomePage from "./pages/HomePage";
import NailAtelierPage from "./pages/NailAtelierPage";
import NotFoundPage from "./pages/NotFoundPage";
import PricingPage from "./pages/PricingPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import StudioPage from "./pages/studio/StudioPage";

// ── Layout Shell ──────────────────────────────────────────────────────────

/**
 * Layout wraps every page with the persistent Navbar, Footer, and Toaster.
 * The page content is injected via <Outlet />.
 * The `pt-16` offset accounts for the fixed Navbar height.
 */
function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 pt-16">
        <Outlet />
      </div>
      <Footer />
      <Toaster theme="dark" />
    </div>
  );
}

// ── Root Route ────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({ component: Layout });

// ── Top-Level Routes ──────────────────────────────────────────────────────

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const featuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/features",
  component: FeaturesPage,
});

const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pricing",
  component: PricingPage,
});

const communityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/community",
  component: CommunityPage,
});

const developersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/developers",
  component: DevelopersPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsPage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const nailAtelierRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nail-atelier",
  component: NailAtelierPage,
});

// ── Studio Routes (one per studio in studioData.ts) ───────────────────────

const designStudioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/studio/design",
  component: () => <StudioPage studio={studios[0]} />,
});

const virtualTryOnRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/studio/virtual-try-on",
  component: () => <StudioPage studio={studios[1]} />,
});

const modelsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/studio/models",
  component: () => <StudioPage studio={studios[2]} />,
});

const stylistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/studio/stylist",
  component: () => <StudioPage studio={studios[3]} />,
});

const brandingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/studio/branding",
  component: () => <StudioPage studio={studios[4]} />,
});

const techPackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/studio/tech-pack",
  component: () => <StudioPage studio={studios[5]} />,
});

const trendsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/studio/trends",
  component: () => <StudioPage studio={studios[6]} />,
});

// ── Catch-All 404 Route ───────────────────────────────────────────────────

/**
 * Any path not matched by the routes above renders NotFoundPage.
 * This must be the last route in the tree.
 */
const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: NotFoundPage,
});

// ── Route Tree ────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  homeRoute,
  featuresRoute,
  pricingRoute,
  communityRoute,
  developersRoute,
  aboutRoute,
  contactRoute,
  termsRoute,
  privacyRoute,
  dashboardRoute,
  nailAtelierRoute,
  designStudioRoute,
  virtualTryOnRoute,
  modelsRoute,
  stylistRoute,
  brandingRoute,
  techPackRoute,
  trendsRoute,
  notFoundRoute,
]);

const router = createRouter({ routeTree, defaultPreload: "intent" });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ── Root Component ────────────────────────────────────────────────────────

/**
 * App is the top-level React component.
 * It wraps the router in ErrorBoundary so any unhandled render error
 * anywhere in the tree falls back to the branded error screen.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
