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
      console.log('API Request:', { url, config }); // Debug log
      const response = await fetch(url, config);
      const data = await response.json();
      
      console.log('API Response:', { status: response.status, data }); // Debug log

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error); // Debug log
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

  // Users endpoints
  async getAllUsers() {
    const response = await this.request('/users');
    return response;
  }

  async getOwnProfile() {
    const response = await this.request('/users/me');
    return response;
  }

  // Threads endpoints
  async getAllThreads() {
    const response = await this.request('/threads');
    return response;
  }

  async getThreadDetail(threadId) {
    const response = await this.request(`/threads/${threadId}`);
    return response;
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
    return response;
  }

  // Comments endpoints
  async createComment(threadId, content) {
    const response = await this.request(`/threads/${threadId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return response;
  }

  // Votes endpoints - Threads
  async upVoteThread(threadId) {
    const response = await this.request(`/threads/${threadId}/up-vote`, {
      method: 'POST',
    });
    return response;
  }

  async downVoteThread(threadId) {
    const response = await this.request(`/threads/${threadId}/down-vote`, {
      method: 'POST',
    });
  }

  async neutralVoteThread(threadId) {
    const response = await this.request(`/threads/${threadId}/neutral-vote`, {
      method: 'POST',
    });
    return response;
  }

  // Votes endpoints - Comments
  async upVoteComment(threadId, commentId) {
    const response = await this.request(`/threads/${threadId}/comments/${commentId}/up-vote`, {
      method: 'POST',
    });
    return response;
  }

  async downVoteComment(threadId, commentId) {
    const response = await this.request(`/threads/${threadId}/comments/${commentId}/down-vote`, {
      method: 'POST',
    });
    return response;
  }

  async neutralVoteComment(threadId, commentId) {
    const response = await this.request(`/threads/${threadId}/comments/${commentId}/neutral-vote`, {
      method: 'POST',
    });
    return response;
  }

  // Leaderboard endpoints
  async getLeaderboards() {
    const response = await this.request('/leaderboards');
    return response;
  }
}

const apiService = new ApiService();
export default apiService;