import { useContext } from "react";
import { ToastContext } from "../../toast";
import { useConfirmationModal } from "../../components/confirmation-modal";
import { getAPI, TicketResponse } from "@app/api";
import { QueryClientContext } from "@tanstack/react-query";
import { QUERY_KEY_PREFIX_FETCH_TICKETS } from "../constants";

/**
 * Provides method to delete a ticket:
 * - Display a confirmation dialog to the user
 * - If user confirms, the ticket will be deleted
 * - Displays confirmation message based on API response
 */
export const useDeleteTicketModal = () => {
  const queryClient = useContext(QueryClientContext);
  const { newToast } = useContext(ToastContext);
  const {
    setConfirmationModalPending,
    showConfirmationModal,
    closeConfirmationModal,
  } = useConfirmationModal();

  const deleteTicket = (ticket: TicketResponse) => {
    showConfirmationModal(
      {
        title: "Ticket löschen",
        data: ticket,
        body: <p>Möchten Sie das Ticket wirklich löschen?</p>,
      },
      {
        onConfirm: onConfirmDeleteTicket,
      }
    );
  };

  const onConfirmDeleteTicket = async (ticket: unknown) => {
    if (!ticket) {
      return;
    }

    const ticketId = (ticket as TicketResponse).id;
    if (ticketId) {
      try {
        setConfirmationModalPending(true);

        const result = await getAPI().deleteTicket(ticketId);
        if (result.status === "error") {
          newToast({
            msg: "Ticket konnte nicht gelöscht werden: Es fehlen notwendige Berechtigungen.",
            type: "error",
          });

          setConfirmationModalPending(false);
        } else {
          newToast({
            msg: "Ticket erfolgreich gelöscht.",
            type: "success",
          });

          closeConfirmationModal();

          queryClient?.invalidateQueries({
            queryKey: [QUERY_KEY_PREFIX_FETCH_TICKETS],
          });
        }
      } catch {
        newToast({
          msg: "Ticket konnte nicht gelöscht werden.",
          type: "error",
        });

        setConfirmationModalPending(false);
      }
    }
  };

  return {
    deleteTicket,
  };
};
