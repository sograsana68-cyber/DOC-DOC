import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getStoredToken, setStoredToken } from "../api/client.js";
import * as authApi from "../api/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(() => !getStoredToken());

  useEffect(() => {
    const t = getStoredToken();
    if (!t) {
      setReady(true);
      return;
    }
    let cancelled = false;
    authApi
      .fetchCurrentUser()
      .then((data) => {
        if (!cancelled) {
          setUser(data.user);
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStoredToken(null);
          setTokenState(null);
          setUser(null);
          setReady(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setToken = useCallback((newToken, userPayload) => {
    setStoredToken(newToken);
    setTokenState(newToken);
    setUser(userPayload ?? null);
  }, []);

  const logout = useCallback(() => {
    setStoredToken(null);
    setTokenState(null);
    setUser(null);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const data = await authApi.login(email, password);
      setToken(data.token, data.user);
      return data;
    },
    [setToken]
  );

  const value = useMemo(
    () => ({
      token,
      user,
      ready,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, user, ready, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
