"use client";

import { ReactNode } from "react";
import { WorkItem, BoardColumn } from "./types";

type Props = {
  columns: Array<BoardColumn>;
  workItems: Array<WorkItem>;
  renderTitle?: (column: BoardColumn) => ReactNode;
  renderCard: (workItem: WorkItem) => ReactNode;
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
                  {props.renderCard(workItem)}
                </div>
              ))}
          </div>
        );
      })}
    </div>
  );
};
