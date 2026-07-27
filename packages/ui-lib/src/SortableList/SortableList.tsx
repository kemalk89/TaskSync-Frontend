import { DragEvent, ReactNode } from "react";
import { DroppableSlot } from "../DragAndDrop/DragAndDrop";
import { Lists } from "./types";
import { moveItem, SortResult } from "./move-item";

type Props<T> = {
  listId: string;
  lists: Lists<T>;
  renderItem: (item: T) => ReactNode;
  onSort: (result: SortResult<T>) => void;
};

export const SortableList = <T,>({
  listId,
  lists,
  onSort,
  renderItem,
}: Props<T>) => {
  const sortItems = (e: DragEvent<HTMLDivElement>, newPosition: number) => {
    const ticketId = e.dataTransfer.getData("text");

    const moveItemResult = moveItem({
      containers: lists,
      itemId: ticketId,
      newPosition,
      targetContainerId: listId,
    });

    if (!moveItemResult) {
      return;
    }

    onSort(moveItemResult);
  };

  const currentList = lists.find((list) => list.id === listId);
  if (!currentList) {
    throw Error("List not found");
  }

  if (currentList.items.length === 0) {
    return <DroppableSlot onDrop={(e) => sortItems(e, 0)} />;
  }

  return (
    <div id={listId}>
      {currentList.items.map((item, index) => (
        <div key={`${listId}-${item.id}`}>
          {index === 0 && <DroppableSlot onDrop={(e) => sortItems(e, index)} />}

          {renderItem(item)}

          <DroppableSlot onDrop={(e) => sortItems(e, index + 1)} />
        </div>
      ))}
    </div>
  );
};
