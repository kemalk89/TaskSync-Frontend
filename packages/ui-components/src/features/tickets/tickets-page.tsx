"use client";

import { useContext, useMemo } from "react";
import { getAPI, TicketResponse } from "@app/api";
import { Pagination } from "../pagination/pagination";
import { TicketsSearchBar } from "../tickets-search-bar/tickets-search-bar";
import { DEFAULT_PAGE_SIZE } from "../constants";
import { useSyncWithSearchParams } from "../../hooks/use-sync-with-search-params";
import { ToastContext } from "../../toast";
import { TicketsTable } from "./tickets-table";
import { useQuery } from "@tanstack/react-query";
import { useConfirmationModal } from "../../confirmation-modal";
import { TicketSearchFilter } from "../tickets-search-bar/types";

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
  const selectedStatus = searchParams.get("status");
  const selectedProjects = searchParams.get("projects");
  const selectedUsers = searchParams.get("assignees");
  const filters = useMemo(() => {
    const _filters: {
      searchText?: string;
      statusIds?: string;
      projectIds?: string;
      assigneeIds?: string;
    } = {};
    if (searchText?.trim()) {
      _filters["searchText"] = searchText;
    }
    if (selectedStatus?.trim()) {
      _filters["statusIds"] = selectedStatus;
    }
    if (selectedProjects?.trim()) {
      _filters["projectIds"] = selectedProjects;
    }
    if (selectedUsers?.trim()) {
      _filters["assigneeIds"] = selectedUsers;
    }
    return _filters;
  }, [searchText, selectedStatus, selectedProjects, selectedUsers]);

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
        newToast({
          msg: "Beim Laden der Tickets ist ein Fehler ist aufgetreten",
          type: "error",
        });
      }
      return result.data;
    },
  });

  const { data: ticketStatusList } = useQuery({
    queryKey: ["ticketStatusList"],
    queryFn: async () => {
      const result = await getAPI().fetchTicketStatusList();

      if (result.status === "error") {
        newToast({
          msg: "Beim Laden der Ticket Status Liste ist ein Fehler ist aufgetreten",
          type: "error",
        });
      }

      return result.data;
    },
  });

  const { data: projectList } = useQuery({
    queryKey: ["projectList"],
    queryFn: async () => {
      const result = await getAPI().fetchProjects({
        pageNumber: 1,
        pageSize: 100,
      });

      if (result.status === "error") {
        newToast({
          msg: "Beim Laden der Projekte ist ein Fehler ist aufgetreten",
          type: "error",
        });
      }

      return result.data;
    },
  });

  const { data: userList } = useQuery({
    queryKey: ["userList"],
    queryFn: async () => {
      const result = await getAPI().fetchUsers({
        pageNumber: 1,
        pageSize: 100,
      });

      if (result.status === "error") {
        newToast({
          msg: "Beim Laden der Benutzer ist ein Fehler ist aufgetreten",
          type: "error",
        });
      }

      return result.data;
    },
  });

  const searchTickets = (
    searchText: string,
    status: string[],
    projects: string[],
    assignees: string[]
  ) => {
    const filter: TicketSearchFilter = {
      searchText,

      status: status.join(","),
      projects: projects.join(","),
      assignees: assignees.join(","),

      pageNumber: 1, // When starting text-search we can reset page number
      pageSize:
        (searchParams.get("pageSize") as unknown as number) ??
        DEFAULT_PAGE_SIZE,
    };

    updateSearchParams(filter);
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
        <TicketsSearchBar
          initialSearchText={searchText}
          initialSelectedStatus={
            selectedStatus ? selectedStatus?.split(",") : null
          }
          initialSelectedProjects={
            selectedProjects ? selectedProjects?.split(",") : null
          }
          initialSelectedAssignees={
            selectedUsers ? selectedUsers?.split(",") : null
          }
          onSearch={searchTickets}
          ticketStatusList={ticketStatusList ?? []}
          projectList={projectList?.items ?? []}
          userList={userList?.items ?? []}
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
