import type { FormatType } from "./types";

type Props = {
  onFormat: (formatType: FormatType) => void;
};

export const Toolbar = ({ onFormat }: Props) => {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button
        className="jat-editor-format-button"
        title="Headline 1"
        onClick={() => onFormat("h1")}
      >
        H1
      </button>
      <button
        className="jat-editor-format-button"
        title="Headline 2"
        onClick={() => onFormat("h2")}
      >
        H2
      </button>
      <button
        className="jat-editor-format-button"
        title="Headline 3"
        onClick={() => onFormat("h3")}
      >
        H3
      </button>
      <button
        className="jat-editor-format-button"
        title="Bold"
        onClick={() => onFormat("b")}
      >
        B
      </button>
      <button
        className="jat-editor-format-button"
        title="Italic"
        onClick={() => onFormat("i")}
      >
        I
      </button>
      <button
        className="jat-editor-format-button"
        title="Underline"
        onClick={() => onFormat("u")}
      >
        U
      </button>
      <button
        className="jat-editor-format-button"
        onClick={() => onFormat("code")}
      >
        Code
      </button>
      <button
        title="Bullet List"
        className="jat-editor-format-button"
        onClick={() => onFormat("ul")}
      >
        UL
      </button>
    </div>
  );
};
