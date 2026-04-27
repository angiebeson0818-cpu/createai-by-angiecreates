/**
 * @file hooks/useQueries.ts
 * @description All React Query hooks for CREATEai by angieCREATEs.
 *
 * Architecture:
 *  - useBackendActor()   — creates the typed backend actor via the platform's
 *                          useActor() helper, which automatically wires the
 *                          authenticated Internet Identity when available.
 *  - QUERY_KEYS          — single source of truth for all query key strings,
 *                          used consistently in queries AND cache invalidations.
 *  - Query hooks         — useQuery wrappers for all read operations.
 *  - Mutation hooks      — useMutation wrappers for all write operations.
 *
 * Auth pattern:
 *  - Public queries (getAllPublicDesigns, getAllPublicDesignsByTitle) are always
 *    enabled — they use an anonymous actor and require no login.
 *  - Auth-gated queries are only enabled once the actor is ready AND not
 *    currently fetching (i.e., the identity has settled).
 *
 * Error handling:
 *  - getErrorMessage() safely converts unknown thrown values to strings.
 *  - All queries use retry: 2 so transient IC replica hiccups are retried.
 */

import { useActor } from "@caffeineai/core-infrastructure";
import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";

// Re-export backend types so consumers can import from a single source.
export type {
  DesignRecord,
  ContentMetadata,
  UserProfile,
  SubscriptionTier,
  UserRole,
} from "../backend";

// ── Canister actor ────────────────────────────────────────────────────────

/**
 * Returns the typed backend actor and a loading flag.
 *
 * Internally calls the platform-provided useActor() which:
 *  1. Creates an anonymous actor when no identity is present.
 *  2. Re-creates an authenticated actor after a successful II login.
 *  3. Invalidates all dependent queries when the identity changes.
 *
 * @returns {{ actor: Backend | null, isFetching: boolean }}
 */
export function useBackendActor() {
  return useActor(createActor);
}

// ── Query key constants ───────────────────────────────────────────────────

/**
 * Centralised query key registry.
 * Always use these constants — never inline string literals —
 * so that invalidations in mutations are guaranteed to match.
 */
export const QUERY_KEYS = {
  userProfile: "userProfile",
  balance: "balance",
  subscriptionTier: "subscriptionTier",
  subscriptionActive: "subscriptionActive",
  userDesigns: "userDesigns",
  publicDesigns: "publicDesigns",
  publicDesignsByTitle: "publicDesignsByTitle",
  apiKeys: "apiKeys",
  teamMembers: "teamMembers",
  isAdmin: "isAdmin",
} as const;

// ── Error helper ──────────────────────────────────────────────────────────

/**
 * Safely extracts a human-readable message from an unknown thrown value.
 * Useful in mutation onError callbacks and toast messages.
 *
 * @param error - Any value caught in a catch block.
 * @returns A non-empty string describing the error.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return "An unexpected error occurred";
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Query Hooks
// ─────────────────────────────────────────────────────────────────────────

/**
 * Fetches the authenticated caller's full user profile.
 *
 * Enabled only when the actor is ready and not loading (i.e., the user
 * is logged in and the identity has been resolved).
 *
 * @example
 *   const { data: profile, isLoading } = useUserProfile();
 *   console.log(profile?.username);
 */
export function useUserProfile() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: [QUERY_KEYS.userProfile],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCallerUserProfile();
      } catch {
        // Profile not found means the user hasn't created one yet.
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    retry: 2,
  });
}

/**
 * Fetches the caller's current credit balance (as bigint).
 *
 * Enabled only for authenticated users.
 *
 * @example
 *   const { data: balance } = useBalance();
 *   // balance is a bigint or undefined while loading
 */
export function useBalance() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<bigint>({
    queryKey: [QUERY_KEYS.balance],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.balance();
    },
    enabled: !!actor && !isFetching,
    retry: 2,
  });
}

/**
 * Fetches the caller's active subscription tier.
 *
 * Returns one of the SubscriptionTier enum values:
 * 'none' | 'small' | 'medium' | 'big' | 'premium' | 'extreme'
 *
 * Enabled only for authenticated users.
 */
export function useSubscriptionTier() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: [QUERY_KEYS.subscriptionTier],
    queryFn: async () => {
      if (!actor) return null;
      return actor.subscriptionTier();
    },
    enabled: !!actor && !isFetching,
    retry: 2,
  });
}

/**
 * Checks whether the caller's subscription is currently active.
 *
 * Returns a boolean. Enabled only for authenticated users.
 */
