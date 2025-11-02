import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import "./LexicalEditor.scss";

type LexicalEditorProps = {
    initialValue?: string;
    onChange?: (content: string) => void;
};

const theme = {
    paragraph: "editor-paragraph",
};

function onError(error: Error) {
    console.error(error);
}

function InitialisePlugin({ initialValue }: { initialValue: string }) {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        editor.update(() => {
            const root = $getRoot();
            root.clear();
            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode(initialValue));
            root.append(paragraph);
        });
    }, [editor]);
    return null;
}

function EditorInner({ initialValue, onChange }: LexicalEditorProps) {
    return (
        <div className="editor-container">
            <RichTextPlugin
                contentEditable={<ContentEditable className="editor-input" />}
                placeholder={<div className="editor-placeholder">Write your note…</div>}
                ErrorBoundary={LexicalErrorBoundary}
            />
            <InitialisePlugin initialValue={initialValue || ""} />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <OnChangePlugin
                onChange={(editorState) => {
                    editorState.read(() => {
                        const root = $getRoot();
                        const textContent = root.getTextContent();
                        onChange?.(textContent);
                    });
                }}
            />
        </div>
    );
}

export default function LexicalEditor({ initialValue, onChange }: LexicalEditorProps) {
    return (
        <LexicalComposer
            initialConfig={{
                namespace: "NoteEditor",
                theme,
                onError,
            }}
        >
            <EditorInner initialValue={initialValue} onChange={onChange} />
        </LexicalComposer>
    );
}
