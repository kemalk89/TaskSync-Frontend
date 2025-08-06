import { ProjectResponse } from "@app/api";
import { UserName } from "../../user-name/user-name";
import { Button, Table } from "react-bootstrap";
import { AssignProjectManager } from "./assign-project-manager";
import { AssignTeamMember } from "./assign-team-member";

type Props = {
  project?: ProjectResponse;
};

export const ProjectInfo = ({ project }: Props) => {
  return (
    <>
      {!project?.projectManager && (
        <div className="mb-4">
          <div>Noch kein Projektleiter vorhanden.</div>
          {project && <AssignProjectManager projectId={Number(project.id)} />}
        </div>
      )}

      <div className="mb-4">
        <AssignTeamMember projectId={project?.id} />
      </div>

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Rolle im Projekt</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {project?.projectManager && (
            <tr>
              <td>
                <UserName user={project?.projectManager} />
              </td>
              <td>Projektleiter</td>
              <td></td>
            </tr>
          )}
          {project?.projectMembers
            .filter(
              (m) =>
                m.userId !== (project.projectManager?.id as unknown as number)
            )
            .map((projectMember) => (
              <tr key={projectMember.userId}>
                <td>
                  <UserName user={projectMember.user} />
                </td>
                <td>{projectMember.role}</td>
                <td>
                  <Button size="sm">View</Button>{" "}
                  <Button size="sm">Edit</Button>{" "}
                  <Button size="sm" variant="danger">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
};
