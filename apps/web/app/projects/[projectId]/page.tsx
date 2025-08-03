import { ProjectResponse } from "@app/api";
import React from "react";
import { ProjectViewPage } from "../../../../../packages/ui-components/src/features/project-view/project-view-page";
import { fetchDataById } from "../../page-utils";
import { Metadata } from "next";

type Params = { params: Promise<{ projectId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { projectId } = await params;

  const result = await fetchDataById<ProjectResponse>((api) =>
    api.fetchProject(projectId)
  );

  if (result.status !== "success") {
    return {};
  }

  return {
    title: `Project: ${result.data?.title}`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const projectId = (await params).projectId;

  const result = await fetchDataById<ProjectResponse>((api) =>
    api.fetchProject(projectId)
  );

  if (result.status === "unauthorized") {
    return <div>Unauthorized</div>;
  }

  if (result.status !== "success") {
    return <div>Error calling backend service</div>;
  }

  return <ProjectViewPage projectId={projectId as unknown as number} />;
}
