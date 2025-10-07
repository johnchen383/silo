import { Icon } from '@iconify/react';
import "./Topbar.scss";
import { useAppProvider } from '../providers/app_provider';
import { useParams } from 'react-router-dom';
import type { BibleRouteParams } from './Chapter';

const Topbar = () => {
    const { book, chapter, verse } = useParams<BibleRouteParams>();
    const { selectedPage, inApp, chapterNavSettings, bookmarkedChapter, setBookmarkedChapter } = useAppProvider();

    if (!inApp)
        return <></>

    const is_bookmarked = selectedPage == 'read' && book && chapter && bookmarkedChapter && book == bookmarkedChapter.book && chapter == bookmarkedChapter.chapter;

    const open_chapter_selector = () => {
        document.getElementById("DOC_EL_CHAPTER_SELECTOR")?.classList.add("open", "visible");
        window.setTimeout(() => {
            document.getElementById("DOC_EL_CHAPTER_SETTINGS")?.classList.remove("open");
        }, 300);
    }

    const open_chapter_settings = () => {
        if (document.getElementById("DOC_EL_CHAPTER_SETTINGS")?.classList.contains("open")) {
            document.getElementById("DOC_EL_CHAPTER_SETTINGS")?.classList.remove("open");
            return;
        }
        document.getElementById("DOC_EL_CHAPTER_SETTINGS")?.classList.add("open");
    }

    const toggle_bookmark = () => {
        if (!book || !chapter || is_bookmarked) {
            setBookmarkedChapter(null);
            return;
        }

        setBookmarkedChapter({ book, chapter, verse: verse ? verse : "1" });
    }

    return (
        <>
            {selectedPage == 'read'
                ?
                <div id="DOC_EL_TOPBAR" className="topbar">
                    {
                        chapterNavSettings.showBookmark ? <Icon icon={`${is_bookmarked ? "fluent:bookmark-16-filled" : "fluent:bookmark-16-regular"}`} width="36" height="36" onClick={toggle_bookmark} /> : <></>
                    }
                    {
                        chapterNavSettings.showHistory ? <Icon icon="solar:history-linear" width="36" height="36" onClick={open_chapter_selector} /> : <></>
                    }
                    <Icon icon="basil:book-outline" width="36" height="36" onClick={open_chapter_selector} />
                    <Icon icon="solar:settings-outline" width="36" height="36" onClick={open_chapter_settings} />
                </div>
                : <></>
            }
        </>
    )
}

export default Topbar