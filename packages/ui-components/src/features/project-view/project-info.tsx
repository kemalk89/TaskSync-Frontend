import { ProjectResponse } from "@app/api";
import { UserName } from "../../user-name/user-name";
import { AssignProjectManager } from "./assign-project-manager";

type Props = {
  project?: ProjectResponse;
};

export const ProjectInfo = ({ project }: Props) => {
  return (
    <>
      <h3>Team</h3>
      {project?.projectManager ? (
        <div className="d-flex mb-2">
          <UserName user={project?.projectManager} />
          <div className="d-flex align-items-center">, Projektleiter</div>
        </div>
      ) : (
        <div>
          Noch kein Projektleiter vorhanden.{" "}
          {project && <AssignProjectManager projectId={Number(project.id)} />}
        </div>
      )}

      {project?.projectMembers
        .filter(
          (m) => m.userId !== (project.projectManager?.id as unknown as number)
        )
        .map((projectMember) => (
          <div key={projectMember.userId} className="d-flex mb-2">
            <UserName user={projectMember.user} />
            <div className="d-flex align-items-center">
              , {projectMember.role}
            </div>
          </div>
        ))}
    </>
  );
};
