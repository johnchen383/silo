import { useEffect, useState } from "react"
import { GetBSB } from "../api/bsb";
import type { TranslationBookChapter } from "../api/models";
import { useNavigate, useParams } from "react-router-dom";
import { CONST_BIBLE_ROUTE, CONST_BOOK_SYMBOL_TO_NAME, CONST_BOOKS, CONST_BOOKS_NUM_CHAPTERS, CONST_DEFAULT_CHAPTER_URL, TRANSLATION } from "../consts/bible_data";

import "./Chapter.scss";
import ChapterSelector from "./ChapterSelector";
import useEvent from "../hooks/useEvent";
import useScrollDirection from "../hooks/useScroll";
import ChapterSettings from "./ChapterSettings";
import type { BibleRouteParams } from "../types/bible_route";
import { ChapterContent } from "./ChapterContent";
import LoadingBar from "./LoadingBar";

export const SHOW_CHAPTER_CURTAINS = () => {
    document.getElementById("DOC_EL_TOPBAR")?.classList.remove("hidden");
    document.getElementById("DOC_EL_TABBAR")?.classList.remove("hidden");
}

export const HIDE_CHAPTER_CURTAINS = () => {
    document.getElementById("DOC_EL_TOPBAR")?.classList.add("hidden");
    document.getElementById("DOC_EL_TABBAR")?.classList.add("hidden");
}

const Chapter = () => {
    // TODO: implement verse logic
    const { book, chapter, verse } = useParams<BibleRouteParams>();
    const [current_chapter, set_current_chapter] = useState<TranslationBookChapter | null>(null);

    const navigate = useNavigate();

    const on_scroll_up = () => {
        SHOW_CHAPTER_CURTAINS();
        document.getElementById("DOC_EL_HISTORY_ITEMS")?.classList.remove("active");
    }

    const on_scroll_down = () => {
        HIDE_CHAPTER_CURTAINS();
        document.getElementById("DOC_EL_HISTORY_ITEMS")?.classList.remove("active");
    }

    const handle_vertical_scroll = (e: WheelEvent) => {
        if (e.deltaY > 0) {
            on_scroll_down()
        }
        else if (e.deltaY < 0) {
            on_scroll_up()
        }
    }

    useEvent("wheel", handle_vertical_scroll, [], document.getElementById("DOC_EL_CHAPTER_CONTAINER"));
    useScrollDirection((direction) => {
        if (direction === "down") {
            on_scroll_down()
        } else if (direction === "up") {
            on_scroll_up()
        }
    }, document.getElementById("DOC_EL_CHAPTER_CONTAINER"));

    const ChapterHeader = () => (
        <div className={`chapter-header`}>
            <div className={`book`}>{CONST_BOOK_SYMBOL_TO_NAME[book!]}</div>
            <div className={`chapter`}>{chapter}</div>
        </div>
    );

    const on_general_click = () => {
        document.getElementById("DOC_EL_CHAPTER_SETTINGS")?.classList.remove("open");
        document.getElementById("DOC_EL_HISTORY_ITEMS")?.classList.remove("active");
    }

    const handle_touch_end = (_: TouchEvent) => {
        on_general_click();
    }

    useEvent("touchend", handle_touch_end, [], document.getElementById("DOC_EL_CHAPTER_CONTAINER"));

    useEffect(() => {
        const Initialise = async () => {
            let target_book = "GEN";
            let target_chapter = "1";

            if (book && CONST_BOOKS.has(book.trim().toUpperCase())) {
                target_book = book.trim().toUpperCase();

                if (chapter && !isNaN(Number(chapter)) && Number(chapter) > 0 && Number(chapter) <= CONST_BOOKS_NUM_CHAPTERS[target_book]) {
                    target_chapter = String(Number(chapter));
                }
                else {
                    navigate(`${CONST_BIBLE_ROUTE}/${target_book}/1`);
                    return;
                }
            }
            else {
                navigate(CONST_DEFAULT_CHAPTER_URL);
                return;
            }

            const data = await GetBSB<TranslationBookChapter>(`/api/${TRANSLATION}/${target_book}/${target_chapter}.json`);

            if (verse && Number(verse) > data.numberOfVerses) {
                navigate(`${CONST_BIBLE_ROUTE}/${target_book}/${target_chapter}`);
                return;
            }

            set_current_chapter(data);
        }

        document.getElementById("DOC_EL_TOPBAR")?.classList.remove("hidden");
        document.getElementById("DOC_EL_CHAPTER_CONTAINER")!.scrollTop = 0;
        set_current_chapter(null);
        Initialise();
    }, [book, chapter, verse]);

    return (
        <>
            <div id="DOC_EL_CHAPTER_CONTAINER" className={`chapter-container`} onClick={on_general_click}>
                <div className="content">
                    <div className="chapter-block">
                        <ChapterHeader />
                        {current_chapter
                            ? <ChapterContent chapter_data={current_chapter} embedded={false} />
                            : <LoadingBar />
                        }
                    </div>
                    <div className="spacer"></div>
                    <div className="info" style={{ fontSize: "0.7rem", textAlign: "center", paddingBottom: "5rem" }}>hash: {__COMMIT_HASH__}</div>
                </div>
            </div>
            <ChapterSelector />
            <ChapterSettings />
        </>
    )
}

export default Chapter