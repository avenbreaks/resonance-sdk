/**
 * Next.js Integration Example
 *
 * This file shows how to use the Resonance SDK in Next.js applications
 * with both App Router and Pages Router
 */

import { ResonanceSDK } from '@resonance/sdk';

// ============= Server-Side Usage (App Router) =============

/**
 * Example 1: Server Component with App Router
 * File: app/dashboard/page.tsx
 */
export default async function DashboardPage() {
  // Initialize SDK on server
  const sdk = new ResonanceSDK({
    apiUrl: process.env.RESONANCE_API_URL || 'http://localhost:8080',
  });

  // Fetch data at request time
  const stats = await sdk.global.getStats();
  const validators = await sdk.validators.getAll();

  return (
    <div>
      <h1>Network Dashboard</h1>

      <section>
        <h2>Network Stats</h2>
        <p>Total Validators: {stats.total_validators}</p>
        <p>Total Delegators: {stats.total_delegators}</p>
        <p>Total Stake: {stats.total_network_stake}</p>
        <p>Current Epoch: {stats.epoch}</p>
      </section>

      <section>
        <h2>Validators</h2>
        <p>Total: {validators.count}</p>
      </section>
    </div>
  );
}

/**
 * Example 2: Server Component with Streaming
 * File: app/validators/[address]/page.tsx
 */
interface ValidatorPageProps {
  params: {
    address: string;
  };
}

export default async function ValidatorPage({ params }: ValidatorPageProps) {
  const sdk = new ResonanceSDK({
    apiUrl: process.env.RESONANCE_API_URL || 'http://localhost:8080',
  });

  // Fetch validator data
  const validator = await sdk.validators.get(params.address);

  return (
    <div>
      <h1>{validator.name || 'Validator'}</h1>
      <p>Status: {validator.status}</p>
      <p>Commission: {validator.commission_rate}%</p>
      <p>Total Stake: {validator.total_stake}</p>
      <p>Delegators: {validator.total_delegators}</p>

      {/* Use Suspense for additional data */}
      <Suspense fallback={<div>Loading metrics...</div>}>
        <ValidatorMetrics address={params.address} />
      </Suspense>
    </div>
  );
}

async function ValidatorMetrics({ address }: { address: string }) {
  const sdk = new ResonanceSDK({
    apiUrl: process.env.RESONANCE_API_URL || 'http://localhost:8080',
  });

  const metrics = await sdk.validators.getMetrics(address);

  return (
    <section>
      <h2>Metrics</h2>
      <p>Uptime: {metrics.uptime}%</p>
      <p>APR: {metrics.apr}%</p>
      <p>Signed Blocks: {metrics.signed_blocks}</p>
      <p>Missed Blocks: {metrics.missed_blocks}</p>
    </section>
  );
}

// ============= Client-Side Usage (App Router) =============

/**
 * Example 3: Client Component with React Hooks
 * File: app/components/ValidatorList.tsx
 */
'use client';

import { useState, useEffect } from 'react';
import { ResonanceSDK, ValidatorListResponse } from '@resonance/sdk';

const sdk = new ResonanceSDK({
  apiUrl: process.env.NEXT_PUBLIC_RESONANCE_API_URL || 'http://localhost:8080',
});

export function ValidatorList() {
  const [validators, setValidators] = useState<ValidatorListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchValidators() {
      try {
        const data = await sdk.validators.getAll();
        setValidators(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchValidators();
  }, []);

  if (loading) return <div>Loading validators...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!validators) return null;

  return (
    <div>
      <h2>Validators ({validators.count})</h2>
      <p>Address: {validators.address}</p>
    </div>
  );
}

/**
 * Example 4: Custom Hook for Data Fetching
 */
'use client';

import { useState, useEffect } from 'react';
import { ResonanceSDK } from '@resonance/sdk';

const sdk = new ResonanceSDK({
  apiUrl: process.env.NEXT_PUBLIC_RESONANCE_API_URL || 'http://localhost:8080',
});

export function useValidator(address: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address) return;

    async function fetchValidator() {
      try {
        setLoading(true);
        const validator = await sdk.validators.get(address);
        setData(validator);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchValidator();
  }, [address]);

  return { data, loading, error };
}

