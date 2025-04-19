import { ProjectResponse } from "@app/api";
import { UserName } from "../../user-name/user-name";

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
