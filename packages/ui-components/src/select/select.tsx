"use client";

import { ReactNode } from "react";
import { Dropdown } from "react-bootstrap";
import styles from "./styles.module.css";

type SelectOption = {
  value: string;
  label: ReactNode;
};

type Props = {
  placeholder: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
};

export const Select = ({ placeholder, value, options, onChange }: Props) => {
  const getSelectBtnLabel = () => {
    const selectedOption = options.find((o) => o.value === value);
    if (selectedOption) {
      return selectedOption.label;
    }

    return placeholder;
  };
  return (
    <Dropdown className={styles.dropdown}>
      <Dropdown.Toggle className={styles.dropdownToggleBtn}>
        <div className="d-inline-block" style={{ width: "calc(100% - 16px)" }}>
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
