"use client";

import { TicketIcon } from "../tickets/ticket-icons";
import { TicketComments } from "../ticket-comments/ticket-comments";
import { TextEditorReadonly } from "../../texteditor/texteditor-readonly";
import { EditableLine } from "../../editable-content/editable-content";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAPI } from "@app/api";
import { QUERY_KEY_FETCH_TICKET_BY_ID } from "../constants";
import { UpdateTicketCommand } from "../../../../api/src/request.models";

type Props = {
  ticketId: number;
};

export const TicketViewPage = ({ ticketId }: Props) => {
  const { data: ticketResult, refetch: reloadTicket } = useQuery({
    queryKey: [QUERY_KEY_FETCH_TICKET_BY_ID],
    queryFn: () => getAPI().fetchTicket(ticketId),
  });

  const {
    mutate: updateTicket,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async (command: UpdateTicketCommand) => {
      await getAPI().patch.updateTicket(ticketId, command);
    },
    onSuccess: () => reloadTicket(),
  });

  if (!ticketResult?.data) {
    return null;
  }

  return (
    <div>
      <h3 style={{ display: "flex", gap: "8px" }}>
        <TicketIcon ticket={ticketResult.data} />
        <div className="flex-grow-1">
          <EditableLine
            as="div"
            validationMessage="Geben Sie bitte ein Titel ein."
            value={ticketResult.data.title}
            onSubmit={(newTitle) => updateTicket({ title: newTitle })}
            isSubmitting={isPending}
            isSuccess={isSuccess}
          />
        </div>
      </h3>
      <div className="mt-4">
        <h4>Beschreibung</h4>
        <TextEditorReadonly
          placeholderEditMode="Schreiben Sie die Problemstellung, die Akzeptanzkriterien, usw..."
          placeholderReadonlyMode="Noch keine Beschreibung vorhanden. Hier klicken, um eine Beschreibung zu schreiben."
          content={ticketResult.data.description}
          onSubmit={(newContent) =>
            updateTicket({
              description: JSON.stringify(newContent),
            })
          }
          isSubmitting={isPending}
          isSuccess={isSuccess}
        />
      </div>
      <div className="mt-4">
        <h4>Kommentare</h4>
        <TicketComments ticketId={ticketId as unknown as string} />
      </div>
    </div>
  );
};
