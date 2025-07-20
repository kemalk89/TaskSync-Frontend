export function getSelection() {
  const selection = document.getSelection();
  const range = selection?.getRangeAt(0);

  const rangeContents = range?.cloneContents();

  const startContainer = range?.startContainer; // connected to DOM
  const startOffset = range?.startOffset;
  const endContainer = range?.endContainer; // connected to DOM
  const endOffset = range?.endOffset;

  return {
    selectedNodes: rangeContents?.hasChildNodes()
      ? (Array.from(rangeContents.childNodes) as Node[])
      : [],
    $startContainer: startContainer,
    startOffset,
    $endContainer: endContainer,
    endOffset,
    isSingleLineSelection: () => {
      return !selection?.isCollapsed && startContainer === endContainer;
    },
  };
}
