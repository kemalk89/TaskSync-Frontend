"use client";

import { getAPI } from "@app/api";
import { NewFormModal } from "../../NewFormModal";
import { TicketForm, TicketFormValues } from "./ticket-form";
import { CreateTicketCommand } from "../../../../api/src/request.models";
import { useContext, useState } from "react";
import { ButtonProps } from "react-bootstrap";
import { ToastContext } from "../../toast";
import { useParams } from "next/navigation";
import { QueryClientContext } from "@tanstack/react-query";
import { QUERY_KEY_PREFIX_FETCH_TICKETS } from "../constants";

type Props = {
  buttonProps?: ButtonProps;
};

export const NewTicketDialog = ({ buttonProps = {} }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { newToast } = useContext(ToastContext);
  const queryClient = useContext(QueryClientContext);
  const { projectId: projectIdInUrl } = useParams();

  const handleSaveTicket = async (values: TicketFormValues) => {
    const cmd: CreateTicketCommand = {
      projectId: parseInt(values.projectId),
      title: values.title,
      description: values.description,
      type: values.type,
      labels: values.labels.map((i) => ({ labelId: i.id, title: i.text })),
    };

    if (values.assignee) {
      cmd.assignee = parseInt(values.assignee);
    }

    const data = await getAPI().saveTicket(cmd);
    if (data.status === "error") {
      newToast({
        type: "error",
        msg: `Ticket konnte nicht angelegt werden. Fehlercode: ${data.statusCode}`,
      });
    } else {
      newToast({ type: "success", msg: "Ticket erfolgreich angelegt" });
    }
    setDialogOpen(false);

    queryClient?.invalidateQueries({
      queryKey: [QUERY_KEY_PREFIX_FETCH_TICKETS],
    });
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
          preselectedProjectId={
            projectIdInUrl ? (projectIdInUrl as string) : ""
          }
          onSubmitStart={() => setIsSubmitting(true)}
          onSubmitFinished={() => setIsSubmitting(false)}
          saveHandler={handleSaveTicket}
        />
      )}
    </NewFormModal>
  );
};
