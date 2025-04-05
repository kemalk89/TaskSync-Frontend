import { UserResponse } from "@app/api";

type UserNameProps = {
  user?: UserResponse;
};

export const UserName = ({ user }: UserNameProps) => {
  if (!user) {
    return null;
  }

  return (
    <div className="d-flex align-items-center">
      <img
        alt="user image"
        className="user-image rounded"
        width="32"
        height="32"
        src={user.picture}
      />
      <span className="ms-1">{user.username}</span>
    </div>
  );
};