export function useIsSubscriptionActive() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<boolean>({
    queryKey: [QUERY_KEYS.subscriptionActive],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isSubscriptionActive();
    },
    enabled: !!actor && !isFetching,
    retry: 2,
  });
}

/**
 * Fetches all design records saved by the authenticated caller.
 *
 * Returns an array of DesignRecord objects. Returns an empty array
 * while loading or unauthenticated. Enabled only for authenticated users.
 *
 * @example
 *   const { data: designs = [], isLoading } = useAllUserDesigns();
 */
export function useAllUserDesigns() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: [QUERY_KEYS.userDesigns],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUserDesigns();
    },
    enabled: !!actor && !isFetching,
    retry: 2,
  });
}

/**
 * Fetches all publicly visible designs across the entire platform.
 *
 * This is a PUBLIC query — no authentication required.
 * Always enabled so the community gallery loads for all visitors.
 *
 * @example
 *   const { data: designs = [] } = useAllPublicDesigns();
 */
export function useAllPublicDesigns() {
  const { actor } = useBackendActor();
  return useQuery({
    queryKey: [QUERY_KEYS.publicDesigns],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPublicDesigns();
    },
    // Always enabled — anonymous actor is sufficient.
    enabled: !!actor,
    retry: 2,
  });
}

/**
 * Fetches all public designs, ordered/filtered by title.
 *
 * This is a PUBLIC query — no authentication required.
 * The `title` parameter is included in the query key so results are
 * cached per search term.
 *
 * Note: The backend's getAllPublicDesignsByTitle() currently takes no
 * arguments (returns all public designs sorted by title). The title
 * parameter is reserved for future backend filtering support.
 *
 * @param title - Optional search/filter string (used as cache key).
 */
export function usePublicDesignsByTitle(title?: string) {
  const { actor } = useBackendActor();
  return useQuery({
    queryKey: [QUERY_KEYS.publicDesignsByTitle, title ?? ""],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPublicDesignsByTitle();
    },
    // Always enabled — anonymous actor is sufficient.
    enabled: !!actor,
    retry: 2,
  });
}

/**
 * Fetches the authenticated caller's list of active API keys.
 *
 * Returns string[] of opaque API key tokens.
 * Enabled only for authenticated users.
 *
 * @example
 *   const { data: apiKeys = [] } = useApiKeys();
 */
export function useApiKeys() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<string[]>({
    queryKey: [QUERY_KEYS.apiKeys],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApiKeys();
    },
    enabled: !!actor && !isFetching,
    retry: 2,
  });
}

/**
 * Fetches the Principal IDs of all team members in the caller's workspace.
 *
 * Returns Principal[]. Enabled only for authenticated users.
 *
 * @example
 *   const { data: members = [] } = useTeamMembers();
 */
export function useTeamMembers() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Principal[]>({
    queryKey: [QUERY_KEYS.teamMembers],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTeamMembers();
    },
    enabled: !!actor && !isFetching,
    retry: 2,
  });
}

/**
 * Checks whether the authenticated caller has admin role on the platform.
 *
 * Returns boolean. Enabled only for authenticated users.
 * Used to gate admin-only UI sections (e.g. addCredits, setSubscriptionTier).
 *
 * @example
 *   const { data: isAdmin } = useIsAdmin();
 *   if (isAdmin) { ... }
 */
export function useIsAdmin() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<boolean>({
    queryKey: [QUERY_KEYS.isAdmin],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    retry: 2,
  });
}

// ─────────────────────────────────────────────────────────────────────────
// Mutation Hooks
// ─────────────────────────────────────────────────────────────────────────

/**
 * Creates a new user profile for the authenticated caller.
 *
 * Should be called once, immediately after a first-time login when
 * useUserProfile() returns null.
 *
 * Invalidates: userProfile, balance (new account has starting credits).
 *
 * @example
 *   const createProfile = useCreateUserProfile();
 *   await createProfile.mutateAsync("MyCreatorName");
 */
export function useCreateUserProfile() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (username: string): Promise<void> => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createUserProfile(username);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userProfile] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] });
    },
  });
}

/**
 * Saves an updated user profile for the authenticated caller.
 *
 * Pass the full updated UserProfile object — the backend replaces
 * the existing record in full.
 *
 * Invalidates: userProfile.
 *
 * @example
 *   const saveProfile = useSaveUserProfile();
 *   await saveProfile.mutateAsync({ ...profile, username: "NewName" });
 */
