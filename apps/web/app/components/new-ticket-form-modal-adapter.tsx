"use client";

import { getAPI } from "@app/api";
import { NewFormModal, TicketForm, TicketFormValues } from "@app/ui-components";

/**
 * Adapter component to embed the `NewFormModal` client component within a server component tree.
 *
 * Without this adapter, rendering `NewFormModal` directly in a server component will cause
 * a runtime error like: "Functions are not valid as a child of Client Components".
 */
export const NewTicketFormModalAdapter = () => {
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
          saveHandler={(values) => getAPI().saveTicket(values)}
        />
      )}
    </NewFormModal>
  );
};
