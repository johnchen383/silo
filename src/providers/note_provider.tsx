// NoteStateProvider.tsx
import React, { createContext, useContext } from "react";
import type { BibleRouteParams } from "../types/bible_route";

export interface Note {
    start: BibleRouteParams;
    end: BibleRouteParams;
    content: string;
}

interface NoteStateContextType {
    pendingNote: Note | null;
    setPendingNote: (setPendingNote: Note | null) => void;
}

const NoteStateContext = createContext<NoteStateContextType>(
    {
        pendingNote: null,
        setPendingNote: () => { },
    }
);

export function NoteStateProvider({ children }: { children: React.ReactNode }) {
    const [pendingNote, setPendingNote] = React.useState<Note | null>(null);

    return (
        <NoteStateContext.Provider value={{
            pendingNote,
            setPendingNote,
        }}>
            {children}
        </NoteStateContext.Provider>
    );
}

export function useNoteProvider() {
    const context = useContext(NoteStateContext);
    if (!context) {
        throw new Error("useNoteProvider must be used within an NoteStateProvider");
    }
    return context;
}
