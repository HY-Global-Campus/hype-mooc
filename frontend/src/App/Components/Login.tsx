import { CSSProperties, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { generatePKCE, generateRandomString } from '../utils/pkce';
import borealforest from '../../assets/HY_Serendip-BOREALFOREST.jpg';

const OIDC_AUTHORIZE_URL =
  'https://courses.mooc.fi/api/v0/main-frontend/oauth/authorize';

const wrapperStyle: CSSProperties = {
  background: `url(${borealforest}) no-repeat center center fixed`,
  backgroundSize: 'cover',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  minHeight: 0,
  position: 'relative',
};

const containerStyle: CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  padding: '60px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
};

const buttonStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '12px 24px',
  marginTop: '20px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
};

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

const Login: React.FC = () => {
  const location = useLocation();
  const from = (location.state as { from: Location })?.from?.pathname || '/';

  if (DEMO_MODE) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = useCallback(async () => {
    const { codeVerifier, codeChallenge } = await generatePKCE();
    const state = generateRandomString(16);

    sessionStorage.setItem('pkce_code_verifier', codeVerifier);
    sessionStorage.setItem('oauth_state', state);
    sessionStorage.setItem('oauth_return_to', from);

    const redirectUri = `${window.location.origin}/auth/callback`;

    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state,
    });

    window.location.href = `${OIDC_AUTHORIZE_URL}?${params}`;
  }, [from]);

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        <h1>Login</h1>
        <p>Sign in with your MOOC.fi account to continue.</p>
        <button type="button" onClick={handleLogin} style={buttonStyle}>
          Log in with MOOC.fi
        </button>
      </div>
    </div>
  );
};

export default Login;
