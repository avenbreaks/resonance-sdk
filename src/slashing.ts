import type { HTTPClient } from './client';
import type { SlashingEventResponse } from './types';

export class SlashingAPI {
  constructor(private client: HTTPClient) {}

  /**
   * Get slashing events
   * GET /eth/v1/slashing/events
   * @param validatorAddress - Optional validator address filter
   * @param limit - Optional limit
   * @param offset - Optional offset
   */
  async getEvents(
    validatorAddress?: string,
    limit?: number,
    offset?: number
  ): Promise<SlashingEventResponse[]> {
    const params: Record<string, string | number> = {};
    if (validatorAddress) params.validator_address = validatorAddress;
    if (limit !== undefined) params.limit = limit;
    if (offset !== undefined) params.offset = offset;

    return this.client.get<SlashingEventResponse[]>('/eth/v1/slashing/events', params);
  }
}
