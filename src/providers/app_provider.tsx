// AppStateProvider.tsx
import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./auth_provider";
import { IsBibleRouteParams, type BibleRouteParams } from "../types/bible_route";
import { useUpdateBookmarked } from "../supabase/api/profile";

export type Page = "home" | "read" | "notes" | "profile";

export interface ChapterContentViewSettings {
    manusriptMode: boolean
}

export interface ChapterNavSettings {
    showHistory: boolean
    showBookmark: boolean
}

interface AppStateContextType {
    selectedPage: Page;
    setSelectedPage: (page: Page) => void;
    chapterContentViewSettings: ChapterContentViewSettings;
    setChapterContentViewSettings: (settings: ChapterContentViewSettings) => void;
    chapterNavSettings: ChapterNavSettings;
    setChapterNavSettings: (settings: ChapterNavSettings) => void;
    inApp: boolean;
    setInApp: (inApp: boolean) => void;
    bookmarkedChapter: BibleRouteParams | null;
    setBookmarkedChapter: (chapter: BibleRouteParams | null) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(
    undefined
);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
    const [selectedPage, setSelectedPage] = useState<Page>(() => {
        const path = window.location.pathname;
        if (path.startsWith("/notes")) return "notes";
        if (path.startsWith("/profile")) return "profile";
        if (path.startsWith("/read")) return "read";

        return "home";
    });

    const [chapterContentViewSettings, setChapterContentViewSettings] = useState<ChapterContentViewSettings>({
        manusriptMode: false
    })
    const [chapterNavSettings, setChapterNavSettings] = useState<ChapterNavSettings>({
        showBookmark: true,
        showHistory: true,
    })

    const { profile } = useAuth();

    // const [bookmarkedChapter, setBookmarkedChapter] = useLocalStorage<BibleRouteParams | null>(
    //     "bookmarked-chapter",
    //     null,
    //     (val) => {
    //         const prev = (bookmark.data ?? null);
    //         if (val !== prev) {
    //             console.log(`Mutating server persistence from ${JSON.stringify(prev)} to ${JSON.stringify(val)}`)
    //             bookmark.mutate(val);
    //         }
    //     },
    //     IsBibleRouteParams(profile?.bookmarked) ? profile!.bookmarked : null
    // );

    const bookmark = useUpdateBookmarked(profile?.user_id);

    const bookmarkedChapter = IsBibleRouteParams(profile?.bookmarked) ? profile!.bookmarked : null;
    const setBookmarkedChapter = (chapter: BibleRouteParams | null) => bookmark.mutate(chapter);

    const [inApp, setInApp] = useState(() => {
        const path = window.location.pathname;
        if (path === "/" || path.startsWith("/notes") || path.startsWith("/profile") || path.startsWith("/read") || path.startsWith("/home"))
            return true;

        return false;
    });
    return (
        <AppStateContext.Provider value={{
            selectedPage,
            setSelectedPage,
            chapterContentViewSettings,
            setChapterContentViewSettings,
            chapterNavSettings,
            setChapterNavSettings,
            bookmarkedChapter,
            setBookmarkedChapter,
            inApp,
            setInApp
        }}>
            {children}
        </AppStateContext.Provider>
    );
}

export function useAppProvider() {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error("useAppProvider must be used within an AppStateProvider");
    }
    return context;
}
