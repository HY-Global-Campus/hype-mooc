import * as jose from 'jose';
import crypto from 'node:crypto';

type SigningKey = jose.CryptoKey | jose.KeyObject;

const ALG = 'ES256';

export interface DPoPKeyPair {
  privateKey: SigningKey;
  publicJwk: jose.JWK;
}

export async function generateDPoPKeyPair(): Promise<DPoPKeyPair> {
  const { privateKey, publicKey } = await jose.generateKeyPair(ALG);
  const publicJwk = await jose.exportJWK(publicKey);
  return { privateKey, publicJwk };
}

/**
 * Creates a DPoP proof JWT per RFC 9449.
 *
 * @param privateKey  - The ephemeral private key used for signing.
 * @param publicJwk   - The corresponding public key as JWK (embedded in the header).
 * @param htm         - HTTP method of the request the proof is for (e.g. "POST", "GET").
 * @param htu         - HTTP URL of the request (scheme + authority + path, no query/fragment).
 * @param accessToken - If provided, the `ath` claim (base64url SHA-256 of the token) is included.
 *                      Required when presenting to a resource server, omitted for the token endpoint.
 */
export async function createDPoPProof(
  privateKey: SigningKey,
  publicJwk: jose.JWK,
  htm: string,
  htu: string,
  accessToken?: string,
): Promise<string> {
  const payload: jose.JWTPayload = {
    jti: crypto.randomUUID(),
    htm,
    htu,
    iat: Math.floor(Date.now() / 1000),
  };

  if (accessToken) {
    const hash = crypto.createHash('sha256').update(accessToken).digest();
    payload.ath = jose.base64url.encode(hash);
  }

  return new jose.SignJWT(payload)
    .setProtectedHeader({ typ: 'dpop+jwt', alg: ALG, jwk: publicJwk })
    .sign(privateKey);
}
