import { ProjectResponse } from "@app/api";

type Props = {
  project?: ProjectResponse;
};

export const ProjectViewPage = ({ project }: Props) => {
  console.log(project);
  return (
    <>
      <h1>{project?.title}</h1>
      <p>
        Created by {project?.createdBy?.username} at {project?.createdDate}
      </p>
      <h2>Description</h2>
      <div>{project?.description}</div>
    </>
  );
};
