
export const logout = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('displayName');
  sessionStorage.removeItem('id');
};

const isValidJWT = (token: string | undefined | null): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  const parts = token.split('.');
  return parts.length === 3 && parts.every((part) => part.length > 0);
};

export const setAuthToken = (
  token: string | undefined,
  displayName: string | undefined,
  id: string | undefined,
): boolean => {
  if (!token || !displayName || !id) {
    return false;
  }

  if (!isValidJWT(token)) {
    return false;
  }

  sessionStorage.setItem('token', token);
  sessionStorage.setItem('displayName', displayName);
  sessionStorage.setItem('id', id);
  return true;
};
