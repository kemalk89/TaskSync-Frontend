"use client";

import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
import { ConfirmationModalContainer } from "./confirmation-modal-container";

export type ConfirmationModalCallbacks = {
  onConfirm?: (data: unknown) => void;
  onCancel?: () => void;
};

export type ConfirmationModalContentData = {
  show?: boolean;
  title: ReactNode;
  body: ReactNode;
  isPending?: boolean;
  data: unknown;
};

type ConfirmationModalContextType = {
  show?: boolean;
  current?: ConfirmationModalContentData;
  callbacks?: ConfirmationModalCallbacks;
  showConfirmationModal: (
    data: ConfirmationModalContentData,
    callbacks: ConfirmationModalCallbacks
  ) => void;
  closeConfirmationModal: () => void;
  setConfirmationModalPending: (isPending: boolean) => void;
  onConfirm?: () => void;
};

const ConfirmationModalContext = createContext<
  ConfirmationModalContextType | undefined
>(undefined);

export const ConfirmationModalProvider = ({ children }: PropsWithChildren) => {
  const [show, setShow] = useState<boolean>();
  const [title, setTitle] = useState<ReactNode>();
  const [body, setBody] = useState<ReactNode>();
  const [isPending, setIsPending] = useState<boolean>();
  const [data, setData] = useState<unknown>();

  const current: ConfirmationModalContentData = {
    show,
    title,
    body,
    isPending,
    data,
  };

  const confirmationModalCallbacks =
    useRef<ConfirmationModalCallbacks>(undefined);

  const setConfirmationModalPending = (isPending: boolean) => {
    setIsPending(isPending);
  };

  const showConfirmationModal = (
    data: ConfirmationModalContentData,
    callbacks: ConfirmationModalCallbacks
  ) => {
    setShow(true);
    setTitle(data.title);
    setBody(data.body);
    setData(data.data);
    setIsPending(!!data.isPending);

    confirmationModalCallbacks.current = callbacks;
  };

  const closeConfirmationModal = () => {
    setShow(undefined);
    setIsPending(undefined);
    setData(undefined);
    setTitle(undefined);
    setBody(undefined);

    confirmationModalCallbacks.current = undefined;
  };

  return (
    <ConfirmationModalContext
      value={{
        show,
        current,
        callbacks: confirmationModalCallbacks.current,
        setConfirmationModalPending,
        showConfirmationModal,
        closeConfirmationModal,
      }}
    >
      <ConfirmationModalContainer />

      {children}
    </ConfirmationModalContext>
  );
};

export const useConfirmationModal = () => {
  const context = useContext(ConfirmationModalContext);

  if (!context) {
    throw new Error(
      "useConfirmationModal must be used within a ConfirmationModalProvider"
    );
  }

  return context;
};
