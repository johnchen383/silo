import { useEffect, useState } from "react"
import { GetBSB } from "../api/bsb";
import type { ChapterVerse, TranslationBookChapter, ChapterVerseContent } from "../api/models";
import { useNavigate, useParams } from "react-router-dom";
import { CONST_BIBLE_ROUTE, CONST_BOOK_SYMBOL_TO_NAME, CONST_BOOKS, CONST_BOOKS_ARR, CONST_BOOKS_NUM_CHAPTERS, CONST_DEFAULT_CHAPTER_URL } from "../consts/bible_data";

import "./Chapter.scss";
import ChapterSelector from "./ChapterSelector";
import useEvent from "../hooks/useEvent";
import useScrollDirection from "../hooks/useScroll";
import { Icon } from "@iconify/react";
import { useAppProvider } from "../providers/app_provider";
const LineBreak: React.FC<{ small: boolean }> = ({ small }) => <span><br /><div className={`spacer ${small ? 'small' : ''}`}></div></span>;

import React from 'react'
import ChapterSettings from "./ChapterSettings";
import { useHistoryProvider } from "../providers/history_provider";
import type { BibleRouteParams } from "../types/bible_route";

interface ChapterContentProps {
    chapter: TranslationBookChapter;
}

export const ChapterContent = (props: ChapterContentProps) => {
    const { chapterContentViewSettings, setInApp } = useAppProvider();
    const { setLastChapterViewed } = useHistoryProvider();
    const [selected_verse, set_selected_verse] = useState<number>(0);
    const { book, chapter, verse } = useParams<BibleRouteParams>();

    useEffect(() => {
        set_selected_verse(0);
        setInApp(true);
        setLastChapterViewed({
            book: book ?? "GEN",
            chapter: chapter ?? "1",
            verse: verse ?? "1",
        })
    }, [book, chapter, verse])

    function VerseContent(
        c: ChapterVerseContent,
        i: number,
        arr: ChapterVerseContent[]
    ): React.ReactNode {
        if (typeof c === "string") {
            return (
                <span key={i} className={`text ${c === "Selah" ? "selah" : ""}`}>
                    {c}
                </span>
            );
        }

        if ("text" in c) {
            let next_element_footnote = false;

            if (i < arr.length - 1) {
                const next = arr[i + 1];
                if (typeof next !== "string" && "noteId" in next) {
                    next_element_footnote = true;
                }
            }

            return (
                <span key={i}>
                    <span
                        className={`text ${c.poem ? `poem ${i === 0 ? "" : "indented"}` : ""
                            } ${c.wordsOfJesus ? "red" : ""}`}
                    >
                        {c.text}
                    </span>
                    {
                        (!next_element_footnote) ? <br /> : <></>
                    }
                </span>
            );
        }

        if ("heading" in c) {
            return (
                <span key={i} className="inline-heading">
                    UNFORMATTED HEADING (CONTACT DEVELOPER)
                </span>
            );
        }

        if ("lineBreak" in c) {
            if (i > 0) {
                const prev = arr[i - 1];
                if (typeof prev !== "string" && ("text" in prev || "lineBreak" in prev)) {
                    return null;
                }
            }
            return <LineBreak key={i} small={false} />;
        }

        if ("noteId" in c) {
            let next_element_poem = false;

            if (i < arr.length - 1) {
                const next = arr[i + 1];
                if (typeof next !== "string" && "poem" in next && next.poem) {
                    next_element_poem = true;
                }
            }

            return (
                <span key={i}>
                    <sup className="footnote">
                        {c.noteId + 1}
                    </sup>
                    {
                        (next_element_poem || i == arr.length - 1) ? <br /> : <></>
                    }
                </span>
            );
        }

        return null;
    }

    const Verse: React.FC<{ verse: ChapterVerse }> = ({ verse }) => {
        return (
            <span className={`verse ${selected_verse == verse.number ? 'selected' : ''}`} onClick={() => {
                set_selected_verse(verse.number);
                // navigator.clipboard.writeText(JSON.stringify(verse.content))
            }}>
                {!chapterContentViewSettings.manusriptMode ? <sup className={`verse-num`}>{verse.number}</sup> : <></>}
                {verse.content.map(VerseContent)}
            </span>
        );
    };

    return (
        <>
            <div className="verses">
                {props.chapter.chapter.content.map((cont, idx, arr) => {
                    if (cont.type === "heading") {
                        if (!chapterContentViewSettings.manusriptMode) {
                            return (
                                <h3 key={idx} className={`chapter-subheading`}>
                                    {cont.content}
                                </h3>
                            );
                        }
                        else {
                            return <LineBreak key={idx} small={false} />;
                        }
                    }

                    if (cont.type === "verse") {
                        return <Verse key={idx} verse={cont} />;
                    }

                    if (cont.type === "line_break") {
                        if (idx > 0 && (arr[idx - 1].type === "heading" || arr[idx - 1].type === "hebrew_subtitle" || arr[idx - 1].type === "line_break")) {
                            return null;
                        }
                        return <LineBreak key={idx} small={true} />;
                    }

                    if (cont.type === "hebrew_subtitle") {
                        return (
                            <h4 key={idx} className="hebrew-subtitle">
                                {cont.content.map(VerseContent)}
                            </h4>
                        );
                    }

                    return null;
                })}

            </div>
            <div className={`footnotes`}>
                {props.chapter.chapter.footnotes.map((note, idx) => {
                    return (
                        <div key={idx} className="footnote-container">
                            <sup className="footnote-num">{note.noteId + 1}</sup>
                            <span className="footnote-text">{note.text}</span>
                        </div>
                    )
                })}
            </div>
        </>
    )
}


