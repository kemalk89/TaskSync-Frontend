import { getAPI } from "@app/api";
import React from "react";
import { auth } from "../../auth";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await auth();
  if (!session) {
    return <div>Unauthorized</div>;
  }

  const accessToken = session.accessToken;
  if (!accessToken) {
    return <div>Unauthorized</div>;
  }

  const projectId = (await params).projectId;
  try {
    const data = await getAPI()
      .enableServerMode()
      .setBaseUrl(process.env.SERVICE_TASKSYNC as string)
      .setHeaders({
        Authorization: `Bearer ${accessToken}`,
      })
      .fetchProject(projectId);

    return <div>Project View Page: {data.title}</div>;
  } catch (e) {
    return <div>Error calling backend service</div>;
  }
}
