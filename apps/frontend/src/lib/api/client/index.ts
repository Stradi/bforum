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

  loadFromCookies(cookieStr: string) {
    const cookies = cookieStr.split(";");
    const cookie = cookies.find((c) => c.startsWith("auth-token="));
    if (!cookie) {
      this.authToken = null;
      return;
    }
    const token = cookie.split("=")[1];
    this.authToken = token;
  }

  exportToCookie() {
    if (!this.authToken) {
      return "";
    }

    // TODO: Use a library to properly encode the cookie value
    return `auth-token=${this.authToken};`;
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
      headers: {
        ...options?.headers,
        credentials: "include",
      },
    });
    return response.json() as Promise<ApiResponse<Data, AdditionalData>>;
  }
}
