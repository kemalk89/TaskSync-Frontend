import React from "react";
import { TicketResponse } from "@app/api";
import { Metadata } from "next";
import { fetchDataById } from "../../page-utils";

type Params = { params: Promise<{ ticketId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { ticketId } = await params;

  const result = await fetchDataById<TicketResponse>((api) =>
    api.fetchTicket(ticketId)
  );

  if (result.status !== "success") {
    return {};
  }

  return {
    title: result.data?.title,
  };
}

export default async function Page({ params }: Params) {
  const { ticketId } = await params;

  const result = await fetchDataById<TicketResponse>((api) =>
    api.fetchTicket(ticketId)
  );

  if (result.status === "unauthorized") {
    return <div>Unauthorized</div>;
  }

  if (result.status !== "success") {
    return <div>Error calling backend service</div>;
  }

  const data = result.data;

  return (
    <div>
      <h3>{data?.title}</h3>
      Ticket View Page: {ticketId}
    </div>
  );
}
