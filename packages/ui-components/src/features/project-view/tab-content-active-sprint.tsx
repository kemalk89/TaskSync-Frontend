"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Alert } from "react-bootstrap";
import { IconInfoCircle } from "../../icons/icons";
import { useQuery } from "@tanstack/react-query";
import { getQueryKeyFetchActiveSprint } from "../constants";
import { getAPI, TicketResponse } from "@app/api";
import { TicketCardDraggable } from "../ticket-card/ticket-card";
import { Board, BoardColumn, SortResult } from "@app/ui-lib";
import { ToastContext } from "../../toast";
import { useReorderBoardTickets } from "../project-hooks";

export const TabContentActiveSprint = ({
  projectId,
}: {
  projectId?: number;
}) => {
  const { newToast } = useContext(ToastContext);
  const reorderBoardTickets = useReorderBoardTickets();

  const { data: activeSprint } = useQuery({
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

  const [columns, setColumns] = useState<BoardColumn<TicketResponse>[]>([]);

  useQuery({
    queryKey: ["ticketStatusList"],
    queryFn: async () => {
      const result = await getAPI().fetchTicketStatusList();

      if (result.status === "error") {
        newToast({
          msg: "Beim Laden der Ticket Status Liste ist ein Fehler ist aufgetreten",
          type: "error",
        });
      }

      const mapped: BoardColumn<TicketResponse>[] = (result.data ?? []).map(
        (col) => {
          let length = result.data?.length;
          if (!length) {
            length = 1;
          }
          const width = 100 / length;
          return {
            id: col.id.toString(),
            title: col.name,
            width: `${width}%`,
            workItems: [],
          };
        },
      );

      setColumns(mapped ?? []);

      return result.data;
    },
  });

  const [workItems, setWorkItems] = useState<TicketResponse[]>([]);
  const tickets: TicketResponse[] = activeSprint?.data?.tickets ?? [];

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
        if (!wi.Status) {
          wi.Status = { id: Number(result.targetListId), title: "" };
        } else {
          wi.Status.id = Number(result.targetListId);
        }

        wi.position = newPosition;
      }
    }

    setWorkItems([...workItems.sort((a, b) => a.position - b.position)]);

    // call API
    if (projectId) {
      reorderBoardTickets.mutate({
        boardId: activeSprint?.data?.id,
        projectId,
        ticketOrder: result.targetListItems.map((ticket, index) => {
          return {
            ticketId: Number(ticket.id),
            position: index,
            statusId: Number(result.targetListId),
          };
        }),
      });
    }
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

  if (!activeSprint?.data?.tickets) {
    return renderEmptyState();
  }

  return (
    <Board<TicketResponse>
      columns={columns.map((col) => ({
        ...col,
        workItems: workItems
          .map((wi) => ({
            ...wi,
            Status: wi.Status
              ? wi.Status
              : { id: Number(columns[0]!.id), title: columns[0]!.title }, // default
          }))
          .filter((wi) => wi.Status.id === Number(col.id)),
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
