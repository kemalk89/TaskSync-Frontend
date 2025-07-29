"use client";

import StarterKit from "@tiptap/starter-kit";
import { useEditor } from "@tiptap/react";
import { Placeholder } from "@tiptap/extensions";

type Params = {
  placeholder?: string;
};

export const useTextEditor = ({ placeholder }: Params) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  });

  return editor;
};
