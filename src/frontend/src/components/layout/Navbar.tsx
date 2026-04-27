/**
 * @file components/layout/Navbar.tsx
 * @description Fixed top navigation bar for CREATEai by angieCREATEs.
 *
 * Responsibilities:
 *  - Displays the angieCREATEs logo (from ASSET_PATHS.logo) linking to the home page.
 *  - Renders a Studios dropdown containing all 7 studio links (from studioData.ts).
 *  - Renders explore and utility links using ALL_ROUTES from constants/brand.ts.
 *  - Shows a Sign In button for unauthenticated visitors; an Account dropdown
 *    with Dashboard and Sign Out actions for authenticated users.
 *  - Collapses into an animated mobile drawer at breakpoints below xl.
 *  - Full keyboard accessibility: Escape closes open dropdowns and the mobile menu.
 *
 * Accessibility patterns:
 *  - Desktop nav wrapped in <nav aria-label="Main navigation">.
 *  - Dropdown triggers carry aria-haspopup="menu" and aria-expanded state.
 *  - Dropdown menu items carry role="menuitem".
 *  - Logo anchor has an explicit aria-label for screen-reader context.
 *  - Mobile hamburger button has aria-label and aria-expanded.
 *  - Auth area shows a skeleton while Internet Identity is initialising.
 *
 * @example
 *   // Used once in Layout.tsx — no props required
 *   <Navbar />
 */

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useLocation } from "@tanstack/react-router";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ALL_ROUTES, ASSET_PATHS, STUDIO_ROUTES } from "../../constants/brand";
import { studios } from "../../data/studioData";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useUserProfile } from "../../hooks/useQueries";
import AuthModal from "../AuthModal";

// ── Types ─────────────────────────────────────────────────────────────────

/** Shape for every entry in the Studios dropdown and mobile studio list. */
interface StudioNavLink {
  label: string;
  path: string;
  /** When true, renders a gold "NEW" badge beside the label. */
  isSpecial?: boolean;
}

// ── Static Data ───────────────────────────────────────────────────────────

/** Explore / utility links shown in desktop nav and mobile menu. */
const exploreLinks: { label: string; path: string }[] = [
  { label: "All AI Features", path: ALL_ROUTES.features },
  { label: "Pricing", path: ALL_ROUTES.pricing },
  { label: "Community", path: ALL_ROUTES.community },
  { label: "Developers", path: ALL_ROUTES.developers },
];

/**
 * Studio links derived from the authoritative studioData source — names and
 * paths stay in sync automatically; no duplication here.
 */
const coreStudioLinks: StudioNavLink[] = studios.map((s) => ({
  label: s.name,
  path: STUDIO_ROUTES[s.id] ?? s.path,
}));

/** Nail Atelier is a special extra entry appended after the 7 core studios. */
const nailAtelierLink: StudioNavLink = {
  label: "✦ The Nail Atelier",
  path: ALL_ROUTES.nailAtelier,
  isSpecial: true,
};

/** Full ordered list rendered in the Studios dropdown and mobile drawer. */
const allStudioLinks: StudioNavLink[] = [...coreStudioLinks, nailAtelierLink];

