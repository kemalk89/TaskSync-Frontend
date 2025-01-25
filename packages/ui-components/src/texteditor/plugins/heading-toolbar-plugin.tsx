import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { $isHeadingNode, HeadingTagType } from "@lexical/rich-text";
import {
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconH5,
  IconH6,
} from "../../icons/icons.js";
import { useCallback, useEffect, useState } from "react";
import { mergeRegister } from "@lexical/utils";
import { LowPriority } from "./constants.js";
import { Select, SelectOption } from "../../select/select.js";

const SELECT_OPTION_P = { value: "paragraph", label: "Normal Text" };

export const HeadingToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState<SelectOption>(SELECT_OPTION_P);

  const SELECT_OPTIONS: SelectOption[] = [
    SELECT_OPTION_P,
    {
      value: "h1",
      label: "Heading 1",
      icon: (option) => renderIcon(option.value as HeadingTagType),
    },
    {
      value: "h2",
      label: "Heading 2",
      icon: (option) => renderIcon(option.value as HeadingTagType),
    },
    {
      value: "h3",
      label: "Heading 3",
      icon: (option) => renderIcon(option.value as HeadingTagType),
    },
    {
      value: "h4",
      label: "Heading 4",
      icon: (option) => renderIcon(option.value as HeadingTagType),
    },
    {
      value: "h5",
      label: "Heading 5",
      icon: (option) => renderIcon(option.value as HeadingTagType),
    },
    {
      value: "h6",
      label: "Heading 6",
      icon: (option) => renderIcon(option.value as HeadingTagType),
    },
  ];

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        const type = $isHeadingNode(element)
          ? element.getTag()
          : element.getType();

        const selectedOption = SELECT_OPTIONS.find((i) => i.value === type);
        setBlockType(selectedOption ?? SELECT_OPTION_P);
      }
    }
  }, [editor, SELECT_OPTIONS]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (/* _payload, newEditor */) => {
          updateToolbar();
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  const handleChangeBlockType = (selectedBlockType: SelectOption) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (selectedBlockType.value.startsWith("h")) {
          /*
          $setBlocksType(selection, () =>
            $createHeadingNode(selectedBlockType.value as HeadingTagType)
          );
          */
        } else if (selectedBlockType.value === SELECT_OPTION_P.value) {
          if (blockType.value !== "paragraph") {
            editor.update(() => {
              const selection = $getSelection();

              if ($isRangeSelection(selection)) {
                //$wrapNodes(selection, () => $createParagraphNode());
              }
            });
          }
        }
      }
    });
  };

  const renderIcon = (tag: HeadingTagType) => {
    switch (tag) {
      case "h1":
        return <IconH1 />;
      case "h2":
        return <IconH2 />;
      case "h3":
        return <IconH3 />;
      case "h4":
        return <IconH4 />;
      case "h5":
        return <IconH5 />;
      case "h6":
        return <IconH6 />;
    }
  };

  return (
    <>
      <Select
        options={SELECT_OPTIONS}
        defaultValue={blockType}
        value={blockType}
        onChange={(item) => handleChangeBlockType(item ?? SELECT_OPTION_P)}
      />
    </>
  );
};
