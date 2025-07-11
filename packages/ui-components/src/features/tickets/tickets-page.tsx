"use client";

import { useContext, useMemo, useState } from "react";
import { getAPI, TicketResponse } from "@app/api";
import { Pagination } from "../pagination/pagination";
import { NewTicketDialog } from "./new-ticket-dialog";
import { SearchBar } from "./search-bar";
import { DEFAULT_PAGE_SIZE } from "../constants";
import { useSyncWithSearchParams } from "../../hooks/use-sync-with-search-params";
import { ToastContext } from "../../toast";
import { ConfirmationModal } from "../../ConfirmationModal";
import { TicketsTable } from "./tickets-table";
import { useQuery } from "@tanstack/react-query";

export const TicketsPage = () => {
  const [modalDeleteTicketOpen, setModalDeleteTicket] = useState<{
    show: boolean;
    ticket: TicketResponse | null;
    confirmButtonDisabled: boolean;
  }>({
    show: false,
    ticket: null,
    confirmButtonDisabled: false,
  });
  const { newToast } = useContext(ToastContext);
  const { searchParams, updateSearchParams } = useSyncWithSearchParams();
  const pageNumber = searchParams.get("pageNumber") ?? 1;
  const pageSize = searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE;
  const searchText = searchParams.get("searchText");
  const filters = useMemo(() => {
    const _filters: { searchText?: string } = {};
    if (searchText?.trim()) {
      _filters["searchText"] = searchText;
    }
    return _filters;
  }, [searchText]);

  const { data, isLoading } = useQuery({
    // Watch for changes on pagination and filters
    queryKey: ["tickets", pageNumber, pageSize, filters],
    queryFn: async () => {
      const result = await getAPI().fetchTickets(
        {
          pageNumber: pageNumber as unknown as number,
          pageSize: pageSize as unknown as number,
        },
        filters
      );

      if (result.status === "error") {
        newToast({ msg: "Ein Fehler ist aufgetreten", type: "error" });
      }
      return result.data;
    },
  });

  const searchTickets = (searchText: string) => {
    updateSearchParams({
      searchText,
      pageNumber: 1, // When starting text-search we can reset page number
      pageSize: searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE,
    });
  };

  const onClickDeleteTicket = (ticket: TicketResponse) => {
    setModalDeleteTicket({ ...modalDeleteTicketOpen, show: true, ticket });
  };

  const onConfirmDeleteTicket = async () => {
    const ticketId = modalDeleteTicketOpen.ticket?.id;
    if (ticketId) {
      setModalDeleteTicket({
        ...modalDeleteTicketOpen,
        confirmButtonDisabled: true,
      });

      try {
        const result = await getAPI().deleteTicket(ticketId);
        if (result.status === "error") {
          newToast({
            msg: "Ticket konnte nicht gelöscht werden: Es fehlen notwendige Berechtigungen.",
            type: "error",
          });
        } else {
          newToast({
            msg: "Ticket erfolgreich gelöscht.",
            type: "success",
          });
        }
      } catch {
        newToast({
          msg: "Ticket konnte nicht gelöscht werden.",
          type: "error",
        });
      } finally {
        closeDeleteTicketModal();
      }
    }
  };

  const closeDeleteTicketModal = () => {
    setModalDeleteTicket({
      show: false,
      confirmButtonDisabled: false,
      ticket: null,
    });
  };

  return (
    <>
      <NewTicketDialog />

      <ConfirmationModal
        show={modalDeleteTicketOpen.show}
        onConfirm={onConfirmDeleteTicket}
        onCancel={closeDeleteTicketModal}
        confirmButtonText="Delete"
        confirmButtonDisabled={modalDeleteTicketOpen.confirmButtonDisabled}
        title="Ticket löschen"
        body={<p>Möchten Sie das Ticket wirklich löschen?</p>}
      />

      <div className="mb-4">
        <SearchBar initialSearchText={searchText} onSearch={searchTickets} />
      </div>

      <TicketsTable
        isLoading={isLoading}
        tickets={data?.items}
        onEditTicket={console.log}
        onDeleteTicket={onClickDeleteTicket}
      />

      {data && (
        <Pagination
          paged={data}
          onPageSizeSelected={(pageSize) => updateSearchParams({ pageSize })}
          onPageSelected={(pageNumber) => updateSearchParams({ pageNumber })}
        />
      )}
    </>
  );
};
