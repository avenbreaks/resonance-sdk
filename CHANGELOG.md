# Changelog

All notable changes to the Resonance SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2025-11-26

### Fixed
- Fixed referral validate endpoint to use correct query parameter `code` instead of `referral_code`
- Fixed indentation in referrals.ts validate method

### Changed
- Updated JSDoc comment to reflect correct query parameter format `?code=CODE`

## [0.1.0] - 2024-11-26

### Added

#### Core SDK Features
- Initial release of Resonance Network SDK
- Full TypeScript support with comprehensive type definitions
- Support for both CommonJS and ES modules
- Browser and Node.js compatibility

#### API Modules
- **Global API**: Network statistics, APR calculations, and leaderboards
  - `getStats()` - Get global network statistics
  - `getNetworkAPR()` - Get network APR
  - `getNetworkAPRBreakdown()` - Get detailed APR breakdown
  - `getLeaderboardDelegators()` - Get delegator leaderboard
  - `getLeaderboardValidators()` - Get validator leaderboard

- **Validators API**: Complete validator information and metrics
  - `getAll()` - List all validators
  - `get()` - Get validator details
  - `getDelegators()` - Get validator's delegators
  - `getStakeBreakdown()` - Get stake distribution
  - `getEpoch()` - Get epoch-specific data
  - `getHistory()` - Get historical data
  - `getWithdrawals()` - Get withdrawal history
  - `getMetrics()` - Get performance metrics
  - `getSlashing()` - Get slashing events
  - `getAPR()` - Get validator-specific APR

- **Delegators API**: Delegator data and staking information
  - `getAll()` - List all delegators
  - `get()` - Get delegator details
  - `getStakes()` - Get stake breakdown
  - `getRewards()` - Get reward history
  - `getWithdrawals()` - Get withdrawal history
  - `getUnbonding()` - Get unbonding status
  - `getValidators()` - Get active validators

- **Referrals API**: Referral code management
  - `validate()` - Validate referral code
  - `create()` - Create new referral code (authenticated)
  - `apply()` - Apply referral code
  - `delete()` - Delete referral code (authenticated)
  - `unlink()` - Unlink delegator from referral (authenticated)
  - `getDelegatorReferral()` - Get delegator's referral info
  - `getValidatorReferral()` - Get validator's referral info

- **Slashing API**: Slashing events and penalties
  - `getEvents()` - Get slashing events with optional filters

#### Authentication
- Web3 wallet authentication support
- JWT token management
- Session storage for token persistence
- Automatic token expiration checking
- Support for both validator and delegator roles

#### HTTP Client
- Custom timeout configuration
- Custom header support
- Automatic error handling
- Query parameter building
- Request/response type safety

#### Developer Experience
- Comprehensive TypeScript types for all API responses
- Example files for common use cases
- React hooks example for authentication
- Full JSDoc documentation
- ESLint configuration
- Build tooling with tsup

### Documentation
- Complete README with usage examples
- API reference documentation
- React and Next.js integration examples
- Node.js usage examples
- Authentication flow examples
- Error handling examples

### Build & Distribution
- CommonJS (CJS) build for Node.js
- ES Module (ESM) build for modern bundlers
- TypeScript declaration files (.d.ts)
- Tree-shakeable exports

## [Unreleased]

### Planned Features
- WebSocket support for real-time updates
- Caching layer for frequently accessed data
- Rate limiting and retry logic
- GraphQL support (if API adds GraphQL)
- Additional utility functions for common operations
- React hooks package (@resonance/sdk-react)
- Vue composables package (@resonance/sdk-vue)

---

[0.1.0]: https://github.com/resonance-network/sdk/releases/tag/v0.1.0
