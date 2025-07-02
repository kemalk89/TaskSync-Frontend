import { ReactNode } from "react";
import { Button, Modal } from "react-bootstrap";

type Props = {
  show: boolean;
  title: string;
  confirmButtonText: string;
  confirmButtonDisabled: boolean;
  body: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmationModal = ({
  show,
  confirmButtonText,
  confirmButtonDisabled,
  title,
  body,
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{body}</Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          disabled={confirmButtonDisabled}
          onClick={onConfirm}
        >
          {confirmButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
