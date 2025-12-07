import type { HTTPClient } from './client';
import type {
  ValidatorDetailResponse,
  ValidatorEpochResponse,
  ValidatorListResponse,
  ValidatorDelegatorsResponse,
  ValidatorStakeBreakdownResponse,
  ValidatorHistoryResponse,
  ValidatorWithdrawalsResponse,
  ValidatorMetricsResponse,
  ValidatorAPRResponse,
  SlashingEventResponse,
} from './types';

export class ValidatorsAPI {
  constructor(private client: HTTPClient) {}

  /**
   * Get all validators
   * GET /eth/v1/validators
   */
  async getAll(): Promise<ValidatorListResponse> {
    return this.client.get<ValidatorListResponse>('/eth/v1/validators');
  }

  /**
   * Get validator details
   * GET /eth/v1/validators/:address
   */
  async get(address: string): Promise<ValidatorDetailResponse> {
    return this.client.get<ValidatorDetailResponse>(`/eth/v1/validators/${address}`);
  }

  /**
   * Get validator delegators
   * GET /eth/v1/validators/:address/delegators
   */
  async getDelegators(address: string): Promise<ValidatorDelegatorsResponse> {
    return this.client.get<ValidatorDelegatorsResponse>(`/eth/v1/validators/${address}/delegators`);
  }

  /**
   * Get validator stake breakdown
   * GET /eth/v1/validators/:address/stake
   */
  async getStakeBreakdown(address: string): Promise<ValidatorStakeBreakdownResponse> {
    return this.client.get<ValidatorStakeBreakdownResponse>(`/eth/v1/validators/${address}/stake`);
  }

  /**
   * Get validator epoch details
   * GET /eth/v1/validators/:address/epochs/:epoch
   */
  async getEpoch(address: string, epoch: number): Promise<ValidatorEpochResponse> {
    return this.client.get<ValidatorEpochResponse>(`/eth/v1/validators/${address}/epochs/${epoch}`);
  }

  /**
   * Get validator history
   * GET /eth/v1/validators/:address/history
   * @param address - Validator address
   * @param fromEpoch - Optional starting epoch
   * @param toEpoch - Optional ending epoch
   */
  async getHistory(
    address: string,
    fromEpoch?: number,
    toEpoch?: number
  ): Promise<ValidatorHistoryResponse> {
    const params: Record<string, number> = {};
    if (fromEpoch !== undefined) params.from_epoch = fromEpoch;
    if (toEpoch !== undefined) params.to_epoch = toEpoch;

    return this.client.get<ValidatorHistoryResponse>(
      `/eth/v1/validators/${address}/history`,
      params
    );
  }

  /**
   * Get validator withdrawals
   * GET /eth/v1/validators/:address/withdrawals
   * @param address - Validator address
   * @param limit - Optional limit
   * @param offset - Optional offset
   */
  async getWithdrawals(
    address: string,
    limit?: number,
    offset?: number
  ): Promise<ValidatorWithdrawalsResponse> {
    const params: Record<string, number> = {};
    if (limit !== undefined) params.limit = limit;
    if (offset !== undefined) params.offset = offset;

    return this.client.get<ValidatorWithdrawalsResponse>(
      `/eth/v1/validators/${address}/withdrawals`,
      params
    );
  }

  /**
   * Get validator metrics
   * GET /eth/v1/validators/:address/metrics
   */
  async getMetrics(address: string): Promise<ValidatorMetricsResponse> {
    return this.client.get<ValidatorMetricsResponse>(`/eth/v1/validators/${address}/metrics`);
  }

  /**
   * Get validator slashing events
   * GET /eth/v1/validators/:address/slashing
   */
  async getSlashing(address: string): Promise<SlashingEventResponse[]> {
    return this.client.get<SlashingEventResponse[]>(`/eth/v1/validators/${address}/slashing`);
  }

  /**
   * Get validator APR
   * GET /eth/v1/validators/:address/apr
   */
  async getAPR(address: string): Promise<ValidatorAPRResponse> {
    return this.client.get<ValidatorAPRResponse>(`/eth/v1/validators/${address}/apr`);
  }
}
