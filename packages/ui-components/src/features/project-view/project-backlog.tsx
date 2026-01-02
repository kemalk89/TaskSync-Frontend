import { getAPI, ProjectResponse, TicketResponse } from "@app/api";
import { useSearchParams } from "next/navigation";
import { Alert, Button, Card } from "react-bootstrap";
import { UserImage } from "../../user-name/user-img";
import { NewTicketDialog } from "../tickets/new-ticket-dialog";
import { TicketTitleWithLink } from "../tickets/ticket-title-with-link";
import { TicketsSearchBar } from "../tickets-search-bar/tickets-search-bar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEY_PREFIX_FETCH_TICKETS } from "../constants";
import {
  IconGripVertical,
  IconInfoCircle,
  IconThreeDots,
} from "../../icons/icons";
import {
  MoreMenu,
  MoreMenuItem,
  MoreMenuItemDivider,
} from "../../components/more-menu/more-menu";
import { copyTextToClipboard } from "@app/utils";
import { useDeleteTicketModal } from "../ticket-hooks/use-delete-ticket-modal";
import { useRouter } from "next/navigation";

import styles from "./styles.module.css";
import {
  Draggable,
  DroppableSlot,
} from "../../components/drag-and-drop/drag-and-drop";
import { useState } from "react";
import { ReorderBacklogTicketsCommand } from "../../../../api/src/request.models";

type Props = {
  project?: ProjectResponse;
};

export const ProjectBacklog = ({ project }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageSize = 1000;
  const pageNumber = (searchParams.get("pageNumber") || 1) as number;
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  useQuery({
    enabled: !!project,
    queryKey: [QUERY_KEY_PREFIX_FETCH_TICKETS, { pageSize, pageNumber }],
    queryFn: async () => {
      const response = await getAPI().fetchBacklogTickets(project!.id);

      setTickets(response.data ?? []);
      return response.data;
    },
  });

  const reorderBacklogTickets = useMutation({
    mutationFn: (command: {
      projectId: number;
      ticketOrder: ReorderBacklogTicketsCommand;
    }) => {
      return getAPI().post.reorderBacklogTickets(
        command.projectId,
        command.ticketOrder
      );
    },
  });

  const { deleteTicket } = useDeleteTicketModal();

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

  const changeOrderOfTickets = (ticketId: string, newPosition: number) => {
    const currentTicketIndex = tickets.findIndex(
      (t) => parseInt(t.id) === parseInt(ticketId)
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

  const handleCopyLinkToClipboard = async (url: string) => {
    const success = await copyTextToClipboard(url);
    if (success) {
      alert("Link copied!");
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
        <h3>Nächster Sprint</h3>
        <Alert variant="info">
          <IconInfoCircle /> Es sind noch keine Tickets eingeplant für das
          nächste Sprint eingeplant. Tickets können per Drag&Drop in diesen
          Abschnitt gezogen werden.
        </Alert>
      </div>
      <h3>Backlog</h3>

      {tickets.map((ticket, index) => (
        <div key={`row-${ticket.id}`}>
          {index === 0 && (
            <DroppableSlot
              onDrop={(e) =>
                changeOrderOfTickets(e.dataTransfer.getData("text"), index)
              }
            />
          )}
          <Card body bg="light" border="dark" className={styles.card}>
            <div className="d-flex">
              <div className="d-flex align-items-center">
                <Draggable
                  className={styles.draggableControl}
                  itemIdentifier={ticket.id}
                  onDragEnd={(e) => {
                    const card = (e.target as HTMLElement).closest(".card");
                    card?.classList.remove(styles.draggingElement as string);
                  }}
                  onDragStart={(e) => {
                    const card = (e.target as HTMLDivElement).closest(".card");
                    card?.classList.add(styles.draggingElement as string);
                  }}
                  dragImageBuilder={(draggableElement: HTMLElement) => {
                    const card = draggableElement.closest(".card");

                    const ticketTitleIcon =
                      card?.querySelector(".ticket-title svg");

                    if (ticketTitleIcon) {
                      const dragImg = document.createElement("div");
                      dragImg.classList.add(
                        "border",
                        "border-dark",
                        "p-2",
                        "d-flex",
                        "gap-2",
                        "bg-white"
                      );

                      dragImg.appendChild(ticketTitleIcon.cloneNode(true));

                      const ticketTitleEl = document.createElement("span");
                      ticketTitleEl.innerText = ticket.title;
                      dragImg.appendChild(ticketTitleEl);

                      return dragImg;
                    }
                  }}
                >
                  <IconGripVertical />
                </Draggable>
                <div
                  className={styles.draggableControl}
                  draggable
                  onDragEnd={(e) => {
                    const card = (e.target as HTMLElement).closest(".card");
                    card?.classList.remove(styles.draggingElement as string);
                  }}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text", ticket.id);
                  }}
                ></div>
              </div>
              <div className={"d-flex gap-2 flex-fill " + styles.cardContent}>
                <div className="flex-fill ticket-title">
                  <TicketTitleWithLink ticket={ticket} />
                </div>
                <Button size="sm" variant="outline-primary">
                  Schätzen
                </Button>
                <UserImage />
                <MoreMenu button={<IconThreeDots />}>
                  <MoreMenuItem
                    onClick={() => router.push(`/tickets/${ticket.id}`)}
                  >
                    Öffnen
                  </MoreMenuItem>
                  <MoreMenuItem href={`/tickets/${ticket.id}`} target="_blank">
                    Öffne im neuen Tab
                  </MoreMenuItem>
                  <MoreMenuItemDivider />
                  <MoreMenuItem
                    onClick={() =>
                      handleCopyLinkToClipboard(
                        `${window.location.origin}/tickets/${ticket.id}`
                      )
                    }
                  >
                    Link kopieren
                  </MoreMenuItem>
                  <MoreMenuItemDivider />
                  <MoreMenuItem onClick={() => deleteTicket(ticket)}>
                    Löschen
                  </MoreMenuItem>
                </MoreMenu>
              </div>
            </div>
          </Card>
          <DroppableSlot
            onDrop={(e) =>
              changeOrderOfTickets(e.dataTransfer.getData("text"), index + 1)
            }
          />
        </div>
      ))}
    </>
  );
};
