import { Button } from "react-bootstrap";
import { signIn } from "../auth";

type Props = {
  provider: "auth0";
};

export function SignIn({ provider }: Props) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider);
      }}
    >
      {provider === "auth0" ? (
        <Button type="submit">Signin with Auth0</Button>
      ) : null}
    </form>
  );
}
