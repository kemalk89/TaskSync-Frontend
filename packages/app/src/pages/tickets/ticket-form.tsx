import { Formik } from "formik";
import { Form, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import { AutoCompleteAsync } from "../../components/autocomplete-async/autocomplete-async";
import { api } from "@times/api";

interface TicketFormProps {
  formId: string;
  saveHandler: (formValues: TicketFormValues) => void;
}

interface TicketFormValues {
  title: string;
  description: string;
  projectId: string;
  assignee: string | null;
}

export const TicketForm = ({ formId, saveHandler }: TicketFormProps) => {
  return (
    <Formik<TicketFormValues>
      initialValues={{
        title: "",
        description: "",
        projectId: "",
        assignee: null,
      }}
      validate={(values) => {
        const errors: Partial<TicketFormValues> = {};
        if (!values.title) {
          errors.title = "Required";
        }
        if (!values.projectId) {
          errors.projectId = "Required";
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
        setFieldValue,
      }) => (
        <Form onSubmit={handleSubmit} id={formId}>
          <FormGroup>
            <Label for="projectId">Project</Label>
            <Input
              id="projectId"
              name="projectId"
              value={values.projectId}
              onChange={handleChange}
              onBlur={handleBlur}
              invalid={!!errors.projectId && touched.projectId}
            />
            <FormFeedback>{errors.projectId}</FormFeedback>
          </FormGroup>
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
            <Label for="assignee">Assignees</Label>
            <AutoCompleteAsync
              labelKey="username"
              id="assignee"
              apiFn={api.searchUsers}
              onChange={(selectedUser) =>
                setFieldValue("assignee", selectedUser)
              }
            />
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
