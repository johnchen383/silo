// HistoryStateProvider.tsx
import React, { createContext, useContext } from "react";
import type { BibleRouteParams } from "../types/bible_route";
import { useUpdateLastChaptersViewed } from "../supabase/api/profile";
import { useAuth } from "./auth_provider";

interface HistoryStateContextType {
    lastChaptersViewed: BibleRouteParams[];
    setLastChapterViewed: (chapter: BibleRouteParams) => void;
}

const HistoryStateContext = createContext<HistoryStateContextType | undefined>(
    undefined
);

export function HistoryStateProvider({ children }: { children: React.ReactNode }) {
    const { profile } = useAuth();
    const lastChaptersViewed = (profile?.chapter_history as BibleRouteParams[]) ?? [];
    const chapter_history = useUpdateLastChaptersViewed(profile?.user_id);

    const setLastChapterViewed = (chapter: BibleRouteParams) => {
        const lastChapter = lastChaptersViewed[lastChaptersViewed.length - 1];
        if (lastChapter?.book === chapter.book && lastChapter?.chapter === chapter.chapter) {
            return; // Already the latest, no mutation needed
        }

        const filtered = lastChaptersViewed.filter(
            c => c.book !== chapter.book || c.chapter !== chapter.chapter
        );

        const updated = [...filtered, chapter].slice(-6);
        chapter_history.mutate(updated);
    };

    return (
        <HistoryStateContext.Provider value={{
            lastChaptersViewed,
            setLastChapterViewed,
        }}>
            {children}
        </HistoryStateContext.Provider>
    );
}

export function useHistoryProvider() {
    const context = useContext(HistoryStateContext);
    if (!context) {
        throw new Error("useHistoryProvider must be used within an HistoryStateProvider");
    }
    return context;
}
