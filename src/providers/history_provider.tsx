// HistoryStateProvider.tsx
import React, { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import type { BibleRouteParams } from "../types/bible_route";

interface HistoryStateContextType {
    lastChaptersViewed: BibleRouteParams[];
    setLastChapterViewed: (chapter: BibleRouteParams) => void;
}

const HistoryStateContext = createContext<HistoryStateContextType | undefined>(
    undefined
);

export function HistoryStateProvider({ children }: { children: React.ReactNode }) {
    const [lastChaptersViewed, setLastChaptersViewed] = useLocalStorage<BibleRouteParams[]>("last-chapters-viewed", []);

    const setLastChapterViewed = (chapter: BibleRouteParams) => {
        setLastChaptersViewed((val) => {
            const filtered = val.filter(
                c => c.book !== chapter.book || c.chapter !== chapter.chapter
            );
            const updated = [...filtered, chapter];
            return updated.slice(-6);
        });
    }

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
