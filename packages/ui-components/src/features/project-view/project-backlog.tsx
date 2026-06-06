import { ProjectResponse, BoardResponse, TicketResponse } from "@app/api";
import { useSearchParams } from "next/navigation";
import { Alert, Button } from "react-bootstrap";
import { NewTicketDialog } from "../tickets/new-ticket-dialog";
import { TicketsSearchBar } from "../tickets-search-bar/tickets-search-bar";
import { IconInfoCircle } from "../../icons/icons";

import { useState } from "react";
import { TicketListSortable } from "./ticketlist-sortable";
import {
  useAssignTicketToDraftBoard,
  useFetchBacklogTickets,
  useFetchDraftBoard,
  useReorderBoardTickets,
} from "../project-hooks";
import { moveItem } from "@app/utils";

type Props = {
  project?: ProjectResponse;
};

export const ProjectBacklog = ({ project }: Props) => {
  const searchParams = useSearchParams();
  const pageSize = 1000;
  const pageNumber = (searchParams.get("pageNumber") || 1) as number;

  // Queries
  const { data: initialBacklogTickets } = useFetchBacklogTickets({
    enabled: !!project,
    projectId: project?.id,
    page: { pageSize, pageNumber },
    onSuccess: (data) => setBacklogTickets(data ?? []),
  });

  const { data: initialDraftBoard } = useFetchDraftBoard({
    enabled: !!project,
    projectId: project?.id,
    onSuccess: (sprint?: BoardResponse) => setDraftBoard(sprint),
  });

  const [backlogTickets, setBacklogTickets] = useState<TicketResponse[]>(
    initialBacklogTickets ?? [],
  );
  const [draftBoard, setDraftBoard] = useState<
    BoardResponse | undefined | null
  >(initialDraftBoard);

  // Mutations
  const assignTicketToDraftBoard = useAssignTicketToDraftBoard();
  const reorderBoardTickets = useReorderBoardTickets();

  const changeOrderOfTicketsInDraftBoard = (
    ticketId: string,
    newPosition: number,
  ) => {
    const moveItemResult = moveItem<TicketResponse>({
      containers: [
        { id: "backlog", items: backlogTickets },
        { id: "draftBoard", items: draftBoard?.tickets ?? [] },
      ],
      itemId: ticketId,
      newPosition,
      targetContainerId: "draftBoard",
    });

    if (!moveItemResult) {
      return;
    }

    const newDraftBoard: BoardResponse | undefined = draftBoard
      ? { ...draftBoard, tickets: moveItemResult?.targetList ?? [] }
      : { name: "", startDate: "", endDate: "", tickets: [] };
    setDraftBoard(newDraftBoard);
    if (moveItemResult.sourceContainerId === "backlog") {
      setBacklogTickets(moveItemResult.sourceList);
    }

    // update list of tickets in draftSprint
    assignTicketToDraftBoard.mutate({
      projectId: project!.id,
      ticketId: Number(ticketId),
    });
    reorderBoardTickets.mutate({
      projectId: project!.id,
      boardId: draftBoard?.id,
      ticketOrder: (moveItemResult?.targetList ?? []).map((ticket, index) => ({
        ticketId: parseInt(ticket.id),
        position: index,
      })),
    });
  };

  const changeOrderOfTicketsInBacklog = (
    ticketId: string,
    newPosition: number,
  ) => {
    const moveItemResult = moveItem<TicketResponse>({
      containers: [
        { id: "backlog", items: backlogTickets },
        { id: "draftBoard", items: draftBoard?.tickets ?? [] },
      ],
      itemId: ticketId,
      newPosition,
      targetContainerId: "backlog",
    });

    if (!moveItemResult) {
      return;
    }

    // update list of tickets in backlog
    setBacklogTickets(moveItemResult?.targetList ?? []);
    if (moveItemResult.sourceContainerId === "draftBoard") {
      const newDraftBoard: BoardResponse | undefined = draftBoard
        ? { ...draftBoard, tickets: moveItemResult?.sourceList ?? [] }
        : { name: "", startDate: "", endDate: "", tickets: [] };
      setDraftBoard(newDraftBoard);
    }
    reorderBoardTickets.mutate({
      projectId: project!.id,
      ticketOrder: (moveItemResult?.targetList ?? []).map((ticket, index) => ({
        ticketId: parseInt(ticket.id),
        position: index,
      })),
    });
  };

  // Event Handlers
  const handleStartSprint = () => {
    if (draftBoard?.tickets.length) {
    } else {
    }
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
        <div className="d-flex justify-content-between mb-3">
          <h3>Nächster Sprint</h3>
          <Button onClick={handleStartSprint}>Sprint starten</Button>
        </div>

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

      {backlogTickets.length === 0 && (
        <Alert variant="info">
          <div className="d-flex gap-2 align-items-center">
            <div>
              <IconInfoCircle /> Das Backlog ist leer. Gleich Ticket anlegen:
            </div>
            <div>
              <NewTicketDialog buttonProps={{ size: "sm" }} />
            </div>
          </div>
        </Alert>
      )}

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
