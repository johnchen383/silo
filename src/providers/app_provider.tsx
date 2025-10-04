// AppStateProvider.tsx
import React, { createContext, useContext, useState } from "react";

export type Page = "home" | "read" | "notes" | "profile";

export interface ChapterContentViewSettings
{
    manusriptMode: boolean
}

interface AppStateContextType {
    selectedPage: Page;
    setSelectedPage: (page: Page) => void;
    chapterContentViewSettings: ChapterContentViewSettings;
    setChapterContentViewSettings: (settings: ChapterContentViewSettings) => void;
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
        manusriptMode: true
    })

    return (
        <AppStateContext.Provider value={{ selectedPage, setSelectedPage, chapterContentViewSettings, setChapterContentViewSettings }}>
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
