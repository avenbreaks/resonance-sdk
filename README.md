# Resonance Network SDK

Official TypeScript/JavaScript SDK for interacting with the Resonance Network API.

## Installation

```bash
npm install @avenbreaks/resonance-sdk
# or
yarn add @avenbreaks/resonance-sdk
# or
pnpm add @avenbreaks/resonance-sdk
```

## Quick Start

```typescript
import { ResonanceSDK } from '@avenbreaks/resonance-sdk';

// Initialize the SDK
const sdk = new ResonanceSDK({
  apiUrl: 'https://api.resonance.network',
  timeout: 30000, // Optional, default 30s
});

// Get global network statistics
const stats = await sdk.global.getStats();
console.log('Total Network Stake:', stats.total_network_stake);

// Get validator details
const validator = await sdk.validators.get('0x1234...');
console.log('Validator Status:', validator.status);
```

## Authentication

The SDK supports wallet-based authentication using Web3 providers:

```typescript
import { ethers } from 'ethers';
import { ResonanceSDK } from '@avenbreaks/resonance-sdk';

const sdk = new ResonanceSDK({
  apiUrl: 'https://api.resonance.network',
});

// Connect wallet (browser environment)
const provider = new ethers.BrowserProvider(window.ethereum);
const authResponse = await sdk.auth.connectWallet(provider, 'delegator');

// Set the JWT token for authenticated requests
sdk.setAuthToken(authResponse.token);

// Check authentication status
if (sdk.isAuthenticated()) {
  console.log('User is authenticated');
}

// Logout
sdk.logout();
```

## API Reference

### Global Network Stats

```typescript
// Get global network statistics
const stats = await sdk.global.getStats();

// Get network APR
const apr = await sdk.global.getNetworkAPR();

// Get network APR breakdown
const breakdown = await sdk.global.getNetworkAPRBreakdown();

// Get delegator leaderboard
const delegatorLeaderboard = await sdk.global.getLeaderboardDelegators(10, 0);

// Get validator leaderboard
const validatorLeaderboard = await sdk.global.getLeaderboardValidators(10, 0);
```

### Validators

```typescript
// Get all validators
const allValidators = await sdk.validators.getAll();

// Get specific validator details
const validator = await sdk.validators.get('0x1234...');

// Get validator delegators
const delegators = await sdk.validators.getDelegators('0x1234...');

// Get validator stake breakdown
const stakeBreakdown = await sdk.validators.getStakeBreakdown('0x1234...');

// Get validator epoch details
const epochData = await sdk.validators.getEpoch('0x1234...', 100);

// Get validator history
const history = await sdk.validators.getHistory('0x1234...', 1, 100);

// Get validator withdrawals
const withdrawals = await sdk.validators.getWithdrawals('0x1234...', 50, 0);

// Get validator metrics
const metrics = await sdk.validators.getMetrics('0x1234...');

// Get validator slashing events
const slashing = await sdk.validators.getSlashing('0x1234...');

// Get validator APR
const validatorAPR = await sdk.validators.getAPR('0x1234...');
```

### Delegators

```typescript
// Get all delegators
const allDelegators = await sdk.delegators.getAll();

// Get specific delegator details
const delegator = await sdk.delegators.get('0xabcd...');

// Get delegator stakes breakdown
const stakes = await sdk.delegators.getStakes('0xabcd...');

// Get delegator rewards history
const rewards = await sdk.delegators.getRewards('0xabcd...', 50, 0);

// Get delegator withdrawals
const withdrawals = await sdk.delegators.getWithdrawals('0xabcd...', 50, 0);

// Get delegator unbonding status
const unbonding = await sdk.delegators.getUnbonding('0xabcd...');

// Get delegator active validators
const validators = await sdk.delegators.getValidators('0xabcd...');
```

### Referrals

```typescript
// Validate a referral code
const validation = await sdk.referrals.validate('REF123');

// Create a new referral code (requires authentication)
const referralCode = await sdk.referrals.create({
  validator_address: '0x1234...',
  max_quota: 100,
  expires_in_days: 30,
});

// Apply a referral code
await sdk.referrals.apply({
  referral_code: 'REF123',
  delegator_address: '0xabcd...',
});

// Delete a referral code (requires authentication)
await sdk.referrals.delete('REF123');

// Unlink a delegator from referral (requires authentication)
await sdk.referrals.unlink('0xabcd...');

// Get delegator referral information
const delegatorRef = await sdk.referrals.getDelegatorReferral('0xabcd...');

// Get validator referral information
const validatorRef = await sdk.referrals.getValidatorReferral('0x1234...');
```

