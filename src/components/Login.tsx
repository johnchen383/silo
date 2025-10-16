// src/Login.tsx
import { supabase } from "../supabase/supabase";

export default function Login() {
    async function handleGoogleLogin() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin,
            },
        });
        if (error) console.error(error.message);
    }

    return (
        <div>
            <button onClick={handleGoogleLogin}>
                Sign in with Google
            </button>
        </div>
    );
}
