import {
  ProjectResponse,
  BoardResponse,
  TicketResponse,
  getAPI,
} from "@app/api";
import { useSearchParams } from "next/navigation";
import {
  Alert,
  Button,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import { NewTicketDialog } from "../tickets/new-ticket-dialog";
import { TicketsSearchBar } from "../tickets-search-bar/tickets-search-bar";
import { IconInfoCircle } from "../../icons/icons";
import { useTranslation } from "../../i18n";

import { useState } from "react";
import { TicketListSortable } from "./ticketlist-sortable";
import {
  useAssignTicketToDraftBoard,
  useFetchBacklogTickets,
  useFetchDraftBoard,
  useReorderBoardTickets,
} from "../project-hooks";
import { moveItem } from "@app/utils";
import { DatePicker } from "../../components/DatePicker/DatePicker";

type Props = {
  project?: ProjectResponse;
};

export const ProjectBacklog = ({ project }: Props) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const pageSize = 1000;
  const pageNumber = (searchParams.get("pageNumber") || 1) as number;

  const [showStartSprintModal, setShowStartSprintModal] = useState(false);
  const [sprintEndDate, setSprintEndDate] = useState<Date | null>(null);

  const months = [
    t("months.january"),
    t("months.february"),
    t("months.march"),
    t("months.april"),
    t("months.may"),
    t("months.june"),
    t("months.july"),
    t("months.august"),
    t("months.september"),
    t("months.october"),
    t("months.november"),
    t("months.december"),
  ];

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
    setShowStartSprintModal(true);
  };

  const handleStartSprintSubmit = async () => {
    if (!sprintEndDate || !project) return;

    await getAPI().post.createSprint(project.id, {
      endDate: sprintEndDate,
    });

    setShowStartSprintModal(false);
    setSprintEndDate(null);
    alert(t("sprint.started"));
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
          <h3>{t("sprint.next")}</h3>
          <Button onClick={handleStartSprint}>{t("sprint.start")}</Button>
        </div>

        {(!draftBoard || draftBoard?.tickets.length === 0) && (
          <Alert variant="info">
            <IconInfoCircle /> {t("sprint.noTickets")}
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

      <Modal
        show={showStartSprintModal}
        onHide={() => setShowStartSprintModal(false)}
      >
        <ModalHeader closeButton>
          <ModalTitle>{t("sprint.modal.title")}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Form.Group className="mb-3">
            <Form.Label>{t("sprint.modal.endDate")}</Form.Label>
            <DatePicker
              className="form-control"
              placeholder={t("sprint.modal.selectDate")}
              dictionaryMonths={months}
              onSelect={(date) => setSprintEndDate(date)}
            />
          </Form.Group>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline-secondary"
            onClick={() => setShowStartSprintModal(false)}
          >
            {t("sprint.modal.cancel")}
          </Button>
          <Button
            variant="primary"
            disabled={!sprintEndDate}
            onClick={handleStartSprintSubmit}
          >
            {t("sprint.start")}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
