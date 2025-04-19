import { getAPI, PagedResult, ProjectResponse, TicketResponse } from "@app/api";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { UserImage } from "../../user-name/user-img";

type Props = {
  project?: ProjectResponse;
};

export const ProjectBacklog = ({ project }: Props) => {
  const searchParams = useSearchParams();
  const [data, setData] = useState<PagedResult<TicketResponse>>();

  useEffect(() => {
    if (project) {
      const page = {
        pageSize: (searchParams.get("pageSize") || 10) as number,
        pageNumber: (searchParams.get("pageNumber") || 1) as number,
      };
      getAPI()
        .fetchProjectTickets(project?.id, page)
        .then((response) => setData(response.data));
    }
  }, [searchParams, project]);
  return (
    <Table>
      <tbody>
        {data?.items.map((i) => (
          <tr key={`row-${i.id}`}>
            <td>{i.title}</td>
            <td>
              <Button size="sm" variant="outline-primary">
                Schätzen
              </Button>
            </td>
            <td>
              <UserImage />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
