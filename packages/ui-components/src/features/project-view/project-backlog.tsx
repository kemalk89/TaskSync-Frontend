import {
  getAPI,
  ProjectResponse,
  SprintResponse,
  TicketResponse,
} from "@app/api";
import { useSearchParams } from "next/navigation";
import { Alert } from "react-bootstrap";
import { NewTicketDialog } from "../tickets/new-ticket-dialog";
import { TicketsSearchBar } from "../tickets-search-bar/tickets-search-bar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEY_PREFIX_FETCH_TICKETS } from "../constants";
import { IconInfoCircle } from "../../icons/icons";

import { useState } from "react";
import { ReorderBacklogTicketsCommand } from "../../../../api/src/request.models";
import { TicketListSortable } from "./ticketlist-sortable";

type Props = {
  project?: ProjectResponse;
};

export const ProjectBacklog = ({ project }: Props) => {
  const searchParams = useSearchParams();
  const pageSize = 1000;
  const pageNumber = (searchParams.get("pageNumber") || 1) as number;
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [draftSprint, setDraftSprint] = useState<SprintResponse>();

  // Queries
  useQuery({
    enabled: !!project,
    queryKey: [QUERY_KEY_PREFIX_FETCH_TICKETS, { pageSize, pageNumber }],
    queryFn: async () => {
      const response = await getAPI().fetchBacklogTickets(project!.id);

      setTickets(response.data ?? []);
      return response.data;
    },
  });

  useQuery({
    enabled: !!project,
    queryKey: [QUERY_KEY_PREFIX_FETCH_TICKETS, "fetchDraftSprint"],
    queryFn: async () => {
      const response = await getAPI().fetchDraftSprint(project!.id);

      setDraftSprint(response.data?.value);
      return response.data;
    },
  });

  // Mutations
  const reorderBacklogTickets = useMutation({
    mutationFn: (command: {
      projectId: number;
      ticketOrder: ReorderBacklogTicketsCommand;
    }) => {
      return getAPI().post.reorderBacklogTickets(
        command.projectId,
        command.ticketOrder,
      );
    },
  });

  const assignTicketToDraftSprint = useMutation({
    mutationFn: (command: {
      projectId: number;
      sprintId?: number;
      ticketId: number;
      newPosition?: number;
    }) => {
      return getAPI().post.assignTicketToSprint(
        command.projectId,
        command.sprintId ?? 0,
        command.ticketId,
        command.newPosition ?? 1,
      );
    },
  });

  if (!tickets) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        No tickets found. Create your first ticket.
        <NewTicketDialog buttonProps={{ size: "sm" }} />
      </div>
    );
  }

  const changeOrderOfTicketsInSprint = (
    ticketId: string,
    newPosition: number,
  ) => {
    console.log("Added ticket to sprint", ticketId, newPosition);
    assignTicketToDraftSprint.mutate({
      projectId: project!.id,
      ticketId: Number(ticketId),
    });
  };

  const changeOrderOfTicketsInBacklog = (
    ticketId: string,
    newPosition: number,
  ) => {
    const currentTicketIndex = tickets.findIndex(
      (t) => parseInt(t.id) === parseInt(ticketId),
    );
    // no ticket found by id -> exit
    if (currentTicketIndex === -1) {
      return;
    }

    // position of the ticket not changed at all -> exit
    if (currentTicketIndex === newPosition) {
      return;
    }

    // edge case
    const moveDown = currentTicketIndex < newPosition;
    if (moveDown && currentTicketIndex + 1 === newPosition) {
      return;
    }

    const targetTicket = tickets.at(currentTicketIndex);
    if (!targetTicket) {
      return;
    }

    let newList: TicketResponse[] = [];
    const movedToBottomOfList = newPosition === tickets.length;
    if (movedToBottomOfList) {
      newList = [...tickets];
      newList.splice(currentTicketIndex, 1);
      newList.push(targetTicket);
    } else {
      for (let i = 0; i < tickets.length; i++) {
        if (tickets.at(i)?.id === targetTicket.id) {
          continue;
        }

        if (i === newPosition) {
          newList.push(targetTicket);
        }

        newList.push(tickets[i] as TicketResponse);
      }
    }

    setTickets(newList);

    reorderBacklogTickets.mutate({
      projectId: project!.id,
      ticketOrder: newList.map((ticket, index) => ({
        ticketId: parseInt(ticket.id),
        position: index,
      })),
    });
  };

  return (
    <>
      <div className="mb-4">
        <TicketsSearchBar
          hiddenFilters={["projects"]}
          initialSearchText={""}
          initialSelectedAssignees={[]}
          initialSelectedLabels={[]}
          initialSelectedProjects={[]}
          initialSelectedStatus={[]}
          onSearch={console.log}
          ticketStatusList={[]}
          projectList={[]}
          userList={[]}
        />
      </div>
      <div className="mb-4">
        <h3>Nächster Sprint</h3>
        {draftSprint?.tickets.length === 0 && (
          <Alert variant="info">
            <IconInfoCircle /> Es sind noch keine Tickets eingeplant für das
            nächste Sprint eingeplant. Tickets können per Drag&Drop in diesen
            Abschnitt gezogen werden.
          </Alert>
        )}

        <div>
          <TicketListSortable
            tickets={draftSprint?.tickets ?? []}
            onDrop={(e, index) =>
              changeOrderOfTicketsInSprint(
                e.dataTransfer.getData("text"),
                index,
              )
            }
          />
        </div>
      </div>
      <h3>Backlog</h3>

      <TicketListSortable
        tickets={tickets}
        onDrop={(e, index) =>
          changeOrderOfTicketsInBacklog(e.dataTransfer.getData("text"), index)
        }
      />
    </>
  );
};
