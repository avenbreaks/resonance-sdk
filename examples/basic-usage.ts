/**
 * Basic SDK Usage Example
 *
 * This example shows how to use the Resonance SDK to interact with the API
 */

import { ResonanceSDK } from '@resonance/sdk';

// Initialize SDK
const sdk = new ResonanceSDK({
  apiUrl: 'http://localhost:8080', // Update with your API URL
  timeout: 30000, // 30 seconds timeout
});

/**
 * Example 1: Get Global Network Statistics
 */
async function getNetworkStats() {
  try {
    const stats = await sdk.global.getStats();
    console.log('Network Statistics:');
    console.log('  Total Validators:', stats.total_validators);
    console.log('  Total Delegators:', stats.total_delegators);
    console.log('  Total Network Stake:', stats.total_network_stake);
    console.log('  Current Epoch:', stats.epoch);
    console.log('  Block Height:', stats.block_height);
    console.log('  Jailed Validators:', stats.jailed_validators);
  } catch (error) {
    console.error('Error fetching network stats:', error);
  }
}

/**
 * Example 2: Get Validator Details
 */
async function getValidatorInfo(address: string) {
  try {
    const validator = await sdk.validators.get(address);
    console.log('\nValidator Information:');
    console.log('  Address:', validator.validator_address);
    console.log('  Name:', validator.name);
    console.log('  Status:', validator.status);
    console.log('  Commission Rate:', validator.commission_rate);
    console.log('  Total Stake:', validator.total_stake);
    console.log('  Self Stake:', validator.self_stake);
    console.log('  Delegators Stake:', validator.delegators_stake);
    console.log('  Uptime:', validator.uptime);
    console.log('  Total Delegators:', validator.total_delegators);
  } catch (error) {
    console.error('Error fetching validator info:', error);
  }
}

/**
 * Example 3: Get Delegator Details
 */
async function getDelegatorInfo(address: string) {
  try {
    const delegator = await sdk.delegators.get(address);
    console.log('\nDelegator Information:');
    console.log('  Address:', delegator.delegator_address);
    console.log('  Total Stake:', delegator.total_stake);
    console.log('  Total Rewards:', delegator.total_rewards);
    console.log('  Withdrawn Rewards:', delegator.withdrawn_rewards_total);
    console.log('  Active Validators:', delegator.active_validators.length);

    if (delegator.unbonding) {
      console.log('  Unbonding:');
      console.log('    Amount:', delegator.unbonding.amount);
      console.log('    Start:', delegator.unbonding.unbonding_start);
      console.log('    End:', delegator.unbonding.unbonding_end);
    }
  } catch (error) {
    console.error('Error fetching delegator info:', error);
  }
}

/**
 * Example 4: Get Network APR
 */
async function getNetworkAPR() {
  try {
    const apr = await sdk.global.getNetworkAPR();
    console.log('\nNetwork APR:', apr.network_apr, '%');

    const breakdown = await sdk.global.getNetworkAPRBreakdown();
    console.log('APR Breakdown:');
    console.log('  Reward Per Block:', breakdown.reward_per_block);
    console.log('  Reward Per Epoch:', breakdown.reward_per_epoch);
    console.log('  Reward Per Year:', breakdown.reward_per_year);
    console.log('  Epochs Per Day:', breakdown.epochs_per_day);
    console.log('  Effective Inflation:', breakdown.effective_inflation, '%');
  } catch (error) {
    console.error('Error fetching network APR:', error);
  }
}

/**
 * Example 5: Get Leaderboards
 */
async function getLeaderboards() {
  try {
    console.log('\nTop 10 Delegators:');
    const delegators = await sdk.global.getLeaderboardDelegators(10, 0);
    delegators.forEach((d, index) => {
      console.log(`  ${index + 1}. ${d.address} - Stake: ${d.stake}`);
    });

    console.log('\nTop 10 Validators:');
    const validators = await sdk.global.getLeaderboardValidators(10, 0);
    validators.forEach((v, index) => {
      console.log(`  ${index + 1}. ${v.address} - APR: ${v.apr_decimal}% - Stake: ${v.total_stake}`);
    });
  } catch (error) {
    console.error('Error fetching leaderboards:', error);
  }
}

/**
 * Example 6: Get Validator History
 */
async function getValidatorHistory(address: string, fromEpoch: number, toEpoch: number) {
  try {
    const history = await sdk.validators.getHistory(address, fromEpoch, toEpoch);
    console.log(`\nValidator History (Epochs ${history.from_epoch} to ${history.to_epoch}):`);

    history.history.forEach(item => {
      console.log(`  Epoch ${item.epoch}:`);
      console.log(`    Reward: ${item.reward}`);
      console.log(`    Total Stake: ${item.total_stake}`);
      console.log(`    Uptime: ${item.uptime}`);
      console.log(`    Missed Blocks: ${item.missed_blocks}`);
    });
  } catch (error) {
    console.error('Error fetching validator history:', error);
  }
}

/**
 * Example 7: Referral Operations
 */
async function referralOperations() {
  try {
    // Validate a referral code
    const validation = await sdk.referrals.validate('REF123');
    console.log('\nReferral Validation:');
    console.log('  Is Valid:', validation.is_valid);
    console.log('  Message:', validation.message);

    // Get validator referral info
    const validatorAddress = '0x1234...';
    const validatorRef = await sdk.referrals.getValidatorReferral(validatorAddress);
    console.log('\nValidator Referral Info:');
    console.log('  Code:', validatorRef.referral_code);
    console.log('  Total Referred:', validatorRef.total_referred);
    console.log('  Delegators:', validatorRef.delegators.length);
  } catch (error) {
    console.error('Error in referral operations:', error);
  }
}

/**
 * Example 8: Get Slashing Events
 */
async function getSlashingEvents() {
  try {
    const events = await sdk.slashing.getEvents(undefined, 10, 0);
    console.log('\nRecent Slashing Events:');

    events.forEach(event => {
      console.log(`  Validator: ${event.validator_address}`);
      console.log(`  Reason: ${event.reason}`);
      console.log(`  Block: ${event.block_height}`);
      console.log(`  Penalty: ${event.penalty_amount}`);
      console.log(`  Timestamp: ${new Date(event.timestamp * 1000).toISOString()}`);
      console.log('  ---');
    });
  } catch (error) {
    console.error('Error fetching slashing events:', error);
  }
}

// Run examples
async function main() {
  console.log('=== Resonance SDK Basic Usage Examples ===\n');

  // Get network stats
  await getNetworkStats();

  // Get network APR
  await getNetworkAPR();

  // Get leaderboards
  await getLeaderboards();

  // Uncomment to run other examples (replace with actual addresses)
  // await getValidatorInfo('0x1234...');
  // await getDelegatorInfo('0xabcd...');
  // await getValidatorHistory('0x1234...', 1, 100);
  // await referralOperations();
  // await getSlashingEvents();
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export {
  getNetworkStats,
  getValidatorInfo,
  getDelegatorInfo,
  getNetworkAPR,
  getLeaderboards,
  getValidatorHistory,
  referralOperations,
  getSlashingEvents,
};
