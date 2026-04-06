import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearAuthSession,
  getStoredToken,
  getStoredUser,
  setAuthSession,
} from "../utils/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    if ((token && !user) || (!token && user)) {
      clearAuthSession();
      setToken(null);
      setUser(null);
    }
  }, [token, user]);

  const login = (payload) => {
    const nextUser = {
      _id: payload._id,
      name: payload.name,
      email: payload.email,
    };

    setAuthSession({ token: payload.token, user: nextUser });
    setToken(payload.token);
    setUser(nextUser);
  };

  const logout = () => {
    clearAuthSession();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
