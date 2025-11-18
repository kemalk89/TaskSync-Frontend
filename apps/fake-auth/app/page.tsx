"use client";

import { useState } from "react";
import { USER_ADMIN, USER_DEFAULT } from "./constants";

export default function Page() {
  const [token, setToken] = useState<string | null>(null);

  async function loadAccessToken(userId: string) {
    const response = await fetch(`oauth/token?custom_user_id=${userId}`, {
      method: "POST",
    });

    const { access_token } = await response.json();

    setToken(access_token);
  }

  async function loadAccessTokenForAdminUser() {
    await loadAccessToken(USER_ADMIN.id!);
  }

  async function loadAccessTokenForDefaultUser() {
    await loadAccessToken(USER_DEFAULT.id!);
  }

  return (
    <div>
      <h1>Fake Auth Server</h1>
      <button onClick={loadAccessTokenForDefaultUser}>
        Request Access Token For Default User
      </button>
      <button onClick={loadAccessTokenForAdminUser}>
        Request Access Token For Admin User
      </button>
      <h3>JWT:</h3>
      <pre style={{ whiteSpace: "normal" }} data-testid="accesstoken">
        {token}
      </pre>
    </div>
  );
}
