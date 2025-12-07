/**
 * Web3 Authentication Example
 *
 * This example shows how to authenticate with the Resonance API using Web3 wallet
 */

import { ethers } from 'ethers';
import { ResonanceSDK } from '@resonance/sdk';

// Initialize SDK
const sdk = new ResonanceSDK({
  apiUrl: 'http://localhost:8080',
});

/**
 * Example 1: Browser Wallet Authentication (MetaMask, etc.)
 */
async function authenticateWithBrowserWallet() {
  try {
    // Check if window.ethereum is available
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      // Create provider
      const provider = new ethers.BrowserProvider((window as any).ethereum);

      // Request account access
      await provider.send('eth_requestAccounts', []);

      // Authenticate with the API
      console.log('Authenticating with wallet...');
      const authResponse = await sdk.auth.connectWallet(provider, 'delegator');

      console.log('Authentication successful!');
      console.log('  Address:', authResponse.address);
      console.log('  Role:', authResponse.role);
      console.log('  Token expires at:', new Date(authResponse.expires_at * 1000).toISOString());

      // Set token for future requests
      sdk.setAuthToken(authResponse.token);

      // Verify authentication
      console.log('  Is authenticated:', sdk.isAuthenticated());

      return authResponse;
    } else {
      throw new Error('No Web3 wallet detected');
    }
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
}

/**
 * Example 2: Using Authenticated Endpoints
 */
async function useAuthenticatedEndpoints() {
  try {
    // Check if we're authenticated
    if (!sdk.isAuthenticated()) {
      console.log('Not authenticated. Please authenticate first.');
      return;
    }

    // Get user info from token
    const userInfo = sdk.auth.getUserInfo();
    console.log('\nUser Info:');
    console.log('  Address:', userInfo?.address);
    console.log('  Role:', userInfo?.role);

    // Example: Create a referral code (requires validator role)
    if (userInfo?.role === 'validator') {
      const referral = await sdk.referrals.create({
        validator_address: userInfo.address,
        max_quota: 100,
        expires_in_days: 30,
      });

      console.log('\nReferral Code Created:');
      console.log('  Code:', referral.referral_code);
      console.log('  Total Referred:', referral.total_referred);
    }

    // Example: Get my delegator info
    if (userInfo?.role === 'delegator') {
      const delegatorInfo = await sdk.delegators.get(userInfo.address);
      console.log('\nMy Delegator Info:');
      console.log('  Total Stake:', delegatorInfo.total_stake);
      console.log('  Total Rewards:', delegatorInfo.total_rewards);
    }
  } catch (error) {
    console.error('Error using authenticated endpoints:', error);
  }
}

/**
 * Example 3: Check Token Expiration and Refresh
 */
async function checkAndRefreshToken() {
  try {
    // Check if token is expiring soon
    const isExpiringSoon = sdk.auth.isTokenExpiringSoon();
    console.log('\nToken Status:');
    console.log('  Is expiring soon (< 5 minutes):', isExpiringSoon);

    if (isExpiringSoon && typeof window !== 'undefined' && (window as any).ethereum) {
      console.log('  Token expiring soon, re-authenticating...');

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const authResponse = await sdk.auth.connectWallet(provider, 'delegator');

      sdk.setAuthToken(authResponse.token);
      console.log('  Token refreshed successfully!');
    }
  } catch (error) {
    console.error('Error checking/refreshing token:', error);
  }
}

/**
 * Example 4: Logout
 */
function logout() {
  console.log('\nLogging out...');
  sdk.logout();
  console.log('  Logged out successfully');
  console.log('  Is authenticated:', sdk.isAuthenticated());
}

/**
 * Example 5: Complete Authentication Flow
 */
async function completeAuthenticationFlow() {
  try {
    console.log('=== Complete Authentication Flow ===\n');

    // Step 1: Authenticate
    console.log('Step 1: Authenticate with wallet');
    await authenticateWithBrowserWallet();

    // Step 2: Use authenticated endpoints
    console.log('\nStep 2: Use authenticated endpoints');
    await useAuthenticatedEndpoints();

    // Step 3: Check token status
    console.log('\nStep 3: Check token status');
    await checkAndRefreshToken();

    // Step 4: Logout
    console.log('\nStep 4: Logout');
    logout();
  } catch (error) {
    console.error('Authentication flow error:', error);
  }
}

/**
 * Example 6: React Hook for Authentication
 */
export function useResonanceAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<{ address: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = async (role: 'validator' | 'delegator' = 'delegator') => {
    setIsLoading(true);
    setError(null);

    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const authResponse = await sdk.auth.connectWallet(provider, role);

        sdk.setAuthToken(authResponse.token);
        setIsAuthenticated(true);
        setUserInfo({ address: authResponse.address, role: authResponse.role });
      } else {
        throw new Error('No Web3 wallet detected');
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    sdk.logout();
    setIsAuthenticated(false);
    setUserInfo(null);
  };

  const checkAuth = () => {
    const authenticated = sdk.isAuthenticated();
    setIsAuthenticated(authenticated);

    if (authenticated) {
      setUserInfo(sdk.auth.getUserInfo());
    }
  };

  return {
    isAuthenticated,
    userInfo,
    isLoading,
    error,
    connect,
    disconnect,
    checkAuth,
  };
}

// For React applications - import useState at the top
// import { useState } from 'react';
function useState<T>(initialValue: T): [T, (value: T) => void] {
  // This is a mock - use real React useState in React apps
  let value = initialValue;
  const setValue = (newValue: T) => {
    value = newValue;
  };
  return [value, setValue];
}

// Export functions
export {
  authenticateWithBrowserWallet,
  useAuthenticatedEndpoints,
  checkAndRefreshToken,
  logout,
  completeAuthenticationFlow,
};

// Run if this file is executed directly in browser
if (typeof window !== 'undefined') {
  // Make functions available in browser console for testing
  (window as any).resonanceAuth = {
    authenticate: authenticateWithBrowserWallet,
    useAuthenticated: useAuthenticatedEndpoints,
    checkToken: checkAndRefreshToken,
    logout,
    completeFlow: completeAuthenticationFlow,
  };

  console.log('Resonance Auth functions available:');
  console.log('  window.resonanceAuth.authenticate()');
  console.log('  window.resonanceAuth.useAuthenticated()');
  console.log('  window.resonanceAuth.checkToken()');
  console.log('  window.resonanceAuth.logout()');
  console.log('  window.resonanceAuth.completeFlow()');
}
