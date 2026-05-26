import express from 'express';
import * as oidc from 'openid-client';
import jsonwebtoken from 'jsonwebtoken';
import config, { isDevAuthBypassEnabled } from '../config.js';
import User from '../models/user.js';
import { UserTokenForm } from '../types/user.js';

const authRouter = express.Router();

let cachedConfig: oidc.Configuration | null = null;

function createLoggingFetch(realFetch: typeof fetch): typeof fetch {
  return async (input: URL | Request | string, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const method = init?.method ?? 'GET';
    const headers: Record<string, string> = {};
    if (init?.headers) {
      if (init.headers instanceof Headers) {
        init.headers.forEach((v, k) => { headers[k] = v; });
      } else if (Array.isArray(init.headers)) {
        for (const [k, v] of init.headers) headers[k] = String(v);
      } else {
        Object.assign(headers, init.headers);
      }
    }
    let bodyLog: string;
    if (init?.body == null) {
      bodyLog = '(none)';
    } else if (typeof init.body === 'string') {
      bodyLog = init.body;
    } else {
      bodyLog = `(<${typeof init.body}>)`;
    }
    console.log('[OIDC REQUEST]', method, url);
    console.log('[OIDC REQUEST HEADERS]', JSON.stringify(headers, null, 2));
    console.log('[OIDC REQUEST BODY]', bodyLog);

    const response = await realFetch(input, init);
    const responseText = await response.text();
    console.log('[OIDC RESPONSE]', response.status, response.statusText, url);
    console.log('[OIDC RESPONSE HEADERS]', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));
    console.log('[OIDC RESPONSE BODY]', responseText);

    if (response.ok && responseText.trim().startsWith('{')) {
      try {
        const data = JSON.parse(responseText) as { id_token?: string };
        if (data.id_token) {
          const parts = data.id_token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(
              Buffer.from(parts[1], 'base64url').toString('utf8'),
            ) as Record<string, unknown>;
            console.log('[OIDC ID_TOKEN PAYLOAD]', JSON.stringify(payload, null, 2));
          }
        }
      } catch {
        // ignore parse errors
      }
    }

    return new Response(responseText, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  };
}

async function getOIDCConfig(): Promise<oidc.Configuration> {
  if (cachedConfig) return cachedConfig;
  const server = new URL(config.OIDC_ISSUER_URL);
  const clientAuth = config.OIDC_CLIENT_SECRET
    ? oidc.ClientSecretPost(config.OIDC_CLIENT_SECRET)
    : oidc.None();
  const options: oidc.DiscoveryRequestOptions = {
    [oidc.customFetch]: createLoggingFetch(globalThis.fetch),
  };
  if (server.protocol === 'http:') {
    options.execute = [oidc.allowInsecureRequests];
  }
  cachedConfig = await oidc.discovery(
    server,
    config.OIDC_CLIENT_ID,
    undefined,
    clientAuth,
    options,
  );
  return cachedConfig;
}

function logOIDCError(error: unknown): void {
  const err = error as Error & {
    cause?: Record<string, unknown> | unknown;
    status?: number;
    error?: string;
    error_description?: string;
    code?: string;
  };
  console.error('OIDC error:', err.message);
  if (err.name === 'ResponseBodyError') {
    console.error('  Token endpoint error:', {
      status: err.status,
      error: err.error,
      error_description: err.error_description,
    });
    return;
  }
  if (err.cause != null && typeof err.cause === 'object') {
    const c = err.cause as Record<string, unknown>;
    console.error('  cause (full):', JSON.stringify(c, null, 2));
    for (const key of Object.getOwnPropertyNames(c)) {
      console.error(`  cause.${key}:`, (c as Record<string, unknown>)[key]);
    }
    if (c.claim != null) console.error('  failing claim:', c.claim);
    if (c.expected !== undefined) console.error('  expected:', c.expected);
    if (c.actual !== undefined) console.error('  actual:', c.actual);
    if (c.claims != null) console.error('  token claims:', JSON.stringify(c.claims, null, 2));
    const nested = (c as { cause?: Record<string, unknown> }).cause;
    if (nested != null && typeof nested === 'object') {
      console.error('  cause.cause:', JSON.stringify(nested, null, 2));
      if (nested.claim != null) console.error('  cause.cause.claim:', nested.claim);
      if (nested.expected !== undefined) console.error('  cause.cause.expected:', nested.expected);
      if (nested.claims != null) console.error('  cause.cause.claims:', JSON.stringify(nested.claims, null, 2));
    }
  }
  if (err.code != null) console.error('  code:', err.code);
}

