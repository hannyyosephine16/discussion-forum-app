const API_BASE_URL = 'https://forum-api.dicoding.dev/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  removeAuthToken() {
    localStorage.removeItem('authToken');
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
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error');
    }
  }

  // Auth endpoints
  async register({ name, email, password }) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async login({ email, password }) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Users endpoints
  async getAllUsers() {
    return this.request('/users');
  }

  async getOwnProfile() {
    return this.request('/users/me');
  }

  // Threads endpoints
  async getAllThreads() {
    return this.request('/threads');
  }

  async getThreadDetail(threadId) {
    return this.request(`/threads/${threadId}`);
  }

  async createThread({ title, body, category }) {
    return this.request('/threads', {
      method: 'POST',
      body: JSON.stringify({ title, body, category }),
    });
  }

  // Comments endpoints
  async createComment(threadId, content) {
    return this.request(`/threads/${threadId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Votes endpoints
  async upVoteThread(threadId) {
    return this.request(`/threads/${threadId}/up-vote`, {
      method: 'POST',
    });
  }

  async downVoteThread(threadId) {
    return this.request(`/threads/${threadId}/down-vote`, {
      method: 'POST',
    });
  }

  async neutralVoteThread(threadId) {
    return this.request(`/threads/${threadId}/neutral-vote`, {
      method: 'POST',
    });
  }

  async upVoteComment(threadId, commentId) {
    return this.request(`/threads/${threadId}/comments/${commentId}/up-vote`, {
      method: 'POST',
    });
  }

  async downVoteComment(threadId, commentId) {
    return this.request(`/threads/${threadId}/comments/${commentId}/down-vote`, {
      method: 'POST',
    });
  }

  async neutralVoteComment(threadId, commentId) {
    return this.request(`/threads/${threadId}/comments/${commentId}/neutral-vote`, {
      method: 'POST',
    });
  }

  // Leaderboard endpoints
  async getLeaderboards() {
    return this.request('/leaderboards');
  }
}

const apiService = new ApiService();
export default apiService;