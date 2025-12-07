import { ResonanceAPIError } from './errors';
import type { SDKConfig, QueryParams, APIError } from './types';

export class HTTPClient {
  private baseUrl: string;
  private timeout: number;
  private headers: Record<string, string>;

  constructor(config: SDKConfig) {
    this.baseUrl = config.apiUrl.replace(/\/$/, ''); // Remove trailing slash
    this.timeout = config.timeout || 30000; // 30 seconds default
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(path: string, params?: QueryParams): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  /**
   * Set authorization token
   */
  setAuthToken(token: string | null): void {
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.headers['Authorization'];
    }
  }

  /**
   * Set custom header
   */
  setHeader(key: string, value: string): void {
    this.headers[key] = value;
  }

  /**
   * Make HTTP GET request
   */
  async get<T>(path: string, params?: QueryParams): Promise<T> {
    const url = this.buildUrl(path, params);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleError(response);
      }

      const json = await response.json();
      // Extract data from wrapper if present
      return json.data !== undefined ? json.data : json;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * Make HTTP POST request
   */
  async post<T>(path: string, body?: any): Promise<T> {
    const url = this.buildUrl(path);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleError(response);
      }

      const json = await response.json();
      // Extract data from wrapper if present
      return json.data !== undefined ? json.data : json;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * Make HTTP DELETE request
   */
  async delete<T>(path: string): Promise<T> {
    const url = this.buildUrl(path);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleError(response);
      }

      const json = await response.json();
      // Extract data from wrapper if present
      return json.data !== undefined ? json.data : json;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * Handle HTTP errors
   */
  private async handleError(response: Response): Promise<never> {
    let errorCode = 'UNKNOWN_ERROR';
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

    try {
      const errorData: APIError = await response.json();
      if (errorData.error) {
        errorCode = errorData.error.code;
        errorMessage = errorData.error.message;
      }
    } catch {
      // If response is not JSON, use default error message
    }

    throw new ResonanceAPIError(response.status, errorCode, errorMessage);
  }

  /*
  * Automatic Retry transient errors network
  */
  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    retries = 3
  ): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        return await fetch(url, options);
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    throw new Error('Max retries reached');
  }
}
