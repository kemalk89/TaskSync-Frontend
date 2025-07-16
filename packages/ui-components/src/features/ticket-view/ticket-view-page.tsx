import { TicketResponse } from "@app/api";
import { TicketIcon } from "../tickets/ticket-icons";
import { Form } from "react-bootstrap";
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
      <div style={{ display: "flex", gap: "8px", fontWeight: "bold" }}>
        <TicketIcon ticket={ticket} /> {ticket.title}
      </div>
      <div>
        <h4>Beschreibung</h4>
        {ticket.description || (
          <div>Dieses Ticket hat noch keine Beschreibung</div>
        )}
      </div>
      <div>
        <h4>Kommentare</h4>
        <TicketComments />
      </div>
    </div>
  );
};
