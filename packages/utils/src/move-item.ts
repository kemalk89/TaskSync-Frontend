export function moveItem<T extends TypeWithId>(options: {
  containers: Container<T>[];
  itemId: string | number;
  newPosition: number;
  targetContainerId: string;
}) {
  const { itemId, targetContainerId, newPosition } = options;

  let sourceContainer: Container<T> | undefined;

  // find container including the item
  let itemPositionInSourceBoard = -1;

  for (let container of options.containers) {
    itemPositionInSourceBoard = container.items.findIndex(
      (item) => item.id.toString() === itemId.toString(),
    );

    if (itemPositionInSourceBoard > -1) {
      sourceContainer = container;
      break;
    }
  }

  // Validation: no item found by id -> exit
  if (itemPositionInSourceBoard === -1) {
    return;
  }

  // Validation: no container found -> exit
  if (!sourceContainer) {
    return;
  }

  // Validation: item position has not changed at all -> exit
  if (
    sourceContainer.id === targetContainerId &&
    itemPositionInSourceBoard > -1 &&
    itemPositionInSourceBoard === newPosition
  ) {
    return;
  }

  // edge case
  let moveDown =
    sourceContainer.id === targetContainerId &&
    itemPositionInSourceBoard !== -1 &&
    itemPositionInSourceBoard < newPosition;
  if (moveDown && itemPositionInSourceBoard + 1 === newPosition) {
    return;
  }

  // Get item
  let targetItem: T | undefined;
  if (itemPositionInSourceBoard > -1) {
    targetItem = sourceContainer.items.at(itemPositionInSourceBoard);
  }

  if (!targetItem) {
    return;
  }

  let targetContainer: Container<T> | undefined;
  for (let container of options.containers) {
    if (targetContainerId === container.id) {
      targetContainer = container;
      break;
    }
  }

  // Validation: Target container not exists
  if (!targetContainer) {
    return;
  }

  let targetList: T[] = targetContainer.items;

  // Put ticket in target container
  let newList: T[] = [];
  const movedToBottomOfList = newPosition === targetList.length;
  if (movedToBottomOfList) {
    newList = [...targetList];
    newList.splice(itemPositionInSourceBoard, 1);
    newList.push(targetItem);
  } else {
    for (let i = 0; i < targetList.length; i++) {
      if (targetList.at(i)?.id.toString() === targetItem.id.toString()) {
        continue;
      }

      if (i === newPosition) {
        newList.push(targetItem);
      }

      newList.push(targetList[i] as T);
    }
  }

  let sourceList = sourceContainer.items;

  // Remove ticket from source board
  if (targetContainerId !== sourceContainer.id) {
    sourceList = sourceContainer.items.filter((item) => {
      return item.id.toString() !== itemId.toString();
    });
  }

  return {
    sourceContainerId: sourceContainer.id,
    sourceList,
    targetList: newList,
  };
}

type Container<T> = { id: string; items: T[] };
type TypeWithId = { id: string | number };
