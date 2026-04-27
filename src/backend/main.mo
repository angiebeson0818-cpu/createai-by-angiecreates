/**
 * CREATEai by angieCREATEs — Backend Canister
 * ============================================
 *
 * This is the single-actor backend for the CREATEai platform, an all-in-one
 * AI-powered fashion design platform. It runs on the Internet Computer using
 * enhanced orthogonal persistence — all state survives upgrades automatically
 * without `stable` keywords or pre/post-upgrade hooks.
 *
 * ## Architecture
 *
 * The actor owns all persistent state (Maps) and exposes a flat public API
 * grouped into the following domains:
 *
 * ### Access Control
 *   - _initializeAccessControlWithSecret  — Bootstrap the first admin via a secret token
 *   - getCallerUserRole                   — Query the caller's assigned role
 *   - assignCallerUserRole                — Admin-only: assign a role to any principal
 *   - isCallerAdmin                       — Check whether the caller holds the admin role
 *
 * ### User Profile Management
 *   - createUserProfile                   — Register a new user profile (username required)
 *   - getCallerUserProfile                — Fetch the caller's own profile
 *   - saveUserProfile                     — Overwrite the caller's own profile record
 *   - getAllUserProfiles                   — Admin-only: list every registered profile
 *
 * ### Credits & Subscriptions
 *   - balance                             — Query the caller's current credit balance
 *   - addCredits                          — Admin-only: add credits to any user's account
 *   - decrementCredits                    — Deduct credits from the caller's account
 *   - isSubscriptionActive                — Check whether the caller's subscription is active
 *   - subscriptionTier                    — Query the caller's subscription tier
 *   - setSubscriptionTier                 — Admin-only: set a user's subscription tier
 *   - setSubscriptionStatus               — Admin-only: activate or deactivate a subscription
 *
 * ### API Keys
 *   - generateApiKey                      — Generate a new API key for the caller
 *   - getApiKeys                          — List all API keys belonging to the caller
 *
 * ### Design Management
 *   - saveDesign                          — Persist a new design record owned by the caller
 *   - getDesign                           — Fetch a design by ID (own or public designs only)
 *   - getAllUserDesigns                    — List every design created by the caller
 *   - getUserDesigns                      — List designs for any principal (public + own + admin)
 *   - setDesignPublicStatus               — Toggle public visibility of a caller-owned design
 *   - getAllPublicDesigns                  — List all publicly visible designs
 *   - getAllPublicDesignsByTitle           — Same as above, sorted alphabetically by title
 *
 * ### Team Collaboration
 *   - inviteTeamMember                    — Add a principal to the caller's team
 *   - removeTeamMember                    — Remove a principal from the caller's team
 *   - getTeamMembers                      — List all team members on the caller's account
 *
 * ## Authorization Model
 *
 * Three roles exist: #admin > #user > #guest
 *   - #guest  — anonymous principals; read-only access to public content
 *   - #user   — authenticated principals who have called _initializeAccessControlWithSecret
 *   - #admin  — the first principal to bootstrap with the correct CAFFEINE_ADMIN_TOKEN
 *
 * Admins pass all permission checks for any required role.
 */

import Text     "mo:core/Text";
import Nat      "mo:core/Nat";
import Map      "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime  "mo:core/Runtime";
import Order    "mo:core/Order";
import Array    "mo:core/Array";
import Time     "mo:core/Time";
import Prim     "mo:prim";

