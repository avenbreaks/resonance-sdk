// src/errors.ts
var ResonanceAPIError = class extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = "ResonanceAPIError";
  }
};

// src/client.ts
var HTTPClient = class {
  constructor(config) {
    this.baseUrl = config.apiUrl.replace(/\/$/, "");
    this.timeout = config.timeout || 3e4;
    this.headers = {
      "Content-Type": "application/json",
      ...config.headers
    };
  }
  /**
   * Build URL with query parameters
   */
  buildUrl(path, params) {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== void 0 && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }
  /**
   * Set authorization token
   */
  setAuthToken(token) {
    if (token) {
      this.headers["Authorization"] = `Bearer ${token}`;
    } else {
      delete this.headers["Authorization"];
    }
  }
  /**
   * Set custom header
   */
  setHeader(key, value) {
    this.headers[key] = value;
  }
  /**
   * Make HTTP GET request
   */
  async get(path, params) {
    const url = this.buildUrl(path, params);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: this.headers,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        await this.handleError(response);
      }
      const json = await response.json();
      return json.data !== void 0 ? json.data : json;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }
  /**
   * Make HTTP POST request
   */
  async post(path, body) {
    const url = this.buildUrl(path);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: this.headers,
        body: body ? JSON.stringify(body) : void 0,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        await this.handleError(response);
      }
      const json = await response.json();
      return json.data !== void 0 ? json.data : json;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }
  /**
   * Make HTTP DELETE request
   */
  async delete(path) {
    const url = this.buildUrl(path);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: this.headers,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        await this.handleError(response);
      }
      const json = await response.json();
      return json.data !== void 0 ? json.data : json;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }
  /**
   * Handle HTTP errors
   */
  async handleError(response) {
    let errorCode = "UNKNOWN_ERROR";
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorCode = errorData.error.code;
        errorMessage = errorData.error.message;
      }
    } catch {
    }
    throw new ResonanceAPIError(response.status, errorCode, errorMessage);
  }
  /*
  * Automatic Retry transient errors network
  */
  async fetchWithRetry(url, options, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fetch(url, options);
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1e3 * (i + 1)));
      }
    }
    throw new Error("Max retries reached");
  }
};

// src/auth.ts
var AuthService = class {
  constructor(apiUrl) {
    this.tokenKey = "resonance_jwt_token";
    this.apiUrl = apiUrl;
  }
  /**
   * Get nonce for wallet authentication
   * POST /eth/v1/auth/nonce
   */
  async getNonce(address) {
    const response = await fetch(`${this.apiUrl}/eth/v1/auth/nonce`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address })
    });
    if (!response.ok) {
      throw new Error("Failed to get nonce");
    }
    const result = await response.json();
    return result.data;
  }
  /**
   * Verify wallet signature and get JWT token
   * POST /eth/v1/auth/verify
   */
  async verify(params) {
    const response = await fetch(`${this.apiUrl}/eth/v1/auth/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
    if (!response.ok) {
      throw new Error("Authentication failed");
    }
    const result = await response.json();
    const token = result.data.token;
    if (typeof window !== "undefined") {
      sessionStorage.setItem(this.tokenKey, token);
    }
    return { token };
  }
  /**
   * Connect wallet and authenticate
   */
  async connectWallet(provider, role = "delegator") {
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const timestamp = Math.floor(Date.now() / 1e3);
    const nonce = Math.floor(Math.random() * 1e6);
    const message = `Sign this message to login to Resonance Dashboard

Address: ${address}
Role: ${role}
Nonce: ${nonce}
Timestamp: ${timestamp}

This will not trigger any blockchain transaction or cost gas fees.`;
    const signature = await signer.signMessage(message);
    const response = await fetch(`${this.apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address,
        message,
        signature,
        role,
        timestamp,
        nonce
      })
    });
    if (!response.ok) {
      throw new Error("Authentication failed");
    }
    const data = await response.json();
    if (typeof window !== "undefined") {
      sessionStorage.setItem(this.tokenKey, data.token);
    }
    return data;
  }
  /**
   * Get stored JWT token
   */
  getToken() {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(this.tokenKey);
  }
  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    try {
      const claims = this.parseToken(token);
      return claims.exp * 1e3 > Date.now();
    } catch {
      return false;
    }
  }
  /**
   * Parse JWT token to get claims
   */
  parseToken(token) {
    const payload = token.split(".")[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }
  /**
   * Get user info from token
   */
  getUserInfo() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const claims = this.parseToken(token);
      return {
        address: claims.address,
        role: claims.role
      };
    } catch {
      return null;
    }
  }
  /**
   * Logout user
   */
  logout() {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(this.tokenKey);
    }
  }
  /**
   * Check if token is expiring soon (within 5 minutes)
   */
  isTokenExpiringSoon() {
    const token = this.getToken();
    if (!token) return true;
    try {
      const claims = this.parseToken(token);
      const expiresAt = claims.exp * 1e3;
      const fiveMinutes = 5 * 60 * 1e3;
      return expiresAt - Date.now() < fiveMinutes;
    } catch {
      return true;
    }
  }
};

