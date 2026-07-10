"use client";

import { useQuery } from "@tanstack/react-query";
import { getQueryKeyFetchProjectSprints } from "../constants";
import { getAPI } from "@app/api";

export const TabContentSprints = ({ projectId }: { projectId: number }) => {
  const pageNumber = 1;
  const pageSize = 100;
  const { data: sprints } = useQuery({
    queryKey: getQueryKeyFetchProjectSprints(projectId),
    queryFn: async () => {
      return await getAPI().get.fetchProjectSprints(projectId, {
        pageNumber,
        pageSize,
      });
    },
  });

  return (
    <ul>
      {sprints?.data?.items.map((sprint, index) => (
        <li key={`sprint-${sprint.id}`}>
          <a href={`/sprint-details/${sprint.id}`}>Sprint #{index + 1}</a>
        </li>
      ))}
    </ul>
  );
};
