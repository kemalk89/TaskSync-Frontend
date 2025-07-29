import { ProjectResponse } from "@app/api";
import { UserName } from "../../user-name/user-name";
import { AssignProjectManager } from "./assign-project-manager";

type Props = {
  project?: ProjectResponse;
};

export const ProjectInfo = ({ project }: Props) => {
  return (
    <>
      <h3>{project?.title}</h3>
      <p>
        <small>
          Created by {project?.createdBy?.username} at {project?.createdDate}
        </small>
      </p>
      <p>{project?.description}</p>
      <h3>Team</h3>
      {project?.projectManager ? (
        <UserName user={project?.projectManager} />
      ) : (
        <div>
          Noch kein Projekleiter vorhanden.{" "}
          {project && <AssignProjectManager projectId={Number(project.id)} />}
        </div>
      )}

      {project?.projectMembers.map((projectMember) => (
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
