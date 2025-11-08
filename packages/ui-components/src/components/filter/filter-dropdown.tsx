import React from "react";
import { Dropdown } from "react-bootstrap";
import { SelectOption } from "../../select";
import { SelectMultiDropdownMenu } from "../select-multi-dropdown-menu/select-multi-dropdown-menu";
import styles from "./styles.module.css";

interface Props {
  title: string;
  options: SelectOption[];
  selectedOptions: string[];
  onSelect: (optionId: string) => void;
  onUnselect: (optionId: string) => void;
}

export const FilterDropdown = ({
  title,
  options = [],
  selectedOptions = [],
  onSelect,
  onUnselect,
}: Props) => {
  const findOption = (optionId: string) => {
    return options.find((i) => i.value === optionId);
  };

  const handleSelect = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    optionId: string
  ) => {
    event.stopPropagation();

    const isSelected = selectedOptions.findIndex((id) => id === optionId) > -1;
    if (isSelected) {
      onUnselect(optionId);
    } else {
      onSelect(optionId);
    }
  };

  return (
    <Dropdown
      className={selectedOptions.length === 0 ? styles.dropdownInactive : ""}
    >
      <Dropdown.Toggle className={styles.dropdownToggle}>
        {selectedOptions.length === 0 && title}
        {selectedOptions.length > 0 &&
          title +
            ": " +
            selectedOptions
              .map((optionValue) => findOption(optionValue)?.label)
              .join(", ")}
      </Dropdown.Toggle>
      <SelectMultiDropdownMenu
        options={options}
        selectedOptions={selectedOptions}
        onSelect={handleSelect}
      />
    </Dropdown>
  );
};
