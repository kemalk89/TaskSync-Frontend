"use client";

import { useEffect, useState } from "react";
import { getAPI, PagedResult, TicketResponse } from "@app/api";
import { Button, Table } from "react-bootstrap";
import { Pagination } from "../pagination/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const TicketsPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [data, setData] = useState<PagedResult<TicketResponse>>();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);

    return params.toString();
  };

  useEffect(() => {
    const page = {
      pageSize: (searchParams.get("pageSize") || 10) as number,
      pageNumber: (searchParams.get("pageNumber") || 1) as number,
    };
    getAPI().fetchTickets(page).then((data) => setData(data));
  }, [searchParams]);

  return (
    <>
      <Button>New Ticket</Button>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data?.items.map((ticket: TicketResponse) => (
            <tr key={ticket.id}>
              <td>{ticket.title}</td>
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
          onPageSelected={(pageNumber) =>
            router.replace(
              `${pathname}?${createQueryString("pageNumber", pageNumber.toString())}`
            )
          }
        />
      )}
    </>
  );
};
