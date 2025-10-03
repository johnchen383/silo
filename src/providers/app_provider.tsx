// AppStateProvider.tsx
import React, { createContext, useContext, useState } from "react";

export type Page = "home" | "read" | "notes" | "profile";

interface AppStateContextType {
    selectedPage: Page;
    setSelectedPage: (page: Page) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(
    undefined
);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
    const [selectedPage, setSelectedPage] = useState<Page>("home");

    return (
        <AppStateContext.Provider value={{ selectedPage, setSelectedPage }}>
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
