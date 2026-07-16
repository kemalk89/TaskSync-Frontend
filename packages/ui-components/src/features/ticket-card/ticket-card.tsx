import { Card } from "react-bootstrap";
import { Draggable } from "../../components/drag-and-drop/drag-and-drop";
import { useRouter } from "next/navigation";

import styles from "./styles.module.css";
import { IconGripVertical, IconThreeDots } from "../../icons/icons";
import { TicketTitleWithLink } from "../tickets/ticket-title-with-link";
import { UserImage } from "../../components/user-name/user-img";
import {
  MoreMenu,
  MoreMenuItem,
  MoreMenuItemDivider,
} from "../../components/more-menu/more-menu";
import { TicketResponse } from "@app/api";
import { copyTextToClipboard } from "@app/utils";

type Props = {
  identifier: string;
  ticket?: TicketResponse;
  onDelete: (ticket: TicketResponse) => void;
};

export const TicketCardDraggable = ({
  identifier,
  ticket,
  onDelete,
}: Props) => {
  const router = useRouter();

  const handleCopyLinkToClipboard = async (url: string) => {
    const success = await copyTextToClipboard(url);
    if (success) {
      alert("Link copied!");
    }
  };

  if (!ticket) {
    return (
      <Card body bg="light" border="dark" className={styles.card}>
        Unknown Ticket
      </Card>
    );
  }

  return (
    <Card body bg="light" border="dark" className={styles.card}>
      <div className="d-flex">
        <div className="d-flex align-items-center">
          <Draggable
            testId={`draggable-ticket-${identifier}`}
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

              const ticketTitleIcon = card?.querySelector(".ticket-title svg");

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

          <div style={{ width: "32px" }}>
            <UserImage />
          </div>
          <MoreMenu button={<IconThreeDots />}>
            <MoreMenuItem onClick={() => router.push(`/tickets/${ticket.id}`)}>
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
            <MoreMenuItem onClick={() => onDelete(ticket)}>
              Löschen
            </MoreMenuItem>
          </MoreMenu>
        </div>
      </div>
    </Card>
  );
};
