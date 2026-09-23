"use client";

import { CreateSubtaskCommand, getAPI, TicketResponse } from "@app/api";
import { useContext, useState } from "react";
import { NewFormModal } from "../../NewFormModal";
import { ToastContext } from "../../toast";
import { useTranslation } from "../../i18n";
import { SubtaskForm, SubtaskFormValues } from "./subtask-form";
import { Button } from "react-bootstrap";

type Props = {
  ticket: TicketResponse;
  onSubtaskCreated: () => void;
};

export const NewSubtaskDialog = ({ ticket, onSubtaskCreated }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { newToast } = useContext(ToastContext);
  const { t } = useTranslation();

  const handleSaveSubtask = async (values: SubtaskFormValues) => {
    const cmd: CreateSubtaskCommand = {
      projectId: ticket.project?.id,
      title: values.title,
      type: "task",
    };

    if (values.description) {
      cmd.description = values.description;
    }

    if (values.assignee) {
      cmd.assignee = parseInt(values.assignee);
    }

    const data = await getAPI().saveSubtask(ticket.id, cmd);
    if (data.status === "error") {
      newToast({
        type: "error",
        msg: `${t("ticket.subtasks.error")}${data.statusCode}`,
      });
    } else {
      newToast({ type: "success", msg: t("ticket.subtasks.success") });
      setDialogOpen(false);
      onSubtaskCreated();
    }
    return data;
  };

  return (
    <NewFormModal<SubtaskFormValues>
      title={t("ticket.subtasks.modalTitle")}
      renderButton={() => (
        <Button
          size="sm"
          variant="outline-secondary"
          onClick={() => setDialogOpen(true)}
        >
          {t("ticket.subtasks.add")}
        </Button>
      )}
      open={dialogOpen}
      onCloseDialog={() => setDialogOpen(false)}
    >
      {({ formRef, setIsSubmitting }) => (
        <SubtaskForm
          formRef={formRef}
          ticket={ticket}
          onSubmitStart={() => setIsSubmitting(true)}
          onSubmitFinished={() => setIsSubmitting(false)}
          saveHandler={handleSaveSubtask}
        />
      )}
    </NewFormModal>
  );
};
