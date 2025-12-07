import type { HTTPClient } from './client';
import type {
  DelegatorDetailResponse,
  DelegatorListResponse,
  DelegatorStakesResponse,
  DelegatorRewardsResponse,
  DelegatorWithdrawalsResponse,
  DelegatorUnbondingResponse,
  DelegatorValidatorsResponse,
} from './types';

export class DelegatorsAPI {
  constructor(private client: HTTPClient) {}

  /**
   * Get all delegators
   * GET /eth/v1/delegators
   */
  async getAll(): Promise<DelegatorListResponse> {
    return this.client.get<DelegatorListResponse>('/eth/v1/delegators');
  }

  /**
   * Get delegator details
   * GET /eth/v1/delegators/:address
   */
  async get(address: string): Promise<DelegatorDetailResponse> {
    return this.client.get<DelegatorDetailResponse>(`/eth/v1/delegators/${address}`);
  }

  /**
   * Get delegator stakes breakdown per validator
   * GET /eth/v1/delegators/:address/stakes
   */
  async getStakes(address: string): Promise<DelegatorStakesResponse> {
    return this.client.get<DelegatorStakesResponse>(`/eth/v1/delegators/${address}/stakes`);
  }

  /**
   * Get delegator rewards history
   * GET /eth/v1/delegators/:address/rewards
   * @param address - Delegator address
   * @param limit - Optional limit
   * @param offset - Optional offset
   */
  async getRewards(
    address: string,
    limit?: number,
    offset?: number
  ): Promise<DelegatorRewardsResponse> {
    const params: Record<string, number> = {};
    if (limit !== undefined) params.limit = limit;
    if (offset !== undefined) params.offset = offset;

    return this.client.get<DelegatorRewardsResponse>(
      `/eth/v1/delegators/${address}/rewards`,
      params
    );
  }

  /**
   * Get delegator withdrawals history
   * GET /eth/v1/delegators/:address/withdrawals
   * @param address - Delegator address
   * @param limit - Optional limit
   * @param offset - Optional offset
   */
  async getWithdrawals(
    address: string,
    limit?: number,
    offset?: number
  ): Promise<DelegatorWithdrawalsResponse> {
    const params: Record<string, number> = {};
    if (limit !== undefined) params.limit = limit;
    if (offset !== undefined) params.offset = offset;

    return this.client.get<DelegatorWithdrawalsResponse>(
      `/eth/v1/delegators/${address}/withdrawals`,
      params
    );
  }

  /**
   * Get delegator unbonding status
   * GET /eth/v1/delegators/:address/unbonding
   */
  async getUnbonding(address: string): Promise<DelegatorUnbondingResponse> {
    return this.client.get<DelegatorUnbondingResponse>(`/eth/v1/delegators/${address}/unbonding`);
  }

  /**
   * Get delegator active validators
   * GET /eth/v1/delegators/:address/validators
   */
  async getValidators(address: string): Promise<DelegatorValidatorsResponse> {
    return this.client.get<DelegatorValidatorsResponse>(`/eth/v1/delegators/${address}/validators`);
  }
}
