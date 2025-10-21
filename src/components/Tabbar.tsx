import { Icon } from "@iconify/react";
import "./Tabbar.scss";
import { useAppProvider, type Page } from "../providers/app_provider";
import { useNavigate, useParams } from "react-router-dom";
import { CONST_BIBLE_ROUTE, CONST_BOOK_SYMBOL_TO_NAME, CONST_BOOKS_ARR, CONST_BOOKS_NUM_CHAPTERS } from "../consts/bible_data";
import { useHistoryProvider } from "../providers/history_provider";
import { DEFAULT_BIBLE_ROUTE, type BibleRouteParams } from "../types/bible_route";
import { useOnline } from "../hooks/useOnline";
import { useEffect, useRef } from "react";

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
    "basil:cross-solid",
    "basil:caret-left-outline",
    "basil:caret-right-outline"
]

export const GET_LAST_CHAPTER_ROUTE = (lasts: BibleRouteParams[]) => {
    const lastChapt = lasts.at(-1);
    if (!lastChapt) {
        return `${DEFAULT_BIBLE_ROUTE}`;
    }

    return `${CONST_BIBLE_ROUTE}/${lastChapt.book}/${lastChapt.chapter}/${lastChapt.verse}`;
}

const Tabbar = () => {
    const { selectedPage, setSelectedPage, inApp } = useAppProvider();
    const { book, chapter } = useParams<BibleRouteParams>();
    const { lastChaptersViewed } = useHistoryProvider();
    const has_mounted = useRef(false);

    const isOnline = useOnline();

    useEffect(() => {
        if (!has_mounted.current) {
            has_mounted.current = true;
            if (isOnline)
            {
                return;
            }
        }

        const shnack = document.getElementById("DOC_EL_SNACKBAR");
        if (!shnack) return;

        let toggled = false;

        if (!isOnline) {
            shnack.classList.add("show")
            shnack.classList.remove("green")
            shnack.innerText = "Connection lost. Data will be synced when back online."
            toggled = true;
        }

        if (isOnline) {
            shnack.classList.add("show", "green")
            shnack.innerText = "Connection restored."
            toggled = true;
        }

        if (toggled) {
            window.setTimeout(() => shnack.classList.remove("show"), 4000)
        }
    }, [isOnline])

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

    const open_chapter_selector = () => {
        document.getElementById("DOC_EL_HISTORY_ITEMS")?.classList.remove("active");
        document.getElementById("DOC_EL_CHAPTER_SELECTOR")?.classList.add("open", "visible");
        window.setTimeout(() => {
            document.getElementById("DOC_EL_CHAPTER_SETTINGS")?.classList.remove("open");
        }, 300);
    }

    if (!inApp)
        return <></>;

    const has_chapter_nav = book && chapter;

    const prev_chapter: BibleRouteParams | null = has_chapter_nav ? {
        book: Number(chapter) == 1
            ? (
                book == "GEN" ? "REV" : CONST_BOOKS_ARR[CONST_BOOKS_ARR.findIndex((v) => v == book) - 1]
            ) : book,
        chapter: Number(chapter) == 1 ? (
            book == "GEN" ? String(CONST_BOOKS_NUM_CHAPTERS["REV"]) : String(CONST_BOOKS_NUM_CHAPTERS[CONST_BOOKS_ARR[CONST_BOOKS_ARR.findIndex((v) => v == book) - 1]])
        ) : String(Number(chapter) - 1),
        verse: "1"
    } : null;

    const next_chapter: BibleRouteParams | null = has_chapter_nav ? {
        book: Number(chapter) == CONST_BOOKS_NUM_CHAPTERS[book]
            ? (
                book == "REV" ? "GEN" : CONST_BOOKS_ARR[CONST_BOOKS_ARR.findIndex((v) => v == book) + 1]
            ) : book,
        chapter: Number(chapter) == CONST_BOOKS_NUM_CHAPTERS[book] ? "1" : String(Number(chapter) + 1),
        verse: "1"
    } : null;

    const handle_prev = () => {
        if (!prev_chapter) return;

        navigate(`${CONST_BIBLE_ROUTE}/${prev_chapter.book}/${prev_chapter.chapter}`)
    }

    const handle_next = () => {
        if (!next_chapter) return;

        navigate(`${CONST_BIBLE_ROUTE}/${next_chapter.book}/${next_chapter.chapter}`)
    }

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
                {
                    has_chapter_nav &&
                    <div className="chapter-navigation">
                        <div className="item btn left" onClick={handle_prev}><Icon icon="basil:caret-left-outline" width="32" height="32" /><div className="text">{prev_chapter!.book == book ? "Ch." : prev_chapter!.book} {prev_chapter!.chapter}</div></div>
                        <div className="item label" onClick={open_chapter_selector}>{CONST_BOOK_SYMBOL_TO_NAME[book]} {chapter}</div>
                        <div className="item btn right" onClick={handle_next}><div className="text">{next_chapter!.book == book ? "Ch." : next_chapter!.book} {next_chapter!.chapter}</div><Icon icon="basil:caret-right-outline" width="32" height="32" /></div>
                    </div>
                }
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