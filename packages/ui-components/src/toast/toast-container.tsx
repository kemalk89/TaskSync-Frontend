"use client";

import { useContext } from "react";
import { ToastContext } from "./toast-context";
import Toast from "react-bootstrap/Toast";
import BsToastContainer from "react-bootstrap/ToastContainer";
import { IconExclamationCircleFill } from "../icons/icons";

export const ToastContainer = () => {
  const { toastMessages, removeToast } = useContext(ToastContext);

  return (
    <BsToastContainer
      className="p-3"
      position="top-end"
      style={{
        zIndex: 1,
      }}
    >
      {toastMessages.map((t, i) => (
        <Toast key={i} onClose={() => removeToast(t)}>
          <Toast.Header>
            <strong className="me-auto">
              {t.type === "error" && (
                <>
                  <IconExclamationCircleFill className="u-fill-danger" /> Fehler
                </>
              )}
              {t.type === "success" && (
                <>
                  <IconExclamationCircleFill className="u-fill-success" />{" "}
                  Aktion erfolgreich
                </>
              )}
            </strong>
          </Toast.Header>
          <Toast.Body>{t.msg}</Toast.Body>
        </Toast>
      ))}
    </BsToastContainer>
  );
};
