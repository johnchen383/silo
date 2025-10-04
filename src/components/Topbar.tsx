import { Icon } from '@iconify/react';
import "./Topbar.scss";
import { useAppProvider } from '../providers/app_provider';

const Topbar = () => {
    const { selectedPage } = useAppProvider();

    const open_chapter_selector = () => {
        document.getElementById("DOC_EL_CHAPTER_SELECTOR")?.classList.add("open", "visible");
    }
    return (
        <>
            {selectedPage == 'read'
                ?
                <div id="DOC_EL_TOPBAR" className="topbar">
                    <Icon icon="basil:book-outline" width="32" height="32" onClick={open_chapter_selector} />
                    <Icon icon="solar:settings-outline" width="32" height="32" onClick={open_chapter_selector} />
                </div>
                : <></>
            }
        </>
    )
}

export default Topbar