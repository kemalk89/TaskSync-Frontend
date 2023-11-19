import { useNavigate } from "react-router-dom";
import { api } from "@app/api";
import { TableView } from "../../components/table-page/table-view";
import { TicketForm } from "./ticket-form";
import { ticketTableColumns } from "./ticket-table-columns";

export const TicketsPage = () => {
  const navigate = useNavigate();

  return (
    <TableView
      pageTitle="Tickets"
      cacheKey="tickets"
      getItemsApi={api.fetchTickets}
      saveItemApi={api.saveTicket}
      deleteItemApi={api.deleteTicket}
      onViewItem={(item: any) => navigate(`/ticket/${item.id}`)}
      itemForm={TicketForm}
      tableData={{ columns: ticketTableColumns }}
      renderDeleteConfirmationModalBody={(ticket) => (
        <p>Are you sure you want to delete ticket "{ticket.title}"?</p>
      )}
    ></TableView>
  );
};
