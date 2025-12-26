"use client";

import { ProjectTeam } from "./project-team";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProjectBacklog } from "./project-backlog";
import { EditableLine } from "../../editable-content/editable-content";
import { useProjectApi } from "../project-hooks/useProjectApi";
import { ProjectInfo } from "./project-info";

type Props = {
  projectId: number;
};

const TAB_BOARD = "board";
const TAB_TEAM = "team";
const TAB_BACKLOG = "backlog";
const TAB_SPRINTS = "sprints";
const TAB_HISTORY = "history";
const TAB_PROJECT_INFO = "projectInfo";

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
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === TAB_PROJECT_INFO ? "active" : ""}`}
            href={`?tab=${TAB_PROJECT_INFO}`}
          >
            Info
          </Link>
        </li>
      </ul>
      {activeTab === TAB_TEAM && <ProjectTeam project={projectResult?.data} />}
      {activeTab === TAB_BOARD && <div>Board</div>}
      {activeTab === TAB_BACKLOG && (
        <ProjectBacklog project={projectResult?.data} />
      )}
      {activeTab === TAB_SPRINTS && <div>Sprints</div>}
      {activeTab === TAB_HISTORY && <div>History</div>}
      {activeTab === TAB_PROJECT_INFO && (
        <ProjectInfo project={projectResult?.data} />
      )}
    </>
  );
};
