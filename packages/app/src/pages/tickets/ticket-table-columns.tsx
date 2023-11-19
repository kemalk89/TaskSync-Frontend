import { TicketResponse } from "@app/api";
import { UserName } from "../../components/user-name/user-name";
import { ItemsTableColumn } from "../../components/table-page/items-table";

export const ticketTableColumns: ItemsTableColumn<TicketResponse>[] = [
  { title: "ID", fieldName: "id" },
  { title: "Title", fieldName: "title" },
  {
    title: "Assignee",
    fieldName: (ticket) => {
      if (!ticket.assignee) {
        return null;
      }

      return <UserName user={ticket.assignee} />;
    },
  },
  {
    title: "Status",
    fieldName: (ticket) => {
      if (!ticket.status) {
        return null;
      }

      return <span>{ticket.status.name}</span>;
    },
  },
];
