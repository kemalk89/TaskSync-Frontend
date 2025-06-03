"use client";

import { FormikProps } from "formik";
import { ReactNode, Ref, useRef, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";

type Props<T> = {
  title: string;
  buttonLabel: string;
  open: boolean;
  onCloseDialog: () => void;
  onOpenDialog: () => void;
  children: (data: {
    setIsSubmitting: (value: boolean) => void;
    formRef: Ref<FormikProps<T>>;
  }) => ReactNode;
};

/**
 * A generic modal component that includes a button to open the modal.
 * This component is designed to work with a Formik form passed as its child.
 *
 * @template T The type of form values handled by the Formik form.
 */
export const NewFormModal = <T,>({
  title,
  buttonLabel,
  open,
  onOpenDialog,
  onCloseDialog,
  children,
}: Props<T>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<FormikProps<T>>(null);

  return (
    <>
      <div className="d-flex justify-content-end">
        <Button onClick={onOpenDialog}>{buttonLabel}</Button>
      </div>
      <Modal size="xl" show={open} onHide={onCloseDialog}>
        <ModalHeader closeButton>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
        <ModalBody>{children({ setIsSubmitting, formRef })}</ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={onCloseDialog}>
            Close
          </Button>
          <Button
            variant="primary"
            disabled={isSubmitting}
            onClick={() => {
              formRef.current?.submitForm();
            }}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
