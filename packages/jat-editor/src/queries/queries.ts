/**
 * Queries are only responsible to query the DOM. They can create DOM elements on RAM but they should
 * never mutate the DOM.
 */

export const queryWrapper = (node: Node | undefined, htmlTag: string) => {
  if (!node) {
    return null;
  }

  if (!document.contains(node)) {
    throw "Cannot search for wrapper when node is not attached to DOM.";
  }

  let current = node;
  while (current && (current as HTMLElement).tagName !== "BODY") {
    if ((current as HTMLElement).tagName === htmlTag.toUpperCase()) {
      return current;
    }

    current = current.parentNode as Node;
  }

  return null;
};

export const querySelectedText = (
  node: Node,
  startOffset?: number,
  endOffset?: number
) => {
  if (
    startOffset === undefined ||
    startOffset === null ||
    endOffset === undefined ||
    endOffset === null
  ) {
    return {};
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const targetNode = node.childNodes[startOffset] as Node;
    if (!targetNode) {
      throw "No targetNode.";
    }

    return {
      nodeBefore:
        startOffset === 0 ? targetNode : node.childNodes[startOffset - 1],
      nodeSelected: targetNode,
      nodeAfter: node.childNodes[startOffset + 1],
    };
  }

  const parts: Node[] = [];

  const text = node.textContent || "";
  const before = text.slice(0, startOffset);
  const middle = text.slice(startOffset, endOffset);
  const after = text.slice(endOffset);

  let nodeBefore: Node | null = null;
  let nodeMiddle: Node | null = null;
  let nodeAfter: Node | null = null;

  if (before) {
    nodeBefore = document.createTextNode(before);
    nodeBefore.textContent = before;
    parts.push(nodeBefore);
  }

  if (middle) {
    nodeMiddle = document.createTextNode(middle);
    nodeMiddle.textContent = middle;
    parts.push(nodeMiddle);
  }

  if (after) {
    nodeAfter = document.createTextNode(after);
    nodeAfter.textContent = after;
  }

  return {
    nodeBefore: nodeBefore,
    nodeSelected: nodeMiddle,
    nodeAfter: nodeAfter,
  };
};

export const containsOnlyTextNodes = (node: Node) => {
  if (node.nodeType === Node.TEXT_NODE) {
    throw "Invalid argument!";
  }

  const childNodes = Array.from(node.childNodes);
  for (const n of childNodes) {
    if (n.nodeType !== Node.TEXT_NODE) {
      return false;
    }
  }
  return true;
};

export const queryTextLength = (nodes: Node[]): number => {
  let totalLength = 0;
  for (const n of nodes) {
    totalLength += n.textContent?.length || 0;
  }
  return totalLength;
};
