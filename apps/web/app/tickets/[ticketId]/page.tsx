import React from "react";
import { TicketResponse } from "@app/api";
import { Metadata } from "next";
import { fetchDataById } from "../../page-utils";
import { TicketViewPage } from "@app/ui-components";

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

  return <TicketViewPage ticketId={ticketId as unknown as number} />;
}
