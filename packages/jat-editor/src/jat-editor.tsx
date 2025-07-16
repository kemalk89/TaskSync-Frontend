"use client";

import { useEffect, useRef } from "react";
import { Toolbar } from "./toolbar";
import type { FormatType } from "./types";

import "./jat-editor.css";
import { insertFormat } from "./dom/insert-format";

/**
 * JatEditor = Just Another Text Editor.
 *
 * How it works:
 * - The editor is based on a div which has attribute contenteditable
 * - Each line has a <p>-tag as a parent, ensuring a consistent block structure
 *
 * Supports:
 * - Formatting: Bold, Italic, Underline, Striketrough, Code, Clear Formatting
 * - Formatting: Normal Text, H1, ... H3
 * - Mention
 * - Emoji Picker
 * - Code snippet
 * - Link
 * - View mode
 *      - inputOnly
 *      - withControls
 */
export const JatEditor = () => {
  const editorRef = useRef<HTMLDivElement>(null);

  const getSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    return selection;
  };

  const removePrevFormat = () => {
    const selection = getSelection();
    if (!selection) {
      return;
    }

    const range = selection.getRangeAt(0);

    const fragment = range.cloneContents();
    // Get plain text from the fragment (removes all formatting)
    const text = fragment.textContent || "";
    const textNode = document.createTextNode(text);
    range.deleteContents();
    range.insertNode(textNode);
  };

  const bulletListToParagraphs = (ulAncestor: HTMLElement) => {
    const lis = Array.from(ulAncestor.querySelectorAll("li"));
    lis.forEach((li) => {
      const p = document.createElement("p");
      p.classList.add(LINE_BLOCK_CLASSNAME);
      // Move all children of <li> into <p>
      while (li.firstChild) {
        p.appendChild(li.firstChild);
      }
      ulAncestor.parentNode?.insertBefore(p, ulAncestor);
    });
    ulAncestor.remove();
  };

  const toggleBulletList = () => {
    const selection = getSelection();
    if (!selection || !editorRef.current) return;

    const range = selection.getRangeAt(0);

    // Detect if selection is inside a <ul>
    let node: Node | null = range.startContainer;
    let ulAncestor: HTMLElement | null = null;
    while (node && node !== editorRef.current) {
      if ((node as HTMLElement).tagName === "UL") {
        ulAncestor = node as HTMLElement;
        break;
      }
      node = node.parentNode;
    }

    // If inside a <ul>, unwrap to <p>
    if (ulAncestor) {
      bulletListToParagraphs(ulAncestor);
    } else {
      paragraphsToBulletList();
    }
  };

  const paragraphsToBulletList = () => {
    const selection = getSelection();
    if (!selection || !editorRef.current) return;

    const range = selection.getRangeAt(0);

    // If no text is selected, wrap the current line in a bullet list
    if (selection.isCollapsed) {
      // Find the closest <p> ancestor or fallback to the editor itself
      let node: Node | null = range.startContainer;
      while (
        node &&
        node !== editorRef.current &&
        (node as HTMLElement).tagName !== "P"
      ) {
        node = node.parentNode;
      }
      if (!node || node === editorRef.current) return;

      const p = node as HTMLElement;
      const ul = document.createElement("ul");
      const li = document.createElement("li");
      // Move all children of <p> into <li>
      while (p.firstChild) {
        li.appendChild(p.firstChild);
      }
      ul.appendChild(li);
      p.replaceWith(ul);

      // Move caret into the new <li>
      const newRange = document.createRange();
      newRange.selectNodeContents(li);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      // If text is selected, wrap all affected lines in a bullet list
      // Find all <p> blocks that intersect the selection
      const paragraphs: HTMLElement[] = [];
      editorRef.current.querySelectorAll("p").forEach((p) => {
        if (selection.containsNode(p, true)) {
          paragraphs.push(p);
        }
      });
      if (paragraphs.length === 0) {
        return;
      }

      const ul = document.createElement("ul");
      ul.classList.add(LINE_BLOCK_CLASSNAME);
      paragraphs.forEach((p) => {
        console.log(p, p.textContent);
        const li = document.createElement("li");
        // Move all children of <p> into <li>
        while (p.firstChild) {
          li.appendChild(p.firstChild);
        }
        ul.appendChild(li);
        p.replaceWith(ul);
      });

      // Move caret into the last <li>
      const lastLi = ul.lastElementChild;
      if (lastLi) {
        const newRange = document.createRange();
        newRange.selectNodeContents(lastLi);
        newRange.collapse(false);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
  };

  const handleFormat = (formatType: FormatType) => {
    if (formatType === "b") {
      insertFormat("strong");
    } else if (formatType === "i") {
      insertFormat("i");
    } else if (formatType === "u") {
      insertFormat("u");
    } else if (formatType === "code") {
      removePrevFormat();
      insertFormat("code");
    } else if (formatType === "ul") {
      toggleBulletList();
    }

    editorRef.current?.focus();
  };

  const createNewLineParagraph = () => {
    const paragraph = document.createElement("p");
    paragraph.classList.add(LINE_BLOCK_CLASSNAME);
    paragraph.appendChild(document.createElement("br"));
    return paragraph;
  };

  // Initialize: Add empty <p> as starting point
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML.trim().length === 0) {
      editorRef.current.appendChild(createNewLineParagraph());
    }
  }, [editorRef]);

  return (
    <div>
      <div
        style={{
          border: "1px solid gray",
          borderRadius: "4px",
          padding: "8px",
        }}
      >
        <Toolbar onFormat={handleFormat} />
        <div
          ref={editorRef}
          style={{ outline: "none", marginTop: "8px" }}
          contentEditable
          data-testid={DATA_TEST_ID_EDITOR}
        ></div>
      </div>

      <button onClick={() => console.log(editorRef.current?.innerHTML)}>
        Speichern
      </button>
    </div>
  );
};

export const DATA_TEST_ID_EDITOR = "editor";
export const LINE_BLOCK_CLASSNAME = "block";