// src/validators.ts
var ValidatorsAPI = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Get all validators
   * GET /eth/v1/validators
   */
  async getAll() {
    return this.client.get("/eth/v1/validators");
  }
  /**
   * Get validator details
   * GET /eth/v1/validators/:address
   */
  async get(address) {
    return this.client.get(`/eth/v1/validators/${address}`);
  }
  /**
   * Get validator delegators
   * GET /eth/v1/validators/:address/delegators
   */
  async getDelegators(address) {
    return this.client.get(`/eth/v1/validators/${address}/delegators`);
  }
  /**
   * Get validator stake breakdown
   * GET /eth/v1/validators/:address/stake
   */
  async getStakeBreakdown(address) {
    return this.client.get(`/eth/v1/validators/${address}/stake`);
  }
  /**
   * Get validator epoch details
   * GET /eth/v1/validators/:address/epochs/:epoch
   */
  async getEpoch(address, epoch) {
    return this.client.get(`/eth/v1/validators/${address}/epochs/${epoch}`);
  }
  /**
   * Get validator history
   * GET /eth/v1/validators/:address/history
   * @param address - Validator address
   * @param fromEpoch - Optional starting epoch
   * @param toEpoch - Optional ending epoch
   */
  async getHistory(address, fromEpoch, toEpoch) {
    const params = {};
    if (fromEpoch !== void 0) params.from_epoch = fromEpoch;
    if (toEpoch !== void 0) params.to_epoch = toEpoch;
    return this.client.get(
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
  async getWithdrawals(address, limit, offset) {
    const params = {};
    if (limit !== void 0) params.limit = limit;
    if (offset !== void 0) params.offset = offset;
    return this.client.get(
      `/eth/v1/validators/${address}/withdrawals`,
      params
    );
  }
  /**
   * Get validator metrics
   * GET /eth/v1/validators/:address/metrics
   */
  async getMetrics(address) {
    return this.client.get(`/eth/v1/validators/${address}/metrics`);
  }
  /**
   * Get validator slashing events
   * GET /eth/v1/validators/:address/slashing
   */
  async getSlashing(address) {
    return this.client.get(`/eth/v1/validators/${address}/slashing`);
  }
  /**
   * Get validator APR
   * GET /eth/v1/validators/:address/apr
   */
  async getAPR(address) {
    return this.client.get(`/eth/v1/validators/${address}/apr`);
  }
};

// src/delegators.ts
var DelegatorsAPI = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Get all delegators
   * GET /eth/v1/delegators
   */
  async getAll() {
    return this.client.get("/eth/v1/delegators");
  }
  /**
   * Get delegator details
   * GET /eth/v1/delegators/:address
   */
  async get(address) {
    return this.client.get(`/eth/v1/delegators/${address}`);
  }
  /**
   * Get delegator stakes breakdown per validator
   * GET /eth/v1/delegators/:address/stakes
   */
  async getStakes(address) {
    return this.client.get(`/eth/v1/delegators/${address}/stakes`);
  }
  /**
   * Get delegator rewards history
   * GET /eth/v1/delegators/:address/rewards
   * @param address - Delegator address
   * @param limit - Optional limit
   * @param offset - Optional offset
   */
  async getRewards(address, limit, offset) {
    const params = {};
    if (limit !== void 0) params.limit = limit;
    if (offset !== void 0) params.offset = offset;
    return this.client.get(
      `/eth/v1/delegators/${address}/rewards`,
      params
    );
  }
  /**
   * Get delegator withdrawals history
   * GET /eth/v1/delegators/:address/withdrawals
   * @param address - Delegator address
   * @param limit - Optional limit
   * @param offset - Optional offset
   */
  async getWithdrawals(address, limit, offset) {
    const params = {};
    if (limit !== void 0) params.limit = limit;
    if (offset !== void 0) params.offset = offset;
    return this.client.get(
      `/eth/v1/delegators/${address}/withdrawals`,
      params
    );
  }
  /**
   * Get delegator unbonding status
   * GET /eth/v1/delegators/:address/unbonding
   */
  async getUnbonding(address) {
    return this.client.get(`/eth/v1/delegators/${address}/unbonding`);
  }
  /**
   * Get delegator active validators
   * GET /eth/v1/delegators/:address/validators
   */
  async getValidators(address) {
    return this.client.get(`/eth/v1/delegators/${address}/validators`);
  }
};

