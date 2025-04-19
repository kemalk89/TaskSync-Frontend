"use client";

import { ApiResponse, getAPI, ProjectResponse, TicketResponse } from "@app/api";
import { Formik, FormikProps } from "formik";
import { Ref, useEffect, useState } from "react";
import { Form, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import { Select } from "../../select";
import { TicketIconBug, TicketIconStory, TicketIconTask } from "./ticket-icons";

export interface FormValues {
  projectId: string;
  type: string; // Bug, Story, Task
  title: string;
  description: string;
}

interface Props {
  formRef: Ref<FormikProps<FormValues>>;
  saveHandler: (project: FormValues) => Promise<ApiResponse<TicketResponse>>;
  onSubmitStart: () => void;
  onSubmitFinished: (result: ApiResponse<TicketResponse>) => void;
}

export const TicketForm = ({
  formRef,
  saveHandler,
  onSubmitStart,
  onSubmitFinished,
}: Props) => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);

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

  return (
    <Formik<FormValues>
      innerRef={formRef}
      initialValues={{
        projectId: "",
        type: "",
        title: "",
        description: "",
      }}
      validate={(values) => {
        const errors: Partial<FormValues> = {};
        if (!values.title) {
          errors.title = "Required";
        }
        if (!values.type) {
          errors.title = "Required";
        }

        return errors;
      }}
      onSubmit={async (values) => {
        console.log(values);
        return;
        onSubmitStart();
        const result = await saveHandler(values);
        onSubmitFinished(result);
      }}
    >
      {(formikProps) => (
        <Form onSubmit={formikProps.handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="type">
              Projekt <span className="required-field-asterisk">*</span>
            </FormLabel>
            <Select
              placeholder="Projekt auswählen..."
              value={formikProps.values.projectId}
              onChange={(value: string) =>
                formikProps.setFieldValue("projectId", value, false)
              }
              options={projects.map((p) => ({
                value: p.id,
                label: p.title,
              }))}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="type">
              Type <span className="required-field-asterisk">*</span>
            </FormLabel>
            <Select
              placeholder="Typ des Tickets auswählen..."
              value={formikProps.values.type}
              onChange={(value: string) =>
                formikProps.setFieldValue("type", value, false)
              }
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
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="title">
              Titel <span className="required-field-asterisk">*</span>
            </FormLabel>
            <FormControl
              id="title"
              name="title"
              isInvalid={!!formikProps.errors.title}
              value={formikProps.values.title}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
            />
            <FormControl.Feedback type="invalid">
              {formikProps.errors.title}
            </FormControl.Feedback>
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="description">Description</FormLabel>
            <FormControl
              id="description"
              name="description"
              type="textarea"
              value={formikProps.values.description}
              onChange={formikProps.handleChange}
            />
          </FormGroup>
        </Form>
      )}
    </Formik>
  );
};