const DEV_USER_ID = 'dev-local';

authRouter.post('/dev', async (req, res) => {
  if (!isDevAuthBypassEnabled()) {
    res.status(404).end();
    return;
  }

  try {
    let user = await User.findOne({ where: { accelbyteUserId: DEV_USER_ID } });

    if (!user) {
      user = await User.create({
        displayName: 'Dev User',
        accelbyteUserId: DEV_USER_ID,
        isAdmin: false,
      });
    }

    const userForToken: UserTokenForm = {
      displayName: user.displayName,
      id: user.id.toString(),
      isAdmin: user.isAdmin || false,
    };

    const token = jsonwebtoken.sign(userForToken, config.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({
      token,
      displayName: user.displayName,
      id: user.id,
    });
  } catch (error) {
    logOIDCError(error);
    res.status(500).json({ error: 'Dev login failed' });
  }
});

authRouter.post('/callback', async (req, res) => {
  const { code, code_verifier, redirect_uri, state } = req.body;

  console.log('[AUTH CALLBACK] Incoming request body:', JSON.stringify({
    code,
    code_verifier,
    redirect_uri,
    state,
  }, null, 2));

  if (!code || !code_verifier || !redirect_uri) {
    res.status(400).json({ error: 'Missing code, code_verifier, or redirect_uri' });
    return;
  }

  try {
    const oidcConfig = await getOIDCConfig();

    const callbackUrl = new URL(redirect_uri);
    callbackUrl.searchParams.set('code', code);
    if (state != null && state !== '') {
      callbackUrl.searchParams.set('state', String(state));
    }
    console.log('[AUTH CALLBACK] Constructed callback URL for library:', callbackUrl.href);

    const dpopKeyPair = await oidc.randomDPoPKeyPair('ES256');
    const DPoP = oidc.getDPoPHandle(oidcConfig, dpopKeyPair);

    const tokens = await oidc.authorizationCodeGrant(
      oidcConfig,
      callbackUrl,
      {
        pkceCodeVerifier: code_verifier,
        expectedState: state != null && state !== '' ? state : undefined,
      },
      undefined,
      { DPoP },
    );

    const accessToken = tokens.access_token;
    if (!accessToken) {
      res.status(502).json({ error: 'OIDC provider did not return an access token' });
      return;
    }

    const userInfo = await oidc.fetchUserInfo(
      oidcConfig,
      accessToken,
      oidc.skipSubjectCheck,
      { DPoP },
    );

    const sub = userInfo.sub;
    if (!sub) {
      res.status(502).json({ error: 'OIDC provider did not return a subject identifier' });
      return;
    }

    const name = userInfo.name ?? userInfo.email ?? sub;

    let user = await User.findOne({ where: { accelbyteUserId: sub } });

    if (!user) {
      user = await User.create({
        displayName: name,
        accelbyteUserId: sub,
        isAdmin: false,
      });
    } else {
      if (name !== user.displayName) {
        await user.update({ displayName: name });
      }
    }

    const userForToken: UserTokenForm = {
      displayName: user.displayName,
      id: user.id.toString(),
      isAdmin: user.isAdmin || false,
    };

    const token = jsonwebtoken.sign(userForToken, config.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({
      token,
      displayName: user.displayName,
      id: user.id,
    });
  } catch (error) {
    logOIDCError(error);
    res.status(502).json({ error: 'Authentication with OIDC provider failed' });
  }
});

export default authRouter;
