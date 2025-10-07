import { Icon } from '@iconify/react';
import "./Topbar.scss";
import { useAppProvider } from '../providers/app_provider';

const Topbar = () => {
    const { selectedPage, inApp } = useAppProvider();

    const open_chapter_selector = () => {
        document.getElementById("DOC_EL_CHAPTER_SELECTOR")?.classList.add("open", "visible");
        window.setTimeout(() => {
            document.getElementById("DOC_EL_CHAPTER_SETTINGS")?.classList.remove("open");
        }, 300);
    }

    const open_chapter_settings = () => {
        if (document.getElementById("DOC_EL_CHAPTER_SETTINGS")?.classList.contains("open"))
        {
            document.getElementById("DOC_EL_CHAPTER_SETTINGS")?.classList.remove("open");
            return;
        }
        document.getElementById("DOC_EL_CHAPTER_SETTINGS")?.classList.add("open");
    }

    if (!inApp)
        return <></>

    return (
        <>
            {selectedPage == 'read'
                ?
                <div id="DOC_EL_TOPBAR" className="topbar">
                    <Icon icon="basil:book-outline" width="36" height="36" onClick={open_chapter_selector} />
                    <Icon icon="solar:settings-outline" width="36" height="36" onClick={open_chapter_settings} />
                </div>
                : <></>
            }
        </>
    )
}

export default Topbar