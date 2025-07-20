import {
  insertAfterCommand,
  insertBeforeCommand,
  replaceCommand,
  selectNodeCommand,
  selectNodesCommand,
  selectTextNode,
  unwrapCommand,
  wrapCommand,
} from "./commands/commands";
import { HTML_TAG_BOLD } from "./constants";
import {
  containsOnlyTextNodes,
  querySelectedText,
  queryTextLength,
  queryWrapper,
} from "./queries/queries";
import { getSelection } from "./selection";
import { Config } from "./types";

export function EditorController(selector: string, config: Config) {
  const editorEl = document.querySelector(selector);
  if (!editorEl) {
    throw "No div found matching selector " + selector;
  }

  if (!editorEl.hasAttribute("contenteditable")) {
    editorEl.setAttribute("contenteditable", "");
  }

  if (!editorEl.hasChildNodes()) {
    editorEl.innerHTML = "<p><br /></p>";
  }

  return {
    /**
     * If any text is selected, toggle inline formatting on the selection.
     */
    toggleInlineFormat: (format: "strong" | "i" | "u") => {
      const { isSingleLineSelection } = getSelection();
      if (isSingleLineSelection()) {
        toggleInlineFormatText(format);
      } else {
        // TODO
      }
    },
  };
}

function toggleInlineFormatText(format: "strong" | "i" | "u") {
  const { selectedNodes, $startContainer, startOffset, endOffset } =
    getSelection();

  if (!$startContainer || startOffset === undefined) {
    throw "No dom element to format.";
  }

  const { nodeBefore, nodeSelected, nodeAfter } = querySelectedText(
    $startContainer,
    startOffset,
    endOffset
  );

  if (!nodeSelected) {
    throw "No text node selected!";
  }

  const selectedNode =
    $startContainer.nodeType === Node.TEXT_NODE
      ? $startContainer
      : $startContainer.childNodes[startOffset];

  const wrapper = queryWrapper(selectedNode, HTML_TAG_BOLD);
  if (wrapper) {
    const { unwrappedNodes } = unwrapCommand(wrapper);
    const firstChild = unwrappedNodes.at(0);
    const parentNode = firstChild?.parentNode;
    if (parentNode && containsOnlyTextNodes(parentNode)) {
      const textLength = queryTextLength(unwrappedNodes);
      const nodesBefore = Array.from($startContainer.childNodes).slice(
        0,
        startOffset
      );

      const textLengthBefore = queryTextLength(nodesBefore);
      $startContainer.textContent = parentNode.textContent || "";

      selectTextNode(
        $startContainer.childNodes[0] as Text,
        textLengthBefore,
        textLength
      );
    } else {
      selectNodesCommand(unwrappedNodes);
    }
  } else {
    const wrapper = wrapCommand(selectedNodes, format);
    replaceCommand({ currentNode: $startContainer, newNode: wrapper });
    if (nodeBefore) {
      insertBeforeCommand({
        currentNode: wrapper,
        newNode: nodeBefore,
      });
    }
    if (nodeAfter) {
      insertAfterCommand({
        currentNode: wrapper,
        newNode: nodeAfter,
      });
    }

    selectNodeCommand(wrapper);
  }
}
