import axios from 'axios';

interface AuthResponse {
  token: string;
  displayName: string;
  id: string;
}

export const exchangeCode = async (
  code: string,
  codeVerifier: string,
  redirectUri: string,
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${import.meta.env.VITE_API_URL}/auth/callback`,
    {
      code,
      code_verifier: codeVerifier,
      redirect_uri: redirectUri,
    },
  );
  return response.data;
};
