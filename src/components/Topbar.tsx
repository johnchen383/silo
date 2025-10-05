import { Icon } from '@iconify/react';
import "./Topbar.scss";
import { useAppProvider } from '../providers/app_provider';

const Topbar = () => {
    const { selectedPage, chapterContentViewSettings, setChapterContentViewSettings, inApp } = useAppProvider();

    const open_chapter_selector = () => {
        document.getElementById("DOC_EL_CHAPTER_SELECTOR")?.classList.add("open", "visible");
    }

    if (!inApp)
        return <></>

    return (
        <>
            {selectedPage == 'read'
                ?
                <div id="DOC_EL_TOPBAR" className="topbar">
                    <Icon icon="basil:book-outline" width="36" height="36" onClick={open_chapter_selector} />
                    <Icon icon="solar:settings-outline" width="36" height="36" onClick={() => setChapterContentViewSettings({ ...chapterContentViewSettings, manusriptMode: !chapterContentViewSettings.manusriptMode })} />
                </div>
                : <></>
            }
        </>
    )
}

export default Topbar