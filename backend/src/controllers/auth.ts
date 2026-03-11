import express from 'express';
import axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';
import config from '../config.js';
import User from '../models/user.js';
import { UserTokenForm } from '../types/user.js';
import { generateDPoPKeyPair, createDPoPProof } from '../utils/dpop.js';

const authRouter = express.Router();

const OIDC_TOKEN_URL =
  'https://courses.mooc.fi/api/v0/main-frontend/oauth/token';
const OIDC_USERINFO_URL =
  'https://courses.mooc.fi/api/v0/main-frontend/oauth/userinfo';

authRouter.post('/callback', async (req, res) => {
  const { code, code_verifier, redirect_uri } = req.body;

  if (!code || !code_verifier || !redirect_uri) {
    res.status(400).json({ error: 'Missing code, code_verifier, or redirect_uri' });
    return;
  }

  try {
    const { privateKey, publicJwk } = await generateDPoPKeyPair();

    const tokenDPoPProof = await createDPoPProof(
      privateKey, publicJwk, 'POST', OIDC_TOKEN_URL,
    );

    const tokenParams: Record<string, string> = {
      grant_type: 'authorization_code',
      code,
      redirect_uri,
      client_id: config.OIDC_CLIENT_ID,
      code_verifier,
    };
    if (config.OIDC_CLIENT_SECRET) {
      tokenParams.client_secret = config.OIDC_CLIENT_SECRET;
    }

    const tokenResponse = await axios.post(
      OIDC_TOKEN_URL,
      new URLSearchParams(tokenParams),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          DPoP: tokenDPoPProof,
        },
      },
    );

    const { access_token } = tokenResponse.data;

    const userinfoDPoPProof = await createDPoPProof(
      privateKey, publicJwk, 'GET', OIDC_USERINFO_URL, access_token,
    );

    const userInfoResponse = await axios.get(OIDC_USERINFO_URL, {
      headers: {
        Authorization: `DPoP ${access_token}`,
        DPoP: userinfoDPoPProof,
      },
    });

    const { sub, name, email } = userInfoResponse.data;
    if (!sub) {
      res.status(502).json({ error: 'OIDC provider did not return a subject identifier' });
      return;
    }

    let user = await User.findOne({ where: { accelbyteUserId: sub } });

    if (!user) {
      user = await User.create({
        displayName: name || email || sub,
        accelbyteUserId: sub,
        isAdmin: false,
      });
    } else {
      const updatedName = name || email;
      if (updatedName && updatedName !== user.displayName) {
        await user.update({ displayName: updatedName });
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
    if (axios.isAxiosError(error)) {
      console.error('OIDC token exchange failed:', error.response?.data || error.message);
      res.status(502).json({ error: 'Authentication with OIDC provider failed' });
      return;
    }
    console.error('Auth callback error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
});

export default authRouter;
