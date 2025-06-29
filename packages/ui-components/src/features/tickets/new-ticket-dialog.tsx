"use client";

import { getAPI } from "@app/api";
import { NewFormModal } from "../../NewFormModal";
import { TicketForm, TicketFormValues } from "./ticket-form";
import { CreateTicketCommand } from "../../../../api/src/request.models";
import { useContext, useState } from "react";
import { ButtonProps } from "react-bootstrap";
import { ToastContext } from "../../toast";

type Props = {
  buttonProps?: ButtonProps;
};

export const NewTicketDialog = ({ buttonProps = {} }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { newToast } = useContext(ToastContext);

  const handleSaveTicket = async (values: TicketFormValues) => {
    const cmd: CreateTicketCommand = {
      projectId: parseInt(values.projectId),
      title: values.title,
      description: values.description,
      type: values.type,
    };

    if (values.assignee) {
      cmd.assignee = parseInt(values.assignee);
    }

    const data = await getAPI().saveTicket(cmd);
    newToast({ type: "success", msg: "Ticket erfolgreich angelegt" });
    setDialogOpen(false);
    return data;
  };

  return (
    <NewFormModal<TicketFormValues>
      title="Neues Ticket anlegen"
      buttonLabel="Ticket anlegen"
      buttonProps={buttonProps}
      open={dialogOpen}
      onOpenDialog={() => setDialogOpen(true)}
      onCloseDialog={() => setDialogOpen(false)}
    >
      {({ formRef, setIsSubmitting }) => (
        <TicketForm
          formRef={formRef}
          onSubmitStart={() => setIsSubmitting(true)}
          onSubmitFinished={() => setIsSubmitting(false)}
          saveHandler={handleSaveTicket}
        />
      )}
    </NewFormModal>
  );
};
