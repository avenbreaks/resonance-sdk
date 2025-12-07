import { ethers } from 'ethers';

interface APIResponse<T> {
    data: T;
    meta?: Record<string, any>;
}
interface APIError {
    error: {
        code: string;
        message: string;
    };
}
interface ValidatorDetailResponse {
    validator_address: string;
    name: string;
    description: string;
    commission_rate: number;
    status: string;
    self_stake: string;
    delegators_stake: string;
    total_stake: string;
    uptime: string;
    missed_blocks: number;
    signed_blocks: number;
    total_delegators: number;
    withdrawn_rewards_total: string;
}
interface ValidatorEpochResponse {
    validator_address: string;
    epoch: number;
    reward: EpochReward;
    stakes: EpochStakes;
    distribution: EpochDistribution;
    unclaimed: EpochUnclaimed;
}
interface EpochReward {
    reward_gross: string;
    commission_rate: number;
    commission_fee: string;
    delegator_pool: string;
}
interface EpochStakes {
    self_stake: string;
    delegators_stake: string;
    total_stake_validator: string;
}
interface EpochDistribution {
    self_reward_from_pool: string;
    validator_total_reward: string;
    delegators_total_reward: string;
}
interface EpochUnclaimed {
    unclaimed_validator_reward: string;
    unclaimed_delegators_reward_total: string;
    delegators: UnclaimedDelegator[];
}
interface UnclaimedDelegator {
    delegator_address: string;
    stake: string;
    reward: string;
    unclaimed_reward: string;
}
interface ValidatorListResponse {
    address: string;
    count: number;
}
interface ValidatorDelegatorsResponse {
    validator_address: string;
    total_delegators: number;
    delegators: DelegatorStakeInfo[];
}
interface DelegatorStakeInfo {
    delegator_address: string;
    stake: string;
    percentage: string;
}
interface ValidatorStakeBreakdownResponse {
    validator_address: string;
    self_stake: string;
    delegators_stake: string;
    total_stake: string;
    self_stake_percent: string;
}
interface ValidatorHistoryResponse {
    validator_address: string;
    from_epoch: number;
    to_epoch: number;
    history: ValidatorHistoryItem[];
}
interface ValidatorHistoryItem {
    epoch: number;
    reward: string;
    total_stake: string;
    uptime: string;
    missed_blocks: number;
}
interface ValidatorWithdrawalsResponse {
    validator_address: string;
    total_withdrawn: string;
    withdrawals: ValidatorWithdrawal[];
}
interface ValidatorWithdrawal {
    tx_hash: string;
    amount: string;
    timestamp: number;
    block_num: number;
}
interface ValidatorMetricsResponse {
    validator_address: string;
    uptime: number;
    missed_blocks: number;
    signed_blocks: number;
    total_blocks: number;
    apr: number;
    total_stake: string;
    total_delegators: number;
}
interface ValidatorAPRResponse {
    validator_address: string;
    apr_decimal: number;
    apr_percent: string;
}
interface DelegatorDetailResponse {
    delegator_address: string;
    total_stake: string;
    active_validators: ActiveValidator[];
    total_rewards: string;
    withdrawn_rewards_total: string;
    unbonding?: UnbondingInfo;
}
interface ActiveValidator {
    validator_address: string;
    stake: string;
}
interface UnbondingInfo {
    amount: string;
    unbonding_start: number;
    unbonding_end: number;
}
interface DelegatorListResponse {
    address: string;
    count: number;
}
interface DelegatorStakesResponse {
    delegator_address: string;
    total_stake: string;
    stakes: DelegatorValidatorStake[];
}
interface DelegatorValidatorStake {
    validator_address: string;
    stake: string;
    percentage: string;
}
interface DelegatorRewardsResponse {
    delegator_address: string;
    total_rewards: string;
    rewards: DelegatorReward[];
}
interface DelegatorReward {
    validator_address: string;
    epoch: number;
    amount: string;
    timestamp: number;
}
interface DelegatorWithdrawalsResponse {
    delegator_address: string;
    total_withdrawn: string;
    withdrawals: DelegatorWithdrawal[];
}
interface DelegatorWithdrawal {
    tx_hash: string;
    amount: string;
    timestamp: number;
    block_num: number;
}
interface DelegatorUnbondingResponse {
    delegator_address: string;
    has_unbonding: boolean;
    unbonding?: UnbondingInfo;
}
interface DelegatorValidatorsResponse {
    delegator_address: string;
    total_validators: number;
    validators: ActiveValidator[];
}
interface ReferralCreateRequest {
    validator_address: string;
    max_quota?: number;
    expires_in_days?: number;
}
interface ReferralValidateRequest {
    referral_code: string;
}
interface ReferralApplyRequest {
    referral_code: string;
    delegator_address: string;
}
interface ReferralValidateResponse {
    is_valid: boolean;
    referral_code?: string;
    message?: string;
}
interface ReferralDelegatorResponse {
    delegator_address: string;
    referred_by_validator: string;
    referral_code_used: string;
}
interface ReferralValidatorResponse {
    validator_address: string;
    referral_code: string;
    delegators: string[];
    total_referred: number;
}
interface SlashingEventResponse {
    validator_address: string;
    reason: string;
    block_height: number;
    penalty_amount: string;
    jailed_until?: number;
    timestamp: number;
}
interface GlobalNetworkResponse {
    total_network_stake: string;
    total_validators: number;
    total_delegators: number;
    epoch: number;
    block_height: number;
    jailed_validators: number;
    ranking_top_delegators: TopDelegatorRank[];
}
interface TopDelegatorRank {
    rank: number;
    address: string;
    total_stake: string;
}
interface NetworkAPRResponse {
    network_apr: number;
}
interface NetworkAPRBreakdownResponse {
    reward_per_block: string;
    reward_per_epoch: string;
    reward_per_year: string;
    epochs_per_day: number;
    effective_inflation: number;
}
interface LeaderboardDelegatorResponse {
    rank: number;
    address: string;
    stake: string;
}
interface LeaderboardValidatorResponse {
    rank: number;
    address: string;
    apr_decimal: number;
    total_stake: string;
    self_stake: string;
}
interface JWTClaims {
    address: string;
    role: 'validator' | 'delegator';
    exp: number;
    iat: number;
    iss: string;
}
interface AuthResponse {
    token: string;
    address: string;
    role: string;
    expires_at: number;
}
interface SDKConfig {
    apiUrl: string;
    timeout?: number;
    headers?: Record<string, string>;
}
interface QueryParams {
    [key: string]: string | number | boolean | undefined;
}

