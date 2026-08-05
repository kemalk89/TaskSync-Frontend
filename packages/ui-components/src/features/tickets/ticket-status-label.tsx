import { TicketResponse } from "@app/api";
import { Badge } from "react-bootstrap";

export const TicketStatusLabel = ({ ticket }: { ticket: TicketResponse }) => {
  if (ticket.Status) {
    let bg = "secondary";
    if (ticket.Status.id === 2) {
      bg = "info";
    }
    if (ticket.Status.id === 3) {
      bg = "success";
    }
    return <Badge bg={bg}>{ticket.Status.name}</Badge>;
  }

  return null;
};
