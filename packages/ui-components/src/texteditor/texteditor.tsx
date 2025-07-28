"use client";

import { EditorContent, useEditorState, Editor } from "@tiptap/react";
import {
  IconBold,
  IconCode,
  IconH1,
  IconH2,
  IconH3,
  IconItalic,
  IconListOl,
  IconListUl,
} from "../icons/icons";
import { Button, ButtonGroup } from "react-bootstrap";

import styles from "./styles.module.scss";

type Props = {
  editor: Editor | null;
};

/**
 * TODO:
 * - Mentions: https://tiptap.dev/docs/examples/advanced/mentions
 */
export const TextEditor = ({ editor }: Props) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor?.isActive("bold"),
        isItalic: ctx.editor?.isActive("italic"),
        isCode: ctx.editor?.isActive("code"),
        isParagraph: ctx.editor?.isActive("paragraph"),
        isHeading1: ctx.editor?.isActive("heading", { level: 1 }),
        isHeading2: ctx.editor?.isActive("heading", { level: 2 }),
        isHeading3: ctx.editor?.isActive("heading", { level: 3 }),
        isBulletList: ctx.editor?.isActive("bulletList"),
        isNumberedList: ctx.editor?.isActive("orderedList"),
        isCodeBlock: ctx.editor?.isActive("codeBlock"),
      };
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div>
      <div>
        <div className={styles.editorContainer}>
          <div className="mb-4 d-flex gap-2">
            <ButtonGroup>
              <Button
                title="Normal Text"
                onClick={() => editor?.chain().focus().setParagraph().run()}
                variant={"outline-secondary"}
              >
                Normal text
              </Button>
              <Button
                title="Headline 1"
                active={editorState?.isHeading1}
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 1 }).run()
                }
                variant={"outline-secondary"}
              >
                <IconH1 />
              </Button>
              <Button
                title="Headline 2"
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }
                active={editorState?.isHeading2}
                variant={"outline-secondary"}
              >
                <IconH2 />
              </Button>
              <Button
                title="Headline 3"
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 3 }).run()
                }
                active={editorState?.isHeading3}
                variant={"outline-secondary"}
              >
                <IconH3 />
              </Button>
            </ButtonGroup>

            <ButtonGroup>
              <Button
                title="Bold"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                disabled={!editor?.can().chain().focus().toggleBold().run()}
                active={editorState?.isBold}
                variant={"outline-secondary"}
              >
                <IconBold />
              </Button>
              <Button
                title="Italic"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                disabled={!editor?.can().chain().focus().toggleItalic().run()}
                active={editorState?.isItalic}
                variant={"outline-secondary"}
              >
                <IconItalic />
              </Button>
              <Button
                title="Inline code"
                onClick={() => editor?.chain().focus().toggleCode().run()}
                disabled={!editor?.can().chain().focus().toggleCode().run()}
                active={editorState?.isCode}
                variant={"outline-secondary"}
              >
                <IconCode />
              </Button>
            </ButtonGroup>

            <ButtonGroup>
              <Button
                title="Bullet list"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                active={editorState?.isBulletList}
                variant={"outline-secondary"}
              >
                <IconListUl width={24} height={24} />
              </Button>
              <Button
                title="Numbered list"
                onClick={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
                active={editorState?.isNumberedList}
                variant={"outline-secondary"}
              >
                <IconListOl width={24} height={24} />
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button
                title="Code block"
                onClick={() => editor?.chain().focus().setCodeBlock().run()}
                active={editorState?.isCodeBlock}
                variant={"outline-secondary"}
              >
                <IconCode />
              </Button>
            </ButtonGroup>
          </div>

          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};
