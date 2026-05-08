const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const AUTH_EXPIRY_KEY = 'auth_expiry';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const expiry = localStorage.getItem(AUTH_EXPIRY_KEY);
  if (expiry && new Date().getTime() > parseInt(expiry, 10)) {
    clearAuthTokens();
    return null;
  }
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthTokens(accessToken: string, refreshToken: string, expiresIn?: number) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  if (expiresIn) {
    localStorage.setItem(AUTH_EXPIRY_KEY, String(new Date().getTime() + expiresIn * 1000));
  }
}

export function clearAuthTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(AUTH_EXPIRY_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
