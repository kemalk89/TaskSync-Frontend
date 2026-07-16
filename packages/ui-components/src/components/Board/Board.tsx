"use client";

import { ReactNode, DragEvent } from "react";
import { WorkItem, BoardColumn } from "./types";
import { DroppableSlot } from "../drag-and-drop/drag-and-drop";

type Props = {
  columns: Array<BoardColumn>;
  workItems: Array<WorkItem>;
  renderTitle?: (column: BoardColumn) => ReactNode;
  renderCard: (workItem: WorkItem, index: number) => ReactNode;
  onDrop: (e: DragEvent<HTMLDivElement>, index: number) => void;
};

export const Board = (props: Props) => {
  return (
    <div style={{ display: "flex" }}>
      {props.columns.map((column, index) => {
        return (
          <div key={column.id} style={{ width: column.width }}>
            {props.renderTitle ? (
              props.renderTitle(column)
            ) : (
              <h3>{column.title}</h3>
            )}

            {props.workItems
              .filter(
                (item) =>
                  item.columnId === column.id ||
                  (!item.columnId && index === 0),
              )
              .map((workItem) => (
                <div key={`work-item-${workItem.id}`}>
                  {index === 0 && (
                    <DroppableSlot onDrop={(e) => props.onDrop(e, index)} />
                  )}

                  {props.renderCard(workItem, index)}
                  <DroppableSlot onDrop={(e) => props.onDrop(e, index + 1)} />
                </div>
              ))}
          </div>
        );
      })}
    </div>
  );
};
