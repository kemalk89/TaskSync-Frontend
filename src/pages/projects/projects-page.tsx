import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { TablePage } from "../../components/table-page/table-page";
import { ProjectForm } from "./project-form";
import { ProjectResponse } from "../../api/responses";
import { ItemsTableColumn } from "../../components/table-page/items-table";

export const ProjectsPage = () => {
  const navigate = useNavigate();

  const columns: ItemsTableColumn<ProjectResponse>[] = [
    { title: "ID", fieldName: "id" },
    { title: "Title", fieldName: "title" },
  ];

  return (
    <TablePage<ProjectResponse>
      pageTitle="Projects"
      cacheKey="projects"
      getItemsApi={api.fetchProjects}
      saveItemApi={api.saveProject}
      deleteItemApi={api.deleteProject}
      itemForm={ProjectForm}
      tableData={{ columns }}
      onViewItem={(item: any) => navigate(`/project/${item.id}`)}
      renderDeleteConfirmationModalBody={(project: any) => (
        <p>Are you sure you want to delete project "{project.title}"?</p>
      )}
    ></TablePage>
  );
};
