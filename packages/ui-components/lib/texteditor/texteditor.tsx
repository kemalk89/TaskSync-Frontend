import {
  InitialConfigType,
  InitialEditorStateType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { ListNode, ListItemNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { EditorState } from "lexical";

import "./style.css";
import { ToolbarPlugin } from "./plugins/toolbar-plugin";

const theme = {
  // Theme styling goes here
  text: {
    strikethrough: "uic-texteditor-text-strikethrough",
    underline: "uic-texteditor-text-underline",
  },
};

interface TextEditorProps {
  readOnlyMode?: boolean;
  placeholder?: string;
  initialEditorState?: InitialEditorStateType;
  onChange: (newEditorState: EditorState) => void;
}

export function TextEditor({
  placeholder,
  initialEditorState,
  onChange,
  readOnlyMode,
}: TextEditorProps) {
  const initialConfig: InitialConfigType = {
    namespace: "MyEditor",
    theme,
    editable: !readOnlyMode,
    editorState: initialEditorState,
    onError: (err: Error) => {
      throw err;
    },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
  };

  function handleOnChange(newEditorState: EditorState) {
    onChange(newEditorState);
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      {readOnlyMode ? "" : <ToolbarPlugin />}

      <div className="uic-texteditor-wrapper">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="uic-texteditor-ContentEditable" />
          }
          placeholder={
            <div className="uic-texteditor-placeholder">{placeholder}</div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={handleOnChange} />
        <HistoryPlugin />
      </div>
    </LexicalComposer>
  );
}
