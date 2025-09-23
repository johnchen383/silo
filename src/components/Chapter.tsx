import { useEffect, useState } from "react"
import { GetBSB } from "../api/bsb";
import type { ChapterVerse, TranslationBookChapter } from "../api/models";
import { useNavigate, useParams } from "react-router-dom";
import { CONST_BIBLE_ROUTE, CONST_BOOKS, CONST_BOOKS_NUM_CHAPTERS, CONST_DEFAULT_CHAPTER_URL } from "../consts/bible_data";

import "./Chapter.scss";

const ChapterHeader: React.FC<{ book: string, number: number }> = ({ book, number }) => (
    <div className="chapter-header">
        <div className="book">{book}</div>
        <div className="chapter">{number}</div>
    </div>
);

const LineBreak: React.FC<{idx: number}> = ({ idx }) => <span key={idx}><br/><div className="spacer"></div></span>;

const Verse: React.FC<{ verse: ChapterVerse }> = ({ verse }) => {
    return (
        <span className="verse">
            <sup className="verse-num">{verse.number}</sup>
            {verse.content.map((c, i) => {
                if (typeof c === "string") {
                    return (
                        <span key={i} className="text">
                            {c}
                        </span>
                    );
                }

                // Handle other types
                if ("text" in c) {
                    return (
                        <span key={i} className={`text ${c.poem ? "poem" : ""} ${c.wordsOfJesus ? "red" : ""} `}>
                            {c.text}
                        </span>
                    );
                }

                if ("heading" in c) {
                    return (
                        <span key={i} className="inline-heading">
                            {c.heading}
                        </span>
                    );
                }

                if ("lineBreak" in c) {
                    return <LineBreak idx={i} />;;
                }

                if ("footnoteRef" in c) {
                    return (
                        <sup key={i} className="footnote">
                            TODO
                        </sup>
                    );
                }

                // fallback
                return null;
            })}
        </span>
    );
};

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
                                // Only skip <br /> if the previous element exists and was a heading
                                if (idx > 0 && arr[idx - 1].type === "heading") {
                                    return null;
                                }
                                return <LineBreak idx={idx} />;
                            }

                            if (cont.type === "hebrew_subtitle") {
                                return (
                                    <h4 key={idx} className="hebrew-subtitle">
                                        TODO: HEBREW
                                    </h4>
                                );
                            }

                            return null;
                        })}

                    </div>
                </div>
            ))}
        </div>
    )
}

export default Chapter