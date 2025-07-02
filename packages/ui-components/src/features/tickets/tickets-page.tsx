"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { getAPI, PagedResult, TicketResponse } from "@app/api";
import { Button, Table } from "react-bootstrap";
import { Pagination } from "../pagination/pagination";
import { useRouter } from "next/navigation";
import { NewTicketDialog } from "./new-ticket-dialog";
import { TicketIcon } from "./ticket-icons";
import { SearchBar } from "./search-bar";
import { DEFAULT_PAGE_SIZE } from "../constants";
import { useSyncWithSearchParams } from "../../hooks/use-sync-with-search-params";
import { ToastContext } from "../../toast";
import { ConfirmationModal } from "../../ConfirmationModal";

export const TicketsPage = () => {
  const router = useRouter();
  const [modalDeleteTicketOpen, setModalDeleteTicket] = useState<{
    show: boolean;
    ticket: TicketResponse | null;
    confirmButtonDisabled: boolean;
  }>({
    show: false,
    ticket: null,
    confirmButtonDisabled: false,
  });
  const [data, setData] = useState<PagedResult<TicketResponse>>();
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

  // Watch for changes on pagination and filters
  useEffect(() => {
    if (pageNumber && pageSize) {
      getAPI()
        .fetchTickets(
          {
            pageNumber: pageNumber as unknown as number,
            pageSize: pageSize as unknown as number,
          },
          filters
        )
        .then((result) => {
          if (result.status === "error") {
            newToast({ msg: "Ein Fehler ist aufgetreten", type: "error" });
          } else {
            return setData(result.data);
          }
        });
    }
  }, [pageNumber, pageSize, filters, newToast]);

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

      <Table>
        <thead>
          <tr>
            <th></th>
            <th>Titel</th>
            <th>Bearbeiter</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data?.items.map((ticket: TicketResponse) => (
            <tr key={ticket.id}>
              <td width="24" style={{ paddingTop: "10px" }}>
                <TicketIcon ticket={ticket} />
              </td>
              <td>{ticket.title}</td>
              <td width="100"></td>
              <td width="200">
                <Button
                  size="sm"
                  onClick={() => router.push(`/tickets/${ticket.id}`)}
                >
                  View
                </Button>{" "}
                <Button size="sm">Edit</Button>{" "}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onClickDeleteTicket(ticket)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
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