declare class AuthService {
    private apiUrl;
    private tokenKey;
    constructor(apiUrl: string);
    /**
     * Get nonce for wallet authentication
     * POST /eth/v1/auth/nonce
     */
    getNonce(address: string): Promise<{
        nonce: string;
        message: string;
    }>;
    /**
     * Verify wallet signature and get JWT token
     * POST /eth/v1/auth/verify
     */
    verify(params: {
        address: string;
        signature: string;
        role: 'validator' | 'delegator';
    }): Promise<{
        token: string;
    }>;
    /**
     * Connect wallet and authenticate
     */
    connectWallet(provider: ethers.BrowserProvider, role?: 'validator' | 'delegator'): Promise<AuthResponse>;
    /**
     * Get stored JWT token
     */
    getToken(): string | null;
    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean;
    /**
     * Parse JWT token to get claims
     */
    parseToken(token: string): JWTClaims;
    /**
     * Get user info from token
     */
    getUserInfo(): {
        address: string;
        role: string;
    } | null;
    /**
     * Logout user
     */
    logout(): void;
    /**
     * Check if token is expiring soon (within 5 minutes)
     */
    isTokenExpiringSoon(): boolean;
}

declare class HTTPClient {
    private baseUrl;
    private timeout;
    private headers;
    constructor(config: SDKConfig);
    /**
     * Build URL with query parameters
     */
    private buildUrl;
    /**
     * Set authorization token
     */
    setAuthToken(token: string | null): void;
    /**
     * Set custom header
     */
    setHeader(key: string, value: string): void;
    /**
     * Make HTTP GET request
     */
    get<T>(path: string, params?: QueryParams): Promise<T>;
    /**
     * Make HTTP POST request
     */
    post<T>(path: string, body?: any): Promise<T>;
    /**
     * Make HTTP DELETE request
     */
    delete<T>(path: string): Promise<T>;
    /**
     * Handle HTTP errors
     */
    private handleError;
    private fetchWithRetry;
}

