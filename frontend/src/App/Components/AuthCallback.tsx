import { CSSProperties, useEffect, useRef, useState } from 'react';
import './components.css';
import { useNavigate } from 'react-router-dom';
import { exchangeCode } from '../api/auth';
import borealforest from '../../assets/HY_Serendip-BOREALFOREST.jpg';

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

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const exchanged = useRef(false);

  useEffect(() => {
    if (exchanged.current) return;
    exchanged.current = true;

    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const returnedState = params.get('state');
      const errorParam = params.get('error');

      if (errorParam) {
        setError(`Login was denied: ${errorParam}`);
        return;
      }

      const savedState = sessionStorage.getItem('oauth_state');
      if (!returnedState || returnedState !== savedState) {
        setError('Invalid OAuth state — possible CSRF attack. Please try again.');
        return;
      }

      if (!code) {
        setError('No authorization code received.');
        return;
      }

      const codeVerifier = sessionStorage.getItem('pkce_code_verifier');
      if (!codeVerifier) {
        setError('Missing PKCE code verifier. Please try logging in again.');
        return;
      }

      const redirectUri = `${window.location.origin}/auth/callback`;

      try {
        const data = await exchangeCode(code, codeVerifier, redirectUri, returnedState);

        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('displayName', data.displayName);
        sessionStorage.setItem('id', data.id);

        const returnTo = sessionStorage.getItem('oauth_return_to') || '/';

        sessionStorage.removeItem('pkce_code_verifier');
        sessionStorage.removeItem('oauth_state');
        sessionStorage.removeItem('oauth_return_to');

        navigate(returnTo, { replace: true });
      } catch (err) {
        console.error('Code exchange failed:', err);
        setError('Login failed. Please try again.');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        {error ? (
          <>
            <p style={{ color: 'red' }}>{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="auth-retry-btn"
            >
              Try again
            </button>
          </>
        ) : (
          <p>Completing login...</p>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
