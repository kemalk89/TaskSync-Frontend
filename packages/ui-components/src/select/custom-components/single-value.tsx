import { SingleValueProps, components } from "react-select";
import { SelectOption } from "../select";

export const SingleValue = ({
  children,
  ...props
}: SingleValueProps<SelectOption>) => {
  const option = props.data;
  const renderIconIfExists = () => {
    if (option.icon) {
      return option.icon(option);
    }
    return null;
  };

  return (
    <components.SingleValue {...props}>
      {renderIconIfExists()} {children}
    </components.SingleValue>
  );
};
