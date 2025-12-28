import { Dropdown, DropdownItemProps } from "react-bootstrap";
import { PropsWithChildren, ReactNode } from "react";

import styles from "./styles.module.css";

type Props = {
  button: ReactNode;
} & PropsWithChildren;

export const MoreMenu = ({ button, children }: Props) => {
  return (
    <Dropdown>
      <Dropdown.Toggle className={styles.toggle} variant="light">
        {button}
      </Dropdown.Toggle>

      <Dropdown.Menu>{children}</Dropdown.Menu>
    </Dropdown>
  );
};

export const MoreMenuItem = ({
  children,
  ...rest
}: DropdownItemProps & { target?: "_blank" }) => (
  <Dropdown.Item {...rest}>{children}</Dropdown.Item>
);

export const MoreMenuItemDivider = () => <Dropdown.Divider />;