// ── Component ─────────────────────────────────────────────────────────────

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [studiosOpen, setStudiosOpen] = useState(false);

  const location = useLocation();
  const currentPath: string = location.pathname;

  /** Close mobile menu when the route changes (ref-based to avoid stale dep). */
  const prevPathRef = useRef(currentPath);
  if (prevPathRef.current !== currentPath) {
    prevPathRef.current = currentPath;
    if (mobileOpen) setMobileOpen(false);
  }

  /** Internet Identity hook — loginStatus drives the auth-loading skeleton. */
  const { identity, clear, loginStatus } = useInternetIdentity();
  const { data: profile } = useUserProfile();

  const isLoggedIn = !!identity;
  /** True while the auth layer is still determining the session state. */
  const isAuthLoading = loginStatus === "initializing";

  /** Close menus on Escape key. */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setStudiosOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* ── Logo + Brand ────────────────────────────────────────── */}
            <Link
              to={ALL_ROUTES.home}
              className="flex items-center gap-2.5 group shrink-0"
              aria-label="CREATEai by angieCREATEs — Home"
              data-ocid="nav.logo_link"
            >
              <img
                src={ASSET_PATHS.logo}
                alt="angieCREATEs logo"
                className="w-9 h-9 object-contain rounded-full ring-1 ring-gold/30 group-hover:ring-gold/60 transition-all"
              />
              <span className="font-display text-lg font-bold gradient-text whitespace-nowrap">
                CREATEai{" "}
                <span className="text-muted-foreground font-body text-xs font-normal">
                  by angieCREATEs
                </span>
              </span>
            </Link>

            {/* ── Desktop Navigation ──────────────────────────────────── */}
            <nav
              className="hidden xl:flex items-center gap-0.5 ml-6"
              aria-label="Main navigation"
            >
              {/* Studios Dropdown */}
              <DropdownMenu open={studiosOpen} onOpenChange={setStudiosOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-gold hover:bg-gold/5 font-body text-xs"
                    aria-haspopup="menu"
                    aria-expanded={studiosOpen}
                    aria-label="Open studios menu"
                    data-ocid="nav.studios_dropdown"
                  >
                    Studios{" "}
                    <ChevronDown className="ml-1 w-3 h-3" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="bg-card border-border w-64"
                >
                  {allStudioLinks.map((link) => (
                    <DropdownMenuItem key={link.path} asChild role="menuitem">
                      <Link
                        to={link.path}
                        className={[
                          "cursor-pointer font-body text-sm transition-colors flex items-center justify-between w-full",
                          currentPath === link.path
                            ? "text-gold"
                            : link.isSpecial
                              ? "text-gold/80 hover:text-gold"
                              : "hover:text-gold",
                        ].join(" ")}
                        data-ocid="nav.studio_link"
                      >
                        <span>{link.label}</span>
                        {link.isSpecial === true && (
                          <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 font-body tracking-wide uppercase">
                            NEW
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Explore links */}
              {exploreLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={[
                    "px-3 py-2 text-xs font-body transition-colors hover:text-gold",
                    currentPath === link.path
                      ? "text-gold"
                      : "text-muted-foreground",
                  ].join(" ")}
                  data-ocid="nav.link"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                to={ALL_ROUTES.about}
                className={[
                  "px-3 py-2 text-xs font-body transition-colors hover:text-gold",
                  currentPath === ALL_ROUTES.about
                    ? "text-gold"
                    : "text-muted-foreground",
                ].join(" ")}
                data-ocid="nav.link"
              >
                About
              </Link>
            </nav>

            {/* ── Auth Buttons + Mobile Toggle ─────────────────────────── */}
            <div className="flex items-center gap-2 ml-auto xl:ml-4">
              {/* Auth loading skeleton */}
              {isAuthLoading && (
                <Skeleton
                  className="h-8 w-20 rounded-md"
                  aria-label="Loading authentication status"
                  data-ocid="nav.auth_loading_state"
                />
              )}

              {/* Authenticated: Account dropdown */}
              {!isAuthLoading && isLoggedIn && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/60 font-body text-xs"
                      aria-haspopup="menu"
                      aria-label="Open account menu"
                      data-ocid="nav.account_dropdown"
                    >
                      <User className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                      {profile?.username ?? "Account"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-card border-border w-44"
                  >
                    <DropdownMenuItem asChild role="menuitem">
                      <Link
                        to={ALL_ROUTES.dashboard}
                        className="cursor-pointer"
                        data-ocid="nav.dashboard_link"
                      >
                        <LayoutDashboard
                          className="w-4 h-4 mr-2 text-gold"
                          aria-hidden="true"
                        />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem
                      onClick={clear}
                      className="text-destructive cursor-pointer"
                      role="menuitem"
                      data-ocid="nav.logout"
                    >
                      <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Unauthenticated: Sign In button */}
              {!isAuthLoading && !isLoggedIn && (
                <Button
                  size="sm"
                  className="bg-gold text-background hover:opacity-90 font-semibold font-body text-xs px-4"
                  onClick={() => setAuthOpen(true)}
                  aria-label="Sign in to CREATEai"
                  data-ocid="nav.signin_button"
                >
                  Sign In
                </Button>
              )}

              {/* Mobile hamburger */}
              <button
                type="button"
                className="xl:hidden p-2 text-muted-foreground hover:text-gold transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={
                  mobileOpen ? "Close navigation menu" : "Open navigation menu"
                }
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav-menu"
                data-ocid="nav.mobile_toggle"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ────────────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              id="mobile-nav-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="xl:hidden bg-card border-t border-border overflow-hidden"
              aria-label="Mobile navigation"
            >
              <div className="container mx-auto px-4 py-5 flex flex-col gap-1">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-body mb-2 px-2">
                  Studios
                </p>

                {allStudioLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={[
                      "py-2 px-3 rounded text-sm font-body transition-colors hover:text-gold hover:bg-gold/5 flex items-center justify-between",
                      currentPath === link.path
                        ? "text-gold bg-gold/5"
                        : link.isSpecial
                          ? "text-gold/80"
                          : "text-muted-foreground",
                    ].join(" ")}
                    onClick={() => setMobileOpen(false)}
                    role="menuitem"
                    data-ocid="nav.mobile_studio_link"
                  >
                    <span>{link.label}</span>
                    {link.isSpecial === true && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 font-body tracking-wide uppercase">
                        NEW
                      </span>
                    )}
                  </Link>
                ))}

                <div className="section-divider my-3" />

                <p className="text-xs text-muted-foreground uppercase tracking-widest font-body mb-2 px-2">
                  Explore
                </p>

                {exploreLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="py-2 px-3 rounded text-sm font-body text-muted-foreground hover:text-gold hover:bg-gold/5 transition-colors"
                    onClick={() => setMobileOpen(false)}
                    role="menuitem"
                    data-ocid="nav.mobile_link"
                  >
                    {link.label}
                  </Link>
                ))}

                {[
                  { label: "About", path: ALL_ROUTES.about },
                  { label: "Contact", path: ALL_ROUTES.contact },
                ].map(({ label, path }) => (
                  <Link
                    key={path}
                    to={path}
                    className="py-2 px-3 rounded text-sm font-body text-muted-foreground hover:text-gold hover:bg-gold/5 transition-colors"
                    onClick={() => setMobileOpen(false)}
                    role="menuitem"
                    data-ocid="nav.mobile_link"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
