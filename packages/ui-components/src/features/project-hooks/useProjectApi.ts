import {
  getAPI,
  ResultCodeNoPermissions,
  ResultCodeResourceNotFound,
} from "@app/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UpdateProjectCommand } from "../../../../api/src/request.models";
import { ToastContext } from "../../toast";
import { useContext } from "react";
import { QUERY_KEY_FETCH_PROJECT_BY_ID } from "../constants";

type Params = {
  projectId?: number;
  enabledQueryById?: boolean;
  onUpdateProjectSuccess: (data: unknown) => void;
};

export const useProjectApi = ({
  projectId,
  onUpdateProjectSuccess,
  enabledQueryById,
}: Params) => {
  const { newToast } = useContext(ToastContext);

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

  const queryById = useQuery({
    enabled: enabledQueryById,
    queryKey: [QUERY_KEY_FETCH_PROJECT_BY_ID, projectId],
    queryFn: () => {
      if (!projectId) {
        throw "No projectId given.";
      }
      return getAPI().fetchProject(projectId);
    },
  });

  const mutation = useMutation({
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
        onUpdateProjectSuccess(response.data);
      }
    },
  });

  return { queryById, mutation };
};
