import { exportJWK, generateKeyPair } from "jose";

// Simulate an in-memory singleton
let publicJWK: any = null;
let privateKey: CryptoKey | null = null;

export async function getKeys() {
  if (!publicJWK || !privateKey) {
    const { publicKey, privateKey: privKey } = await generateKeyPair("RS256");
    privateKey = privKey;
    publicJWK = await exportJWK(publicKey);
    publicJWK.alg = "RS256";
    publicJWK.use = "sig";
    publicJWK.kid = "test-key-id";
  }
  return { publicJWK, privateKey };
}

export async function GET(request: Request) {
  const { publicJWK } = await getKeys();
  return Response.json({
    keys: [publicJWK],
  });
}
