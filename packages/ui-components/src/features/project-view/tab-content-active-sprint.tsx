"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Alert } from "react-bootstrap";
import { IconInfoCircle } from "../../icons/icons";
import { useQuery } from "@tanstack/react-query";
import { getQueryKeyFetchActiveSprint } from "../constants";
import { getAPI, TicketResponse } from "@app/api";
import { TicketCardDraggable } from "../ticket-card/ticket-card";
import { Board, SortResult } from "@app/ui-lib";

const moveTicketApi = (
  ticketId: string,
  targetColumnId: string,
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(
        `[Fake API] Moved ticket ${ticketId} to column ${targetColumnId}`,
      );
      resolve();
    }, 300);
  });
};

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

  const [workItems, setWorkItems] = useState<TicketResponse[]>([]);
  const tickets: TicketResponse[] = data?.data?.tickets ?? [];

  useEffect(() => {
    if (tickets.length > 0) {
      setWorkItems(tickets);
    }
  }, [tickets]);

  const handleSort = (result: SortResult<TicketResponse>) => {
    // optimistic update of UI
    for (let wi of workItems) {
      const newPosition = result.targetListItems.findIndex(
        (i) => i.id === wi.id,
      );
      const found = result.targetListItems.find((i) => i.id === wi.id);

      if (found) {
        wi.Status = result.targetListId;
        wi.position = newPosition;
      }
    }

    setWorkItems([...workItems.sort((a, b) => a.position - b.position)]);
  };

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

  if (!data?.data?.tickets) {
    return renderEmptyState();
  }

  return (
    <Board<TicketResponse>
      columns={columns.map((col) => ({
        ...col,
        workItems: workItems
          .map((wi) => ({
            ...wi,
            Status: wi.Status ? wi.Status : "todo",
          }))
          .filter((wi) => wi.Status === col.id),
      }))}
      onSort={handleSort}
      renderItem={(workItem) => (
        <TicketCardDraggable
          identifier={workItem.id}
          ticket={tickets.find((t) => t.id === workItem.id)}
          onDelete={() => null}
        />
      )}
    />
  );
};

const columns = [
  { id: "todo", title: "TODO", width: "25%" },
  { id: "in-progress", title: "In progress", width: "25%" },
  { id: "code-review", title: "Code review", width: "25%" },
  { id: "done", title: "Done", width: "25%" },
];
