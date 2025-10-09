// HistoryStateProvider.tsx
import React, { createContext, useContext } from "react";
import { type BibleRouteParams } from "../components/Chapter";
import useLocalStorage from "../hooks/useLocalStorage";

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
