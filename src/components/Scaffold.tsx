import { useEffect, useState } from "react";
import { useAuth } from "../providers/auth_provider";
import NoteEditor from "./NoteEditor";
import "./Scaffold.scss";
import Tabbar from "./Tabbar";
import Topbar from "./Topbar";
import { onlineManager } from '@tanstack/react-query'
import useEvent from "../hooks/useEvent";
import landscape from '../assets/landscape.svg'

function goOffline() {
    onlineManager.setOnline(false)
}

function goOnline() {
    onlineManager.setOnline(true)
}

const Scaffold: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [show_landscape_warning, set_show_landscape_warning] = useState(false);

    const updateScaffoldHeight = () => {
        const vh = window.visualViewport?.height || window.innerHeight;
        document.documentElement.style.setProperty('--app-height', `${vh}px`);
    };

    const checkAspectRatio = () => {
        const too_wide = window.innerHeight / window.innerWidth < 1.3 && window.innerWidth < 1000;
        set_show_landscape_warning(too_wide);
    }

    useEffect(() => {
        checkAspectRatio();
        updateScaffoldHeight();
    }, []);

    useEvent('resize', () => {
        checkAspectRatio();
        updateScaffoldHeight();
    }, []);

    useEvent('orientationchange', () => {
        checkAspectRatio();
        updateScaffoldHeight();
    }, []);

    useEffect(() => {
        const vv = window.visualViewport;
        const el = document.getElementById("DOC_EL_CHAPTER_CONTAINER");
        const noteEl = document.getElementById("DOC_EL_NOTE_EDITOR");
        if (!vv || !el || !noteEl) return;

        const update = () => {
            window.scrollTo(0, 0);
            if (vv.offsetTop === 0) {
                document.documentElement.style.transform = 'none';
                return;
            }

            document.documentElement.style.transform = `translateY(${vv.offsetTop}px)`;
        };

        vv.addEventListener("resize", update);
        vv.addEventListener("scroll", update);
        update();

        return () => {
            vv.removeEventListener("resize", update);
            vv.removeEventListener("scroll", update);
        };
    }, []);

    return (
        <div className="scaffold">
            {import.meta.env.DEV && (
                <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
                    <button onClick={goOffline}>Go Offline</button>
                    <button onClick={goOnline}>Go Online</button>
                </div>
            )}
            {show_landscape_warning ?
                (
                    <div className="landscape">
                        <img src={landscape} />
                        <div className="label">
                            Ah snapadoodle! Looks like you've caught us with aspect ratios we rather not deal with 😅
                        </div>
                    </div>
                )
                :
                (<><div id="DOC_EL_SNACKBAR" className="snackbar">Test</div>
                    {user ? <Topbar /> : <></>}
                    <div className="content">
                        {children}
                    </div>
                    {user ? <Tabbar /> : <></>}
                    <NoteEditor />
                </>
                )}
        </div>
    );
};

export default Scaffold;