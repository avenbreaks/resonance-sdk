import { ethers } from 'ethers';
import type { AuthResponse, JWTClaims } from './types';

export class AuthService {
  private apiUrl: string;
  private tokenKey = 'resonance_jwt_token';

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  /**
   * Get nonce for wallet authentication
   * POST /eth/v1/auth/nonce
   */
  async getNonce(address: string): Promise<{ nonce: string; message: string }> {
    const response = await fetch(`${this.apiUrl}/eth/v1/auth/nonce`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address })
    });

    if (!response.ok) {
      throw new Error('Failed to get nonce');
    }

    const result = await response.json();
    return result.data; // Returns {nonce, message}
  }

  /**
   * Verify wallet signature and get JWT token
   * POST /eth/v1/auth/verify
   */
  async verify(params: { address: string; signature: string; role: 'validator' | 'delegator' }): Promise<{ token: string }> {
    const response = await fetch(`${this.apiUrl}/eth/v1/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const result = await response.json();
    const token = result.data.token;

    // Store token
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(this.tokenKey, token);
    }

    return { token };
  }

  /**
   * Connect wallet and authenticate
   */
  async connectWallet(
    provider: ethers.BrowserProvider,
    role: 'validator' | 'delegator' = 'delegator'
  ): Promise<AuthResponse> {
    // Get signer
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    // Generate message to sign
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = Math.floor(Math.random() * 1000000);
    const message = `Sign this message to login to Resonance Dashboard

Address: ${address}
Role: ${role}
Nonce: ${nonce}
Timestamp: ${timestamp}

This will not trigger any blockchain transaction or cost gas fees.`;

    // Request signature
    const signature = await signer.signMessage(message);

    // Send to backend for verification
    const response = await fetch(`${this.apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address,
        message,
        signature,
        role,
        timestamp,
        nonce
      })
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json() as AuthResponse;

    // Store token
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(this.tokenKey, data.token);
    }

    return data;
  }

  /**
   * Get stored JWT token
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(this.tokenKey);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const claims = this.parseToken(token);
      return claims.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  /**
   * Parse JWT token to get claims
   */
  parseToken(token: string): JWTClaims {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }

  /**
   * Get user info from token
   */
  getUserInfo(): { address: string; role: string } | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const claims = this.parseToken(token);
      return {
        address: claims.address,
        role: claims.role
      };
    } catch {
      return null;
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.tokenKey);
    }
  }

  /**
   * Check if token is expiring soon (within 5 minutes)
   */
  isTokenExpiringSoon(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const claims = this.parseToken(token);
      const expiresAt = claims.exp * 1000;
      const fiveMinutes = 5 * 60 * 1000;
      return expiresAt - Date.now() < fiveMinutes;
    } catch {
      return true;
    }
  }
}
