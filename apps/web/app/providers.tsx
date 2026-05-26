"use client";

import {
  ToastContext,
  ToastMessage,
  ConfirmationModalProvider,
  TranslationProvider,
} from "@app/ui-components";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useCallback, useState } from "react";
import { getQueryClient } from "./get-query-client";
import { Locale } from "./dictionaries";

let TOAST_ID_COUNTER = 0;

export const Providers = ({
  children,
  dictionary,
  currentLng,
}: PropsWithChildren & {
  dictionary: Record<string, unknown>;
  currentLng: Locale;
}) => {
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
    <TranslationProvider currentLng={currentLng} initialDictionary={dictionary}>
      <QueryClientProvider client={queryClient}>
        <ToastContext
          value={{
            toastMessages,
            newToast,
            removeToast,
          }}
        >
          <ConfirmationModalProvider>{children}</ConfirmationModalProvider>
        </ToastContext>
      </QueryClientProvider>
    </TranslationProvider>
  );
};
