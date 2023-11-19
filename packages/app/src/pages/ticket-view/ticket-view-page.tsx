import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { UserName } from "../../components/user-name/user-name";
import { EditableField } from "../../components/editable-field/editable-field";
import { api } from "@app/api";
import { TextEditor } from "@app/ui-components";
import { formatDateTime } from "@app/utils";
import { Button } from "reactstrap";
import { useState } from "react";

interface UpdateTicketMutationFnParams {
  ticketId: number;
  newStatus: number;
}

interface AddTicketCommentMutationFnParams {
  ticketId: number;
  comment: any;
}

export const TicketViewPage = () => {
  const { ticketId } = useParams();
  const [comment, setComment] = useState<string>("");

  const fetchTicket = useQuery({
    queryKey: ["ticket"],
    queryFn: () => api.fetchTicket(ticketId!),
  });

  const fetchTicketComments = useQuery({
    queryKey: ["ticketComments"],
    queryFn: () =>
      api.fetchTicketComments(ticketId!, { pageNumber: 1, pageSize: 50 }),
  });

  const updateTicketStatus = useMutation({
    mutationFn: ({ ticketId, newStatus }: UpdateTicketMutationFnParams) =>
      api.updateTicketStatus(ticketId, newStatus),
  });

  const addTicketComment = useMutation({
    mutationFn: ({ ticketId, comment }: AddTicketCommentMutationFnParams) =>
      api.saveTicketComment(ticketId as unknown as string, comment),
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

      <TextEditor
        placeholder="Add comment..."
        onChange={(value) => setComment(JSON.stringify(value))}
      />
      <div>
        <Button
          color="primary"
          onClick={() =>
            addTicketComment.mutate({
              ticketId: parseInt(ticketId!),
              comment: { comment },
            })
          }
        >
          Save
        </Button>
        <Button>Cancel</Button>
      </div>

      {fetchTicketComments.isSuccess &&
        fetchTicketComments.data.items.length > 0 && (
          <div className="mt-4"></div>
        )}

      {fetchTicketComments.isSuccess &&
        fetchTicketComments.data.items.map((comment: any, index: number) => {
          return (
            <div key={index} className="mb-2">
              <TextEditor
                readOnlyMode
                initialEditorState={comment.comment}
                onChange={() => null}
              />
            </div>
          );
        })}
    </div>
  );
};
