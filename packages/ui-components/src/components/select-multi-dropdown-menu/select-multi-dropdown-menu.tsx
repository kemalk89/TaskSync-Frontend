import { Dropdown } from "react-bootstrap";
import { IconCheckSquare, IconSquare } from "../../icons/icons";
import { SelectOption } from "../../select";

type Props = {
  className?: string;
  options: SelectOption[];
  selectedOptions: string[];
  onSelect: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    optionId: string
  ) => void;
};

export const SelectMultiDropdownMenu = ({
  options,
  selectedOptions,
  onSelect,
  className = "",
}: Props) => {
  const isSelected = (optionId: string) => {
    return selectedOptions.find((id) => id === optionId);
  };

  return (
    <Dropdown.Menu className={className}>
      {options.map((o) => (
        <Dropdown.Item
          key={o.value}
          onClick={(e) => onSelect(e, o.value)}
          className="d-flex gap-2 align-items-center"
        >
          {isSelected(o.value) ? <IconCheckSquare /> : <IconSquare />}
          {o.renderOption ? o.renderOption(o) : o.label}
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
  );
};
