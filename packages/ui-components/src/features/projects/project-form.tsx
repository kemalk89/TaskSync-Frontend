import { Formik } from "formik";
import { Form, FormFeedback, FormGroup, Input, Label } from "reactstrap";

interface ProjectFormValues {
  title: string;
  description: string;
}

interface ProjectFormProps {
  formId: string;
  saveHandler: (project: ProjectFormValues) => void;
}

export const ProjectForm = ({ formId, saveHandler }: ProjectFormProps) => {
  return (
    <Formik<ProjectFormValues>
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
      onSubmit={(values) => {
        saveHandler(values);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleSubmit,
        handleChange,
        handleBlur,
      }) => (
        <Form onSubmit={handleSubmit} id={formId}>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              invalid={!!errors.title && touched.title}
            />
            <FormFeedback>{errors.title}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              id="description"
              name="description"
              type="textarea"
              value={values.description}
              onChange={handleChange}
            />
          </FormGroup>
        </Form>
      )}
    </Formik>
  );
};
