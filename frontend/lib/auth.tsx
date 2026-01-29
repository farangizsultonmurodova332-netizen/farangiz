"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { API_URL, authRequest, publicRequest } from "./api";
import type { User } from "./types";

// Helper function to get browser info
function getBrowserInfo(): string {
  if (typeof window === "undefined") return "Web Browser";

  const ua = navigator.userAgent;
  let browserName = "Browser";
  let osName = "Unknown OS";

  // Detect browser
  if (ua.includes("Firefox")) browserName = "Firefox";
  else if (ua.includes("Edg")) browserName = "Edge";
  else if (ua.includes("Chrome")) browserName = "Chrome";
  else if (ua.includes("Safari")) browserName = "Safari";
  else if (ua.includes("Opera") || ua.includes("OPR")) browserName = "Opera";

  // Detect OS
  if (ua.includes("Windows")) osName = "Windows";
  else if (ua.includes("Mac")) osName = "macOS";
  else if (ua.includes("Linux")) osName = "Linux";
  else if (ua.includes("Android")) osName = "Android";
  else if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) osName = "iOS";

  return `${browserName} on ${osName}`;
}

// Generate unique device ID for web
function generateDeviceId(): string {
  if (typeof window === "undefined") return "server";

  // Check if we already have a device ID in localStorage
  const existingId = localStorage.getItem("web_device_id");
  if (existingId) return existingId;

  // Generate new ID
  const newId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  localStorage.setItem("web_device_id", newId);
  return newId;
}

type AuthContextValue = {
  accessToken: string | null;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    birthDate: string,
    phone: string,
    location: string,
    portfolioFile: File
  ) => Promise<void>;
  logout: () => Promise<void>;
  apiFetch: <T>(path: string, options?: RequestInit) => Promise<T>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) throw new Error("No refresh token");

      const data = await publicRequest<{ access: string }>("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refresh: refreshToken }),
      });
      setAccessToken(data.access);
      return data.access;
    } catch (error) {
      // Only logout if it's an auth error (401) or invalid token
      // For network errors, we might want to retry or keep the user logged in potentially
      // But simple-jwt returns 401 if refresh is invalid.
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem("refresh_token");
      return null;
    }
  };

  const loadMe = async (token?: string | null) => {
    try {
      const data = await authRequest<User>(
        "/auth/me",
        { method: "GET", accessToken: token || accessToken },
        refreshAccessToken
      );
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshAccessToken().then((token) => {
      if (token) {
        loadMe(token);
      }
    });
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    const interval = setInterval(() => {
      loadMe(accessToken);
    }, 30000);
    return () => clearInterval(interval);
  }, [accessToken]);

  // WebSocket for immediate remote logout
  useEffect(() => {
    let ws: WebSocket | null = null;
    let isMounted = true;

    const connectWs = () => {
      if (!accessToken || !user || !isMounted) return;

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      let host = window.location.host;
      try {
        host = new URL(API_URL).host;
      } catch { }

      const wsUrl = `${protocol}//${host}`;
      ws = new WebSocket(`${wsUrl}/ws/user/?token=${accessToken}`);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "device_terminated") {
            const currentDeviceId = `web-${generateDeviceId()}`;
            if (data.device_id === currentDeviceId) {
              logout();
            }
          }
        } catch { }
      };

      ws.onclose = () => {
        if (isMounted && accessToken) {
          setTimeout(connectWs, 3000);
        }
      };
    };

    if (accessToken && user) {
      connectWs();
    }

    return () => {
      isMounted = false;
      ws?.close();
    };
  }, [accessToken, user]);

  const login = async (username: string, password: string) => {
    const data = await publicRequest<{ access: string; refresh?: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password, include_refresh: true }),
    });

    setAccessToken(data.access);
    if (data.refresh) {
      localStorage.setItem("refresh_token", data.refresh);
    }

    await loadMe(data.access);

    // Register web device with refresh token for remote logout capability
    try {
      const browserInfo = getBrowserInfo();
      await authRequest("/devices", {
        method: "POST",
        accessToken: data.access,
        body: JSON.stringify({
          device_id: `web-${generateDeviceId()}`,
          device_name: browserInfo,
          refresh_token: data.refresh || "",
        }),
      }, refreshAccessToken);
    } catch {
      // Ignore device registration errors
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    birthDate: string,
    phone: string,
    location: string,
    portfolioFile: File
  ) => {
    const data = new FormData();
    data.append("username", username);
    data.append("email", email);
    data.append("password", password);
    data.append("birth_date", birthDate);
    data.append("phone", phone);
    data.append("location", location);
    data.append("portfolio_file", portfolioFile);
    await publicRequest("/auth/register", {
      method: "POST",
      body: data,
    });
    await login(username, password);
  };

  const logout = async () => {
    // Deactivate current device before logging out
    try {
      const deviceId = `web-${generateDeviceId()}`;
      await authRequest("/devices/deactivate", {
        method: "POST",
        accessToken,
        body: JSON.stringify({ device_id: deviceId }),
      }, refreshAccessToken);
    } catch {
      // Ignore device deactivation errors
    }
    try {
      await publicRequest("/auth/logout", { method: "POST" });
    } catch {
      // Ignore logout errors and clear client state anyway.
    }
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("refresh_token");
  };

  const apiFetch = async <T,>(path: string, options: RequestInit = {}) => {
    return authRequest<T>(
      path,
      { ...options, accessToken },
      refreshAccessToken
    );
  };

  const value = useMemo(
    () => ({ accessToken, user, login, register, logout, apiFetch }),
    [accessToken, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
