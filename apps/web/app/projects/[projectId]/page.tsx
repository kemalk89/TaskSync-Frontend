import { getAPI } from "@app/api";
import React from "react";
import { auth } from "../../auth";
import { ProjectViewPage } from "../../../../../packages/ui-components/src/features/project-view/project-view-page";

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
  const response = await getAPI()
    .enableServerMode()
    .setBaseUrl(process.env.SERVICE_TASKSYNC as string)
    .setHeaders({
      Authorization: `Bearer ${accessToken}`,
    })
    .fetchProject(projectId);

  const data = response.data;
  if (response.status === "success") {
    return <ProjectViewPage project={data} />;
  } else {
    return <div>Error calling backend service</div>;
  }
}
