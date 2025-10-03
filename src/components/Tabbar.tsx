import { Icon } from "@iconify/react";
import "./Tabbar.scss";
import { useAppProvider, type Page } from "../providers/app_provider";
import { useNavigate } from "react-router-dom";


const Tabbar = () => {
    const { selectedPage, setSelectedPage } = useAppProvider();
    const navigate = useNavigate();
    

    const handle_tab_navigation = (page: Page) => {
        setSelectedPage(page);
        navigate(`/${page}`);
    }

    return (
        <>
            <div className="preload">
                <Icon icon="fluent:home-32-filled" />
                <Icon icon="fluent:home-32-regular" />
                <Icon icon="famicons:book" />
                <Icon icon="famicons:book-outline" />
                <Icon icon="solar:notes-bold" />
                <Icon icon="solar:notes-outline" />
                <Icon icon="fluent:person-32-filled" />
                <Icon icon="fluent:person-32-regular" />
            </div>
            <div id="DOC_EL_TABBAR" className="tabbar">
                <div className="item">
                    <Icon icon={selectedPage == 'home' ? "fluent:home-32-filled" : "fluent:home-32-regular"} width="36" height="36" onClick={() => handle_tab_navigation('home')} />
                </div>
                <div className="item">
                    <Icon icon={selectedPage == 'read' ? "famicons:book" : "famicons:book-outline"} width="36" height="36" onClick={() => handle_tab_navigation('read')} />
                </div>
                <div className="item">
                    <Icon icon={selectedPage == 'notes' ? "solar:notes-bold" : "solar:notes-outline"} width="36" height="36" onClick={() => handle_tab_navigation('notes')} />
                </div>
                <div className="item">
                    <Icon icon={selectedPage == 'profile' ? "fluent:person-32-filled" : "fluent:person-32-regular"} width="36" height="36" onClick={() => handle_tab_navigation('profile')} />
                </div>
            </div>
        </>
    )
}

export default Tabbar