declare class ValidatorsAPI {
    private client;
    constructor(client: HTTPClient);
    /**
     * Get all validators
     * GET /eth/v1/validators
     */
    getAll(): Promise<ValidatorListResponse>;
    /**
     * Get validator details
     * GET /eth/v1/validators/:address
     */
    get(address: string): Promise<ValidatorDetailResponse>;
    /**
     * Get validator delegators
     * GET /eth/v1/validators/:address/delegators
     */
    getDelegators(address: string): Promise<ValidatorDelegatorsResponse>;
    /**
     * Get validator stake breakdown
     * GET /eth/v1/validators/:address/stake
     */
    getStakeBreakdown(address: string): Promise<ValidatorStakeBreakdownResponse>;
    /**
     * Get validator epoch details
     * GET /eth/v1/validators/:address/epochs/:epoch
     */
    getEpoch(address: string, epoch: number): Promise<ValidatorEpochResponse>;
    /**
     * Get validator history
     * GET /eth/v1/validators/:address/history
     * @param address - Validator address
     * @param fromEpoch - Optional starting epoch
     * @param toEpoch - Optional ending epoch
     */
    getHistory(address: string, fromEpoch?: number, toEpoch?: number): Promise<ValidatorHistoryResponse>;
    /**
     * Get validator withdrawals
     * GET /eth/v1/validators/:address/withdrawals
     * @param address - Validator address
     * @param limit - Optional limit
     * @param offset - Optional offset
     */
    getWithdrawals(address: string, limit?: number, offset?: number): Promise<ValidatorWithdrawalsResponse>;
    /**
     * Get validator metrics
     * GET /eth/v1/validators/:address/metrics
     */
    getMetrics(address: string): Promise<ValidatorMetricsResponse>;
    /**
     * Get validator slashing events
     * GET /eth/v1/validators/:address/slashing
     */
    getSlashing(address: string): Promise<SlashingEventResponse[]>;
    /**
     * Get validator APR
     * GET /eth/v1/validators/:address/apr
     */
    getAPR(address: string): Promise<ValidatorAPRResponse>;
}

declare class DelegatorsAPI {
    private client;
    constructor(client: HTTPClient);
    /**
     * Get all delegators
     * GET /eth/v1/delegators
     */
    getAll(): Promise<DelegatorListResponse>;
    /**
     * Get delegator details
     * GET /eth/v1/delegators/:address
     */
    get(address: string): Promise<DelegatorDetailResponse>;
    /**
     * Get delegator stakes breakdown per validator
     * GET /eth/v1/delegators/:address/stakes
     */
    getStakes(address: string): Promise<DelegatorStakesResponse>;
    /**
     * Get delegator rewards history
     * GET /eth/v1/delegators/:address/rewards
     * @param address - Delegator address
     * @param limit - Optional limit
     * @param offset - Optional offset
     */
    getRewards(address: string, limit?: number, offset?: number): Promise<DelegatorRewardsResponse>;
    /**
     * Get delegator withdrawals history
     * GET /eth/v1/delegators/:address/withdrawals
     * @param address - Delegator address
     * @param limit - Optional limit
     * @param offset - Optional offset
     */
    getWithdrawals(address: string, limit?: number, offset?: number): Promise<DelegatorWithdrawalsResponse>;
    /**
     * Get delegator unbonding status
     * GET /eth/v1/delegators/:address/unbonding
     */
    getUnbonding(address: string): Promise<DelegatorUnbondingResponse>;
    /**
     * Get delegator active validators
     * GET /eth/v1/delegators/:address/validators
     */
    getValidators(address: string): Promise<DelegatorValidatorsResponse>;
}

declare class ReferralsAPI {
    private client;
    constructor(client: HTTPClient);
    /**
     * Validate a referral code
     * GET /eth/v1/referrals/validate?code=CODE
     */
    validate(referralCode: string): Promise<ReferralValidateResponse>;
    /**
     * Create a new referral code
     * POST /eth/v1/referrals
     * @param request - Referral creation request
     */
    create(request: ReferralCreateRequest): Promise<ReferralValidatorResponse>;
    /**
     * Apply a referral code
     * POST /eth/v1/referrals/apply
     * @param request - Referral application request
     */
    apply(request: ReferralApplyRequest): Promise<{
        message: string;
    }>;
    /**
     * Delete a referral code
     * DELETE /eth/v1/referrals/:referral_code
     * @param referralCode - The referral code to delete
     */
    delete(referralCode: string): Promise<{
        message: string;
    }>;
    /**
     * Unlink a delegator from referral
     * DELETE /eth/v1/referrals/unlink/:delegator_address
     * @param delegatorAddress - The delegator address to unlink
     */
    unlink(delegatorAddress: string): Promise<{
        message: string;
    }>;
    /**
     * Get delegator referral information
     * GET /eth/v1/referrals/delegators/:delegator_address
     */
    getDelegatorReferral(delegatorAddress: string): Promise<ReferralDelegatorResponse>;
    /**
     * Get validator referral information
     * GET /eth/v1/referrals/validators/:validator_address
     */
    getValidatorReferral(validatorAddress: string): Promise<ReferralValidatorResponse>;
}

