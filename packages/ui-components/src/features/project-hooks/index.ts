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
import { ToastContext, ToastMessage } from "../../toast";
import { useContext } from "react";
import {
  QUERY_KEY_FETCH_PROJECT_BY_ID,
  QUERY_KEY_PREFIX_FETCH_TICKETS,
} from "../constants";
import { Page } from "@app/utils";

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Queries
/////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useFetchProjectById = (enabled: boolean, projectId?: number) =>
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

export const useFetchBacklogTickets = ({
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

export const useFetchDraftBoard = ({
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
export const useUpdateProject = ({
  projectId,
  onSuccessHandler,
}: {
  projectId?: number;
  onSuccessHandler: () => void;
}) => {
  const { newToast } = useContext(ToastContext);

  return useMutation({
    mutationFn: (command: UpdateProjectCommand) => {
      if (!projectId) {
        throw "No projectId given.";
      }

      return getAPI().patch.updateProject(projectId, command);
    },
    onSuccess: (response) => {
      if (response.status === "error" && response.message) {
        handleError(response.message, newToast);
      } else if (response.data?.error) {
        handleError(response.data.error, newToast);
      } else {
        onSuccessHandler();
      }
    },
  });
};

export const useReorderBoardTickets = (options?: {
  onSuccess?: () => void;
}) => {
  const queryClient = useContext(QueryClientContext);
  const { newToast } = useContext(ToastContext);

  return useMutation({
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
        handleError(response.message, newToast);
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
};

export const useAssignTicketToDraftBoard = (options?: {
  onSuccess?: () => void;
}) => {
  const queryClient = useContext(QueryClientContext);
  const { newToast } = useContext(ToastContext);

  return useMutation({
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
        handleError(response.message, newToast);
      } else if (response.data?.error) {
        handleError(response.data.error, newToast);
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
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Helpers
/////////////////////////////////////////////////////////////////////////////////////////////////////////
const handleError = (
  errCode: string,
  newToastFn: (msg: ToastMessage) => void,
) => {
  let msg =
    "Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es später nocheinmal.";
  switch (errCode) {
    case ResultCodeNoPermissions:
      msg = "Fehlende Berechtigungen: Projekt kann nicht aktualisiert werden.";
      break;
    case ResultCodeResourceNotFound:
      msg =
        "Aktion kann nicht durchgeführt werden, da das Projekt nicht gefunden werden konnte.";
      break;
  }

  newToastFn({ msg, type: "error" });
};
