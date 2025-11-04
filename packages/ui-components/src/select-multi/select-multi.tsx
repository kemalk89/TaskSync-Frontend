import { Dropdown } from "react-bootstrap";
import { SelectOption } from "../select";
import styles from "./styles.module.css";
import { SelectMultiDropdownMenu } from "../components/select-multi-dropdown-menu/select-multi-dropdown-menu";

export const SelectMulti = ({
  value = [],
  options = [],
  onSelect,
  onUnselect,
}: {
  value: string[];
  options: SelectOption[];
  onSelect: (value: string) => void;
  onUnselect: (value: string) => void;
}) => {
  const handleSelect = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    optionId: string
  ) => {
    event.stopPropagation();

    const isSelected = value.findIndex((id) => id === optionId) > -1;
    if (isSelected) {
      onUnselect(optionId);
    } else {
      onSelect(optionId);
    }
  };

  const handleUnselectBadge = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    id: string
  ) => {
    event.stopPropagation();

    onUnselect(id);
  };

  const findLabelById = (id: string) => {
    return options.find((item) => id === item.value);
  };

  return (
    <Dropdown className={styles.dropdown}>
      <Dropdown.Toggle
        id="dropdown-basic"
        className={["form-control", styles.dropdownToggle].join(" ")}
        style={{ textAlign: "left" }}
      >
        <div className={styles.inputControlContainer}>
          {value.length === 0 ? (
            <div className={styles.placeholderText}>Select...</div>
          ) : (
            <div
              className={[styles.width, "d-flex", "flex-wrap", "gap-2"].join(
                " "
              )}
            >
              {value.map((id) => (
                <div className={styles.badge} key={id}>
                  <div className={styles.badgeLabelWrapper}>
                    {findLabelById(id)?.label}
                  </div>
                  <div
                    className={styles.unselectBadgeControl}
                    onClick={(e) => handleUnselectBadge(e, id)}
                  >
                    x
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Dropdown.Toggle>

      <SelectMultiDropdownMenu
        className="w-100"
        options={options}
        selectedOptions={value}
        onSelect={handleSelect}
      />
    </Dropdown>
  );
};
