import { useEffect } from "react";
import { useAuth } from "../providers/auth_provider";
import NoteEditor from "./NoteEditor";
import "./Scaffold.scss";
import Tabbar from "./Tabbar";
import Topbar from "./Topbar";
import { onlineManager } from '@tanstack/react-query'
import useEvent from "../hooks/useEvent";

function goOffline() {
    onlineManager.setOnline(false)
}

function goOnline() {
    onlineManager.setOnline(true)
}

const Scaffold: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    const updateScaffoldHeight = () => {
        const vh = window.visualViewport?.height || window.innerHeight;
        document.documentElement.style.setProperty('--app-height', `${vh}px`);
    };

    useEffect(() => {
        updateScaffoldHeight();
    }, []);

    useEvent('resize', updateScaffoldHeight, []);

    return (
        <div className="scaffold">
            {import.meta.env.DEV && (
                <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
                    <button onClick={goOffline}>Go Offline</button>
                    <button onClick={goOnline}>Go Online</button>
                </div>
            )}
            <div id="DOC_EL_SNACKBAR" className="snackbar">Test</div>
            {user ? <Topbar /> : <></>}
            <div className="content">
                {children}
            </div>
            {user ? <Tabbar /> : <></>}
            <NoteEditor />
        </div>
    );
};

export default Scaffold;