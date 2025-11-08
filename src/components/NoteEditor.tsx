import { Icon } from "@iconify/react";
import "./NoteEditor.scss";
import { useNoteProvider } from "../providers/note_provider";
import LexicalEditor from "./LexicalEditor";
import { createPortal } from "react-dom";
import { SHOW_CHAPTER_CURTAINS } from "./Chapter";
import { DEFAULT_BIBLE_ROUTE, TO_STRING } from "../types/bible_route";
import { ICON_SIZE_LARGE } from "../theme";
const NoteEditor = () => {
    const { pendingNote, setPendingNote } = useNoteProvider();

    return (
        createPortal(
            <div id="DOC_EL_NOTE_EDITOR" className="note-editor">
                <div className="editor">
                    <div className="top">
                        <div className="editor-topbar">
                            <div className="title">
                                <input
                                    type="text"
                                    inputMode="text"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    spellCheck="false"
                                    value={pendingNote?.title || ""}
                                    onChange={(e) => {
                                        if (!pendingNote) return;
                                        setPendingNote({ ...pendingNote, title: e.target.value });
                                    }}
                                />
                            </div>
                            <div className="exit">
                                <Icon icon="basil:cross-solid" width={ICON_SIZE_LARGE} height={ICON_SIZE_LARGE} onClick={() => {
                                    setPendingNote(null);
                                    document.getElementById("DOC_EL_NOTE_EDITOR")?.classList.remove("active");
                                    SHOW_CHAPTER_CURTAINS();
                                }} />
                            </div>
                        </div>
                        <div className="editor-config">
                            <div className="config-item start">{TO_STRING(pendingNote?.start ?? DEFAULT_BIBLE_ROUTE)}</div>
                            <div className="config-item end">{TO_STRING(pendingNote?.end ?? DEFAULT_BIBLE_ROUTE)}</div>
                            <div className="config-item visibility">Private</div>
                            <div className="config-item type">Insight</div>
                        </div>
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