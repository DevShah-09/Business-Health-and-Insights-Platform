/**
 * authService.js — API calls for authentication
 */
import api from './api';

/**
 * Register a new user.
 * @returns {{ access_token: string, token_type: string }}
 */
export async function registerUser(email, fullName, password) {
  const { data } = await api.post('/api/v1/auth/register', {
    email,
    full_name: fullName,
    password,
  });
  return data;
}

/**
 * Login with email + password.
 * The backend expects OAuth2 form‑encoded data.
 * @returns {{ access_token: string, token_type: string }}
 */
export async function loginUser(email, password) {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);

  const { data } = await api.post('/api/v1/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return data;
}

