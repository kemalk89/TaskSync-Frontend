import { ProjectResponse, BoardResponse, TicketResponse } from "@app/api";
import { useSearchParams } from "next/navigation";
import { Alert } from "react-bootstrap";
import { NewTicketDialog } from "../tickets/new-ticket-dialog";
import { TicketsSearchBar } from "../tickets-search-bar/tickets-search-bar";
import { IconInfoCircle } from "../../icons/icons";

import { useState } from "react";
import { TicketListSortable } from "./ticketlist-sortable";
import { useProjectApi } from "../project-hooks/useProjectApi";

type Props = {
  project?: ProjectResponse;
};

export const ProjectBacklog = ({ project }: Props) => {
  const searchParams = useSearchParams();
  const pageSize = 1000;
  const pageNumber = (searchParams.get("pageNumber") || 1) as number;
  const [backlogTickets, setBacklogTickets] = useState<TicketResponse[]>([]);
  const [draftBoard, setDraftBoard] = useState<BoardResponse>();

  const {
    fetchBacklogTickets,
    fetchDraftBoard,
    getReorderBoardTicketsMutation,
    getAssignTicketToDraftBoardMutation,
  } = useProjectApi();

  // Queries
  fetchBacklogTickets({
    enabled: !!project,
    projectId: project?.id,
    page: { pageSize, pageNumber },
    onSuccess: (data) => setBacklogTickets(data ?? []),
  });

  fetchDraftBoard({
    enabled: !!project,
    projectId: project?.id,
    onSuccess: (sprint?: BoardResponse) => setDraftBoard(sprint),
  });

  // Mutations
  const assignTicketToDraftBoard = getAssignTicketToDraftBoardMutation();
  const reorderBoardTickets = getReorderBoardTicketsMutation();

  if (!backlogTickets) {
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

  const moveTicket = (
    ticketId: number,
    newPosition: number,
    targetBoard: "backlog" | "draftBoard",
  ) => {
    let sourceBoard: "draftBoard" | "backlog" | undefined;
    // is ticket in backlog tickets or draft board?
    const ticketPositionInBacklog = backlogTickets.findIndex(
      (t) => Number(t.id) === ticketId,
    );

    let ticketPositionInDraftBoard = draftBoard?.tickets.findIndex(
      (t) => Number(t.id) === ticketId,
    );
    ticketPositionInDraftBoard = ticketPositionInDraftBoard ?? -1;

    // Validation: no ticket found by id -> exit
    if (ticketPositionInBacklog === -1 && ticketPositionInDraftBoard === -1) {
      return;
    }

    // Get source board
    if (ticketPositionInBacklog > -1) {
      sourceBoard = "backlog";
    } else if (ticketPositionInDraftBoard > -1) {
      sourceBoard = "draftBoard";
    }

    // Validation: ticket position has not changed at all -> exit
    if (
      sourceBoard === targetBoard &&
      ticketPositionInBacklog > -1 &&
      ticketPositionInBacklog === newPosition
    ) {
      return;
    }
    if (
      sourceBoard === targetBoard &&
      ticketPositionInDraftBoard > -1 &&
      ticketPositionInDraftBoard === newPosition
    ) {
      return;
    }

    // edge case
    let moveDown =
      sourceBoard === targetBoard &&
      ticketPositionInDraftBoard !== -1 &&
      ticketPositionInDraftBoard < newPosition;
    if (moveDown && ticketPositionInDraftBoard + 1 === newPosition) {
      return;
    }

    moveDown =
      sourceBoard === targetBoard &&
      ticketPositionInBacklog !== -1 &&
      ticketPositionInBacklog < newPosition;
    if (moveDown && ticketPositionInBacklog + 1 === newPosition) {
      return;
    }

    // Get ticket
    let targetTicket: TicketResponse | undefined;

    if (ticketPositionInBacklog > -1) {
      targetTicket = backlogTickets.at(ticketPositionInBacklog);
    } else if (ticketPositionInDraftBoard > -1) {
      targetTicket = draftBoard?.tickets.at(ticketPositionInDraftBoard);
    }

    if (!targetTicket) {
      return;
    }

    let currentTicketIndex = -1;
    let sourceList: TicketResponse[] = [];
    if (sourceBoard === "backlog") {
      sourceList = backlogTickets;
      currentTicketIndex = ticketPositionInBacklog;
    } else if (sourceBoard === "draftBoard") {
      sourceList = draftBoard?.tickets ?? [];
      currentTicketIndex = ticketPositionInDraftBoard;
    }

    let targetList: TicketResponse[] = [];
    if (targetBoard === "backlog") {
      targetList = backlogTickets;
    } else if (targetBoard === "draftBoard") {
      targetList = draftBoard?.tickets ?? [];
    }

    // Put ticket in target board
    let newList: TicketResponse[] = [];
    const movedToBottomOfList = newPosition === targetList.length;
    if (movedToBottomOfList) {
      newList = [...targetList];
      newList.splice(currentTicketIndex, 1);
      newList.push(targetTicket);
    } else {
      for (let i = 0; i < targetList.length; i++) {
        if (targetList.at(i)?.id === targetTicket.id) {
          continue;
        }

        if (i === newPosition) {
          newList.push(targetTicket);
        }

        newList.push(targetList[i] as TicketResponse);
      }
    }

    // Remove ticket from source board
    sourceList = sourceList.filter((ticket) => Number(ticket.id) !== ticketId);

    return {
      sourceList,
      targetList: newList,
    };
  };

  const changeOrderOfTicketsInDraftBoard = (
    ticketId: string,
    newPosition: number,
  ) => {
    const newList = moveTicket(Number(ticketId), newPosition, "draftBoard");
    if (!newList) {
      return;
    }

    // update list of tickets in draftSprint
    const newDraftBoard: BoardResponse | undefined = draftBoard
      ? { ...draftBoard, tickets: newList?.targetList ?? [] }
      : { name: "", startDate: "", endDate: "", tickets: [] };
    setDraftBoard(newDraftBoard);

    // update list of tickets in backlog
    setBacklogTickets(newList?.sourceList ?? []);

    assignTicketToDraftBoard.mutate({
      projectId: project!.id,
      ticketId: Number(ticketId),
    });

    reorderBoardTickets.mutate({
      projectId: project!.id,
      boardId: draftBoard?.id,
      ticketOrder: (newList?.targetList ?? []).map((ticket, index) => ({
        ticketId: parseInt(ticket.id),
        position: index,
      })),
    });
  };

  const changeOrderOfTicketsInBacklog = (
    ticketId: string,
    newPosition: number,
  ) => {
    const newList = moveTicket(Number(ticketId), newPosition, "backlog");
    if (!newList) {
      return;
    }

    // update list of tickets in backlog
    setBacklogTickets(newList?.targetList ?? []);

    // update list of tickets in draftSprint
    const newDraftBoard: BoardResponse | undefined = draftBoard
      ? { ...draftBoard, tickets: newList?.sourceList ?? [] }
      : { name: "", startDate: "", endDate: "", tickets: [] };
    setDraftBoard(newDraftBoard);

    reorderBoardTickets.mutate({
      projectId: project!.id,
      ticketOrder: (newList?.targetList ?? []).map((ticket, index) => ({
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
        {(!draftBoard || draftBoard?.tickets.length === 0) && (
          <Alert variant="info">
            <IconInfoCircle /> Es sind noch keine Tickets eingeplant für das
            nächste Sprint eingeplant. Tickets können per Drag&Drop in diesen
            Abschnitt gezogen werden.
          </Alert>
        )}

        <div>
          <TicketListSortable
            listKey="draftBoard"
            tickets={(draftBoard && draftBoard.tickets) ?? []}
            onDrop={(e, index) =>
              changeOrderOfTicketsInDraftBoard(
                e.dataTransfer.getData("text"),
                index,
              )
            }
          />
        </div>
      </div>
      <h3>Backlog</h3>

      <TicketListSortable
        listKey="backlog"
        tickets={backlogTickets}
        onDrop={(e, index) =>
          changeOrderOfTicketsInBacklog(e.dataTransfer.getData("text"), index)
        }
      />
    </>
  );
};
