import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { IsBibleRouteParams, type BibleRouteParams } from "../../types/bible_route";
import { IS_OFFLINE_ERROR, REFETCH_ON_SETTLED } from "./common";

/**
 * Update the 'bookmarked' field of a user's profile in Supabase.
 */
async function updateProfileBookmarked(userId: string, bookmarked: BibleRouteParams | null) {
    const { error } = await supabase
        .from("profiles")
        .update({ bookmarked: bookmarked ?? null })
        .eq("user_id", userId);

    if (error) throw error;
    return bookmarked;
}

/**
 * React Query mutation hook for updating the 'bookmarked' field of the profile.
 */
export function useUpdateBookmarked(userId: string | undefined, onMutateError?: (prev: BibleRouteParams | null) => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newBookmarked: BibleRouteParams | null) => {
            if (!userId) throw new Error("User ID not available");
            return updateProfileBookmarked(userId, newBookmarked);
        },

        // Optimistic update
        onMutate: async (newBookmarked) => {
            console.log(newBookmarked, userId)
            if (!userId) return;

            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["profile", userId] });

            // Snapshot current value
            const previousProfile = queryClient.getQueryData<{ bookmarked?: BibleRouteParams | null }>([
                "profile",
                userId,
            ]);

            // Optimistically update cache
            queryClient.setQueryData(["profile", userId], (old: any) =>
                old ? { ...old, bookmarked: newBookmarked } : old
            );

            // Return rollback context
            return { previousProfile };
        },

        // Rollback on error
        onError: (error, _, context) => {
            if (IS_OFFLINE_ERROR(error))
            {
                return;
            }

            if (context?.previousProfile && userId) {
                queryClient.setQueryData(["profile", userId], context.previousProfile);
                onMutateError?.(IsBibleRouteParams(context.previousProfile.bookmarked) ? context.previousProfile.bookmarked : null);
            }
            else
            {
                onMutateError?.(null);
            }
        },

        // Always refetch after success or error
        onSettled: () => {
            if (userId && REFETCH_ON_SETTLED) {
                queryClient.invalidateQueries({ queryKey: ["profile", userId] });
            }
        }
    });
}
