import { UserResponse } from "@app/api";
import { UserImage } from "./user-img";

type UserNameProps = {
  user?: UserResponse;
};

export const UserName = ({ user }: UserNameProps) => {
  if (!user) {
    return null;
  }

  return (
    <div className="d-flex align-items-center">
      <UserImage user={user} />
      <span className="ms-1">{user.username}</span>
    </div>
  );
};