const Chapter = () => {
    const HOR_SCROLL_LEFT = 200;

    // TODO: implement verse logic
    const { book, chapter, verse } = useParams<BibleRouteParams>();
    const [current_chapter, set_current_chapter] = useState<TranslationBookChapter | null>(null);

    const navigate = useNavigate();

    const on_scroll_up = () => {
        document.getElementById("DOC_EL_TOPBAR")?.classList.remove("hidden");
        document.getElementById("DOC_EL_TABBAR")?.classList.remove("hidden");
        document.getElementById("DOC_EL_HISTORY_ITEMS")?.classList.remove("active");
    }

    const on_scroll_down = () => {
        document.getElementById("DOC_EL_TOPBAR")?.classList.add("hidden");
        document.getElementById("DOC_EL_TABBAR")?.classList.add("hidden");
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

    const next_chapter: BibleRouteParams = {
        book: Number(chapter) == CONST_BOOKS_NUM_CHAPTERS[book!]
            ? (
                book == "REV" ? "GEN" : CONST_BOOKS_ARR[CONST_BOOKS_ARR.findIndex((v) => v == book) + 1]
            ) : book!,
        chapter: Number(chapter) == CONST_BOOKS_NUM_CHAPTERS[book!] ? "1" : String(Number(chapter) + 1),
        verse: "1"
    };

    const prev_chapter: BibleRouteParams = {
        book: Number(chapter) == 1
            ? (
                book == "GEN" ? "REV" : CONST_BOOKS_ARR[CONST_BOOKS_ARR.findIndex((v) => v == book) - 1]
            ) : book!,
        chapter: Number(chapter) == 1 ? (
            book == "GEN" ? String(CONST_BOOKS_NUM_CHAPTERS["REV"]) : String(CONST_BOOKS_NUM_CHAPTERS[CONST_BOOKS_ARR[CONST_BOOKS_ARR.findIndex((v) => v == book) - 1]])
        ) : String(Number(chapter) - 1),
        verse: "1"
    };

    const ChapterHeader = () => (
        <div className={`chapter-header`}>
            <div className={`book`}>{CONST_BOOK_SYMBOL_TO_NAME[book!]}</div>
            <div className={`chapter`}>{chapter}</div>
            <div id="DOC_EL_PAGINATION" className="horizontal-arrow">
                {
                    <div className={`item left`} onClick={() => { navigate(`${CONST_BIBLE_ROUTE}/${prev_chapter.book}/${prev_chapter.chapter}`) }}>
                        <Icon icon="basil:caret-left-outline" width="32" height="32" />
                        <div className="label">{`${prev_chapter.book} ${prev_chapter.chapter}`}</div>
                    </div>
                }
                {
                    <div className={`item right`} onClick={() => navigate(`${CONST_BIBLE_ROUTE}/${next_chapter.book}/${next_chapter.chapter}`)}>
                        <div className="label">{`${next_chapter.book} ${next_chapter.chapter}`}</div>
                        <Icon icon="basil:caret-right-outline" width="32" height="32" />
                    </div>
                }
            </div>
        </div>
    );

    const on_general_click = () => {
        document.getElementById("DOC_EL_CHAPTER_CONTAINER")!.scrollTo({ left: HOR_SCROLL_LEFT, behavior: "smooth" });
        document.getElementById("DOC_EL_CHAPTER_SETTINGS")?.classList.remove("open");
        document.getElementById("DOC_EL_HISTORY_ITEMS")?.classList.remove("active");
    }

    const handle_touch_end = (_: TouchEvent) => {
        const scroll_left = document.getElementById("DOC_EL_CHAPTER_CONTAINER")?.scrollLeft!;
        if (scroll_left < HOR_SCROLL_LEFT - 100) {
            navigate(`${CONST_BIBLE_ROUTE}/${prev_chapter.book}/${prev_chapter.chapter}`);
        }
        else if (scroll_left > HOR_SCROLL_LEFT + 100) {
            navigate(`${CONST_BIBLE_ROUTE}/${next_chapter.book}/${next_chapter.chapter}`);
        }

        on_general_click();
    }

    useEvent("touchend", handle_touch_end, [], document.getElementById("DOC_EL_CHAPTER_CONTAINER"));


    useEffect(() => {
        window.setTimeout(() => {
            document.getElementById("DOC_EL_CHAPTER_CONTAINER")!.scrollLeft = HOR_SCROLL_LEFT;
            document.getElementById("DOC_EL_PAGINATION")?.classList.add("active");
        }, 1000);
    })

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

            const data = await GetBSB<TranslationBookChapter>(`/api/BSB/${target_book}/${target_chapter}.json`);

            if (verse && Number(verse) > data.numberOfVerses) {
                navigate(`${CONST_BIBLE_ROUTE}/${target_book}/${target_chapter}`);
                return;
            }

            set_current_chapter(data);
            document.getElementById("DOC_EL_CHAPTER_CONTAINER")!.scrollTop = 0;
        }

        document.getElementById("DOC_EL_TOPBAR")?.classList.remove("hidden");
        Initialise();
    }, [book, chapter, verse]);

    return (
        <>
            <div id="DOC_EL_CHAPTER_CONTAINER" className={`chapter-container`} onClick={on_general_click}>
                <div className="filler" />
                <div className="content">
                    <div className="chapter-block">
                        <ChapterHeader />
                        {current_chapter ? <ChapterContent chapter={current_chapter} /> : <></>}
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