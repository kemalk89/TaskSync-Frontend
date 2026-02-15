import Link from "next/link";

export function SignIn() {
  return (
    <Link className="btn btn-primary" href="/api/auth/signin">
      Sign In
    </Link>
  );
}
