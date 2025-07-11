import { Button, Table } from "react-bootstrap";
import Link from "next/link";
import { ProjectResponse } from "@app/api";
import { UserName } from "../../user-name/user-name";
import { useRouter } from "next/navigation";

type Props = {
  isLoading?: boolean;
  projects?: ProjectResponse[];
};

export const ProjectsTable = ({ isLoading, projects }: Props) => {
  const router = useRouter();

  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Projektleiter</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!isLoading &&
            projects?.map((project: ProjectResponse) => (
              <tr key={project.id}>
                <td>
                  <Link href={`/projects/${project.id}`}>{project.title}</Link>
                </td>
                <td>
                  <UserName user={project.projectManager} />
                </td>
                <td>
                  <Button
                    size="sm"
                    onClick={() => router.push(`/projects/${project.id}`)}
                  >
                    View
                  </Button>{" "}
                  <Button size="sm">Edit</Button>{" "}
                  <Button size="sm" variant="danger">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {isLoading && <span>Loading...</span>}
    </>
  );
};
