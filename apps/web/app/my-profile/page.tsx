import Image from "next/image";
import { auth } from "../auth";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();

  if (!session?.user) return {};

  return {
    title: `Profile: ${session.user.name}`,
  };
}

export default async function Page() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div>
      <Image
        src={session.user.image ?? ""}
        alt="User Avatar"
        width={70}
        height={70}
      />
      <h2>{session.user.name}</h2>
      <p>{session.user.email}</p>
      <div>
        <h3>Access Token</h3>
        {session.accessToken}
      </div>
    </div>
  );
}
