import { ApiResponse, ProjectResponse } from "@app/api";
import { Formik, FormikProps } from "formik";
import { Ref } from "react";
import { Form, FormControl, FormGroup, FormLabel } from "react-bootstrap";

export interface ProjectFormValues {
  title: string;
  description: string;
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
  return (
    <Formik<ProjectFormValues>
      innerRef={formRef}
      initialValues={{
        title: "",
        description: "",
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
        const result = await saveHandler(values);
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
        isSubmitting,
      }) => (
        <Form onSubmit={handleSubmit}>
          <div>
            <h3>Debug</h3>
            <div>Is Submitting: {isSubmitting ? "Yes" : "No"}</div>
          </div>
          <FormGroup>
            <FormLabel htmlFor="title">Title</FormLabel>
            <FormControl
              id="title"
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormControl.Feedback>{errors.title}</FormControl.Feedback>
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="description">Description</FormLabel>
            <FormControl
              id="description"
              name="description"
              type="textarea"
              value={values.description}
              onChange={handleChange}
            />
          </FormGroup>
          <div>Project Lead</div>
          <div>Team members (What is role of this member?)</div>
          <div>Project Visibility: Everybody, Members</div>
        </Form>
      )}
    </Formik>
  );
};
