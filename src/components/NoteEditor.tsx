import { Icon } from "@iconify/react";
import "./NoteEditor.scss";
import { useNoteProvider } from "../providers/note_provider";
import LexicalEditor from "./LexicalEditor";
import { createPortal } from "react-dom";
import { SHOW_CHAPTER_CURTAINS } from "./Chapter";
import { DEFAULT_BIBLE_ROUTE, TO_STRING } from "../types/bible_route";
import { ICON_SIZE, ICON_SIZE_LARGE } from "../theme";
import { useEffect, useState } from "react";
import type { TranslationBookChapter } from "../api/models";
import { GetBSB } from "../api/bsb";
import { TRANSLATION } from "../consts/bible_data";
import { ChapterContent } from "./ChapterContent";

const SmoothSnap = (anchor_verse: number) => {
    // smooth scroll
    const container = document.getElementById("DOC_EL_EDITOR_PREVIEW_CONTAINER");
    const child = document.getElementById(`DOC_EL_VERSE_${anchor_verse}_EMBED`);

    if (!container || !child) return;

    const containerRect = container.getBoundingClientRect();
    const childRect = child.getBoundingClientRect();
    const scrollTop = container.scrollTop + (childRect.top - containerRect.top) - 13;
    container.scrollTo({ top: scrollTop, behavior: 'smooth' });
}

const NoteEditor = () => {
    const { pendingNote, setPendingNote } = useNoteProvider();
    const [preview_chapter, set_preview_chapter] = useState<TranslationBookChapter | null>(null);

    useEffect(() => {
        if (!pendingNote) return;
        if (preview_chapter) return;

        const Initialise = async () => {
            const data = await GetBSB<TranslationBookChapter>(`/api/${TRANSLATION}/${pendingNote.start.book}/${pendingNote.start.chapter}.json`);
            set_preview_chapter(data);
            window.setTimeout(() => SmoothSnap(Number(pendingNote.start.verse)), 100);
        }

        Initialise();
    }, [pendingNote, preview_chapter])

    return (
        createPortal(
            <div id="DOC_EL_NOTE_EDITOR" className="note-editor">
                <div className="editor">
                    <div className="top">
                        <div className="editor-top">
                            <div className="editor-topbar">
                                <div className="title">
                                    <input
                                        name="title"
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
                                        set_preview_chapter(null);
                                        document.getElementById("DOC_EL_NOTE_EDITOR")?.classList.remove("active");
                                        SHOW_CHAPTER_CURTAINS();
                                    }} />
                                </div>
                            </div>
                            <div className="editor-config">
                                <div className="references">
                                    <div className="config-item start clickable" onClick={() => SmoothSnap(Number(pendingNote?.start.verse ?? 1))}>{TO_STRING(pendingNote?.start ?? DEFAULT_BIBLE_ROUTE)}</div>
                                    <Icon icon="mynaui:arrow-right" width={ICON_SIZE} height={ICON_SIZE}/>
                                    <div className="config-item end clickable" onClick={() => SmoothSnap(Number(pendingNote?.end.verse ?? 1))}>{TO_STRING(pendingNote?.end ?? DEFAULT_BIBLE_ROUTE)}</div>
                                </div>
                                <div className="post-btn">
                                    <div className="text">Save</div>
                                    <Icon icon="prime:send" width={ICON_SIZE} height={ICON_SIZE}/>
                                </div>
                                {/* <div className="config-item visibility clickable">Private</div>
                                <div className="config-item type clickable">
                                    <Dropdown
                                        isOpen={note_type_dropdown_open}
                                        unique="note-type-dropdown"
                                        options={["Highlight", "Note", "Bookmark"]}
                                        selectedOption={note_type}
                                        setIsOpen={(isOpen) => set_note_type_dropdown_open(isOpen)}
                                        setSelectedOption={(option) => set_note_type(option as NoteType)}
                                        label=""
                                        menuHeader=""
                                    />
                                </div> */}

                            </div>
                        </div>
                        <div id="DOC_EL_EDITOR_PREVIEW_CONTAINER" className="editor-preview">
                            {
                                preview_chapter && <ChapterContent chapter_data={preview_chapter} embedded={true} />
                            }
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