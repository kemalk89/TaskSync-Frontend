import { TicketResponse } from "@app/api";
import { DragEvent } from "react";
import { useDeleteTicketModal } from "../ticket-hooks/use-delete-ticket-modal";
import { DroppableSlot } from "../../components/drag-and-drop/drag-and-drop";
import { TicketCardDraggable } from "../ticket-card/ticket-card";

export const TicketListSortable = ({
  listKey,
  tickets,
  onDrop,
}: {
  listKey: string;
  tickets: TicketResponse[];
  onDrop: (e: DragEvent<HTMLDivElement>, index: number) => void;
}) => {
  const { deleteTicket } = useDeleteTicketModal();

  if (tickets.length === 0) {
    return <DroppableSlot onDrop={(e) => onDrop(e, 0)} />;
  }

  return (
    <div id={listKey}>
      {tickets.map((ticket, index) => (
        <div key={`${listKey}-row-${ticket.id}`}>
          {index === 0 && <DroppableSlot onDrop={(e) => onDrop(e, index)} />}

          <TicketCardDraggable
            identifier={index.toString()}
            ticket={ticket}
            onDelete={deleteTicket}
          />

          <DroppableSlot onDrop={(e) => onDrop(e, index + 1)} />
        </div>
      ))}
    </div>
  );
};
