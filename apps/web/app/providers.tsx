"use client";

import { ToastContext, ToastMessage } from "@app/ui-components";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useCallback, useState } from "react";
import { getQueryClient } from "./get-query-client";

let TOAST_ID_COUNTER = 0;

export const Providers = ({ children }: PropsWithChildren) => {
  const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);

  const queryClient = getQueryClient();

  const newToast = useCallback((msg: ToastMessage) => {
    if (!msg.id) {
      msg.id = (++TOAST_ID_COUNTER).toString();
    }
    setToastMessages((prev) => [msg, ...prev]);
  }, []);

  const removeToast = useCallback((msg: ToastMessage) => {
    setToastMessages((prev) => prev.filter((m) => m.id !== msg.id));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContext
        value={{
          toastMessages,
          newToast,
          removeToast,
        }}
      >
        {children}
      </ToastContext>
    </QueryClientProvider>
  );
};
