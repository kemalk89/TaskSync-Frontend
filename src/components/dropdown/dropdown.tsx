import { useState } from "react";
import {
  Dropdown as BsDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  DropdownProps as BsDropdownProps
} from "reactstrap";

export interface DropdownOption {
  id: number;
  label: string;
  onClick?: () => void;
}

interface DropdownProps extends BsDropdownProps {
  selectedOption: { label: string },
  options: DropdownOption[],
  onOptionSelected: (option: DropdownOption) => void
}

export const Dropdown = ({ selectedOption, options, onOptionSelected, ...dropdownProps }: DropdownProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <BsDropdown {...dropdownProps} isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle outline caret>
        {selectedOption.label}
      </DropdownToggle>
      <DropdownMenu>
        {options.map((option, index) => (
          <DropdownItem key={"option-" + index} onClick={() => onOptionSelected(option)}>{option.label}</DropdownItem>
        ))}
      </DropdownMenu>
    </BsDropdown>
  );
};
