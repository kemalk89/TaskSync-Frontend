"use client";

import { useContext, useEffect, useState } from "react";
import { getAPI } from "@app/api";
import { Pagination } from "../pagination/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProjectForm, ProjectFormValues } from "./project-form";
import { NewFormModal } from "../../NewFormModal";
import { ProjectsTable } from "./projects-table";
import { useQuery } from "@tanstack/react-query";
import { ToastContext } from "../../toast";

export const ProjectsPage = () => {
  const { newToast } = useContext(ToastContext);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);

    return params.toString();
  };

  const handleSaveProject = async (values: ProjectFormValues) => {
    const data = await getAPI().saveProject({
      ...values,
      projectManagerId: values.projectManagerId
        ? Number(values.projectManagerId)
        : null,
    });
    setDialogOpen(false);
    return data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["projects", searchParams],
    queryFn: async () => {
      const page = {
        pageSize: (searchParams.get("pageSize") || 10) as number,
        pageNumber: (searchParams.get("pageNumber") || 1) as number,
      };
      const response = await getAPI().fetchProjects(page);
      return response.data;
    },
  });

  useEffect(() => {}, [searchParams]);

  return (
    <>
      <NewFormModal<ProjectFormValues>
        title="Neues Projekt anlegen"
        buttonLabel="Neues Projekt anlegen"
        open={dialogOpen}
        onOpenDialog={() => setDialogOpen(true)}
        onCloseDialog={() => setDialogOpen(false)}
      >
        {({ formRef, setIsSubmitting }) => (
          <ProjectForm
            formRef={formRef}
            onSubmitStart={() => setIsSubmitting(true)}
            onSubmitFinished={(result) => {
              setIsSubmitting(false);
              if (result.data?.id) {
                router.push(`/projects/${result.data.id}?tab=projectInfo`);
                newToast({
                  msg: "Projekt erfolgreich angelegt",
                  type: "success",
                });
              }
            }}
            saveHandler={handleSaveProject}
          />
        )}
      </NewFormModal>

      <ProjectsTable projects={data?.items} isLoading={isLoading} />
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
