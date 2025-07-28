"use client";

import { ReactNode } from "react";
import { Button, Modal } from "react-bootstrap";

type Props = {
  show: boolean;
  title: ReactNode;
  confirmButtonText: string;
  confirmButtonDisabled: boolean;
  body: ReactNode;
  data: unknown;
  onConfirm?: (data: unknown) => void;
  onCancel?: () => void;
};

export const ConfirmationModal = ({
  show,
  confirmButtonText,
  confirmButtonDisabled,
  title,
  body,
  data,
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
        <Button variant="light" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="danger"
          disabled={confirmButtonDisabled}
          onClick={() => {
            if (onConfirm) {
              onConfirm(data);
            }
          }}
        >
          {confirmButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
