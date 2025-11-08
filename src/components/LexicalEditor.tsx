import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { $getRoot} from "lexical";
import "./LexicalEditor.scss";
import ToolbarPlugin from "../lib/ToolbarPlugin";
import { InitialisePlugin } from "../lib/InitialisePlugin";
import { FocusListenerPlugin } from "../lib/FocusListenerPlugin";
import { useState } from "react";

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


function EditorInner({ initialValue, onChange }: LexicalEditorProps) {
    return (
        <div className="editor-inner">
            <RichTextPlugin
                contentEditable={<ContentEditable className="editor-input" />}
                ErrorBoundary={LexicalErrorBoundary}
            />
            <InitialisePlugin initialValue={initialValue || ""} />
            <HistoryPlugin />
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
    const [showToolbar, setShowToolbar] = useState(false);

    return (
        <LexicalComposer
            initialConfig={{
                namespace: "NoteEditor",
                theme,
                onError,
            }}
        >
            <FocusListenerPlugin onFocus={() => setShowToolbar(true)} onBlur={() => setShowToolbar(false)} />
            <div className="editor-container">
                <EditorInner initialValue={initialValue} onChange={onChange} />
                <ToolbarPlugin visible={showToolbar} />
            </div>
        </LexicalComposer>
    );
}
