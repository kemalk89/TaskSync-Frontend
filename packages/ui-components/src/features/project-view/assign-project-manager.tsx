"use client";

import { Formik } from "formik";
import { NewFormModal } from "../../NewFormModal";
import { ProjectFormValues } from "../projects/project-form";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEY_FETCH_USERS } from "../constants";
import { getAPI } from "@app/api";
import { Form, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import { Select } from "../../select";
import { UserName } from "../../user-name/user-name";

type Props = {
  projectId: number;
};

export const AssignProjectManager = ({ projectId }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    data: users,
    refetch,
    isLoading,
  } = useQuery({
    enabled: false,
    queryKey: QUERY_KEY_FETCH_USERS,
    queryFn: async () => {
      return await getAPI().fetchUsers({ pageNumber: 1, pageSize: 100 });
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: (projectManagerId: number) => {
      return getAPI().patch.updateProject(projectId, {
        projectManagerId,
      });
    },
  });

  return (
    <>
      <NewFormModal<Partial<ProjectFormValues>>
        title="Projektleiter zuweisen"
        buttonLabel="Projektleiter zuweisen"
        open={dialogOpen}
        onOpenDialog={() => {
          setDialogOpen(true);
          refetch();
        }}
        onCloseDialog={() => setDialogOpen(false)}
      >
        {({ formRef, setIsSubmitting }) => (
          <Formik<Partial<ProjectFormValues>>
            innerRef={formRef}
            initialValues={{
              projectManagerId: null,
            }}
            validate={(values) => {
              const errors: Partial<ProjectFormValues> = {};
              if (!values.projectManagerId) {
                errors.projectManagerId = "Required";
              }
              return errors;
            }}
            onSubmit={async (values) => {
              setIsSubmitting(true);
              await mutateAsync(Number(values.projectManagerId));
              setIsSubmitting(false);
              setDialogOpen(false);
            }}
          >
            {({ values, errors, touched, handleSubmit, setFieldValue }) => (
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <FormLabel htmlFor="projectManager">
                    Projektleiter{" "}
                    <span className="required-field-asterisk">*</span>
                  </FormLabel>
                  <Select
                    isInvalid={
                      touched.projectManagerId && !!errors.projectManagerId
                    }
                    placeholder="Nach einer Person suchen..."
                    value={
                      values.projectManagerId ? values.projectManagerId : ""
                    }
                    disabled={isLoading}
                    onChange={(value) =>
                      setFieldValue("projectManagerId", value, false)
                    }
                    options={
                      users?.data?.items
                        ? users.data.items.map((user) => ({
                            label: <UserName user={user} />,
                            value: user.id,
                          }))
                        : []
                    }
                  />
                  <FormControl.Feedback type="invalid">
                    {touched.projectManagerId && errors.projectManagerId}
                  </FormControl.Feedback>
                </FormGroup>
              </Form>
            )}
          </Formik>
        )}
      </NewFormModal>
    </>
  );
};
