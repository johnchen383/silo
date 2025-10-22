import { useEffect, useState } from "react"
import { GetBSB } from "../api/bsb";
import type { ChapterVerse, TranslationBookChapter, ChapterVerseContent } from "../api/models";
import { useNavigate, useParams } from "react-router-dom";
import { CONST_BIBLE_ROUTE, CONST_BOOK_SYMBOL_TO_NAME, CONST_BOOKS, CONST_BOOKS_NUM_CHAPTERS, CONST_DEFAULT_CHAPTER_URL, TRANSLATION } from "../consts/bible_data";

import "./Chapter.scss";
import ChapterSelector from "./ChapterSelector";
import useEvent from "../hooks/useEvent";
import useScrollDirection from "../hooks/useScroll";
import { useAppProvider } from "../providers/app_provider";
const LineBreak: React.FC<{ small: boolean }> = ({ small }) => <span><br /><div className={`spacer ${small ? 'small' : ''}`}></div></span>;

import React from 'react'
import ChapterSettings from "./ChapterSettings";
import { useHistoryProvider } from "../providers/history_provider";
import type { BibleRouteParams } from "../types/bible_route";
import { Icon } from "@iconify/react";

interface ChapterContentProps {
    chapter: TranslationBookChapter;
}

export const ChapterContent = (props: ChapterContentProps) => {
    const { chapterContentViewSettings, setInApp } = useAppProvider();
    const { setLastChapterViewed } = useHistoryProvider();
    const [selected_verses, set_selected_verses] = useState<number[]>([]);
    const { book, chapter, verse } = useParams<BibleRouteParams>();

    useEffect(() => {
        set_selected_verses([]);
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

    useEffect(() => {
        if (chapterContentViewSettings.readingMode) {
            set_selected_verses([]);
        }
    }, [chapterContentViewSettings]);

    useEffect(() => {
        if (selected_verses.length == 0) {
            document.getElementById("DOC_EL_VERSE_TOOLTIP")?.classList.remove("active");
        }
    }, [selected_verses]);

    const handle_verse_click = (e: React.MouseEvent, verse_number: number) => {
        if (chapterContentViewSettings.readingMode) return;
        const tooltip = document.getElementById("DOC_EL_VERSE_TOOLTIP");
        if (!tooltip) return;

        if (selected_verses.length == 0) {
            set_selected_verses([verse_number]);
        }
        else if (selected_verses.length == 1) {
            if (selected_verses[0] == verse_number) {
                set_selected_verses([]);
                return;
            }
            else {
                const start = Math.min(selected_verses[0], verse_number);
                const end = Math.max(selected_verses[0], verse_number);
                set_selected_verses([start, end]);
            }
        }
        else if (selected_verses.length == 2) {
            if (selected_verses[0] == verse_number || selected_verses[1] == verse_number) {
                set_selected_verses([verse_number]);
            }
            else if (verse_number > selected_verses[0]) {
                // shift end post
                set_selected_verses([selected_verses[0], verse_number]);
            }
            else {
                // shift start post
                set_selected_verses([verse_number, selected_verses[1]]);
            }
        } else {
            set_selected_verses([]);
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();

        tooltip.classList.add("active");
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 50}px`;
    }

    const verse_selected = (verse_number: number): boolean => {
        if (selected_verses.length == 0) return false;
        if (selected_verses.length == 1) return selected_verses[0] == verse_number;
        if (selected_verses.length == 2) return verse_number >= selected_verses[0] && verse_number <= selected_verses[1];
        return false;
    }

    const Verse: React.FC<{ verse: ChapterVerse }> = ({ verse }) => {
        return (
            <span className={`verse ${verse_selected(verse.number) ? 'selected' : ''}`} onClick={(e) => handle_verse_click(e, verse.number)}>
                {!chapterContentViewSettings.manusriptMode ? <sup className={`verse-num`}>{verse.number}</sup> : <></>}
                {verse.content.map(VerseContent)}
            </span>
        );
    };

    const get_tooltip_text = () => {
        if (selected_verses.length == 0) return "";
        if (selected_verses.length == 1) return `v${selected_verses[0]}`;
        if (selected_verses.length == 2) return `v${selected_verses[0]}-${selected_verses[1]}`;
        return "";
    }

    const handle_copy = () => {
        if (selected_verses.length == 0) return;
        let verses_to_copy: ChapterVerse[] = [];
        if (selected_verses.length == 1) {
            verses_to_copy = props.chapter.chapter.content.filter(v => v.type === "verse" && v.number === selected_verses[0]) as ChapterVerse[];
        }
        else if (selected_verses.length == 2) {
            verses_to_copy = props.chapter.chapter.content.filter(v => v.type === "verse" && v.number >= selected_verses[0] && v.number <= selected_verses[1]) as ChapterVerse[];
        }

        const verses_string_to_copy = verses_to_copy.map(v => {
            const verse_text = v.content.map(c => {
                if (typeof c === "string") {
                    return c;
                }
                else if ("text" in c) {
                    return c.text;
                }
                return "";
            }).join(" ");
            return verse_text;
        }).join(" ").replace(/\s{2,}/g, ' ');

        const reference = `(${CONST_BOOK_SYMBOL_TO_NAME[book!]} ${chapter!}:${
            selected_verses.length == 1 ? selected_verses[0] : `${selected_verses[0]}\u2013${selected_verses[1]}`
        }, ${TRANSLATION})`

        navigator.clipboard.writeText(`${verses_string_to_copy} ${reference}\n\nSilo Bible: ${window.location.href}`);
        set_selected_verses([]);
    }

    return (
        <>
            <div className="verses">
                <div id="DOC_EL_VERSE_TOOLTIP" className={`tooltip`}>
                    <div className="text">{get_tooltip_text()}</div>
                    <span className="action copy" onClick={handle_copy}><Icon icon={"mynaui:copy"} width={"28px"} height={"28px"}/></span>
                </div>
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
    // TODO: implement verse logic
    const { book, chapter, verse } = useParams<BibleRouteParams>();
    const [current_chapter, set_current_chapter] = useState<TranslationBookChapter | null>(null);

    const navigate = useNavigate();

    const on_scroll_up = () => {
        document.getElementById("DOC_EL_TOPBAR")?.classList.remove("hidden");
        document.getElementById("DOC_EL_TABBAR")?.classList.remove("hidden");
        document.getElementById("DOC_EL_HISTORY_ITEMS")?.classList.remove("active");
        document.getElementById("DOC_EL_VERSE_TOOLTIP")?.classList.remove("active");
    }

    const on_scroll_down = () => {
        document.getElementById("DOC_EL_TOPBAR")?.classList.add("hidden");
        document.getElementById("DOC_EL_TABBAR")?.classList.add("hidden");
        document.getElementById("DOC_EL_HISTORY_ITEMS")?.classList.remove("active");
        document.getElementById("DOC_EL_VERSE_TOOLTIP")?.classList.remove("active");
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
                {/* <div className="filler" /> */}
                <div className="content">
                    <div className="chapter-block">
                        <ChapterHeader />
                        {current_chapter ? <ChapterContent chapter={current_chapter} /> :
                            <div className="loading">
                                <div className="bar"></div>
                            </div>
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