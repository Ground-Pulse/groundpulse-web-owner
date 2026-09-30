import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { JwtPayload, User, AuthTokens } from "./auth-types";

const ACCESS_TOKEN_COOKIE = "gp_access_token";
const REFRESH_TOKEN_KEY = "gp_refresh_token_temp";
const USER_INFO_KEY = "gp_user_info";

// In-memory token storage (held during active React app lifecycle)
let inMemoryAccessToken: string | null = null;

export function setMemoryAccessToken(token: string | null) {
  inMemoryAccessToken = token;
}

export function getMemoryAccessToken(): string | null {
  return inMemoryAccessToken;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
    return null;
  }
}

export function extractUserFromToken(token: string, fallbackName?: string): User | null {
  const payload = decodeJwt(token);
  if (!payload) return null;

  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
    name: payload.name || fallbackName || payload.email.split("@")[0],
  };
}

/**
 * Persist tokens on successful auth.
 * - Access token is stored in memory and synced to cookie for Next.js middleware
 * - Refresh token is stored in localStorage as temporary placeholder
 */
export function saveAuthSession(tokens: AuthTokens, userFallbackName?: string): User | null {
  const { accessToken, refreshToken } = tokens;

  // 1. Store accessToken in memory
  setMemoryAccessToken(accessToken);

  // 2. TEMPORARY: Store refreshToken in localStorage (swap to httpOnly cookie before production)
  if (typeof window !== "undefined") {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  // 3. Set cookie for middleware route protection
  Cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  // 4. Decode payload to extract user
  const user = extractUserFromToken(accessToken, userFallbackName);
  if (user && typeof window !== "undefined") {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
  }

  return user;
}

/**
 * Clear session and log out
 */
export function clearAuthSession() {
  setMemoryAccessToken(null);

  if (typeof window !== "undefined") {
    // TEMPORARY: Remove refreshToken from localStorage placeholder
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
  }

  Cookies.remove(ACCESS_TOKEN_COOKIE, { path: "/" });
}

/**
 * Restore session on browser reload / initial load
 */
export function restoreAuthSession(): { user: User | null; token: string | null } {
  // Check cookie first (accessible across reloads)
  const tokenFromCookie = Cookies.get(ACCESS_TOKEN_COOKIE) || null;

  if (tokenFromCookie) {
    setMemoryAccessToken(tokenFromCookie);
    let fallbackName: string | undefined;
    if (typeof window !== "undefined") {
      try {
        const savedUser = localStorage.getItem(USER_INFO_KEY);
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          fallbackName = parsed.name;
        }
      } catch {
        // ignore parse error
      }
    }
    const user = extractUserFromToken(tokenFromCookie, fallbackName);
    return { user, token: tokenFromCookie };
  }

  return { user: null, token: null };
}

/**
 * Get the temporary stored refresh token
 */
export function getStoredRefreshToken(): string | null {
  // TEMPORARY: Retrieve refreshToken placeholder from localStorage
  if (typeof window !== "undefined") {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
}
