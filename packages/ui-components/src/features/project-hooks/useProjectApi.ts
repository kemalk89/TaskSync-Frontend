import {
  getAPI,
  ResultCodeNoPermissions,
  ResultCodeResourceNotFound,
  BoardResponse,
  TicketResponse,
} from "@app/api";
import {
  QueryClientContext,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import {
  ReorderTicketsCommand,
  UpdateProjectCommand,
} from "../../../../api/src/request.models";
import { ToastContext } from "../../toast";
import { useContext } from "react";
import {
  QUERY_KEY_FETCH_PROJECT_BY_ID,
  QUERY_KEY_PREFIX_FETCH_TICKETS,
} from "../constants";
import { Page } from "@app/utils";

export const useProjectApi = () => {
  const { newToast } = useContext(ToastContext);
  const queryClient = useContext(QueryClientContext);

  const handleError = (errCode: string) => {
    let msg =
      "Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es später nocheinmal.";
    switch (errCode) {
      case ResultCodeNoPermissions:
        msg =
          "Fehlende Berechtigungen: Projekt kann nicht aktualisiert werden.";
        break;
      case ResultCodeResourceNotFound:
        msg =
          "Aktion kann nicht durchgeführt werden, da das Projekt nicht gefunden werden konnte.";
        break;
    }

    newToast({ msg, type: "error" });
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Queries
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  const fetchProjectById = (enabled: boolean, projectId?: number) =>
    useQuery({
      enabled,
      queryKey: [QUERY_KEY_FETCH_PROJECT_BY_ID, projectId],
      queryFn: () => {
        if (!projectId) {
          throw "No projectId given.";
        }
        return getAPI().fetchProject(projectId);
      },
    });

  const fetchBacklogTickets = ({
    enabled,
    page,
    projectId,
    onSuccess,
  }: {
    enabled: boolean;
    page: Page;
    projectId?: number;
    onSuccess: (tickets: TicketResponse[]) => void;
  }) =>
    useQuery({
      enabled,
      queryKey: [QUERY_KEY_PREFIX_FETCH_TICKETS, page],
      queryFn: async () => {
        if (!projectId) {
          return null;
        }
        const response = await getAPI().fetchBacklogTickets(projectId);
        const result = response.data ?? [];
        onSuccess(result);
        return result;
      },
    });

  const fetchDraftBoard = ({
    enabled,
    projectId,
    onSuccess,
  }: {
    enabled: boolean;
    projectId?: number;
    onSuccess: (board?: BoardResponse) => void;
  }) =>
    useQuery({
      enabled,
      queryKey: [QUERY_KEY_PREFIX_FETCH_TICKETS, "fetchDraftBoard"],
      queryFn: async () => {
        if (!projectId) {
          return null;
        }
        const response = await getAPI().fetchDraftSprint(projectId);
        onSuccess(response.data?.value);
        return response.data?.value;
      },
    });

  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Mutations
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  const updateProject = ({
    projectId,
    onSuccessHandler,
  }: {
    projectId?: number;
    onSuccessHandler: () => void;
  }) =>
    useMutation({
      mutationFn: (command: UpdateProjectCommand) => {
        if (!projectId) {
          throw "No projectId given.";
        }

        return getAPI().patch.updateProject(projectId, command);
      },
      onSuccess: (response) => {
        if (response.status === "error" && response.message) {
          handleError(response.message);
        } else if (response.data?.error) {
          handleError(response.data.error);
        } else {
          onSuccessHandler();
        }
      },
    });

  const getReorderBoardTicketsMutation = (options?: {
    onSuccess?: () => void;
  }) =>
    useMutation({
      mutationFn: (command: {
        projectId: number;
        boardId?: number;
        ticketOrder: ReorderTicketsCommand;
      }) => {
        return getAPI().post.reorderBoardTickets(
          command.projectId,
          command.boardId ?? 0,
          command.ticketOrder,
        );
      },
      onSuccess: (response) => {
        if (response.status === "error" && response.message) {
          handleError(response.message);
        } else {
          queryClient?.invalidateQueries({
            queryKey: [QUERY_KEY_PREFIX_FETCH_TICKETS],
          });
          if (options?.onSuccess) {
            options.onSuccess();
          }
        }
      },
    });

  const getAssignTicketToDraftBoardMutation = (options?: {
    onSuccess?: () => void;
  }) =>
    useMutation({
      mutationFn: (command: {
        projectId: number;
        sprintId?: number;
        ticketId: number;
        newPosition?: number;
      }) => {
        return getAPI().post.assignTicketToSprint(
          command.projectId,
          command.sprintId ?? 0,
          command.ticketId,
          command.newPosition ?? 1,
        );
      },
      onSuccess: (response) => {
        if (response.status === "error" && response.message) {
          handleError(response.message);
        } else if (response.data?.error) {
          handleError(response.data.error);
        } else {
          queryClient?.invalidateQueries({
            queryKey: [QUERY_KEY_PREFIX_FETCH_TICKETS],
          });
          if (options?.onSuccess) {
            options.onSuccess();
          }
        }
      },
    });

  return {
    fetchProjectById,
    fetchBacklogTickets,
    fetchDraftBoard,
    updateProject,
    getReorderBoardTicketsMutation,
    getAssignTicketToDraftBoardMutation,
  };
};
