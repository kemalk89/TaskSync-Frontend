import { SiblingOperationCommandParam } from "../types";

/**
 * Commands are going to create DOM elements or mutating the DOM directly.
 */

export const unwrapCommand = (wrapper: Node) => {
  const tracked: Node[] = [];
  // Technical detail: After inserting fragment into the DOM, it becomes empty, so we need extra tracking of nodes
  const fragment = document.createDocumentFragment();
  for (const node of Array.from(wrapper.childNodes)) {
    fragment.appendChild(node);
    tracked.push(node);
  }

  const parent = wrapper.parentNode;
  if (!parent) {
    return { unwrappedNodes: [] };
  }

  replaceCommand({ currentNode: wrapper, newNode: fragment });

  return {
    unwrappedNodes: tracked,
  };
};

export const wrapCommand = (nodes: Node[], htmlTag: string) => {
  const wrapper = document.createElement(htmlTag);
  for (const n of nodes) {
    wrapper.appendChild(n);
  }

  return wrapper;
};

export const selectTextNode = (
  textNode: Text,
  offset: number,
  length: number
) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return;
  }

  if (!document.contains(textNode)) {
    throw `TextNode (having text "${textNode.textContent}") is not connected to the DOM`;
  }

  const newRange = document.createRange();
  newRange.setStart(textNode, offset);
  newRange.setEnd(textNode, offset + length);

  selection.removeAllRanges();
  selection.addRange(newRange);
};

export const selectNodeCommand = (node: Node) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return;
  }

  if (!document.contains(node)) {
    throw `Node (having text "${node.textContent}") is not connected to the DOM`;
  }

  const newRange = document.createRange();
  newRange.selectNode(node);

  selection.removeAllRanges();
  selection.addRange(newRange);
};

export const selectNodesCommand = (nodes: Node[]) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return;
  }

  const startNode = nodes.at(0);
  const endNode = nodes.at(-1) || startNode;

  if (!startNode || !endNode) {
    return;
  }

  const newRange = document.createRange();
  newRange.setStart(startNode, 0);
  newRange.setEnd(endNode, endNode.textContent?.length || 0);

  selection.removeAllRanges();
  selection.addRange(newRange);
};

export const insertBeforeCommand = ({
  currentNode,
  newNode,
}: SiblingOperationCommandParam) => {
  currentNode.parentNode?.insertBefore(newNode, currentNode);
};

export const insertAfterCommand = ({
  currentNode,
  newNode,
}: SiblingOperationCommandParam) => {
  currentNode.parentNode?.insertBefore(newNode, currentNode.nextSibling);
};

export const replaceCommand = ({
  currentNode,
  newNode,
}: SiblingOperationCommandParam) => {
  if (!document.contains(currentNode)) {
    throw 'Parameter "currentNode" is not connected to the DOM';
  }

  currentNode.parentNode?.replaceChild(newNode, currentNode);
};
