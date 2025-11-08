import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";
import { useEffect } from "react";

export function InitialisePlugin({ initialValue }: { initialValue: string }) {
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