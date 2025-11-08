import { Icon } from '@iconify/react';
import "./Topbar.scss";
import { useAppProvider } from '../providers/app_provider';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { CONST_BIBLE_ROUTE, CONST_BOOK_SYMBOL_TO_NAME } from '../consts/bible_data';
import { useHistoryProvider } from '../providers/history_provider';
import type { BibleRouteParams } from '../types/bible_route';
import { ICON_SIZE_LARGE } from '../theme';

const Topbar = () => {
    const { book, chapter, verse } = useParams<BibleRouteParams>();
    const { selectedPage, inApp, chapterNavSettings, bookmarkedChapter, setBookmarkedChapter } = useAppProvider();
    const { lastChaptersViewed } = useHistoryProvider();
    const navigate = useNavigate();

    useEffect(() => {
        document.getElementById("DOC_EL_HISTORY_ITEMS")?.classList.remove("active");
    }, [book, chapter, verse])

    if (!inApp)
        return <></>

    const is_bookmarked = selectedPage == 'read' && book && chapter && bookmarkedChapter && book == bookmarkedChapter.book && chapter == bookmarkedChapter.chapter;
    const has_top_bar = selectedPage == 'read' || selectedPage == 'home'
    const align_left = selectedPage == 'home'

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

    const HOME_TOPBAR_ELEMENTS = <>
        <div className="logo" onClick={
            () => {
                navigate("/about")
            }
        }>silo.</div>
    </>

    const READ_TOPBAR_ELEMENTS = <>
        {
            chapterNavSettings.showBookmark ? <span><Icon icon={`${is_bookmarked ? "fluent:bookmark-16-filled" : "fluent:bookmark-16-regular"}`} width={ICON_SIZE_LARGE} height={ICON_SIZE_LARGE} onClick={toggle_bookmark} /></span> : <></>
        }
        {
            chapterNavSettings.showHistory ?
                <span className={`history`}>
                    <Icon icon="solar:history-linear" width={ICON_SIZE_LARGE} height={ICON_SIZE_LARGE} onClick={toggle_history} />
                    {
                        <div id='DOC_EL_HISTORY_ITEMS' className={`history-items`}>
                            {
                                [...lastChaptersViewed].reverse().slice(1).map((chapt, i) => {
                                    return <div className="item" key={i} onClick={(e) => {
                                        e.stopPropagation();
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
        <span><Icon icon="solar:settings-outline" width={ICON_SIZE_LARGE} height={ICON_SIZE_LARGE} onClick={open_chapter_settings} /></span>
    </>

    return (
        <>
            {has_top_bar
                ?
                <div id="DOC_EL_TOPBAR" className={`topbar ${align_left ? 'align-left' : ''}`}>
                    {selectedPage == "read" ? READ_TOPBAR_ELEMENTS : HOME_TOPBAR_ELEMENTS}
                </div>
                : <></>
            }
        </>
    )
}

export default Topbar