import { Icon } from '@iconify/react';
import "./Topbar.scss";

const Topbar = () => {
    const open_chapter_selector = () => {
        document.getElementById("DOC_EL_CHAPTER_SELECTOR")?.classList.add("open", "visible");
    }
    return (
        <div className="topbar">
            <Icon icon="basil:book-outline" width="36" height="36" onClick={open_chapter_selector} />
        </div>
    )
}

export default Topbar