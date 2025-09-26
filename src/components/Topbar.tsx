import { Icon } from '@iconify/react';
import "./Topbar.scss";

const Topbar = () => {
    const open_chapter_selector = () => {
        document.getElementById("DOC_EL_CHAPTER_SELECTOR")?.classList.add("open", "visible");
    }
    return (
        <>
            <div id="DOC_EL_TOPBAR" className="topbar">
                <Icon icon="basil:book-outline" width="36" height="36" onClick={open_chapter_selector} />

            </div>
            <div id="DOC_EL_LOADER" className="loader"></div> 
        </>
    )
}

export default Topbar