import { User } from "@auth0/auth0-react";

type UserNameProps = {
  user?: User
}

export const UserName = ({ user }: UserNameProps) => {
  if (!user) {
    return null;
  }

  return (
    <>
      <img alt="user" className="user-image rounded" src={user.picture} />{" "}
      <span>{user.username}</span>
    </>
  );
};
