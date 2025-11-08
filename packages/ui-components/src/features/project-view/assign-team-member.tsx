"use client";

import { Formik } from "formik";
import { NewFormModal } from "../../NewFormModal";
import { ProjectFormValues } from "../projects/project-form";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEY_FETCH_USERS } from "../constants";
import { getAPI } from "@app/api";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import { Select } from "../../select";
import { UserName } from "../../user-name/user-name";

type Props = {
  projectId?: number;
};

export const AssignTeamMember = ({ projectId }: Props) => {
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
      if (projectId) {
        return getAPI().patch.updateProject(projectId, {
          projectManagerId,
        });
      }

      return Promise.resolve(undefined);
    },
  });

  return (
    <NewFormModal<FormValues>
      title="Neues Mitglied im Team"
      renderButton={() => {
        return (
          <Button
            onClick={() => {
              setDialogOpen(true);
              refetch();
            }}
          >
            Neue Person hinzufügen
          </Button>
        );
      }}
      open={dialogOpen}
      onCloseDialog={() => setDialogOpen(false)}
    >
      {({ formRef, setIsSubmitting }) => (
        <Formik<FormValues>
          innerRef={formRef}
          initialValues={{
            userId: "",
            roleInProject: "",
          }}
          validate={(values) => {
            const errors: Partial<ProjectFormValues> = {};
            if (!values.userId) {
              errors.projectManagerId = "Required";
            }
            return errors;
          }}
          onSubmit={async (values) => {
            setIsSubmitting(true);
            await mutateAsync(Number(values.userId));
            setIsSubmitting(false);
            setDialogOpen(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleSubmit,
            handleChange,
            handleBlur,
            setFieldValue,
          }) => (
            <Form onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <FormLabel htmlFor="userId">
                  Person <span className="required-field-asterisk">*</span>
                </FormLabel>
                <Select
                  isInvalid={touched.userId && !!errors.userId}
                  placeholder="Nach einer Person suchen..."
                  value={values.userId ? values.userId : ""}
                  disabled={isLoading}
                  onChange={(value) => setFieldValue("userId", value, false)}
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
                  {touched.userId && errors.userId}
                </FormControl.Feedback>
              </FormGroup>

              <FormGroup className="mb-3">
                <FormLabel htmlFor="roleInProject">
                  Rolle im Projekt{" "}
                  <span className="required-field-asterisk">*</span>
                </FormLabel>
                <FormControl
                  id="roleInProject"
                  name="roleInProject"
                  placeholder="Welche Rolle hat diese Person im Projekt?"
                  value={values.roleInProject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.roleInProject && !!errors.roleInProject}
                />
              </FormGroup>
            </Form>
          )}
        </Formik>
      )}
    </NewFormModal>
  );
};

type FormValues = {
  userId: string;
  roleInProject: string;
};
