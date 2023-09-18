import { components } from "react-select";

export const CustomOption = ({ children, ...rest }: any) => {
  const option = rest.data;
  const renderIconIfExists = () => {
    if (option.icon) {
      return option.icon(option);
    }
    return null;
  };

  return (
    <div>
      <components.Option {...rest}>
        {renderIconIfExists()}
        {children}
      </components.Option>
    </div>
  );
};
