"use client";

import Link from "next/link";
import { Alert } from "react-bootstrap";
import { IconGripVertical, IconInfoCircle } from "../../icons/icons";
import { useQuery } from "@tanstack/react-query";
import { getQueryKeyFetchActiveSprint } from "../constants";
import { getAPI, TicketResponse } from "@app/api";
import { Board } from "../../components/Board/Board";
import { Draggable } from "../../components/drag-and-drop/drag-and-drop";
import { WorkItem } from "../../components/Board/types";

export const TabContentActiveSprint = ({
  projectId,
}: {
  projectId?: number;
}) => {
  const { data } = useQuery({
    enabled: !!projectId,
    queryKey: getQueryKeyFetchActiveSprint(projectId),
    queryFn: async () => {
      const response = await getAPI().get.fetchActiveSprint(projectId);
      if (
        response.status === "error" &&
        response.message === "RESOURCE_NOT_FOUND"
      ) {
        // no issues, the error is normal if no active sprint exists
        return response;
      }

      return response;
    },
  });

  const renderEmptyState = () => {
    return (
      <Alert variant="info">
        <p>
          <IconInfoCircle /> Zur Zeit gibt es kein aktives Board.
        </p>
        <p>
          Bitte zum Reiter <Link href="?tab=backlog">Backlog</Link> wechseln, um
          einen Board zu planen und zu aktivieren.
        </p>
      </Alert>
    );
  };

  const renderBoard = (tickets: TicketResponse[]) => {
    console.log(tickets);
    const workItems: WorkItem[] = tickets.map((t) => ({
      id: t.id,
      title: t.title,
      columnId: !t.Status ? "todo" : "in-progress",
    }));

    return (
      <Board
        columns={columns}
        workItems={workItems}
        renderCard={(workItem) => (
          <div className="card" key={workItem.id}>
            <div className="d-flex">
              <Draggable
                itemIdentifier={workItem.id}
                onDragStart={() => null}
                onDragEnd={() => null}
                dragImageBuilder={(draggableElement: HTMLElement) => {
                  return document.createElement("div");
                }}
              >
                <IconGripVertical />
              </Draggable>
              {workItem.title}
            </div>
          </div>
        )}
      />
    );
  };

  return data?.data?.tickets
    ? renderBoard(data?.data?.tickets)
    : renderEmptyState();
};

const columns = [
  { id: "todo", title: "TODO", width: "25%" },
  { id: "in-progress", title: "In progress", width: "25%" },
  { id: "code-review", title: "Code review", width: "25%" },
  { id: "done", title: "Done", width: "25%" },
];
