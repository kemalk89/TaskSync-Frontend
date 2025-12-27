import { getAPI, ProjectResponse } from "@app/api";
import { useSearchParams } from "next/navigation";
import { Button, Table } from "react-bootstrap";
import { UserImage } from "../../user-name/user-img";
import { NewTicketDialog } from "../tickets/new-ticket-dialog";
import { TicketTitleWithLink } from "../tickets/ticket-title-with-link";
import { TicketsSearchBar } from "../tickets-search-bar/tickets-search-bar";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY_PREFIX_FETCH_TICKETS } from "../constants";

type Props = {
  project?: ProjectResponse;
};

export const ProjectBacklog = ({ project }: Props) => {
  const searchParams = useSearchParams();
  const pageSize = 1000;
  const pageNumber = (searchParams.get("pageNumber") || 1) as number;
  const { data } = useQuery({
    enabled: !!project,
    queryKey: [QUERY_KEY_PREFIX_FETCH_TICKETS, { pageSize, pageNumber }],
    queryFn: async () => {
      const response = await getAPI().fetchProjectTickets(project!.id, {
        pageSize,
        pageNumber,
      });

      return response.data;
    },
  });

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
        <NewTicketDialog buttonProps={{ size: "sm" }} />
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <TicketsSearchBar
          hiddenFilters={["projects"]}
          initialSearchText={""}
          initialSelectedAssignees={[]}
          initialSelectedLabels={[]}
          initialSelectedProjects={[]}
          initialSelectedStatus={[]}
          onSearch={console.log}
          ticketStatusList={[]}
          projectList={[]}
          userList={[]}
        />
      </div>

      <Table>
        <tbody>
          {data?.items.map((i) => (
            <tr key={`row-${i.id}`}>
              <td style={{ paddingTop: "10px" }}>
                <TicketTitleWithLink ticket={i} />
              </td>
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
    </>
  );
};
