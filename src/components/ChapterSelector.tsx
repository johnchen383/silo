import { useState } from 'react'
import { CONST_BIBLE_ROUTE, CONST_BOOK_SYMBOL_TO_NAME, CONST_BOOKS_NUM_CHAPTERS, CONST_CATEGORISED_BOOKS } from '../consts/bible_data';
import { useNavigate, useParams } from 'react-router-dom';
import "./ChapterSelector.scss";
import { Icon } from '@iconify/react';

const ChapterSelector = () => {
    const [selected_book, set_selected_book] = useState<string>("");
    const navigate = useNavigate();
    const { book } = useParams<{ book: string; chapter: string }>();

    return (
        <div id="DOC_EL_CHAPTER_SELECTOR" className="chapter-selector">
            <div className="container">
                <div className="navigation">
                    <Icon icon="basil:caret-down-outline" width="36" height="36" onClick={() => {
                        document.getElementById("DOC_EL_CHAPTER_SELECTOR")?.classList.remove("open");
                        window.setTimeout(() => {
                            set_selected_book("");
                            document.getElementById("DOC_EL_CHAPTER_SELECTOR")?.classList.remove("visible");
                        }, 300);
                    }} />
                </div>
                <div className="inner-container">
                    {selected_book
                        ? <>
                            <div className="category-title">{CONST_BOOK_SYMBOL_TO_NAME[selected_book]}</div>
                            <div className="chapters-container">
                                <div className='chapter-button active' onClick={() => set_selected_book("")}>{selected_book}</div>
                                {Array.from({ length: CONST_BOOKS_NUM_CHAPTERS[selected_book] }, (_, i) => i + 1).map((num) => (
                                    <div
                                        key={num}
                                        className={`chapter-button`}
                                        onClick={() => {
                                            navigate(`${CONST_BIBLE_ROUTE}/${selected_book}/${num}`);
                                            document.getElementById("DOC_EL_CHAPTER_SELECTOR")?.classList.remove("open");
                                            window.setTimeout(() => {
                                                set_selected_book("");
                                                document.getElementById("DOC_EL_CHAPTER_SELECTOR")?.classList.remove("visible");
                                            }, 300);
                                        }}>
                                        {num}
                                    </div>
                                ))}
                            </div>
                        </>
                        :
                        Object.entries(CONST_CATEGORISED_BOOKS).map(([category, books]) => (
                            <div key={category} className="book-category">
                                <div className="category-title">{category}</div>
                                <div className="books-container">
                                    {books.map((b) => (
                                        <div
                                            key={b}
                                            className={`book-button ${book?.toUpperCase() === b ? "active" : ""}`}
                                            onClick={() => set_selected_book(b)}
                                        >
                                            <div className="text">{b}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="spacer"></div>
        </div>
    )
}

export default ChapterSelector;