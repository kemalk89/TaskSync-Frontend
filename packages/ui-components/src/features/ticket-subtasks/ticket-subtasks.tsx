"use client";

import { getAPI, TicketResponse } from "@app/api";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "react-bootstrap";
import { UserName } from "../../components/user-name/user-name";
import { useTranslation } from "../../i18n";
import { TicketTitleWithLink } from "../tickets/ticket-title-with-link";
import { NewSubtaskDialog } from "./new-subtask-dialog";

type Props = {
  ticket: TicketResponse;
};

export const TicketSubtasks = ({ ticket }: Props) => {
  const { t } = useTranslation();
  const { data: subtasksResult, refetch: reloadSubtasks } = useQuery({
    queryKey: ["fetch-subtasks", ticket.id],
    queryFn: () => getAPI().fetchSubtasks(ticket.id),
  });

  const subtasks = subtasksResult?.data ?? [];

  return (
    <div>
      {subtasks.length > 0 && (
        <div className="mb-3">
          {subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="d-flex align-items-center gap-2 mb-2"
            >
              <div className="flex-grow-1">
                <TicketTitleWithLink ticket={subtask} />
              </div>
              {subtask.Status?.name && (
                <Badge bg="secondary">{subtask.Status.name}</Badge>
              )}
              <UserName user={subtask.assignee} />
            </div>
          ))}
        </div>
      )}
      <NewSubtaskDialog
        ticket={ticket}
        onSubtaskCreated={() => reloadSubtasks()}
      />
    </div>
  );
};
