import { useAuth } from "../providers/auth_provider";
import NoteEditor from "./NoteEditor";
import "./Scaffold.scss";
import Tabbar from "./Tabbar";
import Topbar from "./Topbar";
import { onlineManager } from '@tanstack/react-query'

function goOffline() {
    onlineManager.setOnline(false)
}

function goOnline() {
    onlineManager.setOnline(true)
}

const Scaffold: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    return (
        <div className="scaffold">
            {import.meta.env.DEV && (
                <div style={{ position: 'fixed', bottom: 10, right: 10 }}>
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