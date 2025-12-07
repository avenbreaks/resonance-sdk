import type { HTTPClient } from './client';
import type {
  GlobalNetworkResponse,
  NetworkAPRResponse,
  NetworkAPRBreakdownResponse,
  LeaderboardDelegatorResponse,
  LeaderboardValidatorResponse,
} from './types';

export class GlobalAPI {
  constructor(private client: HTTPClient) {}

  /**
   * Get global network statistics
   * GET /eth/v1/global
   */
  async getStats(): Promise<GlobalNetworkResponse> {
    return this.client.get<GlobalNetworkResponse>('/eth/v1/global');
  }

  /**
   * Get network APR (from /global endpoint)
   * GET /eth/v1/global/network_apr
   */
  async getNetworkAPRFromGlobal(): Promise<NetworkAPRResponse> {
    return this.client.get<NetworkAPRResponse>('/eth/v1/global/network_apr');
  }

  /**
   * Get network APR (from /network endpoint)
   * GET /eth/v1/network/apr
   */
  async getNetworkAPR(): Promise<NetworkAPRResponse> {
    return this.client.get<NetworkAPRResponse>('/eth/v1/network/apr');
  }

  /**
   * Get network APR breakdown
   * GET /eth/v1/network/apr/breakdown
   */
  async getNetworkAPRBreakdown(): Promise<NetworkAPRBreakdownResponse> {
    return this.client.get<NetworkAPRBreakdownResponse>('/eth/v1/network/apr/breakdown');
  }

  /**
   * Get delegator leaderboard
   * GET /eth/v1/leaderboard/delegators
   * @param limit - Optional limit (default backend value)
   * @param offset - Optional offset for pagination
   */
  async getLeaderboardDelegators(
    limit?: number,
    offset?: number
  ): Promise<LeaderboardDelegatorResponse[]> {
    const params: Record<string, number> = {};
    if (limit !== undefined) params.limit = limit;
    if (offset !== undefined) params.offset = offset;

    return this.client.get<LeaderboardDelegatorResponse[]>(
      '/eth/v1/leaderboard/delegators',
      params
    );
  }

  /**
   * Get validator leaderboard
   * GET /eth/v1/leaderboard/validators
   * @param limit - Optional limit (default backend value)
   * @param offset - Optional offset for pagination
   */
  async getLeaderboardValidators(
    limit?: number,
    offset?: number
  ): Promise<LeaderboardValidatorResponse[]> {
    const params: Record<string, number> = {};
    if (limit !== undefined) params.limit = limit;
    if (offset !== undefined) params.offset = offset;

    return this.client.get<LeaderboardValidatorResponse[]>(
      '/eth/v1/leaderboard/validators',
      params
    );
  }
}
