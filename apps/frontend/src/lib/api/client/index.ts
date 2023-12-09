import { cookieParse, cookieSerialize } from "../../../utils/cookie";
import { parseJwt } from "../../../utils/jwt";

type SuccessResponse<Data = unknown> = {
  success: true;
  data: Data;
  error: null;
};

type ErrorResponse<AdditionalData = unknown> = {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
    action?: string;
    additionalData?: AdditionalData;
  };
};

export type ApiResponse<Data = unknown, AdditionalData = unknown> =
  | SuccessResponse<Data>
  | ErrorResponse<AdditionalData>;

export default class Client {
  baseUrl = "http://localhost:3001";
  authToken: string | null;

  isAuthenticated() {
    return Boolean(this.authToken) && this.isTokenValid();
  }

  loadFromCookies(cookieStr: string, key: string) {
    const raw = cookieParse(cookieStr)[key];
    const data = raw ? JSON.parse(raw as string) : null;

    if (!data) return;

    this.authToken = data.token;
  }

  exportToCookie(key: string) {
    // We are serializing a JSON object because we may want to add more data to the cookie in the future.
    const data = {
      token: this.authToken,
    };

    return cookieSerialize(key, JSON.stringify(data), {
      httpOnly: true,
      maxAge: 60 * 60 * 1, // 1 hour
    });
  }

  isTokenValid() {
    if (!this.authToken) {
      return false;
    }

    const payload = parseJwt(this.authToken);
    if (!payload.exp || payload.exp < Date.now() / 1000) {
      return false;
    }

    return true;
  }

  clearToken() {
    this.authToken = null;
  }

  async refreshToken() {
    const newToken = await this.sendRequest<{
      payload: {
        token: string;
      };
    }>("/api/v1/auth/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: this.authToken,
      }),
    });

    if (newToken.success) {
      this.authToken = newToken.data.payload.token;
    }
  }

  async sendRequest<Data = unknown, AdditionalData = unknown>(
    path: string,
    options?: RequestInit
  ): Promise<ApiResponse<Data, AdditionalData>> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: options?.headers,
      credentials: "include",
    });
    return response.json() as Promise<ApiResponse<Data, AdditionalData>>;
  }
}