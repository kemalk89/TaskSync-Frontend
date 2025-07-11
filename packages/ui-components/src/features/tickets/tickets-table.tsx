import { Button, Table } from "react-bootstrap";
import Link from "next/link";
import { TicketIcon } from "./ticket-icons";
import { TicketResponse } from "@app/api";
import { useRouter } from "next/navigation";

type Props = {
  tickets?: TicketResponse[];
  onEditTicket: (ticket: TicketResponse) => void;
  onDeleteTicket: (ticket: TicketResponse) => void;
};

/**
 * Presentational component for the tickets table.
 */
export const TicketsTable = ({
  tickets,
  onDeleteTicket,
  onEditTicket,
}: Props) => {
  const router = useRouter();

  return (
    <Table>
      <thead>
        <tr>
          <th>Titel</th>
          <th>Bearbeiter</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {tickets?.map((ticket) => (
          <tr key={ticket.id}>
            <td>
              <Link href={`/tickets/${ticket.id}`}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <TicketIcon ticket={ticket} />
                  {ticket.title}
                </div>
              </Link>
            </td>
            <td width="100"></td>
            <td width="200">
              <Button
                size="sm"
                onClick={() => router.push(`/tickets/${ticket.id}`)}
              >
                View
              </Button>{" "}
              <Button size="sm" onClick={() => onEditTicket(ticket)}>
                Edit
              </Button>{" "}
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDeleteTicket(ticket)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
