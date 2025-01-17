import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const ticketId = (await params).ticketId;
  return <div>Ticket View Page: {ticketId}</div>;
}
