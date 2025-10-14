import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase/supabase";
import type { User } from "@supabase/supabase-js";
import type { Database } from "../supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Note = Database["public"]["Tables"]["notes"]["Row"];

type AuthContextType = {
    user: User | null;
    profile: Profile | null;
    notes: Note[];
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    notes: [],
    loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // --- React Query fetch functions ---
    const fetchProfile = async (userId: string) => {
        const { data: existingProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (!existingProfile) {
            const { data: newProfile } = await supabase
                .from("profiles")
                .insert({ user_id: userId })
                .select("*")
                .single();
            return newProfile ?? null;
        }

        return existingProfile;
    };

    const fetchNotes = async (userId: string) => {
        const { data } = await supabase
            .from("notes")
            .select("*")
            .eq("user_id", userId)
            .order("created_timestamp", { ascending: false });
        return data ?? [];
    };

    // --- Use React Query ---
    const profileQuery = useQuery({
        queryKey: ["profile", user?.id],
        queryFn: () => fetchProfile(user!.id),
        enabled: !!user
    });

    const notesQuery = useQuery({
        queryKey: ["notes-list", user?.id],
        queryFn: () => fetchNotes(user!.id),
        enabled: !!user
    });

    // --- Auth listener ---
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user ?? null);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const loading =
        !user ||
        profileQuery.isLoading ||
        notesQuery.isLoading;

    return (
        <AuthContext.Provider
            value={{
                user,
                profile: profileQuery.data ?? null,
                notes: notesQuery.data ?? [],
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
