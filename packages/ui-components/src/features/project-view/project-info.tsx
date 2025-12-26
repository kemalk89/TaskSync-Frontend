import { ProjectResponse } from "@app/api";
import { TextEditorReadonly } from "../../texteditor/texteditor-readonly";
import { useProjectApi } from "../project-hooks/useProjectApi";
import { TextDate } from "../../text-date";

type Props = {
  project?: ProjectResponse;
};

export const ProjectInfo = ({ project }: Props) => {
  const { mutation, queryById } = useProjectApi({
    enabledQueryById: true,
    projectId: project?.id,
    onUpdateProjectSuccess: () => {
      reloadProject();
    },
  });

  const { mutate: updateProject, isPending, isSuccess } = mutation;
  const { data: projectResult, refetch: reloadProject } = queryById;

  return projectResult?.data ? (
    <>
      <p>
        erstellt von {projectResult?.data?.createdBy?.username}, am{" "}
        <TextDate date={projectResult?.data?.createdDate} />
      </p>
      <h3>Beschreibung</h3>
      <TextEditorReadonly
        placeholder="Noch keine Beschreibung vorhanden. Hier klicken, um eine Beschreibung zu schreiben."
        content={projectResult.data.description}
        onSubmit={(newContent) =>
          updateProject({
            description: JSON.stringify(newContent),
          })
        }
        isSubmitting={isPending}
        isSuccess={isSuccess}
      />
    </>
  ) : null;
};
