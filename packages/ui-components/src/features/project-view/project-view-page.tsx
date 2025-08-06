"use client";

import { ProjectInfo } from "./project-team";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProjectBacklog } from "./project-backlog";
import { TextDate } from "../../text-date";
import { EditableLine } from "../../editable-content/editable-content";
import { TextEditorReadonly } from "../../texteditor/texteditor-readonly";
import { useProjectApi } from "../project-hooks/useProjectApi";

type Props = {
  projectId: number;
};

const TAB_BOARD = "board";
const TAB_TEAM = "team";
const TAB_BACKLOG = "backlog";
const TAB_SPRINTS = "sprints";
const TAB_HISTORY = "history";

export const ProjectViewPage = ({ projectId }: Props) => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || TAB_BOARD;

  const { mutation, queryById } = useProjectApi({
    enabledQueryById: true,
    projectId,
    onUpdateProjectSuccess: () => {
      reloadProject();
    },
  });

  const { mutate: updateProject, isPending, isSuccess } = mutation;
  const { data: projectResult, refetch: reloadProject } = queryById;

  return (
    <>
      <EditableLine
        as="h3"
        value={projectResult?.data?.title}
        validationMessage="Geben Sie bitte ein Titel ein."
        isSubmitting={isPending}
        isSuccess={isSuccess}
        onSubmit={(newTitle) => updateProject({ title: newTitle })}
      />
      <p>
        <small>
          erstellt von {projectResult?.data?.createdBy?.username}, am{" "}
          <TextDate date={projectResult?.data?.createdDate} />
        </small>
      </p>
      <h3>Beschreibung</h3>
      {projectResult?.data && (
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
      )}

      <ul className="nav nav-underline mb-4">
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === TAB_BOARD ? "active" : ""}`}
            href={`?tab=${TAB_BOARD}`}
          >
            Board
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === TAB_BACKLOG ? "active" : ""}`}
            href={`?tab=${TAB_BACKLOG}`}
          >
            Backlog
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === TAB_SPRINTS ? "active" : ""}`}
            href={`?tab=${TAB_SPRINTS}`}
          >
            Sprints
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === TAB_TEAM ? "active" : ""}`}
            href={`?tab=${TAB_TEAM}`}
          >
            Team
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === TAB_HISTORY ? "active" : ""}`}
            href={`?tab=${TAB_HISTORY}`}
          >
            History
          </Link>
        </li>
      </ul>
      {activeTab === TAB_TEAM && <ProjectInfo project={projectResult?.data} />}
      {activeTab === TAB_BOARD && <div>Board</div>}
      {activeTab === TAB_BACKLOG && (
        <ProjectBacklog project={projectResult?.data} />
      )}
      {activeTab === TAB_SPRINTS && <div>Sprints</div>}
      {activeTab === TAB_HISTORY && <div>History</div>}
    </>
  );
};