declare class GlobalAPI {
    private client;
    constructor(client: HTTPClient);
    /**
     * Get global network statistics
     * GET /eth/v1/global
     */
    getStats(): Promise<GlobalNetworkResponse>;
    /**
     * Get network APR (from /global endpoint)
     * GET /eth/v1/global/network_apr
     */
    getNetworkAPRFromGlobal(): Promise<NetworkAPRResponse>;
    /**
     * Get network APR (from /network endpoint)
     * GET /eth/v1/network/apr
     */
    getNetworkAPR(): Promise<NetworkAPRResponse>;
    /**
     * Get network APR breakdown
     * GET /eth/v1/network/apr/breakdown
     */
    getNetworkAPRBreakdown(): Promise<NetworkAPRBreakdownResponse>;
    /**
     * Get delegator leaderboard
     * GET /eth/v1/leaderboard/delegators
     * @param limit - Optional limit (default backend value)
     * @param offset - Optional offset for pagination
     */
    getLeaderboardDelegators(limit?: number, offset?: number): Promise<LeaderboardDelegatorResponse[]>;
    /**
     * Get validator leaderboard
     * GET /eth/v1/leaderboard/validators
     * @param limit - Optional limit (default backend value)
     * @param offset - Optional offset for pagination
     */
    getLeaderboardValidators(limit?: number, offset?: number): Promise<LeaderboardValidatorResponse[]>;
}

declare class SlashingAPI {
    private client;
    constructor(client: HTTPClient);
    /**
     * Get slashing events
     * GET /eth/v1/slashing/events
     * @param validatorAddress - Optional validator address filter
     * @param limit - Optional limit
     * @param offset - Optional offset
     */
    getEvents(validatorAddress?: string, limit?: number, offset?: number): Promise<SlashingEventResponse[]>;
}

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
declare class ResonanceSDK {
    private client;
    auth: AuthService;
    validators: ValidatorsAPI;
    delegators: DelegatorsAPI;
    referrals: ReferralsAPI;
    global: GlobalAPI;
    slashing: SlashingAPI;
    constructor(config: SDKConfig);
    /**
     * Set authentication token for API requests
     * @param token - JWT token
     */
    setAuthToken(token: string | null): void;
    /**
     * Set custom header for API requests
     * @param key - Header key
     * @param value - Header value
     */
    setHeader(key: string, value: string): void;
    /**
     * Get the current auth token from storage
     */
    getAuthToken(): string | null;
    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean;
    /**
     * Logout user and clear auth token
     */
    logout(): void;
}

export { type APIError, type APIResponse, type ActiveValidator, type AuthResponse, AuthService, type DelegatorDetailResponse, type DelegatorListResponse, type DelegatorReward, type DelegatorRewardsResponse, type DelegatorStakeInfo, type DelegatorStakesResponse, type DelegatorUnbondingResponse, type DelegatorValidatorStake, type DelegatorValidatorsResponse, type DelegatorWithdrawal, type DelegatorWithdrawalsResponse, DelegatorsAPI, type EpochDistribution, type EpochReward, type EpochStakes, type EpochUnclaimed, GlobalAPI, type GlobalNetworkResponse, HTTPClient, type JWTClaims, type LeaderboardDelegatorResponse, type LeaderboardValidatorResponse, type NetworkAPRBreakdownResponse, type NetworkAPRResponse, type QueryParams, type ReferralApplyRequest, type ReferralCreateRequest, type ReferralDelegatorResponse, type ReferralValidateRequest, type ReferralValidateResponse, type ReferralValidatorResponse, ReferralsAPI, ResonanceSDK, type SDKConfig, SlashingAPI, type SlashingEventResponse, type TopDelegatorRank, type UnbondingInfo, type UnclaimedDelegator, type ValidatorAPRResponse, type ValidatorDelegatorsResponse, type ValidatorDetailResponse, type ValidatorEpochResponse, type ValidatorHistoryItem, type ValidatorHistoryResponse, type ValidatorListResponse, type ValidatorMetricsResponse, type ValidatorStakeBreakdownResponse, type ValidatorWithdrawal, type ValidatorWithdrawalsResponse, ValidatorsAPI, ResonanceSDK as default };
