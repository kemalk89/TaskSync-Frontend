"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Props = {
  content: object | string;
};

export const TextEditorReadonly = ({ content }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: typeof content === "string" ? JSON.parse(content) : content,
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
};
