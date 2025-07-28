import { TicketResponse } from "@app/api";
import { TicketIcon } from "../tickets/ticket-icons";
import { TicketComments } from "../ticket-comments/ticket-comments";

type Props = {
  ticket?: TicketResponse;
};

export const TicketViewPage = ({ ticket }: Props) => {
  if (!ticket) {
    return null;
  }

  return (
    <div>
      <h3 style={{ display: "flex", gap: "8px" }}>
        <TicketIcon ticket={ticket} /> {ticket.title}
      </h3>
      <div className="mt-4">
        <h4>Beschreibung</h4>
        {ticket.description || (
          <div>Dieses Ticket hat noch keine Beschreibung</div>
        )}
      </div>
      <div className="mt-4">
        <h4>Kommentare</h4>
        <TicketComments ticketId={ticket.id} />
      </div>
    </div>
  );
};
