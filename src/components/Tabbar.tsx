import { Icon } from "@iconify/react";
import "./Tabbar.scss";
import { useAppProvider, type Page } from "../providers/app_provider";
import { useNavigate } from "react-router-dom";
import { CONST_BIBLE_ROUTE } from "../consts/bible_data";
import { DEFAULT_BIBLE_ROUTE, type BibleRouteParams } from "./Chapter";

const ICONS = [
    "fluent:home-32-filled",
    "fluent:home-32-regular",
    "famicons:book",
    "famicons:book-outline",
    "solar:notes-bold",
    "solar:notes-outline",
    "fluent:person-32-filled",
    "fluent:person-32-regular",
    "fluent:bookmark-16-filled",
    "fluent:bookmark-16-regular",
    "solar:history-linear",
    "basil:cross-solid"
]

export const GET_LAST_CHAPTER_ROUTE = (lasts: BibleRouteParams[]) => {
    const lastChapt = lasts.at(-1);
    if (!lastChapt) {
        return `${DEFAULT_BIBLE_ROUTE}`;
    }

    return `${CONST_BIBLE_ROUTE}/${lastChapt.book}/${lastChapt.chapter}/${lastChapt.verse}`;
}

const Tabbar = () => {
    const { selectedPage, setSelectedPage, lastChaptersViewed, inApp } = useAppProvider();
    const navigate = useNavigate();

    const handle_tab_navigation = (page: Page) => {
        setSelectedPage(page);

        if (page == "read") {
            navigate(`${GET_LAST_CHAPTER_ROUTE(lastChaptersViewed)}`);
        }
        else {
            navigate(`/${page}`);
        }
    }

    if (!inApp)
        return <></>;

    return (
        <>
            <div className="preload">
                {
                    ICONS.map((icon, i) => {
                        return <Icon key={i} icon={icon} />
                    })
                }
            </div>
            <div id="DOC_EL_TABBAR" className="tabbar">
                <div className="content">
                    <div className="item" onClick={() => handle_tab_navigation('home')}>
                        <Icon icon={selectedPage == 'home' ? "fluent:home-32-filled" : "fluent:home-32-regular"} width="25" height="25" />
                        <div className="label" style={{ fontSize: 14 }}>Home</div>
                    </div>
                    <div className="item" onClick={() => handle_tab_navigation('read')} >
                        <Icon icon={selectedPage == 'read' ? "famicons:book" : "famicons:book-outline"} width="25" height="25" />
                        <div className="label" style={{ fontSize: 14 }}>Read</div>
                    </div>
                    <div className="item" onClick={() => handle_tab_navigation('notes')}>
                        <Icon icon={selectedPage == 'notes' ? "solar:notes-bold" : "solar:notes-outline"} width="25" height="25" />
                        <div className="label" style={{ fontSize: 14 }}>Notes</div>
                    </div>
                    <div className="item" onClick={() => handle_tab_navigation('profile')}>
                        <Icon icon={selectedPage == 'profile' ? "fluent:person-32-filled" : "fluent:person-32-regular"} width="25" height="25" />
                        <div className="label" style={{ fontSize: 14 }}>Profile</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Tabbar