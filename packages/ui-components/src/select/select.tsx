"use client";

import { ReactNode } from "react";
import { Dropdown } from "react-bootstrap";
import styles from "./styles.module.css";

type SelectOption = {
  value: string | number;
  label: ReactNode;
};

type Props = {
  placeholder: string;
  value: string;
  options: SelectOption[];
  disabled?: boolean;
  className?: string;
  isInvalid?: boolean;
  onChange: (value: string | number) => void;
};

export const Select = ({
  placeholder,
  value,
  options,
  className = "",
  isInvalid,
  onChange,
}: Props) => {
  const findOption = () => options.find((o) => o.value === value);

  const getSelectBtnLabel = () => {
    const selectedOption = findOption();
    if (selectedOption) {
      return selectedOption.label;
    }

    return placeholder;
  };

  const isDisplayingPlaceholder = () => {
    const selectedOption = findOption();
    if (selectedOption) {
      return false;
    }

    return true;
  };

  return (
    <Dropdown
      className={[
        styles.dropdown,
        className,
        "form-control",
        isInvalid ? "is-invalid" : "",
      ].join(" ")}
    >
      <Dropdown.Toggle className={styles.dropdownToggleBtn}>
        <div
          className={[
            "d-inline-block",
            isDisplayingPlaceholder() ? styles.placeholderText : "",
          ].join(" ")}
          style={{ width: "calc(100% - 16px)" }}
        >
          {getSelectBtnLabel()}
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {options.map((o) => (
          <Dropdown.Item
            key={o.value}
            active={o.value === value}
            onClick={() => onChange(o.value)}
            className={[
              styles.dropdownItem,
              o.value === value ? styles.dropdownItemActive : "",
            ].join(" ")}
          >
            {o.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};
