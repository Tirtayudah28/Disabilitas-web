//fatir: UPDATE LOGIN/REGISTER
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(true);

  const getToken = async () => {
    try {
      const res = await axios.get("/api/auth/token");
      if (res.data.accessToken) {
        const decoded = jwtDecode(res.data.accessToken);
        setUserData({
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
        });
        setToken(res.data.accessToken);
      }
    } catch (err) {
      console.error("Token fetch error:", err);
      setToken(null);
      setUserData(null);
    } finally {
      setTokenLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUserData(null);
  };

  // initial get token
  useEffect(() => {
    if (token) return;
    getToken();
  }, [token]);

  useEffect(() => {
    if (!token || tokenLoading) return;

    const interval = setInterval(() => {
      getToken();
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token, tokenLoading]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        setUserData,
        userData,
        tokenLoading,
        getToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
