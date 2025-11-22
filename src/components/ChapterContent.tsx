import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNoteProvider } from "../providers/note_provider";
import { useAppProvider } from "../providers/app_provider";
import { useHistoryProvider } from "../providers/history_provider";
import "./ChapterContent.scss";
import type { ChapterVerse, ChapterVerseContent, TranslationBookChapter } from "../api/models";
import { TO_STRING, type BibleRouteParams } from "../types/bible_route";
import { TRANSLATION } from "../consts/bible_data";
import { ICON_SIZE } from "../theme";
import { Icon } from "@iconify/react";

const LineBreak: React.FC<{ small: boolean }> = ({ small }) => <span><br /><div className={`spacer ${small ? 'small' : ''}`}></div></span>;

interface ChapterContentProps {
    chapter_data: TranslationBookChapter;
    embedded: boolean;
}

export const ChapterContent = ({ chapter_data, embedded }: ChapterContentProps) => {
    const num_verses = chapter_data.chapter.content.filter(c => c.type == "verse").length;
    const { chapterContentViewSettings, setInApp } = useAppProvider();
    const { setLastChapterViewed } = useHistoryProvider();
    const [selected_verses, set_selected_verses] = useState<number[]>([]);
    const { book, chapter, verse } = useParams<BibleRouteParams>();
    const { pendingNote, setPendingNote } = useNoteProvider();
    const [highlights, set_highlights] = useState<number[]>(Array(num_verses + 1).fill(0));

    const highlight = (verse_num: number, highlight_index: number) => {
        set_highlights(highlights => {
            const next = [...highlights];
            next[verse_num] = highlight_index;
            return next;
        });
    }

    const highlight_colour = (verse_num: number): string => {
        const highlight_index = highlights[verse_num];
        switch (highlight_index) {
            case 1:
                return "#FFF9B0";
            default:
                return "none";
        }
    }

    useEffect(() => {
        clear_tooltip_interaction();
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
            clear_tooltip_interaction();
        }
    }, [chapterContentViewSettings]);

    const clear_tooltip_interaction = () => {
        document.getElementById("DOC_EL_VERSE_TOOLTIP")?.classList.remove("active");
        window.setTimeout(() => { set_selected_verses([]); }, 300);
    }

    const handle_verse_click = (_: React.MouseEvent, verse_number: number) => {
        if (embedded) return;
        if (chapterContentViewSettings.readingMode) return;
        const tooltip = document.getElementById("DOC_EL_VERSE_TOOLTIP");
        if (!tooltip) return;

        if (selected_verses.length == 0) {
            set_selected_verses([verse_number]);
        }
        else if (selected_verses.length == 1) {
            if (selected_verses[0] == verse_number) {
                clear_tooltip_interaction();
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
            clear_tooltip_interaction();
            return;
        }

        if (pendingNote) return;

        tooltip.classList.add("active");
        tooltip.style.top = `${window.innerHeight / 2 - tooltip.getBoundingClientRect().height / 2}px`;
    }

    const verse_selected = (verse_number: number): boolean => {
        if (selected_verses.length == 0) return false;
        if (selected_verses.length == 1) return selected_verses[0] == verse_number;
        if (selected_verses.length == 2) return verse_number >= selected_verses[0] && verse_number <= selected_verses[1];
        return false;
    }

    const Verse: React.FC<{ verse: ChapterVerse }> = ({ verse }) => {
        return (
            <span id={`DOC_EL_VERSE_${verse.number}${embedded ? '_EMBED' : ''}`} className={`verse ${verse_selected(verse.number) ? 'selected' : ''} ${embedded ? 'embedded' : ''}`}
                style={{ backgroundColor: highlight_colour(verse.number) }}
                onClick={(e) => handle_verse_click(e, verse.number)}>
                {!chapterContentViewSettings.manusriptMode ? <sup className={`verse-num`}>{verse.number}</sup> : <></>}
                {verse.content.map(VerseContent)}
            </span>
        );
    };

    const get_tooltip_text = () => {
        if (selected_verses.length == 0) return "1";
        if (selected_verses.length == 1) return `${selected_verses[0]}`;
        if (selected_verses.length == 2) return `${selected_verses[0]}\u2013${selected_verses[1]}`;
        return "1";
    }

    const handle_copy = () => {
        if (selected_verses.length == 0) return;
        let verses_to_copy: ChapterVerse[] = [];
        if (selected_verses.length == 1) {
            verses_to_copy = chapter_data.chapter.content.filter(v => v.type === "verse" && v.number === selected_verses[0]) as ChapterVerse[];
        }
        else if (selected_verses.length == 2) {
            verses_to_copy = chapter_data.chapter.content.filter(v => v.type === "verse" && v.number >= selected_verses[0] && v.number <= selected_verses[1]) as ChapterVerse[];
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

        const start: BibleRouteParams = {
            book: book!,
            chapter: chapter!,
            verse: String(selected_verses[0]),
        }

        const reference = `(${TO_STRING(start, false, selected_verses.length == 1 ? null : selected_verses[1])}, ${TRANSLATION})`

        navigator.clipboard.writeText(`${verses_string_to_copy} ${reference}\n\nSilo Bible: ${window.location.href}`);
        clear_tooltip_interaction();
    }

    const handle_note = () => {
        document.getElementById("DOC_EL_NOTE_EDITOR")?.classList.add("active");

        const start: BibleRouteParams = {
            book: book!,
            chapter: chapter!,
            verse: String(selected_verses[0]),
        }

        const title_suffix = TO_STRING(start, false, selected_verses.length == 1 ? null : selected_verses[1]);

        const today = new Date();
        const date_prefix = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear().toString().slice(-2)}`;

        setPendingNote({
            start: start,
            end: {
                book: book!,
                chapter: chapter!,
                verse: String(selected_verses.length == 2 ? selected_verses[1] : selected_verses[0]),
            },
            content: "",
            title: `${date_prefix} ${title_suffix}`,
        });

        clear_tooltip_interaction();
    };

    const handle_highlight = () => {
        // FIXME: toggle highlight logic is broken
        const highlight_index = highlights[selected_verses[0]] > 0 ? 0 : 1;
        for (let i = selected_verses[0]; i <= (selected_verses.length == 2 ? selected_verses[1] : selected_verses[0]); i++) {
            // toggle
            highlight(i, highlight_index);
        }
    }

    return (
        <>
            <div className={`chapter-content-verses ${embedded ? 'embedded' : ''}`}>
                {!embedded &&
                    <div id="DOC_EL_VERSE_TOOLTIP" className={`tooltip`}>
                        <div className="text">
                            <div className="top">{selected_verses.length < 2 ? "verse" : "verses"}</div>
                            <div className="bottom">{get_tooltip_text()}</div>
                        </div>
                        <span className="action copy" onClick={handle_copy}>
                            <Icon icon={"mynaui:copy"} width={ICON_SIZE} height={ICON_SIZE} />
                            <div className="label">Copy</div>
                        </span>
                        <span className="action highlight" onClick={handle_highlight}>
                            <Icon icon={"tabler:circle-dotted"} width={ICON_SIZE} height={ICON_SIZE} />
                            <div className="label">Mark</div>
                        </span>
                        <span className="action note" onClick={handle_note}>
                            <Icon icon={"proicons:note"} width={ICON_SIZE} height={ICON_SIZE} />
                            <div className="label">Note</div>
                        </span>
                    </div>
                }
                {chapter_data.chapter.content.map((cont, idx, arr) => {
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
                {!embedded &&
                    <div className={`footnotes`}>
                        {chapter_data.chapter.footnotes.map((note, idx) => {
                            return (
                                <div key={idx} className="footnote-container">
                                    <sup className="footnote-num">{note.noteId + 1}</sup>
                                    <span className="footnote-text">{note.text}</span>
                                </div>
                            )
                        })}
                    </div>
                }
            </div>
        </>
    )
}