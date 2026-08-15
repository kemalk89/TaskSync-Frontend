import {
  ProjectResponse,
  BoardResponse,
  TicketResponse,
  getAPI,
} from "@app/api";
import { useRouter, useSearchParams } from "next/navigation";
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
import { DatePicker, SortResult } from "@app/ui-lib";

type Props = {
  project?: ProjectResponse;
};

export const ProjectBacklog = ({ project }: Props) => {
  const { t } = useTranslation();
  const router = useRouter();

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
    onSuccess: (sprint?: BoardResponse) => sprint && setDraftBoard(sprint),
  });

  const [backlogTickets, setBacklogTickets] = useState<TicketResponse[]>(
    initialBacklogTickets ?? [],
  );
  const [draftBoard, setDraftBoard] = useState<BoardResponse>(
    initialDraftBoard ?? { name: "", startDate: "", endDate: "", tickets: [] },
  );

  // Mutations
  const assignTicketToDraftBoard = useAssignTicketToDraftBoard();
  const reorderBoardTickets = useReorderBoardTickets();

  const changeOrderOfTickets = (result: SortResult<TicketResponse>) => {
    // optimistic update of UI
    const sortedWorkItems = result.targetListItems;

    if (result.sourceListId === result.targetListId) {
      if (result.sourceListId === "draftBoard") {
        const newDraftBoard: BoardResponse = {
          ...draftBoard,
          tickets: sortedWorkItems,
        };
        setDraftBoard(newDraftBoard);
      } else {
        setBacklogTickets(result.targetListItems);
      }
    } else {
      if (result.targetListId === "draftBoard") {
        const newDraftBoard: BoardResponse = {
          ...draftBoard,
          tickets: sortedWorkItems,
        };

        setDraftBoard(newDraftBoard);
        setBacklogTickets(result.sourceListItems);
      } else if (result.targetListId === "backlog") {
        const newDraftBoard: BoardResponse = {
          ...draftBoard,
          tickets: result.sourceListItems,
        };
        setDraftBoard(newDraftBoard);
        setBacklogTickets(result.targetListItems);
      }
    }

    // call API to sync backend
    const ticketId = result.sortedItemIds.at(0);
    if (result.targetListId === "draftBoard" && ticketId) {
      assignTicketToDraftBoard.mutate({
        projectId: project!.id,
        ticketId: Number(ticketId),
      });

      reorderBoardTickets.mutate({
        boardId: draftBoard?.id,
        projectId: project!.id,
        ticketOrder: result.targetListItems.map((ticket, index) => ({
          ticketId: parseInt(ticket.id),
          position: index,
        })),
      });
    } else if (result.targetListId === "backlog" && ticketId) {
      reorderBoardTickets.mutate({
        projectId: project!.id,
        ticketOrder: result.targetListItems.map((ticket, index) => ({
          ticketId: parseInt(ticket.id),
          position: index,
        })),
      });
    }
  };

  // Event Handlers
  const handleStartSprint = () => {
    setShowStartSprintModal(true);
  };

  const handleStartSprintSubmit = async () => {
    if (!sprintEndDate || !project) {
      return;
    }

    await getAPI().post.createSprint(project.id, {
      endDate: sprintEndDate,
      ticketIds: draftBoard?.tickets.map((t) => Number(t.id)) ?? [],
    });

    router.push(`/projects/${project.id}?tab=board`);
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
            lists={[
              { id: "backlog", items: backlogTickets },
              { id: "draftBoard", items: draftBoard?.tickets ?? [] },
            ]}
            onSort={changeOrderOfTickets}
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
        lists={[
          { id: "backlog", items: backlogTickets },
          { id: "draftBoard", items: draftBoard?.tickets ?? [] },
        ]}
        onSort={changeOrderOfTickets}
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
