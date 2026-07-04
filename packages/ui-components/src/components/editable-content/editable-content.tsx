import { KeyboardEvent, useEffect, useRef, useState } from "react";

import { Formik } from "formik";
import { IconCheck2, IconX } from "../icons/icons";

import { Button, Col, Form, InputGroup } from "react-bootstrap";

import styles from "./styles.module.css";

type Props = {
  as: "h1" | "h2" | "h3" | "div";
  value?: string;
  validationMessage: string;
  isSubmitting?: boolean;
  isSuccess?: boolean;
  onSubmit: (newValue: string) => void;
};

export const EditableLine = ({
  as: Tag,
  value,
  validationMessage,
  isSubmitting,
  isSuccess,
  onSubmit,
}: Props) => {
  const refInput = useRef<HTMLInputElement>(null);
  const [editMode, setEditMode] = useState<boolean>();

  useEffect(() => {
    if (editMode) {
      refInput.current?.focus();
    }
  }, [editMode]);

  useEffect(() => {
    if (isSuccess) {
      setEditMode(false);
    }
  }, [isSuccess]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setEditMode(false);
    }
  };

  return (
    <>
      {editMode ? (
        <Formik<FormValues>
          initialValues={{ value: value ?? "" }}
          validate={(values) => {
            const errors: Partial<FormValues> = {};
            if (!values.value.trim()) {
              errors.value = validationMessage;
            }

            return errors;
          }}
          onSubmit={(values) => onSubmit(values.value)}
        >
          {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className="d-flex gap-2">
                <Form.Group as={Col} controlId="validationValue">
                  <InputGroup hasValidation>
                    <Form.Control
                      name="value"
                      value={values.value}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      isInvalid={!!errors.value}
                      className={[styles.mouseOver].join(" ")}
                      ref={refInput}
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                      {errors.value}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <div className="d-flex gap-1 ">
                  <Button type="submit" variant="light" disabled={isSubmitting}>
                    <IconCheck2 />
                  </Button>
                  <Button
                    variant="light"
                    type="button"
                    onClick={() => setEditMode(false)}
                    disabled={isSubmitting}
                  >
                    <IconX />
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Formik>
      ) : (
        <Tag
          className={styles.editableContent}
          onClick={() => {
            setEditMode(true);
          }}
        >
          {value}
        </Tag>
      )}
    </>
  );
};

type FormValues = {
  value: string;
};
