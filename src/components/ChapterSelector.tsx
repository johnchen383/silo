import { useState } from 'react'
import { CONST_BIBLE_ROUTE, CONST_BOOKS, CONST_BOOKS_NUM_CHAPTERS } from '../consts/bible_data';
import { useNavigate, useParams } from 'react-router-dom';
import "./ChapterSelector.scss";

const ChapterSelector = () => {
    const [selected_book, set_selected_book] = useState<string>("");
    const navigate = useNavigate();
    const { book, chapter } = useParams<{ book: string; chapter: string }>();

    return (
        <div id="DOC_EL_CHAPTER_SELECTOR" className="chapter-selector">
            {selected_book
                ? Array.from({ length: CONST_BOOKS_NUM_CHAPTERS[selected_book] }, (_, i) => i + 1).map((num) => (
                    <button
                        key={num}
                        className={`chapter-button ${Number(chapter) === num ? "active" : ""}`}
                        onClick={() => {
                            document.getElementById("DOC_EL_CHAPTER_SELECTOR")?.classList.remove("open");
                            navigate(`${CONST_BIBLE_ROUTE}/${selected_book}/${num}`);
                            window.setTimeout(() => {
                                set_selected_book("");
                                document.getElementById("DOC_EL_CHAPTER_SELECTOR")?.classList.remove("visible");
                            }, 300);
                        }}>
                        {num}
                    </button>
                ))
                :
                Array.from(CONST_BOOKS).map((b, i) => (
                    <button
                        key={i}
                        className={`book-button ${book?.toUpperCase() === b ? "active" : ""}`}
                        onClick={() => set_selected_book(b)}
                    >
                        {b}
                    </button>
                ))}
        </div>
    )
}

export default ChapterSelector