### Slashing

```typescript
// Get all slashing events
const allEvents = await sdk.slashing.getEvents();

// Get slashing events for a specific validator
const validatorEvents = await sdk.slashing.getEvents('0x1234...', 50, 0);
```

## Advanced Usage

### Custom Headers

```typescript
const sdk = new ResonanceSDK({
  apiUrl: 'https://api.resonance.network',
  headers: {
    'X-Custom-Header': 'value',
  },
});

// Or set headers after initialization
sdk.setHeader('X-API-Key', 'your-api-key');
```

### Error Handling

```typescript
try {
  const validator = await sdk.validators.get('0x1234...');
} catch (error) {
  if (error instanceof Error) {
    console.error('API Error:', error.message);
  }
}
```

### Timeout Configuration

```typescript
const sdk = new ResonanceSDK({
  apiUrl: 'https://api.resonance.network',
  timeout: 60000, // 60 seconds
});
```

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions:

```typescript
import type {
  ValidatorDetailResponse,
  DelegatorDetailResponse,
  GlobalNetworkResponse,
} from '@avenbreaks/resonance-sdk';

const processValidator = (validator: ValidatorDetailResponse) => {
  console.log(validator.validator_address);
  console.log(validator.total_stake);
};
```

## React Example

```typescript
import { useEffect, useState } from 'react';
import { ResonanceSDK } from '@avenbreaks/resonance-sdk';

const sdk = new ResonanceSDK({
  apiUrl: 'https://api.resonance.network',
});

function ValidatorList() {
  const [validators, setValidators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchValidators = async () => {
      try {
        const data = await sdk.validators.getAll();
        setValidators(data);
      } catch (error) {
        console.error('Failed to fetch validators:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchValidators();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {validators.map((validator) => (
        <div key={validator.address}>{validator.address}</div>
      ))}
    </div>
  );
}
```

## Next.js Example

```typescript
// app/page.tsx
import { ResonanceSDK } from '@avenbreaks/resonance-sdk';

const sdk = new ResonanceSDK({
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.resonance.network',
});

export default async function HomePage() {
  const stats = await sdk.global.getStats();

  return (
    <div>
      <h1>Network Stats</h1>
      <p>Total Validators: {stats.total_validators}</p>
      <p>Total Delegators: {stats.total_delegators}</p>
      <p>Total Stake: {stats.total_network_stake}</p>
    </div>
  );
}
```

## Node.js Example

```typescript
import { ResonanceSDK } from '@avenbreaks/resonance-sdk';

const sdk = new ResonanceSDK({
  apiUrl: 'https://api.resonance.network',
});

async function main() {
  // Get network statistics
  const stats = await sdk.global.getStats();
  console.log('Network Stats:', stats);

  // Get validator leaderboard
  const leaderboard = await sdk.global.getLeaderboardValidators(10);
  console.log('Top 10 Validators:', leaderboard);
}

main().catch(console.error);
```

## API Endpoints

All API endpoints are available under the `/eth/v1` prefix. The SDK handles this automatically.

| Module | Endpoint Pattern | Description |
|--------|-----------------|-------------|
| Global | `/eth/v1/global` | Network statistics and leaderboards |
| Validators | `/eth/v1/validators/:address` | Validator information and history |
| Delegators | `/eth/v1/delegators/:address` | Delegator information and history |
| Referrals | `/eth/v1/referrals` | Referral code management |
| Slashing | `/eth/v1/slashing/events` | Slashing events |

## Development

```bash
# Install dependencies
pnpm install

# Build the SDK
pnpm build

# Run type checking
pnpm type-check

# Watch mode (for development)
pnpm dev
```

## License

MIT

## Support

For issues and questions, please visit:
- GitHub Issues: https://github.com/resonance-network/sdk/issues
- Documentation: https://docs.resonance.network
