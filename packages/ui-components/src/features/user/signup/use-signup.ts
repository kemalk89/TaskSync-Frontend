import { useMutation } from "@tanstack/react-query";
import { SignupFormValues } from "./signup-form";
import { useContext } from "react";
import { ToastContext } from "../../../toast";

export const useSignup = () => {
  const { newToast } = useContext(ToastContext);

  return useMutation({
    mutationFn: async (data: SignupFormValues) => {
      const response = await fetch("/user/signup/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: (response) => {
      if (!response.ok) {
        newToast({
          type: "error",
          msg: "Ungültige E-Mail-Adresse oder Passwort.",
        });
      } else {
        newToast({
          type: "success",
          msg: "Registrierung erfolgreich.",
        });
      }
    },
  });
};
