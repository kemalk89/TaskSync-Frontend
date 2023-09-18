import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  TextFormatType,
} from "lexical";
import { mergeRegister } from "@lexical/utils";
import { useCallback, useEffect, useState } from "react";
import { Button } from "reactstrap";
import {
  IconBold,
  IconCode,
  IconItalic,
  IconStrikethrough,
  IconUnderline,
} from "../..";
import { LowPriority } from "./constants";

export const TextFormatPlugin = () => {
  const [editor] = useLexicalComposerContext();

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (/* _payload, newEditor*/) => {
          updateToolbar();
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  const onClickFormat = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  return (
    <>
      <Button
        outline
        className={isBold ? "active" : ""}
        onClick={() => onClickFormat("bold")}
      >
        <IconBold />
      </Button>
      <Button
        outline
        className={isItalic ? "active" : ""}
        onClick={() => onClickFormat("italic")}
      >
        <IconItalic />
      </Button>
      <Button
        outline
        className={isUnderline ? "active" : ""}
        onClick={() => onClickFormat("underline")}
      >
        <IconUnderline />
      </Button>
      <Button
        outline
        className={isStrikethrough ? "active" : ""}
        onClick={() => onClickFormat("strikethrough")}
      >
        <IconStrikethrough />
      </Button>
      <Button
        outline
        className={isCode ? "active" : ""}
        onClick={() => onClickFormat("code")}
      >
        <IconCode />
      </Button>
    </>
  );
};
