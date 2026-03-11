import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  exp?: number;
}

export const getTokenExpiration = (token: string): number | null => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    if (decoded.exp === undefined) return null;
    return decoded.exp * 1000;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const expirationTime = getTokenExpiration(token);
  if (expirationTime === null) return true;
  return Date.now() > expirationTime;
};
