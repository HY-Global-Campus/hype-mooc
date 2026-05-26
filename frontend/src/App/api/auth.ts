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
  state: string | null,
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${import.meta.env.VITE_API_URL}/auth/callback`,
    {
      code,
      code_verifier: codeVerifier,
      redirect_uri: redirectUri,
      state: state ?? undefined,
    },
  );
  return response.data;
};

export const devLogin = async (): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${import.meta.env.VITE_API_URL}/auth/dev`,
  );
  return response.data;
};
