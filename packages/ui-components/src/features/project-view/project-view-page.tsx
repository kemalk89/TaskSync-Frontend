"use client";

import { ProjectResponse } from "@app/api";
import { ProjectInfo } from "./project-info";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProjectBacklog } from "./project-backlog";

type Props = {
  project?: ProjectResponse;
};

const TAB_BOARD = "board";
const TAB_INFO = "info";
const TAB_BACKLOG = "backlog";
const TAB_SPRINTS = "sprints";

export const ProjectViewPage = ({ project }: Props) => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || TAB_BOARD;

  return (
    <>
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
            className={`nav-link ${activeTab === TAB_INFO ? "active" : ""}`}
            href={`?tab=${TAB_INFO}`}
          >
            Info
          </Link>
        </li>
      </ul>
      {activeTab === TAB_INFO && <ProjectInfo project={project} />}
      {activeTab === TAB_BOARD && <div>Board</div>}
      {activeTab === TAB_BACKLOG && <ProjectBacklog project={project} />}
      {activeTab === TAB_SPRINTS && <div>Sprints </div>}
    </>
  );
};
