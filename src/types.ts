// API Response Types
export interface APIResponse<T> {
  data: T;
  meta?: Record<string, any>;
}

export interface APIError {
  error: {
    code: string;
    message: string;
  };
}

// ============= Validator Types =============

export interface ValidatorDetailResponse {
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

export interface ValidatorEpochResponse {
  validator_address: string;
  epoch: number;
  reward: EpochReward;
  stakes: EpochStakes;
  distribution: EpochDistribution;
  unclaimed: EpochUnclaimed;
}

export interface EpochReward {
  reward_gross: string;
  commission_rate: number;
  commission_fee: string;
  delegator_pool: string;
}

export interface EpochStakes {
  self_stake: string;
  delegators_stake: string;
  total_stake_validator: string;
}

export interface EpochDistribution {
  self_reward_from_pool: string;
  validator_total_reward: string;
  delegators_total_reward: string;
}

export interface EpochUnclaimed {
  unclaimed_validator_reward: string;
  unclaimed_delegators_reward_total: string;
  delegators: UnclaimedDelegator[];
}

export interface UnclaimedDelegator {
  delegator_address: string;
  stake: string;
  reward: string;
  unclaimed_reward: string;
}

export interface ValidatorListResponse {
  address: string;
  count: number;
}

export interface ValidatorDelegatorsResponse {
  validator_address: string;
  total_delegators: number;
  delegators: DelegatorStakeInfo[];
}

export interface DelegatorStakeInfo {
  delegator_address: string;
  stake: string;
  percentage: string;
}

export interface ValidatorStakeBreakdownResponse {
  validator_address: string;
  self_stake: string;
  delegators_stake: string;
  total_stake: string;
  self_stake_percent: string;
}

export interface ValidatorHistoryResponse {
  validator_address: string;
  from_epoch: number;
  to_epoch: number;
  history: ValidatorHistoryItem[];
}

export interface ValidatorHistoryItem {
  epoch: number;
  reward: string;
  total_stake: string;
  uptime: string;
  missed_blocks: number;
}

export interface ValidatorWithdrawalsResponse {
  validator_address: string;
  total_withdrawn: string;
  withdrawals: ValidatorWithdrawal[];
}

export interface ValidatorWithdrawal {
  tx_hash: string;
  amount: string;
  timestamp: number;
  block_num: number;
}

export interface ValidatorMetricsResponse {
  validator_address: string;
  uptime: number;
  missed_blocks: number;
  signed_blocks: number;
  total_blocks: number;
  apr: number;
  total_stake: string;
  total_delegators: number;
}

export interface ValidatorAPRResponse {
  validator_address: string;
  apr_decimal: number;
  apr_percent: string;
}

// ============= Delegator Types =============

export interface DelegatorDetailResponse {
  delegator_address: string;
  total_stake: string;
  active_validators: ActiveValidator[];
  total_rewards: string;
  withdrawn_rewards_total: string;
  unbonding?: UnbondingInfo;
}

export interface ActiveValidator {
  validator_address: string;
  stake: string;
}

export interface UnbondingInfo {
  amount: string;
  unbonding_start: number;
  unbonding_end: number;
}

export interface DelegatorListResponse {
  address: string;
  count: number;
}

export interface DelegatorStakesResponse {
  delegator_address: string;
  total_stake: string;
  stakes: DelegatorValidatorStake[];
}

export interface DelegatorValidatorStake {
  validator_address: string;
  stake: string;
  percentage: string;
}

export interface DelegatorRewardsResponse {
  delegator_address: string;
  total_rewards: string;
  rewards: DelegatorReward[];
}

export interface DelegatorReward {
  validator_address: string;
  epoch: number;
  amount: string;
  timestamp: number;
}

export interface DelegatorWithdrawalsResponse {
  delegator_address: string;
  total_withdrawn: string;
  withdrawals: DelegatorWithdrawal[];
}

export interface DelegatorWithdrawal {
  tx_hash: string;
  amount: string;
  timestamp: number;
  block_num: number;
}

export interface DelegatorUnbondingResponse {
  delegator_address: string;
  has_unbonding: boolean;
  unbonding?: UnbondingInfo;
}

export interface DelegatorValidatorsResponse {
  delegator_address: string;
  total_validators: number;
  validators: ActiveValidator[];
}

// ============= Referral Types =============

export interface ReferralCreateRequest {
  validator_address: string;
  max_quota?: number;
  expires_in_days?: number;
}

export interface ReferralValidateRequest {
  referral_code: string;
}

export interface ReferralApplyRequest {
  referral_code: string;
  delegator_address: string;
}

export interface ReferralValidateResponse {
  is_valid: boolean;
  referral_code?: string;
  message?: string;
}

export interface ReferralDelegatorResponse {
  delegator_address: string;
  referred_by_validator: string;
  referral_code_used: string;
}

export interface ReferralValidatorResponse {
  validator_address: string;
  referral_code: string;
  delegators: string[];
  total_referred: number;
}

// ============= Slashing Types =============

export interface SlashingEventResponse {
  validator_address: string;
  reason: string;
  block_height: number;
  penalty_amount: string;
  jailed_until?: number;
  timestamp: number;
}

// ============= Global Stats Types =============

export interface GlobalNetworkResponse {
  total_network_stake: string;
  total_validators: number;
  total_delegators: number;
  epoch: number;
  block_height: number;
  jailed_validators: number;
  ranking_top_delegators: TopDelegatorRank[];
}

export interface TopDelegatorRank {
  rank: number;
  address: string;
  total_stake: string;
}

export interface NetworkAPRResponse {
  network_apr: number;
}

export interface NetworkAPRBreakdownResponse {
  reward_per_block: string;
  reward_per_epoch: string;
  reward_per_year: string;
  epochs_per_day: number;
  effective_inflation: number;
}

// ============= Leaderboard Types =============

export interface LeaderboardDelegatorResponse {
  rank: number;
  address: string;
  stake: string;
}

export interface LeaderboardValidatorResponse {
  rank: number;
  address: string;
  apr_decimal: number;
  total_stake: string;
  self_stake: string;
}

// ============= Auth Types =============

export interface JWTClaims {
  address: string;
  role: 'validator' | 'delegator';
  exp: number;
  iat: number;
  iss: string;
}

export interface AuthResponse {
  token: string;
  address: string;
  role: string;
  expires_at: number;
}

// ============= SDK Config =============

export interface SDKConfig {
  apiUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}
