import { api } from "@times/api";
import { Page, formatDateTime, useParamsNumber } from "@times/utils";
import { useQuery } from "react-query";
import { ticketTableColumns } from "../tickets/ticket-table-columns";
import { TableView } from "../../components/table-page/table-view";
import { TicketForm } from "../tickets/ticket-form";
import { useNavigate } from "react-router-dom";

export const ProjectViewPage = () => {
  const navigate = useNavigate();

  const projectId = useParamsNumber("projectId");

  const fetchProject = useQuery({
    queryKey: ["project"],
    queryFn: () => api.fetchProject(projectId!),
  });

  if (fetchProject.isLoading) {
    return <div>...</div>;
  }

  const renderProjectTickets = () => {
    return (
      <TableView
        pageTitle=""
        cacheKey="tickets"
        getItemsApi={(page: Page) => api.fetchProjectTickets(projectId!, page)}
        initialPage={{ pageSize: 15, pageNumber: 1 }}
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

  return (
    <div>
      <h1>{fetchProject.data.title}</h1>
      <p>
        <small>
          created at {formatDateTime(fetchProject.data.createdDate)} by{" "}
          {fetchProject.data.createdBy?.username}
        </small>
      </p>
      <h2>Description</h2>
      <p>{fetchProject.data.description}</p>
      <h2>Tickets</h2>
      {renderProjectTickets()}
    </div>
  );
};
