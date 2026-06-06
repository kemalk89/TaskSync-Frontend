"use client";

import { FormGroup, FormLabel } from "react-bootstrap";
import { Select } from "../../select";
import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { getAPI } from "@app/api";
import { ToastContext } from "../../toast";
import { useTranslation } from "../../i18n";

export const SettingsPage = () => {
  const { mutate } = useChangeCurrentUsersLanguage();
  const { t, currentLanguage } = useTranslation();
  const handleChangeLanguage = (newLanguage: string) => {
    mutate(newLanguage);
  };

  return (
    <div>
      <h1>{t("settings.title")}</h1>
      <FormGroup>
        <FormLabel>Sprache</FormLabel>
        <Select
          value={currentLanguage}
          options={[
            { value: "de", label: "Deutsch" },
            { value: "en", label: "English" },
            { value: "tr", label: "Türkce" },
          ]}
          onChange={(lng) => handleChangeLanguage(lng as string)}
        />
      </FormGroup>

      <h1>Further ideas</h1>
      <ul>
        <li>Change Theme</li>
      </ul>
    </div>
  );
};

const useChangeCurrentUsersLanguage = () => {
  const { newToast } = useContext(ToastContext);
  const { changeLanguage } = useTranslation();

  return useMutation({
    mutationFn: async (newLanguage: string) => {
      const lng = await getAPI().patch.changeCurrentUsersLanguage(newLanguage);
      const newDictionaryResponse = await fetch(
        "/api/changeLanguage/" + lng.data,
        {
          method: "POST",
        },
      );
      const newDictionary = await newDictionaryResponse.json();
      changeLanguage(lng.data!, newDictionary.dictionary);
    },
    onSuccess: () => {
      newToast({
        msg: "Die Sprache wurde erfolgreich geändert.",
        type: "success",
      });
    },
  });
};
