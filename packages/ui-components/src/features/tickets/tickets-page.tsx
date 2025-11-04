"use client";

import { useContext, useMemo } from "react";
import { getAPI, TicketResponse } from "@app/api";
import { Pagination } from "../pagination/pagination";
import { NewTicketDialog } from "./new-ticket-dialog";
import { SearchBar } from "./search-bar";
import { DEFAULT_PAGE_SIZE } from "../constants";
import { useSyncWithSearchParams } from "../../hooks/use-sync-with-search-params";
import { ToastContext } from "../../toast";
import { TicketsTable } from "./tickets-table";
import { useQuery } from "@tanstack/react-query";
import { useConfirmationModal } from "../../confirmation-modal";

export const TicketsPage = () => {
  const { newToast } = useContext(ToastContext);
  const {
    setConfirmationModalPending,
    showConfirmationModal,
    closeConfirmationModal,
  } = useConfirmationModal();
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

  const { data: ticketStatusList } = useQuery({
    queryKey: ["ticketStatusList"],
    queryFn: async () => {
      const result = await getAPI().fetchTicketStatusList();

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

  return (
    <>
      <div className="mb-4 mt-2">
        <SearchBar
          initialSearchText={searchText}
          onSearch={searchTickets}
          ticketStatusList={ticketStatusList ?? []}
        />
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
