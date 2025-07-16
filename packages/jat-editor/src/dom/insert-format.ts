import { Tag } from "../types";

export const insertFormat = (tag: Tag) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);

  // handle case "user has no text selected"
  if (range.collapsed) {
    return;
  }

  const startContainer = range.startContainer;
  const startOffset = range.startOffset;
  const endContainer = range.endContainer;
  const endOffset = range.endOffset;

  let newStartNode: Text | null = null;
  let newEndNode: Text | null = null;

  // Text selection is within a single block
  if (startContainer === endContainer) {
    const node = startContainer as Text;
    const processedNode = wrapTextRangeWithTag(
      node,
      tag,
      startOffset,
      endOffset
    );
    newStartNode = processedNode;
    newEndNode = processedNode;

    restoreSelection(selection, newStartNode, newEndNode);
    return;
  }

  const walker = document.createTreeWalker(
    range.commonAncestorContainer,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        if (range.intersectsNode(node)) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      },
    }
  );

  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }

  textNodes.forEach((node) => {
    const isStart = node === startContainer;
    const isEnd = node === endContainer;

    if (isStart && isEnd) {
      const processedNode = wrapTextRangeWithTag(
        node,
        tag,
        startOffset,
        endOffset
      );
      newStartNode = processedNode;
      newEndNode = processedNode;
    } else if (isStart) {
      newStartNode = wrapTextRangeWithTag(
        node,
        tag,
        startOffset,
        node.textContent!.length
      );
    } else if (isEnd) {
      newEndNode = wrapTextRangeWithTag(node, tag, 0, endOffset);
    } else {
      wrapTextRangeWithTag(node, tag, 0, node.textContent!.length);
    }
  });

  restoreSelection(selection, newStartNode, newEndNode);
};

/**
 * Wraps a specified range of text within a Text node in a formatting tag (e.g., <strong>, <em>).
 *
 * This function splits the given Text node into three parts: before, middle, and after the selection.
 * The "middle" part (from startOffset to endOffset) is wrapped in the provided tag, while the "before"
 * and "after" parts remain as plain text nodes. The original Text node is replaced in the DOM with
 * these new nodes.
 *
 * @param node - The Text node to process.
 * @param tag - The HTML tag name to wrap the selected text with.
 * @param startOffset - The start offset of the selection within the text node.
 * @param endOffset - The end offset of the selection within the text node.
 * @returns The new Text node inside the wrapped element, or null if no wrapping occurred.
 */
const wrapTextRangeWithTag = (
  node: Text,
  tag: Tag,
  startOffset: number,
  endOffset: number
): Text | null => {
  const text = node.textContent || "";
  const before = text.slice(0, startOffset);
  const middle = text.slice(startOffset, endOffset);
  const after = text.slice(endOffset);

  const parent = node.parentNode!;
  const fragment = document.createDocumentFragment();

  if (before) {
    fragment.appendChild(document.createTextNode(before));
  }

  let wrapped: HTMLElement | null = null;
  if (middle) {
    wrapped = document.createElement(tag);
    wrapped.textContent = middle;
    fragment.appendChild(wrapped);
  }

  if (after) {
    fragment.appendChild(document.createTextNode(after));
  }

  parent.replaceChild(fragment, node);

  if (
    wrapped &&
    wrapped.firstChild &&
    wrapped.firstChild.nodeType === Node.TEXT_NODE
  ) {
    return wrapped.firstChild as Text;
  }

  return null;
};

/**
 * Restores the user's text selection after formatting changes.
 *
 * This function creates a new Range that starts at the beginning of `startNode`
 * and ends at the end of `endNode`, then applies this range to the current selection.
 * This ensures that after formatting (such as bold, italic, etc.), the user's selection
 * remains consistent and highlights the newly formatted text.
 *
 * @param selection - The current Selection object from the window.
 * @param startNode - The Text node where the new selection should start.
 * @param endNode - The Text node where the new selection should end.
 */
export const restoreSelection = (
  selection: Selection,
  startNode: Text | null,
  endNode: Text | null
) => {
  if (startNode && endNode) {
    const newRange = document.createRange();
    newRange.setStart(startNode, 0);
    newRange.setEnd(endNode, endNode.textContent?.length ?? 0);

    selection.removeAllRanges();
    selection.addRange(newRange);
  }
};
