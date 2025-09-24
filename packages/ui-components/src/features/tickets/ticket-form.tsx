"use client";

import { ApiResponse, getAPI, ProjectResponse, TicketResponse } from "@app/api";
import { Formik, FormikProps } from "formik";
import { Ref, useEffect, useState } from "react";
import { Form, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import { Select } from "../../select";
import { TicketIconBug, TicketIconStory, TicketIconTask } from "./ticket-icons";
import { UserName } from "../../user-name/user-name";
import { TextEditor } from "../../texteditor/texteditor";
import { useTextEditor } from "../../texteditor/use-texteditor";

interface Props {
  formRef: Ref<FormikProps<TicketFormValues>>;
  preselectedProjectId?: string;
  saveHandler: (
    project: TicketFormValues
  ) => Promise<ApiResponse<TicketResponse>>;
  onSubmitStart: () => void;
  onSubmitFinished: (result: ApiResponse<TicketResponse>) => void;
}

export const TicketForm = ({
  formRef,
  preselectedProjectId,
  saveHandler,
  onSubmitStart,
  onSubmitFinished,
}: Props) => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const editor = useTextEditor({
    placeholder: "Hier können Details eingegeben werden...",
  });

  useEffect(() => {
    async function fetchProjects() {
      const projects = await getAPI().fetchProjects({
        pageNumber: 1,
        pageSize: 50,
      });

      if (projects.data && Array.isArray(projects.data.items)) {
        setProjects(projects.data.items);
      }
    }

    fetchProjects();
  }, []);

  const findProject = (projectId: string | undefined) => {
    if (!projectId) {
      return undefined;
    }
    return projects.find((p) => p.id === projectId);
  };

  return (
    <Formik<TicketFormValues>
      innerRef={formRef}
      initialValues={{
        projectId: preselectedProjectId ?? "",
        type: "",
        title: "",
        assignee: "",
      }}
      validate={(values) => {
        const errors: Partial<TicketFormValues> = {};
        if (!values.title) {
          errors.title = "Pflichtfeld";
        }
        if (!values.type) {
          errors.type = "Pflichtfeld";
        }
        if (!values.projectId) {
          errors.projectId = "Pflichtfeld";
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
      {(formikProps) => (
        <Form onSubmit={formikProps.handleSubmit}>
          <FormGroup className="mb-3">
            <FormLabel htmlFor="type">
              Projekt <span className="required-field-asterisk">*</span>
            </FormLabel>
            <Select
              isInvalid={
                formikProps.touched.projectId && !!formikProps.errors.projectId
              }
              placeholder="Projekt auswählen..."
              value={formikProps.values.projectId}
              onChange={(value) =>
                formikProps.setFieldValue("projectId", value)
              }
              options={projects.map((p) => ({
                value: p.id.toString(),
                label: p.title,
              }))}
            />
            <FormControl.Feedback type="invalid">
              {formikProps.touched.projectId && formikProps.errors.projectId}
            </FormControl.Feedback>
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel htmlFor="title">
              Titel <span className="required-field-asterisk">*</span>
            </FormLabel>
            <FormControl
              id="title"
              name="title"
              isInvalid={
                formikProps.touched.title && !!formikProps.errors.title
              }
              value={formikProps.values.title}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
            />
            <FormControl.Feedback type="invalid">
              {formikProps.touched.title && formikProps.errors.title}
            </FormControl.Feedback>
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel htmlFor="type">
              Typ <span className="required-field-asterisk">*</span>
            </FormLabel>
            <Select
              isInvalid={formikProps.touched.type && !!formikProps.errors.type}
              placeholder="Dieses Ticket hat den Typ..."
              value={formikProps.values.type}
              onChange={(value) => formikProps.setFieldValue("type", value)}
              options={[
                {
                  value: "story",
                  label: <TicketIconStory />,
                },
                {
                  value: "task",
                  label: <TicketIconTask />,
                },
                {
                  value: "bug",
                  label: <TicketIconBug />,
                },
              ]}
            />
            <FormControl.Feedback type="invalid">
              {formikProps.touched.type && formikProps.errors.type}
            </FormControl.Feedback>
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel htmlFor="assignee">Zugewiesene Person</FormLabel>
            <Select
              placeholder="Um dieses Ticket kümmert sich..."
              value={formikProps.values.assignee}
              onChange={(value) =>
                formikProps.setFieldValue("assignee", value, false)
              }
              disabled={!findProject(formikProps.values.projectId)}
              options={
                findProject(formikProps.values.projectId)?.projectMembers.map(
                  (projectMember) => ({
                    label: <UserName user={projectMember.user} />,
                    value: projectMember.userId,
                  })
                ) ?? []
              }
            />
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel htmlFor="description">Beschreibung</FormLabel>
            <TextEditor editor={editor} />
          </FormGroup>
        </Form>
      )}
    </Formik>
  );
};

export interface TicketFormValues {
  projectId: string;
  type: string; // Bug, Story, Task
  title: string;
  assignee: string;
  description?: string;
}
