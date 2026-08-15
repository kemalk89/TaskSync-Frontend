import { TicketResponse } from "@app/api";
import { useDeleteTicketModal } from "../ticket-hooks/use-delete-ticket-modal";
import { TicketCardDraggable } from "../ticket-card/ticket-card";
import { SortableList, SortResult, type Lists } from "@app/ui-lib";

export const TicketListSortable = ({
  listKey,
  lists,
  onSort,
}: {
  listKey: string;
  lists: Lists<TicketResponse>;
  onSort: (result: SortResult<TicketResponse>) => void;
}) => {
  const { deleteTicket } = useDeleteTicketModal();

  return (
    <SortableList<TicketResponse>
      listId={listKey}
      lists={lists}
      onSort={onSort}
      renderItem={(ticket) => (
        <TicketCardDraggable
          identifier={ticket.id.toString()}
          ticket={ticket}
          onDelete={deleteTicket}
        />
      )}
    />
  );
};
