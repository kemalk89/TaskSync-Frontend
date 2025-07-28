import { TicketResponse } from "@app/api";
import { TicketIcon } from "../tickets/ticket-icons";
import { TicketComments } from "../ticket-comments/ticket-comments";
import { TextEditorReadonly } from "../../texteditor/texteditor-readonly";

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
        <TextEditorReadonly
          content={
            ticket.description ?? (
              <p>Dieses Ticket hat noch keine Beschreibung</p>
            )
          }
        />
      </div>
      <div className="mt-4">
        <h4>Kommentare</h4>
        <TicketComments ticketId={ticket.id} />
      </div>
    </div>
  );
};
