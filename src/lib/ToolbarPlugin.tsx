import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useState } from 'react';
import "./ToolbarPlugin.scss";
import { Icon } from '@iconify/react';
import { ICON_SIZE } from '../theme';
import useEvent from '../hooks/useEvent';
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';

export default function ToolbarPlugin({ visible }: { visible: boolean }) {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isHeading, setIsHeading] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsUnderline(selection.hasFormat('underline'));

      const anchorNode = selection.anchor.getNode();
      const topLevel = anchorNode.getTopLevelElementOrThrow();
      setIsHeading($isHeadingNode(topLevel) && topLevel.getTag() === 'h1');
    }
  }, []);

  useEvent("mousedown", (e: any) => {
    e.preventDefault();
  }, [], document.getElementById("DOC_EL_NOTE_TOOLBAR"));

  const toggle_heading = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const anchorNode = selection.anchor.getNode();
      const parent = anchorNode.getTopLevelElementOrThrow();

      if ($isHeadingNode(parent) && parent.getTag() === 'h1') {
        $setBlocksType(selection, () => $createParagraphNode());
      } else {
        $setBlocksType(selection, () => $createHeadingNode('h1'));
      }
    });
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(
          () => {
            $updateToolbar();
          },
          { editor },
        );
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateToolbar]);

  return (
    <div id='DOC_EL_NOTE_TOOLBAR' className={`toolbar ${visible ? '' : 'hide'}`}>
      <button
        disabled={!canUndo}
        onClick={() => {
          if (!canUndo) return;
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label="Undo">
        <Icon icon={`majesticons:undo-line`} height={ICON_SIZE} width={ICON_SIZE} />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          if (!canRedo) return;
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="Redo">
        <Icon icon={`majesticons:redo-line`} height={ICON_SIZE} width={ICON_SIZE} />
      </button>
      <button
        onClick={() => {
          toggle_heading();
        }}
        className={'toolbar-item spaced ' + (isHeading ? 'active' : '')}
        aria-label="Format Heading">
        <Icon icon={`mingcute:heading-1-line`} height={ICON_SIZE} width={ICON_SIZE} />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
        aria-label="Format Bold">
        <Icon icon={`mingcute:bold-line`} height={ICON_SIZE} width={ICON_SIZE} />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
        aria-label="Format Underline">
        <Icon icon={`mingcute:underline-line`} height={ICON_SIZE} width={ICON_SIZE} />
      </button>
    </div>
  );
}
