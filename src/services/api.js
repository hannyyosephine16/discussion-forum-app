const API_BASE_URL = 'https://forum-api.dicoding.dev/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    // OPTIMASI: Simple in-memory cache untuk data yang jarang berubah
    this.cache = new Map();
    this.cacheExpiry = new Map();
    
    // OPTIMASI: Request debouncing untuk prevent spam requests
    this.requestQueue = new Map();
  }

  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  removeAuthToken() {
    localStorage.removeItem('authToken');
    // Clear cache when logging out
    this.clearCache();
  }

  // OPTIMASI: Cache management
  setCacheData(key, data, ttl = 5 * 60 * 1000) { // 5 minutes default TTL
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + ttl);
  }

  getCacheData(key) {
    const expiry = this.cacheExpiry.get(key);
    if (expiry && Date.now() > expiry) {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  clearCache() {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  // OPTIMASI: Request deduplication
  async deduplicateRequest(key, requestFn) {
    if (this.requestQueue.has(key)) {
      return this.requestQueue.get(key);
    }

    const promise = requestFn().finally(() => {
      this.requestQueue.delete(key);
    });

    this.requestQueue.set(key, promise);
    return promise;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      console.log('API Request:', { url, method: config.method || 'GET' });
      const startTime = performance.now();
      
      const response = await fetch(url, config);
      const data = await response.json();
      
      const endTime = performance.now();
      console.log(`API Response (${Math.round(endTime - startTime)}ms):`, { 
        status: response.status, 
        dataSize: JSON.stringify(data).length 
      });

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(error.message || 'Network error');
    }
  }

  // Auth endpoints
  async register({ name, email, password }) {
    const response = await this.request('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    return response;
  }

  async login({ email, password }) {
    const response = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response;
  }

  // OPTIMASI: Users endpoints with caching
  async getAllUsers() {
    const cacheKey = 'users_all';
    const cached = this.getCacheData(cacheKey);
    
    if (cached) {
      console.log('Using cached users data');
      return cached;
    }

    return this.deduplicateRequest(cacheKey, async () => {
      const response = await this.request('/users');
      this.setCacheData(cacheKey, response, 10 * 60 * 1000); // 10 minutes cache
      return response;
    });
  }

  async getOwnProfile() {
    // Profile data shouldn't be cached as it might change
    const response = await this.request('/users/me');
    return response;
  }

  // OPTIMASI: Threads endpoints with caching
  async getAllThreads() {
    const cacheKey = 'threads_all';
    const cached = this.getCacheData(cacheKey);
    
    if (cached) {
      console.log('Using cached threads data');
      return cached;
    }

    return this.deduplicateRequest(cacheKey, async () => {
      const response = await this.request('/threads');
      this.setCacheData(cacheKey, response, 2 * 60 * 1000); // 2 minutes cache for threads
      return response;
    });
  }

  async getThreadDetail(threadId) {
    const cacheKey = `thread_${threadId}`;
    const cached = this.getCacheData(cacheKey);
    
    if (cached) {
      console.log(`Using cached thread detail for ${threadId}`);
      return cached;
    }

    return this.deduplicateRequest(cacheKey, async () => {
      const response = await this.request(`/threads/${threadId}`);
      this.setCacheData(cacheKey, response, 1 * 60 * 1000); // 1 minute cache for thread details
      return response;
    });
  }

  async createThread({ title, body, category }) {
    const requestBody = { title, body };
    if (category && category.trim()) {
      requestBody.category = category;
    }
    
    const response = await this.request('/threads', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    // OPTIMASI: Invalidate threads cache after creating new thread
    this.cache.delete('threads_all');
    this.cacheExpiry.delete('threads_all');
    
    return response;
  }

  // Comments endpoints
  async createComment(threadId, content) {
    const response = await this.request(`/threads/${threadId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });

    // OPTIMASI: Invalidate thread detail cache after adding comment
    this.cache.delete(`thread_${threadId}`);
    this.cacheExpiry.delete(`thread_${threadId}`);
    
    return response;
  }

  // Vote endpoints - These don't need caching as they're real-time
  async upVoteThread(threadId) {
    const response = await this.request(`/threads/${threadId}/up-vote`, {
      method: 'POST',
    });
    
    // Invalidate relevant caches
    this.cache.delete('threads_all');
    this.cache.delete(`thread_${threadId}`);
    
    return response;
  }

  async downVoteThread(threadId) {
    const response = await this.request(`/threads/${threadId}/down-vote`, {
      method: 'POST',
    });
    
    // Invalidate relevant caches
    this.cache.delete('threads_all');
    this.cache.delete(`thread_${threadId}`);
    
    return response;
  }

  async neutralVoteThread(threadId) {
    const response = await this.request(`/threads/${threadId}/neutral-vote`, {
      method: 'POST',
    });
    
    // Invalidate relevant caches
    this.cache.delete('threads_all');
    this.cache.delete(`thread_${threadId}`);
    
    return response;
  }

  async upVoteComment(threadId, commentId) {
    const response = await this.request(`/threads/${threadId}/comments/${commentId}/up-vote`, {
      method: 'POST',
    });
    
    this.cache.delete(`thread_${threadId}`);
    return response;
  }

  async downVoteComment(threadId, commentId) {
    const response = await this.request(`/threads/${threadId}/comments/${commentId}/down-vote`, {
      method: 'POST',
    });
    
    this.cache.delete(`thread_${threadId}`);
    return response;
  }

  async neutralVoteComment(threadId, commentId) {
    const response = await this.request(`/threads/${threadId}/comments/${commentId}/neutral-vote`, {
      method: 'POST',
    });
    
    this.cache.delete(`thread_${threadId}`);
    return response;
  }

  // OPTIMASI: Leaderboard with caching
  async getLeaderboards() {
    const cacheKey = 'leaderboards';
    const cached = this.getCacheData(cacheKey);
    
    if (cached) {
      console.log('Using cached leaderboard data');
      return cached;
    }

    return this.deduplicateRequest(cacheKey, async () => {
      const response = await this.request('/leaderboards');
      this.setCacheData(cacheKey, response, 5 * 60 * 1000); // 5 minutes cache
      return response;
    });
  }

  // OPTIMASI: Manual cache refresh methods
  async refreshThreads() {
    this.cache.delete('threads_all');
    this.cacheExpiry.delete('threads_all');
    return this.getAllThreads();
  }

  async refreshUsers() {
    this.cache.delete('users_all');
    this.cacheExpiry.delete('users_all');
    return this.getAllUsers();
  }
}

const apiService = new ApiService();
export default apiService;