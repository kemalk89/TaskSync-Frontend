"use client";

import { createContext, ReactNode, useContext, useState } from "react";

export const TranslationContext = createContext<{
  dictionary: Record<string, unknown>;
  currentLng: string;
  changeLanguage: (newLng: string, dictionary: Record<string, unknown>) => void;
} | null>(null);

export const TranslationProvider = (props: {
  initialDictionary: Record<string, unknown>;
  currentLng: string;
  children: ReactNode;
}) => {
  const [dictionary, setDictionary] = useState(props.initialDictionary);
  const [currentLanguage, setCurrentLanguage] = useState(props.currentLng);
  return (
    <TranslationContext
      value={{
        currentLng: currentLanguage,
        dictionary,
        changeLanguage: (newLng, dictionary) => {
          // Update the <html lang> attribute
          document.documentElement.lang = newLng;
          setDictionary(dictionary);
          setCurrentLanguage(newLng);
        },
      }}
    >
      {props.children}
    </TranslationContext>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);

  if (!context) {
    throw "No TranslationContext";
  }

  return {
    t: (path: string): string => {
      // Validation
      if (!context) {
        return path;
      }

      if (!path) {
        return path;
      }

      // Resolve translation
      let lastNode: unknown = null;
      const parts = path.split(".");
      for (let i = 0; i < parts.length; i++) {
        const key = parts.at(i) as string;
        let currentNode: unknown;
        if (lastNode !== null && typeof lastNode === "object") {
          currentNode = (lastNode as Record<string, unknown>)[key];
        } else {
          currentNode = context.dictionary[key];
        }
        if (!currentNode) {
          return path;
        }

        lastNode = currentNode;
      }

      if (typeof lastNode === "string") {
        return lastNode;
      }

      return path;
    },
    currentLanguage: context.currentLng,
    changeLanguage: (newLng: string, dictionary: Record<string, unknown>) => {
      if (context) {
        context.changeLanguage(newLng, dictionary);
      }
    },
  };
};
