"use client";

import StarterKit from "@tiptap/starter-kit";
import { Content, useEditor } from "@tiptap/react";
import { Placeholder } from "@tiptap/extensions";

type Params = {
  placeholder?: string;
  content?: Content;
};

export const useTextEditor = ({ placeholder, content }: Params) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ...(placeholder ? [Placeholder.configure({ placeholder })] : []),
    ],
    ...(content ? { content } : {}),
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  });

  return editor;
};
