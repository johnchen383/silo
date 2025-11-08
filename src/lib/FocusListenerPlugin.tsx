import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    FOCUS_COMMAND,
    BLUR_COMMAND,
    COMMAND_PRIORITY_LOW
} from "lexical";
import { useEffect } from "react";

export function FocusListenerPlugin({ onFocus, onBlur }: { onFocus?: () => void; onBlur?: () => void }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        const unregisterFocus = editor.registerCommand(
            FOCUS_COMMAND,
            () => {
                onFocus?.();
                return false; // don't stop propagation
            },
            COMMAND_PRIORITY_LOW
        );

        const unregisterBlur = editor.registerCommand(
            BLUR_COMMAND,
            () => {
                onBlur?.();
                return false;
            },
            COMMAND_PRIORITY_LOW
        );

        return () => {
            unregisterFocus();
            unregisterBlur();
        };
    }, [editor, onFocus, onBlur]);

    return null;
}
