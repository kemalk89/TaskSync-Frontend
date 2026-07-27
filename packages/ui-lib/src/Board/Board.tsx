"use client";

import { ReactNode, useRef } from "react";
import { BoardColumn } from "./types";
import { SortableList } from "../SortableList/SortableList";
import { Lists } from "../SortableList/types";

type Props<T> = {
  columns: Array<BoardColumn<T>>;
  renderTitle?: (column: BoardColumn<T>) => ReactNode;
  renderItem: (workItem: T) => ReactNode;
  onDrop: (
    workItemId: string,
    position: number,
    targetColumnId: string,
  ) => void;
};

export const Board = <T,>({
  columns,
  renderItem,
  renderTitle,
  onDrop,
}: Props<T>) => {
  const lists: Lists<T> = columns.map((col) => ({
    id: col.id,
    items: col.workItems,
  }));

  return (
    <div style={{ display: "flex" }}>
      {columns.map((column) => {
        return (
          <div key={column.id}>
            {renderTitle ? renderTitle(column) : <h3>{column.title}</h3>}
            <SortableList<T>
              listId={column.id}
              lists={lists}
              renderItem={(i) => renderItem(i)}
              onSort={(result) => {
                console.log(result);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
