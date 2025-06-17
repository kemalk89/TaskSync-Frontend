import { getAPI, PagedResult, ProjectResponse, TicketResponse } from "@app/api";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { UserImage } from "../../user-name/user-img";
import { TicketIcon } from "../tickets/ticket-icons";
import { NewTicketDialog } from "../tickets/new-ticket-dialog";

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

  if (data?.items.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        No tickets found. Create your first ticket.
        <NewTicketDialog
          buttonProps={{ size: "sm"}}
        />
      </div>
    );
  }

  return (
    <Table>
      <tbody>
        {data?.items.map((i) => (
          <tr key={`row-${i.id}`}>
            <td width="24" style={{ paddingTop: "10px" }}>
              <TicketIcon ticket={i} />
            </td>
            <td>{i.title}</td>
            <td width="82">
              <Button size="sm" variant="outline-primary">
                Schätzen
              </Button>
            </td>
            <td width="48">
              <UserImage />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
