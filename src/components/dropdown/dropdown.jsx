import { useState } from "react";
import {
  Dropdown as BsDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

export const Dropdown = ({ selectedOption, options, onOptionSelected, ...dropdownProps }) => {
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
