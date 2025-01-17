"use client";

import { useParams } from "react-router-dom";

export const useParamsNumber = (key: string) => {
  const params = useParams();
  const value = params[key];
  if (value === undefined) {
    return undefined;
  }

  return parseInt(value);
};
