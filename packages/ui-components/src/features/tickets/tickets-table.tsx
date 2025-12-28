import { Button, Table } from "react-bootstrap";
import { TicketResponse } from "@app/api";
import { useRouter } from "next/navigation";
import { TicketTitleWithLink } from "./ticket-title-with-link";
import { UserName } from "../../user-name/user-name";
import {
  MoreMenu,
  MoreMenuItem,
  MoreMenuItemDivider,
} from "../../components/more-menu/more-menu";
import { copyTextToClipboard } from "@app/utils";
import { IconThreeDots } from "../../icons/icons";

type Props = {
  isLoading?: boolean;
  tickets?: TicketResponse[];
  onDeleteTicket: (ticket: TicketResponse) => void;
};

/**
 * Presentational component for the tickets table.
 */
export const TicketsTable = ({ isLoading, tickets, onDeleteTicket }: Props) => {
  const router = useRouter();

  const handleCopyLinkToClipboard = async (url: string) => {
    const success = await copyTextToClipboard(url);
    if (success) {
      alert("Link copied!");
    }
  };

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
                <td width="300">
                  <UserName user={ticket.assignee} />
                </td>
                <td width="50">
                  <MoreMenu button={<IconThreeDots />}>
                    <MoreMenuItem
                      onClick={() => router.push(`/tickets/${ticket.id}`)}
                    >
                      Öffnen
                    </MoreMenuItem>
                    <MoreMenuItem
                      href={`/tickets/${ticket.id}`}
                      target="_blank"
                    >
                      Öffne im neuen Tab
                    </MoreMenuItem>
                    <MoreMenuItemDivider />
                    <MoreMenuItem
                      onClick={() =>
                        handleCopyLinkToClipboard(
                          `${window.location.origin}/tickets/${ticket.id}`
                        )
                      }
                    >
                      Link kopieren
                    </MoreMenuItem>
                    <MoreMenuItemDivider />
                    <MoreMenuItem onClick={() => onDeleteTicket(ticket)}>
                      Löschen
                    </MoreMenuItem>
                  </MoreMenu>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {isLoading && <span>Loading...</span>}
    </>
  );
};
