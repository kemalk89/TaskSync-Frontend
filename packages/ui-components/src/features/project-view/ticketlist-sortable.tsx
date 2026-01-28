import { TicketResponse } from "@app/api";
import { DragEvent } from "react";
import {
  MoreMenu,
  MoreMenuItem,
  MoreMenuItemDivider,
} from "../../components/more-menu/more-menu";
import { copyTextToClipboard } from "@app/utils";
import { useDeleteTicketModal } from "../ticket-hooks/use-delete-ticket-modal";
import { useRouter } from "next/navigation";
import { Button, Card } from "react-bootstrap";
import { TicketTitleWithLink } from "../tickets/ticket-title-with-link";
import { UserImage } from "../../user-name/user-img";
import { IconGripVertical, IconThreeDots } from "../../icons/icons";
import styles from "./styles.module.css";
import {
  Draggable,
  DroppableSlot,
} from "../../components/drag-and-drop/drag-and-drop";

export const TicketListSortable = ({
  listKey,
  tickets,
  onDrop,
}: {
  listKey: string;
  tickets: TicketResponse[];
  onDrop: (e: DragEvent<HTMLDivElement>, index: number) => void;
}) => {
  const router = useRouter();
  const { deleteTicket } = useDeleteTicketModal();

  const handleCopyLinkToClipboard = async (url: string) => {
    const success = await copyTextToClipboard(url);
    if (success) {
      alert("Link copied!");
    }
  };

  if (tickets.length === 0) {
    return <DroppableSlot onDrop={(e) => onDrop(e, 0)} />;
  }

  return (
    <>
      {tickets.map((ticket, index) => (
        <div key={`${listKey}-row-${ticket.id}`}>
          {index === 0 && <DroppableSlot onDrop={(e) => onDrop(e, index)} />}
          <Card body bg="light" border="dark" className={styles.card}>
            <div className="d-flex">
              <div className="d-flex align-items-center">
                <Draggable
                  testId={`draggable-ticket-${index}`}
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
                        "bg-white",
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
                        `${window.location.origin}/tickets/${ticket.id}`,
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
          <DroppableSlot onDrop={(e) => onDrop(e, index + 1)} />
        </div>
      ))}
    </>
  );
};
