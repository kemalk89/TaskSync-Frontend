"use client";

import { ConfirmationModal } from "./confirmation-modal";
import { useConfirmationModal } from "./confirmation-modal-context";

export const ConfirmationModalContainer = () => {
  const { show, current, callbacks, closeConfirmationModal } =
    useConfirmationModal();

  return (
    <div className="confirmation-modal-container">
      <ConfirmationModal
        body={current?.body}
        data={current?.data}
        onConfirm={callbacks?.onConfirm}
        onCancel={() => {
          closeConfirmationModal();
          if (callbacks?.onCancel) {
            callbacks.onCancel();
          }
        }}
        confirmButtonDisabled={!!current?.isPending}
        confirmButtonText={"Delete"}
        title={current?.title}
        show={!!show}
      />
    </div>
  );
};
