import { Icon } from "@iconify/react";
import "./NoteEditor.scss";
import { useNoteProvider } from "../providers/note_provider";
import { CONST_BOOK_SYMBOL_TO_NAME } from "../consts/bible_data";
import LexicalEditor from "./LexicalEditor";
import { createPortal } from "react-dom";
import { SHOW_CHAPTER_CURTAINS } from "./Chapter";
const NoteEditor = () => {
    const { pendingNote, setPendingNote } = useNoteProvider();

    return (
        createPortal(
            <div id="DOC_EL_NOTE_EDITOR" className="note-editor">
                <div className="editor">
                    <div className="exit">
                        <Icon icon="basil:cross-solid" width="36" height="36" onClick={() => {
                            setPendingNote(null);
                            document.getElementById("DOC_EL_NOTE_EDITOR")?.classList.remove("active");
                            SHOW_CHAPTER_CURTAINS();
                        }} />
                    </div>
                    <div className="heading">
                        {CONST_BOOK_SYMBOL_TO_NAME[pendingNote?.start.book!]} {pendingNote?.start.chapter}:{pendingNote?.start.verse}
                    </div>
                    <div className="content">
                        <LexicalEditor
                            initialValue={pendingNote?.content}
                            onChange={(newContent) => {
                                if (!pendingNote) return;
                                setPendingNote({ ...pendingNote, content: newContent });
                            }}
                        />
                    </div>
                </div>
            </div>,
            document.body
        )
    )
}

export default NoteEditor