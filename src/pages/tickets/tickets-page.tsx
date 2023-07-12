import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { TablePage } from "../../components/table-page/table-page";
import { TicketForm } from "./ticket-form";
import { UserName } from "../../components/user-name/user-name";
import { ItemsTableColumn } from "../../components/table-page/items-table";
import { TicketResponse } from "../../api/responses";

export const TicketsPage = () => {
  const navigate = useNavigate();

  const columns: ItemsTableColumn<TicketResponse>[] = [
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

  return (
    <TablePage
      pageTitle="Tickets"
      cacheKey="tickets"
      getItemsApi={api.fetchTickets}
      saveItemApi={api.saveTicket}
      deleteItemApi={api.deleteTicket}
      onViewItem={(item: any) => navigate(`/ticket/${item.id}`)}
      itemForm={TicketForm}
      tableData={{ columns }}
      renderDeleteConfirmationModalBody={(ticket) => (
        <p>Are you sure you want to delete ticket "{ticket.title}"?</p>
      )}
    ></TablePage>
  );
};
