import type { HTTPClient } from './client';
import type {
  ReferralCreateRequest,
  ReferralValidateRequest,
  ReferralApplyRequest,
  ReferralValidateResponse,
  ReferralDelegatorResponse,
  ReferralValidatorResponse,
} from './types';

export class ReferralsAPI {
  constructor(private client: HTTPClient) {}

  /**
   * Validate a referral code
   * GET /eth/v1/referrals/validate?code=CODE
   */
  async validate(referralCode: string): Promise<ReferralValidateResponse> {
    return this.client.get<ReferralValidateResponse>('/eth/v1/referrals/validate', {
      code: referralCode,
    });
  }

  /**
   * Create a new referral code
   * POST /eth/v1/referrals
   * @param request - Referral creation request
   */
  async create(request: ReferralCreateRequest): Promise<ReferralValidatorResponse> {
    return this.client.post<ReferralValidatorResponse>('/eth/v1/referrals', request);
  }

  /**
   * Apply a referral code
   * POST /eth/v1/referrals/apply
   * @param request - Referral application request
   */
  async apply(request: ReferralApplyRequest): Promise<{ message: string }> {
    return this.client.post<{ message: string }>('/eth/v1/referrals/apply', request);
  }

  /**
   * Delete a referral code
   * DELETE /eth/v1/referrals/:referral_code
   * @param referralCode - The referral code to delete
   */
  async delete(referralCode: string): Promise<{ message: string }> {
    return this.client.delete<{ message: string }>(`/eth/v1/referrals/${referralCode}`);
  }

  /**
   * Unlink a delegator from referral
   * DELETE /eth/v1/referrals/unlink/:delegator_address
   * @param delegatorAddress - The delegator address to unlink
   */
  async unlink(delegatorAddress: string): Promise<{ message: string }> {
    return this.client.delete<{ message: string }>(`/eth/v1/referrals/unlink/${delegatorAddress}`);
  }

  /**
   * Get delegator referral information
   * GET /eth/v1/referrals/delegators/:delegator_address
   */
  async getDelegatorReferral(delegatorAddress: string): Promise<ReferralDelegatorResponse> {
    return this.client.get<ReferralDelegatorResponse>(
      `/eth/v1/referrals/delegators/${delegatorAddress}`
    );
  }

  /**
   * Get validator referral information
   * GET /eth/v1/referrals/validators/:validator_address
   */
  async getValidatorReferral(validatorAddress: string): Promise<ReferralValidatorResponse> {
    return this.client.get<ReferralValidatorResponse>(
      `/eth/v1/referrals/validators/${validatorAddress}`
    );
  }
}
