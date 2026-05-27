import { CSSProperties, useCallback, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { generatePKCE, generateRandomString } from '../utils/pkce';
import borealforest from '../../assets/HY_Serendip-BOREALFOREST.jpg';
import { devLogin } from '../api/auth';
import { setAuthToken } from '../utils/auth';

const OIDC_AUTHORIZE_URL =
  'https://courses.mooc.fi/api/v0/main-frontend/oauth/authorize';

const wrapperStyle: CSSProperties = {
  background: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${borealforest}) no-repeat center center fixed`,
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
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(4px)',
  padding: '60px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  position: 'relative',
  zIndex: 1,
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

const devButtonStyle: CSSProperties = {
  ...buttonStyle,
  backgroundColor: 'transparent',
  color: '#666',
  border: '2px solid #999',
  marginTop: '16px',
};

const errorStyle: CSSProperties = {
  color: '#f44336',
  marginTop: '12px',
  fontSize: '14px',
};

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
const devAuthBypassEnabled = import.meta.env.VITE_DEV_AUTH_BYPASS === 'true';

const Login: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const from = (location.state as { from: Location })?.from?.pathname || '/';
  const [error, setError] = useState('');
  const [devLoading, setDevLoading] = useState(false);

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
      scope: 'openid offline_access',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state,
    });

    window.location.href = `${OIDC_AUTHORIZE_URL}?${params}`;
  }, [from]);

  if (DEMO_MODE) {
    return <Navigate to="/" replace />;
  }

  const startDevLogin = async () => {
    setError('');
    setDevLoading(true);
    try {
      const data = await devLogin();
      const ok = setAuthToken(data.token, data.displayName, String(data.id));
      if (!ok) {
        setError('Login succeeded but session could not be created. Please try again.');
        return;
      }
      navigate(from, { replace: true });
    } catch {
      setError('Dev login failed. Is DEV_AUTH_BYPASS enabled on the backend?');
    } finally {
      setDevLoading(false);
    }
  };

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        <h1>Login</h1>
        <p>Sign in with your MOOC.fi account to continue.</p>
        <button type="button" onClick={handleLogin} className="login-btn">
          Log in with MOOC.fi
        </button>
        {devAuthBypassEnabled && (
          <button
            type="button"
            onClick={startDevLogin}
            className="login-btn-dev"
            disabled={devLoading}
          >
            {devLoading ? 'Signing in…' : 'Dev login (local only)'}
          </button>
        )}
        {error && <p style={errorStyle}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