// Usage in component
export function ValidatorDetails({ address }: { address: string }) {
  const { data, loading, error } = useValidator(address);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return (
    <div>
      <h2>{data.name}</h2>
      <p>Total Stake: {data.total_stake}</p>
      <p>Status: {data.status}</p>
    </div>
  );
}

/**
 * Example 5: Authentication Component
 */
'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { ResonanceSDK } from '@resonance/sdk';

const sdk = new ResonanceSDK({
  apiUrl: process.env.NEXT_PUBLIC_RESONANCE_API_URL || 'http://localhost:8080',
});

export function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    try {
      setLoading(true);

      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const authResponse = await sdk.auth.connectWallet(provider, 'delegator');

      sdk.setAuthToken(authResponse.token);
      setIsConnected(true);
      setAddress(authResponse.address);
    } catch (error) {
      console.error('Connection failed:', error);
      alert('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    sdk.logout();
    setIsConnected(false);
    setAddress(null);
  };

  return (
    <div>
      {!isConnected ? (
        <button onClick={connect} disabled={loading}>
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div>
          <p>Connected: {address}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
}

// ============= API Routes =============

/**
 * Example 6: API Route Handler (App Router)
 * File: app/api/validators/route.ts
 */
import { NextResponse } from 'next/server';

const sdk = new ResonanceSDK({
  apiUrl: process.env.RESONANCE_API_URL || 'http://localhost:8080',
});

export async function GET() {
  try {
    const validators = await sdk.validators.getAll();
    return NextResponse.json(validators);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch validators' },
      { status: 500 }
    );
  }
}

/**
 * Example 7: Dynamic API Route
 * File: app/api/validators/[address]/route.ts
 */
export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  try {
    const validator = await sdk.validators.get(params.address);
    return NextResponse.json(validator);
  } catch (error) {
    return NextResponse.json(
      { error: 'Validator not found' },
      { status: 404 }
    );
  }
}

// ============= Pages Router Usage =============

/**
 * Example 8: getServerSideProps (Pages Router)
 * File: pages/validators/[address].tsx
 */
import { GetServerSideProps } from 'next';

interface ValidatorPageProps {
  validator: any;
}

export default function ValidatorPageOld({ validator }: ValidatorPageProps) {
  return (
    <div>
      <h1>{validator.name}</h1>
      <p>Status: {validator.status}</p>
      <p>Total Stake: {validator.total_stake}</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const sdk = new ResonanceSDK({
    apiUrl: process.env.RESONANCE_API_URL || 'http://localhost:8080',
  });

  const { address } = context.params as { address: string };

  try {
    const validator = await sdk.validators.get(address);

    return {
      props: {
        validator,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

/**
 * Example 9: getStaticProps with ISR
 * File: pages/leaderboard.tsx
 */
interface LeaderboardPageProps {
  delegators: any[];
  validators: any[];
}

export default function LeaderboardPage({ delegators, validators }: LeaderboardPageProps) {
  return (
    <div>
      <h1>Leaderboard</h1>

      <section>
        <h2>Top Delegators</h2>
        {delegators.map((d) => (
          <div key={d.address}>
            {d.rank}. {d.address} - {d.stake}
          </div>
        ))}
      </section>

      <section>
        <h2>Top Validators</h2>
        {validators.map((v) => (
          <div key={v.address}>
            {v.rank}. {v.address} - APR: {v.apr_decimal}%
          </div>
        ))}
      </section>
    </div>
  );
}

export const getStaticProps = async () => {
  const sdk = new ResonanceSDK({
    apiUrl: process.env.RESONANCE_API_URL || 'http://localhost:8080',
  });

  const [delegators, validators] = await Promise.all([
    sdk.global.getLeaderboardDelegators(10),
    sdk.global.getLeaderboardValidators(10),
  ]);

  return {
    props: {
      delegators,
      validators,
    },
    revalidate: 60, // Revalidate every 60 seconds (ISR)
  };
};

// ============= Environment Variables =============

/**
 * Required environment variables in .env.local:
 *
 * Server-side:
 * RESONANCE_API_URL=http://localhost:8080
 *
 * Client-side:
 * NEXT_PUBLIC_RESONANCE_API_URL=http://localhost:8080
 */

// Add Suspense import
import { Suspense } from 'react';
