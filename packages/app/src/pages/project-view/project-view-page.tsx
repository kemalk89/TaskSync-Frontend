import { api } from "@times/api";
import { formatDateTime, useParamsNumber } from "@times/utils";
import { useQuery } from "react-query";

export const ProjectViewPage = () => {
  const projectId = useParamsNumber("projectId");

  const fetchProject = useQuery({
    queryKey: ["project"],
    queryFn: () => api.fetchProject(projectId!),
  });

  if (fetchProject.isLoading) {
    return <div>...</div>;
  }

  return (
    <div>
      <h1>{fetchProject.data.title}</h1>
      <p>
        <small>
          created at {formatDateTime(fetchProject.data.createdDate)} by{" "}
          {fetchProject.data.createdBy?.username}
        </small>
      </p>
      <h2>Description</h2>
      <p>{fetchProject.data.description}</p>
    </div>
  );
};
