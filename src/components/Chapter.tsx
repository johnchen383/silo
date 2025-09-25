import { useEffect, useRef, useState } from "react"
import { GetBSB } from "../api/bsb";
import type { ChapterVerse, TranslationBookChapter, ChapterVerseContent } from "../api/models";
import { useNavigate, useParams } from "react-router-dom";
import { CONST_BIBLE_ROUTE, CONST_BOOKS, CONST_BOOKS_NUM_CHAPTERS, CONST_DEFAULT_CHAPTER_URL } from "../consts/bible_data";

import "./Chapter.scss";
// import { useAuth } from "../providers/auth_provider";
// import { supabase } from "../supabase";

const ChapterHeader: React.FC<{ book: string, number: number }> = ({ book, number }) => (
    <div className="chapter-header">
        <div className="book">{book}</div>
        <div className="chapter">{number}</div>
    </div>
);

const LineBreak: React.FC<{ idx: number, small: boolean }> = ({ idx, small }) => <span key={idx}><br /><div className={`spacer ${small ? 'small' : ''}`}></div></span>;


const Chapter = () => {
    // TODO: implement verse logic
    type BibleRouteParams = {
        book: string;
        chapter: string;
        verse: string;
    };

    const { book, chapter, verse } = useParams<BibleRouteParams>();
    const [current_chapters, set_current_chapters] = useState<TranslationBookChapter[]>([]);
    const navigate = useNavigate();
    const footnote_ref = useRef<HTMLDivElement>(null);

    // const {user} = useAuth();

    // const handleAddNote = async () => {
    //     if (!user) return;

    //     const { error } = await supabase.from("notes").insert([
    //         {
    //             user_id: user.id,
    //             content: "Test note",
    //         },
    //     ]);

    //     if (error) {
    //         console.error("Error inserting note:", error);
    //     }
    // };


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
                <span
                    key={i}
                    className={`text ${c.poem ? `poem ${i === 0 ? "" : "indented"} ${(i === 0 || next_element_footnote) ? "" : "breakup"}` : ""
                        } ${c.wordsOfJesus ? "red" : ""}`}
                >
                    {c.text}
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
            return <LineBreak key={i} idx={i} small={false} />;
        }

        if ("noteId" in c) {
            return (
                <sup key={i} className="footnote" onClick={ScrollToBottom}>
                    {c.noteId + 1}
                </sup>
            );
        }

        return null;
    }

    const Verse: React.FC<{ verse: ChapterVerse }> = ({ verse }) => {
        return (
            <span className="verse">
                <sup className="verse-num">{verse.number}</sup>
                {verse.content.map(VerseContent)}
            </span>
        );
    };

    const ScrollToBottom = () => {
        footnote_ref.current?.scrollIntoView({ behavior: "smooth" });
    };

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

            set_current_chapters([data]);
        }

        Initialise();
    }, [book, chapter, verse]);

    return (
        <div className="chapter-container">
            {current_chapters.map((c, i) => (
                <div key={i} className="chapter-block">
                    <ChapterHeader book={c.book.name} number={c.chapter.number} />
                    <div className="verses">
                        {c.chapter.content.map((cont, idx, arr) => {
                            if (cont.type === "heading") {
                                return (
                                    <h3 key={idx} className="chapter-subheading">
                                        {cont.content}
                                    </h3>
                                );
                            }

                            if (cont.type === "verse") {
                                return <Verse key={idx} verse={cont} />;
                            }

                            if (cont.type === "line_break") {
                                if (idx > 0 && (arr[idx - 1].type === "heading" || arr[idx - 1].type === "hebrew_subtitle" || arr[idx - 1].type === "line_break")) {
                                    return null;
                                }
                                return <LineBreak idx={idx} small={false} />;
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
                    <div className="footnotes" ref={i === 0 ? footnote_ref : null}>
                        {c.chapter.footnotes.map((note, idx) => {
                            return (
                                <div key={idx} className="footnote-container">
                                    <sup className="footnote-num">{note.noteId + 1}</sup>
                                    <span className="footnote-text">{note.text}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Chapter