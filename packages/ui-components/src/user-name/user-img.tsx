import { UserResponse } from "@app/api";
import styles from "./styles.module.css";

type Props = {
  user?: UserResponse;
};

export const UserImage = ({ user }: Props) => {
  const fallbackText = user?.username?.substring(0, 2).toUpperCase() || "--";

  return user?.picture ? (
    <img
      alt="user image"
      className="user-image rounded"
      width="32"
      height="32"
      src={user?.picture}
    />
  ) : (
    <span className={styles.fallbackAvatar}>{fallbackText}</span>
  );
};
