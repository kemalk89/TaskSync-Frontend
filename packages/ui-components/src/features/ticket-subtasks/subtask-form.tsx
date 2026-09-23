"use client";

import { ApiResponse, TicketResponse } from "@app/api";
import { Formik, FormikProps } from "formik";
import { Ref } from "react";
import { Form, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import { Select } from "../../select";
import { UserName } from "../../components/user-name/user-name";
import { TextEditor } from "../../texteditor/texteditor";
import { useTextEditor } from "../../texteditor/use-texteditor";
import { useTranslation } from "../../i18n";
import { useFetchProjectTeam } from "../project-hooks";

interface Props {
  formRef: Ref<FormikProps<SubtaskFormValues>>;
  ticket: TicketResponse;
  saveHandler: (values: SubtaskFormValues) => Promise<ApiResponse<unknown>>;
  onSubmitStart: () => void;
  onSubmitFinished: (result: ApiResponse<unknown>) => void;
}

export const SubtaskForm = ({
  formRef,
  ticket,
  saveHandler,
  onSubmitStart,
  onSubmitFinished,
}: Props) => {
  const { t } = useTranslation();
  const editor = useTextEditor({
    placeholder: t("ticket.subtasks.form.descriptionPlaceholder"),
  });

  const { data: team } = useFetchProjectTeam({
    projectId: ticket.project.id,
  });

  return (
    <Formik<SubtaskFormValues>
      innerRef={formRef}
      initialValues={{
        title: "",
        assignee: "",
      }}
      validate={(values) => {
        const errors: Partial<SubtaskFormValues> = {};
        if (!values.title) {
          errors.title = t("ticket.subtasks.form.required");
        }
        return errors;
      }}
      onSubmit={async (values) => {
        onSubmitStart();
        const result = await saveHandler({
          ...values,
          ...(editor && !editor.isEmpty
            ? { description: JSON.stringify(editor.getJSON()) }
            : {}),
        });
        onSubmitFinished(result);
      }}
    >
      {(formikProps) => (
        <Form onSubmit={formikProps.handleSubmit}>
          <FormGroup className="mb-3">
            <FormLabel htmlFor="title">
              {t("ticket.subtasks.form.title")}{" "}
              <span className="required-field-asterisk">*</span>
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
              autoFocus
            />
            <FormControl.Feedback type="invalid">
              {formikProps.touched.title && formikProps.errors.title}
            </FormControl.Feedback>
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel htmlFor="description">
              {t("ticket.subtasks.form.description")}
            </FormLabel>
            <TextEditor editor={editor} />
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel htmlFor="assignee">
              {t("ticket.subtasks.form.assignee")}
            </FormLabel>
            <Select
              placeholder={t("ticket.subtasks.form.assigneePlaceholder")}
              value={formikProps.values.assignee}
              onChange={(value) =>
                formikProps.setFieldValue("assignee", value, false)
              }
              options={
                (team ?? []).map((member) => ({
                  label: <UserName user={member.user} />,
                  value: member.userId.toString(),
                })) ?? []
              }
            />
          </FormGroup>
        </Form>
      )}
    </Formik>
  );
};

export interface SubtaskFormValues {
  title: string;
  assignee: string;
  description?: string;
}
