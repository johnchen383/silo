import { Icon } from '@iconify/react';
import "./Topbar.scss";
import { useAppProvider } from '../providers/app_provider';
import { useNavigate, useParams } from 'react-router-dom';
import type { BibleRouteParams } from './Chapter';
import { useEffect } from 'react';
import { CONST_BIBLE_ROUTE, CONST_BOOK_SYMBOL_TO_NAME } from '../consts/bible_data';

const Topbar = () => {
    const { book, chapter, verse } = useParams<BibleRouteParams>();
    const { selectedPage, inApp, chapterNavSettings, bookmarkedChapter, setBookmarkedChapter, lastChaptersViewed } = useAppProvider();
    const navigate = useNavigate();

    if (!inApp)
        return <></>

    const is_bookmarked = selectedPage == 'read' && book && chapter && bookmarkedChapter && book == bookmarkedChapter.book && chapter == bookmarkedChapter.chapter;

    const open_chapter_selector = () => {
        document.getElementById("DOC_EL_HISTORY_ITEMS")?.classList.remove("active");
        document.getElementById("DOC_EL_CHAPTER_SELECTOR")?.classList.add("open", "visible");
        window.setTimeout(() => {
            document.getElementById("DOC_EL_CHAPTER_SETTINGS")?.classList.remove("open");
        }, 300);
    }

    const open_chapter_settings = () => {
        document.getElementById("DOC_EL_HISTORY_ITEMS")?.classList.remove("active");
        if (document.getElementById("DOC_EL_CHAPTER_SETTINGS")?.classList.contains("open")) {
            document.getElementById("DOC_EL_CHAPTER_SETTINGS")?.classList.remove("open");
            return;
        }
        document.getElementById("DOC_EL_CHAPTER_SETTINGS")?.classList.add("open");
    }

    const toggle_bookmark = () => {
        document.getElementById("DOC_EL_HISTORY_ITEMS")?.classList.remove("active");
        if (!book || !chapter || is_bookmarked) {
            setBookmarkedChapter(null);
            return;
        }

        setBookmarkedChapter({ book, chapter, verse: verse ? verse : "1" });
    }

    const toggle_history = () => {
        if (document.getElementById("DOC_EL_HISTORY_ITEMS")?.classList.contains("active")) {
            document.getElementById("DOC_EL_HISTORY_ITEMS")?.classList.remove("active");
        }
        else if (lastChaptersViewed.length > 1) {
            document.getElementById("DOC_EL_HISTORY_ITEMS")?.classList.add("active");
        }
    }

    useEffect(() => {
        document.getElementById("DOC_EL_HISTORY_ITEMS")?.classList.remove("active");
    }, [book, chapter, verse])

    return (
        <>
            {selectedPage == 'read'
                ?
                <div id="DOC_EL_TOPBAR" className="topbar">
                    {
                        chapterNavSettings.showBookmark ? <span><Icon icon={`${is_bookmarked ? "fluent:bookmark-16-filled" : "fluent:bookmark-16-regular"}`} width="36" height="36" onClick={toggle_bookmark} /></span> : <></>
                    }
                    {
                        chapterNavSettings.showHistory ?
                            <span className={`history`}>
                                <Icon icon="solar:history-linear" width="36" height="36" onClick={toggle_history} />
                                {
                                    <div id='DOC_EL_HISTORY_ITEMS' className={`history-items`}>
                                        {
                                            [...lastChaptersViewed].reverse().slice(1).map((chapt, i) => {
                                                return <div className="item" key={i} onClick={() => {
                                                    navigate(`${CONST_BIBLE_ROUTE}/${chapt.book}/${chapt.chapter}`);
                                                }}>
                                                    {`${CONST_BOOK_SYMBOL_TO_NAME[chapt.book]} ${chapt.chapter}`}
                                                </div>
                                            })
                                        }
                                    </div>
                                }
                            </span>
                            : <></>
                    }
                    <span><Icon icon="basil:book-outline" width="36" height="36" onClick={open_chapter_selector} /></span>
                    <span><Icon icon="solar:settings-outline" width="36" height="36" onClick={open_chapter_settings} /></span>
                </div>
                : <></>
            }
        </>
    )
}

export default Topbar