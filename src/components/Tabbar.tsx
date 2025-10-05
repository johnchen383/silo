import { Icon } from "@iconify/react";
import "./Tabbar.scss";
import { useAppProvider, type Page } from "../providers/app_provider";
import { useNavigate } from "react-router-dom";
import { CONST_BIBLE_ROUTE } from "../consts/bible_data";


const Tabbar = () => {
    const { selectedPage, setSelectedPage, lastChapterViewed, inApp } = useAppProvider();
    const navigate = useNavigate();

    const handle_tab_navigation = (page: Page) => {
        setSelectedPage(page);

        if (page == "read")
        {
            navigate(`${CONST_BIBLE_ROUTE}/${lastChapterViewed.book}/${lastChapterViewed.chapter}/${lastChapterViewed.verse}`)
        }
        else
        {
            navigate(`/${page}`);
        }
    }

    if (!inApp)
        return <></>;

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