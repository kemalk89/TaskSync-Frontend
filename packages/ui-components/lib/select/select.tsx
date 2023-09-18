import { ReactNode } from "react";
import ReactSelect, { ActionMeta, SingleValue, MultiValue } from "react-select";
import { SingleValue as SingleValueComponent } from "./custom-components/single-value";
import { CustomOption } from "./custom-components/custom-option";

export type SelectOption = {
  value: string;
  label: string;
  icon?: (option: SelectOption) => ReactNode;
};

interface SelectProps {
  options: SelectOption[];
  value?: SelectOption;
  defaultValue?: SelectOption;
  onChange: (
    newValue: SelectOption,
    actionMeta: ActionMeta<SelectOption>
  ) => void;
}

export function Select({
  options,
  defaultValue,
  value,
  onChange,
}: SelectProps) {
  const handleChange = (
    newValue: SingleValue<SelectOption> | MultiValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>
  ) => {
    onChange(newValue as SelectOption, actionMeta);
  };

  return (
    <ReactSelect
      isSearchable={false}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      components={{
        SingleValue: SingleValueComponent,
        Option: CustomOption,
      }}
      options={options}
    />
  );
}
