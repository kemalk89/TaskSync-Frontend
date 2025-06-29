"use client";

import { createContext } from "react";

export type ToastMessage = {
  id?: string;
  msg: string;
  type: "error" | "success";
};

type ToastContextType = {
  toastMessages: ToastMessage[];
  newToast: (msg: ToastMessage) => void;
  removeToast: (msg: ToastMessage) => void;
};

export const ToastContext = createContext<ToastContextType>({
  toastMessages: [],
  newToast: () => {
    throw new Error("No implementation provided");
  },
  removeToast: () => {
    throw new Error("No implementation provided");
  },
});
