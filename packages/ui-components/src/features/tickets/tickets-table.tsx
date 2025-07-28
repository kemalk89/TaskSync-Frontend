import { Button, Table } from "react-bootstrap";
import { TicketResponse } from "@app/api";
import { useRouter } from "next/navigation";
import { TicketTitleWithLink } from "./ticket-title-with-link";

type Props = {
  isLoading?: boolean;
  tickets?: TicketResponse[];
  onEditTicket: (ticket: TicketResponse) => void;
  onDeleteTicket: (ticket: TicketResponse) => void;
};

/**
 * Presentational component for the tickets table.
 */
export const TicketsTable = ({
  isLoading,
  tickets,
  onDeleteTicket,
  onEditTicket,
}: Props) => {
  const router = useRouter();

  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>Titel</th>
            <th>Bearbeiter</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!isLoading &&
            tickets?.map((ticket) => (
              <tr key={ticket.id}>
                <td>
                  <TicketTitleWithLink ticket={ticket} />
                </td>
                <td width="300"></td>
                <td width="180">
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
      {isLoading && <span>Loading...</span>}
    </>
  );
};
