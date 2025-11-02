import { Dropdown } from "react-bootstrap";
import { SelectOption } from "../select";
import styles from "./styles.module.css";
import { IconCheckSquare, IconSquare } from "../icons/icons";

export const SelectMulti = ({
  value = [],
  options = [],
  onSelect,
  onUnselect,
}: {
  value: SelectOption[];
  options: SelectOption[];
  onSelect: (value: SelectOption) => void;
  onUnselect: (value: SelectOption) => void;
}) => {
  const handleSelect = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    option: SelectOption
  ) => {
    event.stopPropagation();

    const isSelected = value.findIndex((o) => o.value === option.value) > -1;
    if (isSelected) {
      onUnselect(option);
    } else {
      onSelect(option);
    }
  };

  const handleUnselectBadge = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    option: SelectOption
  ) => {
    event.stopPropagation();

    onUnselect(option);
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
              {value.map((o) => (
                <div className={styles.badge} key={o.value}>
                  <div className={styles.badgeLabelWrapper}>{o.label}</div>
                  <div
                    className={styles.unselectBadgeControl}
                    onClick={(e) => handleUnselectBadge(e, o)}
                  >
                    x
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu className="w-100">
        {options.map((o) => (
          <Dropdown.Item
            key={o.value}
            onClick={(e) => handleSelect(e, o)}
            className="d-flex gap-2 align-items-center"
          >
            {value.find((v) => v.value === o.value) ? (
              <IconCheckSquare />
            ) : (
              <IconSquare />
            )}
            {o.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};