// src/referrals.ts
var ReferralsAPI = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Validate a referral code
   * GET /eth/v1/referrals/validate?code=CODE
   */
  async validate(referralCode) {
    return this.client.get("/eth/v1/referrals/validate", {
      code: referralCode
    });
  }
  /**
   * Create a new referral code
   * POST /eth/v1/referrals
   * @param request - Referral creation request
   */
  async create(request) {
    return this.client.post("/eth/v1/referrals", request);
  }
  /**
   * Apply a referral code
   * POST /eth/v1/referrals/apply
   * @param request - Referral application request
   */
  async apply(request) {
    return this.client.post("/eth/v1/referrals/apply", request);
  }
  /**
   * Delete a referral code
   * DELETE /eth/v1/referrals/:referral_code
   * @param referralCode - The referral code to delete
   */
  async delete(referralCode) {
    return this.client.delete(`/eth/v1/referrals/${referralCode}`);
  }
  /**
   * Unlink a delegator from referral
   * DELETE /eth/v1/referrals/unlink/:delegator_address
   * @param delegatorAddress - The delegator address to unlink
   */
  async unlink(delegatorAddress) {
    return this.client.delete(`/eth/v1/referrals/unlink/${delegatorAddress}`);
  }
  /**
   * Get delegator referral information
   * GET /eth/v1/referrals/delegators/:delegator_address
   */
  async getDelegatorReferral(delegatorAddress) {
    return this.client.get(
      `/eth/v1/referrals/delegators/${delegatorAddress}`
    );
  }
  /**
   * Get validator referral information
   * GET /eth/v1/referrals/validators/:validator_address
   */
  async getValidatorReferral(validatorAddress) {
    return this.client.get(
      `/eth/v1/referrals/validators/${validatorAddress}`
    );
  }
};

// src/global.ts
var GlobalAPI = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Get global network statistics
   * GET /eth/v1/global
   */
  async getStats() {
    return this.client.get("/eth/v1/global");
  }
  /**
   * Get network APR (from /global endpoint)
   * GET /eth/v1/global/network_apr
   */
  async getNetworkAPRFromGlobal() {
    return this.client.get("/eth/v1/global/network_apr");
  }
  /**
   * Get network APR (from /network endpoint)
   * GET /eth/v1/network/apr
   */
  async getNetworkAPR() {
    return this.client.get("/eth/v1/network/apr");
  }
  /**
   * Get network APR breakdown
   * GET /eth/v1/network/apr/breakdown
   */
  async getNetworkAPRBreakdown() {
    return this.client.get("/eth/v1/network/apr/breakdown");
  }
  /**
   * Get delegator leaderboard
   * GET /eth/v1/leaderboard/delegators
   * @param limit - Optional limit (default backend value)
   * @param offset - Optional offset for pagination
   */
  async getLeaderboardDelegators(limit, offset) {
    const params = {};
    if (limit !== void 0) params.limit = limit;
    if (offset !== void 0) params.offset = offset;
    return this.client.get(
      "/eth/v1/leaderboard/delegators",
      params
    );
  }
  /**
   * Get validator leaderboard
   * GET /eth/v1/leaderboard/validators
   * @param limit - Optional limit (default backend value)
   * @param offset - Optional offset for pagination
   */
  async getLeaderboardValidators(limit, offset) {
    const params = {};
    if (limit !== void 0) params.limit = limit;
    if (offset !== void 0) params.offset = offset;
    return this.client.get(
      "/eth/v1/leaderboard/validators",
      params
    );
  }
};

// src/slashing.ts
var SlashingAPI = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Get slashing events
   * GET /eth/v1/slashing/events
   * @param validatorAddress - Optional validator address filter
   * @param limit - Optional limit
   * @param offset - Optional offset
   */
  async getEvents(validatorAddress, limit, offset) {
    const params = {};
    if (validatorAddress) params.validator_address = validatorAddress;
    if (limit !== void 0) params.limit = limit;
    if (offset !== void 0) params.offset = offset;
    return this.client.get("/eth/v1/slashing/events", params);
  }
};

// src/index.ts
var ResonanceSDK = class {
  constructor(config) {
    this.client = new HTTPClient(config);
    this.auth = new AuthService(config.apiUrl);
    this.validators = new ValidatorsAPI(this.client);
    this.delegators = new DelegatorsAPI(this.client);
    this.referrals = new ReferralsAPI(this.client);
    this.global = new GlobalAPI(this.client);
    this.slashing = new SlashingAPI(this.client);
  }
  /**
   * Set authentication token for API requests
   * @param token - JWT token
   */
  setAuthToken(token) {
    this.client.setAuthToken(token);
  }
  /**
   * Set custom header for API requests
   * @param key - Header key
   * @param value - Header value
   */
  setHeader(key, value) {
    this.client.setHeader(key, value);
  }
  /**
   * Get the current auth token from storage
   */
  getAuthToken() {
    return this.auth.getToken();
  }
  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.auth.isAuthenticated();
  }
  /**
   * Logout user and clear auth token
   */
  logout() {
    this.auth.logout();
    this.client.setAuthToken(null);
  }
};
var index_default = ResonanceSDK;
export {
  AuthService,
  DelegatorsAPI,
  GlobalAPI,
  HTTPClient,
  ReferralsAPI,
  ResonanceSDK,
  SlashingAPI,
  ValidatorsAPI,
  index_default as default
};
