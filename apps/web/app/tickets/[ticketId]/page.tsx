import React from "react";
import { auth } from "../../auth";
import { getAPI } from "@app/api";

export default async function Page({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const ticketId = (await params).ticketId;

  const session = await auth();
  if (!session) {
    return <div>Unauthorized</div>;
  }

  const accessToken = session.accessToken;
  if (!accessToken) {
    return <div>Unauthorized</div>;
  }

  const response = await getAPI()
    .enableServerMode()
    .setBaseUrl(process.env.SERVICE_TASKSYNC as string)
    .setHeaders({
      Authorization: `Bearer ${accessToken}`,
    })
    .fetchTicket(ticketId);

  if (response.status !== "success") {
    return <div>Error calling backend service</div>;
  }

  const data = response.data;

  return (
    <div>
      <h3>{data?.title}</h3>
      Ticket View Page: {ticketId}
    </div>
  );
}
