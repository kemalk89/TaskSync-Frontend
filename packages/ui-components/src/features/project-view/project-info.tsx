import { ProjectResponse } from "@app/api";
import { TextEditorReadonly } from "../../texteditor/texteditor-readonly";
import { useFetchProjectById, useUpdateProject } from "../project-hooks";
import { TextDate } from "../../text-date";

type Props = {
  project?: ProjectResponse;
};

export const ProjectInfo = ({ project }: Props) => {
  const { isPending, isSuccess, mutate } = useUpdateProject({
    projectId: project?.id,
    onSuccessHandler: () => reloadProject(),
  });

  const { data: projectResult, refetch: reloadProject } = useFetchProjectById(
    true,
    project?.id,
  );

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
          mutate({
            description: JSON.stringify(newContent),
          })
        }
        isSubmitting={isPending}
        isSuccess={isSuccess}
      />
    </>
  ) : null;
};
