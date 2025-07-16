import Link from "next/link";
import { TicketIcon } from "./ticket-icons";
import { TicketResponse } from "@app/api";

type Props = {
  ticket: TicketResponse;
};

export const TicketTitleWithLink = ({ ticket }: Props) => {
  return (
    <Link href={`/tickets/${ticket.id}`}>
      <div style={{ display: "flex", gap: "8px" }}>
        <TicketIcon ticket={ticket} /> {ticket.title}
      </div>
    </Link>
  );
};
