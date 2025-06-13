"use client";

import { useState } from "react";

export default function Page() {
  const [token, setToken] = useState<string | null>(null);

  async function loadAccessToken() {
    const response = await fetch("oauth/token", {
      method: "POST",
    });

    const { access_token } = await response.json();

    setToken(access_token);
  }

  return (
    <div>
      <h1>Fake Auth Server</h1>
      <button onClick={loadAccessToken}>Request Access Token</button>
      <h3>JWT:</h3>
      <pre style={{ whiteSpace: "normal" }} data-testid="accesstoken">
        {token}
      </pre>
    </div>
  );
}