export function useSaveUserProfile() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      profile: import("../backend").UserProfile,
    ): Promise<void> => {
      if (!actor) throw new Error("Not authenticated");
      return actor.saveUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userProfile] });
    },
  });
}

/**
 * Adds credits to a specified user's account.
 *
 * Admin-only operation. Pass the target user's Principal and the
 * bigint amount of credits to add.
 *
 * Invalidates: balance (for the current viewer).
 *
 * @example
 *   const addCredits = useAddCredits();
 *   await addCredits.mutateAsync({ user: targetPrincipal, amount: 500n });
 */
export function useAddCredits() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      user,
      amount,
    }: {
      user: Principal;
      amount: bigint;
    }): Promise<bigint> => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addCredits(user, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] });
    },
  });
}

/**
 * Generates a new API key for the authenticated caller.
 *
 * Returns the newly generated key string.
 * Invalidates: apiKeys so the new key appears in the list immediately.
 *
 * @example
 *   const generateKey = useGenerateApiKey();
 *   const newKey = await generateKey.mutateAsync();
 */
export function useGenerateApiKey() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<string> => {
      if (!actor) throw new Error("Not authenticated");
      return actor.generateApiKey();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.apiKeys] });
    },
  });
}

/**
 * Saves a new design record to the authenticated caller's history.
 *
 * Pass a complete DesignRecord (id, metadata, creationDate, image).
 * Invalidates: userDesigns and publicDesigns (in case the new design is public).
 *
 * @example
 *   const saveDesign = useSaveDesign();
 *   await saveDesign.mutateAsync({
 *     id: crypto.randomUUID(),
 *     metadata: { title: "Evening Gown", createdBy: principal, studioType: "design", isPublic: false },
 *     creationDate: BigInt(Date.now()) * 1_000_000n,
 *     image: imageBytes,
 *   });
 */
export function useSaveDesign() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      design: import("../backend").DesignRecord,
    ): Promise<void> => {
      if (!actor) throw new Error("Not authenticated");
      return actor.saveDesign(design);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userDesigns] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.publicDesigns] });
    },
  });
}

/**
 * Toggles the public/private visibility of an existing design.
 *
 * @param id       - The design's unique string ID.
 * @param isPublic - True to publish to the community gallery; false to hide.
 *
 * Invalidates: userDesigns and publicDesigns.
 *
 * @example
 *   const setStatus = useSetDesignPublicStatus();
 *   await setStatus.mutateAsync({ id: "abc-123", isPublic: true });
 */
export function useSetDesignPublicStatus() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      isPublic,
    }: {
      id: string;
      isPublic: boolean;
    }): Promise<void> => {
      if (!actor) throw new Error("Not authenticated");
      return actor.setDesignPublicStatus(id, isPublic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userDesigns] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.publicDesigns] });
    },
  });
}

/**
 * Sets the subscription tier for a specific user.
 *
 * Admin-only operation. Pass the target Principal and the desired tier.
 * Invalidates: subscriptionTier and subscriptionActive for the current viewer.
 *
 * @example
 *   const setTier = useSetSubscriptionTier();
 *   await setTier.mutateAsync({ user: principal, tier: SubscriptionTier.premium });
 */
export function useSetSubscriptionTier() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      user,
      tier,
    }: {
      user: Principal;
      tier: import("../backend").SubscriptionTier;
    }): Promise<void> => {
      if (!actor) throw new Error("Not authenticated");
      return actor.setSubscriptionTier(user, tier);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.subscriptionTier],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.subscriptionActive],
      });
    },
  });
}

/**
 * Invites a new team member to the authenticated caller's workspace.
 *
 * Pass the Principal of the user to invite.
 * Invalidates: teamMembers so the new member appears in the list.
 *
 * @example
 *   const invite = useInviteTeamMember();
 *   await invite.mutateAsync(memberPrincipal);
 */
export function useInviteTeamMember() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: Principal): Promise<void> => {
      if (!actor) throw new Error("Not authenticated");
      return actor.inviteTeamMember(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.teamMembers] });
    },
  });
}

/**
 * Removes a team member from the authenticated caller's workspace.
 *
 * Pass the Principal of the member to remove.
 * Invalidates: teamMembers so the removed member disappears immediately.
 *
 * @example
 *   const remove = useRemoveTeamMember();
 *   await remove.mutateAsync(memberPrincipal);
 */
export function useRemoveTeamMember() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: Principal): Promise<void> => {
      if (!actor) throw new Error("Not authenticated");
      return actor.removeTeamMember(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.teamMembers] });
    },
  });
}