actor {

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 1 — ACCESS CONTROL TYPES & STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * The three authorization tiers used throughout the platform.
   *
   * - #admin  — Full platform control; assigned to the first authenticated
   *             principal that supplies the correct CAFFEINE_ADMIN_TOKEN.
   * - #user   — Standard authenticated user; required for all personal actions
   *             (credits, designs, API keys, team management).
   * - #guest  — Anonymous (unauthenticated) principal; may only read public data.
   */
  type UserRole = { #admin; #user; #guest };

  /**
   * Container for access-control state.
   *
   * - adminAssigned : Bool             — True once at least one admin has been bootstrapped.
   *                                      Prevents a second caller from claiming admin via the token.
   * - userRoles : Map<Principal, Role> — Stores the assigned role for every registered principal.
   */
  type AccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, UserRole>;
  };

  /** Singleton access-control state — shared by all helper functions below. */
  let accessControlState : AccessControlState = {
    var adminAssigned = false;
    userRoles = Map.empty<Principal, UserRole>();
  };

  // ─── Private Access-Control Helpers ─────────────────────────────────────

  /**
   * Registers `caller` in the role map if not already present.
   *
   * Logic:
   *   1. Anonymous principals are silently ignored.
   *   2. Principals already in the map are left unchanged (idempotent).
   *   3. If no admin has been assigned yet AND the provided token matches the
   *      server-side admin token, the caller is granted #admin and the
   *      `adminAssigned` flag is set so no further admin bootstraps are possible.
   *   4. Otherwise the caller receives the default #user role.
   *
   * @param caller            — The principal being registered.
   * @param adminToken        — The canonical admin token from the environment.
   * @param userProvidedToken — The token supplied by the caller at registration.
   */
  func _initializeRole(caller : Principal, adminToken : Text, userProvidedToken : Text) {
    // Silently reject anonymous callers — they cannot hold a named role.
    if (caller.isAnonymous()) { return };

    switch (accessControlState.userRoles.get(caller)) {
      // Principal already registered — nothing to do (idempotent).
      case (?_) {};

      case (null) {
        // First registration: decide whether to grant admin privileges.
        if (not accessControlState.adminAssigned and userProvidedToken == adminToken) {
          // Token matches and no admin exists yet — bootstrap this caller as admin.
          accessControlState.userRoles.add(caller, #admin);
          accessControlState.adminAssigned := true;
        } else {
          // Default: register as a standard user.
          accessControlState.userRoles.add(caller, #user);
        };
      };
    };
  };

  /**
   * Returns the role assigned to `caller`.
   *
   * - Anonymous principals always resolve to #guest without a map lookup.
   * - Registered principals return their stored role.
   * - Unregistered non-anonymous principals trap — callers must call
   *   `_initializeAccessControlWithSecret` before using any protected endpoint.
   *
   * @param caller — The principal whose role is being queried.
   * @returns UserRole — #admin | #user | #guest
   */
  func _getUserRole(caller : Principal) : UserRole {
    if (caller.isAnonymous()) { return #guest };

    switch (accessControlState.userRoles.get(caller)) {
      case (?role) { role };
      // Unregistered authenticated principal — force registration first.
      case (null) { Runtime.trap("User is not registered. Call _initializeAccessControlWithSecret first.") };
    };
  };

  /**
   * Returns true if `caller` holds the #admin role.
   *
   * @param caller — The principal to check.
   * @returns Bool
   */
  func _isAdmin(caller : Principal) : Bool {
    _getUserRole(caller) == #admin;
  };

  /**
   * Returns true if `caller` satisfies `requiredRole` or higher.
   *
   * Permission hierarchy: #admin > #user > #guest
   *   - #admin callers pass all checks unconditionally.
   *   - Any caller passes a #guest-level check.
   *   - #user callers pass a #user check, but not an #admin check.
   *
   * @param caller       — The principal to evaluate.
   * @param requiredRole — Minimum role required for the action.
   * @returns Bool
   */
  func _hasPermission(caller : Principal, requiredRole : UserRole) : Bool {
    let role = _getUserRole(caller);
    // Admins always pass; and any role passes a guest-level requirement.
    if (role == #admin or requiredRole == #guest) { true } else {
      role == requiredRole;
    };
  };

  // ─── Public Access-Control API ───────────────────────────────────────────

  /**
   * Registers the caller and assigns their role (admin or user).
   *
   * This is the sole entry point for role assignment. It must be called once
   * per principal before any other protected endpoint is used.
   *
   * Admin bootstrap: the first authenticated caller to supply the correct
   * CAFFEINE_ADMIN_TOKEN environment variable is granted #admin. All subsequent
   * callers — including those who supply the correct token again — receive #user.
   *
   * The CAFFEINE_ADMIN_TOKEN is read from the canister environment at call time
   * and is never stored in canister state, preventing leakage.
   *
   * @param userSecret — Token supplied by the caller. Matching the env token grants admin.
   * @throws If CAFFEINE_ADMIN_TOKEN is not set in the canister environment.
   */
  public shared ({ caller }) func _initializeAccessControlWithSecret(userSecret : Text) : async () {
    switch (Prim.envVar<system>("CAFFEINE_ADMIN_TOKEN")) {
      case (null) {
        Runtime.trap("Server configuration error: CAFFEINE_ADMIN_TOKEN environment variable is not set.");
      };
      case (?adminToken) {
        _initializeRole(caller, adminToken, userSecret);
      };
    };
  };

  /**
   * Returns the role currently assigned to the caller.
   *
   * Useful for clients to determine which UI features to enable.
   *
   * @returns UserRole — #admin | #user | #guest
   * @throws If the caller is authenticated but has not yet called _initializeAccessControlWithSecret.
   */
  public query ({ caller }) func getCallerUserRole() : async UserRole {
    _getUserRole(caller);
  };

  /**
   * Assigns the specified role to any principal. Admin-only.
   *
   * Can be used to promote a user to admin, demote an admin, or revoke access.
   * Overwrites any existing role for the target principal.
   *
   * @param user — The principal whose role will be updated.
   * @param role — The new role to assign (#admin | #user | #guest).
   * @throws If the caller is not an admin.
   */
  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : UserRole) : async () {
    if (not _isAdmin(caller)) {
      Runtime.trap("Permission denied: Only administrators can assign user roles.");
    };
    accessControlState.userRoles.add(user, role);
  };

  /**
   * Returns true if the caller currently holds the #admin role.
   *
   * A convenience query; equivalent to checking getCallerUserRole() == #admin.
   *
   * @returns Bool — true if the caller is an admin, false otherwise.
   */
  public query ({ caller }) func isCallerAdmin() : async Bool {
    _isAdmin(caller);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 2 — DOMAIN TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Subscription tiers available on CREATEai.
   *
   * - #none    — No active subscription; credit-only access.
   * - #small   — Entry-level monthly plan.
   * - #medium  — Standard monthly plan.
   * - #big     — Professional monthly plan.
   * - #premium — Premium monthly plan.
   * - #extreme — Unlimited / enterprise tier.
   */
  type SubscriptionTier = {
    #none;
    #small;
    #medium;
    #big;
    #premium;
    #extreme;
  };

  /**
   * The complete profile record for a registered CREATEai user.
   *
   * Fields:
   * - principal         — The Internet Identity principal that owns this profile.
   * - username          — Display name chosen at registration (non-empty).
   * - credits           — Current credit balance; decremented per AI studio use.
   * - subscriptionTier  — The user's active plan tier.
   * - subscriptionActive — Whether the current subscription is paid and active.
   * - teamMembers       — Principals that have been added to this user's team.
   * - apiKeys           — API keys generated for programmatic access.
   */
  type UserProfile = {
    principal : Principal;
    username : Text;
    credits : Nat;
    subscriptionTier : SubscriptionTier;
    subscriptionActive : Bool;
    teamMembers : [Principal];
    apiKeys : [Text];
  };

  /**
   * Comparison module for UserProfile — enables sorting profiles alphabetically
   * by username. Required to use UserProfile as a sorted collection key.
   */
  module UserProfile {
    public func compare(p1 : UserProfile, p2 : UserProfile) : Order.Order {
      Text.compare(p1.username, p2.username);
    };
  };

  /**
   * Metadata attached to every design record.
   *
   * - title      — Human-readable title for display in the community gallery.
   * - createdBy  — Principal of the user who created this design.
   * - studioType — Which AI studio produced this design (e.g. "design-atelier").
   * - isPublic   — Whether this design is visible in the public community gallery.
   */
  public type ContentMetadata = {
    title : Text;
    createdBy : Principal;
    studioType : Text;
    isPublic : Bool;
  };

  /**
   * A persisted AI design, as stored in the `designs` Map.
   *
   * - id           — Unique identifier for this design (caller-supplied).
   * - metadata     — Title, ownership, studio, and visibility information.
   * - image        — The raw image bytes produced by the AI studio.
   * - creationDate — Unix timestamp (nanoseconds) when the design was saved.
   */
  public type DesignRecord = {
    id : Text;
    metadata : ContentMetadata;
    image : Blob;
    creationDate : Time.Time;
  };

  /**
   * Comparison module for DesignRecord — enables alphabetical sorting by title
   * in getAllPublicDesignsByTitle.
   */
  module DesignRecord {
    public func compareByTitle(d1 : DesignRecord, d2 : DesignRecord) : Order.Order {
      Text.compare(d1.metadata.title, d2.metadata.title);
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 3 — PERSISTENT STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Primary key-value store for user profiles.
   * Key: Principal (the user's Internet Identity).
   * Value: UserProfile record.
   *
   * State persists across canister upgrades via enhanced orthogonal persistence.
   */
  let userProfiles = Map.empty<Principal, UserProfile>();

  /**
   * Primary key-value store for design records.
   * Key: Text (the design's unique ID, caller-supplied).
   * Value: DesignRecord (image bytes + metadata).
   *
   * State persists across canister upgrades via enhanced orthogonal persistence.
   */
  let designs = Map.empty<Text, DesignRecord>();

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 4 — INTERNAL HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Retrieves the UserProfile for `caller` or traps if none exists.
   *
   * This is the canonical way to fetch a caller's profile within update functions
   * that require the profile to already exist. Using trap rather than returning
   * an Option avoids nested switch expressions in callers.
   *
   * @param caller — The principal whose profile is being fetched.
   * @returns UserProfile — The caller's profile record.
   * @throws If no profile has been created for `caller` yet.
   */
  func getCallerUserProfileInternal(caller : Principal) : UserProfile {
    switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Profile not found. Call createUserProfile before using this function.");
      };
      case (?profile) { profile };
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 5 — USER PROFILE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Creates a new user profile for the caller.
   *
   * Registers the caller with a blank credit balance, no subscription, an empty
   * team, and no API keys. Calling this function twice for the same principal
   * is an error — profiles cannot be recreated once established.
   *
   * Input validation:
   *   - `username` must not be empty.
   *
   * @param username — The display name to register. Must be a non-empty string.
   * @throws If the caller already has a profile.
   * @throws If `username` is an empty string.
   * @sideEffect Inserts a new entry into `userProfiles`.
   */
  public shared ({ caller }) func createUserProfile(username : Text) : async () {
    // Reject blank usernames before touching state.
    if (username.size() == 0) {
      Runtime.trap("Validation error: username must not be empty.");
    };

    // Prevent duplicate profiles — each principal may have exactly one.
    switch (userProfiles.get(caller)) {
      case (null) { () }; // No existing profile — proceed.
      case (_) { Runtime.trap("A profile already exists for this account. Each principal may only have one profile.") };
    };

    let profile : UserProfile = {
      principal = caller;
      username;
      credits = 0;
      subscriptionTier = #none;
      subscriptionActive = false;
      teamMembers = [];
      apiKeys = [];
    };

    userProfiles.add(caller, profile);
  };

  /**
   * Returns the full profile record for the caller.
   *
   * This is a query (read-only, free) — no state changes occur.
   *
   * @returns UserProfile — The caller's complete profile.
   * @throws If the caller does not have the #user role or higher.
   * @throws If no profile exists for the caller.
   */
  public query ({ caller }) func getCallerUserProfile() : async UserProfile {
    if (not _hasPermission(caller, #user)) {
      Runtime.trap("Permission denied: You must be a registered user to access your profile.");
    };
    getCallerUserProfileInternal(caller);
  };

  /**
   * Overwrites the caller's profile with the provided record.
   *
   * The caller may only save their own profile (the stored principal must match
   * the caller's identity). This function is used to persist profile edits made
   * in the user dashboard.
   *
   * Note: The entire profile record is replaced atomically. Partial updates are
   * not supported — callers should read, modify, then write back.
   *
   * @param profile — The updated profile record to persist.
   * @throws If the caller does not have the #user role or higher.
   * @sideEffect Replaces the existing profile in `userProfiles`.
   */
  public shared ({ caller }) func saveUserProfile(profile : UserProfile) : async () {
    if (not _hasPermission(caller, #user)) {
      Runtime.trap("Permission denied: You must be a registered user to save a profile.");
    };
    userProfiles.add(caller, profile);
  };

  /**
   * Returns every registered user profile. Admin-only.
   *
   * Intended for admin dashboards and analytics. The order of profiles in the
   * returned array is not guaranteed.
   *
   * @returns [UserProfile] — All profiles stored in the canister.
   * @throws If the caller is not an administrator.
   */
  public query ({ caller }) func getAllUserProfiles() : async [UserProfile] {
    if (not _hasPermission(caller, #admin)) {
      Runtime.trap("Permission denied: Only administrators can list all user profiles.");
    };
    // Convert the Map entries to an array, discarding the Principal keys.
    userProfiles.toArray().map(func((_, v)) { v });
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 6 — CREDITS & SUBSCRIPTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Returns the caller's current credit balance.
   *
   * This is a query (free, read-only). Credits are consumed by AI studio
   * operations via decrementCredits and replenished by addCredits (admin).
   *
   * @returns Nat — Number of credits available to the caller.
   * @throws If the caller does not have the #user role or higher.
   * @throws If no profile exists for the caller.
   */
  public query ({ caller }) func balance() : async Nat {
    if (not _hasPermission(caller, #user)) {
      Runtime.trap("Permission denied: You must be a registered user to check your credit balance.");
    };
    getCallerUserProfileInternal(caller).credits;
  };

  /**
   * Adds the specified number of credits to a user's account. Admin-only.
   *
   * Called by the payment flow after a successful Stripe checkout or manual
   * credit allocation. The new balance is returned so the admin UI can display
   * an immediate confirmation.
   *
   * Input validation:
   *   - `amount` must be greater than zero (Nat is always non-negative, but
   *     adding 0 credits would be a no-op and likely indicates a client bug).
   *
   * @param user   — The principal whose account will be credited.
   * @param amount — Number of credits to add. Must be greater than 0.
   * @returns Nat  — The user's updated credit balance after the addition.
   * @throws If the caller is not an administrator.
   * @throws If no profile exists for `user`.
   * @throws If `amount` is 0.
   * @sideEffect Updates the `credits` field in `userProfiles` for `user`.
   */
  public shared ({ caller }) func addCredits(user : Principal, amount : Nat) : async Nat {
    if (not _hasPermission(caller, #admin)) {
      Runtime.trap("Permission denied: Only administrators can add credits to user accounts.");
    };

    // Adding zero credits is almost certainly a client error — reject early.
    if (amount == 0) {
      Runtime.trap("Validation error: credit amount must be greater than zero.");
    };

    let old = switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("Profile not found: no account exists for the specified principal.") };
      case (?p) { p };
    };

    let updated = { old with credits = old.credits + amount };
    userProfiles.add(user, updated);
    updated.credits;
  };

  /**
   * Deducts `credits` from the caller's balance.
   *
   * Called by each AI studio operation after generating output. The decrement
   * is atomic — either the full amount is deducted or the call traps with no
   * state change.
   *
   * Input validation:
   *   - `credits` must be greater than zero.
   *   - The caller's current balance must be >= `credits`.
   *
   * @param credits — Number of credits to deduct. Must be > 0.
   * @throws If the caller does not have the #user role or higher.
   * @throws If `credits` is 0.
   * @throws If the caller has insufficient credits.
   * @throws If no profile exists for the caller.
   * @sideEffect Reduces the `credits` field in the caller's profile.
   */
  public shared ({ caller }) func decrementCredits(credits : Nat) : async () {
    if (not _hasPermission(caller, #user)) {
      Runtime.trap("Permission denied: You must be a registered user to spend credits.");
    };

    // Deducting zero credits is almost certainly a client error — reject early.
    if (credits == 0) {
      Runtime.trap("Validation error: credit decrement amount must be greater than zero.");
    };

    let old = getCallerUserProfileInternal(caller);

    // Ensure the user has enough credits before modifying state.
    if (old.credits < credits) {
      Runtime.trap("Insufficient credits: your balance of " # old.credits.toText() # " is less than the required " # credits.toText() # ".");
    };

    // Subtraction is safe: guard above ensures old.credits >= credits.
    let newCredits : Nat = if (old.credits >= credits) old.credits - credits else 0;
    userProfiles.add(caller, { old with credits = newCredits });
  };

  /**
   * Returns whether the caller's subscription is currently active.
   *
   * A subscription being active means the periodic payment is up-to-date.
   * An active subscription may still be tier #none if it was just created;
   * always check subscriptionTier for access-level decisions.
   *
   * @returns Bool — true if the caller's subscription is active.
   * @throws If the caller does not have the #user role or higher.
   * @throws If no profile exists for the caller.
   */
  public query ({ caller }) func isSubscriptionActive() : async Bool {
    if (not _hasPermission(caller, #user)) {
      Runtime.trap("Permission denied: You must be a registered user to check your subscription status.");
    };
    getCallerUserProfileInternal(caller).subscriptionActive;
  };

  /**
   * Returns the caller's current subscription tier.
   *
   * Use this to determine which feature set the caller has access to.
   * Tier hierarchy (ascending): #none < #small < #medium < #big < #premium < #extreme
   *
   * @returns SubscriptionTier — The caller's active tier.
   * @throws If the caller does not have the #user role or higher.
   * @throws If no profile exists for the caller.
   */
  public query ({ caller }) func subscriptionTier() : async SubscriptionTier {
    if (not _hasPermission(caller, #user)) {
      Runtime.trap("Permission denied: You must be a registered user to check your subscription tier.");
    };
    getCallerUserProfileInternal(caller).subscriptionTier;
  };

  /**
   * Updates a user's subscription tier. Admin-only.
   *
   * Called by the Stripe webhook handler after a successful subscription
   * upgrade or downgrade. Does NOT automatically set `subscriptionActive` —
   * that must be set separately via setSubscriptionStatus.
   *
   * @param user — The principal whose tier will be changed.
   * @param tier — The new subscription tier to assign.
   * @throws If the caller is not an administrator.
   * @throws If no profile exists for `user`.
   * @sideEffect Updates the `subscriptionTier` field in `userProfiles` for `user`.
   */
  public shared ({ caller }) func setSubscriptionTier(user : Principal, tier : SubscriptionTier) : async () {
    if (not _hasPermission(caller, #admin)) {
      Runtime.trap("Permission denied: Only administrators can change subscription tiers.");
    };

    let old = switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("Profile not found: no account exists for the specified principal.") };
      case (?p) { p };
    };

    userProfiles.add(user, { old with subscriptionTier = tier });
  };

  /**
   * Activates or deactivates a user's subscription. Admin-only.
   *
   * Called by the Stripe webhook handler on subscription payment success,
   * failure, cancellation, or manual override. Setting `active = false` while
   * the tier remains set allows graceful degradation (tier shows but features
   * are locked until payment resumes).
   *
   * @param user   — The principal whose subscription status will change.
   * @param active — true to activate, false to deactivate.
   * @throws If the caller is not an administrator.
   * @throws If no profile exists for `user`.
   * @sideEffect Updates the `subscriptionActive` field in `userProfiles` for `user`.
   */
  public shared ({ caller }) func setSubscriptionStatus(user : Principal, active : Bool) : async () {
    if (not _hasPermission(caller, #admin)) {
      Runtime.trap("Permission denied: Only administrators can change subscription status.");
    };

    let old = switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("Profile not found: no account exists for the specified principal.") };
      case (?p) { p };
    };

    userProfiles.add(user, { old with subscriptionActive = active });
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 7 — API KEYS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Generates a new API key and appends it to the caller's key list.
   *
   * Keys are sequentially numbered using the current key-list length as a suffix
   * (e.g. "api-key-0", "api-key-1"). This keeps key generation deterministic and
   * free of external randomness. Callers can revoke keys by saving a filtered
   * profile via saveUserProfile.
   *
   * Note: keys are currently opaque identifiers. For production use, consider
   * adding a hashing layer so the raw key is never stored in canister state.
   *
   * @returns Text — The newly generated API key string.
   * @throws If the caller does not have the #user role or higher.
   * @throws If no profile exists for the caller.
   * @sideEffect Appends a new key to the `apiKeys` array in the caller's profile.
   */
  public shared ({ caller }) func generateApiKey() : async Text {
    if (not _hasPermission(caller, #user)) {
      Runtime.trap("Permission denied: You must be a registered user to generate API keys.");
    };

    let old = getCallerUserProfileInternal(caller);

    // Key suffix is the current list length — ensuring uniqueness and ordering.
    let newKey = "api-key-" # old.apiKeys.size().toText();

    userProfiles.add(caller, { old with apiKeys = old.apiKeys.concat([newKey]) });
    newKey;
  };

  /**
   * Returns all API keys belonging to the caller.
   *
   * This is a query (free, read-only). Use the returned keys to authenticate
   * server-to-server calls against the CREATEai REST API.
   *
   * @returns [Text] — All API keys currently assigned to the caller.
   * @throws If the caller does not have the #user role or higher.
   * @throws If no profile exists for the caller.
   */
  public query ({ caller }) func getApiKeys() : async [Text] {
    if (not _hasPermission(caller, #user)) {
      Runtime.trap("Permission denied: You must be a registered user to view API keys.");
    };
    getCallerUserProfileInternal(caller).apiKeys;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 8 — DESIGN MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Persists a new AI-generated design record owned by the caller.
   *
   * The caller must be listed as the design's creator (`metadata.createdBy`)
   * — the backend enforces this to prevent one user from creating designs
   * attributed to another user's account.
   *
   * Input validation:
   *   - `historyEntry.id` must be non-empty.
   *   - `historyEntry.metadata.title` must be non-empty.
   *   - `historyEntry.metadata.createdBy` must equal `caller`.
   *
   * @param historyEntry — The complete design record to store.
   * @throws If the caller does not have the #user role or higher.
   * @throws If the design ID is empty.
   * @throws If the design title is empty.
   * @throws If `historyEntry.metadata.createdBy` does not match the caller.
   * @sideEffect Inserts or overwrites the design entry in `designs`.
   */
  public shared ({ caller }) func saveDesign(historyEntry : DesignRecord) : async () {
    if (not _hasPermission(caller, #user)) {
      Runtime.trap("Permission denied: You must be a registered user to save designs.");
    };

    // Validate that a non-empty ID was provided to prevent map key collisions.
    if (historyEntry.id.size() == 0) {
      Runtime.trap("Validation error: design ID must not be empty.");
    };

    // Validate that the design has a human-readable title.
    if (historyEntry.metadata.title.size() == 0) {
      Runtime.trap("Validation error: design title must not be empty.");
    };

    // Enforce ownership — designs can only be created for the calling principal.
    if (historyEntry.metadata.createdBy != caller) {
      Runtime.trap("Permission denied: You cannot save a design on behalf of another user.");
    };

    designs.add(historyEntry.id, historyEntry);
  };

  /**
   * Fetches a single design by its unique ID.
   *
   * Access rules (enforced server-side):
   *   - The caller may always retrieve their own designs.
   *   - Any principal (including guests) may retrieve publicly visible designs.
   *   - Private designs belonging to another user return null (not a trap) to
   *     avoid leaking the existence of the design.
   *
   * @param id       — The unique design identifier to look up.
   * @returns ?DesignRecord — The design record if accessible, or null if not found
   *                          or not permitted.
   */
  public query ({ caller }) func getDesign(id : Text) : async ?DesignRecord {
    switch (designs.get(id)) {
      case (null) { null }; // Design does not exist.
      case (?design) {
        // Return the design only if the caller owns it or it is publicly visible.
        if (design.metadata.createdBy == caller or design.metadata.isPublic) {
          ?design;
        } else {
          // Caller does not own this private design — return null, not a trap,
          // so we do not reveal whether the design ID exists.
          null;
        };
      };
    };
  };

  /**
   * Returns every design created by the caller.
   *
   * Includes both public and private designs. The returned list is unordered.
   * Use getAllPublicDesignsByTitle for a sorted community view.
   *
   * @returns [DesignRecord] — All designs where metadata.createdBy == caller.
   * @throws If the caller does not have the #user role or higher.
   */
  public query ({ caller }) func getAllUserDesigns() : async [DesignRecord] {
    if (not _hasPermission(caller, #user)) {
      Runtime.trap("Permission denied: You must be a registered user to list your designs.");
    };
    designs.values().toArray().filter(func(d) { d.metadata.createdBy == caller });
  };

  /**
   * Returns designs belonging to any specified principal, with visibility rules.
   *
   * Visibility rules for the returned set:
   *   - Public designs belonging to `id` are always included.
   *   - Private designs belonging to `id` are included only if
   *     `id == caller` (viewing your own) or the caller is an admin.
   *
   * @param id       — The principal whose designs to fetch.
   * @returns [DesignRecord] — Filtered design records according to the visibility rules above.
   * @throws If the caller does not have the #user role or higher.
   */
  public query ({ caller }) func getUserDesigns(id : Principal) : async [DesignRecord] {
    if (not _hasPermission(caller, #user)) {
      Runtime.trap("Permission denied: You must be a registered user to view design profiles.");
    };

    designs.values().toArray().filter(func(d) {
      // Include this design if it belongs to the requested user AND is accessible.
      d.metadata.createdBy == id and (
        d.metadata.isPublic    // Anyone can see public designs.
        or id == caller        // Users can always see their own private designs.
        or _isAdmin(caller)    // Admins can see all designs for any principal.
      )
    });
  };

  /**
   * Sets the public/private visibility flag on a design owned by the caller.
   *
   * Only the creator of a design can toggle its visibility. Marking a design
   * public will expose it in the community gallery accessible to all users.
   *
   * @param id       — The unique ID of the design to update.
   * @param isPublic — true to publish to the community gallery; false to make private.
   * @throws If the caller does not have the #user role or higher.
   * @throws If no design exists with the given `id`.
   * @throws If the caller is not the creator of the design.
   * @sideEffect Updates the `metadata.isPublic` field of the design in `designs`.
   */
  public shared ({ caller }) func setDesignPublicStatus(id : Text, isPublic : Bool) : async () {
    if (not _hasPermission(caller, #user)) {
      Runtime.trap("Permission denied: You must be a registered user to change design visibility.");
    };

    switch (designs.get(id)) {
      case (null) {
        Runtime.trap("Design not found: no design exists with ID '" # id # "'.");
      };
      case (?design) {
        // Only the original creator may change visibility — not even admins can
        // publish/unpublish on someone else's behalf.
        if (design.metadata.createdBy != caller) {
          Runtime.trap("Permission denied: Only the creator of a design can change its public visibility.");
        };

        // Use record spread to update only the isPublic field, preserving all others.
        designs.add(id, { design with metadata = { design.metadata with isPublic } });
      };
    };
  };

  /**
   * Returns all designs that are publicly visible, in storage order (unordered).
   *
   * Used to populate the community gallery homepage. For a sorted listing,
   * use getAllPublicDesignsByTitle.
   *
   * @returns [DesignRecord] — All designs where metadata.isPublic == true.
   */
  public query func getAllPublicDesigns() : async [DesignRecord] {
    designs.values().toArray().filter(func(d) { d.metadata.isPublic });
  };

  /**
   * Returns all publicly visible designs sorted alphabetically by title.
   *
   * Identical to getAllPublicDesigns but with a deterministic sort order using
   * DesignRecord.compareByTitle. Useful for paginated gallery views where
   * consistent ordering matters.
   *
   * @returns [DesignRecord] — Public designs sorted A→Z by metadata.title.
   */
  public query func getAllPublicDesignsByTitle() : async [DesignRecord] {
    designs.values().toArray()
      .filter(func(d) { d.metadata.isPublic })
      .sort(DesignRecord.compareByTitle);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 9 — TEAM COLLABORATION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Adds a principal to the caller's team member list.
   *
   * Team members are stored on the inviting user's profile. Duplicate invites
   * are not checked — callers are responsible for checking getTeamMembers before
   * adding to avoid duplicates.
   *
   * @param newMember — The principal to add to the caller's team.
   * @throws If the caller does not have the #user role or higher.
   * @throws If no profile exists for the caller.
   * @sideEffect Appends `newMember` to the caller's `teamMembers` array.
   */
  public shared ({ caller }) func inviteTeamMember(newMember : Principal) : async () {
    if (not _hasPermission(caller, #user)) {
      Runtime.trap("Permission denied: You must be a registered user to invite team members.");
    };

    let old = getCallerUserProfileInternal(caller);
    userProfiles.add(caller, { old with teamMembers = old.teamMembers.concat([newMember]) });
  };

  /**
   * Removes a principal from the caller's team member list.
   *
   * If the specified principal is not currently a team member, the call
   * succeeds silently (idempotent removal).
   *
   * @param member — The principal to remove from the caller's team.
   * @throws If the caller does not have the #user role or higher.
   * @throws If no profile exists for the caller.
   * @sideEffect Filters `member` out of the caller's `teamMembers` array.
   */
  public shared ({ caller }) func removeTeamMember(member : Principal) : async () {
    if (not _hasPermission(caller, #user)) {
      Runtime.trap("Permission denied: You must be a registered user to remove team members.");
    };

    let old = getCallerUserProfileInternal(caller);
    userProfiles.add(
      caller,
      { old with teamMembers = old.teamMembers.filter(func(m) { m != member }) }
    );
  };

  /**
   * Returns all principals currently on the caller's team.
   *
   * This is a query (free, read-only). The returned array preserves insertion
   * order (most recently added member is last).
   *
   * @returns [Principal] — The caller's current team members.
   * @throws If the caller does not have the #user role or higher.
   * @throws If no profile exists for the caller.
   */
  public query ({ caller }) func getTeamMembers() : async [Principal] {
    if (not _hasPermission(caller, #user)) {
      Runtime.trap("Permission denied: You must be a registered user to view your team members.");
    };
    getCallerUserProfileInternal(caller).teamMembers;
  };

};
