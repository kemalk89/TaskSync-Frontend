"use client";

import { ApiResponse, getAPI, ProjectResponse } from "@app/api";
import { Formik, FormikProps } from "formik";
import { Ref } from "react";
import { Form, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import { Select } from "../../select";
import { useQuery } from "@tanstack/react-query";
import { UserName } from "../../user-name/user-name";
import { QUERY_KEY_FETCH_USERS } from "../constants";
import { TextEditor } from "../../texteditor/texteditor";
import { useTextEditor } from "../../texteditor/use-texteditor";

enum ProjectVisibility {
  Everybody,
  TeamOnly,
}

export interface ProjectFormValues {
  title: string;
  description: string;
  visibility?: ProjectVisibility;
  projectManagerId?: string;
}

interface ProjectFormProps {
  formRef: Ref<FormikProps<ProjectFormValues>>;
  saveHandler: (
    project: ProjectFormValues
  ) => Promise<ApiResponse<ProjectResponse>>;
  onSubmitStart: () => void;
  onSubmitFinished: (result: ApiResponse<ProjectResponse>) => void;
}

export const ProjectForm = ({
  formRef,
  saveHandler,
  onSubmitStart,
  onSubmitFinished,
}: ProjectFormProps) => {
  const { data: users, isLoading } = useQuery({
    queryKey: QUERY_KEY_FETCH_USERS,
    queryFn: async () => {
      return await getAPI().fetchUsers({ pageNumber: 1, pageSize: 100 });
    },
  });

  const editor = useTextEditor({
    placeholder: "Hier können Details eingegeben werden...",
  });

  return (
    <Formik<ProjectFormValues>
      innerRef={formRef}
      initialValues={{
        title: "",
        description: "",
        projectManagerId: "",
        visibility: ProjectVisibility.TeamOnly,
      }}
      validate={(values) => {
        const errors: Partial<ProjectFormValues> = {};
        if (!values.title) {
          errors.title = "Required";
        }
        return errors;
      }}
      onSubmit={async (values) => {
        onSubmitStart();
        const result = await saveHandler({
          ...values,
          description: JSON.stringify(editor?.getJSON() ?? {}),
        });
        onSubmitFinished(result);
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
            <FormLabel htmlFor="visibility">Visiblity</FormLabel>
            <FormControl
              id="visibility"
              as="select"
              name="visibility"
              value={values.visibility}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              {Object.keys(ProjectVisibility)
                .filter((key) => isNaN(Number(key)))
                .map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
            </FormControl>
          </FormGroup>
          <FormGroup className="mb-3">
            <FormLabel htmlFor="title">
              Titel <span className="required-field-asterisk">*</span>
            </FormLabel>
            <FormControl
              id="title"
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.title && !!errors.title}
            />
            <FormControl.Feedback type="invalid">
              {touched.title && errors.title}
            </FormControl.Feedback>
          </FormGroup>
          <FormGroup className="mb-3">
            <FormLabel onClick={() => editor?.commands.focus()}>
              Beschreibung
            </FormLabel>
            <TextEditor editor={editor} />
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel htmlFor="projectManager">Projektleiter</FormLabel>
            <Select
              placeholder="Nach einer Person suchen..."
              value={values.projectManagerId ?? ""}
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
          </FormGroup>
          <div>Team members (What is role of this member?)</div>
        </Form>
      )}
    </Formik>
  );
};
