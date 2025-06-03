"use client";

import { getAPI } from "@app/api";
import { NewFormModal } from "../../NewFormModal";
import { TicketForm, TicketFormValues } from "./ticket-form";
import { CreateTicketCommand } from "../../../../api/src/request.models";

export const NewTicketDialog = () => {
  const handleApiCall = (values: TicketFormValues) => {
    const cmd: CreateTicketCommand = {
      projectId: parseInt(values.projectId),
      title: values.title,
      description: values.description,
      type: values.type,
    };

    if (values.assignee) {
      cmd.assignee = parseInt(values.assignee);
    }

    return getAPI().saveTicket(cmd);
  };

  return (
    <NewFormModal<TicketFormValues>
      title="Neues Ticket anlegen"
      buttonLabel="Ticket anlegen"
    >
      {({ formRef, setIsSubmitting }) => (
        <TicketForm
          formRef={formRef}
          onSubmitStart={() => setIsSubmitting(true)}
          onSubmitFinished={() => setIsSubmitting(false)}
          saveHandler={handleApiCall}
        />
      )}
    </NewFormModal>
  );
};
