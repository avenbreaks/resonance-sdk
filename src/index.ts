import { HTTPClient } from './client';
import { AuthService } from './auth';
import { ValidatorsAPI } from './validators';
import { DelegatorsAPI } from './delegators';
import { ReferralsAPI } from './referrals';
import { GlobalAPI } from './global';
import { SlashingAPI } from './slashing';
import type { SDKConfig } from './types';

/**
 * Resonance Network SDK
 *
 * Main SDK class that provides access to all API endpoints
 *
 * @example
 * ```typescript
 * import { ResonanceSDK } from '@resonance/sdk';
 *
 * const sdk = new ResonanceSDK({
 *   apiUrl: 'https://api.resonance.network'
 * });
 *
 * // Get global network stats
 * const stats = await sdk.global.getStats();
 *
 * // Get validator details
 * const validator = await sdk.validators.get('0x1234...');
 * ```
 */
export class ResonanceSDK {
  private client: HTTPClient;

  public auth: AuthService;
  public validators: ValidatorsAPI;
  public delegators: DelegatorsAPI;
  public referrals: ReferralsAPI;
  public global: GlobalAPI;
  public slashing: SlashingAPI;

  constructor(config: SDKConfig) {
    this.client = new HTTPClient(config);

    // Initialize API modules
    this.auth = new AuthService(config.apiUrl);
    this.validators = new ValidatorsAPI(this.client);
    this.delegators = new DelegatorsAPI(this.client);
    this.referrals = new ReferralsAPI(this.client);
    this.global = new GlobalAPI(this.client);
    this.slashing = new SlashingAPI(this.client);
  }

  /**
   * Set authentication token for API requests
   * @param token - JWT token
   */
  setAuthToken(token: string | null): void {
    this.client.setAuthToken(token);
  }

  /**
   * Set custom header for API requests
   * @param key - Header key
   * @param value - Header value
   */
  setHeader(key: string, value: string): void {
    this.client.setHeader(key, value);
  }

  /**
   * Get the current auth token from storage
   */
  getAuthToken(): string | null {
    return this.auth.getToken();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  /**
   * Logout user and clear auth token
   */
  logout(): void {
    this.auth.logout();
    this.client.setAuthToken(null);
  }
}

// Export types for consumers
export * from './types';

// Export individual API classes if needed
export { HTTPClient } from './client';
export { AuthService } from './auth';
export { ValidatorsAPI } from './validators';
export { DelegatorsAPI } from './delegators';
export { ReferralsAPI } from './referrals';
export { GlobalAPI } from './global';
export { SlashingAPI } from './slashing';

// Default export
export default ResonanceSDK;
