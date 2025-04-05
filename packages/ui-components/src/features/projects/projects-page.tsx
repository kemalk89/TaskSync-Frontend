"use client";

import { useEffect, useState } from "react";
import { getAPI, PagedResult, ProjectResponse } from "@app/api";
import { Button, Table } from "react-bootstrap";
import { Pagination } from "../pagination/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProjectForm, ProjectFormValues } from "./project-form";
import { NewFormModal } from "../../NewFormModal";
import { UserName } from "../../user-name/user-name";

export const ProjectsPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [data, setData] = useState<PagedResult<ProjectResponse>>();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);

    return params.toString();
  };

  useEffect(() => {
    const page = {
      pageSize: (searchParams.get("pageSize") || 10) as number,
      pageNumber: (searchParams.get("pageNumber") || 1) as number,
    };
    getAPI()
      .fetchProjects(page)
      .then((response) => setData(response.data));
  }, [searchParams]);

  return (
    <>
      <NewFormModal<ProjectFormValues>
        title="Neues Projekt anlegen"
        buttonLabel="Neues Projekt anlegen"
      >
        {({ formRef, setIsSubmitting }) => (
          <ProjectForm
            formRef={formRef}
            onSubmitStart={() => setIsSubmitting(true)}
            onSubmitFinished={() => setIsSubmitting(false)}
            saveHandler={(values) => getAPI().saveProject(values)}
          />
        )}
      </NewFormModal>

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Projektleiter</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data?.items.map((project: ProjectResponse) => (
            <tr key={project.id}>
              <td>{project.title}</td>
              <td>
                <UserName user={project.projectManager} />
              </td>
              <td>
                <Button
                  size="sm"
                  onClick={() => router.push(`/projects/${project.id}`)}
                >
                  View
                </Button>{" "}
                <Button size="sm">Edit</Button>{" "}
                <Button size="sm" variant="danger">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {data && (
        <Pagination
          paged={data}
          onPageSelected={(pageNumber) =>
            router.replace(
              `${pathname}?${createQueryString("pageNumber", pageNumber.toString())}`
            )
          }
        />
      )}
    </>
  );
};
