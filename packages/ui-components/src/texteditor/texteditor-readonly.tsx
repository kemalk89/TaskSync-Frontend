"use client";

import { Content, EditorContent } from "@tiptap/react";

import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { TextEditor } from "./texteditor";
import { Button } from "react-bootstrap";
import { useTextEditor } from "./use-texteditor";

type Props = {
  content?: Content;
  placeholder?: string;
  isSubmitting?: boolean;
  isSuccess?: boolean;
  onSubmit?: (newContent: object) => void;
};

export const TextEditorReadonly = ({
  content,
  placeholder,
  isSubmitting,
  isSuccess,
  onSubmit,
}: Props) => {
  const [editMode, setEditMode] = useState<boolean>();
  const editor = useTextEditor({
    content: getContent(content),
  });

  // enter read mode because the submit process has finished successfully
  useEffect(() => {
    if (isSuccess) {
      setEditMode(false);
    }
  }, [isSuccess]);

  // set focus into editor on switch into edit mode
  useEffect(() => {
    if (editMode) {
      editor?.commands.focus("start");
    }
  }, [editMode, editor]);

  if (!editor) {
    return null;
  }

  if (editMode) {
    return (
      <div>
        <TextEditor editor={editor} />
        <div className="mt-2">
          <Button
            variant="primary"
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              if (typeof onSubmit === "function") {
                const json = editor.getJSON();
                onSubmit(json);
              }
            }}
          >
            Speichern
          </Button>{" "}
          <Button
            variant="light"
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              setEditMode(false);
              editor.commands.setContent(getContent(content));
            }}
          >
            Abbrechen
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div
      className={styles.readonlyTextEditor}
      onClick={() => setEditMode(true)}
    >
      {editor.isEmpty && placeholder && (
        <span className="text-secondary">{placeholder}</span>
      )}

      <EditorContent editor={editor} />
    </div>
  );
};

const getContent = (content?: Content) => {
  const isEmptyString =
    typeof content === "string" && content.trim().length === 0;
  if (isEmptyString) {
    return undefined;
  }
  return typeof content === "string" ? JSON.parse(content || "{}") : content;
};
