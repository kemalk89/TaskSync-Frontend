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
  children,
}: Props<T>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const formRef = useRef<FormikProps<T>>(null);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  return (
    <>
      <Button onClick={handleOpenDialog}>{buttonLabel}</Button>
      <Modal show={dialogOpen} onHide={handleCloseDialog}>
        <ModalHeader closeButton>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
        <ModalBody>{children({ setIsSubmitting, formRef })}</ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={handleCloseDialog}>
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
