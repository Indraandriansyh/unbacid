const AUTH_KEY = "unb_admin_auth";

export interface AdminUser {
  id: number;
  username: string;
  role: "master" | "fakultas" | "prodi";
  scopeId: string | null;
  displayName: string;
}

export interface AuthSession {
  token: string;
  user: AdminUser;
}

export function saveSession(session: AuthSession) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
}

export function getSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(AUTH_KEY);
}

export function getToken(): string | null {
  return getSession()?.token ?? null;
}

export function authHeaders(): Record<string, string> {
  const token = getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
