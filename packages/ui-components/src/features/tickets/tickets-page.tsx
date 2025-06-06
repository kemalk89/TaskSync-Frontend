"use client";

import { useEffect, useState } from "react";
import { getAPI, PagedResult, TicketResponse } from "@app/api";
import { Button, Table } from "react-bootstrap";
import { Pagination } from "../pagination/pagination";
import { useRouter } from "next/navigation";
import { useSyncPaginationWithPathParams } from "../pagination/hooks";
import { NewTicketDialog } from "./new-ticket-dialog";

export const TicketsPage = () => {
  const router = useRouter();
  const [data, setData] = useState<PagedResult<TicketResponse>>();
  const { pageNumber, pageSize, onPageNumberChanged, onPageSizeChanged } =
    useSyncPaginationWithPathParams({ defaultPageSize: 10 });

  useEffect(() => {
    if (pageNumber && pageSize)
      getAPI()
        .fetchTickets({ pageNumber, pageSize })
        .then((result) => setData(result.data));
  }, [pageNumber, pageSize]);

  return (
    <>
      <NewTicketDialog />

      <Table>
        <thead>
          <tr>
            <th>Titel</th>
            <th>Bearbeiter</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data?.items.map((ticket: TicketResponse) => (
            <tr key={ticket.id}>
              <td>{ticket.title}</td>
              <td></td>
              <td>
                <Button
                  size="sm"
                  onClick={() => router.push(`/tickets/${ticket.id}`)}
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
      {data && (
        <Pagination
          paged={data}
          onPageSizeSelected={(pageSize) => onPageSizeChanged(pageSize)}
          onPageSelected={(pageNumber) => onPageNumberChanged(pageNumber)}
        />
      )}
    </>
  );
};
