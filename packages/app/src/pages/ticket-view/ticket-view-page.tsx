import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { UserName } from "../../components/user-name/user-name";
import { EditableField } from "../../components/editable-field/editable-field";
import { api } from "@times/api";
import { formatDateTime } from "@times/utils";

interface UpdateTicketMutationFnParams {
  ticketId: number;
  newStatus: number;
}

export const TicketViewPage = () => {
  const { ticketId } = useParams();

  const fetchTicket = useQuery({
    queryKey: ["ticket"],
    queryFn: () => api.fetchTicket(ticketId!),
  });

  const updateTicketStatus = useMutation({
    mutationFn: ({ ticketId, newStatus }: UpdateTicketMutationFnParams) =>
      api.updateTicketStatus(ticketId, newStatus),
  });

  if (fetchTicket.isLoading) {
    return <div>...</div>;
  }

  return (
    <div>
      <h1>{fetchTicket.data.title}</h1>
      <p>
        <small>
          created at {formatDateTime(fetchTicket.data.createdDate)} by{" "}
          {fetchTicket.data.createdBy?.username}
        </small>
      </p>
      <div className="row">
        <div className="col">Assignee</div>
        <div className="col">
          <EditableField
            type="autocomplete-async"
            autoCompleteAsyncFn={api.searchUsers}
            autoCompleteId="assignee"
            autoCompleteLabelKey="username"
            value={
              fetchTicket.data.assignee ? (
                <UserName user={fetchTicket.data.assignee} />
              ) : (
                "Unassigned"
              )
            }
            onSave={(item) => console.log(item)}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">Status</div>
        <div className="col">
          <EditableField
            type="select"
            value={{ id: 1, label: "Todo" }}
            options={[
              { id: 1, label: "Todo", onClick: () => null },
              { id: 2, label: "In Progress", onClick: () => null },
              { id: 3, label: "Done", onClick: () => null },
            ]}
            onSave={(newStatus) =>
              updateTicketStatus.mutate({
                ticketId: parseInt(ticketId!),
                newStatus: newStatus.id,
              })
            }
          />
        </div>
      </div>

      <h2>Description</h2>
      <p>{fetchTicket.data.description}</p>

      <h2>Comments</h2>
    </div>
  );
};
