import { auth } from "../auth";

export default async function Page() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div>
      <img src={session.user.image ?? ""} alt="User Avatar" />
      <h2>{session.user.name}</h2>
      <p>{session.user.email}</p>
      <div>
        <h3>Access Token</h3>
        {session.accessToken}
      </div>
    </div>
  );
}
